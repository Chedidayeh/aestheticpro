
"use client"
import NextImage from "next/image"
import { UserRoundPlus, UserRoundX } from "lucide-react"
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
import {  User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import LoadingState from "../LoadingState"
import { useToast } from "../ui/use-toast"
import { useState } from "react"
import { useTranslations } from 'next-intl';


const Profile = ({ user } : {user : User})=>{

  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast()
  const t = useTranslations('FactoryDashboardComponents');

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
                
                <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className=" w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-gray-500" style={{ width: 40, height: 40 }}>
         <NextImage 
          src={user?.image ? user.image : "/clientImage.png"}
            alt="userImage"
           width={200}
           height={200}
         />
       </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-56 mt-2 mr-2">
      <div className="flex justify-center items-center">
        <div className="relative w-[100px] h-[100px] rounded-full bg-gray-100 border-2 border-gray-500 overflow-hidden">
          <NextImage
            src={user?.image ? user.image : "/clientImage.png"}
            alt="store"
            objectFit="cover"
            width={500}
            height={500}
            className="rounded-full"
          />
        </div>
      </div>
        <DropdownMenuLabel className="flex justify-center items-center">
          {user ? (
          <p>{t('myAccount')}</p>
          ):(
            <p>{t('noAccount')}</p>
          )}
          </DropdownMenuLabel>
        {user && (
          <>
            <p className="text-xs ml-2 text-muted-foreground">{user.email}</p>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
        <Button onClick={()=>SignOutUser()} size={"sm"}  variant={"ghost"} className="flex justify-between items-center w-full">
        {t('signOut')}                 <UserRoundX size={20} />
        </Button>
        </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
    <LoadingState isOpen={open} />

        </>






    )

}

export default Profile