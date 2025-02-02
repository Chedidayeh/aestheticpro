/* eslint-disable @next/next/no-img-element */
"use client";

import NextImage from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { SellerDesign } from "@prisma/client";
import { Eye, Sun, Moon } from "lucide-react";

const ViewDesign = ({
  frontDesign,
  backDesign,
}: {
  frontDesign?: SellerDesign;
  backDesign?: SellerDesign;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(true); // Toggle background color

  // Collect all available designs into an array
  const designs = [frontDesign, backDesign].filter(Boolean) as SellerDesign[];

  return (
    <>
      {/* Modal Dialog */}
      <AlertDialog open={isOpen}>
        <AlertDialogContent className="flex flex-col items-center justify-center bg-slate-200">
          <div className="flex items-center text-xs justify-between w-full px-4">
            {/* Toggle Background Button */}
            <Button
              onClick={() => setIsDarkBg(!isDarkBg)}
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              {isDarkBg ? <Sun size={16} /> : <Moon size={16} />}
              {isDarkBg ? "Light" : "Dark"} Mode
            </Button>
          </div>

          {designs.length > 0 ? (
            <Carousel className="w-full max-w-xs">
              <CarouselContent >
                {designs.map((design, index) => (
                  <CarouselItem key={index}>
                    <div
                      className={`p-1 flex items-center justify-center rounded-lg ${
                        isDarkBg ? "bg-gray-900" : "bg-gray-300"
                      }`}
                    >
                      <NextImage
                        src={design.imageUrl}
                        alt={`Design ${index + 1}`}
                        width={1000}
                        height={1000}
                        onContextMenu={(e) => e.preventDefault()}
                        className="object-cover"
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
              <Badge variant="secondary">No designs available</Badge>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Button to open modal */}
      <Button onClick={() => setIsOpen(true)} size="sm" variant="outline">
        View Product Design <Eye size="16" className="ml-1" />
      </Button>
    </>
  );
};

export default ViewDesign;
