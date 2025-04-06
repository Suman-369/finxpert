

import { currentUser } from "@clerk/nextjs/server"; // Updated import path
import { db } from "./prisma";

export const checkUser = async()=>{
    const user = await currentUser()

     if(!user){
        return null;
     }

     try{
        const loggedInUser = await db.user.findUnique({

            where:{
                clerkUserId:user.id,
            },

        });

        if(loggedInUser){
            return loggedInUser;
        }

        const name = `${user.firstName} ${user.lastName}`;

        const newUser = await db.user.create({
            data:{
                clerkUserId : user.id,
                name,
                imageUrl :user.imageUrl,
                email:user.emailAddresses[0].emailAddress,

            },
        })
        return newUser;

     }catch(error){
        throw new Error(`Check User Error: ${error.message}`);

        
     }
     
    }
