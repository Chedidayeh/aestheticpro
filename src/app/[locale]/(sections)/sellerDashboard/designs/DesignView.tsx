/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// Indicates this file is a client-side component in Next.js

"use client"
import NextImage from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { useToast } from '@/components/ui/use-toast'
import { ChangeEvent, useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { CircleAlert, CircleDollarSign, CreditCard, OctagonAlert, SquarePen, Trash2 } from 'lucide-react';
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

import { deleteDesign, updateDesign } from './actions';
import { useRouter } from 'next/navigation';
import { Level, Platform, SellerDesign, Store } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { useMutation } from '@tanstack/react-query';
import LoadingState from '@/components/LoadingState';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
interface DesignViewProps {
  SellerDesignsData: SellerDesign[];
  platform: Platform
  level: Level
  store: Store
}


const DesignView = ({
  SellerDesignsData,
  platform,
  level,
  store,
}: DesignViewProps) => {
  const router = useRouter();
  const { toast } = useToast()
  const t = useTranslations('SellerDesignsPage');



  // serach and sort filter
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState<number>(0);
  const [isClicked, setIsClicked] = useState(false);

  const [open, setOpen] = useState<boolean>(false);


  // mutation hook for updating:
  const { mutate: update_Design, isPending: isUpdatePending } = useMutation({
    mutationFn: updateDesign,
    onSuccess: () => {
      setNewName("")
      setNewPrice(platform.platformDesignProfit + 1)
      toast({
        title: t('toast_update_success'),
        variant: 'default',
      });
      router.refresh()
    },
    onError: (error) => {
      console.error('Error updating design:', error);
      toast({
        title: t('toast_error'),
        description: t('toast_try_again'),
        variant: 'destructive',
      });
    }
  })

  const handleDelete = async (designId: string) => {
    setOpen(true)
    try {
      const res = await deleteDesign(designId)
      if (res) {
        toast({
          title: t('toast_delete_success'),
          variant: 'default',
        });
        setOpen(false)
        router.refresh()
      }
      else {
        toast({
          title: t('toast_delete_denied'),
          variant: 'destructive',
        });
        setOpen(false)

        router.refresh()
      }

    } catch (error) {
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

  const filteredDesigns = SellerDesignsData.filter((design) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const lowerCaseName = design.name.toLowerCase();
    const tagsMatch = design.tags && design.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
    return lowerCaseName.includes(lowerCaseQuery) || (design.tags && tagsMatch);
  });

  if (sortOption === 'sales') {
    filteredDesigns.sort((a, b) => b.totalSales - a.totalSales);
  } else if (sortOption === 'high') {
    filteredDesigns.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'low') {
    filteredDesigns.sort((a, b) => a.price - b.price);
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: string) => {
    setSortOption(e);
  };



  // toggle Mode
  const [isDarkMode, setIsDarkMode] = useState(true);
  const handleToggleMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };


  // check seller profit 
  const [sellerProfitError, setSellerProfitError] = useState('');
  const inputClassName = sellerProfitError ? 'border-red-500' : (newPrice ? 'border-green-500' : '');
  const handleSellerProfitBlur = () => {
    if (newPrice > platform.maxDesignSellerProfit || newPrice < platform.platformDesignProfit + 1) {
      setSellerProfitError(t('seller_profit_error', { max: platform.maxDesignSellerProfit, min: platform.platformDesignProfit + 1 }));
    } else {
      setSellerProfitError('');
    }
  };



  // State variables
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Function to handle download
  const downloadDesign = async (imageUrl: string) => {

    if (imageUrl === '') {
      toast({
        title: t('toast_no_design'),
        variant: "destructive",
      });
      return;
    }
    setIsDownloadOpen(true)
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "design_image.png"; // You can set the filename here
      document.body.appendChild(a);
      a.click();
      a.remove();
      setIsDownloadOpen(false)

    } catch (error) {
      console.error("Error downloading design:", error);
      toast({
        title: t('toast_download_failed'),
        variant: "destructive",
      });
      setIsDownloadOpen(false)

    }
  };






  return (

    <>
      <div>
        <p className="text-sm text-muted-foreground mb-2">{t('breadcrumb')}</p>
        <h1 className="text-2xl font-semibold mb-8">{t('title')}</h1>
        <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="px-7 space-y-4 bg-muted/50 rounded-t-lg">
            <CardDescription>{t('total_designs', { count: SellerDesignsData.length, limit: !store.unlimitedCreation ? level.designLimit : t('unlimited') })}</CardDescription>


            <Link href="/sellerDashboard/createDesign"
              className={buttonVariants({
                size: 'sm',
                className: 'items-center w-44 gap-1 text-white',
              })}
            >
              {t('create_new_design')}
            </Link>

            <div className="flex items-center space-x-2 mt-4">

              <Input
                type="search"
                className="md:w-[30%] w-full"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={handleSearchChange}
              />

              {/* Sorting select */}
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[160px] ">
                  <SelectValue placeholder={t('sort_by')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('sort_by')}</SelectLabel>
                    <SelectItem value="sales">{t('sales')}</SelectItem>
                    <SelectItem value="high">{t('highest_price')}</SelectItem>
                    <SelectItem value="low">{t('lowest_price')}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>


            <p className='text-muted-foreground text-sm mt-4'><span className='text-blue-600 font-medium'>{t('guide')}</span> {t('refresh_guide')}</p>
            <p className='text-muted-foreground text-sm'><span className='text-blue-600 font-medium'>{t('guide')}</span> {t('under_review_guide')}</p>
            <div className='text-center'>
              <Button variant="default" size="sm" className=" mt-2 text-white" onClick={handleToggleMode}>
                {t('toggle_mode')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {SellerDesignsData.length === 0 ? (
              <>
                <div className="flex mt-2 items-center justify-center flex-col text-muted-foreground">
                  <h1 className="text-center text-3xl font-bold">
                    <CircleAlert />
                  </h1>
                  <p className="text-center text-sm mt-2">{t('no_designs')}</p>
                  <p className="text-center text-xs mt-2">{t('try_create_designs')}</p>

                </div>
              </>
            ) : (
              <>
                {filteredDesigns.length === 0 ? (
                  <div className="flex mt-2 items-center justify-center flex-col text-muted-foreground">
                    <h1 className="text-center text-3xl font-bold">
                      <CircleAlert />
                    </h1>
                    <p className="text-center text-sm mt-2">{t('no_designs_by_name')}</p>
                  </div>

                ) : (

                  <ScrollArea className="h-[984px] w-full ">
                    <div className='relative mt-5 grid grid-cols-1 mb-20 pb-20 p-2'>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xl:grid-cols-4 md:grid-cols-3">
                        {/* designs Cards */}
                        {filteredDesigns.map((design, index) => (
                          <Card
                            key={index}
                            x-chunk="dashboard-05-chunk-3"
                            className={cn('lg:rounded-lg shadow-lg', isDarkMode ? 'bg-gray-900' : 'bg-gray-100', 'hover:transform hover:scale-105 transition duration-300')}
                          >
                            <CardHeader className="px-7 relative flex items-center justify-center">
                              <div className="absolute top-2 left-2 right-2 flex justify-between">
                                <Badge className="bg-blue-700 text-white px-2 py-1 rounded">
                                  {design.name}
                                </Badge>
                                {design.isDesignAccepted && (
                                  <Badge className="bg-green-700 text-white px-2 py-1 rounded">
                                    {t('accepted')}
                                  </Badge>
                                )}
                                {design.isDesignRefused && (
                                  <Badge className="bg-red-500 text-white px-2 py-1 rounded">
                                    {t('refused')}
                                  </Badge>
                                )}
                                {!design.isDesignAccepted && !design.isDesignRefused && (
                                  <Badge className="bg-gray-500 text-white px-2 py-1 rounded">
                                    {t('under_review')}
                                  </Badge>
                                )}

                                <div className="absolute top-8 right-0 z-10 text-center">
                                  <Badge
                                    onClick={() => {
                                      setIsDownloadOpen(true);
                                      downloadDesign(design.imageUrl);
                                    }}
                                    className="bg-purple-500 hover:bg-purple-400  cursor-pointer px-2 py-1 text-white rounded">
                                    {t('download_product')}
                                  </Badge>
                                </div>


                                <div className="absolute top-8 left-0 z-10 text-center">
                                  <Badge variant="secondary" className="bg-gray-200">
                                    <CircleDollarSign className="mr-2 h-4 w-4 text-green-800 opacity-70" />
                                    <span className="text-xs text-gray-600">{design.price.toFixed(2)} TND</span>
                                  </Badge>
                                </div>

                                <div className="absolute top-14 left-0 z-10 text-center">
                                  <Badge variant="secondary" className="bg-gray-200">
                                    <CreditCard className="mr-2 h-4 w-4 text-red-800 opacity-70" />
                                    <span className="text-xs text-gray-600">{t('sales', { count: design.totalSales })}</span>
                                  </Badge>
                                </div>

                              </div>




                            </CardHeader>
                            <CardContent className="relative flex items-center justify-center p-10">
                              <NextImage
                                onContextMenu={(e) => e.preventDefault()}
                                src={design.imageUrl}
                                alt={design.name}
                                loading="eager"
                                blurDataURL="/Loading.png"
                                placeholder="blur"
                                width={3000}
                                height={3000}
                                className="rounded-md object-contain"
                              />
                            </CardContent>
                            <CardFooter className="relative">

                              {/* Edit design  */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <SquarePen className=" cursor-pointer absolute bottom-2 left-3 mt-1 mr-1 text-gray-400 hover:text-blue-500 transform hover:scale-110 hover:rotate-6 transition duration-200" />
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{t('edit_your_design')}</AlertDialogTitle>
                                    <AlertDialogDescription className='flex flex-col'>
                                      <div>
                                        {t('older_name')} <span className='text-blue-700 font-semibold ml-4'>{design.name}</span>
                                      </div>
                                      <div>
                                        {t('older_price')} <span className='text-blue-700 font-semibold ml-6'>{design.price.toFixed(2)} TND</span>
                                      </div>
                                      <div>
                                        {t('older_seller_profit')} <span className='text-blue-700 font-semibold ml-6'>{design.sellerProfit.toFixed(2)} TND</span>
                                      </div>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="DesignName" className="text-right">
                                        {t('new_name')}
                                      </Label>
                                      <Input
                                        id="DesignName"
                                        defaultValue={design.name}
                                        onChange={(e) => setNewName(e.target.value)}
                                        maxLength={37}
                                        placeholder={t('choose_new_name')}
                                        className="col-span-3"
                                      />
                                      <Label htmlFor="DesignPrice" className="text-right">
                                        {t('new_price')}
                                      </Label>
                                      <div className="col-span-3">
                                        <Input
                                          id="designPrice"
                                          type="number"
                                          placeholder={`Max ${platform.maxDesignSellerProfit} TND | Min ${platform.platformDesignProfit + 1} TND`}
                                          onBlur={handleSellerProfitBlur}
                                          min={3}
                                          max={10}
                                          className={`${inputClassName} text-black bg-gray-100 focus:ring-0 focus:border-green-500`}
                                          onChange={(e) => setNewPrice(Number(e.target.value))}
                                        />
                                        {sellerProfitError && (
                                          <p className="text-xs text-red-500 my-2">
                                            {sellerProfitError}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <AlertDialogFooter className='gap-2'>
                                    {newPrice <= platform.maxDesignSellerProfit && newPrice >= platform.platformDesignProfit + 1 && (
                                      <div className='flex'>
                                        <Label className='mr-10'>
                                          <span className="text-green-700 font-bold">
                                            {t('your_new_profit', { profit: (newPrice - platform.platformDesignProfit).toFixed(2) })} TND
                                          </span>
                                        </Label>
                                      </div>
                                    )}
                                    <AlertDialogCancel onClick={() => {
                                      setNewName("")
                                      setNewPrice(0)
                                    }}>
                                      {t('cancel')}
                                    </AlertDialogCancel>
                                    <AlertDialogAction className='text-white'
                                      disabled={newName === "" || isUpdatePending || newPrice > platform.maxDesignSellerProfit || newPrice < platform.platformDesignProfit || !newPrice}
                                      onClick={() => update_Design({ designId: design.id, newName, newPrice })}
                                    >
                                      {isUpdatePending ? t('saving') : t('save')}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              {/* Delete design  */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Trash2 className="cursor-pointer absolute bottom-2 right-3 mt-1 mr-1 text-gray-400 hover:text-red-500 transform hover:scale-110 hover:rotate-6 transition duration-200" />
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                                  <AlertDialogHeader className="flex flex-col items-center">
                                    <div className="text-red-500 mb-2">
                                      <OctagonAlert className='' />
                                    </div>
                                    <AlertDialogTitle className="text-xl font-bold text-center">
                                      {t('delete_confirm')}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t('delete_warning')}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>

                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(design.id)}
                                      className='bg-red-500 hover:bg-red-500'>{t('delete')}</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>

                )}
              </>
            )}


          </CardContent>
          <CardFooter className='relative flex flex-col items-center justify-center' />
        </Card>

      </div>



      <LoadingState isOpen={isDownloadOpen} />
      <LoadingState isOpen={open} />



    </>

  );
};

export default DesignView;

