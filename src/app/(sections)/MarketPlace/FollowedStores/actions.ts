'use server'

import { calculatePriceRanges } from "@/actions/actions";
import { db } from "@/db";


// Prioritizing New Products from Followed Stores
export const getFollowedStoreProductsFirst = async (
    userId: string,
    page: number,
    limit: number,
    sortBy?: string,
    filterByCategory?: string,
    filterByCollection?: string,
    priceRange?: [number, number]
) => {

    const followedStores = await db.storeFollow.findMany({
        where: { userId },
        select: { storeId: true },
      });

    const storeIds = followedStores.map((follow) => follow.storeId);

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
      storeId: { in: storeIds },
      disableCategory : false,
      isProductAccepted: true,
      privateProduct: false,
      ...(filterByCategory && { category: filterByCategory }), // Filter by category
      ...(filterByCollection && { collectionName: filterByCollection }), // Filter by collection
      ...(priceRange && priceRange[0] !== 0 && priceRange[1] !== 0 && { price: { gte: priceRange[0], lte: priceRange[1] } }), // Filter by price range, avoid invalid range [0, 0]
    };
    
    // Fetch new products from followed stores first
    const followedStoreProducts = await db.product.findMany({
      where,
      include : {
        store : true
      },
      skip : offset,
      orderBy,
      take : limit
    });
  
    const totalCount = await db.product.count({
        where, // Apply the same filters for counting
      });
    
    return { products : followedStoreProducts, totalCount }; 

};


  
export async function fetchPriceRanges(userId: string): Promise<[number, number][]> {
    
    const followedStores = await db.storeFollow.findMany({
        where: { userId },
        select: { storeId: true },
      });

    const storeIds = followedStores.map((follow) => follow.storeId);
    
    // Fetch all product prices from the database
    const products = await db.product.findMany({
      where: {
        storeId: { in: storeIds },
        isProductAccepted: true,
        disableCategory : false,
        privateProduct: false,
      },
      select: {
        price: true, // Only fetch the price field
      },
    });
  
    // Calculate and return price ranges
    return await calculatePriceRanges(products);
}
  

  