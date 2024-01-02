
import Navbar from './_components/navbar';
import Sidebar from './_components/sidebar';

const DashboardLayout = ({
  children 
} : {
    children: React.ReactNode
}) => {

  return (
    <div className="h-full">
      <header className='h-[80px] md:pl-56 inset-y-0 w-full fixed z-50'>
        <Navbar />
      </header>
      <aside className='hidden md:flex flex-col h-full w-56 inset-y-0 fixed z-50'>
        <Sidebar />
      </aside>
      <main className='mt-[80px] md:ml-56 h-full'>
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout;