import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMail, HiOutlineUser, HiOutlineCalendar, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import { showToast } from '@/helper/showToast';
import { setUser } from '../redux/user/user.slice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: userData } = useSelector((state) => state.root.user);

  const [activeTab, setActiveTab] = useState('posts');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  // Local state for the form
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    bio: userData?.bio || '',
    avatar: userData?.avatar || ''
  });

  const [userStats, setUserStats] = useState({
    postCount: 0,
    recentPosts: []
  });

  // Fetch Stats
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/stats/${userData._id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('userToken') || localStorage.getItem('token')}`
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setUserStats({
          postCount: data.postCount,
          recentPosts: data.recentPosts
        });
      }
    } catch (error) {
      console.error("Error fetching profile stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?._id) fetchUserData();
  }, [userData?._id]);

  // 📝 Handle Update Profile Metadata (Fixed with credentials and dynamic headers)
  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('bio', formData.bio);
    if (selectedFile) {
      data.append('avatar', selectedFile);
    }

    const headers = {};
    // Add Authorization header fallback if an admin account is updating the profile
    if (userData?.role === 'admin') {
      const adminToken = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/update-user/${userData._id}`, {
        method: 'PUT',
        headers: headers,
        credentials: 'include', // 👈 Fixed: Passes user access token cookie to the backend
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        dispatch(setUser(result.user));
        showToast("success", "Profile updated!");
        setIsModalOpen(false);
      } else {
        showToast("error", result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Update failed");
    }
  };

  // 🚀 ACTION: Delete Post Handler
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to permanently delete this article?")) return;

    // Set up headers dynamically based on user role strategy
    const headers = {};
    if (userData?.role === 'admin') {
      const adminToken = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/post/deletepost-user/${postId}/${userData._id}`, {
        method: 'DELETE',
        headers: headers,
        credentials: 'include' // 👈 Fixed: Passes user access token cookie for regular authors
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("success", "Post deleted successfully.");
        fetchUserData(); // Refresh local list view space
      } else {
        showToast("error", data.message || "Failed to delete post");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "An error occurred while deleting the post.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="h-48 bg-gradient-to-r from-purple-600 to-indigo-600 w-full"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              <div className="relative">
                <img
                  referrerPolicy="no-referrer"
                  src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData?.name}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                />
              </div>

              <div className="flex-1 text-center sm:text-left pb-2">
                <h1 className="text-3xl font-bold text-gray-900">{userData?.name}</h1>
                <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                  <HiOutlineMail className="text-lg" /> {userData?.email}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all shadow-md shadow-purple-100 flex items-center gap-2"
                >
                  <HiOutlinePencil /> Edit Profile
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 border-t border-gray-50 pt-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center"><HiOutlineUser /></div>
                <div><p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Role</p><p className="text-sm font-semibold text-gray-800">{userData?.role || 'Author'}</p></div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><HiOutlineCalendar /></div>
                <div><p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Joined</p><p className="text-sm font-semibold text-gray-800">{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}</p></div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">📝</div>
                <div><p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Articles</p><p className="text-sm font-semibold text-gray-800">{userStats.postCount} Posts</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                <h2 className="text-xl font-bold">Edit Profile</h2>
                <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-5">
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="relative group">
                    <img
                      src={selectedFile ? URL.createObjectURL(selectedFile) : (userData?.avatar || `https://ui-avatars.com/api/?name=${userData?.name}`)}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-purple-50 shadow-inner group-hover:opacity-80 transition-all"
                    />
                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full text-white">
                      <HiOutlinePencil className="text-xl" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    </label>
                  </div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Change Photo</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 h-28 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-gray-700 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 active:scale-95 transition-all">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mt-8">
          <div className="flex border-b border-gray-200 gap-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === 'posts' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              My Posts ({userStats.postCount})
              {activeTab === 'posts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === 'about' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              About Me
              {activeTab === 'about' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-full" />}
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'posts' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userStats.recentPosts.length > 0 ? (
                  userStats.recentPosts.map((post) => (
                    <div key={post._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                      <div>
                        <div className="relative overflow-hidden rounded-xl mb-4 aspect-video bg-gray-100">
                          <img src={post.featuredImage} className="w-full h-full object-cover" alt={post.title} />
                        </div>
                        <h3 className="font-bold text-gray-800 line-clamp-2 px-1">{post.title}</h3>
                        <p className="text-xs text-gray-400 mt-2 px-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-50">
                        <button
                          onClick={() => navigate(`/post/${post.slug}`)}
                          className="p-2 bg-gray-50 text-gray-500 rounded-xl hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          title="View Live Article"
                        >
                          <HiOutlineEye size={18} />
                        </button>

                        <button
                          onClick={() => navigate(`/update-post/${post._id}`)}
                          className="p-2 bg-gray-50 text-gray-500 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Post Content"
                        >
                          <HiOutlinePencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Post Permanently"
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center py-20">
                    <p className="text-gray-400">You haven't written any posts yet.</p>
                    <button onClick={() => navigate('/create-post')} className="mt-4 text-purple-600 font-semibold hover:underline">Start Writing →</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 sm:p-10">
                  <div className="mb-6"><span className="text-6xl text-purple-200 font-serif leading-none">“</span></div>
                  <div className="relative">
                    {userData?.bio ? (
                      <div className="space-y-6">
                        <p className="text-lg text-gray-700 leading-relaxed italic font-medium">{userData.bio}</p>
                        <div className="h-1 w-12 bg-purple-600 rounded-full"></div>
                        <div className="flex flex-wrap gap-6 pt-2">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-purple-600"><HiOutlineUser /></span>
                            <span>Verified Author</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <div className="text-5xl mb-4">✍️</div>
                        <p className="text-gray-400 italic">Your story hasn't been told yet.</p>
                        <button onClick={() => setIsModalOpen(true)} className="mt-4 text-purple-600 font-semibold hover:underline">Add a bio to your profile</button>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end mt-2"><span className="text-6xl text-purple-200 font-serif leading-none rotate-180">“</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;