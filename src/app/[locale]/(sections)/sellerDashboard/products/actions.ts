'use server'

import { db } from "@/db";
import { storage } from "@/firebase/firebaseConfig";
import { deleteObject, ref } from "firebase/storage";

interface UpdateProductArgs {
  productId: string;
  newTitle: string;
  selectedCollection : string


  }


export const updateProduct = async ({ productId, newTitle , selectedCollection }: UpdateProductArgs) => {
    try {
      let collection = await db.collection.findUnique({
        where: { name: selectedCollection },
      });

      if(collection) {
        const updatedProduct = await db.product.update({
          where: { id: productId },
          data: {
              title: newTitle,
              collectionName : selectedCollection,
              collectionId: collection.id,
            },
        });
        return updatedProduct;
      }


    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update design in product');
    }
  };


  
  // Function to delete files from Firebase Storage
  export const deleteFiles = async (filePaths: string[]) => {
    for (const filePath of filePaths) {
      try {
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef);
        console.log(`Deleted: ${filePath}`);
      } catch (error) {
        console.error(`Failed to delete ${filePath}:`, error);
      }
    }
  };
  
  // Function to delete a product
  export const deleteProduct = async (productId: string) => {
    try {
      // Start a transaction to ensure atomicity
      const result = await db.$transaction(async (transaction) => {
        // Fetch the product to get file paths
        const product = await transaction.product.findUnique({
          where: { id: productId },
          select: { croppedFrontProduct: true, croppedBackProduct: true },
        });
  
        if (!product) {
          throw new Error("Product not found");
        }
  
        // Check if the product has any order items
        const orderItemCount = await transaction.orderItem.count({
          where: { productId },
        });
  
        if (orderItemCount > 0) {
          // Product has order items, do not delete
          return false;
        }
  
        // Delete the product
        await transaction.product.delete({
          where: { id: productId },
        });
  
        // Return file paths to delete after the transaction
        return [...product.croppedFrontProduct, ...product.croppedBackProduct];
      },{
        maxWait: 10000, // Wait for a connection for up to 10 seconds
        timeout: 20000, // Allow the transaction to run for up to 20 seconds
      });
  
      // If result is false, it means the product was not deleted
      if (!result) {
        return false;
      }
  
      // Delete files from Firebase Storage
      await deleteFiles(result);
  
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product");
    }
  };
  
