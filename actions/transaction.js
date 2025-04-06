"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { request } from "@arcjet/next";
// import aj from "@/lib/arcjet";


const genAI = new GoogleGenerativeAI(process.env. GEMINI_API_KEY)

const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

// Create Transaction


export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}

export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    //arcjet

    // const req = await request();

    // const decision = await aj.protect(req,{
    //   userId,
    //   requested:1,
    // })
    // if (decision.isDenied()) {
    //   if (decision.reason.isRateLimit()) {
    //     const { remaining, reset } = decision.reason;
    //     console.error({
    //       code: "RATE_LIMIT_EXCEEDED",
    //       details: {
    //         remaining,
    //         resetInSeconds: reset,
    //       },
    //     });

    //     throw new Error("Too many requests. Please try again later.");
    //   }

    //   throw new Error("Request blocked");
    // }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // For new transactions, we just need to add the amount to the account
    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;

    // Create transaction and update account balance in a transaction
    const transaction = await db.$transaction(async (tx) => {
      const created = await tx.transaction.create({
        data: {
          userId: user.id,
          ...data,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      // Update account balance
      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      });

      return created;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}


export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Get original transaction to calculate balance change
    const originalTransaction = await db.transaction.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        account: true,
      },
    });

    if (!originalTransaction) throw new Error("Transaction not found");

    // Calculate balance changes
    const oldBalanceChange =
      originalTransaction.type === "EXPENSE"
        ? -originalTransaction.amount.toNumber()
        : originalTransaction.amount.toNumber();

    const newBalanceChange =
      data.type === "EXPENSE" ? -data.amount : data.amount;

    const netBalanceChange = newBalanceChange - oldBalanceChange;

    // Update transaction and account balance in a transaction
    const transaction = await db.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          ...data,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      // Update account balance
      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: netBalanceChange,
          },
        },
      });

      return updated;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}
// Get User Transactions

// Scan Receipt


// Helper function to calculate next recurring date
function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}



// export async function scanReceipt(file){
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Convert File to ArrayBuffer
//     const arrayBuffer = await file.arrayBuffer();
//     // Convert ArrayBuffer to Base64
//     const base64String = Buffer.from(arrayBuffer).toString("base64");

//     const prompt = `
//       Analyze this receipt image and extract the following information in JSON format:
//       - Total amount (just the number)
//       - Date (in ISO format)
//       - Description or items purchased (brief summary)
//       - Merchant/store name
//       - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
//       Only respond with valid JSON in this exact format:
//       {
//         "amount": number,
//         "date": "ISO date string",
//         "description": "string",
//         "merchantName": "string",
//         "category": "string"
//       }

//       If its not a recipt, return an empty object
//     `;

//     const result = await model.generateContent([
//       {
//         inlineData: {
//           data: base64String,
//           mimeType: file.type,
//         },
//       },
//       prompt,
//     ]);

//     const response = await result.response;
//     const text = response.text();
//     const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

//     try {
//       const data = JSON.parse(cleanedText);
//       return {
//         amount: parseFloat(data.amount),
//         date: new Date(data.date),
//         description: data.description,
//         category: data.category,
//         merchantName: data.merchantName,
//       };
//     } catch (parseError) {
//       console.error("Error parsing JSON response:", parseError);
//       throw new Error("Invalid response format from Gemini");
//     }
//   } catch (error) {
//     console.error("Error scanning receipt:", error);
//     throw new Error("Failed to scan receipt");
//   }
// }

export async function scanReceipt(file) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert file to base64 (browser-safe)
    const arrayBuffer = await file.arrayBuffer();
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    const prompt = `
You are given an image of a receipt. Your task is to extract the following details and return them in EXACTLY the following JSON format:

{
  "amount": number,
  "date": "YYYY-MM-DD",
  "description": "string",
  "merchantName": "string",
  "category": "string"
}

Where:
- "amount" is the total amount on the receipt as a number (no currency symbols).
- "date" is the transaction date in ISO format (e.g., "2025-04-05").
- "description" is a brief summary of purchased items or services.
- "merchantName" is the name of the store or business.
- "category" is ONE of these values only:
  housing, transportation, groceries, utilities, entertainment, food, shopping, healthcare, education, personal, travel, insurance, gifts, bills, other-expense

⚠️ IMPORTANT: Only respond with VALID JSON. No markdown, no extra commentary, no explanation.

If the uploaded image is not a valid receipt, respond with:
{}
`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = await response.text();

    // Remove possible markdown wrappers (```json)
    const cleanedText = text
      .replace(/```(?:json)?/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const data = JSON.parse(cleanedText);

      if (
        typeof data !== "object" ||
        data === null ||
        Array.isArray(data) ||
        Object.keys(data).length === 0
      ) {
        return {}; // not a receipt or empty response
      }

      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        merchantName: data.merchantName,
        category: data.category,
      };
    } catch (err) {
      console.error("❌ JSON Parse Error:", err);
      console.warn("Response from Gemini:\n", cleanedText);
      throw new Error("Gemini response is not valid JSON.");
    }
  } catch (error) {
    console.error("❌ scanReceipt failed:", error);
    throw new Error("Failed to scan the receipt.");
  }
}



export async function GetTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}


export async function UpdateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Get original transaction to calculate balance change
    const originalTransaction = await db.transaction.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        account: true,
      },
    });

    if (!originalTransaction) throw new Error("Transaction not found");

    // Calculate balance changes
    const oldBalanceChange =
      originalTransaction.type === "EXPENSE"
        ? -originalTransaction.amount.toNumber()
        : originalTransaction.amount.toNumber();

    const newBalanceChange =
      data.type === "EXPENSE" ? -data.amount : data.amount;

    const netBalanceChange = newBalanceChange - oldBalanceChange;

    // Update transaction and account balance in a transaction
    const transaction = await db.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          ...data,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      // Update account balance
      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: netBalanceChange,
          },
        },
      });

      return updated;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}