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
const recursive = Recursive({ subsets: ["latin-ext"] });
export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
  title: "AestheticPro Platfrom",
  description: "Tunisian Platfrom",
};

type LayoutProps = {
  children: ReactNode;
};
const Layout = ({ children }: LayoutProps) => {


  return (

    <html lang="en">
      <body className={recursive.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
      <StoreProvider>
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
      </body>
    </html>

  );
}

export default Layout