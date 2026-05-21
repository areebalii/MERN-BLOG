import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { showToast } from '@/helper/showToast';
import { HiOutlineArrowLeft, HiOutlineCloudUpload } from 'react-icons/hi';

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.root.user);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: ''
  });

  // 1. Fetch the existing post details on mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/post/getpost-by-id/${postId}`,
         
        );
        const data = await res.json();

        if (!res.ok) {
          showToast("error", "Failed to fetch post details");
          navigate('/profile');
          return;
        }

        if (data.success) {
          // Security Check: Make sure the logged-in user is the actual author
          if (data.post.author !== currentUser._id && currentUser.role !== 'admin') {
            showToast("error", "You are not authorized to edit this post");
            navigate('/profile');
            return;
          }

          setFormData({
            title: data.post.title,
            category: data.post.category,
            content: data.post.content
          });
          setImagePreview(data.post.featuredImage);
        }
      } catch (err) {
        console.error(err);
        showToast("error", "Error loading post metadata");
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchPost();
  }, [postId, currentUser, navigate]);

  // Handle local image preview changes
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  // 2. Submit Updated Data to Backend
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('content', formData.content);
    if (file) {
      data.append('file', file);
    }

    // Set up headers dynamically
    const headers = {};

    // If the logged-in user is an admin, pull their token from Local Storage
    if (currentUser?.role === 'admin') {
      const adminToken = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/post/updatepost/${postId}/${currentUser._id}`, {
        method: 'PUT',
        headers: headers,
        credentials: 'include', // 👈 CRITICAL: This sends the HTTP-Only cookie for standard users
        body: data
      });

      const result = await res.json();
      if (res.ok && result.success) {
        showToast("success", "Post updated successfully!");
        navigate(`/post/${result.post.slug}`);
      } else {
        showToast("error", result.message || "Failed to update post");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "An error occurred during submission");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all text-slate-500"
          >
            <HiOutlineArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Edit Your Article</h1>
            <p className="text-xs text-slate-400 mt-0.5">Modify your title, content space, or cover assets cleanly.</p>
          </div>
        </div>

        <form onSubmit={handleUpdateSubmit} className="space-y-6">
          {/* Cover Image Block */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Cover Image</label>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 group">
              <img src={imagePreview} className="w-full h-full object-cover" alt="Cover preview" />
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity font-medium text-sm gap-1">
                <HiOutlineCloudUpload size={24} />
                <span>Replace Cover Photo</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Title & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Post Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 text-sm font-medium transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-slate-200 bg-white rounded-xl outline-none focus:border-purple-500 text-sm font-medium transition-all"
                required
              >
                <option value="">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
              </select>
            </div>
          </div>

          {/* Content Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Article Content (HTML/Text)</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:border-purple-500 text-sm font-medium min-h-[250px] transition-all"
              required
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-purple-100"
          >
            {saving ? 'Saving System Sync...' : 'Publish Modifications'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default UpdatePost;