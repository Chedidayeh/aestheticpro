'use server'

import { db } from "@/db";

// Function to get user's favorite list of products
export async function getUserFavoriteList(userId: string) {
    try {
      // Find the user's favorite list including products
      const favList = await db.favList.findUnique({
        where: {
          userId: userId,
        },
        include: {
          products: {
            include : {
              store : true
            },
            where : { disableCategory : false, isProductAccepted : true , privateProduct : false}
          },
        },
      });
  
      if (!favList || !favList.products) {
        // If the favorite list doesn't exist or it has no products, return an empty array or null as per your preference
        return []; // or return []
      }
  
      // Return the favorite list with products
      return favList.products;
    } catch (error) {
      console.error("Error fetching user's favorite list:", error);
      throw error; // Propagate the error for handling elsewhere
    }
  }