/* eslint-disable @next/next/no-img-element */
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
import { Product, Store, User } from '@prisma/client'
import ProductListing from "@/components/MarketPlace/ProductListing"
import { useMemo, useState } from "react"
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface Productswithstore extends Product {
  store : Store
}

interface ProductReelProps {
  products? : Productswithstore[]
  user : User
  categories : string[]
  collections : string[]

}
const FavList = ({ products, user , categories , collections }: ProductReelProps) => {
  const t = useTranslations('FavListPage');
  // Sorting function based on sortBy criteria
  const [sortBy, setSortBy] = useState<string>(''); // State for selected sort option
  const [sortByCategory, setSortByCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [filterByCollection, setFilterByCollection] = useState<string>("");

  function calculatePriceRanges(products: Product[]): [number, number][] {
    if (products.length === 0) return [];
  
    const prices = products.map(product => product.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;
  
    // If all prices are the same, return a single range
    if (range === 0) return [[minPrice, maxPrice]];
  
    // Determine the number of ranges based on the price distribution
    const numberOfRanges = range < 5 ? 1 : 3; // Use 1 range for small price ranges, otherwise 3
  
    const step = Math.ceil(range / numberOfRanges);
  
    const priceRanges: [number, number][] = [];
  
    for (let i = 0; i < numberOfRanges; i++) {
      const start = minPrice + i * step;
      const end = i === numberOfRanges - 1 ? maxPrice : start + step - 1;
      priceRanges.push([start, end]);
    }
  
    return priceRanges;
  }
  
  
  

  const priceRanges: [number, number][] = useMemo(() => calculatePriceRanges(products || []), [products]);


  const sortedProducts = useMemo(() => {
    return [...(products || [])].sort((a, b) => {    switch (sortBy) {
      case 'low':
        return a.price - b.price;
        case 'high':
        return b.price - a.price;
      case 'sales':
        return b.totalSales - a.totalSales; 
      default:
        return 0
    }
  });
}, [products, sortBy]);


  // Memoize the filtered products to avoid unnecessary computations
  const filteredProducts = useMemo(() => {
    let result = sortedProducts;
  
    if (sortByCategory) {
      result = result.filter((product) =>
        product.category.toLowerCase().includes(sortByCategory.toLowerCase())
      );
    }
    if (priceRange[0] !== 0 && priceRange[1] !== 0) { // Apply price range filter only if slider is interacted with
      result = result.filter((product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }
    if (filterByCollection) {
      result = result.filter((product) =>
        product.collectionName.toLowerCase().includes(filterByCollection.toLowerCase())
      );
    }

    return result;
  }, [sortedProducts, sortByCategory, priceRange, filterByCollection]);

  const handleSortChange = (event: string) => {
    setSortBy(event); 

  };


  const handleCategorySortChange = (event: string) => {
    setSortByCategory(event);

  };
  const handleCollectionSortChange = (event: string) => {
    setFilterByCollection(event);

  };
  const handlePriceRangeChange = (value: string) => {
    const rangeIndex = parseInt(value, 10);
    setPriceRange(priceRanges[rangeIndex]);
  };


  return (
    <section className='my-4'>
     
     <div className='bg-muted/50 rounded-xl py-8 mx-auto text-center flex flex-col items-center max-w-1xl'>
     <h1 className='text-4xl font-bold tracking-tight md:text-5xl'>
     {t('your')}{' '}
            <span className='text-red-500'>
            {t('favlist')}
            </span>
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
              {t('enjoy_shopping')}
            </p> 


            <div className="flex flex-col items-center justify-center">
            <div className="grid gap-4 mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex-1">
        <Select onValueChange={handleSortChange}>
        <SelectTrigger className="w-full">
        <SelectValue placeholder={t('sort_by')} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{t('select')}</SelectLabel>
                    <SelectItem value="high">{t('highest_price')}</SelectItem>
                    <SelectItem value="low">{t('lowest_price')}</SelectItem>
                    <SelectItem value="sales">{t('most_selled')}</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select> 
    </div>
    <div className="flex-1">
            <Select onValueChange={handleCategorySortChange}>
            <SelectTrigger className="w-full">
            <SelectValue placeholder={t('filter_by_category')} />
            </SelectTrigger>
            <SelectContent>
            <SelectGroup>
                    <SelectLabel>{t('select')}</SelectLabel>
                    {categories.map((category, index) => (
                    <SelectItem key={index} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
            </SelectContent>
        </Select> 
    </div>
    <div className=" flex-1">
                <Select onValueChange={handleCollectionSortChange}>
                <SelectTrigger className="w-full">
                <SelectValue placeholder={t('filter_by_collection')} />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectGroup>
                    <SelectLabel>{t('select')}</SelectLabel>
                    {collections.map((collection, index) => (
                    <SelectItem key={index} value={collection}>
                      {collection}
                    </SelectItem>
                  ))}
                </SelectGroup>
                    </SelectContent>
                </Select>
                </div>
    <div className="flex-1">
    <Select onValueChange={handlePriceRangeChange}>
    <SelectTrigger className="w-full">
    <SelectValue placeholder={t('select_price_range')} />
    </SelectTrigger>
    <SelectContent>
       <SelectGroup>
       <SelectLabel>{t('select_price_range')}</SelectLabel>
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
      ? t('select_a_price_range')
      : `${priceRange[0].toFixed(2)} TND - ${priceRange[1].toFixed(2)} TND`}</div>
    </div>
  <div className="mt-3 text-muted-foreground text-sm">
    {t('products_found', {count: products!.length})}
  </div>

            </div>

              
            </div>

            <div className='relative'>

            {filteredProducts.length === 0 ? (
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
                  {t('favlist_empty')}
                </h3>
                <p className='text-muted-foreground text-center'>
                  {t('nothing_to_show')}
                </p>
                <Link href="/MarketPlace" className='text-blue-600 text-sm'>
                {t('add_items')}
                </Link>
              </div>
            ) : (
              <>
            
            <div className=' w-full grid mt-6
              lg:grid-cols-4 
              md:grid-cols-2 
              sm:grid-cols-2
              grid-cols-1
              gap-y-4
              gap-2
              sm:gap-x-8  
              md:gap-y-10
              lg:gap-x-4'>

            {filteredProducts?.map((product, index) => (
              <ProductListing
                user={user}
                key={`product-${index}`}
                product={product}
                index={index+1}
              />
            ))} 

          </div>

        </>
            )}

   
      </div>
    </section>
  )


  
}




export default FavList