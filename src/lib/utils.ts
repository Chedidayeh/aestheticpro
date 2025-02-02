


import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Metadata } from 'next'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function constructMetadata({
  title = 'AestheticPro - Print On Demand Company',
  description = 'Browse Aesthetic Prints and Pro Quality',
  image = '/thumbnail.png',
  icons = '/favicon.ico',
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    icons,
    metadataBase: new URL("https://tunipod.vercel.app/")
  }
}





