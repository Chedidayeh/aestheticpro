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
import { getTranslations } from 'next-intl/server';

const Page =  async () => {
  const t = await getTranslations('SellerCreateProductPage');

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
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader className="flex flex-col items-center">
          <div className="text-red-500 mb-2">
              <OctagonAlert className=''/>
          </div>
          <AlertDialogTitle className="text-xl font-bold text-center">
              {t('product_creation_deactivated')}
          </AlertDialogTitle>
          <AlertDialogDescription>
              {t('product_creation_notify')}
            </AlertDialogDescription>
            <Link  href="/sellerDashboard" ><Button size={"sm"} variant="default">
            {t('return_to_dashboard')}
              </Button>
              </Link>
          </AlertDialogHeader>
      </AlertDialogContent>
  </AlertDialog>
    )
  }
  if ((store.productCount === level.productLimit) && store.unlimitedCreation === false ) {
    return (
      <AlertDialog open={true}>
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader className="flex flex-col items-center">
            <div className="text-red-500 mb-2">
              <OctagonAlert className='' />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-center">
              {t('product_creation_deactivated')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('product_limit_reached')}
            </AlertDialogDescription>
            <Link  href="/sellerDashboard" ><Button size={"sm"} variant="default">
            {t('return_to_dashboard')}
              </Button>
              </Link>
          </AlertDialogHeader>
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

