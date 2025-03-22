"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getViewsChartData } from "@/actions/actions"

const chartConfig = {
  totalViews: {
    label: "Products Views",
  },
  views: {
    label: "views",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ChartData {
  date: string;
  views: number;
}


export function ProductsViewsChart() {

  const [date, setDate] = React.useState<Date>(new Date()); // Default to today's date
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

 // Fetch chart data based on selected date
 React.useEffect(() => {
  const fetchChartData = async () => {
    if (!date) return;
    try {
      setIsLoading(true)
      const chartData = await getViewsChartData(date.getMonth() + 1, date.getFullYear());
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


  const [activeChart] = React.useState<keyof typeof chartConfig>("views");

  const totalViews = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.views, 0),
    [chartData]
  );

  return (
    <>
    
    <Card className="col-span-4" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Products Stats</CardTitle>
          <CardDescription>
            Showing total products views per month
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
        <div className="flex bg-muted/50 rounded-t-lg">
          <div
            data-active={activeChart === "views"}
            className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 rounded-t-lg sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
            <span className="text-xs text-muted-foreground">
              total
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
            <div className="flex items-center gap-2">
              <span>{totalViews.toLocaleString()}</span>
              <p className="text-xs">Views/PerMonth</p>
            </div>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-1 sm:p-2 m-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
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
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
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

