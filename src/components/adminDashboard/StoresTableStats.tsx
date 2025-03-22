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
export function StoresTableStats({chartData} : {chartData : ChartData[]}) {

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

  // Calculate total values for each metric
  const totalValues = React.useMemo(() => {
    const totals = {
      totalRevenue: 0,
      totalSales: 0,
      totalProducts: 0,
      totalDesigns: 0,
      totalFollowers: 0,
      totalViews: 0,
    };

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
                <TableCell className="">{item.rank}</TableCell>
                <TableCell className="">{item.store}</TableCell>
                <TableCell className="">{item.level}</TableCell>
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

      </CardContent>
    </Card>
  );
}
