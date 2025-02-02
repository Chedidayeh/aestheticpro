/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import NextImage from 'next/image'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Product, Store, User } from '@prisma/client'
import ProductListing from "@/components/MarketPlace/ProductListing"
import { useState } from "react"
import { fetchProductsByCollection } from './actions'
import LoadingState from '@/components/LoadingState'
import { useToast } from '@/components/ui/use-toast'

interface Productswithstore extends Product {
  store : Store
}

interface ProductReelProps {
  initialProducts : Productswithstore[]
  totalCount : number
  initialPage:number
  limit:number
  priceRanges : [number, number][]
  user : User
  collection : string
  categories : string[]
}


const ProductsByCollection = ({ initialProducts,totalCount,initialPage, limit,priceRanges, user , collection , categories}: ProductReelProps) => {

  const [products, setProducts] = useState(initialProducts);

  const [sortBy, setSortBy] = useState<string>(''); // State for selected sort option
  const [filterByCategory, setFilterByCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [currentPage, setCurrentPage] = useState(initialPage);  
  // totalCount state
  const [totalCountState, setTotalCountState] = useState(totalCount);

  const [open, setOpen] = useState<boolean>(false);

  const { toast } = useToast()


  const handleSortChange = async (event: string) => {
    try {
      setOpen(true);
      setCurrentPage(1); // Reset to first page on sort change
      setSortBy(event);
      const { products, totalCount } = await fetchProductsByCollection(collection, 1, limit, event, filterByCategory, priceRange);
      setProducts(products);
      setTotalCountState(totalCount);
    } catch (error) {
      console.error("Error fetching sorted products:", error);
      toast({
        title: "Something went wrong!",
        description: "There was an issue fetching the sorted products.",
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };
  
  
  const handleCategorySortChange = async (event: string) => {
    try {
      setOpen(true);
      setCurrentPage(1); // Reset to first page on category change
      setFilterByCategory(event);
      const { products, totalCount } = await fetchProductsByCollection(collection, 1, limit, sortBy, event, priceRange);
      setProducts(products);
      setTotalCountState(totalCount);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      toast({
        title: "Something went wrong!",
        description: "There was an issue fetching the products by category.",
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };
  
  
  
  const handlePriceRangeChange = async (value: string) => {
    try {
      setOpen(true);
      const rangeIndex = parseInt(value, 10);
      setPriceRange(priceRanges[rangeIndex]);
      setCurrentPage(1); // Reset to first page on price range change
      const { products, totalCount } = await fetchProductsByCollection(collection, 1, limit, sortBy, filterByCategory, priceRanges[rangeIndex]);
      setProducts(products);
      setTotalCountState(totalCount);
    } catch (error) {
      console.error("Error fetching products by price range:", error);
      toast({
        title: "Something went wrong!",
        description: "There was an issue fetching products within the selected price range.",
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };
  
  





  const handlePageChange = async (page: number) => {
    try {
      setOpen(true);
      if (page >= 1 && page <= totalPages) {
        const { products, totalCount } = await fetchProductsByCollection(collection, page, limit, sortBy, filterByCategory, priceRange);
        setProducts(products);
        setCurrentPage(page);
        setTotalCountState(totalCount);
      }
    } catch (error) {
      console.error("Error changing page:", error);
      toast({
        title: "Something went wrong!",
        description: "There was an issue loading the selected page.",
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };
  

  const totalPages = Math.ceil(totalCountState / limit)


  const renderPaginationItems = () => {
    const paginationItems = [];
  
    // If total pages are 10 or less, render all pages
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={currentPage === i} // Include isActive prop here
              style={{ cursor: 'pointer' }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show the first page
      paginationItems.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
            isActive={currentPage === 1} // Include isActive prop here
            style={{ cursor: 'pointer' }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
  
      // Add start ellipsis if necessary
      if (currentPage > 4) {
        paginationItems.push(<PaginationEllipsis key="start-ellipsis" />);
      }
  
      // Render middle pages
      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(totalPages - 1, currentPage + 2);
  
      for (let i = startPage; i <= endPage; i++) {
        paginationItems.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={currentPage === i} // Include isActive prop here
              style={{ cursor: 'pointer' }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
  
      // Add end ellipsis if necessary
      if (currentPage < totalPages - 3) {
        paginationItems.push(<PaginationEllipsis key="end-ellipsis" />);
      }
  
      // Always show the last page
      paginationItems.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
            isActive={currentPage === totalPages} // Include isActive prop here
            style={{ cursor: 'pointer' }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
  
    return paginationItems;
  };
  


  return (
    <section className='py-4'>
     
     <div className='bg-muted/50 rounded-xl py-8 mx-auto text-center flex flex-col items-center max-w-1xl'>
     <h1 className='text-4xl font-bold tracking-tight md:text-5xl'>
     {collection}{' '}
            <span className='text-blue-600'>
            Products
            </span>
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
              Discover the {collection}'s products section
            </p>    
            
            <div className="flex flex-col items-center justify-center">

            <div className="grid gap-4 mt-4 grid-cols-1 md:grid-cols-3 ">
            <div className=" flex-1">
        <Select onValueChange={handleSortChange}>
        <SelectTrigger className="w-full">
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
    <div className="flex-1">
            <Select onValueChange={handleCategorySortChange}>
            <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter By Category" />
            </SelectTrigger>
            <SelectContent>
            <SelectGroup>
                    <SelectLabel>Select</SelectLabel>
                    {categories.map((category, index) => (
                    <SelectItem key={index} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
            </SelectContent>
        </Select> 
    </div>
    <div className="flex-1">
    <Select onValueChange={handlePriceRangeChange}>
    <SelectTrigger className="w-full">
    <SelectValue placeholder="Select Price Range" />
    </SelectTrigger>
    <SelectContent>
    <SelectGroup>
       <SelectLabel>Select Price Range</SelectLabel>
      {priceRanges.map((range, index) => (
       <SelectItem key={index} value={index.toString()}>
        {range[0]} TND - {range[1]} TND
       </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
    </div>
  </div>

  <div className="mt-1 text-muted-foreground text-sm flex-1">
    <div className="mt-1"> {priceRange[0] === 0 && priceRange[1] === 0
      ? 'Select a price range'
      : `${priceRange[0].toFixed(2)} TND - ${priceRange[1].toFixed(2)} TND`}</div>
    </div>
  <div className="mt-3 text-muted-foreground text-sm">
    Products found: {totalCountState}
  </div>

  <div className="mt-3 text-muted-foreground text-sm">
    Current Page : {currentPage}
  </div>

            </div>

              
            </div>

            <div className='relative'>
            {products.length === 0 ? (
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
                No Products found !
              </h3>
              <p className='text-muted-foreground text-center'>
                Whoops! Nothing to show here yet.
              </p>
            </div>
            ) : (
              <>
             <LoadingState isOpen={open} />
            <div className=' w-full grid 
              lg:grid-cols-4 
              md:grid-cols-2 
              sm:grid-cols-2
              grid-cols-2
              gap-y-4
              gap-2
              sm:gap-x-8  
              md:gap-y-10
              lg:gap-x-4'>

            {products?.map((product, index) => (
              <ProductListing
                user={user}
                key={`product-${index}`}
                product={product}
                index={index+1}
              />
            ))} 

          </div>

          <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
              <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    if (currentPage === 1) {
                      e.preventDefault(); // Block interaction if disabled
                      return;
                    }
                    handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                  aria-disabled={currentPage === 1}
                  style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    if (currentPage === totalPages) {
                      e.preventDefault(); // Block interaction if disabled
                      return;
                    }
                    handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
                  aria-disabled={currentPage === totalPages}
                  style={{ cursor: currentPage === totalPages ? 'default' : 'pointer' }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        </>
            )}
   
      </div>
    </section>
  )


  
}




export default ProductsByCollection