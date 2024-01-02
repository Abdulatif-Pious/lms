import { Category, Course } from '@prisma/client';
import { CourseCard } from './course-card';

type CourseWithCategoryProgress = Course & {
  category: Category | null;
  progress: number | null;
  chapters: { id : string }[];
};

interface CoursesListProps {
  items: CourseWithCategoryProgress[];
};

export const CoursesList = ({
  items
} : CoursesListProps) => {
  return (
    <div>
      {items.length ? (
        <div className='grid gap-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
          {items.map((item) => (
            <CourseCard 
              key={item.id}
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl!}
              category={item.category?.name!}
              chapterLength={item.chapters.length}
              price={item.price!}
              progress={item.progress!}
            />
          ))}
        </div>
      ) : (
      <div className='text-center text-muted-foreground text-slate-500'>
        No Courses
      </div>
    )}
  </div>
  )
};