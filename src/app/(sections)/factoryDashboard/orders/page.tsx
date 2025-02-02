/* eslint-disable react/no-unescaped-entities */
'use server'


import React from "react"
import OrderView from "./OrderView"
import { getAllOrders } from "./actions"
import { unstable_noStore as noStore } from "next/cache"
import ErrorState from "@/components/ErrorState"



const Page =  async () => {

  try {
    


  noStore()

  const orders = await getAllOrders(10,false);

  return (
    <>

    <OrderView initialeOrders = {orders} />

  </>
  );

} catch (error) {
  console.error(error);
  return <ErrorState/>

    
}
}

export default Page;