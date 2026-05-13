import { Link, useLocation } from 'react-router-dom';
import { HiChartPie, HiViewGrid, HiPencilAlt, HiLogout } from 'react-icons/hi';

const Sidebar = () => {
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    window.location.href = '/login';
  };

  const menu = [
    { name: 'Dashboard', path: '/dashboard', icon: <HiChartPie /> },
    { name: 'Categories', path: '/categories', icon: <HiViewGrid /> },
    { name: 'All Posts', path: '/posts', icon: <HiPencilAlt /> },
  ];

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-slate-300 p-4 flex flex-col">
      <div className="py-8 px-4 text-white font-black text-2xl tracking-widest uppercase italic">
        Areeb<span className="text-purple-500 italic">.CMS</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname === item.path ? 'bg-purple-600 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-white'
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-all mt-auto"
      >
        <HiLogout className="text-xl" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;