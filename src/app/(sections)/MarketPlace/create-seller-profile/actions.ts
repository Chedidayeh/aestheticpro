'use server'

import { getUser } from "@/actions/actions"
import { db } from "@/db"
import { revalidatePath } from "next/cache"


export const fetchName = async (name: string) => {
    try {
      const seller = await db.store.findFirst({
        where: {
          storeName: name
        }
      })
    if (seller) return false      
  
      return true
    } catch (error) {
      console.error('Error fetching store by name:', error)
      throw error
    }
  }


  export const addStore = async (storeName: string, logoPath: string, phoneNumber: string) => {
    const user = await getUser();
    if (!user) {
      throw new Error("User not found");
    }
  
    try {
      const result = await db.$transaction(async (transaction) => {
        const store = await transaction.store.create({
          data: {
            userId: user.id,
            storeName: storeName,
            logoUrl: logoPath,
            userPhoneNumber: phoneNumber,
          },
        });
  
        const updatedUser = await transaction.user.update({
          where: { id: store.userId },
          data: {
            userType: "SELLER",
            phoneNumber,
          },
        });
  
        if (updatedUser.isAffiliate) {
          await transaction.affiliate.delete({
            where: {
              userId: user.id,
            },
          });
  
          await transaction.user.update({
            where: { id: user.id },
            data: {
              isAffiliate: false,
            },
          });
        }
        

        // revalidatePath("/MarketPlace/create-seller-profile")
  
        return updatedUser;
      },{
        maxWait: 10000, // Wait for a connection for up to 10 seconds
        timeout: 20000, // Allow the transaction to run for up to 20 seconds
      });
  
      return result;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw new Error("Failed to add store");
    }
  };
  

