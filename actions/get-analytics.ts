import { Purchase, Course } from '@prisma/client';

import { db } from '@/lib/db';

type PurchaseWithCourse = Purchase & {
  course: Course
}

const groupedCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped : { [courseTitle: string] : number } = {};
  
  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price!
  })

  return grouped;
};


export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        userId
      },
      include: {
        course: true
      }
    });

    const groupedEarnings = groupedCourse(purchases);
    
    const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
      name: courseTitle,
      total
    }));

    const totalRevenue = Number(data.reduce((acc, curr) => acc + curr.total, 0).toFixed(2));
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales
    }

  } catch (error) {
    console.log("[GET_ANALTRICS_ERROR]", error);
    return {
      data: [],
      totalRevenue: 0,
      toalSales: 0,
    }
  }
};