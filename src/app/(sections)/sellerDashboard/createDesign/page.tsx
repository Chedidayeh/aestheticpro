
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
import LoadingLink from '@/components/LoadingLink';
import ErrorState from '@/components/ErrorState';
  
  

  
  const Page =  async () => {

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
                Design Creation is Deactivated ! 
            </AlertDialogTitle>
            <AlertDialogDescription>
                We will send you a notification when Design creation is activated !
              </AlertDialogDescription>
              <LoadingLink  href="/sellerDashboard" ><Button size={"sm"} variant="default">
              Return to Seller Dashboard
                </Button>
                </LoadingLink>
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
                Design Creation is Deactivated ! 
            </AlertDialogTitle>
            <AlertDialogDescription>
            You have reached your design upload limit.
            </AlertDialogDescription>
            <LoadingLink  href="/sellerDashboard" ><Button size={"sm"} variant="default">
              Return to Seller Dashboard
                </Button>
                </LoadingLink>
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
  
  