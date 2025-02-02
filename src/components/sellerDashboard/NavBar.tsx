/* eslint-disable react/no-unescaped-entities */
'use client'
import Link from "next/link"
import {
  Bell,
  BookOpenCheck,
  ExternalLink,
  Home,
  LayoutDashboard,
  Menu,
  Palette,
  Receipt,
  Settings,
  Shirt,
  ShoppingBasket,
  Star,
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
import { getStoreByUserId, getUnreadNotificationsForStore, getUser } from "@/actions/actions"
import { Notification, User } from "@prisma/client"
import { ModeToggle } from "../ModeToggle"
import React from "react"
import SellerProfile from "./SellerProfile"
import LoadingLink from "../LoadingLink"


const NavBar = () => {

  const pathname = usePathname();
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([]); 
  const [storeName, setStore] = useState(""); 
// user state
const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const user = await getUser()
        if(!user) return
        setUser(user)
        const store = await getStoreByUserId(user!.id!)
        setStore(store.storeName)
        const notifications = await getUnreadNotificationsForStore(store.id)
        setNotifications(notifications); // Update count state with fetched data
      } catch (error) {
        console.error('Error fetching sidebar counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const handleButtonClick = () => {
    const url = `/MarketPlace/store/${storeName}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
          href="/sellerDashboard"
           className={cn(
            buttonVariants({
              variant: 'ghost',
              className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
            }),
            {
              "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard",
            }
          )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              Dashboard
            </LoadingLink>

            <LoadingLink
            href="/sellerDashboard/products"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/products",
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Shirt className="h-4 w-4" />
              </div>
              Products
            </LoadingLink>

            <LoadingLink
            href="/sellerDashboard/designs"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/designs",
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Palette className="h-4 w-4" />
              </div>
              Designs
            </LoadingLink>

            <LoadingLink
            href="/sellerDashboard/orders"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/orders",
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-4 w-4" />
              </div>
              Orders
            </LoadingLink>
            
            <LoadingLink
            href="/sellerDashboard/wallet"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/wallet",
              }
            )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Wallet className="h-4 w-4" />
              </div>
              Wallet
            </LoadingLink>
            
            <LoadingLink
            href="/sellerDashboard/requests"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/requests",
              }
            )}

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Receipt className="h-4 w-4" />
              </div>
              Requested Payments
            </LoadingLink>

            <LoadingLink
            href="/sellerDashboard/notifications"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/notifications",
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

            <LoadingLink
            href="/sellerDashboard/storeLevel"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/storeLevel",
              }
            )}

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Star className="h-4 w-4" />
              </div>
              Store Level
            </LoadingLink>

            
            <LoadingLink
            href="/sellerDashboard/guide"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/guide",
              }
            )}

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <BookOpenCheck className="h-4 w-4" />
              </div>
              Guide
            </LoadingLink>



            <Separator className="my-3" />


            <LoadingLink
            href="/sellerDashboard/settings"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
              }),
              {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/settings",
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

          </ScrollArea>

        </SheetContent>
      </Sheet>


      <div className="w-full flex-1">
          <div className="relative  ">
          <Button className="animate-borderPulse" variant={"outline"} size={"sm"} onClick={handleButtonClick}>
      View store               
      <ExternalLink className="ml-1 w-4 h-4"/>
    </Button>
          </div>
      </div>



      <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="secondary" size="icon" className="rounded-full">
    <Bell
        className={`h-5 w-5 ${notifications.length > 0 ? 'animate-bounce text-yellow-500' : ''}`}
      />
      <span className="sr-only">Notifications</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
  <DropdownMenuLabel className="flex justify-between items-center">
  <span>My Notifications</span>
  <Link href={"/sellerDashboard/notifications"}>
    <Button size={"sm"} variant={"link"}>View all</Button>
  </Link>
</DropdownMenuLabel>

    <DropdownMenuSeparator />
    <ScrollArea
      className={`w-full ${notifications.length > 0 ? "h-60" : ""}`}
          >    
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
      <DropdownMenuItem>You don't have any new notifications for now !</DropdownMenuItem>
    )}
    </ScrollArea>
  </DropdownMenuContent>
</DropdownMenu>

      <ModeToggle/>

      {/* user Image */}

    <SellerProfile user={user!}/>

    </header>
  );
};

export default NavBar;
