'use server'

import { calculatePriceRanges } from "@/actions/actions";
import { db } from "@/db";

  // fetch products by category
  export async function fetchProductsByCategory(
    category : string , 
    page: number, 
    limit: number,
    sortBy?: string,
    filterByCollection?: string,
    priceRange?: [number, number]
  ){
      
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
        category: category,
        isProductAccepted: true,
        privateProduct: false,
        disableCategory : false,
        ...(filterByCollection && { collectionName: filterByCollection }), // Filter by collection
        ...(priceRange && priceRange[0] !== 0 && priceRange[1] !== 0 && { price: { gte: priceRange[0], lte: priceRange[1] } }), // Filter by price range, avoid invalid range [0, 0]
      };
          
      const products = await db.product.findMany({
        where,
        skip: offset,
        take: limit,
        include : {
          store : true
        },
        orderBy,
      });

      const totalCount = await db.product.count({
        where
      }); // Total count for pagination

      return { products, totalCount };
  }

  export async function fetchPriceRanges(category : string): Promise<[number, number][]> {
    // Fetch all product prices from the database
    const products = await db.product.findMany({
      where: {
        category,
        disableCategory : false,
        privateProduct : false,
        isProductAccepted: true,
      },
      select: {
        price: true, // Only fetch the price field
      },
    });
  
    // Calculate and return price ranges
    return await calculatePriceRanges(products);
  }
  


