
"use client"
import NextImage from "next/image"

import { UserRound, UserRoundPlus, UserRoundX } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Platform, User } from "@prisma/client"
import { createPlatform } from "@/actions/actions"
import LoadingState from "./LoadingState"
import { useState } from "react"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"
import LoadingLink from "./LoadingLink"
import { cn } from "@/lib/utils"

const UserProfile = ({ user , platform } : {user : User , platform : Platform | null})=>{

  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast()
  const router = useRouter()

  const create = async () => {
    try {
      setOpen(true);
      await createPlatform(user.id);
      toast({
        title: 'Platform Was Successfully Created',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error creating platform:', error);
      toast({
        title: 'Error Creating Platform',
        description: 'An error occurred while creating the platform. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setOpen(false);
    }
  };
  
  const SignOutUser = () => {
    try {
      setOpen(true);
      router.push("/api/auth/logout");
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error Signing Out',
        description: 'An error occurred while signing out. Please try again later.',
        variant: 'destructive',
      });
      setOpen(false);
    }
  };
  

    return (
        <>
                
                <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        {user ? (
                  <div className=" w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-gray-200" style={{ width: 40, height: 40 }}>
                  <NextImage 
                   src={user?.image ? user.image : "/clientImage.png"}
                   alt="userImage"
                    width={200}
                    height={200}
                    className="rounded-full object-fill"
                  />
                </div>
        ) : (
          <Button  variant="outline" className="bg-transparent rounded-full">
          <UserRound />
        </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-56 mt-2 mr-2">
        {user && (
      <div className="flex justify-center items-center">
        <div className="relative w-[100px] h-[100px] rounded-full bg-gray-100 border-2 border-gray-500 overflow-hidden">
          <NextImage
            src={user?.image ? user.image : "/clientImage.png"}
            alt="clientImage"
            width={500}
            height={500}
            className="rounded-full object-fill"
          />
        </div>
      </div>
              )}
        <DropdownMenuLabel>
          {user ? (
          <p>My Account</p>
          ):(
            <p>No Account</p>
          )}
          </DropdownMenuLabel>
        {user ? (
          <>
            <p className="text-xs ml-2 text-muted-foreground">{user.email}</p>
            <DropdownMenuSeparator />
            {user.userType === "SELLER" && (
              <>
            <DropdownMenuItem>
            <LoadingLink 
            href="/sellerDashboard"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size :"sm",
                className: 'flex justify-between items-center w-full'
              })
            )}
            >
              Seller Dashboard ✨
            </LoadingLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            </>
            )}
             {user.userType === "ADMIN" && (
              <>
            <DropdownMenuItem>
            <LoadingLink 
            href="/adminDashboard"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size :"sm",
                className: 'flex justify-between items-center w-full'
              })
            )}
            >
              Admin Dashboard ✨
            </LoadingLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            </>
            )}
            {user.userType === "FACTORY" && (
              <>
            <DropdownMenuItem>
              <LoadingLink 
            href="/factoryDashboard"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size :"sm",
                className: 'flex justify-between items-center w-full'
              })
            )}
            >
              Factory Dashboard ✨
            </LoadingLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            </>
            )}
            {user.isAffiliate && (
              <>
            <DropdownMenuItem>
              <LoadingLink 
            href="/affiliateDashboard"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size :"sm",
                className: 'flex justify-between items-center w-full'
              })
            )}
            >
              Affiliate Dashboard ✨
            </LoadingLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            </>
            )}


        <DropdownMenuItem>
        <Button onClick={()=>SignOutUser()} size={"sm"}  variant={"ghost"} className="flex justify-between items-center w-full">
        Sign out                 <UserRoundX size={20} />
        </Button>
        </DropdownMenuItem>


            {user.userType === "ADMIN" && !platform && (
        <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button onClick={create} size={"sm"}  variant={"ghost"} className="flex justify-between items-center w-full">
                <span> Create Platform</span>
              </Button>
            </DropdownMenuItem>
            </> 
          )}
          </>
        ) : (
          <>        
          <DropdownMenuSeparator />
            <DropdownMenuGroup>
            <DropdownMenuItem>
            <LoadingLink 
            href="/auth/sign-in"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size :"sm",
                className: 'flex justify-between items-center w-full'
              })
            )}
            >
            Sign In
            <UserRoundPlus size={20} />
            </LoadingLink>
            </DropdownMenuItem>            
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
    <LoadingState isOpen={open} />

        </>






    )

}

export default UserProfile