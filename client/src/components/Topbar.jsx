import { Link } from 'react-router-dom';
import Searchbar from './Searchbar';
import { RouteSignIn } from '@/helper/RouteName';

const Topbar = () => {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-purple-600 text-white p-1 rounded">
          
          {/* Logo Icon */}
          <span className="font-bold">G</span>
        </div>
        <span className="text-xl font-bold tracking-tight">BLOG</span>
      </div>

      {/* Search Bar */}
     <Searchbar />

      {/* Sign In Button */}
      <Link
        to={RouteSignIn}
        className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors flex items-center gap-2"
      >
        <span>→</span> Sign In
      </Link>
    </header>
  );
};

export default Topbar;
