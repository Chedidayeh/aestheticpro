'use client'
import NextImage from 'next/image'
import {
  Bell,
  BookOpenCheck,
  Home,
  LayoutDashboard,
  Palette,
  Receipt,
  Settings,
  Shirt,
  ShoppingBasket,
  Star,
  Wallet,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { getStoreByUserId, getUnreadNotificationsForStore, getUser } from "@/actions/actions"
import { useEffect, useState } from "react"
import { Notification } from "@prisma/client"
import Link from 'next/link'
import { useTranslations } from 'next-intl';


const SideBar = ({ notifications }: { notifications: Notification[] }) => {

  const pathname = usePathname();
  const t = useTranslations('SellerDashboardComponents');

  return (
    <div className="hidden w-[230px] border-r bg-muted/40 xl:block">
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
              href="/sellerDashboard"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                }),
                {
                  "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/sellerDashboard"),
                }
              )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              {t('dashboard')}
            </Link>

            <Link
              href="/sellerDashboard/products"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                }),
                {
                  "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/sellerDashboard/products"),
                }
              )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Shirt className="h-4 w-4" />
              </div>
              {t('products')}
            </Link>

            <Link
              href="/sellerDashboard/designs"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                }),
                {
                  "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/sellerDashboard/designs"),
                }
              )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Palette className="h-4 w-4" />
              </div>
              {t('designs')}
            </Link>

            <Link
              href="/sellerDashboard/orders"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                }),
                {
                  "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/sellerDashboard/orders"),
                }
              )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket className="h-4 w-4" />
              </div>
              {t('orders')}
            </Link>

            <Link
              href="/sellerDashboard/wallet"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                }),
                {
                  "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/sellerDashboard/wallet"),
                }
              )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Wallet className="h-4 w-4" />
              </div>
              {t('wallet')}
            </Link>

            <Link
              href="/sellerDashboard/requests"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                }),
                {
                  "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/sellerDashboard/requests"),
                }
              )}

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Receipt className="h-4 w-4" />
              </div>
              {t('requestedPayments')}
            </Link>

            <Link
              href="/sellerDashboard/notifications"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                }),
                {
                  "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/sellerDashboard/notifications"),
                }
              )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Bell className="h-4 w-4" />
              </div>
              {t('notifications')}
              {notifications && notifications?.length > 0 && (
                <Badge className="ml-auto text-white flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                    notifications?.length
                  }
                </Badge>
              )}
            </Link>

            <Link
              href="/sellerDashboard/storeLevel"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                }),
                {
                  "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/sellerDashboard/storeLevel"),
                }
              )}

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Star className="h-4 w-4" />
              </div>
              {t('storeLevel')}
            </Link>


            <Link
              href="/sellerDashboard/guide"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                }),
                {
                  "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/sellerDashboard/guide"),
                }
              )}

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <BookOpenCheck className="h-4 w-4" />
              </div>
              {t('guide')}
            </Link>



            <Separator className="my-3" />


            <Link
              href="/sellerDashboard/settings"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                }),
                {
                  "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/sellerDashboard/settings"),
                }
              )}

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Settings className="h-4 w-4" />
              </div>
              {t('settings')}
            </Link>


            <Link
              href="/MarketPlace"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                }),
                {
                  "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/MarketPlace",
                }
              )}


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
