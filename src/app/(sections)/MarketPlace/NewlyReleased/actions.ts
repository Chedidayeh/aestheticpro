'use server'

import { calculatePriceRanges, updateNewProductStatus } from "@/actions/actions";
import { db } from "@/db";

  // for the new released products
  export async function fetchNewProducts(
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
        const orderBy = sortOptions[sortBy!] || { createdAt: 'desc' };

        // Construct `where` filter object dynamically based on the filters provided
        const where: any = {
            NewProduct : true ,
            disableCategory : false,
            isProductAccepted: true,
            privateProduct: false,
            ...(filterByCategory && { category: filterByCategory }), // Filter by category
            ...(filterByCollection && { collectionName: filterByCollection }), // Filter by collection
            ...(priceRange && priceRange[0] !== 0 && priceRange[1] !== 0 && { price: { gte: priceRange[0], lte: priceRange[1] } }), // Filter by price range, avoid invalid range [0, 0]
        };


      const products = await db.product.findMany({
        where ,
        orderBy,
        include : {
          store : true
        },
        skip: offset,
        take: limit,     
     });

     const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
     const currentDate = new Date();

     const count = await db.product.count({
       where: {
         NewProduct: true,
         disableCategory : false,
         isProductAccepted: true,
         privateProduct: false,
         createdAt: {
           lt: new Date(currentDate.getTime() - oneWeekInMillis), // Filter by created date older than one week
         },
       },
     });

     if(count> 0) {
       await updateNewProductStatus()
     }
      

  
      const totalCount = await db.product.count({
        where, // Apply the same filters for counting
      });
    
      return { products, totalCount };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { products : [], totalCount : 0 };
    }
  }


  export async function fetchPriceRanges(): Promise<[number, number][]> {
    // Fetch all product prices from the database
    const products = await db.product.findMany({
      where: {
        NewProduct : true,
        isProductAccepted: true,
        privateProduct: false,
        disableCategory : false,
      },
      select: {
        price: true, // Only fetch the price field
      },
    });
  
    // Calculate and return price ranges
    return await calculatePriceRanges(products);
  }
