'use server'

import { calculatePriceRanges } from "@/actions/actions";
import { db } from "@/db";


  export async function fetchDiscountProductsDeals(
    page: number,
    limit: number,
    sortBy?: string,
    filterByCategory?: string,
    filterByCollection?: string,
    priceRange?: [number, number]
  ) {
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
      isDiscountEnabled : true,
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
  
    const totalCount = await db.product.count({
      where, // Apply the same filters for counting
    });
  
    return { products, totalCount };
  }
  
  
  export async function fetchPriceRanges(): Promise<[number, number][]> {
    // Fetch all product prices from the database
    const products = await db.product.findMany({
      where: {
        isDiscountEnabled : true,
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
  