'use client'
import NextImage from 'next/image';

import {
  Home,
  LayoutDashboard,
  Menu,
  ShoppingBasket,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { useEffect, useState } from "react"
import { getFactoryDashboardCounts, getUser } from "@/actions/actions"
import { ModeToggle } from "../ModeToggle"
import Profile from "./Profile"
import { User } from "@prisma/client"
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Count {
  notPrintedOrders: number;
}

const NavBar = ({user , totalCounts} : {user : User , totalCounts : Count}) => {

  const pathname = usePathname();
  const t = useTranslations('FactoryDashboardComponents');
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
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
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
          href="/factoryDashboard"
          className={cn(
           buttonVariants({
             variant: 'ghost',
             className: 'justify-start border bg-slate-50 dark:bg-slate-600/50 gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
           }),
           {
             "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-100 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/factoryDashboard"),
           }
         )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              {t('dashboard')}
            </Link>

            <Link
                      href="/factoryDashboard/orders"
                      className={cn(
                       buttonVariants({
                         variant: 'ghost',
                         className: 'justify-start border bg-slate-50 dark:bg-slate-600/50 gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                       }),
                       {
                         "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-100 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/factoryDashboard/orders"),
                       }
                     )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-4 w-4" />
              </div>
              {t('manageOrders')}
              {(totalCounts?.notPrintedOrders ?? 0) > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (totalCounts?.notPrintedOrders ?? 0)
                    }
                </Badge>
                )}
            </Link>




            <Separator className="my-3" />



            <Link
                      href="/MarketPlace"
                      className={cn(
                       buttonVariants({
                         variant: 'ghost',
                         className: 'justify-start border bg-slate-50 dark:bg-slate-600/50 gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
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
      <Profile user={user!}/>

      </div>
    </header>
  );
};

export default NavBar;
