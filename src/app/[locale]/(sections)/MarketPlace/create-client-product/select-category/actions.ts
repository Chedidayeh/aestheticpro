'use server'

import { db } from "@/db"
import { PreOrderDraft } from "@prisma/client"

// get the categories
export async function getAllCategories() {
    try {
      const categories = await db.category.findMany({
        include: {
          colors: true,
          sizes: true,
          frontBorders: true,
          backBorders: true,
          
        },
      })
      return categories
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }

  // get user preOrder
  export async function getUserPreOrders(userId: string): Promise<PreOrderDraft[]> {
    try {

        const preOrders = await db.preOrderDraft.findMany({
            where: {
              userId: userId,
            },
          });
      
      return preOrders;
    } catch (error) {
      console.error('Error fetching user preorders:', error);
      throw new Error('Failed to fetch user preorders');
    }
  }