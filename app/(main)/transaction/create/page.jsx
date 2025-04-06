// import { getUserAccount } from "@/actions/dashboard";
// import { defaultCategories } from "@/data/categories";
// import { AddTransactionForm } from "../_components/transaction-form";
// import { getTransaction } from "@/actions/transaction";

// /**
//  * @typedef {Object} PageProps
//  * @property {Object} searchParams
//  * @property {string} [searchParams.edit]
//  */

// /**
//  * @param {PageProps} props
//  */
// export default async function AddTransactionPage({ searchParams }) {
//   const accounts = await getUserAccount();
//   const editId = searchParams?.edit;

//   let initialData = null;
//   if (editId) {
//     const transaction = await getTransaction(editId);
//     initialData = transaction;
//   }

//   return (
//     <div className="max-w-3xl mx-auto px-5">
//       <div className="flex justify-center md:justify-normal mb-8">
//       <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] transform perspective-1000 rotate-x-12">
//               Add Transaction
//             </h1>      </div>
//       <AddTransactionForm
//         accounts={accounts}
//         categories={defaultCategories}
//         editMode={!!editId}
//         initialData={initialData}
//       />
//     </div>
//   );
// }



import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";
import { getUserAccount } from "@/actions/dashboard";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccount();
  const editId = searchParams?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg transform perspective-1000 rotate-x-12 text-center" style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)" }}>
          {editId ? "Edit" : "Add"} Transaction
        </h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
}