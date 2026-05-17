import { useState, useEffect } from 'react';
import { HiOutlineFolderAdd, HiOutlineTrash, HiOutlineCollection } from 'react-icons/hi';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/category/all');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Create Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/category/create', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setName('');
      fetchCategories(); // Refresh list instantly
    } catch (err) {
      setError('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/category/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.filter((cat) => cat._id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Blog Categories</h1>
        <p className="text-slate-400 text-sm mt-0.5">Organize your ecosystem articles into clean classifications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Create Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/40 h-fit">
          <h2 className="font-black text-slate-900 text-lg tracking-tight mb-4 flex items-center gap-2">
            <HiOutlineFolderAdd className="text-purple-500 text-xl" /> Create Category
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Category Name</label>
              <input
                type="text"
                placeholder="e.g. MERN Stack, Tech News"
                value={name}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm font-medium"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-xs bg-red-50 p-3 rounded-lg font-medium">{error}</p>}

            <button
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs uppercase tracking-widest font-bold rounded-xl shadow-lg shadow-purple-100 transition-all disabled:opacity-70"
            >
              {loading ? 'Creating...' : 'Save Category'}
            </button>
          </form>
        </div>

        {/* Right Column: Categories List Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-50 flex justify-between items-center">
            <h2 className="font-black text-slate-900 text-base tracking-tight flex items-center gap-2">
              <HiOutlineCollection className="text-purple-500 text-xl" /> Existing Taxonomies
            </h2>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
              Total: {categories.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            {categories.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm italic">
                No custom categories exist yet. Build one on the sidebar panel.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <th className="py-3.5 px-6">Name</th>
                    <th className="py-3.5 px-6">Slug identifier</th>
                    <th className="py-3.5 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-medium">
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-slate-50/40 transition-colors group">
                      <td className="py-3.5 px-6 font-bold text-slate-800">{category.name}</td>
                      <td className="py-3.5 px-6">
                        <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          {category.slug}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Category"
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Categories;