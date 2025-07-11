/* eslint-disable react/no-unescaped-entities */
'use server'

import {
  CircleAlert,
  CircleCheck,
  CircleX,
  PackageCheck,
  ShoppingBasket,
} from "lucide-react"


import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import {  getAllOrder } from "@/actions/actions";
import React from "react"

import { db } from "@/db"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getTranslations } from 'next-intl/server';


async function getTotalCounts() {
  const [confirmedOrdersCount, deliveredOrdersCount, canceledOrdersCount , totalOrdersCount] = await Promise.all([
    db.order.count({where : { type : "CONFIRMED"}}),
    db.order.count({where : { status : "DELIVERED"}}),
    db.order.count({where : { status : "CANCELED"}}),
    db.order.count()
  ]);

  return {
    confirmedOrdersCount,
    deliveredOrdersCount,
    canceledOrdersCount,
    totalOrdersCount
  };
}


import { unstable_noStore as noStore } from "next/cache"
import { Component } from "@/components/factoryDashboard/Chart"
import ErrorState from "@/components/ErrorState"



const Page =  async () => {

  try {
    const t = await getTranslations('FactoryDashboardPage');


  noStore()


    const count = await getTotalCounts()
    const orders = await getAllOrder()


  return (
    <>


  
         <h1 className="text-2xl font-semibold">{t('dashboard_title')}</h1>



   


      <div className="flex mt-4 flex-col gap-5 w-full">

    <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">



          <Card x-chunk="dashboard-01-chunk-0" className="bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('total_confirmed_orders')}</CardTitle>
              <CircleCheck className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count.confirmedOrdersCount} orders</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1" className="bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('total_delivered_orders')}</CardTitle>
              <PackageCheck className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count.deliveredOrdersCount} orders</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3" className="bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('total_canceled_orders')}</CardTitle>
              <CircleX className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count.canceledOrdersCount} orders</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-4" className="bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('total_orders')}</CardTitle>
              <ShoppingBasket className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count.totalOrdersCount} orders</div>
            </CardContent>
          </Card>

      
    </section>

    <div className='flex flex-col space-y-5'>
    <Component />
    </div>


    <div className="flex mt-4 flex-col gap-5 w-full">
  
  <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">


    <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center bg-muted/50 rounded-t-lg">
          <div className="grid gap-2">
            <CardTitle>{t('orders')}</CardTitle>
            <CardDescription>{t('orders_displayed', {count: orders ? orders.length : 0})}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
        {orders && orders?.length > 0 ? (

            <Table>
            <ScrollArea
          className={`${
            orders.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg mt-4`}
        >                  
        <TableHeader>
                <TableRow>
                  <TableHead >{t('order_id')}</TableHead>
                  <TableHead >{t('order_status')}</TableHead>
                  <TableHead>{t('order_type')}</TableHead>
                  <TableHead>{t('order_creation_date')}</TableHead>
                  <TableHead>{t('is_order_printed')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <Badge className={`text-white ${{
                               'PROCESSING': 'bg-blue-700',
                               'DELIVERED': 'bg-green-700',
                               'REFUSED': 'bg-red-700',
                               'CANCELED': 'bg-red-700'
                             }[order.status]} hover:bg-gray-700`}>
                               {t(order.status.toLowerCase())}
                         </Badge>
                         </TableCell>
                    <TableCell>
                      <Badge className={`text-white ${order.type === 'CONFIRMED' ? 'bg-green-700' : order.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : order.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                             {t(order.type.toLowerCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</TableCell>
                    <TableCell>
                      <Badge className={`text-white ${order.printed ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
                            {order.printed ? t('is_printed') : t('not_printed')}
                      </Badge>
                    </TableCell>
                    </TableRow>
                ))
                }
              </TableBody>
              </ScrollArea>
            </Table>
        ) : (
          <div className="flex mt-2 items-center justify-center flex-col text-muted-foreground">
          <h1 className="text-center text-3xl font-bold">
            <CircleAlert />
          </h1>
          <p className="text-center text-sm mt-2">No records of any orders made for now !</p>
            <p className="text-center text-xs mt-2">New orders will appear here.</p>
        </div>
        )}
        </CardContent>
      </Card>  

      </section>
      </div>


  </div>

  </>
  );

} catch (error) {
  console.error(error);
  return <ErrorState/>

    
}
}

export default Page;