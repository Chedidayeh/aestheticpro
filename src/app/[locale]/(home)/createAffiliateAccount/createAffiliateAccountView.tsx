/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'

import {
  useEffect,
  useState
} from 'react';
import {
  useRouter
} from 'next/navigation';
import {
  Loader,
  MousePointerClick,
  RocketIcon
} from 'lucide-react';
import Confetti from 'react-dom-confetti';
import {
  useToast
} from "@/components/ui/use-toast";
import {
  Checkbox
} from "@/components/ui/checkbox";
import {
  Separator
} from "@/components/ui/separator";
import {
  Button
} from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";
import { createAccount } from './actions';
import { User } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

const CreateAffiliateAccountView = ({ user }: { user: User }) => {
  const t = useTranslations('CreateAffiliateAccountPage');
  const [showConfetti, setShowConfetti] = useState<boolean>(true);
  const router = useRouter();
  const { toast } = useToast()
  const [isRedirecting, setIsRedirecting] = useState(false);

  // check phone number length
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const inputClassName = phoneNumberError ? 'border-red-500' : (phoneNumber ? 'border-green-500' : '');
  const handlePhoneNumberBlur = () => {
    if (phoneNumber.length !== 8) {
      setPhoneNumberError('Phone number must be 8 digits long !');
    } else {
      setPhoneNumberError('');
    }
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumberValue = event.target.value;
    setPhoneNumber(phoneNumberValue);
  };



  useEffect(() => {
    const ShowConfetti = async () => {
      setShowConfetti(true)
    };

    ShowConfetti();
  }, [router]); // Empty dependency array ensures this runs only once on mount


  // isOpen state
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [termsAccepted, setTermsAccepted] = useState(false);

  // Event handler for terms checkbox change
  const handleTermsCheckboxChange = () => {
    setTermsAccepted(!termsAccepted);
  };

  const createAffiliateAccount = async () => {
    try {
      setIsOpen(true);
      // Attempt to create an affiliate account
      const updatedUser = await createAccount(user!, phoneNumber);

      if (updatedUser) {

        setIsRedirecting(true)
        // Success toast message
        toast({
          title: 'Affiliate account created successfully!',
          description: 'You are now part of the affiliate program !',
          duration: 8000
        });
        setTimeout(() => {
          router.push("/affiliateDashboard");
        }, 3000);
      } else {
        // Failure toast message in case of error
        toast({
          title: 'Error creating affiliate account.',
          description: 'An issue occurred while processing your request.',
          variant: 'destructive',
        });
        setIsOpen(false);

      }
    } catch (error) {
      setIsOpen(false);
      // Catch any unexpected errors and display a toast notification
      toast({
        title: 'Unexpected error.',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    }
  };


  return (
    <>


      <div aria-hidden='true' className='pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center'>
        <Confetti active={showConfetti} config={{ elementCount: 100, spread: 50 }} />
      </div>

      <div className='mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-24 lg:px-8'>
        <div className='max-w-2xl'>
          <p className='text-base font-medium text-primary'>{t('workWithUs')}</p>
          <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>
            {t('becomeAffiliate')}
          </h1>
          <div className='mt-2 flex items-center text-base text-zinc-500'>
            <RocketIcon className="h-4 w-4 mr-2 text-primary" />
            <p className='text-muted-foreground'>
              {t('shareAndEarn')}
            </p>
          </div>

          <div className="items-center justify-center flex mt-8">
            <h4 className="font-semibold ">
              {t('earnCommission')}
            </h4>
          </div>

          {user?.userType === "SELLER" && (
            <div className="items-center text-red-500 justify-center flex mt-8">
              <h4 className="font-medium">
                {t('sellerWarning')}
              </h4>
            </div>
          )}

        </div>

        <div className='mt-10 border-t col-span-2 flex flex-col border-zinc-200 text-right'>
          {/* قسم كيفية العمل */}
          <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold'>
              كيف تعمل:
            </h4>
            <p className='text-md text-muted-foreground'>
              كمسوق تابع، ستختار منتجًا من منصتنا وتقوم بإنشاء رابط إحالة فريد لهذا المنتج. بعد ذلك يمكنك مشاركة هذا الرابط مع جمهورك عبر وسائل التواصل الاجتماعي
            </p>
            <p className='text-md text-muted-foreground'>
              عندما يستخدم شخص ما رابط الإحالة الخاص بك لإجراء طلب شراء، سيقوم النظام بتتبع الطلب، وإذا تم الدفع سيتم تخصيص عملية البيع لحسابك تلقائيًا. ستحصل على عمولة عن كل عملية بيع تتم من خلال رابط الإحالة الخاص بك
            </p>
            <p className='text-md text-muted-foreground'>
              يمكنك متابعة جميع مبيعاتك والإحالات والعمولات الخاصة بك من خلال لوحة التحكم الخاصة بالتسويق التابع في الوقت الفعلي، مما يسمح لك بتتبع أرباحك أثناء نموها
            </p>
          </div>

          {/* قسم كيفية الحصول على الأموال */}
          <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold'>
              كيف تحصل على الأموال:
            </h4>
            <p className='text-md text-muted-foreground'>
              ستحصل على عمولة عن كل عملية بيع تتم من خلال رابط الإحالة الخاص بك. العمولة هي نسبة مئوية من إجمالي قيمة البيع، ويمكن أن تختلف هذه النسبة حسب المنتج
            </p>
            <p className='text-md text-muted-foreground'>
              تتم معالجة المدفوعات كل أسبوع، بشرط أن تكون قد وصلت إلى الحد الأدنى للدفع. يمكنك اختيار استلام أرباحك عبر التحويل البنكي أو من خلال تطبيق فلوسي
            </p>
            <p className='text-md text-muted-foreground'>
              يمكنك تتبع العمولات المعلقة وسجل المدفوعات مباشرة من خلال لوحة التحكم الخاصة بالتسويق التابع. منصتنا تضمن لك الحصول على مستحقاتك عن كل إحالة ناجحة
            </p>
          </div>
        </div>

        <div className='mt-10 border-t col-span-2 flex flex-col border-zinc-200'>
          {/* How it works section */}
          <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold'>
              1- {t('howItWorksTitle')}
            </h4>
            <p className='text-md text-muted-foreground'>
              {t('howItWorks1')}
            </p>
            <p className='text-md text-muted-foreground'>
              {t('howItWorks2')}
            </p>
            <p className='text-md text-muted-foreground'>
              {t('howItWorks3')}
            </p>
          </div>

          {/* How you get paid section */}
          <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold'>
              2- {t('howGetPaidTitle')}
            </h4>
            <p className='text-md text-muted-foreground'>
              {t('howGetPaid1')}
            </p>
            <p className='text-md text-muted-foreground'>
              {t('howGetPaid2')}
            </p>
            <p className='text-md text-muted-foreground'>
              {t('howGetPaid3')}
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex items-center justify-center mt-8 space-x-2">
          <Checkbox id="terms" onClick={handleTermsCheckboxChange} />
          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {t('acceptTerms')}
          </label>
        </div>

        <div className='mt-10 flex space-y-3 flex-col'>
          <h4 className='font-medium text-sm  '>
            {t('addPhoneNumber')}
          </h4>
          <Input
            id="phoneNumber"
            type="number"
            pattern="\d{8}"
            onBlur={handlePhoneNumberBlur}
            placeholder={t('phonePlaceholder')}
            onChange={handlePhoneNumberChange}
            className={`${inputClassName} focus:ring-0  w-full sm:w-[50%] focus:border-green-500`}
            required
          />
          {phoneNumberError && (
            <p className="text-sm text-red-500 mt-1">
              {phoneNumberError}
            </p>
          )}
        </div>

        <div className="flex justify-end items-end mt-[10%]">
          <Button disabled={!termsAccepted || phoneNumber.length != 8} onClick={createAffiliateAccount} className="w-full sm:w-[40%] text-white">
            {t('createAccountNow')} <MousePointerClick className="ml-2" />
          </Button>
        </div>
      </div>

      <AlertDialog open={isOpen}>
        <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="text-xl text-blue-700 font-bold text-center">
              {t('creatingAccountTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {t('creatingAccountDesc')}
            </AlertDialogDescription>
            <div className="text-blue-700 mb-2">
              <Loader className="animate-spin" />
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isRedirecting}>
        <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="text-xl text-blue-700 font-bold text-center">
              {t('loadingDashboardTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {t('loadingDashboardDesc')}
            </AlertDialogDescription>
            <div className="text-blue-700 mb-2">
              <Loader className="animate-spin" />
            </div>
          </AlertDialogHeader>

        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default CreateAffiliateAccountView
