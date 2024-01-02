"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import qs from 'query-string';

import { Input } from '@/components/ui/input';

export const SearchInput = () => {
  
  const [value, setValue] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        categoryId: currentCategoryId,
        title: value
      }
    }, { skipEmptyString: true, skipNull: true });
  
    router.push(url);
  }, [pathname, currentCategoryId, value, router]) 

  return (
    <div className='relative'>
      <Search className='absolute top-3 left-3 w-4 h-4 text-slate-500'/>
      <Input 
        value={value}
        onChange={(e) =>  setValue(e.target.value)}
        placeholder="Search courses"
        className='w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200'
      />
    </div>
  )
}

