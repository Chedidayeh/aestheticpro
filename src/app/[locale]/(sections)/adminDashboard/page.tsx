/* eslint-disable react/no-unescaped-entities */
'use server'

import {
  DollarSign,
  Palette,
  Shirt,
  Store,
} from "lucide-react"


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { getPlatformForTheWebsite, getStoreStats, getTotalCounts } from "@/actions/actions";
import React from "react"
import { unstable_noStore as noStore } from "next/cache"
import { Component } from "@/components/adminDashboard/Chart";
import { StoresTableStats } from "@/components/adminDashboard/StoresTableStats";
import { ProductsViewsChart } from "@/components/adminDashboard/ProductsViewsChart";
import ReportData from "@/components/adminDashboard/ReportData";
import { getTranslations } from 'next-intl/server';


export default async function Page() {
    noStore()
    const t = await getTranslations('AdminDashboardPage');
    const count = await getTotalCounts()
    const platform = await getPlatformForTheWebsite()

  return (
    <>


  
         <h1 className="text-2xl font-semibold">{t('dashboard_title')}</h1>
         {count.awaitingActionProductCount + count.awaitingActionDesignCount > 0 && (
         <Link 
         href={"/adminDashboard/stores"}>
          <Button variant={"link"} >
            {t('under_review_elements', {count: count.awaitingActionProductCount + count.awaitingActionDesignCount})}
            </Button>
          </Link>
         )}

         <ReportData/>



  


      <div className="flex mt-4 flex-col gap-5 w-full">

    <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">


          <Card x-chunk="dashboard-01-chunk-0" className="bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('total_revenue')}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(platform!.profit)!.toFixed(2)} TND</div>
              <p className="text-muted-foreground text-xs mt-2">{t('total_income_label')} <span className="font-bold">{platform?.totalIncome?.toFixed(2)} TND</span></p>

            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1" className="bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('total_products')}
              </CardTitle>
              <Shirt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count.productCount} {t('products_label')}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3" className="bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('total_designs')}
              </CardTitle>
              <Palette className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count.sellerDesignCount} {t('designs_label')}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-4" className="bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('total_stores')}
                </CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count.storeCount} {t('stores_label')}</div>
            </CardContent>
          </Card>



      
    </section>



    <div className='flex flex-col space-y-5'>
    <Component />
    <ProductsViewsChart/>
    <StoresTableStats />

    </div>






  </div>

  </>
  );
}

