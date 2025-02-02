'use client'
import {
  Bell,
  HandCoins,
  Home,
  Layers3,
  LayoutDashboard,
  LayoutGrid,
  Menu,
  Palette,
  RotateCcw,
  Settings,
  Shirt,
  ShoppingBasket,
  Store,
  User as U,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { useEffect, useState } from "react"
import { getSideBarTotalCounts, getUser } from "@/actions/actions"
import { ModeToggle } from "../ModeToggle"
import { User } from "@prisma/client"
import AdminProfile from "./AdminProfile"
import LoadingLink from "../LoadingLink"

interface Count {
  printedOrdersCount: number;
  awaitingActionProductCount: number;
  awaitingActionDesignCount: number;
  storeRequestsCount: number;
  affiliateRequestsCount : number
  returnedOrders : number
}

const NavBar = () => {

  const pathname = usePathname();
  const router = useRouter()
  const [count, setCount] = useState<Count>(); // Initialize count state
  const [user, setUser] = useState<User>();


  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const user = await getUser()
        if(!user) return
        setUser(user)
        const totalCounts = await getSideBarTotalCounts()
        setCount(totalCounts); // Update count state with fetched data
      } catch (error) {
        console.error('Error fetching sidebar counts:', error);
      }
    };

    fetchCounts();
  }, []);
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 xl:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col w-[60%] sm:w-[35%]">
        <ScrollArea className="h-full w-full">
          <nav className="grid gap-2 text-lg font-medium mt-6">

          <LoadingLink
          href="/adminDashboard"
          className={cn(
            buttonVariants({
              variant: 'ghost',
              className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
            }),
            {
              "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard",
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
            " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/users"
          })}
          href="/adminDashboard/users"
        >
          <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
            <U className="h-4 w-4" />
          </div>
          Manage Users
        </LoadingLink>

            <LoadingLink
            href="/adminDashboard/stores"
            className={cn(buttonVariants({
              variant: 'ghost',
              className: "justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50"
            }), {
              " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/stores"
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
              " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/requests"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <HandCoins className="h-4 w-4" />
              </div>
              Manage Requests
              {(count?.storeRequestsCount ?? 0) > 0 && (count?.affiliateRequestsCount ?? 0) > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (count?.storeRequestsCount ?? 0) + (count?.affiliateRequestsCount ?? 0)
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
              " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/products"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Shirt className="h-4 w-4" />
              </div>
              Manage Products
              {(count?.awaitingActionProductCount ?? 0) > 0 && (
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {
                (count?.awaitingActionProductCount ?? 0)
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
              " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/designs"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Palette className="h-4 w-4" />
              </div>
              Manage Designs
              {(count?.awaitingActionDesignCount ?? 0) > 0 && (
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {
                (count?.awaitingActionDesignCount ?? 0)
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
              " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/orders"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-4 w-4" />
              </div>
              Manage Orders
              {(count?.printedOrdersCount ?? 0) > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (count?.printedOrdersCount ?? 0)
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
              " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/returns"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <RotateCcw  className="h-4 w-4" />
              </div>
              
              Manage Returns
              {(count?.returnedOrders ?? 0) > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (count?.returnedOrders ?? 0)
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
              " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/stock"
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
              " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/category"
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
              " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/notifications"
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
              " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/settings"
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
              " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/MarketPlace"
            })}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Home className="h-4 w-4" />
              </div>
              MarketPlace
            </LoadingLink>

          </nav>

          </ScrollArea>

        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">

      </div>

      <ModeToggle/>

      <AdminProfile user={user!}/>

    </header>
  );
};

export default NavBar;
