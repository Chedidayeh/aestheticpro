'use client'

/* eslint-disable react/no-unescaped-entities */
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
import { Button, buttonVariants } from './ui/button';
import { saveRedirectUrl } from '@/store/actions/action';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { useTranslations } from 'next-intl';
const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {

  const pathname = usePathname();
  const dispatch = useDispatch();
  const t = useTranslations('CommonComponents');

  useEffect(() => {
    if (isOpen) {
      // Save the current path to Redux store
      dispatch(saveRedirectUrl(pathname));
    }
  }, [isOpen, dispatch, pathname]);

  return (
<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
<AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
<AlertDialogHeader>
      <AlertDialogTitle className="text-xl text-center font-bold tracking-tight">
        {t('signInToContinue')}
      </AlertDialogTitle>
      <AlertDialogDescription className="text-sm text-center py-2">
        {t('pleaseLoginRedirect')}
      </AlertDialogDescription>
    </AlertDialogHeader>

    <div className="grid grid-cols-2 gap-2">
    <Button onClick={() => setIsOpen(false)} variant={"secondary"}>
        {t('cancel')}
      </Button>

      <Link
        className={buttonVariants({
          variant: "default",
          className: "text-white",
        })}
        href="/auth/sign-in"
      >
        {t('login')}
      </Link>


    </div>
  </AlertDialogContent>
</AlertDialog>
  );
};

export default LoginModal;
