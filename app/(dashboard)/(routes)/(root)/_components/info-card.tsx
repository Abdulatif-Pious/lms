import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";

interface InfoCardProps {
  label: string;
  icon: LucideIcon;
  numberOfCourses: number;
  variant?: "success" | "default";
};

export const  InfoCard = ({
  label,
  icon: Icon,
  numberOfCourses,
  variant,
} : InfoCardProps) => {
  return (
    <div className="flex items-center gap-2 p-4 border rounded-md">
      <IconBadge 
        icon={Icon}
        variant={variant || "default"}
      />
      <div>
        <h4 className="text-medium text-lg">{label}</h4>
        <p className="text-sm text-slate-500 italic">
          {numberOfCourses} {numberOfCourses > 1  ? "courses" : "course"}
        </p>
      </div>
    </div>
  )
}