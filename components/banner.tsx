import { AlertCircle, BadgeCheck  } from 'lucide-react';
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const bannerVariants = cva(
  "border p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200 border-yellow-30 ",
        success: "bg-green-200 border-green-20 ",
      }
    },
    defaultVariants: {
      variant: "warning"
    }
  }
);

const iconMap = {
  warning: AlertCircle,
  success: BadgeCheck
};

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string
};

export const Banner = ({
  label,
  variant
} : BannerProps) => {
  const Icon = iconMap[variant || "warning"];

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className='w-4 h-4 mr-2'/>
      <p>{label}</p>
    </div>
  )
}

