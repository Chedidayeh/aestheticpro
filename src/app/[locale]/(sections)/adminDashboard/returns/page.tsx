/* eslint-disable react/no-unescaped-entities */
'use server'
import React from "react"

import OrderView from "./OrderView"
import { getAllReturnedOrders } from "./actions"
import ErrorState from "@/components/ErrorState"


import { unstable_noStore as noStore } from "next/cache"



const Page =  async () => {
  try {
    

  noStore()
  const orders = await getAllReturnedOrders();

  return (
    <>

    <OrderView orders = {orders} />

  </>
  );
} catch (error) {
  console.error(error);
  return <ErrorState/>

    
}
}

export default Page;