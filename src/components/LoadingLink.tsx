'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Loader } from 'lucide-react';
type LoadingLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

const LoadingLink = ({ href, children, className }: LoadingLinkProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const currentPath = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!loading && currentPath !== href) {
      setLoading(true);
      router.push(href);
    }
  };

  useEffect(() => {
    // Stop loading when the current path matches the target href
    if (currentPath === href) {
      setLoading(false);
    }
  }, [currentPath, href]);

  return (
    <>


      <AlertDialog open={loading} >
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="text-xl text-blue-700 font-bold text-center">
              Redirecting!
            </AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col items-center">
              This will take a moment.
             <Loader className="text-blue-700 h-[30%] w-[30%] animate-spin mt-3" />
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <Link href={href} className={cn(className)} onClick={handleClick}>
        {children}
      </Link>
    </>
  );
};

export default LoadingLink;
