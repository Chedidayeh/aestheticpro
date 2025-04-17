/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import NextImage from "next/image"
import * as React from "react"
import { Button } from "@/components/ui/button"

import {  useState, useTransition } from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import { GoogleLogin } from "./actions"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/reducers/reducers"
import { saveRedirectUrl } from "@/store/actions/action"
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import LoadingState from "@/components/LoadingState"
import { useToast } from "@/components/ui/use-toast"
import { LoginSchema } from "@/app/auth/schemas"
const emailSchema = z.string().email("Invalid email address");

const SignIn = () => {


  const router = useRouter()

  const [isResetPassword , setisResetPassword] = useState<boolean>(false)
  const [resetPassEmail, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailsuccess, setEmailSuccess] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [error , setError] = useState<string>("")
  const [success , setSuccess] = useState<string>("")
  const [isPending , stratTranstion ] = useTransition()
  const { toast } = useToast()

  const redirectUrl = useSelector((state: RootState) => state.url);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })





  const handleClick = async () => {
    try {
      setOpen(true);
      dispatch(saveRedirectUrl(null));
      await GoogleLogin(redirectUrl);
    } catch (error) {
      console.error("An error occurred during Google Login:", error);
      toast({
        title: "Error logging in",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  


  return (
    <>
                                  {/* <AlertDialog open={isResetPassword}>
                                       <AlertDialogTrigger asChild>
                                        </AlertDialogTrigger>
                                            <AlertDialogContent className=" flex flex-col items-center justify-center">
                                            <div className="text-2xl text-blue-700 font-bold text-center">
                                            Reset your password !
                                            </div>
                                            <AlertDialogDescription className="flex flex-col items-center">
                                            Enter your email to get your link.
                                          </AlertDialogDescription>
                                              <div className="flex items-center justify-center">
                                              <Input disabled={false}
                                              placeholder="example@gmail.com"
                                              onChange={(e) => setEmail(e.target.value)}
                                              value={resetPassEmail}
                                              type="email" 
                                              className=""/>
                                              </div>
                                              <FormError message={emailError}  />
                                              <FormSuccess message={emailsuccess}  />

                                         <AlertDialogFooter>
                                      
                                     <AlertDialogCancel onClick={()=>{
                                      setEmailError("")
                                      setEmailSuccess("")
                                      setEmail("")
                                      setisLoading(false)
                                      setisResetPassword(false)}}>
                                     Close</AlertDialogCancel>
                                     <AlertDialogAction disabled={isLoading} onClick={handleSubmit}>
                                      {isLoading ? (<Loader className="animate-spin"/>) 
                                      : ("Sent link")}
                                      </AlertDialogAction>

                                       </AlertDialogFooter>
                                        </AlertDialogContent>
                                  </AlertDialog> */}



<div className='relative flex mt-32 pb-10 flex-col items-center justify-center lg:px-0 lg:mb-36 mb-44'>
  <Card className=' flex w-[350px] flex-col justify-center sm:w-[450px]'>
    <CardHeader className="flex flex-col items-center space-y-3 text-center">
      <div className='animate-pulse' style={{ width: '100px', height: '100px' }}>
        <NextImage
          draggable={false}
          src={"/aestheticpro.png"}
          width={1000}
          height={1000}
          alt="logo"
        />
      </div>
      <CardTitle className='text-lg font-semibold tracking-tight'>
        Sign in to your {' '}
        account
      </CardTitle>
      {redirectUrl && (
        <div className="mb-2">
        <p className="text-xs text-blue-500 font-semibold">Sign In Again and you'll be redirected to your destination !</p>
        </div>
      )}
    <div className="mt-6">
      <Button className="text-xs border animate-borderPulse" onClick={handleClick} variant={"outline"} style={{ display: 'flex', alignItems: 'center' }}>
        <NextImage 
          src="/google.png" 
          alt="google" 
          width={24} 
          height={24}
          style={{ marginRight: '8px' }} 
        />
        Sign In with Google
      </Button>
      </div>

    </CardHeader>



    {/* Uncomment if you want the form section */}
    {/* <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className='grid gap-2 space-y-2'>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="example@gmail.com" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input disabled={isPending} placeholder="********" {...field} type={showPassword ? "text" : "password"} className="pr-10" />
                      <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>j
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} loadingText="Logging You" isLoading={isPending} className="w-full" type="submit">
            Login
          </Button>
        </form>
      </Form>
    </CardContent> */}

    {/* Uncomment if you want the link section */}
    {/* <CardContent>
      <Button onClick={()=>setisResetPassword(true)} variant="link">
        Forgot your password?
      </Button>
      <div aria-hidden='true' className=' flex items-center'>
        <span className='w-full border-t' />
      </div>
      <Link
        className={buttonVariants({
          variant: 'link',
          className: 'gap-1.5',
        })}
        href='/auth/sign-up'>
        Don&apos;t have an account?
        <ArrowRight className='h-4 w-4' />
      </Link>
    </CardContent> */}
  </Card>
</div>

<LoadingState isOpen={open} />

      
    </>
  )
}

export default SignIn