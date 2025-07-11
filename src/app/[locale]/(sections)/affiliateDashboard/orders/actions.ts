'use server'

import { db } from "@/db";

export async function getAffiliateOrdersWithCommission(userId: string) {
  try {
    // Find the affiliate based on the userId
    const affiliate = await db.affiliate.findUnique({
      where: { userId },
      include: {
        links: {
          include: {
            commission: {
              include: {
                orderItem : {
                  include : {
                    commission : true,
                    order : true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!affiliate) {
      throw new Error("Affiliate not found for this user.");
    }

    // Extract all the orders along with their commission profits
    const ordersItemsWithCommission = affiliate.links
      .flatMap((link) => link.commission)
      .filter((commission) => commission.orderItem !== null) // Ensure orders are not null
      .map((commission) => ({
        orderItem: commission.orderItem,
        commissionProfit: commission.profit,
      }));

    return ordersItemsWithCommission;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching affiliate orders and commissions.");
  }
}