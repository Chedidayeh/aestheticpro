'use client'
import NextImage from 'next/image'
import {
  Bell,
  HandCoins,
  Home,
  Layers3,
  LayoutDashboard,
  LayoutGrid,
  Palette,
  RotateCcw,
  Settings,
  Shirt,
  ShoppingBasket,
  Store,
  User,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { getSideBarTotalCounts } from "@/actions/actions"
import { useEffect, useState } from "react"
import Link from 'next/link'
import { useTranslations } from 'next-intl';


interface Count {
  printedOrdersCount: number;
  awaitingActionProductCount: number;
  awaitingActionDesignCount: number;
  storeRequestsCount: number;
  affiliateRequestsCount : number
  returnedOrders : number
}
const SideBar = ({totalCounts} : {totalCounts : Count}) => {

    const pathname = usePathname();
    const t = useTranslations('AdminDashboardComponents');


  return (
    <div className="hidden w-[250px] border-r bg-muted/40 xl:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14  items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
        <div className='flex items-center gap-2'>

      {/* logo */}

      <Link href="/">
      <div
      style={{ width: '50px', height: '50px' }}
      className="h-full xl:right-0 sm:items-center"
      >
      <NextImage
      src="/aestheticpro.png"
      width={1000}
      height={1000}
      alt="logo"
      draggable={false}
      />
      </div>
      </Link>

      {/* text */}
      <div className='text-sm  font-semibold'>
      <Link href="/">
      <p>{t('brandName')}</p>
      <p>{t('brandPlatform')}</p>
      </Link>
      </div>

      </div>
        </div>
        <div className="flex-1 mt-4">
          <nav className="grid items-start space-y-2 px-2 text-sm font-medium lg:px-4">
         
          <Link
          href="/adminDashboard"
          className={cn(
            buttonVariants({
              variant: 'ghost',
              className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
            }),
            {
              "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/adminDashboard"),
            }
          )}
        >
          <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          {t('dashboard')}
        </Link>


        <Link
          className={cn(buttonVariants({
            variant: 'ghost',
            className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
          }), {
            " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/adminDashboard/users")
          })}
          href="/adminDashboard/users"
        >
          <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
            <User className="h-4 w-4" />
          </div>
          {t('manageUsers')}
        </Link>

            <Link
            href="/adminDashboard/stores"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/adminDashboard/stores")
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Store className="h-4 w-4" />
              </div>
              {t('manageStores')}
            </Link>

            <Link
            href="/adminDashboard/requests"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/adminDashboard/requests")
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <HandCoins className="h-4 w-4" />
              </div>
              {t('manageRequests')}
              {(totalCounts.storeRequestsCount > 0 || totalCounts.affiliateRequestsCount > 0) && (
                <Badge className="ml-auto text-white flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (totalCounts.storeRequestsCount ?? 0) + (totalCounts.affiliateRequestsCount ?? 0)
                    }
                </Badge>
                )}
            </Link>

            <Link
            href="/adminDashboard/products"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/adminDashboard/products")
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Shirt className="h-4 w-4" />
              </div>
              {t('manageProducts')}
              {(totalCounts?.awaitingActionProductCount ?? 0) > 0 && (
              <Badge className="ml-auto text-white flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {
                (totalCounts?.awaitingActionProductCount ?? 0)
                  }
              </Badge>
               )}
            </Link>

            <Link
            href="/adminDashboard/designs"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/adminDashboard/designs")
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Palette className="h-4 w-4" />
              </div>
              {t('manageDesigns')}
              {(totalCounts?.awaitingActionDesignCount ?? 0) > 0 && (
              <Badge className="ml-auto text-white flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {
                (totalCounts?.awaitingActionDesignCount ?? 0)
                  }
              </Badge>
               )}
            </Link>
            
            <Link
            href="/adminDashboard/orders"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/adminDashboard/orders")
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-4 w-4" />
              </div>
              {t('manageOrders')}
              {(totalCounts?.printedOrdersCount ?? 0) > 0 && (
                <Badge className="ml-auto text-white flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (totalCounts?.printedOrdersCount ?? 0)
                    }
                </Badge>
                )}
            </Link>

            <Link
            href="/adminDashboard/returns"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/adminDashboard/returns")
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <RotateCcw  className="h-4 w-4" />
              </div>
              
              {t('manageReturns')}
              {(totalCounts?.returnedOrders ?? 0) > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (totalCounts?.returnedOrders ?? 0)
                    }
                </Badge>
                )}
            </Link>
            
            <Link
            href="/adminDashboard/stock"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/adminDashboard/stock")
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Layers3 className="h-4 w-4" />
              </div>
              {t('manageStock')}
            </Link>

            <Link
            href="/adminDashboard/category"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/adminDashboard/category")
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutGrid className="h-4 w-4" />
              </div>
              {t('manageCategories')}
            </Link>

            
 

            <Link
            href="/adminDashboard/notifications"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/adminDashboard/notifications")
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Bell className="h-4 w-4" />
              </div>
              {t('sendNotification')}
            </Link>

            <Separator className="my-3" />

 


            <Link
            href="/adminDashboard/settings"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/adminDashboard/settings")
            })}

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Settings className="h-4 w-4" />
              </div>
              {t('settings')}
            </Link>

            <Link
            href="/MarketPlace"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/MarketPlace")
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Home className="h-4 w-4" />
              </div>
              {t('marketplace')}
            </Link>
          </nav>

          
        </div>
      </div>
    </div>
  );
};

export default SideBar;
