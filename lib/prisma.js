import { PrismaClient } from "@prisma/client";



export const db = globalThis.prisma || new PrismaClient()

if(process.env.NODE_ENV !== "production"){
    globalThis.prisma = db ;

}


// .....This globalThis.prisma variable ensure that the  prisma client instance is 
// reduce across hot relods during devlopment . whith out this each time your application 

//  reloads , a new instants of the prisma client would be created , potentially leading 

// to cunnection issue ..................................................................