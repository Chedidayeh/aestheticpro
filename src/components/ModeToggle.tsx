"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <>
    <div className="hidden md:flex">
    <Button onClick={toggleTheme} variant="ghost" size="icon" className="group border border-muted-foreground dark:bg-slate-600/50 rounded-full">
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-yellow-400 dark:text-slate-400 dark:-rotate-90 dark:scale-0 group-hover:rotate-180 group-hover:text-yellow-500" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all text-slate-400 dark:text-blue-400 dark:rotate-0 dark:scale-100 group-hover:rotate-45 group-hover:dark:text-blue-500 group-hover:text-slate-600" />
    </Button>
    </div>
    <div className="md:hidden flex">
    <Button onClick={toggleTheme} variant="ghost" size="icon" className="group border border-muted-foreground dark:bg-slate-600/50 rounded-full">
      <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 text-yellow-400 dark:text-slate-400  dark:scale-0  group-hover:text-yellow-500" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0   text-slate-400 dark:text-blue-400 dark:scale-100 group-hover:dark:text-blue-500 group-hover:text-slate-600" />
    </Button>
    </div>

</>

  )
}