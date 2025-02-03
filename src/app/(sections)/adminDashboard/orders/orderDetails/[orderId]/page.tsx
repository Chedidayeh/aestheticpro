/* eslint-disable react/no-unescaped-entities */
'use server';

import LoadingLink from "@/components/LoadingLink";
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

interface PageProps {
  params: {
    orderId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { orderId } = params;
  try {

    const order = await getOrderWithItemsAndProducts(orderId);

    if(!order) {
      return (
        <AlertDialog open={true}>
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader>
            <AlertDialogTitle>No Order Found</AlertDialogTitle>
            <AlertDialogDescription>
              We couldn't find the order with the provided ID. Please check the order ID and try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <LoadingLink href="/adminDashboard">
              <AlertDialogAction>Go to Dashboard</AlertDialogAction>
            </LoadingLink>
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
