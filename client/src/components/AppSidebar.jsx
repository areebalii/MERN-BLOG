import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlinePlusCircle,
  HiOutlineDocumentText,
  HiOutlineCog,
  HiOutlineLockClosed,
  HiX
} from "react-icons/hi";
import { LuLayoutGrid } from "react-icons/lu";
import { FiRss } from "react-icons/fi";
import { FaRegComments } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi2";

const AppSidebar = ({ isOpen, onClose }) => {
  const { user: userData } = useSelector((state) => state.root.user);
  const isAdmin = userData?.role === 'admin';

  const navLinkStyle = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group ${isActive
      ? 'bg-purple-50 text-purple-600 border border-purple-100/50 shadow-sm'
      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/70'
    }`;

  return (
    <aside className={`
      /* 📱 Mobile Drawer Handling Specs */
      fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 p-4 flex flex-col justify-between shrink-0 transform transition-transform duration-300 ease-in-out
      
      /* 🖥️ Desktop Permanent Dock Rules */
      lg:static lg:translate-x-0 h-full
      
      /* Active state trigger computation evaluation */
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="space-y-6">

        {/* Workspace Brand Layout Tag */}
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-200">
              B
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800 tracking-tight leading-none">Console System</h2>
              <p className="text-[10px] font-bold tracking-widest text-purple-600 uppercase mt-0.5">
                {isAdmin ? '🛡️ Admin Panel' : '✍️ Author Space'}
              </p>
            </div>
          </div>

          {/* Inline close layout key button visibility for easier touch access targets */}
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg text-slate-400 hover:bg-slate-50">
            <HiX className="text-lg" />
          </button>
        </div>

        {/* SECTION 1: CORE WORKSPACE */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            Workspace
          </p>
          <NavLink to="/" onClick={onClose} className={navLinkStyle}>
            <div className="flex items-center gap-4">
              <HiOutlineHome className="text-xl text-slate-400 group-hover:text-slate-600" />
              <span>Dashboard Home</span>
            </div>
          </NavLink>
        </div>

        {/* SECTION 2: CREATOR TOOLS */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            Content Creator
          </p>
          <NavLink to="/create-post" onClick={onClose} className={navLinkStyle}>
            <div className="flex items-center gap-4">
              <HiOutlinePlusCircle className="text-xl text-slate-400 group-hover:text-purple-600" />
              <span>Write New Article</span>
            </div>
          </NavLink>
          <NavLink to="/profile" onClick={onClose} className={navLinkStyle}>
            <div className="flex items-center gap-4">
              <HiOutlineDocumentText className="text-xl text-slate-400 group-hover:text-slate-600" />
              <span>My Stories</span>
            </div>
          </NavLink>
        </div>

        {/* SECTION 3: SYSTEM ADMINISTRATION */}
        {isAdmin && (
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <p className="px-4 text-[10px] font-black uppercase tracking-widest text-red-500 mb-2 flex items-center gap-1">
              <HiOutlineLockClosed /> Admin Controls
            </p>
            <NavLink to="/admin/categories" onClick={onClose} className={navLinkStyle}>
              <div className="flex items-center gap-4"><LuLayoutGrid className="text-xl text-slate-400" /><span>All Categories</span></div>
            </NavLink>
            <NavLink to="/admin/blogs" onClick={onClose} className={navLinkStyle}>
              <div className="flex items-center gap-4"><FiRss className="text-xl text-slate-400" /><span>Moderate Blogs</span></div>
            </NavLink>
            <NavLink to="/admin/comments" onClick={onClose} className={navLinkStyle}>
              <div className="flex items-center gap-4"><FaRegComments className="text-xl text-slate-400" /><span>Comments Panel</span></div>
            </NavLink>
            <NavLink to="/admin/users" onClick={onClose} className={navLinkStyle}>
              <div className="flex items-center gap-4"><HiOutlineUsers className="text-xl text-slate-400" /><span>User Management</span></div>
            </NavLink>
          </div>
        )}
      </div>

      {/* FOOTER: User Account & Settings Shortcut */}
      <div className="space-y-3">
        <NavLink to="/settings" onClick={onClose} className={navLinkStyle}>
          <div className="flex items-center gap-4">
            <HiOutlineCog className="text-xl text-slate-400 group-hover:text-slate-600" />
            <span>Account Settings</span>
          </div>
        </NavLink>

        {userData && (
          <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
            <img
              src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData?.name}`}
              alt="user profile"
              className="w-9 h-9 rounded-xl object-cover border border-white shadow-sm shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-700 truncate leading-tight">{userData.name}</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{userData.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;