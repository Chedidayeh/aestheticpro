/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import NextImage from 'next/image'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
  
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
  
  
  import Link from "next/link";
  
  import { cn } from "@/lib/utils";
  import React, { ChangeEvent, useMemo, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SellerDesign } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"
import { Input } from '@/components/ui/input'
import LoadingLink from '@/components/LoadingLink'
  


  interface ProductReelProps {
    designs : SellerDesign[]
  
  }
  
  const DesignView = ({ designs }: ProductReelProps) => { 

    const { toast } = useToast()


    // toggle Mode
    const [isDarkMode, setIsDarkMode] = useState(true);
    const handleToggleMode = () => {
      setIsDarkMode((prevMode) => !prevMode);
    };


// Search query for designs
const [searchQuery, setSearchQuery] = useState('');
const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(event.target.value);
};

// Sorting function based on sortBy criteria
const [sortBy, setSortBy] = useState<string>(''); // State for selected sort option

const filteredAndSortedDesigns = useMemo(() => {
  // Filter designs based on search query
  const filteredDesigns = (designs || []).filter(design =>
    design.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    design.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (design.tags && design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Sort the filtered designs based on the selected sort option
  return filteredDesigns.sort((a, b) => {
    switch (sortBy) {
      case 'low':
        return a.price - b.price;
      case 'high':
        return b.price - a.price;
      case 'sales':
        return b.totalSales - a.totalSales;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
}, [designs, searchQuery, sortBy]);

const handleSortChange = (event: string) => {
  setSortBy(event);
};
  
  

  
  


      const copyToClipboard = (text : string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: "Design Name is Copied",
                variant: 'default',
              }); 
        }).catch((err) => {
          console.error('Could not copy text: ', err);
        });
      };



    return (
      <>
       {/* store designs view */}
       {designs.length > 0 ? (

        <>

          <div className='  bg-muted/50 rounded-xl mx-auto text-center flex flex-col items-center max-w-1xl'>

          <div className="flex flex-col mb-4 mt-4 mx-4">
            <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex flex-col mb-4 lg:flex-row lg:items-center lg:gap-2">

            <div className="mt-3 flex flex-col sm:flex-row items-center justify-center sm:mt-0 lg:mt-0 lg:flex-1">
              <Input
                className="w-full sm:w-full mb-2 sm:mb-0 lg:w-full"
                type="text"
                placeholder="Search for a design..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="mt-3 flex flex-col sm:flex-row items-center justify-center sm:mt-0 lg:mt-0 lg:flex-1">
              <Select onValueChange={handleSortChange}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select</SelectLabel>
                    <SelectItem value="high">Highest Price</SelectItem>
                    <SelectItem value="low">Lowest Price</SelectItem>
                    <SelectItem value="sales">Most Selled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>


            <div className="flex items-center justify-center mt-3 lg:mt-0">
              <Button
                variant="default"
                size="sm"
                className="w-full sm:w-[70%] lg:w-auto text-white"
                onClick={handleToggleMode}
              >
                Toggle Mode
              </Button>
            </div>
          </div>

            </div>
            <div className="mt-3 text-muted-foreground text-sm">
              Total Designs found: {filteredAndSortedDesigns.length}
            </div>
            <div className="mt-3 text-blue-600 text-sm">
              Click on the design to copy its name then this :
            </div>
            <div className="mt-3  text-sm">
            <LoadingLink href={'/MarketPlace/create-client-product/select-category'}>
                  <Button size={"sm"} className="text-white" variant={"default"}>Try these Designs !</Button>
              </LoadingLink>  
          </div>
          </div>
                  </div>


          <ScrollArea
            className={cn(
              'relative h-96 sm:h-[400px] lg:h-[600px] flex-1 my-8 w-full  p-2    flex justify-center flex-col items-center'
            )}
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-2">
              {filteredAndSortedDesigns.map((design, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div onClick={() => copyToClipboard(design.name)} className={cn(`border-2 rounded-xl p-1 cursor-pointer `, isDarkMode ? 'bg-gray-900' : 'bg-gray-100' )}>
                    <Badge variant={'default'} className="text-white">{design.price.toFixed(2)} TND</Badge>
                    <NextImage
                      alt={`Product image ${index + 1}`}
                      className="aspect-square w-full rounded-md object-contain"
                      height={1000}
                      src={design.imageUrl}
                      width={1000}
                      onContextMenu={(e) => e.preventDefault()}
                      draggable={false}
                    />
                     <Badge
                    variant={'default'} className="text-white">
                    {design.name}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>


          </>
        ) : (


          <div className='flex h-full flex-col items-center justify-center space-y-1'>
          <div
            aria-hidden='true'
            className='relative h-40 w-40 text-muted-foreground'>
               <NextImage
                  fill
                  src='/hippo-empty-cart.png'
                  loading='eager'
                  alt='empty shopping cart hippo'
                />
          </div>
          <h3 className='font-semibold text-2xl'>
            This Designs section is empty
          </h3>
          <p className='text-muted-foreground text-center'>
            Whoops! Nothing to show here yet.
          </p>
        </div>

       
        )}

  
  

  
    </>
    );
  }
  
  export default DesignView;