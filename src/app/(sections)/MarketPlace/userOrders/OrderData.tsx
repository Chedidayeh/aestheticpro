/* eslint-disable react/no-unescaped-entities */
'use client'
import NextImage from 'next/image'
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
import * as React from "react"
import {
  OctagonAlert,
  Trash2,
  Truck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Order, OrderItem } from "@prisma/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { DeleteOrder } from "./actions"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageSlider from "@/components/MarketPlace/ImageSlider"
import MobileView from "./MobileView"


interface OrderWithItems extends Order {
  orderItems: OrderItem[];
}


interface DesignViewProps {
  ordersData: OrderWithItems[];
  }
const OrderData = ({ordersData}: DesignViewProps) => {

    const { toast } = useToast()
    const router = useRouter();

    




    // filter code : 
    const [selectedFilter, setSelectedFilter] = useState("");

    const filteredOrders = ordersData.filter(order => {
      if (selectedFilter === 'CONFIRMED') {
        return order.type === 'CONFIRMED';
      } else if (selectedFilter === 'NOT_CONFIRMED') {
        return order.type === 'NOT_CONFIRMED';
      } else if (selectedFilter === 'CANCELED') {
        return order.type === 'CANCELED';
      } else if (selectedFilter === 'DELIVERED') {
        return order.status === 'DELIVERED';
      } else if (selectedFilter === 'Paid') {
        return order.isPaid === true;
      } else if (selectedFilter === 'NOT_Paid') {
        return order.isPaid === false;
      } else if (selectedFilter === 'Printed') {
        return order.printed === true;
      } else if (selectedFilter === 'NOT_Printed') {
        return order.printed === false;
      }
      return true;
    });

    const handleFilterChange = (value: string) => {
      setSelectedFilter(value);
    };




    


                                        //delete order code
                                        const [isDeleteOpen, setisDeleteOpen] = useState(false);
                                        const [selectedOrderId, setselectedOrderId] = useState("");
                          
                                        const handleDelete = async () => {
                                          try {
                                              setisDeleteOpen(false)
                                              await DeleteOrder(selectedOrderId)
                                              toast({
                                                  title: 'Order Was Successfully Deleted',
                                                  variant: 'default',
                                                });
                                                router.refresh()
                                          } catch (error) {
                                              console.error('Error deleting order:', error);
                                              toast({
                                                  title: 'Something went wrong',
                                                  description: 'There was an error on our end. Please try again.',
                                                  variant: 'destructive',
                                              });
                                          }
                                      };




 

       
                              


                                      const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
                                      const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
                                      const handleRowClick = (order: OrderWithItems, index: number) => {
                                        if (selectedIndex === index) {
                                          setSelectedOrder(null);
                                          setSelectedIndex(null);
                                        } else {
                                          setSelectedOrder(order);
                                          setSelectedIndex(index);
                                        }
                                      };
                                      





  return (



    <>


    


                           {/* title */}
                           <div className="flex flex-col items-center justify-center my-4">
                          <div className="mb-4">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                              Your{' '}
                              <span className="text-blue-600">
                                Orders
                              </span>
                            </h1>
                          </div>
                          {ordersData.length === 0 && (
                            <div className="flex flex-col items-center justify-center space-y-1 mb-20">
                              <div
                                aria-hidden="true"
                                className="relative h-40 w-40 text-muted-foreground">
                                      <NextImage
                                fill
                                src='/hippo-empty-cart.png'
                                loading='eager'
                                alt='empty shopping cart hippo'
                              />
                              </div>
                              <h3 className="font-semibold text-2xl">
                                No Orders found!
                              </h3>
                              <p className="text-muted-foreground text-center">
                                Whoops! Nothing to show here yet.
                              </p>
                            </div>
                          )}
                        </div>

          {ordersData.length > 0 && (

        <>
          <div className="hidden lg:block">
        <div className="grid grid-cols-2 gap-4 mx-10">
          {/* orders table */}
          <div className="col-span-full mb-4" >
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7 bg-muted/50">
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                      total : {ordersData.length} <br/>
                      {ordersData.length>0 && (
                        <>
                      <span className="text-blue-600">We'll call you very soon to confirm your orders !</span><br/>
                      </>
                      )}

                                    {/* Filters Section */}
                <div className="flex items-start justify-start gap-4 my-4">
                    {/* First Select */}
                    <Select onValueChange={handleFilterChange}>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Filter By CONFIRMED / CANCELED " />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select</SelectLabel>
                          <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                          <SelectItem value="NOT_CONFIRMED">NOT CONFIRMED</SelectItem>
                          <SelectItem value="CANCELED">CANCELED</SelectItem>
                          <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                          <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {/* Second Select */}
                    <Select onValueChange={handleFilterChange}>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Filter By Paid / Printed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select</SelectLabel>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="NOT_Paid">Not Paid</SelectItem>
                          <SelectItem value="Printed">Printed</SelectItem>
                          <SelectItem value="NOT_Printed">Not Printed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                </div>

                <span className="text-blue-600">Click on the order row to view its details !</span>


                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                  <Table>
                    <TableCaption>A list of your recent orders.</TableCaption>
                    <TableHeader>
                        <TableRow>
                        <TableHead>OrderId</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Order Type</TableHead>
                        <TableHead>Is Order Printed</TableHead>
                        <TableHead>Is Order Paid</TableHead>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Shipping Address</TableHead>
                        <TableHead>Order Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredOrders.map((order , index) => (

                        <>
                            <TableRow key={order.id} 
                            className={`cursor-pointer ${selectedIndex === index ? 'border-2 border-blue-500' : ''}`}
                            onClick={() => handleRowClick(order, index)} 
                            >
                            <TableCell className="text-left">{order.id}</TableCell>
                            <TableCell className="text-left">
                            <Badge className={`text-white ${
                              {
                                'PROCESSING': 'bg-blue-700',
                                'DELIVERED': 'bg-green-700',
                                'REFUSED': 'bg-red-700',
                                'CANCELED': 'bg-red-700',
                              }[order.status]
                            } hover:bg-gray-700`}>
                                {order.status}
                            </Badge>
                            </TableCell>
                            <TableCell className="text-left">
                            <Badge className={`text-white ${order.type === 'CONFIRMED' ? 'bg-green-700' : order.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : order.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                                {order.type}
                            </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={` text-white ${order.printed ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
                               {order.printed ? "Printed" : "Not Printed"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                          <Badge className={`text-white ${order.isPaid ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
                            {order.isPaid ? "Is Paid" : "Not Paid"}
                          </Badge>
                          </TableCell>
                            <TableCell className="text-left">{order.clientName}</TableCell>
                            <TableCell className="text-left">{order.phoneNumber}</TableCell>
                            <TableCell className="text-left">{order.shippingAddress}</TableCell>
                            <TableCell className="text-left">{(order.amount).toFixed(2)} TND</TableCell>
                            <TableCell className="flex items-center justify-center">
                                    <TooltipProvider>
                                    {(order.status !== 'CANCELED' && order.type !== 'CANCELED' && order.type !== 'CONFIRMED' && !order.printed) && (
                                      <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Trash2 onClick={()=>{
                                        setisDeleteOpen(true)
                                        setselectedOrderId(order.id)
                                        }} className="cursor-pointer hover:text-red-500"/>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-red-500">
                                        <p>Delete</p>
                                    </TooltipContent>
                                    </Tooltip>
                                    )}
                                    
                                </TooltipProvider>           
                        </TableCell>
                        </TableRow>
                        </>
                         ))} 
                    </TableBody>
             
                    </Table>
                  </CardContent>
                </Card>
          </div>
          {/* order details */}
          {selectedOrder && (
            <>
            <Card key={selectedOrder.id} className="overflow-hidden mb-4" >
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group hidden items-center gap-2 text-lg sm:flex">
                    Order Id: <p className="text-xs text-gray-600">{selectedOrder.id}</p>
                  </CardTitle>
                  <CardDescription>Creation Date <time dateTime={selectedOrder.createdAt ? selectedOrder.createdAt.toISOString() : undefined}>
                    {selectedOrder.updatedAt ? new Date(selectedOrder.updatedAt).toLocaleString() : ''}
                  </time></CardDescription>
                </div>
                <div className="ml-auto hidden items-center gap-1 sm:flex">
                <Badge
                  variant="outline"
                  className={`h-8 gap-1 ${
                    selectedOrder?.status === 'CANCELED'
                      ? 'text-red-500'
                      : selectedOrder?.status === 'PROCESSING'
                      ? 'text-blue-500'
                      : selectedOrder?.status === 'DELIVERED'
                      ? 'text-green-500'
                      : ''
                  }`}
                >
                  <Truck className="h-3.5 w-3.5" />
                  {selectedOrder?.status}
                </Badge>

                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Order Details</div>
                  {selectedOrder.orderItems.length > 0 &&(
                    <ul className="grid gap-3">
                    {selectedOrder.orderItems.map((item) => (
                      <li key={item.id} className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {item.productTitle} x <span>{item.quantity} ({item.productCategory}) ({item.productSize})</span>
                        </span>
                        <span>{`${((item.productPrice ?? 0) * (item.quantity ?? 1)).toFixed(2)}`} TND</span>
                      </li>
                    ))}
                  </ul>
                  )}
                  

                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="muted-foreground">Subtotal</span>
                      <span>{`${(selectedOrder.amount - selectedOrder.shippingFee).toFixed(2)} TND`}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{selectedOrder.shippingFee.toFixed(2)} TND</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Total</span>
                      <span>{`${selectedOrder.amount.toFixed(2)} TND`}</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Shipping Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Address</dt>
                      <dd>{selectedOrder.shippingAddress}</dd>
                    </div>
                  </dl>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Customer Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Customer</dt>
                      <dd>{selectedOrder.clientName}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Phone Number</dt>
                      <dd>
                        {selectedOrder.phoneNumber}
                      </dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-end  justify-between border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground bottom-0">
              Updated{" "}
              <time dateTime={selectedOrder.updatedAt ? selectedOrder.updatedAt.toISOString() : undefined}>
                {selectedOrder.updatedAt ? new Date(selectedOrder.updatedAt).toLocaleString() : ""}
              </time>
            </div>
          </CardFooter>

            </Card>

            <Card key={selectedIndex} className="overflow-hidden mb-4">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group gap-2 text-lg">
                    Order Items: <br/>
                    <p className="text-xs text-gray-600">Total Items : {selectedOrder.orderItems.length}</p>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex items-center justify-center text-sm">
              <ul>
                  {selectedOrder.orderItems.map((item) => {

                      return (
                        <li
                          key={item.id}
                          className='flex py-6 sm:py-10'>
                          <div className='flex-shrink-0 mb-10'>
                            <div className='h-72 w-72'>
                            <ImageSlider urls={item.capturedMockup}/>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                </ul>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Total Items : {selectedOrder.orderItems.length}
                </div>
              </CardFooter>
            </Card>

            </>
            )}
          </div>
           </div>


    <div className=" block lg:hidden mx-2">
        <MobileView ordersData={ordersData} />
    </div>
    </>

          )}

    {/* The AlertDialog delete order component  */}
    <AlertDialog open={isDeleteOpen}>
               <AlertDialogTrigger asChild>
                         </AlertDialogTrigger>
                            <AlertDialogContent>
                                   <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 Are you absolutely sure you want to delete your Order ?
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   This action cannot be undone. 
                                                   It will permanently remove your order from our server.<br/><br/>
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete()} 
                                     className='bg-red-500 hover:bg-red-500' >Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog> 

    </>

  )
}

export default OrderData