'use client'
import NextImage from 'next/image'
import {
  Bell,
  Home,
  LayoutDashboard,
  Link,
  Receipt,
  Settings,
  Shirt,
  ShoppingBasket,
  Wallet,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import {  getUnreadAffiliateNotifications, getUser } from "@/actions/actions"
import { useEffect, useState } from "react"
import { AffiliateNotification } from "@prisma/client"
import { getAffiliateIdByUserId } from '@/app/(sections)/affiliateDashboard/products/actions'
import LoadingLink from '../LoadingLink'



const SideBar = () => {

  const pathname = usePathname();
  const router = useRouter()
  // user state
  const [notifications, setNotifications] = useState<AffiliateNotification[]>([]); 

    useEffect(() => {
      const fetchCounts = async () => {
        try {
          const user = await getUser()
          if(!user) return
          const affiliateId = await getAffiliateIdByUserId(user.id)
          const notifications = await getUnreadAffiliateNotifications(affiliateId)
          setNotifications(notifications); 
        } catch (error) {
          console.error('Error fetching sidebar counts:', error);
        }
      };
    
      fetchCounts();
    }, []);

  return (
    <div className="hidden w-[230px] border-r bg-muted/40 xl:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14  items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
        <div style={{ width: '50px', height: '50px' }} className='h-full animate-pulse'>
          <NextImage
              src={"/aestheticpro.png"}
              width={1000}
              height={1000}
              alt="logo"
          />
      </div>
        </div>
        <div className="flex-1 mt-4">
          <nav className="grid items-start space-y-2 px-2 text-sm font-medium lg:px-4">
         
          <LoadingLink
          href="/affiliateDashboard"
          className={cn(
            buttonVariants({
              variant: 'ghost',
              className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
            }),
            {
              "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard",
            }
          )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              Dashboard
            </LoadingLink>

            <LoadingLink
            href="/affiliateDashboard/products"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/products",
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Shirt className="h-4 w-4" />
              </div>
              Products
            </LoadingLink>

            <LoadingLink 
            href="/affiliateDashboard/manageLinks"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/manageLinks",
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Link className="h-4 w-4" />
              </div>
              Manage Links
            </LoadingLink>

  

            <LoadingLink
            href="/affiliateDashboard/orders"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/orders",
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-4 w-4" />
              </div>
              Orders
            </LoadingLink>
            
            <LoadingLink
            href="/affiliateDashboard/wallet"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/wallet",
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Wallet className="h-4 w-4" />
              </div>
              Wallet
            </LoadingLink>
            
            <LoadingLink
            href="/affiliateDashboard/requests"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/requests",
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Receipt className="h-4 w-4" />
              </div>
              Requested Payments
            </LoadingLink>

            <LoadingLink
            href="/affiliateDashboard/notifications"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/notifications",
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Bell className="h-4 w-4" />
              </div>
              Notifications
              {notifications && notifications?.length > 0 && (
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {
                notifications?.length
                  }
              </Badge>
               )}
            </LoadingLink>


            <Separator className="my-3" />

            <LoadingLink
            href="/affiliateDashboard/settings"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/settings",
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Settings className="h-4 w-4" />
              </div>
              Settings
            </LoadingLink>

            <LoadingLink
            href="/MarketPlace"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/MarketPlace",
              }
            )}

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
