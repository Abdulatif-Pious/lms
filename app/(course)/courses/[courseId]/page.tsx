import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

const CourseIdPage = async (
  { params }: { params: { courseId: string } }
) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  } ;

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true
        },
        orderBy: {
          position: "asc"
        }
      }
    },
  });

  if (!course) {
    return redirect("/");
  }
  
  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);

};

export default CourseIdPage;