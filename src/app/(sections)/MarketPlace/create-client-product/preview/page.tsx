import { OctagonAlert } from 'lucide-react';
import { getUserPreOrders } from '../select-category/actions';
import { getUserPreOrder } from './actions';
import OrderPreview from './OrderPreview';
import { getPlatformForTheWebsite, getUser } from '@/actions/actions';
import ErrorState from '@/components/ErrorState';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
import LoadingLink from '@/components/LoadingLink';
import { Button } from '@/components/ui/button';
import Redirecting from '@/components/Redirecting';
type PageProps = {
  searchParams: {
    preOrderId?: string;
  };
};

const Page = async ({ searchParams }: PageProps) => {
  try {

    const user = await getUser();


    if(!user){
      return <Redirecting/>
    }


    const preOrderId = searchParams?.preOrderId || "";

    const preOrder = await getUserPreOrder(preOrderId);
    const platform = await getPlatformForTheWebsite();
    const preOrders = await getUserPreOrders(user?.id!);
    
    return <OrderPreview preOrder={preOrder} user={user!} platform={platform!} preOrders={preOrders} />;
  } catch (error) {
    console.error(error);
    return <ErrorState />;
  }
};

export default Page;
