"use client";

import { IconType } from 'react-icons';
import qs from 'query-string';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

interface CategoryItemProps {
  value: string;
  label: string;
  icon: IconType;
};

export const CategoryItem = ({
  value,
  label,
  icon : Icon
} : CategoryItemProps) =>  {
  
  const pathname = usePathname(); 
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTitle = searchParams.get("title");
  const currentCategoryId = searchParams.get("categoryId");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        title: currentTitle,
        categoryId: isSelected ? null : value,
      }
    }, { skipEmptyString : true, skipNull: true });

    router.push(url);
  };
  

  return (
    <button 
      className={cn(
        "flex items-center gap-x-2  p-2 mb-2 text-slate-500 border border-slate-500 rounded-full",
        isSelected && "border-sky-500 text-sky-500"
        )}
      type="button"
      onClick={onClick}
    >
      {Icon && <Icon className='w-5 h-5' />}
      <div className='truncate text-sm'>
        {label}
      </div>
    </button>
  )
}