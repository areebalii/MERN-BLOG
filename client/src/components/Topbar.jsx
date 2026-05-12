import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Searchbar from './Searchbar';
import { RouteIndex, RouteProfile, RouteSignIn } from '@/helper/RouteName';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/user/user.slice';
import { HiOutlineLogout, HiOutlineUser, HiOutlineChevronDown, HiOutlinePlus } from
  'react-icons/hi';
import { toast } from 'react-toastify';

const Topbar = () => {
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
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-purple-600 text-white p-1 rounded">
          <span className="font-bold">G</span>
        </div>
        <span className="text-xl font-bold tracking-tight">BLOG</span>
      </div>

      <Searchbar />

      <div className="flex items-center">
        {!isLoggedIn ? (
          <Link
            to={RouteSignIn}
            className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <span>→</span> Sign In
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-lg transition-all border border-transparent hover:border-gray-100"
            >
              <img
                referrerPolicy="no-referrer"
                src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData?.name}`}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border-2 border-purple-100"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800 leading-none">{userData?.name}</p>
                <p className="text-[10px] text-gray-500 mt-1">Author</p>
              </div>
              <HiOutlineChevronDown className={`text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-[60] animate-in fade-in zoom-in duration-150">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{userData?.email}</p>
                </div>

                <Link
                  to=""
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <HiOutlinePlus className="text-lg" /> Create Blog
                </Link>
                <Link
                  to={RouteProfile}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <HiOutlineUser className="text-lg" /> Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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