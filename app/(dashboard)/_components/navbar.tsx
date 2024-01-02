import NavbarRoutes from '@/components/navbar-routes';
import MobileSidebar from './mobile-sidebar';

const Navbar = () => {
  return (
    <nav className='p-4 h-full border-b bg-white flex items-center shadow-sm'>
      <MobileSidebar />
      <NavbarRoutes />
    </nav>
  )
}

export default Navbar;