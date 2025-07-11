
  import React from 'react';

  import { getLevelByNumber, getPlatformForTheWebsite, getUser } from "@/actions/actions"

  import CreateDesignView from "./CreateDesignView";
  
  import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { OctagonAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStoreWithDesignsCount } from './actions';
import ErrorState from '@/components/ErrorState';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
  
  

  
  const Page =  async () => {
    const t = await getTranslations('SellerCreateDesignPage');

    try {
      

    

    const platform  = await getPlatformForTheWebsite()
    const user = await getUser()
    const store = await getStoreWithDesignsCount(user?.id!)
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
                {t('design_creation_deactivated')} 
            </AlertDialogTitle>
            <AlertDialogDescription>
                {t('design_creation_notify')}
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

    if ((store.designsCount === level.designLimit) && store.unlimitedCreation === false ) {
      return (
        <AlertDialog open={true} >
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader className="flex flex-col items-center">
            <div className="text-red-500 mb-2">
                <OctagonAlert className=''/>
            </div>
            <AlertDialogTitle className="text-xl font-bold text-center">
                {t('design_creation_deactivated')} 
            </AlertDialogTitle>
            <AlertDialogDescription>
            {t('design_limit_reached')}
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

    return (
  
      <>
      <CreateDesignView  platform={platform!} store={store} />
                            
    </>
    
    );
  } catch (error) {
    console.error(error);
    return <ErrorState/>

      
  }
  };
  
  export  default Page ;
  
  