import { Course, Chapter, Category} from '@prisma/client';

import { db } from '@/lib/db';
import { getProgress } from '@/actions/get-progress';

type CoursesWithCategoryChapter = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  coursesInProgress: CoursesWithCategoryChapter[];
  completedCourses: CoursesWithCategoryChapter[];
}

export async function getDashboardCourses (userId: string) : Promise<DashboardCourses> {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true
              }
            }
          }
        }
      }
    });

    const courses = purchasedCourses.map((purchase: any) => purchase.course) as CoursesWithCategoryChapter[];

    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    };

    const completedCourses = courses.filter((course: any) => course.progress === 100);
    const coursesInProgress = courses.filter((course: any) => course.progress < 100);
    
    return {
      completedCourses,
      coursesInProgress,
    }

  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error);
    return { 
      coursesInProgress: [],
      completedCourses: []
    }
  }
}
