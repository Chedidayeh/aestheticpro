"use client";
import NextImage from 'next/image';
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from '../ui/scroll-area';
import { getStoreStats } from '@/actions/actions';
import { Loader, Star } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useTranslations } from 'next-intl';

interface ChartData {
  storeId : string
  store: string;
  totalRevenue: number;
  totalSales: number;
  totalFollowers: number;
  totalViews: number;
  logo: string;
  level : number
}

const chartConfig = {
  totalRevenue: {
    label: "Total Revenue",
    color: "hsl(var(--chart-1))",
  },
  totalSales: {
    label: "Total Sales",
    color: "hsl(var(--chart-2))",
  },
  totalFollowers: {
    label: "Total Followers",
    color: "hsl(var(--chart-1))",
  },
  totalViews: {
    label: "Total Views",
    color: "hsl(var(--chart-2))",
  },
} satisfies Record<string, { label: string; color: string }>;

// Accept storeId as a prop
export function StoresTableStats({ storeId }: { storeId: string }) {
  const t = useTranslations('SellerDashboardComponents');


  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>(
    "totalRevenue"
  );
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchData = async (metric: keyof typeof chartConfig) => {
    setIsLoading(true);
    const data = await getStoreStats(metric);
    setChartData(data);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData(activeChart);
  }, [activeChart]);






  const sortedChartData = React.useMemo(() => {
    if (!Array.isArray(chartData) || !chartData.length) return [];
  
    return [...chartData]
      .sort((a, b) => b[activeChart] - a[activeChart]) // Sort descending
      .slice(0, 10) // Take only the top 10
      .map((item, index) => ({ ...item, rank: index + 1 })); // Add rank
  }, [activeChart, chartData]);
  
  
  const storeRank = React.useMemo(() => {
    if (!Array.isArray(chartData) || !chartData.length) return 0;
  
    const sortedData = [...chartData].sort((a, b) => b[activeChart] - a[activeChart]);
    return sortedData.findIndex((item) => item.storeId === storeId) + 1;
  }, [activeChart, chartData, storeId]);
  
  if (!Array.isArray(chartData) || !chartData.length) return ;


  return (
    <Card className="w-full">
      <CardHeader className='bg-muted/50 mb-2 rounded-t-lg'>
        <CardTitle className="text-lg">{t('storeStats')}</CardTitle>
        <CardDescription>
            <p>{t('totalStoresIs', {count: chartData.length})}</p>
          {storeRank > 0
            ? t('storeRank', {rank: storeRank})
            : t('storeNotFound')}
        </CardDescription>
      </CardHeader>

      <CardContent>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {Object.keys(chartConfig).map((key) => (
            <Button
              variant={activeChart === key ? "default" : "secondary"}
              size="sm"
              className={activeChart === key ? "text-white" : ""}
              key={key}
              onClick={() => setActiveChart(key as keyof typeof chartConfig)}
            >
              {chartConfig[key as keyof typeof chartConfig].label}
            </Button>
          ))}
        </div>

        {!isLoading ? (


        <div className="flex flex-col gap-5 w-full">

<section className="grid w-full gap-4 gap-x-8 transition-all ">


  <Table>
  <ScrollArea
          className={`${
            sortedChartData.length < 10 ? "max-h-max" : "h-[540px]"
          } w-full border rounded-lg mt-4`}
        >
    <TableHeader>
      <TableRow>
        <TableHead className="px-4 py-2 text-left">{t('logo')}</TableHead>
        <TableHead className=" text-left">{t('rank')}</TableHead>
        <TableHead className=" text-left">{t('store')}</TableHead>
        <TableHead className=" text-left">{t('level')}</TableHead>
        <TableHead className=" text-left">
          {chartConfig[activeChart].label}
        </TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {sortedChartData.map((item) => (
        <TableRow key={item.store}>
          <TableCell className="px-4 py-2">
            <NextImage
              src={item.logo}
              alt={`${item.store} logo`}
              className="md:w-16 md:h-16 xl:w-20 xl:h-20 w-6 h-6 rounded-full bg-slate-50 object-cover"
              width={300}
              height={300}
            />
          </TableCell>
          <TableCell >
          <Badge variant={"outline"} className="text-white bg-blue-500 hover:bg-blue-400 ">
            <p>#</p>
             {item.rank}
            </Badge>
          </TableCell>
          <TableCell >{item.store}</TableCell>
          <TableCell >            
            <Badge variant={"outline"} className="text-white bg-yellow-400 hover:bg-yellow-300 ">
            <Star className="mr-1 mb-1/2 w-4 h-4 text-white"/>
             {item.level}
            </Badge>
            </TableCell>
          <TableCell >
            {item[activeChart]} {activeChart === "totalRevenue" ? t('tnd') : ""}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
    </ScrollArea>
  </Table>

  </section>
  </div>

) : (
  <div className="flex items-center justify-center h-[340px] md:h-[540px]">
    <div className='flex flex-col items-center justify-start'>
    <p className='text-sm text-muted-foreground'>{t('fetchingData')}</p>
    <Loader className="text-blue-700 h-6 w-6 animate-spin mt-3" />  
    </div>
  </div>
)}

  


      </CardContent>
    </Card>
  );
}
