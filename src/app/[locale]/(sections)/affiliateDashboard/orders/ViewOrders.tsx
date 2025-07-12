'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {  Commission, Order, OrderItem } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CircleAlert } from "lucide-react";
import { useTranslations } from 'next-intl';

interface ExtraOrderItem extends OrderItem {
  order : Order
  commission : Commission | null
}


interface OrderItemsWithCommission {
  orderItem : ExtraOrderItem | null
  commissionProfit : number
}


interface ViewProps {
  orderItems: OrderItemsWithCommission[];
}

const ViewOrders = ({ orderItems }: ViewProps) => {
  const t = useTranslations('AffiliateOrdersPage');

  const { toast } = useToast()

    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredOrders, setFilteredOrders] = useState(orderItems);
    const [searchTerm, setSearchTerm] = useState(""); // For searching by commission ID

    useEffect(() => {
      let updatedOrders = [...orderItems];
  
      // Filter orders based on filter criteria
      if (filterCriteria) {
        updatedOrders = updatedOrders.filter((orderWithCommission) => {
          const { orderItem } = orderWithCommission;
          if (!orderItem) return false;
  
          switch (filterCriteria) {
            case "CONFIRMED":
              return orderItem.order.type === "CONFIRMED";
            case "NOT_CONFIRMED":
              return orderItem.order.type === "NOT_CONFIRMED";
            case "CANCELED":
              return orderItem.order.type === "CANCELED";
            case "DELIVERED":
              return orderItem.order.status === "DELIVERED";
            case "Paid":
              return orderItem.order.isPaid === true;
            case "NOT_Paid":
              return orderItem.order.isPaid === false;
            case "Printed":
              return orderItem.order.printed === true;
            case "NOT_Printed":
              return orderItem.order.printed === false;
            default:
              return true;
          }
        });
      }
  
      // Filter orders based on search term (Commission ID)
      if (searchTerm) {
        updatedOrders = updatedOrders.filter(
          (orderWithCommission) =>
            orderWithCommission.orderItem?.commission?.id
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) // Match Commission ID
        );
      }
  
      setFilteredOrders(updatedOrders);
    }, [filterCriteria, searchTerm, orderItems]);
    
    // Handle search term input
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value); // Update the search term state
    };
  
    const handleFilterChange = (value: string) => {
      setFilterCriteria(value);
    };

  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">{t('breadcrumb')}</p>
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <div className="flex mt-4 flex-col gap-5 w-full">
        <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">
          <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
            <CardHeader className=" bg-muted/50 rounded-t-lg">
              <div className="grid flex-row items-center gap-2">
                <CardTitle>{t('orders_items')}</CardTitle>
                <CardDescription>{t('total', {count: orderItems.length})}</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full mt-6">
                <Input
                  type="search"
                  className="w-full sm:w-[300px]"
                  placeholder={t('search_by_commission_id')}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Select onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-full sm:w-[200px] ">
                    <SelectValue placeholder={t('filter_by')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t('select')}</SelectLabel>
                      <SelectItem value="CONFIRMED">{t('confirmed')}</SelectItem>
                      <SelectItem value="NOT_CONFIRMED">{t('not_confirmed')}</SelectItem>
                      <SelectItem value="CANCELED">{t('canceled')}</SelectItem>
                      <SelectItem value="DELIVERED">{t('delivered')}</SelectItem>
                      <SelectItem value="Paid">{t('paid')}</SelectItem>
                      <SelectItem value="NOT_Paid">{t('not_paid')}</SelectItem>
                      <SelectItem value="Printed">{t('printed')}</SelectItem>
                      <SelectItem value="NOT_Printed">{t('not_printed')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredOrders.length> 0 ? (
                <Table>
                  <ScrollArea
                    className={`${filteredOrders.length < 10 ? "max-h-max" : "h-[384px]"} w-full border rounded-lg mt-4`}
                  >
                    <TableHeader>
                      <TableRow>
                        <TableHead className="">{t('order_status')}</TableHead>
                        <TableHead className="">{t('order_type')}</TableHead>
                        <TableHead>{t('creation_date')}</TableHead>
                        <TableHead>{t('is_order_printed')}</TableHead>
                        <TableHead>{t('is_order_paid')}</TableHead>
                        <TableHead className="">{t('commission_id')}</TableHead>
                        <TableHead>{t('your_profit')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((orderWithCommission, index) => {
                        const { orderItem, commissionProfit } = orderWithCommission;
                        if (!orderItem) return null; // Skip rendering if order is null
                        return (
                          <TableRow key={orderItem.id}>
                            <TableCell className="">
                              <Badge className={{
                                'PROCESSING': 'bg-blue-700 text-white',
                                'DELIVERED': 'bg-green-700 text-white',
                                'REFUSED': 'bg-red-700 text-white',
                                'CANCELED': 'bg-red-700 text-white'
                              }[orderItem.order.status] || 'bg-gray-700 text-white'}>
                                {t(orderItem.order.status.toLowerCase())}
                              </Badge>
                            </TableCell>
                            <TableCell className="">
                              <Badge className={orderItem.order.type === 'CONFIRMED' ? 'bg-green-700 text-white' : orderItem.order.type === 'NOT_CONFIRMED' ? 'bg-orange-400 text-white' : orderItem.order.type === 'CANCELED' ? 'bg-red-700 text-white' : 'bg-gray-700 text-white'}>
                                {t(orderItem.order.type.toLowerCase())}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(orderItem.createdAt).toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge className={orderItem.order.printed ? 'bg-green-700 text-white' : 'text-white bg-red-700'}>
                                {orderItem.order.printed ? t('printed') : t('not_printed')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={orderItem.order.isPaid ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}>
                                {orderItem.order.isPaid ? t('paid') : t('not_paid')}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">
                              {orderItem.commission!.id}
                            </TableCell>
                            <TableCell>
                              {commissionProfit.toFixed(2)} TND
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </ScrollArea>
                </Table>
              ) : (
                <>
                  <div className="flex items-center justify-center flex-col text-muted-foreground mt-3">
                    <h1 className="text-center text-3xl font-bold">
                      <CircleAlert />
                    </h1>
                    <p className="text-center text-sm mt-2">{t('no_orders_made')}</p>
                    <p className="text-center text-xs mt-2">{t('new_orders_appear')}</p>
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

export default ViewOrders;
