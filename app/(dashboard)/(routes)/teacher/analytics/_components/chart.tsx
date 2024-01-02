"use client"

import { Card } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from 'recharts';

interface ChartProps {
  data: {
    name: string;
    total: number;
  }[]
}

export const Chart = ({ data } : ChartProps) => {
  return (
    <Card>
      <ResponsiveContainer width='100%' height={350} >
        <BarChart  data={data}>
          <XAxis 
            stroke="#888888"
            dataKey="name"
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#888888"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: any) => `$${value}`}
          />
          <Bar 
            dataKey="total"
            fill="#159ac3"
            radius={[40, 40, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}