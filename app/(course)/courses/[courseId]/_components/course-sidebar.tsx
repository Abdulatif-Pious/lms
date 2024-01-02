import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Chapter, Course, UserProgress } from '@prisma/client';

import { db } from '@/lib/db';

import { CourseProgress } from '@/components/course-progress';

import { CourseSidebarItem } from './course-sidebar-item';



interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  };
  progressCount: number
}

const CourseSidebar = async ({
  course,
  progressCount
} : CourseSidebarProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/")
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId,
      courseId: course.id
    }
  }) 

  return (
    <div className="border-r h-full flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className='flex flex-col border-b p-5'>
        <h2 className='font-semibold text-center'>{course.title}</h2>
      </div>
      {purchase && (
        <div className='p-4'>
          <CourseProgress
            variant={progressCount === 100 ? "success" : "default"}
            value={progressCount}
          />
        </div>
      )}

      <div className="flex flex-col w-full">
        {course.chapters.map((chapter: any) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree}
          />
        ))}
        
      </div>
    </div>
  );
};

export default CourseSidebar;