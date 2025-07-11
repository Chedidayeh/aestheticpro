import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";
import { StoreProvider } from "@/store/StoreProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { SessionProvider } from "next-auth/react";
import NextTopLoader from 'nextjs-toploader';
import {IntlProvider} from 'next-intl';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

const recursive = Recursive({ subsets: ["vietnamese"] });
export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
  title: "AestheticPro Platform",
  description: "Tunisian Platform",
};

type LayoutProps = {
  children: ReactNode;
  params: Promise<{locale: string}>;

};
const Layout = async ({ children ,   params
}: LayoutProps) => {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;



  return (

    <html lang="en">
      <body className={recursive.className}>
      <NextIntlClientProvider>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
      <StoreProvider>
      <NextTopLoader color="#105fb9" showSpinner={false} />
        <Analytics/>
        <SpeedInsights/>
      <main className='flex flex-col min-h-[calc(100vh-3.5rem-1px)]'>
        <div className='flex-1 flex flex-col h-full'>
        <SessionProvider >
           <Providers>
            {children}
           <Toaster/>
            </Providers>
            </SessionProvider>
          </div>
        </main> 
      </StoreProvider>
      </ThemeProvider>
      </NextIntlClientProvider>
      </body>
    </html>

  );
}

export default Layout