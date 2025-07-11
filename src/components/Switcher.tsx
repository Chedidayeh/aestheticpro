"use client"
import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
const locales = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'fr', label: 'Français', flag: 'FR' },
  { code: 'ar', label: 'العربية', flag: 'AR' },
];


export function Switcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  // Local state to force re-render on pathname change
  const [currentLocale, setCurrentLocale] = useState(locale);

  useEffect(() => {
    setCurrentLocale(locale);
  }, [pathname, locale]);

  const handleChange = (newLocale: string) => {
    if (newLocale === locale) return;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    // Force a hard reload after changing the locale:
    router.replace(newPath); // ensures new page fetches fresh data instantly
    router.refresh(); // forces a refresh for server-side data
  };


  return (
    <DropdownMenu key={locale}> {/* <--- key forces remount on locale change */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="group border-muted-foreground dark:bg-slate-600/50 border rounded-full">
          <Globe className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locales.map(l => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => handleChange(l.code)}
            className={l.code === locale ? "font-bold bg-slate-200 dark:bg-slate-600/50 text-blue-600 " : "cursor-pointer"}
          >
            {l.label}
            {l.code === locale && <span className="ml-auto text-blue-600">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
