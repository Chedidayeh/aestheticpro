"use client";

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getOrderChartData } from "@/actions/actions";
import LoadingState from "../LoadingState";

const chartConfig = {
  totalOrders: {
    label: "Total Orders",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ChartData {
  date: string; // Date in "YYYY-MM-DD" format
  totalOrders: number;
}


export function Component() {

  const [date, setDate] = React.useState<Date>(new Date()); // Default to today's date
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

 // Fetch chart data based on selected date
 React.useEffect(() => {
  const fetchChartData = async () => {
    if (!date) return;
    try {
      setIsLoading(true)
      const chartData = await getOrderChartData(date.getMonth() + 1, date.getFullYear());
      setChartData(chartData);
    } catch (err) {
      console.log(err)
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  fetchChartData();
}, [date]);

  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>(
    "totalOrders"
  );

  const totalActiveMetric = React.useMemo(
    () =>
      chartData.reduce(
        (acc, curr) => acc + (curr[activeChart] as number),
        0
      ),
    [chartData, activeChart]
  );

  return (
    <>
    <LoadingState isOpen={isLoading} />
    <Card className="col-span-4">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Orders Stats</CardTitle>
          <CardDescription>
            Showing order statistics for the selected month
          </CardDescription>
          <Popover >
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal mt-4",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(selectedDate) => {
          // Only update the date if it's defined
          if (selectedDate) {
            setDate(selectedDate);
          }
        }}
        initialFocus
      />
      </PopoverContent>
    </Popover>
        </div>
        <div className="flex">
          <div
            className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
            <span className="text-xs text-muted-foreground">{chartConfig[activeChart].label}</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {totalActiveMetric.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              minTickGap={10}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  formatter={(value) => {
                    return `${chartConfig[activeChart].label}: ${value}`;
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={chartConfig[activeChart].color}
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>

    </>
  );
}
