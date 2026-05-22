import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Searchbar from './Searchbar';
import { RouteCreatePost, RouteIndex, RouteProfile, RouteSignIn } from '@/helper/RouteName';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/user/user.slice';
import { HiOutlineLogout, HiOutlineUser, HiOutlineChevronDown, HiOutlinePlus, HiMenu, HiX } from 'react-icons/hi';
import { toast } from 'react-toastify';

// 🔌 Destructured responsiveness controls passed down from Layout.jsx
const Topbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { isLoggedIn, user: userData } = useSelector((state) => state.root.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/logout`, {
        method: "get",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to log out");
      }

      dispatch(logout());
      navigate(RouteIndex);
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 sm:px-8 sticky top-0 z-50 shrink-0">

      {/* Brand & Toggle Container Group */}
      <div className="flex items-center gap-3">
        {/* 🍔 Dynamic Responsive Hamburger Button (Hidden on screen size ≥ 1024px) */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 lg:hidden transition-all focus:outline-none"
          aria-label="Toggle navigation system sidebar"
        >
          {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
        </button>

        {/* Brand System Mark */}
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 text-white p-1 rounded">
            <span className="font-bold">G</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">BLOG</span>
        </div>
      </div>

      {/* Embedded Central Search Filter Layer (Hidden dynamically on tiny screen break lines if needed) */}
      <div className="hidden sm:block flex-1 max-w-md mx-4">
        <Searchbar />
      </div>

      {/* Account Session State Trigger Module */}
      <div className="flex items-center">
        {!isLoggedIn ? (
          <Link
            to={RouteSignIn}
            className="bg-purple-600 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <span>→</span> Sign In
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100"
            >
              <img
                referrerPolicy="no-referrer"
                src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData?.name}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-purple-100/50"
              />
              <div className="hidden md:block text-left max-w-[120px]">
                <p className="text-xs font-bold text-slate-800 truncate leading-none">{userData?.name}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">{userData?.role || 'Author'}</p>
              </div>
              <HiOutlineChevronDown className={`text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Overlay */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-[60] animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Signed in as</p>
                  <p className="text-xs font-semibold text-slate-700 truncate mt-0.5">{userData?.email}</p>
                </div>

                <Link
                  to={RouteCreatePost}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <HiOutlinePlus className="text-lg text-slate-400" /> Create Blog
                </Link>
                <Link
                  to={RouteProfile}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <HiOutlineUser className="text-lg text-slate-400" /> Profile
                </Link>

                <hr className="border-slate-50 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <HiOutlineLogout className="text-lg" /> Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;