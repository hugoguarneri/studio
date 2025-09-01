'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { categorySales } from '@/lib/mock-data'

const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
  electronics: { label: 'Electronics', color: 'hsl(var(--chart-1))' },
  apparel: { label: 'Apparel', color: 'hsl(var(--chart-2))' },
  'home-goods': { label: 'Home Goods', color: 'hsl(var(--chart-3))' },
  books: { label: 'Books', color: 'hsl(var(--chart-4))' },
  groceries: { label: 'Groceries', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig

export default function SampleBarChart() {
  return (
    <ChartContainer config={chartConfig} className="w-full h-[300px]">
      <BarChart accessibilityLayer data={categorySales} layout="vertical" margin={{ left: 10, right: 10 }}>
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          className='capitalize'
        />
        <XAxis dataKey="sales" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar dataKey="sales" layout="vertical" radius={5} />
      </BarChart>
    </ChartContainer>
  )
}
