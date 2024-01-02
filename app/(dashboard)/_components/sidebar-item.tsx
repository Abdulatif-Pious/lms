"use client"

import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from "next/navigation";

import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: LucideIcon,
  title: string,
  href: string,
}

const SidebarItem = ({ 
  icon: Icon, 
  title, 
  href 
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = 
    pathname === "/" && href === "/" ||
    pathname === href || 
    pathname?.startsWith(`${href}/`)

  const onClick = () => {
    router.push(href)
  } 
  return (
    <button 
      onClick={onClick}
      type='button'  
      className={cn(
      "flex items-center gap-x-2  text-sm text-slate-500 font-medium transition-all hover:text-slate-600 hover:bg-slate-300/20",
      isActive && "text-sky-700 bg-sky-200/20 hover:text-sky-700 hover:bg-sky-200/20"
    )}>
      <div className='flex items-center gap-x-2 p-4'>
        <Icon 
          size={22}
          className={cn(
            "text-slate-500",
            isActive && "text-sky-700"
          )}
        />
        {title}
      </div>
      <div 
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  )
};

export default SidebarItem;