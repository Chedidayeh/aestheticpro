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
import { getAffiliateChartData } from "@/actions/actions"
import LoadingState from "../LoadingState"

const chartConfig = {
  totalViews: {
    label: "Links Views",
  },
  linkClicks: {
    label: "clicks",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ChartData {
  date: string;
  linkClicks: number;
  linkDetails: { title: string; views: number }[];
}


export function Component({affiliateId} : {affiliateId : string}) {

  const [date, setDate] = React.useState<Date>(new Date()); // Default to today's date
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

 // Fetch chart data based on selected date
 React.useEffect(() => {
  const fetchChartData = async () => {
    if (!date) return;
    try {
      setIsLoading(true)
      const chartData = await getAffiliateChartData(affiliateId ,date.getMonth() + 1, date.getFullYear());
      setChartData(chartData);
    } catch (err) {
      console.log(err)
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  fetchChartData();
}, [date , affiliateId]);


  const [activeChart] = React.useState<keyof typeof chartConfig>("linkClicks");

  const totalViews = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.linkClicks, 0),
    [chartData]
  );

  return (
    <>
        <LoadingState isOpen={isLoading} />

    <Card className="col-span-4" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Your Links Stats</CardTitle>
          <CardDescription>
            Showing total links clicks per month
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
            data-active={activeChart === "linkClicks"}
            className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
            <span className="text-xs text-muted-foreground">
              total
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
            <div className="flex items-center gap-2">
              <span>{totalViews.toLocaleString()}</span>
              <p className="text-xs">Clicks/PerMonth</p>
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
                  formatter={(value, name, props) => {
                    if (props.payload) {
                      const { linkDetails } = props.payload;
                      return (
                        <>
                          <div className="mb-2">
                            <strong>{`${chartConfig[activeChart].label}: ${value}`}</strong>
                          </div>
                          {linkDetails && (
                            <div className="mt-2">
                              {linkDetails.map((product: any) => (
                                <div
                                  key={product.title}
                                  className="text-sm text-muted-foreground"
                                >
                                  {`${product.title}: ${product.views}`}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    }
                    return value;
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

