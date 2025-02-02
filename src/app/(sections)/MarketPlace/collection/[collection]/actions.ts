'use server'

import { calculatePriceRanges } from "@/actions/actions";
import { db } from "@/db";


  // fetch products by collection
  export async function fetchProductsByCollection(
    collection : string , 
    page: number, 
    limit: number,
    sortBy?: string,
    filterByCategory?: string,
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
        collectionName: collection,
        isProductAccepted: true,
        disableCategory : false,
        privateProduct: false,
        ...(filterByCategory && { category: filterByCategory }), // Filter by category
        ...(priceRange && priceRange[0] !== 0 && priceRange[1] !== 0 && { price: { gte: priceRange[0], lte: priceRange[1] } }), // Filter by price range, avoid invalid range [0, 0]
      };


      const products = await db.product.findMany({
        where,
        include : {
          store : true
        },
        skip: offset,
        take: limit,
        orderBy,
      });
      const totalCount = await db.product.count({
        where
      }); // Total count for pagination

      return { products, totalCount };
    } catch (error) {
      console.error(`Error fetching products by category: ${error}`);
      return { products : [], totalCount : 0 };

    } 
  }





  export async function getCollectionProductsCategories(decodedCollection : string) {
    try {
      const categories = await db.product.findMany({
        where : {isProductAccepted : true , collectionName : decodedCollection , privateProduct : false , disableCategory : false,
        },
        select: {
          category: true,
        },
        distinct: ['category']
      });
      return categories.map(product => product.category);
    } catch (error) {
      console.error("Error retrieving categories:", error);
      throw error;
    }
  }


  export async function fetchPriceRanges(decodedCollection : string): Promise<[number, number][]> {
    // Fetch all product prices from the database
    const products = await db.product.findMany({
      where: {
        collectionName : decodedCollection,
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
  