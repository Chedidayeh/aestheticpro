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
import LoadingLink from '../LoadingLink'


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


  return (
    <div className="hidden w-[240px] border-r bg-muted/40 xl:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14  items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
        <div className='flex items-center gap-2'>

      {/* logo */}

      <LoadingLink href="/">
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
      </LoadingLink>

      {/* text */}
      <div className='text-sm  font-semibold'>
      <LoadingLink href="/">
      <p>Aesthetic Pro</p>
      <p>Platform ✨</p>
      </LoadingLink>
      </div>

      </div>
        </div>
        <div className="flex-1 mt-4">
          <nav className="grid items-start space-y-2 px-2 text-sm font-medium lg:px-4">
         
          <LoadingLink
          href="/adminDashboard"
          className={cn(
            buttonVariants({
              variant: 'ghost',
              className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
            }),
            {
              "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard",
            }
          )}
        >
          <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          Dashboard
        </LoadingLink>


        <LoadingLink
          className={cn(buttonVariants({
            variant: 'ghost',
            className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
          }), {
            " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/users"
          })}
          href="/adminDashboard/users"
        >
          <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
            <User className="h-4 w-4" />
          </div>
          Manage Users
        </LoadingLink>

            <LoadingLink
            href="/adminDashboard/stores"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/stores"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Store className="h-4 w-4" />
              </div>
              Manage Stores
            </LoadingLink>

            <LoadingLink
            href="/adminDashboard/requests"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/requests"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <HandCoins className="h-4 w-4" />
              </div>
              Manage Requests
              {(totalCounts.storeRequestsCount > 0 || totalCounts.affiliateRequestsCount > 0) && (
                <Badge className="ml-auto text-white flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (totalCounts.storeRequestsCount ?? 0) + (totalCounts.affiliateRequestsCount ?? 0)
                    }
                </Badge>
                )}
            </LoadingLink>

            <LoadingLink
            href="/adminDashboard/products"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/products"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Shirt className="h-4 w-4" />
              </div>
              Manage Products
              {(totalCounts?.awaitingActionProductCount ?? 0) > 0 && (
              <Badge className="ml-auto text-white flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {
                (totalCounts?.awaitingActionProductCount ?? 0)
                  }
              </Badge>
               )}
            </LoadingLink>

            <LoadingLink
            href="/adminDashboard/designs"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/designs"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Palette className="h-4 w-4" />
              </div>
              Manage Designs
              {(totalCounts?.awaitingActionDesignCount ?? 0) > 0 && (
              <Badge className="ml-auto text-white flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {
                (totalCounts?.awaitingActionDesignCount ?? 0)
                  }
              </Badge>
               )}
            </LoadingLink>
            
            <LoadingLink
            href="/adminDashboard/orders"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/orders"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-4 w-4" />
              </div>
              Manage Orders
              {(totalCounts?.printedOrdersCount ?? 0) > 0 && (
                <Badge className="ml-auto text-white flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (totalCounts?.printedOrdersCount ?? 0)
                    }
                </Badge>
                )}
            </LoadingLink>

            <LoadingLink
            href="/adminDashboard/returns"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/returns"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <RotateCcw  className="h-4 w-4" />
              </div>
              
              Manage Returns
              {(totalCounts?.returnedOrders ?? 0) > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (totalCounts?.returnedOrders ?? 0)
                    }
                </Badge>
                )}
            </LoadingLink>
            
            <LoadingLink
            href="/adminDashboard/stock"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/stock"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Layers3 className="h-4 w-4" />
              </div>
              Manage Stock
            </LoadingLink>

            <LoadingLink
            href="/adminDashboard/category"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/category"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutGrid className="h-4 w-4" />
              </div>
              Manage Categories
            </LoadingLink>

            
 

            <LoadingLink
            href="/adminDashboard/notifications"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/notifications"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Bell className="h-4 w-4" />
              </div>
              Send Notification
            </LoadingLink>

            <Separator className="my-3" />

 


            <LoadingLink
            href="/adminDashboard/settings"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/settings"
            })}

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Settings className="h-4 w-4" />
              </div>
              Settings
            </LoadingLink>

            <LoadingLink
            href="/MarketPlace"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/MarketPlace"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Home className="h-4 w-4" />
              </div>
              MarketPlace
            </LoadingLink>
          </nav>

          
        </div>
      </div>
    </div>
  );
};

export default SideBar;
