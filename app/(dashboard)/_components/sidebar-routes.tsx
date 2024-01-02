"use client"

import { usePathname } from 'next/navigation';
import { LayoutDashboard, List, BarChart2, Search } from 'lucide-react';

import SidebarItem from './sidebar-item';

const SidebarRoutes = () => {
  const pathname = usePathname();

  const guestRoutes = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      href:"/"  
    },
    {
      icon: Search,
      title: "Browse",
      href:"/search"
    }
  ];

  const teacherRoutes = [
    {
      icon: List,
      title: "Courses",
      href:"/teacher/courses"  
    },
    {
      icon: BarChart2,
      title: "Analytics",
      href:"/teacher/analytics"
    }
  ]

  const isTeacherPage = pathname?.includes("/teacher");
  
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className='flex flex-col w-full'>
      {routes.map((route) => (
        <SidebarItem 
          key={route.title}
          icon={route.icon}
          title={route.title}
          href={route.href}
        />
      ))}
    </div>
  );
}

export default SidebarRoutes;