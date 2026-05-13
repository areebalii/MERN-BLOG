import  { useEffect, useState } from 'react';
import { HiOutlineDocumentText, HiOutlineCollection, HiOutlineUsers, HiOutlineChatAlt } from 'react-icons/hi';

const Dashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    posts: 0,
    categories: 0,
    users: 0,
    comments: 0
  });

  useEffect(() => {
    // Get admin info for the header
    const savedAdmin = JSON.parse(localStorage.getItem('adminUser'));
    setAdmin(savedAdmin);

    // Placeholder for fetching real stats from your backend later
    setStats({
      posts: 12,
      categories: 5,
      users: 145,
      comments: 89
    });
  }, []);

  const statCards = [
    { label: 'Total Posts', value: stats.posts, icon: <HiOutlineDocumentText />, color: 'bg-blue-500' },
    { label: 'Categories', value: stats.categories, icon: <HiOutlineCollection />, color: 'bg-purple-500' },
    { label: 'Total Users', value: stats.users, icon: <HiOutlineUsers />, color: 'bg-green-500' },
    { label: 'Comments', value: stats.comments, icon: <HiOutlineChatAlt />, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, {admin?.name || 'Admin'}</h1>
          <p className="text-slate-500 text-sm">Here is what's happening with your blog today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-full shadow-sm border border-slate-100">
          <img src={admin?.avatar} alt="Admin" className="w-10 h-10 rounded-full border-2 border-purple-100" />
          <span className="text-sm font-bold text-purple-600 uppercase tracking-tighter">Master Admin</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{card.label}</p>
                <h3 className="text-3xl font-bold text-slate-800">{card.value}</h3>
              </div>
              <div className={`${card.color} text-white p-3 rounded-xl text-2xl shadow-lg`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Blog Posts</h2>
          <div className="text-center py-10 text-slate-400 italic">
            Posts table will appear here...
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full py-3 bg-purple-50 text-purple-600 rounded-xl font-bold hover:bg-purple-100 transition-colors">
              + Create New Post
            </button>
            <button className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors">
              Manage Categories
            </button>
            <button className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-colors">
              Logout System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;