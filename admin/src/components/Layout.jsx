import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 max-h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;