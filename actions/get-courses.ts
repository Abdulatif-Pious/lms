import { Course, Category } from '@prisma/client';

import { db } from '@/lib/db';
import { getProgress } from './get-progress';

type CourseWithCategoryProgress = Course & {
  category: Category | null;
  progress: number | null;
  chapters: { id: string }[]; 
};

type GetCoursesProps = {
  userId: string;
  title?: string;
  categoryId? : string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId
} : GetCoursesProps) : Promise<CourseWithCategoryProgress[]> =>  {
  try {  
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title
        },
        categoryId
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const coursesWithProgress : CourseWithCategoryProgress[] = await Promise.all(
      courses.map(async (course: any) => {
        if (!course.purchases.length) {
          return {
            ...course,
            progress: null
          }
        }
        
        const progressPercentage = await getProgress(userId, course.id);

        return {
          ...course,
          progress: progressPercentage
        }
      })
    )

    return coursesWithProgress;

  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
