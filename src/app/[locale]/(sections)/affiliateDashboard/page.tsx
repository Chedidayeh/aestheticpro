/* eslint-disable react/no-unescaped-entities */
import {
  DollarSign,
  Link2,
  MousePointerClick,
  Receipt,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import Link from "next/link";

import { getAffiliateLinksAndCommissions, getAffiliateStats, getAllCommissionsByAffiliateId, getUnreadAffiliateNotifications, getUser } from "@/actions/actions";
import React from "react"
import BanUser from '@/components/BanUser';
import CommissionsTable from '@/components/affiliateDashboard/CommissionsTable';
import { Component } from '@/components/affiliateDashboard/AffiliateChart';
import Redirecting from "@/components/Redirecting";
import { getTranslations } from 'next-intl/server';








const Page =  async () => {
  const t = await getTranslations('AffiliateDashboardPage');


  const user = await getUser()

  if(!user || !user.isAffiliate) {
    <Redirecting/>
   }
   
  const affiliate = await getAffiliateLinksAndCommissions(user ? user.id : "")
  const affiliateStats  = await getAffiliateStats(user!.id)
  const commissions = await getAllCommissionsByAffiliateId(affiliate!.id)
  const notifications = await getUnreadAffiliateNotifications(affiliate!.id)



  return (
    <>





  
         <h1 className="text-2xl font-semibold">{t('title')}</h1>
         {notifications.length > 0 && (
         <Link href={"/affiliateDashboard/notifications"}>
         <Button variant={"link"}>{t('unread_notifications', {count: notifications.length})}</Button>
         </Link>
         )}


   


      <div className="flex flex-col gap-5 w-full my-4">

    <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">



          <Card x-chunk="dashboard-01-chunk-0"  className='bg-muted/50'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('total_revenue')}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliate!.totalIncome.toFixed(2)} TND</div>
            </CardContent>
          </Card>


          <Card x-chunk="dashboard-01-chunk-3"  className='bg-muted/50'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('total_links')}
              </CardTitle>
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliate?.links.length}</div>
            </CardContent>
          </Card>


          <Card x-chunk="dashboard-01-chunk-1"  className='bg-muted/50'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('total_clicks')}
              </CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{affiliateStats.totalClicks}</div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-01-chunk-4"  className='bg-muted/50'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('total_sales')}
                </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{affiliateStats.totalSales}</div>
            </CardContent>
          </Card>

      
    </section>


    <div className='flex flex-col space-y-5'>
    <Component affiliateId={affiliate!.id} />
    <CommissionsTable commissions={commissions} affiliateStats={affiliateStats} />
    </div>



  </div>

  </>
  );
}

export default Page;