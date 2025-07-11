'use server'

import { calculatePriceRanges } from "@/actions/actions";
import { db } from "@/db";



export async function fetchBestSellingProducts(
  page: number, 
  limit: number ,   
  sortBy?: string,
  filterByCategory?: string,
  filterByCollection?: string,
  priceRange?: [number, number]) {
    try {
      const offset = Math.max((page - 1) * limit, 0); // Ensure non-negative offset
  
      // Map supported sort options to Prisma `orderBy` format
      const sortOptions: Record<string, object> = {
        high: { price: 'desc' }, // Sort by highest price
        low: { price: 'asc' },  // Sort by lowest price
        sales: { totalSales: 'desc' }, // Sort by most sold
      };
    
      // Fallback to default sorting if `sortBy` is invalid or not provided
      const orderBy = sortOptions[sortBy!] || { totalSales: 'desc' };
    
      // Construct `where` filter object dynamically based on the filters provided
      const where: any = {
        topSales: true,
        isProductAccepted: true,
        disableCategory : false,
        privateProduct: false,
        ...(filterByCategory && { category: filterByCategory }), // Filter by category
        ...(filterByCollection && { collectionName: filterByCollection }), // Filter by collection
        ...(priceRange && priceRange[0] !== 0 && priceRange[1] !== 0 && { price: { gte: priceRange[0], lte: priceRange[1] } }), // Filter by price range, avoid invalid range [0, 0]
      };
  
      // Fetch updated best-selling products with pagination
      const bestSellingProducts = await db.product.findMany({
        where,
        include: {
          store: true
        },
        orderBy,
        skip: offset,
        take: limit,
      });
  
      // Fetch total count for pagination
      const totalCount = await db.product.count({
        where
      });
  
      return { products : bestSellingProducts, totalCount };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { products: [], totalCount: 0 };
    }
  }

  export async function fetchPriceRanges(): Promise<[number, number][]> {
    // Fetch all product prices from the database
    const products = await db.product.findMany({
      where: {
        topSales : true,
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


  export async function getUserFavoriteListProductsCount(userId: string) {
    try {
      // Find the user's favorite list including products
      const favList = await db.favList.findUnique({
        where: {
          userId: userId,
        },
        include: {
          _count : {
            select : {
              products: {
                where : { disableCategory : false, isProductAccepted : true , privateProduct : false}
              },
            }
          }

        },
      });
  
      if (!favList || !favList._count) {
        // If the favorite list doesn't exist or it has no products, return an empty array or null as per your preference
        return 0;
      }
  
      // Return the favorite list with products
      return favList._count.products;
    } catch (error) {
      console.error("Error fetching user's favorite list:", error);
      throw error; // Propagate the error for handling elsewhere
    }
  }
  

  export async function countBestSellingProducts() {
    try {

      // Fetch all products with totalSales greater than 9
      const productsToUpdate = await db.product.findMany({
        where: {
          isProductAccepted: true,
          privateProduct : false,
          disableCategory : false,
          totalSales: { gt: 9 },
        },
      });
  
      // Update the topSales field to true for all qualifying products in one batch
      const productIds = productsToUpdate.map((product) => product.id);
  
      if (productIds.length > 0) {
        await db.product.updateMany({
          where: { id: { in: productIds } },
          data: { topSales: true },
        });
      }
  
      // Fetch the products again to get the updated topSales values
      const count = await db.product.count({
        where: { topSales: true, isProductAccepted: true , privateProduct : false ,  disableCategory : false,
        },
      });
  
      return count

    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }