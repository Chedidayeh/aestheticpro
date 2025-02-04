'use client'
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
import LoadingLink from "../LoadingLink"

interface Count {
  notPrintedOrders: number;
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
        const totalCounts = await getFactoryDashboardCounts();
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
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col w-[60%] sm:w-[35%]">
        <ScrollArea className="h-full w-full">
        <nav className="grid gap-2 text-lg font-medium mt-6">



          <LoadingLink
          href="/factoryDashboard"
          className={cn(
           buttonVariants({
             variant: 'ghost',
             className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
           }),
           {
             "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/factoryDashboard",
           }
         )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              Dashboard
            </LoadingLink>

            <LoadingLink
                      href="/factoryDashboard/orders"
                      className={cn(
                       buttonVariants({
                         variant: 'ghost',
                         className: 'justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50',
                       }),
                       {
                         "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600 transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/factoryDashboard/orders",
                       }
                     )}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-4 w-4" />
              </div>
              
              Manage Orders
              {(count?.notPrintedOrders ?? 0) > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (count?.notPrintedOrders ?? 0)
                    }
                </Badge>
                )}
            </LoadingLink>




            <Separator className="my-3" />



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
      <ModeToggle/>
      <Profile user={user!}/>
    </header>
  );
};

export default NavBar;
