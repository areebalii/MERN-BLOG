import  { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', category: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Toolbar options for the editor
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Bullet points
      ['link', 'code-block'],
      ['clean']
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    if (file) data.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/api/post/create', {
        method: 'POST',
        body: data, // Sending as FormData for the image
      });
      const result = await res.json();
      if (result.success) {
        navigate(`/post/${result.post.slug}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-sm rounded-3xl my-10">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Create a New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <input
          type="text"
          placeholder="Title of your blog"
          className="w-full text-4xl font-bold border-none outline-none placeholder:text-slate-300"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        {/* Cover Image Upload */}
        <div className="border-2 border-dashed border-slate-200 p-8 rounded-2xl text-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="cover-img"
          />
          <label htmlFor="cover-img" className="cursor-pointer text-purple-600 font-semibold">
            {file ? `Selected: ${file.name}` : "Click to upload a cover image"}
          </label>
        </div>

        {/* Category Selection */}
        <select
          className="w-full p-3 rounded-xl border border-slate-200"
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="">Select Category</option>
          <option value="technology">Technology</option>
          <option value="lifestyle">Lifestyle</option>
        </select>

        {/* The Proper Editor */}
        <div className="h-72 mb-12">
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            modules={modules}
            className="h-full rounded-xl"
            placeholder="Write your story here..."
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;