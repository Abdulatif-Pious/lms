"use client";

import { usePathname, useRouter } from 'next/navigation';
import { CheckCircle, Lock, PlayCircle  } from "lucide-react";

import { cn } from '@/lib/utils';


interface CourseSidebarItemProps {
  id: string;
  label: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}

export const CourseSidebarItem = ({
  id,
  label,
  isCompleted,
  courseId,
  isLocked
}: CourseSidebarItemProps ) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle);
  const isActive = pathname.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2  text-sm text-slate-500 font-medium transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive && "text-sky-700 bg-sky-200/20 hover:text-sky-700 hover:bg-sky-200/20",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isActive && isCompleted && "bg-emerald-200/20"
      )}
    >
      <div className='flex items-center gap-x-2 p-4'>
        <Icon
          size={22} 
          className={cn(
            "text-slate-500",
            isActive && "text-sky-700",
            isCompleted && "text-emerald-700"
          )}
        />
        {label}
      </div>
      <div 
        className={cn(
          "ml-auto opacity-0 h-full border-2 border-sky-700 transition-all",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700"
        )}
      />
    </button>
  )

};