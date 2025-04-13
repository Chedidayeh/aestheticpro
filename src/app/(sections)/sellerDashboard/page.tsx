/* eslint-disable react/no-unescaped-entities */
import NextImage from 'next/image';
import {
  CreditCard,
  DollarSign,
  Eye,
  Star,
  User,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"



import Link from "next/link";

import { getLevelByNumber, getStoreByUserId, getStoreProductsViewsCount, getStoreStats, getUnreadNotificationsForStore, getUser } from "@/actions/actions";
import React from "react"
import OrderedDesigns from "@/components/sellerDashboard/OrderedDesigns"
import OrderedProducts from "@/components/sellerDashboard/OrderedProducts"
import { getStoreFollowersCount } from '../MarketPlace/store/[storeName]/actions';





import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Component } from '@/components/sellerDashboard/Chart';
import { StoresTableStats } from '@/components/sellerDashboard/StoresTableStats';
import LoadingLink from '@/components/LoadingLink';
import Redirecting from '@/components/RedirectingToHomePage';





const Page =  async () => {


  const user = await getUser()
  const store = await getStoreByUserId(user!.id!)
  if (!store) return <Redirecting/>
  const notifications = await getUnreadNotificationsForStore(store.id)
  const followersCount = await getStoreFollowersCount(store!.id);
  const productsViewsCount = await getStoreProductsViewsCount(store!.id);
  const level = await getLevelByNumber(store.level)
  const chartData = await getStoreStats();

  return (
    <>



  
         <h1 className="text-2xl font-semibold">Seller Dashboard</h1>
         <div className="w-full flex-1">
          <div className="relative ">
            <LoadingLink href={"/sellerDashboard/storeLevel"}>
            <Badge variant={"secondary"} className="text-white bg-yellow-400 hover:bg-yellow-300 ">
            <Star className="mr-1 mb-1/2 w-4 h-4 text-white"/>
            Store Level {level?.levelNumber}               
            </Badge>
            </LoadingLink>
          </div>
      </div>
         {notifications.length > 0 && (
         <LoadingLink href={"/sellerDashboard/notifications"}><Button variant={"link"}>You Have {notifications.length} unread notifications</Button></LoadingLink>
         )}

      <div className="flex flex-col items-center my-8">
      <div className="flex justify-center items-center">
        <div className="relative w-[200px] h-[200px] rounded-full bg-gray-100 border-2 shadow-xl border-gray-500 overflow-hidden">
          <NextImage
            src={store.logoUrl}
            alt="store"
            layout="fill"
            quality={40}
            className="rounded-full object-cover"
          />
        </div>
      </div>

      <div className="text-center border rounded-lg p-1 px-8  bg-muted/50 font-semibold animate-borderPulse mt-4">
      {store.storeName}
        </div>


      </div>


   


      <div className="flex flex-col gap-5 w-full">

    <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">



          <Card x-chunk="dashboard-01-chunk-0 " className='bg-muted/50'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{store.revenue.toFixed(2)} TND</div>
            </CardContent>
          </Card>


          <Card x-chunk="dashboard-01-chunk-3"  className='bg-muted/50'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sales
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{store.totalSales} sales</div>
            </CardContent>
          </Card>


          <Card x-chunk="dashboard-01-chunk-1"  className='bg-muted/50'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Followers
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{followersCount} {followersCount === 1 ? 'follower' : 'followers'}</div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-01-chunk-4"  className='bg-muted/50'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total views
                </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productsViewsCount} views</div>
            </CardContent>
          </Card>

    </section>

    
    <div className='flex flex-col space-y-5'>
    <Component storeId={store.id}/>
    <OrderedProducts/>
    <OrderedDesigns/>
    <StoresTableStats storeId={store.id} chartData={chartData} />

    </div>



  </div>

  </>
  );
}

export default Page;