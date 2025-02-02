'use server'

import { db } from "@/db";
import { Platform } from "@prisma/client";
import { randomBytes } from "crypto";


export async function getAffiliateIdByUserId(userId: string) {
  try {
    const affiliate = await db.affiliate.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true, // Only select the affiliate ID
      },
    });
    if (!affiliate) {
      throw new Error('Affiliate not found for the given user');
    }
    return affiliate.id;
  } catch (error) {
    console.error('Error fetching affiliate:', error);
    throw new Error('Failed to retrieve affiliate ID');
  }
}

export const generateShortAffiliateLink = async (platform : Platform , originalAffiliateLink : string , productId: string, affiliateId: string) => {
  try {
    // Start a transaction to handle operations atomically
    const result = await db.$transaction(async (prisma) => {
      // Check if an affiliate link already exists for this product and affiliate
      const existingLink = await prisma.affiliateLink.findFirst({
        where: {
          affiliateId,
          productId
        }
      });

      // If an existing link is found, return null (or a custom message)
      if (existingLink) {
        return null;  // Link already exists
      }

      // Generate a cryptographically secure random 6-byte string (12 characters in hex)
      const code = randomBytes(6).toString('hex');

      const shortLink = `${process.env.NEXT_PUBLIC_BASE_URL}/${code}`;

              // fetch the product price :
      const product = await prisma.product.findUnique({
        where: {
          id: productId
          },
      })
      // calculate amount based on product price
      // Calculate commission amount based on platform.affiliateUserProfit
      const commissionAmount = product?.price! * (platform.affiliateUserProfit / 100);
      console.log(commissionAmount)
      // Create a new affiliate link
      const affiliateLink = await prisma.affiliateLink.create({
        data: {
          affiliateId,
          productId,
          link: shortLink,
          originalLink : originalAffiliateLink,
          code,
          probableProfit : commissionAmount
        }
      });




      return shortLink;
    },{
      maxWait: 10000, // Wait for a connection for up to 10 seconds
      timeout: 20000, // Allow the transaction to run for up to 20 seconds
    });

    return result;

  } catch (error) {
    console.error('Error generating affiliate link:', error);
    // Handle the error appropriately, e.g., return an error message or throw an exception
    throw new Error('Failed to generate affiliate link');
  } 
}

export async function fetchAllProducts(
  page: number,
  limit: number,
  sortBy?: string,
  filterByCategory?: string,
  filterByCollection?: string,
  searchQuery? : string,
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
    isProductAccepted: true,
    privateProduct: false,
    disableCategory : false,
    ...(filterByCategory && { category: filterByCategory }), // Filter by category
    ...(filterByCollection && { collectionName: filterByCollection }), // Filter by collection
    ...(searchQuery && { title: { startsWith: searchQuery, mode: 'insensitive' } }), // Filter by search query
  };

    const products = await db.product.findMany({
      where ,
      include : {
        store : true
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
    console.error('Error fetching products:', error);
    return { products : [], totalCount : 0 };
  }
  }



