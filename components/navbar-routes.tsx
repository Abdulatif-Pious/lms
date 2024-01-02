"use client"


import {  LogOut  } from 'lucide-react';
import { usePathname }  from 'next/navigation';
import Link from "next/link";
import  { UserButton, useAuth }  from "@clerk/nextjs";

import { Button } from '@/components/ui/button';
import { isTeacher } from '@/lib/teacher';
import { SearchInput } from './search-input';

const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  
  const isTeacherPage = pathname.startsWith("/teacher");
  const isCoursePage = pathname.includes("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className='hidden md:block'>
          <SearchInput />
        </div>
      )} 
      <div className='flex items-center gap-x-3 ml-auto'>
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="mr-2 w-4 h-4" />
              Exit
            </Button>
          </Link>
        ) : isTeacher(userId) && (
          <Link href='/teacher/courses'>
            <Button size="sm" variant="ghost">
              Teacher mode
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export default NavbarRoutes;

