
"use client"
import NextImage from "next/image"

import { CircleDollarSign, CircleUser, Link2, Link2Icon, User as U, UserPlus, UserRound, UserRoundPlus, UserRoundX, UserX } from "lucide-react"
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
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ModeToggle } from "./ModeToggle"
import { useTranslations } from 'next-intl';

const UserProfile = ({ user , platform } : {user : User , platform : Platform | null})=>{

  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast()
  const router = useRouter()
  const t = useTranslations('CommonComponents');

  const create = async () => {
    try {
      setOpen(true);
      await createPlatform(user.id);
      toast({
        title: t('platformCreatedTitle'),
        variant: 'default',
      });
    } catch (error) {
      console.error('Error creating platform:', error);
      toast({
        title: t('errorCreatingPlatformTitle'),
        description: t('errorCreatingPlatformDescription'),
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
        title: t('errorSigningOutTitle'),
        description: t('errorSigningOutDescription'),
        variant: 'destructive',
      });
      setOpen(false);
    }
  };
  

    return (
        <>


        {user ? (
          <>

      <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full">
                        <div className=" w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-gray-200" style={{ width: 40, height: 40 }}>
                        <NextImage 
                        src={user?.image ? user.image : "/clientImage.png"}
                        alt="userImage"
                          width={200}
                          height={200}
                          className="rounded-full object-fill"
                        />
                      </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" w-56 mt-2 mr-2">
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
              <DropdownMenuLabel>
                <p>{t('myAccount')}</p>
                </DropdownMenuLabel>
                
                  <p className="text-xs ml-2 text-muted-foreground">{user.email}</p>
                  <DropdownMenuSeparator />
                  {user.userType === "SELLER" && (
                    <>
                  <DropdownMenuItem>
                  <Link 
                  href="/sellerDashboard"
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      size :"sm",
                      className: 'flex justify-between items-center w-full'
                    })
                  )}
                  >
                    {t('sellerDashboard')} ✨
                  </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  </>
                  )}
                  {user.userType === "ADMIN" && (
                    <>
                  <DropdownMenuItem>
                  <Link 
                  href="/adminDashboard"
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      size :"sm",
                      className: 'flex justify-between items-center w-full'
                    })
                  )}
                  >
                    {t('adminDashboard')} ✨
                  </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  </>
                  )}
                  {user.userType === "FACTORY" && (
                    <>
                  <DropdownMenuItem>
                    <Link 
                  href="/factoryDashboard"
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      size :"sm",
                      className: 'flex justify-between items-center w-full'
                    })
                  )}
                  >
                    {t('factoryDashboard')} ✨
                  </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  </>
                  )}
                  {user.isAffiliate && (
                    <>
                  <DropdownMenuItem>
                    <Link 
                  href="/affiliateDashboard"
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      size :"sm",
                      className: 'flex justify-between items-center w-full'
                    })
                  )}
                  >
                    {t('affiliateDashboard')} ✨
                  </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  </>
                  )}

                  {user.userType !== "SELLER" && !user.isAffiliate && user.userType !== "ADMIN" &&user.userType !== "FACTORY" && (
                    <>
                      <DropdownMenuItem>
                        <Link
                          href="/MarketPlace/create-seller-profile"
                          className={cn(
                            buttonVariants({
                              variant: 'ghost',
                              size: "sm",
                              className: 'flex hover:text-green-500 justify-start items-center w-full'
                            })
                          )}
                        >
                          {t('becomeSeller')} <CircleDollarSign className="ml-1 text-green-500" size={15} />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link
                          href="/createAffiliateAccount"
                          className={cn(
                            buttonVariants({
                              variant: 'ghost',
                              size: "sm",
                              className: 'flex hover:text-purple-500 justify-start items-center w-full'
                            })
                          )}
                        >
                          {t('affiliateProgram')} <Link2Icon className="ml-1 text-purple-500" size={15} />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}


              <DropdownMenuItem>
                
              <Button onClick={()=>SignOutUser()} size={"sm"}  variant={"ghost"} className="flex justify-between items-center w-full">
              {t('signOut')}                 
              <UserX size={16} />
              </Button>
              </DropdownMenuItem>


                  {user.userType === "ADMIN" && !platform && (
              <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button onClick={create} size={"sm"}  variant={"ghost"} className="flex justify-between items-center w-full">
                      <span>{t('createPlatform')}</span>
                    </Button>
                  </DropdownMenuItem>
                  </> 
                )}
            </DropdownMenuContent>
          </DropdownMenu>
  
          </>

        ) : (
          <>
          <Link 
            href="/auth/sign-in"
            className={cn(
              buttonVariants({
                variant: 'secondary',
                size :"sm",
                className : "hover:text-blue-500 border border-muted-foreground"
              })
            )}>
            {t('signIn')}
            <UserPlus size={14} className="ml-1" />
            </Link>
          </>
        )}
                
                <LoadingState isOpen={open}/> 


        </>






    )

}

export default UserProfile