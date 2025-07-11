/* eslint-disable react/no-unescaped-entities */
'use server';

import Link from "next/link";
import DesignOrderView from "./DesignOrderView";
import ProductOrderView from "./ProductOrderView";
import { getOrderWithItemsAndProducts } from "./actions";
import { getTranslations } from 'next-intl/server';

interface PageProps {
  params: {
    orderId: string;
  };
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


import { unstable_noStore as noStore } from "next/cache"
import ErrorState from "@/components/ErrorState";



const Page = async ({ params }: PageProps) => {

  noStore()

  const { orderId } = params;
  try {
    const t = await getTranslations('FactoryDashboardPage');

    const order = await getOrderWithItemsAndProducts(orderId);
    if(!order) {
      return (
        <AlertDialog open={true}>
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader>
            <AlertDialogTitle>{t('no_order_found')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('no_order_found_desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link href="/factoryDashboard">
              <AlertDialogAction className="text-white">{t('go_to_dashboard')}</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )
    }
    if(!order?.isClientMadeOrder){
      return <ProductOrderView order={order} />;
    }
    else {
      return <DesignOrderView order={order}  />;
    }

  } catch (error) {
    console.error('Error fetching order:', error);
    return <ErrorState/>

  }
};

export default Page;
