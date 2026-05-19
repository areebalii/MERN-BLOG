import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineTrash, HiOutlineEye, HiOutlineSearch, HiOutlineClock } from 'react-icons/hi';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      // 1. Updated to use the correct VITE_ prefix
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/post/allposts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you absolute sure you want to permanently delete this story?')) return;

    try {
      const adminToken = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/post/deletepost/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        credentials: 'include',
      });
      const data = await res.json();

      if (data.success) {
        setPosts(posts.filter((post) => post._id !== postId));
      } else {
        console.error('Delete API Error:', data.message);
      }
    } catch (err) {
      console.error('Delete API Error:', err);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Syncing Articles Ledger…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">

      {/* Upper Title Segment */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">All Blog Stories</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage, review, and moderate all custom articles across your network.</p>
        </div>
        <Link
          to="/create-post"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl shadow-md shadow-purple-100 transition-all self-start sm:self-auto active:scale-[0.98]"
        >
          + New Post
        </Link>
      </div>

      {/* Control Actions Panel (Search bar) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 max-w-md focus-within:border-purple-500 transition-all">
        <HiOutlineSearch className="text-slate-400 text-xl shrink-0" />
        <input
          type="text"
          placeholder="Search by title or category classification..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm font-medium outline-none text-slate-700 placeholder:text-slate-400 bg-transparent"
        />
      </div>

      {/* Main Records Container Layout Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm italic">
              No matching blog stories found inside the active schema layer.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="py-4 px-6">Post Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Author Profile</th>
                  <th className="py-4 px-6">Date Created</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium">
                {filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-slate-50/30 transition-colors group">

                    {/* Post Image & Title Info */}
                    <td className="py-4 px-6 flex items-center gap-4">
                      <img
                        src={post.featuredImage || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=150'}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-slate-50 shadow-inner shrink-0"
                      />
                      <div className="max-w-[220px] sm:max-w-sm truncate">
                        <p className="font-bold text-slate-800 truncate group-hover:text-purple-600 transition-colors">
                          {post.title}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono tracking-tight mt-0.5">{post._id}</p>
                      </div>
                    </td>

                    {/* Category Label */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100/30">
                        {post.category}
                      </span>
                    </td>

                    {/* Author Metadata Info */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name || 'User'}`}
                          alt=""
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <div>
                          {/* AUTHOR NAME WITH PURPLE ADMIN TICK */}
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-slate-700 leading-none">
                              {post.author?.name || 'System User'}
                            </p>
                            {post.author?.role === 'admin' && (
                              <span
                                className="inline-flex items-center justify-center bg-purple-100 text-purple-600 rounded-full font-black text-[8px] border border-purple-200"
                                title="Verified Admin Author"
                                style={{ width: '12px', height: '12px', transform: 'translateY(-1px)' }}
                              >
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 font-medium">{post.author?.email || 'deleted@user.com'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Built Timestamp */}
                    <td className="py-4 px-6 text-xs text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium">
                        <HiOutlineClock className="text-slate-300 text-sm" />
                        {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>

                    {/* Management Action Modifiers */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/post/${post.slug}`}
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all border border-transparent hover:border-purple-100"
                          title="View Live Article"
                        >
                          <HiOutlineEye size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                          title="Purge Document"
                        >
                          <HiOutlineTrash size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};

export default AllPosts;