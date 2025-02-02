import NextImage from 'next/image'
import { DialogClose } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MaxWidthWrapper from './MaxWidthWrapper'
import { buttonVariants } from './ui/button'
import { CircleDollarSign, Heart, Home, Menu, Shirt, ShoppingBasket, ShoppingCart, Store, UserRoundX } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { fetchCartProductCount, getAllProductsCategories, getUser, getUserOrders } from '@/actions/actions'
import UserProfile from './UserProfile'
import { ModeToggle } from './ModeToggle'
import { db } from '@/db'
import { getUserFavoriteList } from '@/app/(sections)/MarketPlace/favList/actions'
import { countBestSellingProducts } from '@/app/(sections)/MarketPlace/BestSelling/actions'
import LoadingLink from './LoadingLink'
import { cn } from '@/lib/utils'
import ErrorState from './ErrorState'


const Navbar = async () => {

  try {
    


  const user = await getUser()
  const platform = await db.platform.findFirst()
  const cartProductList = await fetchCartProductCount(user?.id ? user.id : "")
  const orders = await getUserOrders(user?.id ? user.id : "")
  const favListProducts = await getUserFavoriteList(user?.id? user?.id : "");
  const categories = await getAllProductsCategories()
  const bestSellingProducts = await countBestSellingProducts();

  return (
    <nav className='sticky z-[100] h-14 inset-x-0 top-0 w-full  backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between'>
          {/* Logo */}
          <div
            style={{ width: '40px', height: '40px' }}
            className="hidden xl:block h-full xl:right-0 sm:items-center"
          >
            <NextImage
              src="/aestheticpro.png"
              width={1000}
              height={1000}
              alt="logo"
              draggable={false}
            />
          </div>




          {/* Hamburger Icon for Small Devices */}
          <Sheet>
            <SheetTrigger className="flex xl:hidden">
            <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
          </Button>            
          </SheetTrigger>
            <SheetContent side="top" className='w-full'>
              {/* Middle Section for small devices */}
              <div className='flex justify-center items-center flex-col space-y-4 mt-20'>
                <DialogClose>
                <LoadingLink href="/" className={buttonVariants({
                  size: 'sm',
                  variant: 'outline',
                  className: "hover:text-blue-500"
                })}>
                  <Home size={15} className='mr-1' />
                  Home
                </LoadingLink>
                </DialogClose>

                <DialogClose>
                <LoadingLink href="/MarketPlace" className={buttonVariants({
              size: 'sm',
              variant: 'outline',
              className: "hover:text-yellow-500"
            })}>
              <Store size={15} className='mr-1' />
              MarketPlace ✨
            </LoadingLink>
                </DialogClose>

                {bestSellingProducts! > 0 && (
                <DialogClose>
                <LoadingLink href="/MarketPlace/BestSelling" className={buttonVariants({
              size: 'sm',
              variant: 'outline',
              className: "hover:text-green-500"
            })}>
              <CircleDollarSign size={15} className='mr-1' />
              Best Selling
            </LoadingLink>
                </DialogClose>
              )}

          <DialogClose>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="hover:text-purple-500">
                    <Shirt size={15} className="mr-1" />
                    Categories
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 mt-1 ml-4 flex flex-col">
                {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <LoadingLink key={String(category)}
                        href={`/MarketPlace/category/${category}`} className={buttonVariants({
                        size: 'sm',
                        variant: 'ghost',
                        })}>{category}
                        </LoadingLink>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>No data for now!</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

                </DialogClose>   
                

                <DialogClose>
                  <Button variant={"outline"} size={"sm"} >                 
                    <ModeToggle/>
                  </Button>
                  </DialogClose>            
                
              </div>
            </SheetContent>
          </Sheet>

          {/* Middle Section */}
          <div className='hidden xl:flex h-full left-0 items-center space-x-8'>


          <LoadingLink href="/" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-blue-500"
            })}>
              <Home size={15} className='mr-1' />
              Home
            </LoadingLink>


            <LoadingLink href="/MarketPlace" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-yellow-500"
            })}>
              <Store size={15} className='mr-1' />
              MarketPlace ✨
            </LoadingLink>

            {bestSellingProducts! > 0 && (
            <LoadingLink href="/MarketPlace/BestSelling" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-green-500"
            })}>
              <CircleDollarSign size={15} className='mr-1' />
              Best Selling
            </LoadingLink>
          )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="hover:text-purple-500">
                  <Shirt size={15} className="mr-1" />
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 mt-3 flex flex-col">
              {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <LoadingLink key={String(category)}
                        href={`/MarketPlace/category/${category}`} className={buttonVariants({
                        size: 'sm',
                        variant: 'ghost',
                        })}>{category}
                        </LoadingLink>

                    ))
                  ) : (
                    <DropdownMenuItem disabled>No data for now!</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
            </DropdownMenu>



            <div className='h-8 w-px bg-zinc-200 hidden sm:block' />

            <LoadingLink href="/MarketPlace/favList" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-red-500"
            })}>
              <Heart size={15} className='mr-1' />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                {favListProducts?.length > 9 ? '9+' : favListProducts?.length ?? 0}
                </span>
              Fav List
            </LoadingLink>

            <LoadingLink href="/MarketPlace/cart" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-blue-500"
            })}>
              <ShoppingCart size={15} className='mr-1' />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                  {cartProductList > 9 ? '9+' : cartProductList ?? 0}

                </span>
              Cart
            </LoadingLink>


            <LoadingLink href="/MarketPlace/userOrders" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-green-500"
            })}>
              <ShoppingBasket size={15} className='mr-1' />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                  {orders?.length > 9 ? '9+' : orders?.length ?? 0}
                </span>
              Your Orders
            </LoadingLink>

          </div>

                    {/* Right Section */}
            <div className='hidden xl:flex items-center space-x-1'>       
                 {/* User Profile */}
            <UserProfile user={user!} platform={platform!} />
            <ModeToggle/>
          </div>

          {/* Logo visible only in small and medium devices */}

          <div
            style={{ width: '35px', height: '35px' }}
            className="block xl:hidden h-full"
            >
            <NextImage
              src="/aestheticpro.png"
              width={1000}
              height={1000}
              alt="logo"
              draggable={false}
            />
          </div>



          {/* User Profile for small devices */}
          <div className='flex xl:hidden items-center space-x-2'>
          <LoadingLink href="/MarketPlace/favList" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-red-500"
            })}>
              <Heart size={22} className='mr-1' />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
              {favListProducts?.length > 9 ? '9+' : favListProducts?.length ?? 0}
                </span>
            </LoadingLink>
            <LoadingLink href="/MarketPlace/cart" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-blue-500"
            })}>
              <ShoppingCart size={22} className='mr-1' />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                {cartProductList > 9 ? '9+' : cartProductList ?? 0}
                </span>
            </LoadingLink>
            <LoadingLink href="/MarketPlace/userOrders" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-green-500"
            })}>
              <ShoppingBasket size={22} className='mr-1' />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
              {orders?.length > 9 ? '9+' : orders?.length ?? 0}
                </span>
            </LoadingLink>
            <UserProfile user={user!} platform={platform!} />
          </div>

        </div>
      </MaxWidthWrapper>
    </nav>
  )
} catch (error) {
  console.log(error)
  return <ErrorState/>
    
}
}

export default Navbar
