/* eslint-disable react/no-unescaped-entities */
'use server'

import { db } from "@/db";
import ViewProduct from "./viewProduct"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { OctagonAlert } from "lucide-react";
import {  getPlatformForTheWebsite, getUser } from "@/actions/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchDesignById, fetchProductsByCategory, getCategory, getProductReviews, getSizes, trackProductView } from "./actions";
import NotFound from "@/app/(home)/[...not-found]/page";
import ErrorState from "@/components/ErrorState";
import LoadingLink from "@/components/LoadingLink";
interface PageProps {
  params: {
    productId: string
  }
}




const Page = async ({ params }: PageProps) => {

  const { productId } = params

  try {

    const user = await getUser()

    const product = await db.product.findFirst({
      where : {id : productId , isProductAccepted : true , privateProduct : false },
      include : {
        store : true,
        frontDesign : true,
        backDesign : true,
      }
    });

        if (!product)   return <NotFound />;

        if(product.disableCategory === true ) return (
          <>
          <AlertDialog open={true} >
          <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
          <AlertDialogHeader className="flex flex-col items-center">
    <div className="text-red-500 mb-2">
    <OctagonAlert className=''/>
    </div>
    <AlertDialogTitle className="text-xl font-bold text-center">
    We don't take orders for this type of category product for now ! 
    </AlertDialogTitle>
    <AlertDialogDescription>
    Please return to the home page !
    </AlertDialogDescription>
    <LoadingLink  href="/" ><Button size={"sm"} variant="default">
      Return
        </Button>
        </LoadingLink>
    </AlertDialogHeader>
    </AlertDialogContent>
          </AlertDialog>
          <div className="mb-96"></div>
          </>
        )


        const categoryProducts = await fetchProductsByCategory(product.category)
        const filteredProducts = categoryProducts!.filter(item => item.id !== product.id);

        const category = await getCategory(product.category)

        const sizes = await getSizes(product.category);

        const platform  = await getPlatformForTheWebsite()

        const productReviews = await getProductReviews(product.id)

        await trackProductView(product);
        


        return (
          <ViewProduct product={product} frontDesign={product.frontDesign!} backDesign={product.backDesign!} user={user!} categoryProducts={filteredProducts} category={category!} sizes={sizes!} platform={platform!} productReviews={productReviews}  />
        )

  } catch (error) {
    console.log(error)
    return <ErrorState/>


  }








}

export default Page