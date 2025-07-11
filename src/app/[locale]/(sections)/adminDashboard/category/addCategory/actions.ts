'use server'

import { db } from "@/db";

interface CategoryData {
  mainImage: string | null;
  label: string;
  price: number;
  colors: Array<{
    label: string;
    value: string;
    tw: string;
    frontImageUrl: string;
    backImageUrl: string;
  }>;
  sizes: Array<{
    label: string;
    value: string;
  }>;
  frontBorders: Array<{
    label: string;
    value: string;
  }>;
  backBorders: Array<{
    label: string;
    value: string;
  }>;
}

export async function saveCategoryData(categoryData: CategoryData ,uploadPaths : string[]) {
    try {
      // Destructure category data
      const {
        mainImage,
        label,
        price,
        colors,
        sizes,
        frontBorders,
        backBorders,
      } = categoryData;
  
      await db.$transaction(
        async (transaction) => {
          // Save the category
          await transaction.category.create({
            data: {
              quality: uploadPaths,
              label,
              value: mainImage!,
              price,
              // Map sizes to size relations
              sizes: {
                create: sizes.map((size: any) => ({
                  label: size.label,
                  value: size.value,
                })),
              },
              // Map colors to color relations
              colors: {
                create: colors.map((color: any) => ({
                  label: color.label,
                  value: color.value,
                  tw: color.tw,
                  frontImageUrl: color.frontImageUrl,
                  backImageUrl: color.backImageUrl,
                })),
              },
              // Map front borders to frontBorder relations
              frontBorders: {
                create: frontBorders.map((border: any) => ({
                  label: border.label,
                  value: border.value,
                })),
              },
              // Map back borders to backBorder relations
              backBorders: {
                create: backBorders.map((border: any) => ({
                  label: border.label,
                  value: border.value,
                })),
              },
            },
          });
        },
        {
          maxWait: 10000, // Wait for a connection for up to 10 seconds
          timeout: 20000, // Allow the transaction to run for up to 20 seconds
        }
      );
      
      
      return true
    } catch (error) {
      console.error('Error saving category data:', error);
      return false
    }
  }