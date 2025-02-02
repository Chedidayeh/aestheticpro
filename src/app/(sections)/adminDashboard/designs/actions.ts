'use server'

import { db } from "@/db";

export async function getAllDesignsWithProducts(
  limit: number,
  searchQuery?: string,
  filterBy?: string,
  sortBy?: string
) {
  try {
    // Build `where` clause dynamically based on filters
    const where: any = { isDesignForSale: true }; // Ensure designs are for sale

    // Filtering logic
    if (filterBy === "accepted") {
      where.isDesignAccepted = true;
    } else if (filterBy === "refused") {
      where.isDesignRefused = true;
    } else if (filterBy === "action") {
      where.isDesignAccepted = false;
      where.isDesignRefused = false;
    }

    // Search logic
    if (searchQuery && searchQuery.trim() !== "") {
      where.OR = [
        {
          id: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          store: {
            storeName: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    // Determine `take` value based on filters
    const take = filterBy || searchQuery ? undefined : limit;

    // Sorting logic
    const sortOptions: Record<string, object> = {
      sales: { totalSales: "desc" }, // Sort by total sales (descending)
    };

    const orderBy = sortBy ? sortOptions[sortBy] : { createdAt: "desc" };

    // Fetch designs with filters, sorting, and pagination
    const designs = await db.sellerDesign.findMany({
      where,
      include: {
        store: true,
        frontOrders: true,
        backOrders: true,
      },
      orderBy,
      take,
    });

    return designs;
  } catch (error) {
    console.error("Error retrieving designs:", error);
    throw error;
  }
}
