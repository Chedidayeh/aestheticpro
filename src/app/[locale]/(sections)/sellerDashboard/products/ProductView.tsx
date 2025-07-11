/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// Indicates this file is a client-side component in Next.js

"use client"
import NextImage from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { ChangeEvent, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { CircleAlert, CircleDollarSign, CreditCard, Eye, Loader, OctagonAlert, PenTool, SquarePen, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { deleteProduct, updateProduct } from './actions';
import { useRouter } from 'next/navigation';
import { Collection, Level, Product, Store } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import ImageSlider from "@/components/MarketPlace/ImageSlider";
import LoadingState from "@/components/LoadingState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
interface ProductViewProps {
  sellerProductsData: Product[];
  totalProductViews: number
  collections: ExtraCollection[]
  level: Level
  store: Store
}

interface ExtraCollection extends Collection {
  products: Product[]
}


const ProductView = ({
  sellerProductsData,
  totalProductViews,
  collections,
  level,
  store,
}: ProductViewProps) => {
  const router = useRouter();
  const { toast } = useToast()
  const t = useTranslations('SellerProductsPage');




  // serach and sort filter
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [newTitle, setnewTitle] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(selectedProduct?.collectionName!);
  const [isClicked, setIsClicked] = useState(false);
  const [open, setOpen] = useState<boolean>(false);


  // Handle change of selection
  const handleSelectChange = (value: string) => {
    // Ensure the value is of type Collection
    setSelectedCollection(value);
  };




  const [isEditOpen, setIsEditOpen] = useState(false)
  const handleSave = async (productId: string) => {
    try {
      setOpen(true)
      await updateProduct({ productId, newTitle, selectedCollection })
      setnewTitle("")
      toast({
        title: t('toast_update_success'),
        variant: 'default',
      });
      setOpen(false)
      setIsEditOpen(false)
      router.refresh()
    } catch (error) {
      setIsEditOpen(false)
      setOpen(false)
      console.error('Error updating Product:', error);
      toast({
        title: t('toast_error'),
        description: t('toast_try_again'),
        variant: 'destructive',
      });
    }
  };


  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const handleDelete = async (productId: string) => {
    try {
      setOpen(true)

      const res = await deleteProduct(productId)
      if (res) {
        setOpen(false)
        toast({
          title: t('toast_delete_success'),
          variant: 'default',
        });
        setIsDeleteOpen(false)
        router.refresh()
      }
      else {
        setOpen(false)
        setIsDeleteOpen(false)
        toast({
          title: t('toast_delete_denied'),
          variant: 'destructive',
        });
        router.refresh()
      }

    } catch (error) {
      setIsDeleteOpen(false)
      setOpen(false)
      console.error('Error updating Product:', error);
      toast({
        title: t('toast_error'),
        description: t('toast_try_again'),
        variant: 'destructive',
      });
    }
  };


  // search and sort filter

  const filteredProduct = sellerProductsData.filter((product) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const lowerCaseName = product.title.toLowerCase();
    const tagsMatch = product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
    return lowerCaseName.includes(lowerCaseQuery) || (product.tags && tagsMatch);
  });

  if (sortOption === 'sales') {
    filteredProduct?.sort((a, b) => b.totalSales - a.totalSales);
  } else if (sortOption === 'high') {
    filteredProduct?.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'low') {
    filteredProduct?.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'views') {
    filteredProduct?.sort((a, b) => b.totalViews - a.totalViews);
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: string) => {
    setSortOption(e);
  };


  const [productImgs, setproductImgs] = useState<string[]>([])
  const viewProduct = (product: Product) => {
    let imgs = [] as string[]
    product.croppedFrontProduct.map((img: string) => {
      imgs.push(img)
    })
    product.croppedBackProduct.map((img: string) => {
      imgs.push(img)
    })
    setproductImgs(imgs)
  }


  // State variables
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Function to handle download
  const downloadMockup = async (imageUrls: string[]) => {
    try {
      setIsDownloadOpen(true);

      // Loop through each imageUrl and download
      for (let i = 0; i < imageUrls.length; i++) {
        const response = await fetch(imageUrls[i]);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `design_image_${i + 1}.png`; // Set dynamic filename or customize as needed
        document.body.appendChild(a);
        a.click();
        a.remove();
      }

      setIsDownloadOpen(false);
    } catch (error) {
      setIsDownloadOpen(false);
      console.error("Error downloading designs:", error);
      toast({
        title: t('toast_download_failed'),
        variant: "destructive",
      });
    }
  };



  return (

    <>

      {/* downloading Loader  */}
      {/* downloading Loader  */}
      <AlertDialog open={isDownloadOpen} >
        <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
          <AlertDialogHeader className="flex flex-col items-center justify-center">
            <AlertDialogTitle className="flex flex-col items-center justify-center">{t('downloading')}</AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col items-center justify-center">
              {t('downloading_wait')}
            </AlertDialogDescription>
            <Loader size={20} className="text-blue-700 animate-spin mt-3" />
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>



      <p className="text-sm text-muted-foreground mb-2">{t('breadcrumb')}</p>
      <h1 className="text-2xl font-semibold mb-8">{t('title')}</h1>


      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="px-7 space-y-4 bg-muted/50 rounded-t-lg">
          <CardDescription>{t('total_products', { count: sellerProductsData.length, limit: !store.unlimitedCreation ? level.productLimit : t('unlimited') })}</CardDescription>

          <CardDescription className="text-blue-500">{t('total_products_views', { count: totalProductViews })}</CardDescription>

          <Link href="/sellerDashboard/createProduct"
            className={buttonVariants({
              size: 'sm',
              className: 'items-center w-44 gap-1 text-white',
            })}
          >
            {t('create_new_product')}
          </Link>

          {/* Sorting select */}
          <div className="flex items-center space-x-2 mt-4">
            <Input
              type="search"
              className="md:w-[30%] w-full"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={t('sort_by')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('sort_by')}</SelectLabel>
                  <SelectItem value="sales">{t('most_selled')}</SelectItem>
                  <SelectItem value="high">{t('highest_price')}</SelectItem>
                  <SelectItem value="low">{t('lowest_price')}</SelectItem>
                  <SelectItem value="views">{t('views')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>


          </div>

          <p className="text-muted-foreground text-sm mt-4">
            <span className="text-blue-600 font-medium">{t('guide')}</span> {t('refresh_guide')}
          </p>
          <p className="text-muted-foreground text-sm">
            <span className="text-blue-600 font-medium">{t('guide')}</span> {t('under_review_guide')}
          </p>
        </CardHeader>
        <CardContent>
          {sellerProductsData.length == 0 ? (
            <>
              <div className="flex mt-2 items-center justify-center flex-col text-muted-foreground">
                <h1 className="text-center text-3xl font-bold">
                  <CircleAlert />
                </h1>
                <p className="text-center text-sm mt-2">{t('no_products')}</p>
                <p className="text-center text-xs mt-2">{t('try_create_products')}</p>

              </div>
            </>
          ) : (
            <>
              {filteredProduct.length === 0 ? (
                <div className="flex mt-2 items-center justify-center flex-col text-muted-foreground">
                  <h1 className="text-center text-3xl font-bold">
                    <CircleAlert />
                  </h1>
                  <p className="text-center text-sm mt-2">{t('no_products_by_title')}</p>
                </div>
              ) : (
                <ScrollArea className='w-full h-[984px]'>
                  <div className="relative mt-5 grid grid-cols-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-2">
                      {/* Product Cards */}
                      {filteredProduct.map((product, index) => (
                        <div key={index} className="relative aspect-square">
                          <ImageSlider
                            urls={[
                              ...(product.croppedFrontProduct ?? []),
                              ...(product.croppedBackProduct ?? []),
                            ]}
                          />

                          {/* Badges */}
                          <div className="absolute top-2 right-2 px-2 py-1 z-10 rounded">
                            {product.isProductAccepted && (
                              <Badge className="bg-green-700 text-white px-2 py-1 rounded">
                                {t('accepted')} {product.privateProduct ? "| " + t('private') : ""}
                              </Badge>
                            )}
                            {product.isProductRefused && (
                              <Badge className="bg-red-500 text-white px-2 py-1 rounded">
                                {t('refused')}
                              </Badge>
                            )}
                            {!product.isProductAccepted && !product.isProductRefused && (
                              <Badge className="bg-gray-500 text-white px-2 py-1 rounded">
                                {t('under_review')}
                              </Badge>
                            )}
                          </div>

                          <div className="absolute top-10 right-2 px-2 py-1 z-10 rounded">
                            <Badge
                              onClick={() => {
                                setIsDownloadOpen(true);
                                viewProduct(product);
                                downloadMockup(productImgs);
                              }}
                              className="bg-purple-500 hover:bg-purple-400 cursor-pointer text-white px-2 py-1 rounded">
                              {t('download_product')}
                            </Badge>
                          </div>


                          <div className="absolute top-2 left-2 px-2 py-1 z-10 rounded">
                            <Badge variant="secondary" className="bg-gray-200">
                              <CircleDollarSign className="mr-2 h-4 w-4 text-green-800 opacity-70" />
                              <span className="text-xs text-gray-600">{product.price.toFixed(2)} TND</span>
                            </Badge>
                          </div>

                          <div className="absolute top-8 left-2 px-2 py-1 z-10 rounded">
                            <Badge variant="secondary" className="bg-gray-200">
                              <Eye className="mr-2 h-4 w-4 text-blue-800 opacity-70" />
                              <span className="text-xs text-gray-600">{t('views', { count: product.totalViews })}</span>
                            </Badge>
                          </div>

                          <div className="absolute top-14  left-2 px-2 py-1 z-10 rounded">
                            <Badge variant="secondary" className="bg-gray-200">
                              <CreditCard className="mr-2 h-4 w-4 text-red-800 opacity-70" />
                              <span className="text-xs text-gray-600">{t('sales', { count: product.totalSales })}</span>
                            </Badge>
                          </div>

                          <div className="absolute bottom-8 left-0 right-0 z-10 text-center">
                            <Badge variant="secondary" className="bg-gray-200 text-black">
                              {product.title}
                            </Badge>
                          </div>

                          <div
                            className="z-10 cursor-pointer border rounded-lg border-gray-700 p-1
                          absolute bottom-2 left-3 mt-1 mr-1 
                          text-muted-foreground hover:text-blue-500 hover:border-blue-500  
                          transform 
                          hover:scale-110 hover:rotate-6 transition duration-200"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsEditOpen(true);
                            }}
                          >
                            <SquarePen />
                          </div>

                          <div
                            className="z-10 cursor-pointer border rounded-lg border-gray-700 p-1
                          absolute bottom-2 right-3 mt-1 mr-1 
                          text-muted-foreground hover:text-red-500 hover:border-red-500  
                          transform 
                          hover:scale-110 hover:rotate-6 transition duration-200"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 />
                          </div>


                        </div>

                      ))}
                    </div>
                  </div>
                </ScrollArea>
              )}
            </>
          )}




        </CardContent>
      </Card>



      {selectedProduct && (

        <>
          {/* Edit product */}
          <AlertDialog open={isEditOpen}>
            <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
              <AlertDialogHeader>
                <AlertDialogTitle>{t('edit_product')}</AlertDialogTitle>
                <AlertDialogDescription className='flex flex-col'>
                  <div>
                    {t('title')}: <span className='text-gray-700 font-semibold'>{selectedProduct.title}</span>
                  </div>
                  <div>
                    {t('collection')}: <span className='text-gray-700 font-semibold'>{selectedProduct.collectionName}</span>
                  </div>
                  <div>
                    {t('product_base_price')}: <span className='text-gray-700 font-semibold'>{selectedProduct.basePrice.toFixed(2)} TND</span>
                  </div>
                  <div>
                    {t('price')}: <span className='text-gray-700 font-semibold'>{selectedProduct.price.toFixed(2)} TND</span>
                  </div>
                  <div>
                    {t('your_profit')}: <span className='text-gray-700 font-semibold'>{selectedProduct.sellerProfit.toFixed(2)} TND</span>
                  </div>
                  {selectedProduct.frontDesignId && selectedProduct.backDesignId && (
                    <div>
                      {t('extra_design_selected')}: <span className='text-gray-700 font-semibold'>+ 5 TND</span>
                    </div>
                  )}

                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-4 py-4">
                {/* First Row: New Title */}
                <div className="grid grid-cols-1 lg:grid-cols-4 items-center gap-4">
                  <Label htmlFor="productTitle" className="text-left lg:col-span-1">{t('new_title')}</Label>
                  <Input
                    id="productTitle"
                    defaultValue={selectedProduct.title}
                    onChange={(e) => setnewTitle(e.target.value)}
                    maxLength={30}
                    placeholder={t('choose_new_title')}
                    className="col-span-1 lg:col-span-3"
                  />
                </div>

                {/* Second Row: Change Collection */}
                <div className="grid grid-cols-1 lg:grid-cols-4 items-center gap-4">
                  <Label htmlFor="selectedCollection" className="text-left lg:col-span-1">{t('change_collection')}</Label>
                  <Select
                    defaultValue={selectedProduct.collectionName!}
                    onValueChange={handleSelectChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder={t('select_collection')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t('collections')}</SelectLabel>
                        {collections.map((collection, index) => (
                          <SelectItem key={index} value={collection.name}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <AlertDialogFooter className='flex items-center justify-center'>
                <AlertDialogCancel className='w-20' onClick={() => {
                  setnewTitle("")
                  setSelectedCollection("")
                  setIsEditOpen(false)
                }}>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction className='w-24 text-white'
                  disabled={newTitle === "" || selectedCollection === undefined}
                  onClick={() => handleSave(selectedProduct.id)}
                >
                  {t('save')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Delete product */}
          <AlertDialog open={isDeleteOpen}>
            <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
              <AlertDialogHeader className="flex flex-col items-center">
                <div className="text-red-500 mb-2">
                  <OctagonAlert className='' />
                </div>
                <AlertDialogTitle className="text-xl font-bold text-center">{t('delete_product_confirm')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('delete_product_confirm_description')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteOpen(false)}>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(selectedProduct.id)}
                  className='bg-red-500 hover:bg-red-500'
                >
                  {t('delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      <LoadingState isOpen={open} />


    </>

  );
};

export default ProductView;

