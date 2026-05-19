import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineDocumentText,
  HiOutlineCollection,
  HiOutlineUsers,
  HiOutlineChatAlt,
  HiOutlineClock,
  HiOutlineEye
} from 'react-icons/hi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);
  const [stats, setStats] = useState({
    posts: 0,
    categories: 0,
    users: 0,
    comments: 0
  });

  useEffect(() => {
    const savedAdmin = JSON.parse(localStorage.getItem('adminUser'));
    const adminToken = localStorage.getItem('adminToken');

    console.log("adminToken:", adminToken); // ← check console
    console.log("savedAdmin:", savedAdmin); // ← check console

    if (!adminToken || !savedAdmin || savedAdmin.role !== 'admin') {
      setLoading(false);
      window.location.href = '/sign-in';
      return;
    }

    setAdmin(savedAdmin);

    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/admin/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          }
        });
        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
          setRecentPosts(data.recentPosts);
        }
      } catch (error) {
        console.error("Failed fetching live admin reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken'); // ← clear token on logout
    navigate('/sign-in');
  };

  const statCards = [
    { label: 'Total Posts', value: stats.posts, icon: <HiOutlineDocumentText />, color: 'bg-blue-600 shadow-blue-100' },
    { label: 'Categories', value: stats.categories, icon: <HiOutlineCollection />, color: 'bg-violet-600 shadow-violet-100' },
    { label: 'Total Users', value: stats.users, icon: <HiOutlineUsers />, color: 'bg-emerald-600 shadow-emerald-100' },
    { label: 'Comments', value: stats.comments, icon: <HiOutlineChatAlt />, color: 'bg-orange-600 shadow-orange-100' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50/40">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading Matrix Summary…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">

      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {admin?.name || 'Admin'}
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Here is what's happening with your blog metrics today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 pr-5 rounded-2xl shadow-sm border border-slate-100 self-start sm:self-auto">
          <img
            src={admin?.avatar || `https://ui-avatars.com/api/?name=Admin&background=f3e8ff&color=7c3aed`}
            alt="Admin"
            className="w-10 h-10 rounded-xl border border-purple-100 object-cover"
          />
          <div>
            <span className="block text-xs font-black text-purple-600 uppercase tracking-widest leading-none">Master Admin</span>
            <span className="text-slate-400 text-[11px] font-medium mt-0.5 block">{admin?.email}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-sm shadow-slate-100/40 flex items-center justify-between group hover:border-slate-200 transition-all">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{card.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</h3>
            </div>
            <div className={`${card.color} text-white p-3.5 rounded-xl text-xl shadow-lg`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Core Dynamic Content Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Dynamic Recent Posts Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100/80 shadow-sm shadow-slate-100/40 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-50 flex justify-between items-center">
            <h2 className="font-black text-slate-900 text-base tracking-tight">Recent Blog Posts</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-md">Live Streams</span>
          </div>

          <div className="overflow-x-auto flex-1">
            {recentPosts.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm italic">
                No articles published inside your ecosystem yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <th className="py-3.5 px-5">Article details</th>
                    <th className="py-3.5 px-5">Category</th>
                    <th className="py-3.5 px-5">Date Published</th>
                    <th className="py-3.5 px-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {recentPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-slate-50/40 transition-colors group">
                      <td className="py-3.5 px-5 flex items-center gap-3">
                        <img
                          src={post.featuredImage}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="max-w-[180px] sm:max-w-xs truncate">
                          <p className="font-bold text-slate-800 truncate group-hover:text-purple-600 transition-colors">
                            {post.title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">by {post.author?.name || 'Unknown'}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100/30">
                          {post.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium">
                          <HiOutlineClock className="text-slate-300" />
                          {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-center whitespace-nowrap">
                        <Link
                          to={`/post/${post.slug}`}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-100 transition-all"
                          title="View Live Article"
                        >
                          <HiOutlineEye size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Action Matrix Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-sm shadow-slate-100/40 h-fit space-y-4">
          <h2 className="font-black text-slate-900 text-base tracking-tight mb-2">Quick Actions Workspace</h2>

          <div className="flex flex-col gap-3">
            <Link
              to="/create-post"
              className="w-full text-center py-3.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl font-bold text-xs uppercase tracking-widest border border-purple-100/50 transition-all active:scale-[0.99]"
            >
              + Create New Post
            </Link>

            <button className="w-full py-3.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold text-xs uppercase tracking-widest border border-blue-100/50 transition-all active:scale-[0.99]">
              Manage Categories
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs uppercase tracking-widest border border-rose-100/50 transition-all active:scale-[0.99]"
            >
              Logout System
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;