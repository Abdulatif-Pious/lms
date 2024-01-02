import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';


import { db } from '@/lib/db';
import { SearchInput } from '@/components/search-input';
import { getCourses } from '@/actions/get-courses';

import { Categories } from './_components/categories';
import { CoursesList } from '@/components/courses-list';


const SearchPage = async ({ searchParams }: {
  searchParams: { title: string; categoryId: string; }
}) => {

  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    } 
  });

  const courses = await getCourses({
    userId,
    ...searchParams
  });

  

  return (
    <>
      <div className='block md:hidden p-4'>
        <SearchInput />
      </div>
      <div className='p-4'>
        <Categories items={categories} />
      </div>
      <div className='p-4'>
        <CoursesList items={courses} />
      </div>
    </>
  )
} 

export default SearchPage;
