/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { usePathname, useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { AffiliateLink, User } from '@prisma/client';
import { createAffiliateClick } from './actions';
import { useDispatch } from 'react-redux';
import { saveRedirectUrl } from '@/store/actions/action';
import { buttonVariants } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { useTranslations } from 'next-intl';


interface PageProps {
  affiliateLink: AffiliateLink;
  user : User | null | undefined;
}

const RedirectPage = ({  affiliateLink , user }: PageProps) => {
  const router = useRouter();
  const { toast } = useToast()
  const pathname = usePathname();
  const dispatch = useDispatch();
  const t = useTranslations('CommonComponents');

  useEffect(() => {
    const handleAffiliateClick = async () => {
      try {
        if(!user) { 
          dispatch(saveRedirectUrl(pathname));
        } else {
          if (user.affiliateOrderSessionId) {
            const res = await createAffiliateClick(affiliateLink ,user , true);
            if (res) {
              router.push(affiliateLink.originalLink); // Redirect immediately
            }else {
              toast({
                title: 'Unexpected error.',
                description: 'Something went wrong. Please try again later.',
                variant: 'destructive',
              });
              router.push('/');
            }
          } else {
            const res = await createAffiliateClick(affiliateLink ,user , false);
            if (res) {
              router.push(affiliateLink.originalLink); // Redirect immediately
            }else {
              toast({
                title: 'Unexpected error.',
                description: 'Something went wrong. Please try again later.',
                variant: 'destructive',
              });
              router.push('/');
            }
          }
        }
      } catch (error) {
        console.error('Error during affiliate click handling:', error);
        toast({
          title: 'Unexpected error.',
          description: 'Something went wrong. Please try again later.',
          variant: 'destructive',
        });
        router.push('/');
      }
    };

    handleAffiliateClick();
  }, [affiliateLink, router, dispatch, user, pathname, toast]);


  return (
    <>
    <div className='mb-96'>

    </div>
      {/* Your AlertDialog and countdown UI */}
      {user ? (
      <AlertDialog open={true}>
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
        <AlertDialogHeader className="flex flex-col items-center">

            <AlertDialogTitle className="text-xl font-bold text-center">
              {t('redirecting')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {t('pleaseWait')}
            </AlertDialogDescription>
            <div className="text-blue-700 mb-2">
              <Loader className="animate-spin" />
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
      ) : (
        <AlertDialog open={true}>
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
        <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-center font-bold tracking-tight">
              {t('signInToContinue')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-center py-2">
              {t('pleaseLoginRedirect')}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex items-end justify-end">
            <Link
              className={buttonVariants({
                variant: "default",
                size : "sm",
                className: "text-white w-20",
              })}
              href="/auth/sign-in"
            >
              {t('login')}
            </Link>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      )}

    </>
  );
};

export default RedirectPage;