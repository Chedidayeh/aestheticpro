"use client";
import NextImage from 'next/image';
import React from "react";
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
import { getAdminStoreStats } from '@/actions/actions';
import { Loader, Star } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ChartData {
  storeId : string
  store: string;
  totalRevenue: number;
  totalSales: number;
  totalProducts: number;
  totalDesigns: number;
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
  totalProducts: {
    label: "Total Products",
    color: "hsl(var(--chart-3))",
  },
  totalDesigns: {
    label: "Total Designs",
    color: "hsl(var(--chart-5))",
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
export function StoresTableStats() {

  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>(
    "totalRevenue"
  );
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchData = async (metric: keyof typeof chartConfig) => {
    setIsLoading(true);
    const data = await getAdminStoreStats(metric);
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
      .map((item, index) => ({ ...item, rank: index + 1 })); // Add rank
  }, [activeChart, chartData]);
  

  const totalValues = React.useMemo(() => {
    const totals = {
      totalRevenue: 0,
      totalSales: 0,
      totalProducts: 0,
      totalDesigns: 0,
      totalFollowers: 0,
      totalViews: 0,
    };
  
    if (!Array.isArray(chartData) || !chartData.length) return totals;
  
    chartData.forEach((item) => {
      totals.totalRevenue += item.totalRevenue;
      totals.totalSales += item.totalSales;
      totals.totalProducts += item.totalProducts;
      totals.totalDesigns += item.totalDesigns;
      totals.totalFollowers += item.totalFollowers;
      totals.totalViews += item.totalViews;
    });
  
    return totals;
  }, [chartData]);
  

  if (!Array.isArray(chartData) || !chartData.length) return ;


  return (
    <Card className="w-full">
      <CardHeader className="bg-muted/50 rounded-t-lg">
        <CardTitle className="text-lg">Store Stats</CardTitle>
        <CardDescription>
            <p>Total stores is : {chartData.length} </p>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid mt-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {Object.keys(chartConfig).map((key) => (
            <Button
              variant={activeChart === key ? "default" : "secondary"}
              className={activeChart === key ? "text-white" : ""}
              size="sm"
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


        <Table className="min-w-full">
        <ScrollArea
          className={`${
            sortedChartData.length < 10 ? "max-h-max" : "h-[560px]"
          } w-full border rounded-lg mt-4`}
        >    
          <TableHeader>
            <TableRow>
             <TableHead className=" text-left">Logo</TableHead>
              <TableHead className=" text-left">Rank</TableHead>
              <TableHead className=" text-left">Store</TableHead>
              <TableHead className=" text-left">Level</TableHead>

              <TableHead className=" text-left">
                {chartConfig[activeChart].label}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedChartData.map((item) => (
              <TableRow key={item.store}>
                <TableCell className="">
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
                <TableCell className="">{item[activeChart]} {activeChart==="totalRevenue" ? "TND" : ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* Display total value for the active chart */}
          <tfoot>
            <TableRow>
              <TableCell colSpan={3} className=" text-right font-bold">
               {chartConfig[activeChart].label}:
              </TableCell>
              <TableCell className="">
                {totalValues[activeChart]} {activeChart === "totalRevenue" ? "TND" : ""}
              </TableCell>
            </TableRow>
          </tfoot>

          </ScrollArea>
        </Table>

        </section>
        </div>


      ) : (
<div className="flex items-center justify-center h-[340px] md:h-[540px]">          
  <div className='flex flex-col items-center justify-start'>
          <p className='text-sm text-muted-foreground'>Fetching Data...</p>
          <Loader className="text-blue-700 h-6 w-6 animate-spin mt-3" />  
          </div>
        </div>
      )}

      </CardContent>
    </Card>
  );
}
