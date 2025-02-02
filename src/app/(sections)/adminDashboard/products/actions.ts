'use server'

import { db } from "@/db";


export async function getAllProductsWithDesigns(
  limit: number,
  searchQuery?: string,
  filterBy?: string,
  sortBy?: string
) {
  try {
    // Build `where` clause dynamically based on filters
    const where: any = {};

    // Filtering logic
    if (filterBy === "accepted") {
      where.isProductAccepted = true;
    } else if (filterBy === "refused") {
      where.isProductRefused = true;
    } else if (filterBy === "action") {
      where.isProductAccepted = false;
      where.isProductRefused = false;
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
          title: {
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

    // Fetch products with filters and sorting
    const products = await db.product.findMany({
      where,
      include: {
        store: true, // Ensure this matches your Prisma schema
        frontDesign: true,
        backDesign: true,
        order: true,
      },
      orderBy,
      take,
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

