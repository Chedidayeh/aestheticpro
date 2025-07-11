'use server'

import Cart from "./Cart";
import { getPlatformForTheWebsite, getUser } from "@/actions/actions";
import { fetchCartProducts } from "./actions";
import ErrorState from "@/components/ErrorState";




const Page = async () => {
  try {

        const user = await getUser()

        const cartProductList = await fetchCartProducts(user?.id ? user.id : "")

        const platform  = await getPlatformForTheWebsite()

        return ( <Cart products={cartProductList!} user={user!} platform={platform!} /> )

  } catch (error) {
    console.log(error)
    return <ErrorState/>

  }








}

export default Page