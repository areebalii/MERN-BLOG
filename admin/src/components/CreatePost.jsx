import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreatePost = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', category: '' });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Premium, production-ready toolbar configurations
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'alignment': [] }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };

  useEffect(() => {
    // 1. Verify admin state from local storage on mount
    const savedAdmin = JSON.parse(localStorage.getItem('adminUser'));
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken || !savedAdmin || savedAdmin.role !== 'admin') {
      toast.error("Unauthorized! Access restricted to administrators.");
      navigate('/sign-in');
      return;
    }
    setAdmin(savedAdmin);

    // 2. Fetch live taxonomy choices from backend database
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/category/all`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
        toast.error("Failed to load schema categories");
      }
    };
    fetchCategories();
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminToken = localStorage.getItem('adminToken');

    if (!admin?._id || !adminToken) return toast.error("Session expired, please login again.");
    if (!formData.category) return toast.error("Please select an article classification category");
    if (!formData.content || formData.content === '<p><br></p>') {
      return toast.error("Please compose your story body text before publishing");
    }

    setLoading(true);

    // Multi-part form creation layer for binaries + strings
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    data.append('author', admin._id); // 👈 Pass the authenticated admin database object ID
    if (file) data.append('file', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/post/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}` // 👈 Secure the request using admin tokens
        },
        body: data,
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Admin story published to live network!");
        navigate('/posts'); // Route back to master posts layout matrix
      } else {
        toast.error(result.message || "Publishing transaction failed");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Server synchronization error while publishing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-12 animate-in fade-in duration-300">
      <div className="bg-white border border-slate-100 shadow-xl shadow-slate-100/50 rounded-3xl p-6 sm:p-10">

        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Compose Admin Story</h1>
            <p className="text-sm text-slate-400 mt-1">Publishing as an authoritative hub system administrator.</p>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-600">Admin Mode Active</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Auto-Resizing Title Textarea Input */}
          <div>
            <textarea
              rows="1"
              placeholder="Title of your official blog..."
              className="w-full text-3xl sm:text-4xl font-black border-none outline-none resize-none placeholder:text-slate-200 text-slate-900 focus:ring-0 leading-tight"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              required
            />
          </div>

          {/* Drag & Drop Style Cover Image Area */}
          <div className="group relative border-2 border-dashed border-slate-200 hover:border-purple-400 p-2 rounded-2xl text-center bg-slate-50/50 transition-all">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="cover-img"
            />
            <label htmlFor="cover-img" className="cursor-pointer block p-6">
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden max-h-64 shadow-inner">
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Cover preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-xs font-bold uppercase tracking-widest bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm">Change Cover Banner</p>
                  </div>
                </div>
              ) : (
                <div className="py-4 flex flex-col items-center justify-center gap-2">
                  <span className="text-sm text-purple-600 font-bold uppercase tracking-wider bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100">Upload Banner</span>
                  <p className="text-xs text-slate-400 mt-1">Supports crisp, high-res PNG, JPG, or WEBP system cards</p>
                </div>
              )}
            </label>
          </div>

          {/* Dynamic Database Categorization Dropdown Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Category</label>
            <select
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer shadow-sm"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Choose a tracking taxon topic...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rich Text Editor Module */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Story Content Body</label>
            <div className="quill-wrapper border border-slate-200 rounded-2xl overflow-hidden focus-within:border-purple-500 transition-all shadow-sm">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                modules={modules}
                placeholder="Initialize script context layout string here..."
              />
            </div>
          </div>

          <style>{`
            .quill-wrapper .ql-toolbar.ql-snow {
              border: none !important;
              background-color: #f8fafc !important;
              border-bottom: 1px solid #e2e8f0 !important;
              padding: 12px !important;
            }
            .quill-wrapper .ql-container.ql-snow {
              border: none !important;
              font-family: inherit !important;
              font-size: 1rem !important;
            }
            .quill-wrapper .ql-editor {
              min-height: 320px !important;
              max-height: 600px;
              overflow-y: auto;
              color: #334155 !important;
              line-height: 1.75 !important;
              padding: 24px !important;
            }
            .quill-wrapper .ql-editor.ql-blank::before {
              color: #cbd5e1 !important;
              font-style: normal !important;
              left: 24px !important;
            }
          `}</style>

          {/* Form Action Submitter */}
          <button
            disabled={loading}
            className="w-full bg-slate-950 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-purple-700 transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-slate-900/10"
          >
            {loading ? "Publishing Admin Document..." : "Publish Admin Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;