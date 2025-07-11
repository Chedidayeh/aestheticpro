/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// Indicates this file is a client-side component in Next.js

"use client"


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
import {  ChangeEvent, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
 
import { Badge } from '@/components/ui/badge';
import { Order } from '@prisma/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from "@/components/ui/separator";
import { CircleAlert } from "lucide-react";
import { useTranslations } from 'next-intl';


interface OrderWithItems  {
    order: Order;
    quantity: number
    frontDesignName: string | null;
    backDesignName: string | null;
    frontDesignProfit: number;
    backDesignProfit: number;
}



interface DesignViewProps {
  orderedDesigns: OrderWithItems[];
}


const DesignView: React.FC<DesignViewProps> = ({ orderedDesigns }) => {
  const t = useTranslations('SellerOrdersPage');

  


          const [searchQuery, setSearchQuery] = useState('');
          const [filterCriteria, setFilterCriteria] = useState('');
          const [filteredOrders, setFilteredOrders] = useState(orderedDesigns);
        
          useEffect(() => {
            let updatedOrders = [...orderedDesigns];
        
            if (searchQuery) {
              const lowercasedQuery = searchQuery.toLowerCase();
              updatedOrders = updatedOrders.filter(order =>
                order.order.id.toLowerCase().includes(lowercasedQuery)
              );
            }
        
            if (filterCriteria) {
              updatedOrders = updatedOrders.filter(order => {
                if (filterCriteria === 'CONFIRMED') {
                  return order.order.type === 'CONFIRMED';
                } else if (filterCriteria === 'NOT_CONFIRMED') {
                  return order.order.type === 'NOT_CONFIRMED';
                } else if (filterCriteria === 'CANCELED') {
                  return order.order.type === 'CANCELED';
                } else if (filterCriteria === 'DELIVERED') {
                  return order.order.status === 'DELIVERED';
                } else if (filterCriteria === 'Paid') {
                  return order.order.isPaid === true;
                } else if (filterCriteria === 'NOT_Paid') {
                  return order.order.isPaid === false;
                }
                return true;
              });
            }
        
            setFilteredOrders(updatedOrders);
          }, [searchQuery, filterCriteria, orderedDesigns]);
        
          const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
          };
        
          const handleFilterChange = (value: string) => {
            setFilterCriteria(value);
          };




  return (

    <>





                                       

<div className="flex mt-4 flex-col gap-5 w-full">
  
  <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">


<Card className="xl:col-span-full mt-4" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="px-7 space-y-4 bg-muted/50 rounded-t-lg">
    <CardTitle>{t('designsDetails')}</CardTitle>
    <CardDescription>{t('totalOrders', { count: orderedDesigns.length })}</CardDescription>
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
    <Input
          type="search"
          className="md:w-[30%] w-full"
          placeholder={t('searchById')}
          value={searchQuery}
          onChange={handleSearchChange}
        />
          <Select onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[160px] ">
          <SelectValue placeholder={t('filterBy')} />
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
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>

  </CardHeader>
  <CardContent>

  {filteredOrders.length> 0 ? (


    <Table className='mt-8'>
    <ScrollArea
          className={`${
            filteredOrders.length < 10 ? "max-h-max" : "h-[384px]"
          } w-full border rounded-lg`}
        >      
        <TableHeader>
        <TableRow>
          <TableHead>{t('orderId')}</TableHead>
          <TableHead>{t('orderDate')}</TableHead>
          <TableHead>{t('orderStatus')}</TableHead>
          <TableHead>{t('orderType')}</TableHead>
          <TableHead >{t('orderPayment')}</TableHead>
          <TableHead>{t('frontDesignName')}</TableHead>
          <TableHead>{t('backDesignName')}</TableHead>
          <TableHead>{t('productQuantity')}</TableHead>
          <TableHead>{t('frontDesignProfit')}</TableHead>
          <TableHead>{t('backDesignProfit')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredOrders.map((orderItem) => (
          <TableRow key={orderItem.order.id}>
            <TableCell className="text-xs">{orderItem.order.id}</TableCell>
            <TableCell className="text-xs">
              {new Date(orderItem.order.createdAt).toLocaleString()}
            </TableCell>
            <TableCell>
              <Badge className={`text-white ${{
                'PROCESSING': 'bg-blue-700',
                'DELIVERED': 'bg-green-700',
                'REFUSED': 'bg-red-700',
                'CANCELED': 'bg-red-700',
              }[orderItem.order.status]} hover:bg-gray-700`}>
                {orderItem.order.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={`text-white ${orderItem.order.type === 'CONFIRMED' ? 'bg-green-700' : orderItem.order.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : orderItem.order.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                {orderItem.order.type}
              </Badge>
            </TableCell>
            <TableCell >
              <Badge className={`text-white ${orderItem.order.isPaid ? 'bg-green-700' : 'bg-red-700'} hover:bg-gray-700`}>
                {orderItem.order.isPaid ? t('isPaid') : t('notPaid')}
              </Badge>
            </TableCell>
            <TableCell>{orderItem.frontDesignName || t('na')}</TableCell>
            <TableCell>{orderItem.backDesignName || t('na')}</TableCell>
            <TableCell >{orderItem.quantity}</TableCell>
            <TableCell >{orderItem.frontDesignProfit.toFixed(2)} TND</TableCell>
            <TableCell>{orderItem.backDesignProfit.toFixed(2)} TND</TableCell>
          </TableRow>
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
  <p className="text-center text-sm mt-2">{t('noRecords')}</p>
  <p className="text-center text-xs mt-2">{t('newOrders')}</p>

</div>

</>
)}


  </CardContent>
</Card>


</section>
</div>

                            </>
  
  );
};

export  default DesignView ;

