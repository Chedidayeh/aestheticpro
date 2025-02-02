
'use server'

import { db } from "@/db";

interface Color {
    label: string;
    value: string;
    tw: string;
    frontImageUrl: string;
    backImageUrl: string;
}

interface Size {
    label: string;
    value: string;

}

// get the categories
export async function getAllCategories() {
  try {
    const categories = await db.category.findMany({
      include: {
        colors: true,
        sizes: true,
        frontBorders: true,
        backBorders: true,
      },
    })
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export async function addColorsToCategory(categoryId: string, colors: Color[]) {
    try {
      const newColors = await Promise.all(
        colors.map(colorData =>
          db.color.create({
            data: {
              ...colorData,
              categoryId: categoryId,
            },
          })
        )
      );
  
      console.log('Colors added successfully:', newColors);
      return newColors;
    } catch (error) {
      console.error('Error adding colors to category:', error);
      throw error;
    }
  }

  export async function addSizesToCategory(categoryId: string, newSizes: Size[]) {
    try {
      const newColors = await Promise.all(
        newSizes.map(sizeData =>
          db.size.create({
            data: {
              ...sizeData,
              categoryId: categoryId,
            },
          })
        )
      );
  
      console.log('Colors added successfully:', newColors);
      return newColors;
    } catch (error) {
      console.error('Error adding colors to category:', error);
      throw error;
    }
  }

  export async function deleteColor(colorId: string) {
    try {
      // Delete the color with the specified ID
      const deletedColor = await db.color.delete({
        where: { id: colorId },
      });
  
      return deletedColor;
    } catch (error) {
      console.error('Error deleting color:', error);
      throw error;
    }
  }

  export async function deleteSize(sizeId: string) {
    try {
      // Delete the color with the specified ID
      const deletedSize = await db.size.delete({
        where: { id: sizeId },
      });
  
      return deletedSize;
    } catch (error) {
      console.error('Error deleting size:', error);
      throw error;
    }
  }