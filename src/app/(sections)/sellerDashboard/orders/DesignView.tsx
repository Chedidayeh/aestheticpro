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
  <CardHeader className="px-7 space-y-4">
    <CardTitle>Designs Details</CardTitle>
    <CardDescription>Total Orders: {orderedDesigns.length}</CardDescription>
      <div className="flex items-center space-x-2">
        <Input
          type="search"
          className="w-full "
          placeholder="search by id..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
          <Select onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[160px] ">
          <SelectValue placeholder="Filter By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select</SelectLabel>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="NOT_CONFIRMED">Not Confirmed</SelectItem>
              <SelectItem value="CANCELED">Canceled</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="NOT_Paid">Not Paid</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>

  </CardHeader>
  <CardContent>
    <Table className='mt-8'>
    <ScrollArea  className="h-[384px] w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Order Id</TableHead>
          <TableHead>Order Status</TableHead>
          <TableHead>Order Type</TableHead>
          <TableHead >Order Payment</TableHead>
          <TableHead>Front Design Name</TableHead>
          <TableHead>Back Design Name</TableHead>
          <TableHead>Product Quantity</TableHead>
          <TableHead>Front Design Profit</TableHead>
          <TableHead>Back Design Profit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredOrders.map((orderItem) => (
          <TableRow key={orderItem.order.id}>
            <TableCell>{orderItem.order.id}</TableCell>
            <TableCell>
              <Badge className={`${{
                'PROCESSING': 'bg-blue-700',
                'DELIVERED': 'bg-green-700',
                'REFUSED': 'bg-red-700',
                'CANCELED': 'bg-red-700',
              }[orderItem.order.status]} hover:bg-gray-700`}>
                {orderItem.order.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={`${orderItem.order.type === 'CONFIRMED' ? 'bg-green-700' : orderItem.order.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : orderItem.order.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                {orderItem.order.type}
              </Badge>
            </TableCell>
            <TableCell >
              <Badge className={`${orderItem.order.isPaid ? 'bg-green-700' : 'bg-red-700'} hover:bg-gray-700`}>
                {orderItem.order.isPaid ? "Is Paid" : "Not Paid"}
              </Badge>
            </TableCell>
            <TableCell>{orderItem.frontDesignName || 'N/A'}</TableCell>
            <TableCell>{orderItem.backDesignName || 'N/A'}</TableCell>
            <TableCell >{orderItem.quantity}</TableCell>
            <TableCell >{orderItem.frontDesignProfit.toFixed(2)} TND</TableCell>
            <TableCell>{orderItem.backDesignProfit.toFixed(2)} TND</TableCell>
          </TableRow>
        ))}
      </TableBody>
      </ScrollArea>

    </Table>
  </CardContent>
</Card>


</section>
</div>

                            </>
  
  );
};

export  default DesignView ;

