/* eslint-disable react/no-unescaped-entities */


import React from "react"
import { getAllDesignsWithProducts } from "./actions"
import { unstable_noStore as noStore } from "next/cache"
import DesignView from "./DesignView"
import ErrorState from "@/components/ErrorState"


const Page =  async () => {

  try {
    

  noStore()
  const initialDesigns = await getAllDesignsWithProducts(10);

  return (
    <>

    <DesignView initialDesigns = {initialDesigns} />

  </>
  );

} catch (error) {
  console.error(error);
  return <ErrorState/>

    
}
}

export default Page;