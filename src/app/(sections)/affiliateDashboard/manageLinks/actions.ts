'use server'

import { db } from "@/db";

export async function getAffiliateLinksForUser(userId: string) {
    try {
      // Fetch the affiliate links for the given user across all products
      const affiliateLinks = await db.affiliateLink.findMany({
        where: {
          affiliate: {
            userId: userId, // Match the affiliate with the given user
          },
        },
        include: {
          product: true,    // Include product data if needed
          affiliate: true,  // Include affiliate data if needed
          commission : true
        },
      });
  
      return affiliateLinks;
    } catch (error) {
      console.error('Error fetching affiliate links:', error);
      throw new Error('Failed to fetch affiliate links');
    }
  }