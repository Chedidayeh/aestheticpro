/* eslint-disable @next/next/no-async-client-component */
'use server'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { db } from '@/db';
import { error } from 'console';
import DesignConfigurator from './DesignConfigurator';
import { getAllCategories } from '../select-category/actions';
import { OctagonAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPlatformForTheWebsite, getUser } from "@/actions/actions";
import ErrorState from "@/components/ErrorState";

import Redirecting from "@/components/Redirecting";
import { getTranslations } from 'next-intl/server';


interface PageProps {
  searchParams: {
    [key: string]: string  | undefined
  }
}


const Page = async ({ searchParams }: PageProps) => {
  const t = await getTranslations('MarketPlaceCreateClientProductUpload');
  try {

    const user = await getUser()

    if(!user){
      return <Redirecting/>
    }

    

  const categories = await getAllCategories()

  const { category } = searchParams;

  const selectedCat = getCategoryByLabel(category ?? "");

  function getCategoryByLabel(label: string) {
    if (label) {
      return categories.find((category) => category.label === label);
    }
    return undefined;
  }
  
  
  const sellersDesigns = await db.sellerDesign.findMany({
    where: { 
      isDesignForSale : true,
      isDesignAccepted : true,
    },
    include : {
      store : true
    }
  });


    const platform  = await getPlatformForTheWebsite()


    if(selectedCat?.disableCategory === true) {
      return (
        <>
        <AlertDialog open={true} >
        <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
        <AlertDialogHeader className="flex flex-col items-center">
  <div className="text-red-500 mb-2">
  <OctagonAlert className='' />
  </div>
  <AlertDialogTitle className="text-xl font-bold text-center">
  {t('category_unavailable')}
  </AlertDialogTitle>
  <AlertDialogDescription>
  {t('return_previous')}
  </AlertDialogDescription>
  <Link  href="/MarketPlace/create-client-product/select-category" ><Button size={"sm"} variant="default">
  {t('return')}
      </Button>
      </Link>
  </AlertDialogHeader>
  </AlertDialogContent>
        </AlertDialog>
        <div className="mb-40"></div>
        </>
      )
    }



  return (
    <>

    {categories.length !== 0  ? ( 

      <DesignConfigurator
      SellersDesignsData={sellersDesigns}
      selectedCategory = {selectedCat || null}
      categories={categories}
      platform={platform!}
      user={user!}
    />
    ) : (
      <>
      <AlertDialog open={true} >
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader className="flex flex-col items-center">
<div className="text-red-500 mb-2">
<OctagonAlert className='' />
</div>
<AlertDialogTitle className="text-xl font-bold text-center">
{t('no_category_found')}
</AlertDialogTitle>
<AlertDialogDescription>
{t('return_previous')}
</AlertDialogDescription>
<Link  href="/MarketPlace/create-client-product/select-category" ><Button size={"sm"} variant="default">
  {t('return')}
    </Button>
    </Link>
</AlertDialogHeader>
</AlertDialogContent>
      </AlertDialog>
      <div className="mb-40"></div>
      </>
    )}

</>

  
  );
} catch (error) {

  return <ErrorState/>

    
}
};

export  default Page ;

