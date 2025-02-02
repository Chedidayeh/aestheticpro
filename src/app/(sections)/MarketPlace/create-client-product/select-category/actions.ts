'use server'

import { db } from "@/db"

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