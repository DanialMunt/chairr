"use client"

import { Pie, PieChart } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

export function PieAdmin({ draftCount, publishedCount, rejectedCount }) {
  const chartData = [
  { status: "Draft", count: draftCount, fill: "#f87171" },       
  { status: "Published", count: publishedCount, fill: "#34d399" }, 
  { status: "Rejected", count: rejectedCount, fill: "#60a5fa" }, 
]


  const chartConfig = {
    count: { label: "Chairs" },
    Draft: { label: "Draft", color: "hsl(var(--chart-1))" },
    Published: { label: "Published", color: "hsl(var(--chart-2))" },
    Rejected: { label: "Rejected", color: "hsl(var(--chart-3))" },
  }

  return (
    <Card className="flex flex-col bg-[#2B2B2B] text-white border-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Заявки</CardTitle>
        <CardDescription>Статусы заявок</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="count" nameKey="status" />
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
