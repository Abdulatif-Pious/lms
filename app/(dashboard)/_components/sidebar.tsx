import Link from 'next/link';

import Logo from "./logo";
import SidebarRoutes from "./sidebar-routes";

const Sidebar = () => {
  
  return (
    <div className="border-r h-full flex flex-col overflow-y-auto bg-white shadow-sm">
      <Link href='/' className='flex justify-center'>
        <Logo />
      </Link>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;