'use server'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import React from 'react';


import { OctagonAlert } from 'lucide-react';
import { getStoreWithProductsCount } from './actions';
import { getAllCategories, getLevelByNumber, getPlatformForTheWebsite, getUser } from "@/actions/actions"
import CreateProductView from "./CreateProductView";
import Link from "next/link";

import { unstable_noStore as noStore } from "next/cache"
import { getAllCollections } from "../../adminDashboard/settings/actions"
import ErrorState from "@/components/ErrorState";
const Page =  async () => {

  try {
    

  noStore()
  const user = await getUser()
  const store = await getStoreWithProductsCount(user!.id)
  const collections = await getAllCollections()
  const categories = await getAllCategories()
  const platform  = await getPlatformForTheWebsite()

  const level = await getLevelByNumber(store.level)

  if(platform?.closeCreation) {
    return (
      <AlertDialog open={true} >
      <AlertDialogContent>
      <AlertDialogHeader className="flex flex-col items-center">
          <div className="text-red-500 mb-2">
              <OctagonAlert className=''/>
          </div>
          <AlertDialogTitle className="text-xl font-bold text-center">
              Product Creation is Deactivated ! 
          </AlertDialogTitle>
          <AlertDialogDescription>
              We will send you a notification when product creation is activated !
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link  href="/sellerDashboard" ><Button variant="link">
            Return to Seller Dashboard
              </Button>
              </Link>
          </AlertDialogFooter>
      </AlertDialogContent>
  </AlertDialog>
    )
  }
  if ((store.productCount === level.productLimit) && store.unlimitedCreation === false ) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center">
            <div className="text-red-500 mb-2">
              <OctagonAlert className='' />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-center">
              Product Creation Deactivated!
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have reached your product upload limit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link href="/sellerDashboard">
              <Button variant="link">
                Return to Seller Dashboard
              </Button>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  
  
  return (

    <>
    <CreateProductView categories={categories} platform={platform!} store={store} collections={collections} />
                          
  </>
  
  );
} catch (error) {
  console.error(error);
  return <ErrorState/>

    
}
};

export  default Page ;

