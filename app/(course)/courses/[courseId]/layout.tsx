import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { getProgress } from '@/actions/get-progress';

import CourseNavbar from './_components/course-navbar';
import CourseSidebar from './_components/course-sidebar';


const CourseLayout = async ({
  children,
  params
} : {
    children: React.ReactNode;
    params: { courseId: string }
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  };

  const course = await db.course.findUnique({
    where: {
      id: params.courseId
    },
    include: {
      chapters: {
        where: {
          isPublished: true
        },
        include: {
          userProgress: {
            where: {
              userId
            }
          }
        },
        orderBy: {
          position: "asc"
        }
      }
    }
  });

  if (!course) {
    return redirect("/");
  };

  const progressCount = await getProgress(userId, params.courseId);

  return (
    <div className="h-full">
      <header className='h-[80px] md:pl-56 inset-y-0 w-full fixed z-50'>
        <CourseNavbar 
          course={course}
          progressCount={progressCount}
        />
      </header>
      <aside className='hidden md:flex flex-col h-full w-56 inset-y-0 fixed z-50'>
        <CourseSidebar 
          course={course}
          progressCount={progressCount}
        />
      </aside>
      <main className='mt-[80px] md:ml-56 h-full'>
        {children}
      </main>
    </div>
  )
}

export default CourseLayout;