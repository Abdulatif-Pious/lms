import { auth } from '@clerk/nextjs';
import  { redirect }   from 'next/navigation';
import { Clock, CheckCircle } from 'lucide-react';

import { CoursesList } from '@/components/courses-list';

import { InfoCard } from './_components/info-card';
import { getDashboardCourses } from '@/actions/get-dashboard-courses';

const RootPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId); 

  return (
    <>
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-4xl p-4'>
        <InfoCard
          label="Courses in progress"
          numberOfCourses={coursesInProgress.length}
          icon={Clock}
          />
        <InfoCard
          label="Completed courses"
          icon={CheckCircle}
          numberOfCourses={completedCourses.length}
          variant="success"
        />
      </div>
      <div className='p-4'>
        <CoursesList items={[...completedCourses, ...coursesInProgress]}/>
      </div>
    </>
  )
}

export default RootPage;