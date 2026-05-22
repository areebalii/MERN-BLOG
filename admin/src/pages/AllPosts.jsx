import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineTrash, HiOutlineEye, HiOutlineSearch, HiOutlineClock, HiOutlineTag } from 'react-icons/hi';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal tracking states
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
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

  // 👁️ FETCH SINGLE POST DETAILS FOR THE VIEW MODAL
  const handleViewPostDetails = async (postId) => {
    try {
      setIsModalOpen(true);
      setModalLoading(true);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/post/getpost-by-id/${postId}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setSelectedPost(data.post);
      } else {
        showToast('error', data.message || 'Could not fetch post details');
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'An error occurred while loading post information.');
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

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
        showToast('success', 'Story purged permanently.');
      } else {
        console.error('Delete API Error:', data.message);
        showToast('error', data.message || 'Failed to complete deletion.');
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
                        {/* Modified view link to act as a button capturing state */}
                        <button
                          onClick={() => handleViewPostDetails(post._id)}
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all border border-transparent hover:border-purple-100"
                          title="View Live Article"
                        >
                          <HiOutlineEye size={16} />
                        </button>
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

      {/* 👁️ INTERACTIVE ARTICLE PREVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col transform transition-all animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center text-white shrink-0">
              <h2 className="text-lg font-bold tracking-tight">Article Details Review</h2>
              <button
                onClick={() => { setIsModalOpen(false); setSelectedPost(null); }}
                className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-8 h-8 border-4 border-slate-100 border-t-purple-600 rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Document Content…</p>
                </div>
              ) : selectedPost ? (
                <>
                  {/* Featured Image Banner */}
                  <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 shadow-inner relative">
                    <img
                      src={selectedPost.featuredImage}
                      className="w-full h-full object-cover"
                      alt={selectedPost.title}
                    />
                    <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest text-purple-600 bg-white/95 px-3 py-1.5 rounded-xl shadow-sm backdrop-blur-sm flex items-center gap-1.5">
                      <HiOutlineTag /> {selectedPost.category}
                    </span>
                  </div>

                  {/* Title and ID Info */}
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">{selectedPost.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-slate-400 font-medium">
                      <p className="font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">ID: {selectedPost._id}</p>
                      <span className="flex items-center gap-1"><HiOutlineClock /> {new Date(selectedPost.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* HTML Content Body Area */}
                  <div
                    className="prose prose-purple max-w-none text-slate-600 text-sm leading-relaxed space-y-3"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                  />
                </>
              ) : (
                <p className="text-center py-10 text-slate-400 text-sm">Failed to extract content.</p>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); setSelectedPost(null); }}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AllPosts;