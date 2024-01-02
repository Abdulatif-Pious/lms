"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatPrice } from "@/lib/format";

interface DataCardProps {
  label: string;
  value: number;
  shouldFormat?: boolean;
}

export const DataCard = ({
  label,
  value,
  shouldFormat
} : DataCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium text-2xl">{shouldFormat ? formatPrice(value) : value}</p>
      </CardContent>
    </Card>
  );
};