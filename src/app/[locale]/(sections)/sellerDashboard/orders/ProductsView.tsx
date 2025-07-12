/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// Indicates this file is a client-side component in Next.js

"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
 

 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from '@/components/ui/use-toast'
import {  ChangeEvent, useEffect, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import {   CircleAlert, Eye, OctagonAlert, PenTool, Trash2 } from 'lucide-react';
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
 

import {   DeleteOrder } from './actions';
import { useRouter } from 'next/navigation';
import { Order } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import ImageSlider from "@/components/MarketPlace/ImageSlider"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useTranslations } from 'next-intl';

interface ProductsViewProps {
  ordersData: Order[];
  groupedOrders: GroupedOrder[]
  }

  interface OrderItem  {
    id: string;
    productCategory: string;
    productTitle: string;
    productColor: string;
    quantity: number;
    productSize: string;
    productPrice: number;
    capturedMockup : string[]
  }
  
  interface GroupedOrder {
    id: string;
    date : Date
    status : string;
    type : string;
    isSellerOrder : boolean;
    isPaid : boolean
    items: OrderItem[];
  }


const ProductsView = ({
  ordersData,
  groupedOrders,
  }: ProductsViewProps) => {

  const t = useTranslations('SellerOrdersPage');
    

        

        const router = useRouter();
        const { toast } = useToast()

        const [isClicked, setIsClicked] = useState(false);
        const [isLoading, setIsLoading] = useState(false);

           // Function to change the state after a delay
           const changeStateAfterDelay = () => {
            setTimeout(() => {
              setIsLoading(false);
            }, 5000); // Change to 1000 milliseconds for 1 second
          };


          const [searchQuery, setSearchQuery] = useState('');
          const [filterCriteria, setFilterCriteria] = useState('');
          const [filteredOrders, setFilteredOrders] = useState(groupedOrders);
        
          useEffect(() => {
            let updatedOrders = [...groupedOrders];
        
            if (searchQuery) {
              const lowercasedQuery = searchQuery.toLowerCase();
              updatedOrders = updatedOrders.filter(order =>
                order.id.toLowerCase().includes(lowercasedQuery)
              );
            }
        
            if (filterCriteria) {
              updatedOrders = updatedOrders.filter(order => {
                if (filterCriteria === 'CONFIRMED') {
                  return order.type === 'CONFIRMED';
                } else if (filterCriteria === 'NOT_CONFIRMED') {
                  return order.type === 'NOT_CONFIRMED';
                } else if (filterCriteria === 'CANCELED') {
                  return order.type === 'CANCELED';
                } else if (filterCriteria === 'DELIVERED') {
                  return order.status === 'DELIVERED';
                } else if (filterCriteria === 'Paid') {
                  return order.isPaid === true;
                } else if (filterCriteria === 'NOT_Paid') {
                  return order.isPaid === false;
                }else if (filterCriteria === 'seller_Order') {
                  return order.isSellerOrder === true;
                }
                return true;
              });
            }
        
            setFilteredOrders(updatedOrders);
          }, [searchQuery, filterCriteria, groupedOrders]);
        
          const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
          };
        
          const handleFilterChange = (value: string) => {
            setFilterCriteria(value);
          };









                              // get order item code
                              const [isViewOpen, setIsViewOpen] = useState(false);
                              // selectedOrder
                              const [selectedOrder, setSelectedOrder] = useState<GroupedOrder | null>(null);


                                    //delete order code
                                    const [isDeleteOpen, setisDeleteOpen] = useState(false);
                                    const [selectedOrderId, setselectedOrderId] = useState<string>();
                      
                                    const handleDelete = async () => {
                                      try {
                                          setisDeleteOpen(false)
                                          await DeleteOrder(selectedOrderId!)
                                          toast({
                                              title: t('orderDeletedSuccess'),
                                              variant: 'default',
                                            });
                                            router.refresh()
                                      } catch (error) {
                                          console.error('Error deleting order:', error);
                                          toast({
                                              title: t('somethingWentWrong'),
                                              description: t('errorOnOurEnd'),
                                              variant: 'destructive',
                                          });
                                      }
                                  };
                            







  return (

    <>





<div className="flex mt-4 flex-col gap-5 w-full">
  
  <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">

      <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="px-7 space-y-4 bg-muted/50 rounded-t-lg">

    <div className="space-y-2">
      <CardTitle>{t('productsDetails')}</CardTitle>
      <CardDescription>{t('totalOrders', { count: ordersData.length })}</CardDescription>
    </div>

    
    <Link href="/sellerDashboard/createOrder"
    className={buttonVariants({
      size: 'sm',
      className: 'items-center w-48 gap-1 text-white',
    })}
    >
      {t('createNewOrder')}
  </Link>

  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">

  <Input
    type="search"
    className="md:w-[30%] w-full"
    placeholder={t('searchByIdPlaceholder')}
    value={searchQuery}
    onChange={handleSearchChange}
  />
  <Select onValueChange={handleFilterChange}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder={t('filterByPlaceholder')} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{t('select')}</SelectLabel>
        <SelectItem value="CONFIRMED">{t('confirmed')}</SelectItem>
        <SelectItem value="NOT_CONFIRMED">{t('notConfirmed')}</SelectItem>
        <SelectItem value="CANCELED">{t('canceled')}</SelectItem>
        <SelectItem value="DELIVERED">{t('delivered')}</SelectItem>
        <SelectItem value="Paid">{t('paid')}</SelectItem>
        <SelectItem value="NOT_Paid">{t('notPaid')}</SelectItem>
        <SelectItem value="seller_Order">{t('myOrders')}</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>

  </div>




      <div className="mt-4">
        <p className="text-muted-foreground text-sm">
          <span className="text-blue-600 font-medium">{t('noteBlue')} </span>
          {t('ordersWithBlueId')}
        </p>
        <p className="text-muted-foreground text-sm">
          <span className="text-blue-600 font-medium">{t('noteBlue')} </span>
          {t('cannotDeleteClientOrders')}
        </p>
        <p className="text-muted-foreground text-sm">
          <span className="text-blue-600 font-medium">{t('noteBlue')} </span>
          {t('changesAffectCurrentOrders')}
        </p>
      </div>

  </CardHeader>
  <CardContent>


  {filteredOrders.length> 0 ? (

    
  <Table className="mt-8">
        <ScrollArea
          className={`${
            filteredOrders.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg`}
        >  <TableHeader>
    <TableRow>
      <TableHead>{t('orderId')}</TableHead>
      <TableHead>{t('orderDate')}</TableHead>
      <TableHead>{t('orderStatus')}</TableHead>
      <TableHead>{t('orderType')}</TableHead>
      <TableHead>{t('orderPayment')}</TableHead>
      <TableHead>{t('productCategory')}</TableHead>
      <TableHead>{t('productTitle')}</TableHead>
      <TableHead>{t('productQuantity')}</TableHead>
      <TableHead>{t('productPrice')}</TableHead>
      <TableHead className=" text-center">
        {t('amount')}
        <p className="text-xs">{t('productPriceQuantity')}</p>
      </TableHead>
      <TableHead>{t('actions')}</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredOrders.map((order) => (
      <React.Fragment key={order.id}>
        <TableRow></TableRow>
        {order.items.map((item, index) => (
          <TableRow key={item.id}>
            {index === 0 && (
              <>
                <TableCell className=" text-xs text-left" rowSpan={order.items.length}>
                  {order.isSellerOrder ? (
                    <span className="text-blue-500">{order.id}</span>
                  ) : (
                    order.id
                  )}
                </TableCell>
                <TableCell className="text-xs text-left" rowSpan={order.items.length}>
                  {new Date(order.date).toLocaleString()}
                </TableCell>
                <TableCell className="text-left" rowSpan={order.items.length}>
                  <Badge
                    className={`text-white ${
                      {
                        PROCESSING: 'bg-blue-700',
                        DELIVERED: 'bg-green-700',
                        REFUSED: 'bg-red-700',
                        CANCELED: 'bg-red-700',
                      }[order.status]
                    } hover:bg-gray-700`}
                  >
                    {order.status}
                  </Badge>
                </TableCell >
                <TableCell className="text-left" rowSpan={order.items.length}>
                  <Badge
                    className={`text-white ${
                      order.type === 'CONFIRMED'
                        ? 'bg-green-700'
                        : order.type === 'NOT_CONFIRMED'
                        ? 'bg-orange-400'
                        : order.type === 'CANCELED'
                        ? 'bg-red-700'
                        : 'bg-gray-700'
                    } hover:bg-gray-700`}
                  >
                    {order.type}
                  </Badge>
                </TableCell>
                <TableCell className=" text-left" rowSpan={order.items.length}>
                  <Badge
                    className={`text-white ${order.isPaid ? 'bg-green-700' : 'bg-red-700'} hover:bg-gray-700`}
                  >
                    {order.isPaid ? t('isPaid') : t('notPaid')}
                  </Badge>
                </TableCell>
              </>
            )}
            <TableCell className=" text-left">{item.productCategory}</TableCell>
            <TableCell className="text-left">{item.productTitle}</TableCell>
            <TableCell className=" text-center">{item.quantity}</TableCell>
            <TableCell className=" text-left">{item.productPrice.toFixed(2)} TND</TableCell>
            <TableCell className=" text-center">
              {(item.productPrice * item.quantity).toFixed(2)} TND
            </TableCell>
            <TableCell className="flex items-center justify-center">
              <TooltipProvider>
                {order.isSellerOrder && order.status !== 'CANCELED' ? (
                  <>
                                      <Tooltip>
                      <TooltipTrigger asChild>
                        <Eye
                          onClick={() => {
                            setIsViewOpen(true);
                            setSelectedOrder(order);
                          }}
                          className="cursor-pointer hover:text-blue-500 ml-2"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-blue-500">
                        <p>{t('view')}</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2
                          onClick={() => {
                            setisDeleteOpen(true);
                            setselectedOrderId(order.id);
                          }}
                          className="cursor-pointer hover:text-red-500 ml-2"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-red-500">
                        <p>{t('delete')}</p>
                      </TooltipContent>
                    </Tooltip>

                  </>
                ) : (
                  <div>{t('noAction')}</div>
                )}
              </TooltipProvider>
            </TableCell>
          </TableRow>
        ))}
      </React.Fragment>
    ))}
  </TableBody>
  </ScrollArea>

</Table>

) : (
  <>
  <div className="flex mt-2 items-center justify-center flex-col text-muted-foreground">
  <h1 className="text-center text-3xl font-bold">
    <CircleAlert />
  </h1>
  <p className="text-center text-sm mt-2">{t('noOrdersMadeYet')}</p>
  <p className="text-center text-xs mt-2">{t('newOrdersWillAppearHere')}</p>

</div>

</>
)}


  </CardContent>
</Card>

</section>
</div>


                      {/* The AlertDialog delete order component  */}
                      <AlertDialog open={isDeleteOpen}>
               <AlertDialogTrigger asChild>
                         </AlertDialogTrigger>
                         <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                         <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 {t('areYouAbsolutelySureDeleteClientOrder')}
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   {t('thisActionCannotBeUndone')} 
                                                   {t('itWillPermanentlyRemoveYourOrderFromOurMarketplace')}
                                                   <br/><br/>
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>{t('cancel')}</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete()} 
                                     className='bg-red-500 hover:bg-red-500' >{t('delete')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>     

                      {selectedOrder && (
                    <AlertDialog open={isViewOpen}>
                    <AlertDialogTrigger asChild></AlertDialogTrigger>
                    <AlertDialogContent className="rounded-xl max-w-[80%] flex flex-col items-center justify-center sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
                      {/* Image Slider */}
                      <div className="w-56 md:w-96">
                        <ImageSlider urls={selectedOrder.items[0].capturedMockup} />
                      </div>
                      {/* Cancel Button */}
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setIsViewOpen(false)}
                          className="py-2 px-4 bg-blue-500 text-white rounded"
                        >
                          {t('cancel')}
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                      
 
            )}

                            

                            </>
  
  );
};

export  default ProductsView ;

