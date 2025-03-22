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
export function StoresTableStats({ storeId , chartData }: { storeId: string , chartData : ChartData[] }) {


  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>(
    "totalRevenue"
  );

  const sortedChartData = React.useMemo(
    () =>
      [...chartData]
        .sort((a, b) => b[activeChart] - a[activeChart]) // Sort descending
        .slice(0, 10) // Take only the top 10
        .map((item, index) => ({ ...item, rank: index + 1 })), // Add rank
    [activeChart, chartData]
  );
  
  // Find the rank of the storeId based on the activeChart
  const storeRank = React.useMemo(() => {
    const sortedData = [...chartData].sort((a, b) => b[activeChart] - a[activeChart]);
    return sortedData.findIndex((item) => item.storeId === storeId) + 1;
  }, [activeChart, chartData, storeId]);
  

  return (
    <Card className="w-full">
      <CardHeader className='bg-muted/50 mb-2 rounded-t-lg'>
        <CardTitle className="text-lg">Store Stats</CardTitle>
        <CardDescription>
            <p>Total stores is : {chartData.length} </p>
          {storeRank > 0
            ? `The rank of your store is #${storeRank}`
            : "Store not found"}
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
        <TableHead className="px-4 py-2 text-left">Logo</TableHead>
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
          <TableCell className="px-4 py-2">
            <NextImage
              src={item.logo}
              alt={`${item.store} logo`}
              className="md:w-16 md:h-16 xl:w-20 xl:h-20 w-6 h-6 rounded-full bg-slate-50 object-cover"
              width={300}
              height={300}
            />
          </TableCell>
          <TableCell >{item.rank}</TableCell>
          <TableCell >{item.store}</TableCell>
          <TableCell >{item.level}</TableCell>
          <TableCell >
            {item[activeChart]} {activeChart === "totalRevenue" ? "TND" : ""}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
    </ScrollArea>
  </Table>

  </section>
  </div>


      </CardContent>
    </Card>
  );
}
