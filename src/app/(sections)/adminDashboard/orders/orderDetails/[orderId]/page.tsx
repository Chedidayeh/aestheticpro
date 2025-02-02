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
    const productOrderProfit = await calculateTotalSellerProfitForProducts(orderId);
    const designOrderProfit = await calculateTotalSellerProfitForDesigns(orderId);

    const order = await getOrderWithItemsAndProducts(orderId);

    if(!order) {
      return (
        <AlertDialog open={true}>
        <AlertDialogContent>
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
