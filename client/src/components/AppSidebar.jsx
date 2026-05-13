import { Link } from 'react-router-dom';
import { HiOutlineHome } from "react-icons/hi";
import { LuLayoutGrid } from "react-icons/lu"; // For Categories
import { FiRss } from "react-icons/fi";       // For Blogs
import { FaRegComments } from "react-icons/fa"; // For Comments
import { HiOutlineUsers } from "react-icons/hi2"; // For Users
import { GoCircle } from "react-icons/go";      // For Category item
import { RouteCategoryDetails } from '@/helper/RouteName';

const AppSidebar = () => {
  const menuItems = [
    { name: 'Home', icon: <HiOutlineHome />, path: '/' },
    { name: 'Categories', icon: <LuLayoutGrid />, path: '/admin/categories' },
    { name: 'Blogs', icon: <FiRss />, path: '/admin/blogs' },
    { name: 'Comments', icon: <FaRegComments />, path: '/admin/comments' },
    { name: 'Users', icon: <HiOutlineUsers />, path: '/admin/users' },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-100 p-5 flex flex-col gap-6">

      {/* Top Menu Section */}
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center gap-4 px-3 py-3 text-gray-500 hover:text-black transition-colors rounded-lg group"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[16px] font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Categories Sub-Section */}
      <div className="mt-4">
        <Link to={RouteCategoryDetails} lassName="px-3 text-gray-400 text-sm font-semibold mb-3 tracking-wide uppercase">
          Categories
        </Link>

        <Link
          to=""
          className="flex items-center gap-4 px-3 py-2 text-gray-500 hover:text-black transition-colors"
        >
          <GoCircle className="text-[10px] ml-1" />
          <span className="text-[15px]">Category item</span>
        </Link>
      </div>

    </aside>
  );
};

export default AppSidebar;