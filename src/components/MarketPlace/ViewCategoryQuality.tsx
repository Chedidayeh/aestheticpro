/* eslint-disable @next/next/no-img-element */
'use client'

import NextImage from 'next/image'


import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
  } from "@/components/ui/alert-dialog"
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Category } from "@prisma/client";
import { Eye } from 'lucide-react';


const ViewCategoryQuality = ( {category} : { category: Category } ) => {


    const [isOpen, setisOpen] = useState(false);


    return (

      <>
              <AlertDialog open={isOpen}  >
              <AlertDialogContent className="rounded-xl p-16 md:p-8 max-w-[90%] flex flex-col items-center justify-center bg-slate-200 sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
        <div className="flex items-center justify-center cursor-pointer">
          <Badge variant="secondary">
          {category.label}
          </Badge>
          </div>
          {category.quality.length > 0 ? (
        <Carousel className="w-full max-w-xs">
    
           <CarouselContent>
                
               {category.quality.map((image, index) => (
                  <CarouselItem key={index}>
                        <div className="p-1">
                             <NextImage src={image} alt={`Product Image ${index + 1}`}
                             onContextMenu={(e) => e.preventDefault()}
                              className="object-cover transition-transform duration-500 transform hover:scale-150"
                               />
                        </div>
                            </CarouselItem>
                       ))}
                 </CarouselContent>
              <CarouselPrevious />
                <CarouselNext />
         </Carousel>               
               ) : (
                <div className="flex items-center justify-center cursor-pointer">
                <Badge variant="secondary">
                No images available for now

                </Badge>
                </div>
               )}
        <AlertDialogFooter>
        <AlertDialogCancel onClick={()=>setisOpen(false)}>Close</AlertDialogCancel>
          </AlertDialogFooter>
          </AlertDialogContent>
    </AlertDialog>

      <Button onClick={() => setisOpen(true)} size={"sm"} variant="outline">
      View {category.label} Quality <Eye size={"16"} className='ml-1'/>
      </Button>
      </>

    )

}

export default ViewCategoryQuality