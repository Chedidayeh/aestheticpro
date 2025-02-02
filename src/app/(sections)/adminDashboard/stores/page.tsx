/* eslint-disable react/no-unescaped-entities */

import React from "react"
import StoresView from "./StoresView"
import { unstable_noStore as noStore } from "next/cache"
import { getAllStoresWithUsersAndCounts } from "./actions"
import ErrorState from "@/components/ErrorState"


const Page =  async () => {

  try {
    


  noStore()

  const initialeStores = await getAllStoresWithUsersAndCounts(10);

  return (
    <>
    <StoresView initialeStores = {initialeStores} />
  </>
  );

} catch (error) {
  console.error(error);
  return <ErrorState/>

    
}
}

export default Page;