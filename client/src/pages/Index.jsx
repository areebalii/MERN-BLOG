import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineClock } from 'react-icons/hi';

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/post/all-posts');
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Stories</span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg">Explore the latest insights from our community.</p>
          </div>
          <div className="h-1 w-20 bg-purple-600 rounded-full hidden md:block mb-4"></div>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-slate-100">
            <h3 className="text-xl font-semibold text-slate-800">No stories yet</h3>
            <p className="text-slate-500 mt-2">Be the first one to share a story!</p>
            <Link to="/create-post" className="mt-6 inline-flex items-center text-purple-600 font-bold hover:gap-2 transition-all">
              Start Writing <HiOutlineArrowRight className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/post/${post.slug}`}
                className="group flex flex-col bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:border-purple-100 hover:shadow-[0_20px_50px_rgba(147,51,234,0.08)] transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <span className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-slate-900 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="px-2 py-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-3">
                    <HiOutlineClock className="text-sm" />
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>

                  <h2 className="text-2xl font-bold text-slate-800 mb-4 line-clamp-2 leading-snug group-hover:text-purple-600 transition-colors">
                    {post.title}
                  </h2>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name}`}
                        className="w-10 h-10 rounded-full border-2 border-white ring-1 ring-slate-100"
                        alt="author"
                      />
                      <span className="text-sm font-semibold text-slate-700">{post.author?.name}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <HiOutlineArrowRight />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;