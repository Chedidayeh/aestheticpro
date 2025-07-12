/* eslint-disable react/no-unescaped-entities */
'use client'
import NextImage from 'next/image';

import {
  Bell,
  Home,
  LayoutDashboard,
  Link2,
  Menu,
  Receipt,
  Settings,
  Shirt,
  ShoppingBasket,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { useEffect, useState } from "react"
import { getUnreadAffiliateNotifications, getUser } from "@/actions/actions"
import { AffiliateNotification, User } from "@prisma/client"
import { ModeToggle } from "../ModeToggle"
import React from "react"
import Profile from "./Profile"
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Switcher } from '../Switcher';

  const NavBar = ({user , notifications} : {user : User ,notifications : AffiliateNotification[]}) => {

  const pathname = usePathname();
  const t = useTranslations('AffiliateDashboardComponents');
    // open
    const [open, setOpen] = useState(false);

    useEffect(() => {
      // Close sheet whenever route/path changes
      setOpen(false);
    }, [pathname]);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">


        <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 xl:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t('toggleNavigationMenu')}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col w-full">


                  <div className='flex items-center justify-center gap-2'>
          
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
          
          
                        <Separator className='w-full my-2'/>


        <ScrollArea className="h-full w-full">
          <nav className="grid gap-3 text-lg font-medium">



          <Link
          href="/affiliateDashboard"
          className={cn(
            buttonVariants({
              variant: 'ghost',
              className: 'jjustify-start border bg-slate-50 dark:bg-slate-600/50 gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
            }),
            {
              "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-100 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/affiliateDashboard"),
            }
          )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              {t('dashboard')}
            </Link>

            <Link
            href="/affiliateDashboard/products"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'jjustify-start border bg-slate-50 dark:bg-slate-600/50 gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-100 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/affiliateDashboard/products"),
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Shirt className="h-4 w-4" />
              </div>
              {t('products')}
            </Link>

            <Link 
            href="/affiliateDashboard/manageLinks"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'jjustify-start border bg-slate-50 dark:bg-slate-600/50 gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-100 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/affiliateDashboard/manageLinks"),
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Link2 className="h-4 w-4" />
              </div>
              {t('manageLinks')}
            </Link>

  

            <Link
            href="/affiliateDashboard/orders"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'jjustify-start border bg-slate-50 dark:bg-slate-600/50 gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-100 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/affiliateDashboard/orders"),
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-4 w-4" />
              </div>
              {t('orders')}
            </Link>
            
            <Link
            href="/affiliateDashboard/wallet"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'jjustify-start border bg-slate-50 dark:bg-slate-600/50 gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-100 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/affiliateDashboard/wallet"),
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Wallet className="h-4 w-4" />
              </div>
              {t('wallet')}
            </Link>
            
            <Link
            href="/affiliateDashboard/requests"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'jjustify-start border bg-slate-50 dark:bg-slate-600/50 gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-100 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/affiliateDashboard/requests"),
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Receipt className="h-4 w-4" />
              </div>
              {t('requestedPayments')}
            </Link>

            <Link
            href="/affiliateDashboard/notifications"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'jjustify-start border bg-slate-50 dark:bg-slate-600/50 gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-100 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/affiliateDashboard/notifications"),
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Bell className="h-4 w-4" />
              </div>
              {t('notifications')}
              {notifications && notifications?.length > 0 && (
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {
                notifications?.length
                  }
              </Badge>
               )}
            </Link>


            <Separator className="my-3" />

            <Link
            href="/affiliateDashboard/settings"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'jjustify-start border bg-slate-50 dark:bg-slate-600/50 gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-100 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/affiliateDashboard/settings"),
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
                className: 'jjustify-start border bg-slate-50 dark:bg-slate-600/50 gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-100 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/MarketPlace"),
              }
            )}

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Home className="h-4 w-4" />
              </div>
              {t('marketplace')}
            </Link>

          </nav>

          </ScrollArea>

        </SheetContent>
      </Sheet>


      <div className="w-full flex-1">

      </div>

      <div className='flex items-center space-x-2'>     
      <ModeToggle/>
  
      <Switcher />


      <DropdownMenu>
  <DropdownMenuTrigger asChild>
  <Button variant="ghost" size="icon" className="border-muted-foreground dark:bg-slate-600/50 border rounded-full">
  <Bell
        className={`h-5 w-5 ${notifications.length > 0 ? 'animate-bounce text-yellow-500' : ''}`}
      />
      <span className="sr-only">{t('notifications')}</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
  <DropdownMenuLabel className="flex justify-between items-center">
  <span>{t('myNotifications')}</span>
  <Link href={"/affiliateDashboard/notifications"}>
    <Button size={"sm"} variant={"link"}>{t('viewAll')}</Button>
  </Link>
</DropdownMenuLabel>

    <DropdownMenuSeparator />
    {notifications.length > 0 ? (
      notifications.map((notification, index) => (
        <React.Fragment key={notification.id}>
          <DropdownMenuItem>
            <div className="flex flex-col">
              <span className={`text-sm ${notification.isViewed ? 'text-muted-foreground' : 'font-bold'}`}>
                {notification.content}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
          </DropdownMenuItem>
          {index < notifications.length - 1 && <DropdownMenuSeparator />}
        </React.Fragment>
      ))
    ) : (
      <DropdownMenuItem>{t('noNewNotifications')}</DropdownMenuItem>
    )}
  </DropdownMenuContent>
</DropdownMenu>


      {/* user Image */}



    <Profile user={user!}/>

    </div>



    </header>
  );
};

export default NavBar;
