'use server'

import { calculatePriceRanges } from "@/actions/actions";
import { db } from "@/db";
// search query : 
export async function searchProducts(
  query: string,
  page: number,
  limit: number,
  sortBy?: string,
  filterByCategory?: string,
  filterByCollection?: string,
  priceRange?: [number, number]
) {
    try {

      const decodedQuery = decodeURIComponent(query); // Decode the URI-encoded query string
      const keywords = decodedQuery.split(' ').filter(keyword => keyword.trim() !== ''); // Split decoded query into keywords
  
      
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
        OR: [
          {
            title: {
              contains: decodedQuery,
              mode: 'insensitive', // Case insensitive search for title
            },
          },
          {
            title: {
              contains: decodedQuery.replace(/\s+/g, ''), // Match products with exact title (ignoring spaces)
              mode: 'insensitive',
            },
          },
          {
            collectionName: {
              contains: decodedQuery, // Match products with exact title (ignoring spaces)
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: decodedQuery,
              mode: 'insensitive', // Case insensitive search for description
            },
          },
          {
            tags: {
              hasSome: keywords, // Match products with any tag from the decoded query keywords
            },
          },
          {
            category: {
              contains: decodedQuery,
              mode: 'insensitive', // Case insensitive search for category
            },
          },
          {
            store : {
              storeName : {
                contains : decodedQuery,
                mode : 'insensitive',
              }
            }
          },
        ],
        isProductAccepted: true,
        privateProduct: false,
        disableCategory : false,
        ...(filterByCategory && { category: filterByCategory }), // Filter by category
        ...(filterByCollection && { collectionName: filterByCollection }), // Filter by collection
        ...(priceRange && priceRange[0] !== 0 && priceRange[1] !== 0 && { price: { gte: priceRange[0], lte: priceRange[1] } }), // Filter by price range, avoid invalid range [0, 0]
      };


      const products = await db.product.findMany({
        where,
        include: {
          store: true, // Include related store information if needed
        },
        orderBy,
        skip: offset,
        take: limit,
      });

      const totalCount = await db.product.count({
        where, // Apply the same filters for counting
      });
  
      return { products, totalCount };
    } catch (error) {
      console.error('Error searching products:', error);
      return { products : [], totalCount : 0 };

    }
  }

  export async function fetchPriceRanges(query: string): Promise<[number, number][]> {
    // Fetch all product prices from the database
    const decodedQuery = decodeURIComponent(query); // Decode the URI-encoded query string
    const keywords = decodedQuery.split(' ').filter(keyword => keyword.trim() !== ''); // Split decoded query into keywords

    
    const products = await db.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: decodedQuery,
              mode: 'insensitive', // Case insensitive search for title
            },
          },
          {
            title: {
              contains: decodedQuery.replace(/\s+/g, ''), // Match products with exact title (ignoring spaces)
              mode: 'insensitive',
            },
          },
          {
            collectionName: {
              contains: decodedQuery, // Match products with exact title (ignoring spaces)
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: decodedQuery,
              mode: 'insensitive', // Case insensitive search for description
            },
          },
          {
            tags: {
              hasSome: keywords, // Match products with any tag from the decoded query keywords
            },
          },
          {
            category: {
              contains: decodedQuery,
              mode: 'insensitive', // Case insensitive search for category
            },
          },
          {
            store : {
              storeName : {
                contains : decodedQuery,
                mode : 'insensitive',
              }
            }
          },
        ],
        isProductAccepted: true,
        privateProduct: false,
        disableCategory : false
      },
      select: {
        price: true, // Only fetch the price field
      },
    });
  
    // Calculate and return price ranges
    return await calculatePriceRanges(products);
  }