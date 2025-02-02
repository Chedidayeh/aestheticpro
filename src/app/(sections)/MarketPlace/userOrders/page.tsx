'use server'

import OrderData from './OrderData';
import { getUserOrders } from './actions';
import { getUser } from '@/actions/actions';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link, OctagonAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ErrorState from '@/components/ErrorState';

const Page = async () => {

try {

  const user = await getUser()


  const orders = await getUserOrders(user?.id ?? "")

    
    return (
    <OrderData
        ordersData={orders}
    />
    );

  }
  catch (error) {
    console.log(error)
    return <ErrorState/>

  }

}

export default Page ;

