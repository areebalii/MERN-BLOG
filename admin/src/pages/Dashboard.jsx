import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineDocumentText,
  HiOutlineCollection,
  HiOutlineUsers,
  HiOutlineChatAlt,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineUserCircle,
  HiOutlineCloudUpload,
  HiOutlineChartBar
} from 'react-icons/hi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'profile'

  const [recentPosts, setRecentPosts] = useState([]);
  const [stats, setStats] = useState({ posts: 0, categories: 0, users: 0, comments: 0 });

  // Profile Update Form State
  const [profileData, setProfileData] = useState({ name: '', email: '', password: '' });
  const [file, setFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const savedAdmin = JSON.parse(localStorage.getItem('adminUser'));
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken || !savedAdmin || savedAdmin.role !== 'admin') {
      setLoading(false);
      window.location.href = '/sign-in';
      return;
    }

    setAdmin(savedAdmin);
    setProfileData({ name: savedAdmin.name, email: savedAdmin.email, password: '' });
    setAvatarPreview(savedAdmin.avatar);

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAvatarPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const adminToken = localStorage.getItem('adminToken');

    const data = new FormData();
    data.append('name', profileData.name);
    data.append('email', profileData.email);
    if (profileData.password) data.append('password', profileData.password);
    if (file) data.append('file', file);

    try {
      const res = await fetch(`http://localhost:3000/api/user/update/${admin._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: data
      });
      const result = await res.json();

      if (result.success) {
        // Sync local storage updates
        localStorage.setItem('adminUser', JSON.stringify(result.user));
        setAdmin(result.user);
        alert('Profile updated successfully!');
        setActiveTab('overview');
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile metadata');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
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
        <div
          onClick={() => setActiveTab(activeTab === 'profile' ? 'overview' : 'profile')}
          className="flex items-center gap-3 bg-white p-2 pr-5 rounded-2xl shadow-sm border border-slate-100 hover:border-purple-200 transition-all cursor-pointer self-start sm:self-auto group"
        >
          <img
            src={admin?.avatar || `https://ui-avatars.com/api/?name=Admin&background=f3e8ff&color=7c3aed`}
            alt="Admin"
            className="w-10 h-10 rounded-xl border border-purple-100 object-cover"
          />
          <div>
            <span className="block text-xs font-black text-purple-600 uppercase tracking-widest leading-none group-hover:text-purple-700">Master Admin ⚙️</span>
            <span className="text-slate-400 text-[11px] font-medium mt-0.5 block">{admin?.email}</span>
          </div>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
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
                  <div className="text-center py-16 text-slate-400 text-sm italic">No articles published yet.</div>
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
                            <img src={post.featuredImage} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                            <div className="max-w-[180px] sm:max-w-xs truncate">
                              <p className="font-bold text-slate-800 truncate group-hover:text-purple-600 transition-colors">{post.title}</p>
                              <p className="text-[11px] text-slate-400 truncate">by {post.author?.name || 'Unknown'}</p>
                            </div>
                          </td>
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100/30">{post.category}</span>
                          </td>
                          <td className="py-3.5 px-5 text-xs text-slate-400 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 font-medium">
                              <HiOutlineClock className="text-slate-300" />
                              {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </td>
                          <td className="py-3.5 px-5 text-center whitespace-nowrap">
                            <Link to={`/post/${post.slug}`} className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-100 transition-all"><HiOutlineEye size={16} /></Link>
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
                <Link to="/create-post" className="w-full text-center py-3.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl font-bold text-xs uppercase tracking-widest border border-purple-100/50 transition-all active:scale-[0.99]">+ Create New Post</Link>
                <button onClick={() => setActiveTab('profile')} className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-md shadow-purple-100">
                  <HiOutlineUserCircle size={16} /> Edit Admin Settings
                </button>
                <button onClick={handleLogout} className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs uppercase tracking-widest border border-rose-100/50 transition-all active:scale-[0.99]">Logout System</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Edit Profile Segment Section */
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-2xl mx-auto p-6 sm:p-10 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Admin Profile Customization</h2>
              <p className="text-xs text-slate-400 mt-0.5">Alter secure credentials and appearance settings across your platform instance.</p>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all"
            >
              <HiOutlineChartBar size={14} /> View Stats
            </button>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">

            {/* Avatar Input File Form Upload */}
            <div className="flex flex-col items-center justify-center gap-4 bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200">
              <div className="relative group w-24 h-24 rounded-2xl overflow-hidden shadow-inner bg-white border border-slate-100">
                <img src={avatarPreview || `https://ui-avatars.com/api/?name=Admin`} className="w-full h-full object-cover" alt="Avatar upload target" />
                <label htmlFor="avatar-file" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <HiOutlineCloudUpload className="text-white text-xl" />
                </label>
              </div>
              <input type="file" id="avatar-file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Click card avatar image to transform avatar</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Administrative Profile Name</label>
                <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-medium text-sm transition-all text-slate-700" required />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">System Correspondence Email</label>
                <input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-medium text-sm transition-all text-slate-700" required />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Modify Cryptographic Password (Leave blank to keep current)</label>
                <input type="password" placeholder="••••••••" value={profileData.password} onChange={(e) => setProfileData({ ...profileData, password: e.target.value })} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-medium text-sm transition-all" />
              </div>
            </div>

            <button disabled={updating} className="w-full bg-slate-950 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-purple-600 transition-all disabled:opacity-50">
              {updating ? 'Saving Schema Layers...' : 'Commit Database Updates'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;