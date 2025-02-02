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


const ViewCategoryQuality = ( {category} : { category: Category } ) => {


    const [isOpen, setisOpen] = useState(false);


    return (

      <>
              <AlertDialog open={isOpen}  >
        <AlertDialogContent className={`flex flex-col items-center justify-center bg-slate-200`}>
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

      <Button onClick={() => setisOpen(true)} variant="secondary">
      View {category.label} Quality
      </Button>
      </>

    )

}

export default ViewCategoryQuality