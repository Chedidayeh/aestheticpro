'use server'

import { db } from "@/db";
import { UserType } from "@prisma/client";



export async function getAllAffiliatesWithDetails(
  limit: number,
  all: boolean,
  sortBy?: string,
  searchQuery?: string
) {
  try {
    const whereClause: any = {};

    const sortOptions: Record<string, object> = {
      revenue: { totalIncome: 'desc' }, // Sort by highest revenue
      links: { links: { _count: 'desc' } }, // Sort by most links
    };

    // Use default order if sortBy is not valid
    const orderBy = sortOptions[sortBy ?? ''] || { createdAt: 'desc' };

    // Construct search query conditions
    if (searchQuery) {
      whereClause.OR = [
        { id: { contains: searchQuery, mode: 'insensitive' } },
        { user: { name: { contains: searchQuery, mode: 'insensitive' } } },
        { user: { email: { contains: searchQuery, mode: 'insensitive' } } },
      ];
    }

    const affiliates = await db.affiliate.findMany({
      where: whereClause, // Correctly use the `whereClause`
      include: {
        user: true, // Include the user associated with the affiliate
        links: {
          include: {
            commission: true, // Include commissions for each affiliate link
          },
        },
      },
      orderBy,
      take: all ? undefined : limit, // Handle limit dynamically
    });

    return affiliates;
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    throw new Error("Unable to fetch affiliates.");
  }
}




export async function getUsersByType(
    limit: number,
    all : boolean,
    filterBy?: string,
    searchQuery?: string
) {
  try {
    const whereClause: any = {};

    // Apply search query
    if (searchQuery) {
      whereClause.OR = [
        { id: { contains: searchQuery, mode: "insensitive" } },
        { name: { contains: searchQuery, mode: "insensitive" } },
        { email: { contains: searchQuery, mode: "insensitive" } },
        { phoneNumber: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    // Apply filter by userType or affiliate status
    if (filterBy) {
      if (["user", "seller", "admin", "factoryAdmin"].includes(filterBy)) {
        whereClause.userType = filterBy.toUpperCase();
      } else if (filterBy === "affiliate") {
        whereClause.isAffiliate = true;
      } else if (filterBy === "nonAffiliate") {
        whereClause.isAffiliate = false;
      }
    }

    // Retrieve users with filters
    const users = await db.user.findMany({
      where: whereClause,
      take : all ? undefined : limit,
      orderBy : {
        createdAt : "desc"
      }
    });

    return users;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
}


export async function deleteUserById(userId : string) {
  try {
    
    await db.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
}

export const updateUserRole = async (userId: string, newRole: UserType): Promise<void> => {
  try {
    await db.user.update({
      where: { id: userId },
      data: { userType: newRole },
    });
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw new Error("Failed to update user role");
  }
};



export async function banUser(userId:string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { isUserBanned: true },
    });
  } catch (error) {
    console.error("Failed to update user type:", error);
    throw new Error("Failed to update user type");
  }
}