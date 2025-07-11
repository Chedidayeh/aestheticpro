'use server'

import { calculatePriceRanges } from "@/actions/actions";
import { db } from "@/db";

export async function getStoreByStoreName(storeName:string) {
  const store = await db.store.findUnique({
    where : {
      storeName
    }
  })
  return store;
}


export async function trackStoreView(
  storeId: string,
) {
  try {

      // Increment store's total views
      await db.store.update({
        where: { id: storeId },
        data: { totalViews: { increment: 1 } },
      });
    
  } catch (error) {
    console.error("Error tracking product view:", error);
  }
}


  export async function getStoreProductsCount(storeId:string) {
    const count = await db.product.count({
      where : {
        storeId,
        isProductAccepted: true,
        privateProduct: false,
        disableCategory : false,
      }
    })
    return count
  }



// Function to get store's products and designs by store Name
export async function getStoreProducts(
  storeId: string,
  page: number,
  limit: number,
  sortBy?: string,
  filterByCategory?: string,
  filterByCollection?: string,
  priceRange?: [number, number]
) {
  try {

    const offset = Math.max((page - 1) * limit, 0); // Ensure non-negative offset
  
  // Map supported sort options to Prisma `orderBy` format
  const sortOptions: Record<string, object> = {
    high: { price: 'desc' }, // Sort by highest price
    low: { price: 'asc' },  // Sort by lowest price
    sales: { totalSales: 'desc' }, // Sort by most sold
  };

  // Fallback to default sorting if `sortBy` is invalid or not provided
  const orderBy = sortOptions[sortBy!] || { totalViews: 'desc' };

  // Construct `where` filter object dynamically based on the filters provided
  const where: any = {
    storeId,
    isProductAccepted: true,
    privateProduct: false,
    disableCategory : false,
    ...(filterByCategory && { category: filterByCategory }), // Filter by category
    ...(filterByCollection && { collectionName: filterByCollection }), // Filter by collection
    ...(priceRange && priceRange[0] !== 0 && priceRange[1] !== 0 && { price: { gte: priceRange[0], lte: priceRange[1] } }), // Filter by price range, avoid invalid range [0, 0]
  };

  const products = await db.product.findMany({
    where, // Apply dynamic filters
    orderBy, // Dynamically apply sorting
    include: {
      store: true,
    },
    skip: offset,
    take: limit,
  });

    // Return the products and designs of the store
    const totalCount = await db.product.count({
      where, // Apply the same filters for counting
    });
  
    return { products, totalCount };
    } catch (error) {
    console.error("Error fetching store's products and designs:", error);
    return { products : [], totalCount : 0 }; // Propagate the error for handling elsewhere
  }
}

export async function fetchPriceRanges(storeId: string): Promise<[number, number][]> {
  // Fetch all product prices from the database
  const products = await db.product.findMany({
    where: {
      isProductAccepted: true,
      privateProduct: false,
      disableCategory : false,
      storeId,
    },
    select: {
      price: true, // Only fetch the price field
    },
  });

  // Calculate and return price ranges
  return await calculatePriceRanges(products);
}


export async function getDesignsByStoreId(storeId: string) {
  try {
    const sellersDesigns = await db.sellerDesign.findMany({
      where: {
        storeId: storeId,
        isDesignForSale: true,
        isDesignAccepted: true,
      },
    });

    return sellersDesigns;
  } catch (error) {
    console.log(error)
  }

}





export const checkIfUserFollowsStore = async (userId: string, storeId: string) => {
  const follow = await db.storeFollow.findUnique({
    where: {
      userId_storeId: { userId, storeId },
    },
  });
  return !!follow; // Return true if follow exists, otherwise false
};

export const followStore = async (userId: string, storeId: string) => {
  return await db.storeFollow.create({
    data: {
      userId,
      storeId,
    },
  });
};

export const unfollowStore = async (userId: string, storeId: string) => {
  return await db.storeFollow.delete({
    where: {
      userId_storeId: { userId, storeId },
    },
  });
};

export const getStoreFollowersCount = async (storeId: string) => {
  const followersCount = await db.storeFollow.count({
    where: {
      storeId,
    },
  });
  return followersCount;
};

