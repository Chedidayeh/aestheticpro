'use server'

import { db } from "@/db";

export async function getAllCollections() {
  try {
    // Fetch all collections from the database
    const collections = await db.collection.findMany({
      orderBy: {
        createdAt: "asc", // Optional: Order by creation date
      },
      include : {
        products : true
      }
    });

    return collections
  } catch (error) {
    console.error("Error fetching collections:", error);

    return []
    
  }
}

export async function deleteTopBarCollection(collectionId: string) {
  try {
    // Check if the collection exists
    const existingCollection = await db.collection.findUnique({
      where: { id: collectionId },
    });

    if (!existingCollection) {
      return {
        success: false,
        message: "Collection not found.",
      };
    }

    // Delete the collection
    await db.collection.delete({
      where: { id: collectionId },
    });

    return {
      success: true,
      message: "Collection deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting collection:", error);

    return {
      success: false,
      message: "An error occurred while deleting the collection.",
    };
  }
}



export async function addNewCollection(newCollection : string) {
  try {
    // Create a new collection in the database
    const collection = await db.collection.create({
      data: {
        name: newCollection,
      },
    });

    return {
      success: true,
      message: "Collection added successfully.",
      collection,
    };
  } catch (error) {
    console.error("Error adding new collection:", error);
    return {
      success: false,
      message: "An error occurred while adding the collection.",
    };
  }
}



export async function addTopBarContent(platformId : string, newContent : string) {
  try {
    const platform = await db.platform.update({
      where: { id: platformId },
      data: {
        topBarContent: {
          push: newContent
        }
      }
    });
    return true
  } catch (error) {
    console.error('Error adding content:', error);
    return false
  }
}




export async function deleteTopBarContent(platformId: string, contentToDelete: string) {
  try {
    // Fetch the current platform
    const platform = await db.platform.findUnique({
      where: { id: platformId },
    });

    if (!platform) {
      throw new Error('Platform not found');
    }

    // Update the topBarContent
    const updatedPlatform = await db.platform.update({
      where: { id: platformId },
      data: {
        topBarContent: {
          set: platform.topBarContent.filter(phrase => phrase !== contentToDelete)
        }
      }
    });

    return updatedPlatform;
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
}

export async function updateStoreCreation(platformId: string, closeStoreCreation: boolean) {
  try {
    const updatedPlatform = await db.platform.update({
      where: { id: platformId },
      data: { closeStoreCreation : closeStoreCreation },
    });
    return updatedPlatform;
  } catch (error) {
    console.error("Failed to update store creation setting:", error);
    return null;
  }
}

export async function updateCreation(platformId: string, closeCreation: boolean) {
  try {
    const updatedPlatform = await db.platform.update({
      where: { id: platformId },
      data: { closeCreation : closeCreation },
    });
    if(closeCreation === true){
      await createNotificationForAllStores("Hi Sellers, product and design creation is temporarily paused. " , "Admin")
    }else{
      await createNotificationForAllStores("Hi Sellers, Great news! The product and design creation features are now back online. Happy designing! " , "Admin")
    }
    return updatedPlatform;
  } catch (error) {
    console.error("Failed to update store creation setting:", error);
    return null;
  }
}




import { Platform } from "@prisma/client";
import { createNotificationForAllStores } from "../notifications/action";

export const updatePlatformData = async (
  platformId: string,
  updatedData: Partial<Platform>
): Promise<Platform | null> => {
  try {
    // Update platform data using Prisma
    const updatedPlatform = await db.platform.update({
      where: { id: platformId },
      data: {
        maxProductSellerProfit: updatedData.maxProductSellerProfit,
        maxDesignSellerProfit: updatedData.maxDesignSellerProfit,
        platformDesignProfit: updatedData.platformDesignProfit,
        shippingFee: updatedData.shippingFee,
        maxProductQuantity: updatedData.maxProductQuantity,
        clientDesignPrice:updatedData.clientDesignPrice,
        ExtraDesignForProductPrice : updatedData.ExtraDesignForProductPrice,
        affiliateUserProfit : updatedData.affiliateUserProfit,
        freeShippingFeeLimit : updatedData.freeShippingFeeLimit,
        productsLimitPerPage : updatedData.productsLimitPerPage,
        
      },
    });

    return updatedPlatform;
  } catch (error) {
    console.error("Failed to update platform data:", error);
    return null;
  }
};


// levels 
export async function getAllLevels() {
  try {
    const levels = await db.level.findMany({
      orderBy: {
        levelNumber: 'asc', // Ensure levels are sorted by ascending level number
      },
    });
    return levels;
  } catch (error) {
    console.error('Error fetching levels:', error);
    throw new Error('Unable to fetch levels');
  }
}

export async function createLevel(data: { levelNumber: number, minSales: number, productLimit: number, designLimit: number, benefits: string[] }) {
  try {
    // Filter out empty or whitespace-only benefits
    const filteredBenefits = data.benefits.filter(benefit => benefit.trim() !== "");

    const newLevel = await db.level.create({
      data: {
        levelNumber: data.levelNumber,
        minSales: data.minSales,
        productLimit: data.productLimit,
        designLimit: data.designLimit,
        benefits: filteredBenefits, // Use filtered benefits array
      },
    });

    console.log('Level created successfully:', newLevel);
    return newLevel;
  } catch (error) {
    console.error('Error creating level:', error);
    throw new Error('Failed to create level');
  }
}



// Function to delete a level by ID
export async function deleteLevel(levelId: number) {
  try {
    const deletedLevel = await db.level.delete({
      where: {
        id: levelId, // You can also use levelNumber if that's more relevant
      },
    });
    console.log('Level deleted successfully:', deletedLevel);
    return deletedLevel;
  } catch (error) {
    console.error('Error deleting level:', error);
    throw new Error('Failed to delete level');
  }
}

