/* eslint-disable react/no-unescaped-entities */
'use client'
import {
  Bell,
  Home,
  LayoutDashboard,
  Link,
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
import { getAffiliateIdByUserId } from "@/app/(sections)/affiliateDashboard/products/actions"
import Profile from "./Profile"
import LoadingLink from "../LoadingLink"

const NavBar = () => {

  const pathname = usePathname();
  const router = useRouter()
// user state
const [user, setUser] = useState<User>();
const [notifications, setNotifications] = useState<AffiliateNotification[]>([]); 

useEffect(() => {
  const fetchCounts = async () => {
    try {
      const user = await getUser()
      if(!user) return
      setUser(user)
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

          </ScrollArea>

        </SheetContent>
      </Sheet>


      <div className="w-full flex-1">

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
  <LoadingLink href={"/affiliateDashboard/notifications"}>
    <Button size={"sm"} variant={"link"}>View all</Button>
  </LoadingLink>
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
      <DropdownMenuItem>You don't have any new notifications for now !</DropdownMenuItem>
    )}
  </DropdownMenuContent>
</DropdownMenu>

      <ModeToggle/>

      {/* user Image */}

    <Profile user={user!}/>

    </header>
  );
};

export default NavBar;
