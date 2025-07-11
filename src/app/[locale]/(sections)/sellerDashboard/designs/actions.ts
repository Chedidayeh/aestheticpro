'use server'

import { db } from "@/db";
import { deleteFiles } from "../products/actions";

interface UpdateDesignArgs {
    designId: string;
    newName: string;
    newPrice:number
  }

export const updateDesign = async ({ designId, newName,newPrice }: UpdateDesignArgs) => {
    try {
      const updatedDesign = await db.sellerDesign.update({
        where: { id: designId },
        data: {
            name: newName,
            price: newPrice,
            sellerProfit: newPrice-2,
        },
      });
      return updatedDesign;
    } catch (error) {
      console.error('Error updating design:', error);
      throw new Error('Failed to update design in database');
    }
  };

  export const deleteDesignn = async (designId: string) => {
    try {
      // Start a transaction to ensure atomicity
      const result = await db.$transaction(async (transaction) => {
        // Check if the design has any order items as front or back design
        const frontOrderItemCount = await transaction.orderItem.count({
          where: { frontsellerDesignId: designId },
        });
  
        const backOrderItemCount = await transaction.orderItem.count({
          where: { backsellerDesignId: designId },
        });
  
        // If the design has order items, do not delete
        if (frontOrderItemCount > 0 || backOrderItemCount > 0) {
          return false;
        }
  
        // Delete the seller design
        await transaction.sellerDesign.delete({
          where: { id: designId },
        });
  
        return true;
      },{
        maxWait: 10000, // Wait for a connection for up to 10 seconds
        timeout: 20000, // Allow the transaction to run for up to 20 seconds
      });
  
      if (!result) {
        return false;
      }
  
      return true
    } catch (error) {
      console.error('Error deleting design:', error);
      throw new Error('Failed to delete design from the database');
    }
  };

  // Function to delete a design
export const deleteDesign = async (designId: string) => {
  try {
    // Start a transaction to ensure atomicity
    const result = await db.$transaction(async (transaction) => {
      // Retrieve the design and its image URL
      const design = await transaction.sellerDesign.findUnique({
        where: { id: designId },
        select: { imageUrl: true }, // Get the imageUrl of the design
      });

      if (!design) {
        throw new Error("Design not found");
      }

      // Check if the design has any order items as front or back design
      const frontOrderItemCount = await transaction.orderItem.count({
        where: { frontsellerDesignId: designId },
      });

      const backOrderItemCount = await transaction.orderItem.count({
        where: { backsellerDesignId: designId },
      });

      // If the design has order items, do not delete
      if (frontOrderItemCount > 0 || backOrderItemCount > 0) {
        return false;
      }

      // Delete the seller design from the database
      await transaction.sellerDesign.delete({
        where: { id: designId },
      });

      // Return the image URL(s) to delete from Firebase
      return design.imageUrl ? [design.imageUrl] : [];
    });

    if (!result) {
      return false;
    }

    // Delete files from Firebase Storage
    await deleteFiles(result);

    return true;
  } catch (error) {
    console.error("Error deleting design:", error);
    throw new Error("Failed to delete design from the database");
  }
};



  


