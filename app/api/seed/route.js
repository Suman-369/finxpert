import { seedTransactions } from "@/actions/seed";
export const runtime = 'nodejs';



export async function GET(){
    const result = await seedTransactions()
    return Response.json(result)
}