'use server'
import React from "react"
import ProductView from "./ProductView"
import { getAllProductsWithDesigns } from "./actions"
import { unstable_noStore as noStore } from "next/cache"
import ErrorState from "@/components/ErrorState"

const Page = async () => {
  noStore();
  
  try {
    const initialProducts = await getAllProductsWithDesigns(6);

    return (
        <ProductView initialProducts={initialProducts} />
    );
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return <ErrorState/>

  }
}

export default Page;