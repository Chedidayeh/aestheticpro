/* eslint-disable react/no-unescaped-entities */
'use server';

import DesignOrderView from "./DesignOrderView";
import ProductOrderView from "./ProductOrderView";
import {calculateTotalSellerProfitForDesigns, calculateTotalSellerProfitForProducts, getOrderWithItemsAndProducts } from "./actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ErrorState from "@/components/ErrorState";
import Link from "next/link";
import { getTranslations } from 'next-intl/server';

interface PageProps {
  params: {
    orderId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const t = await getTranslations('AdminOrderDetailsPage');
  const { orderId } = params;
  try {

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
            <Link href="/adminDashboard">
              <AlertDialogAction>{t('go_to_dashboard')}</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )
    }
    
    const productOrderProfit = await calculateTotalSellerProfitForProducts(orderId);
    const designOrderProfit = await calculateTotalSellerProfitForDesigns(orderId);



    if (!order?.isClientMadeOrder) {
      return <ProductOrderView order={order} profit={productOrderProfit} />;
    } else {
      return <DesignOrderView order={order} profit={designOrderProfit} />;
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return <ErrorState/>

  }
};

export default Page;
