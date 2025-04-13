'use server'

import { db } from "@/db";
import { Category } from "@prisma/client";

export async function getAllCategoriesWithDetails() {
    try {
      const categories = await db.category.findMany({
        include: {
          colors: true,
          sizes: true,
        },
      });
      return categories;
    } catch (error) {
      console.error("Error fetching categories with details:", error);
      throw error;
    }
  }



  export async function changePrice(catId: string,newPrice:number) {

    try {

      return await db.$transaction(async (prisma) => {
        // Step 1: Find the category by its id
        const category = await prisma.category.findUnique({
          where: { id: catId },
        });
    
        if (!category) {
          throw new Error(`Category with id ${catId} not found`);
        }
    
        // Step 2: Update the category's price
        await prisma.category.update({
          where: { id: catId },
          data: { price: newPrice },
        });
    
        // Step 3: Fetch all products that have the same category label as the found category
        const products = await prisma.product.findMany({
          where: { category: category.label },
        });
    
        // Step 4: Update the price of each product using the given formula
        const updatePromises = products.map((product) =>
          prisma.product.update({
            where: { id: product.id },
            data: {
              price: product.price - product.basePrice + newPrice,
              basePrice : newPrice
            },
          })
        );
    
        // Step 5: Execute all product updates within the transaction
        await Promise.all(updatePromises);
      },{
        maxWait: 10000, // Wait for a connection for up to 10 seconds
        timeout: 20000, // Allow the transaction to run for up to 20 seconds
      });
    }
      
    catch (error) {
      console.error(error)
      
    }
    
  }


  export async function deleteCategoryAndAssociated(categoryId: string) {
    try {
      await db.$transaction(async (prisma) => {
        // Fetch the category
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });
  
        // Delete products associated with the category
        await prisma.product.deleteMany({
          where: {
            category: category!.label,
          },
        });
  
        // Delete cart products associated with the products
        await prisma.cartProduct.deleteMany({
          where: {
            productId: {
              in: await prisma.product.findMany({
                where: {
                  category: category!.id,
                },
                select: {
                  id: true,
                },
              }).then(products => products.map(product => product.id)),
            },
          },
        });
  
        // Delete order items associated with the products
        await prisma.orderItem.deleteMany({
          where: {
            productId: {
              in: await prisma.product.findMany({
                where: {
                  category: category!.label,
                },
                select: {
                  id: true,
                },
              }).then(products => products.map(product => product.id)),
            },
          },
        });
  
        // Delete pre-order previews associated with the products
        await prisma.preOrderDraft.deleteMany({
          where: {
            productCategory: category!.label,
          },
        });
  
        // Delete the category itself
         await prisma.category.delete({
          where: {
            id: categoryId,
          },
        });
  
      },
      {
        maxWait: 10000, // Wait for a connection for up to 10 seconds
        timeout: 20000, // Allow the transaction to run for up to 20 seconds
      });
      return true
    } catch (error) {
      console.error('Error deleting category and associated items:', error);
      return false
    }
  }


  
  export async function apply(catId: string, discountPercentage: number) {
    try {
      // Fetch products and category label first (outside the transaction)
      const category = await db.category.findUnique({
        where: { id: catId },
        select: { label: true },
      });
  
      if (!category) throw new Error("Category not found");
  
      const products = await db.product.findMany({
        where: { category: category.label },
      });
  
      // Start a transaction for updates
      await db.$transaction(async (prisma) => {
        // Reset prices by category
        await resetPricesByCategory(catId);
  
        // Update category discount
        await prisma.category.update({
          where: { id: catId },
          data: { discount: discountPercentage },
        });
  
        // Update product prices
        const updatePromises = products.map((product) => {
          const newPrice = parseFloat(
            (product.price * (1 - discountPercentage / 100)).toFixed(2)
          );
          return prisma.product.update({
            where: { id: product.id },
            data: {
              discount: discountPercentage,
              oldPrice: product.price,
              price: newPrice,
              isDiscountEnabled: true,
            },
          });
        });
  
        await Promise.all(updatePromises);
      },
      {
        maxWait: 10000, // Wait for a connection for up to 10 seconds
        timeout: 20000, // Allow the transaction to run for up to 20 seconds
      });
  
      return true;
    } catch (error) {
      console.error("Error applying discount:", error);
      return null;
    }
  }
  
  
  
  

  
  export async function resetPricesByCategory(catId: string) {
    try {
      await db.$transaction(async (tx) => {
        // Fetch the category to get the label
        const category = await tx.category.findUnique({
          where: { id: catId },
          select: { label: true },
        });
  
        if (!category) {
          throw new Error(`Category with ID ${catId} not found`);
        }
  
        // Fetch products that belong to the category
        const products = await tx.product.findMany({
          where: { category: category.label },
          select: { id: true, basePrice: true, sellerProfit: true, price: true, oldPrice: true },
        });
  
        if (products.length === 0) {
          throw new Error('No products found for the category');
        }
  
        // Update the price for each product to the initial price
        const updatePromises = products.map((product) => {
          const initialPrice = product.oldPrice ?? product.price;
          return tx.product.update({
            where: { id: product.id },
            data: { price: initialPrice, isDiscountEnabled: false, discount: 0 },
          });
        });
  
        // Execute all updates within the transaction
        await Promise.all(updatePromises);
      },{
        maxWait: 10000, // Wait for a connection for up to 10 seconds
        timeout: 20000, // Allow the transaction to run for up to 20 seconds
      });
  
      console.log(`Prices successfully reset for category ID: ${catId}`);
      return true
    } catch (error) {
      console.error('Error resetting product prices by category:', error);
      return null;
    }
  }
  
  // Function: disableCategoryProducts
  export const disableCategoryProducts = async (category: Category) => {
  try {

    // Update the disableCategory field for the matching products
    const updatedProducts = await db.product.updateMany({
      where: {
        category: category.label,
      },
      data: {
        disableCategory: true,
      },
    });

    await db.category.update({
      where: { id: category.id },
      data: { disableCategory: true },
    })

    return updatedProducts;
  } catch (error) {
    console.error("Error disabling category products:", error);
    throw new Error("Failed to disable category products.");
  }
};

export const enableCategoryProducts = async (category: Category) => {
  try {
    // Update the disableCategory field for the matching products
    const updatedProducts = await db.product.updateMany({
      where: {
        category: category.label,
      },
      data: {
        disableCategory: false,
      },
    });

    // Enable the category itself
    await db.category.update({
      where: { id: category.id },
      data: { disableCategory: false },
    });

    return updatedProducts;
  } catch (error) {
    console.error("Error enabling category products:", error);
    throw new Error("Failed to enable category products.");
  }
};
