'use client'

import NextImage from 'next/image'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Button, buttonVariants } from './ui/button'
import { Building2, CircleDollarSign, Handshake, Heart, Home, Mail, Menu, ShoppingBasket, ShoppingCart, Store as St } from 'lucide-react'
import UserProfile from './UserProfile'
import { ModeToggle } from './ModeToggle'
import LoadingLink from './LoadingLink'
import ErrorState from './ErrorState'
import React from 'react'
import { Order, OrderItem, Platform, User } from '@prisma/client'
import { Separator } from './ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import Link from 'next/link'



interface extraOrder extends Order {
  orderItems : OrderItem []
}



const Navbar = (
  {user , platform , cartProductList , orders , favListProducts , bestSellingProducts} : 
  {user : User , platform : Platform , cartProductList : number , orders : extraOrder[] , favListProducts: number , bestSellingProducts : number}) => {

  try {
    
    const handleFacebookIconClick = () => {
      const url = "https://www.facebook.com/profile.php?id=61564936846426"
      window.open(url!, '_blank', 'noopener,noreferrer');
    };
  
    const handleInstagramIconClick = () => {
      const url = "https://www.instagram.com/aestheticpro.tn/"
      window.open(url!, '_blank', 'noopener,noreferrer');
    };



  return (
    <nav className='sticky z-[50] h-14 inset-x-0 top-0 w-full  backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='lg:flex hidden h-14 items-center justify-between'>
          
          
          {/* Logo */}
          
          
          <LoadingLink href="/">
          <div
            style={{ width: '40px', height: '40px' }}
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
          </LoadingLink>


          {/* Middle Section */}
          <div className='flex h-full left-0 items-center lg:space-x-4 xl:space-x-8'>


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
              <St size={15} className='mr-1' />
              MarketPlace
            </LoadingLink>

            {/* {bestSellingProducts! > 0 && (
            <LoadingLink href="/MarketPlace/BestSelling" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-green-500"
            })}>
              <CircleDollarSign size={15} className='mr-1' />
              Best Selling
            </LoadingLink>
          )} */}

            {/* <DropdownMenu>
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
            </DropdownMenu> */}

            <LoadingLink href="/services" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-purple-500"
            })}>
              <Handshake size={15} className='mr-1' />
              Services
            </LoadingLink>



            <div className='h-8 w-px bg-zinc-200 hidden sm:block' />

            <LoadingLink href="/MarketPlace/favList" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-red-500"
            })}>
              <Heart size={15} className='mr-1' />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                {favListProducts > 9 ? '9+' : favListProducts ?? 0}
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
            <div className='flex items-center space-x-1'>       
                 {/* User Profile */}
            <UserProfile user={user!} platform={platform!} />
            <ModeToggle/>
          </div>



        </div>


        {/* mobile */}

        <div className='flex lg:hidden h-14 items-center justify-between'>
          
          {/* side bar */}
          <div className="flex justify-start items-start">
          <Sheet>
            <SheetTrigger >
            <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
          </Button>            
          </SheetTrigger>
            <SheetContent side="left" className='w-[70%] h-full'>

              

              <div className='flex items-center gap-6'>

                {/* logo */}

              <LoadingLink href="/">
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
          </LoadingLink>

          {/* text */}
          <div className='text-sm  font-semibold'>
          <LoadingLink href="/">
            <p>Aesthetic Pro</p>
            <p>Platform ✨</p>
            </LoadingLink>
          </div>

              </div>








              
 

              <Separator className='w-full my-4'/>

              <div className='flex flex-col space-y-2'>


              <LoadingLink href="/">
              <div className="group text-sm border w-full rounded-xl flex items-center justify-center p-2 cursor-pointer hover:bg-slate-200 bg-slate-100 dark:bg-slate-600/30 dark:hover:bg-slate-600/50">
                <Home size={15} className="mr-1 group-hover:text-blue-500" />
                <span className="group-hover:text-blue-500">Home</span>
              </div>
            </LoadingLink>

            <LoadingLink href="/MarketPlace">
              <div className="group text-sm border w-full rounded-xl flex items-center justify-center p-2 cursor-pointer hover:bg-slate-200 bg-slate-100 dark:bg-slate-600/30 dark:hover:bg-slate-600/50">
                <St size={15} className="mr-1 group-hover:text-yellow-500" />
                <span className="group-hover:text-yellow-500">MarketPlace</span>
              </div>
            </LoadingLink>


   


            {bestSellingProducts > 0 && (


            
            <LoadingLink href="/MarketPlace/BestSelling">
              <div className="group text-sm border w-full rounded-xl flex items-center justify-center p-2 cursor-pointer hover:bg-slate-200 bg-slate-100 dark:bg-slate-600/30 dark:hover:bg-slate-600/50">
                <CircleDollarSign size={15} className="mr-1 group-hover:text-green-500" />
                <span className="group-hover:text-green-500">Best Selling</span>
              </div>
            </LoadingLink>

            )}



            <LoadingLink href="/services">
              <div className="group text-sm border w-full rounded-xl flex items-center justify-center p-2 cursor-pointer hover:bg-slate-200 bg-slate-100 dark:bg-slate-600/30 dark:hover:bg-slate-600/50">
                <Handshake size={15} className="mr-1 group-hover:text-purple-500" />
                <span className="group-hover:text-purple-500">Services</span>
              </div>
            </LoadingLink>

              </div>


              <Separator className='w-full my-4'/>


              <div className='flex flex-col space-y-2'>


              <LoadingLink href="/MarketPlace/favList">
              <div className="group text-sm relative border w-full rounded-xl flex items-center justify-center p-2 cursor-pointer hover:bg-slate-200 bg-slate-100 dark:bg-slate-600/30 dark:hover:bg-slate-600/50">
                <Heart size={15} className="mr-1 group-hover:text-red-500" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                              {favListProducts > 9 ? '9+' : favListProducts ?? 0}
                              </span>
                <span className="group-hover:text-red-500">Fav List</span>
              </div>
              </LoadingLink>

              <LoadingLink href="/MarketPlace/cart">
              <div className="group text-sm border relative w-full rounded-xl flex items-center justify-center p-2 cursor-pointer hover:bg-slate-200 bg-slate-100 dark:bg-slate-600/30 dark:hover:bg-slate-600/50">
                <ShoppingCart size={15} className="mr-1 group-hover:text-blue-500" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">                
                  {cartProductList > 9 ? '9+' : cartProductList ?? 0}
                </span>
                <span className="group-hover:text-blue-500">Cart</span>
              </div>
              </LoadingLink>


              <LoadingLink href="/MarketPlace/userOrders">
              <div className="group text-sm border relative w-full rounded-xl flex items-center justify-center p-2 cursor-pointer hover:bg-slate-200 bg-slate-100 dark:bg-slate-600/30 dark:hover:bg-slate-600/50">
                <ShoppingBasket size={15} className="mr-1 group-hover:text-green-500" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                  {orders?.length > 9 ? '9+' : orders?.length ?? 0}
                </span>
                <span className="group-hover:text-green-500">Your Orders</span>
              </div>
              </LoadingLink>


              </div>


              <Separator className='w-full my-4'/>


              <div className='flex flex-col space-y-2'>


          <LoadingLink href="/about">
          <div className="group text-sm border w-full rounded-xl flex items-center justify-center p-2 cursor-pointer hover:bg-slate-200 bg-slate-100 dark:bg-slate-600/30 dark:hover:bg-slate-600/50">
            <Building2 size={15} className="mr-1 group-hover:text-blue-500" />
            <span className="group-hover:text-blue-500">About Us</span>
          </div>
          </LoadingLink>

          <LoadingLink href="/contact">
          <div className="group text-sm border relative w-full rounded-xl flex items-center justify-center p-2 cursor-pointer hover:bg-slate-200 bg-slate-100 dark:bg-slate-600/30 dark:hover:bg-slate-600/50">
            <Mail size={15} className="mr-1 group-hover:text-rose-500" />
            <span className="group-hover:text-rose-500">Contact</span>
          </div>
          </LoadingLink>

          </div>



          <Separator className='w-full my-4'/>

 


            {/* bottom section */}
          {/* <div className="flex items-end justify-end ">
            <div className='flex items-center justify-center gap-2'>
            <p className='text-sm font-medium'>
            Toggle Mode :
            </p>
            <div className='border max-w-max rounded-lg'>
            <ModeToggle/>
            </div>
            </div>
            </div> */}





            <div className='flex justify-center items-center '>
            <div className="text-muted-foreground text-sm font-semibold flex flex-col sm:flex-row items-center justify-center gap-2">
              Social Media:
              <div className="flex gap-3 mb-1">
              <div onClick={handleFacebookIconClick} className='border-1 rounded-full bg-white'>
              <FaFacebook className="text-2xl cursor-pointer hover:text-blue-600 text-blue-600" />
              </div>
              <div  onClick={handleInstagramIconClick} className='border-1 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'>
              <FaInstagram className="text-2xl cursor-pointer text-white" />
              </div>
              </div>
            </div>
          </div>
          
            </SheetContent>
          </Sheet>
          </div>


          {/* links */}
          <div className='flex items-center space-x-2'>

                      
          <LoadingLink href="/MarketPlace/favList" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-red-500"
            })}>
              <Heart size={22} className='mr-1' />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
              {favListProducts > 9 ? '9+' : favListProducts ?? 0}
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
          </div>


          {/* User Profile for small devices */}
          <div className='flex items-center space-x-2'>
          <ModeToggle/>
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
