import { Chapter, Course, UserProgress } from '@prisma/client';

import NavbarRoutes from '@/components/navbar-routes';

import CourseMobileSidebar from './course-mobile-sidebar';

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  };
  progressCount: number
}

const CourseNavbar = ({
  course,
  progressCount
} : CourseNavbarProps) => {
  return (
    <nav className='p-4 h-full border-b bg-white flex items-center shadow-sm'>
      <CourseMobileSidebar 
        course={course}
        progressCount={progressCount}
      />
      <NavbarRoutes />
    </nav>
  )
}

export default CourseNavbar;