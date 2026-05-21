import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreatePost = () => {
  const { user: userData } = useSelector((state) => state.root.user);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', category: '' });
  const [categories, setCategories] = useState([]); // State for dynamic categories
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // toolbar modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],          // Text & Highlight colors
      [{ 'script': 'sub' }, { 'script': 'super' }],      // Sub/Superscript
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'alignment': [] }],                             // Text Alignment
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']                                          // Clear formatting
    ],
  };

  // Fetch live categories from your backend server port
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category/all`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData?._id) return toast.error("Please login first");
    if (!formData.category) return toast.error("Please select a category");
    if (!formData.content || formData.content === '<p><br></p>') {
      return toast.error("Please write some content before publishing");
    }

    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    data.append('author', userData._id);
    if (file) data.append('file', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/post/create`, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Story published successfully!");
        navigate(`/post/${result.post.slug}`);
      } else {
        toast.error(result.message || "Failed to publish");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Something went wrong while publishing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <div className="bg-white border border-slate-100 shadow-xl shadow-slate-100/50 rounded-3xl p-6 sm:p-10">

        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create New Story</h1>
          <p className="text-sm text-slate-400 mt-1">Share your thoughts, tech findings, or codebase architectures.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Elegant Auto-Resizing Title Field */}
          <div>
            <textarea
              rows="1"
              placeholder="Title of your blog..."
              className="w-full text-3xl sm:text-4xl font-black border-none outline-none resize-none placeholder:text-slate-200 text-slate-900 focus:ring-0 leading-tight"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              required
            />
          </div>

          {/* Upgraded Drag & Drop Style Cover Image Area */}
          <div className="group relative border-2 border-dashed border-slate-200 hover:border-violet-400 p-2 rounded-2xl text-center bg-slate-50/50 transition-all">
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
                    <p className="text-white text-xs font-bold uppercase tracking-widest bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm">Change Cover Image</p>
                  </div>
                </div>
              ) : (
                <div className="py-4 flex flex-col items-center justify-center gap-2">
                  <span className="text-sm text-violet-600 font-bold uppercase tracking-wider bg-violet-50 px-4 py-1.5 rounded-full border border-violet-100">Upload Banner</span>
                  <p className="text-xs text-slate-400 mt-1">Supports high-res PNG, JPG, or WEBP layouts</p>
                </div>
              )}
            </label>
          </div>

          {/* Dynamic Selection Menu */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Category</label>
            <select
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:border-violet-500 transition-all appearance-none cursor-pointer shadow-sm"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Choose a topic...</option>
              {/* 👈 Dynamically map options from your database array */}
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Modernized Fluid Quill Area */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Story Body</label>
            <div className="quill-wrapper border border-slate-200 rounded-2xl overflow-hidden focus-within:border-violet-500 transition-all shadow-sm">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                modules={modules}
                placeholder="Once upon a time in a terminal window..."
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

          {/* Actions */}
          <button
            disabled={loading}
            className="w-full bg-slate-950 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-slate-900/10"
          >
            {loading ? "Publishing Story..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;