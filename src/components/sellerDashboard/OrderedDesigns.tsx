import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOrderedDesignsByStoreId, getStoreByUserId, getUser } from "@/actions/actions";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { CircleAlert } from "lucide-react";
import { getTranslations } from 'next-intl/server';


const DesignsOrder = async () => {
  const t = await getTranslations('SellerDashboardComponents');
  const user = await getUser();
  if (!user) throw new Error("User not found");
  const store = await getStoreByUserId(user.id);
  const storeOrdersForDesigns = await getOrderedDesignsByStoreId(store!.id);

  return (

    <div className="flex mt-4 flex-col gap-5 w-full">

      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">

        <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center bg-muted/50 rounded-t-lg ">
            <div className="grid gap-2">
              <CardTitle>{t('orderedDesigns')}</CardTitle>
              <CardDescription>{t('total', {count: storeOrdersForDesigns.length})}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>

            {storeOrdersForDesigns.length > 0 ? (

              <Table>
                <ScrollArea
                  className={`${storeOrdersForDesigns.length < 10 ? "max-h-max" : "h-[384px]"
                    } w-full border rounded-lg mt-4`}
                >          <TableHeader>
                    <TableRow>
                      <TableHead>{t('designName')}</TableHead>
                      <TableHead className="text-center">{t('designPrice')}</TableHead>
                      <TableHead className="text-center">{t('sellerProfit')}</TableHead>
                      <TableHead className="text-center">{t('orderCount')}</TableHead>
                      <TableHead className="text-center">{t('totalProductQuantity')}</TableHead>
                      <TableHead className="text-center">{t('totalSales')}</TableHead>
                      <TableHead className="text-center">{t('revenue')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storeOrdersForDesigns.map((design) => (
                      <TableRow key={design.id}>
                        <TableCell>{design.name}</TableCell>
                        <TableCell className="text-center">{(design.price).toFixed(2)} {t('tnd')}</TableCell>
                        <TableCell className="text-center">{(design.sellerProfit).toFixed(2)} {t('tnd')}</TableCell>
                        <TableCell className="text-center">{design.orderCount}</TableCell>
                        <TableCell className="text-center">{design.totalOrderedQuantity}</TableCell>
                        <TableCell className="text-center">{design.totalSales}</TableCell>
                        <TableCell className="text-center">
                          {(design.revenue).toFixed(2)} {t('tnd')}
                        </TableCell>
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
                  <p className="text-center text-sm mt-2">{t('noDesignOrders')}</p>
                  <p className="text-center text-xs mt-2">{t('newDesignOrdersWillAppearHere')}</p>

                </div>

              </>
            )}

          </CardContent>
        </Card>

      </section>
    </div>
  );
};

export default DesignsOrder;
