'use client'
import NextImage from 'next/image'
import {
  Home,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { getFactoryDashboardCounts } from "@/actions/actions"
import { useEffect, useState } from "react"
import Link from 'next/link'
import { useTranslations } from 'next-intl';


interface Count {
  notPrintedOrders: number;

}
const SideBar = ({totalCounts} : {totalCounts : Count}) => {

    const pathname = usePathname();
    const router = useRouter()
    const [count, setCount] = useState<Count>(); // Initialize count state
    const t = useTranslations('FactoryDashboardComponents');


    useEffect(() => {
      const fetchCounts = async () => {
        try {
          const totalCounts = await getFactoryDashboardCounts();
          setCount(totalCounts); // Update count state with fetched data
        } catch (error) {
          console.error('Error fetching sidebar counts:', error);
        }
      };
  
      fetchCounts();
    }, []);

  return (
    <div className="hidden w-[230px] border-r bg-muted/40 md:block">
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
          href="/factoryDashboard"
          className={cn(
           buttonVariants({
             variant: 'ghost',
             className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
           }),
           {
             "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/factoryDashboard"),
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
                         className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                       }),
                       {
                         "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/factoryDashboard/orders"),
                       }
                     )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-4 w-4" />
              </div>
              
              {t('manageOrders')}
              {(count?.notPrintedOrders ?? 0) > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (count?.notPrintedOrders ?? 0)
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
                         className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                       }),
                       {
                         "gap-2 rounded-lg bg-slate-200 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.endsWith("/MarketPlace"),
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
