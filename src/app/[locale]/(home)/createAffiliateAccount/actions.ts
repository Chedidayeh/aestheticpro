'use server'

import { db } from "@/db";
import { User } from "@prisma/client"



export const createAccount = async (user: User , phoneNumber : string) => {
  try {
    // Using a transaction to ensure atomic operations
    const result = await db.$transaction(async (prisma) => {
      // Step 1: Update the user's isAffiliate field to true
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { isAffiliate: true },
      });

      // Step 2: Create a new instance of the Affiliate model
      const newAffiliate = await prisma.affiliate.create({
        data: {
          userId: user.id,
          phoneNumber: phoneNumber,
          // Add any other fields you want to initialize for the affiliate
        },
      });

      if(user.userType === "SELLER"){
        // delete user store
       await prisma.store.delete({
          where: {
            userId: user.id
            }
            });
         // set usertype to user :
        await prisma.user.update({
         where: { id: user.id },
         data: { userType: "USER" },
         });
      }

      // Step 3: Return the new affiliate instance or confirmation message
      return updatedUser;
    },{
      maxWait: 10000, // Wait for a connection for up to 10 seconds
      timeout: 20000, // Allow the transaction to run for up to 20 seconds
    });

    // Transaction successful, return true or the result
    return result;

  } catch (error) {
    console.error('Error creating affiliate account:', error);
    throw error; // Rethrow the error to handle it outside
  }
};
