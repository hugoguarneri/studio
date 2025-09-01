'use client'

import { Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { userDemographics } from '@/lib/mock-data'

const chartConfig = {
  value: {
    label: 'Users',
  },
  'group-a': {
    label: '18-24',
    color: 'hsl(var(--chart-1))',
  },
  'group-b': {
    label: '25-34',
    color: 'hsl(var(--chart-2))',
  },
  'group-c': {
    label: '35-44',
    color: 'hsl(var(--chart-3))',
  },
  'group-d': {
    label: '45+',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig

export default function SamplePieChart() {
  return (
    <ChartContainer config={chartConfig} className="w-full h-[300px] mx-auto">
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
        <Pie
          data={userDemographics}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-translate-y-[20px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  )
}
