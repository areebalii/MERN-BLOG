import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineClock, HiOutlineBookOpen } from 'react-icons/hi';

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/post/all-posts`);
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
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-purple-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  // Isolate the latest story to serve as a stunning header banner on desktop viewports
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#fafbfe]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 space-y-12 animate-in fade-in duration-500">

        {/* Dynamic Header Module */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-6 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg">
              The Feed
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mt-3">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Stories</span>
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm md:text-base font-medium">Explore the latest insights from our community creation network.</p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 md:p-20 text-center shadow-sm border border-slate-100 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              <HiOutlineBookOpen />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No stories shared yet</h3>
            <p className="text-slate-400 mt-1 text-sm">Be the pioneer who sets the spark for this dynamic channel workspace layers.</p>
            <Link to="/create-post" className="mt-6 inline-flex items-center justify-center bg-purple-600 text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all active:scale-95">
              Start Writing <HiOutlineArrowRight className="ml-2 text-sm" />
            </Link>
          </div>
        ) : (
          <div className="space-y-12">

            {/* 🌟 HERO FEATURED POST: Eye-Catching Banner (Desktop/Tablet Exclusive Highlight Layout) */}
            {featuredPost && (
              <Link
                to={`/post/${featuredPost.slug}`}
                className="group hidden md:grid grid-cols-12 bg-white rounded-[2.5rem] p-5 border border-slate-100 hover:border-purple-100/70 hover:shadow-[0_24px_60px_rgba(147,51,234,0.06)] transition-all duration-500"
              >
                <div className="col-span-7 aspect-[16/10] overflow-hidden rounded-[2rem] relative">
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent" />
                  <span className="absolute top-5 left-5 bg-white/95 backdrop-blur-md text-purple-600 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm border border-purple-50">
                    🔥 Featured • {featuredPost.category}
                  </span>
                </div>

                <div className="col-span-5 p-6 lg:p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      <HiOutlineClock className="text-sm text-purple-500" />
                      {new Date(featuredPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight group-hover:text-purple-600 transition-colors line-clamp-3 leading-tight">
                      {featuredPost.title}
                    </h2>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredPost.author?.avatar || `https://ui-avatars.com/api/?name=${featuredPost.author?.name}`}
                        className="w-10 h-10 rounded-xl object-cover border-2 border-slate-50 shadow-sm"
                        alt=""
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-700 leading-none">{featuredPost.author?.name || 'System User'}</span>
                          {featuredPost.author?.role === 'admin' && (
                            <span className="inline-flex items-center justify-center bg-purple-100 text-purple-600 rounded-full font-black text-[8px] w-3.5 h-3.5 border border-purple-200">✓</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">{featuredPost.author?.role || 'Author'}</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1">
                      <HiOutlineArrowRight className="text-lg" />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* 📱 REUSE GRID ARRAY LAYER: Handles standard mobile display loops smoothly */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Force loop array execution toggle to back-render hero on micro displays */}
              {(window.innerWidth < 768 ? posts : remainingPosts).map((post) => (
                <Link
                  key={post._id}
                  to={`/post/${post.slug}`}
                  className="group flex flex-col bg-white rounded-[2rem] p-3.5 border border-slate-100/80 hover:border-purple-100 hover:shadow-[0_20px_48px_rgba(147,51,234,0.05)] transition-all duration-500"
                >
                  {/* Image Container with Safe Adaptive Aspects */}
                  <div className="relative aspect-video sm:aspect-[16/11] overflow-hidden rounded-[1.5rem] bg-slate-50 shrink-0">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm border border-slate-100/50">
                      {post.category}
                    </span>
                  </div>

                  {/* Content Payload Block */}
                  <div className="px-1 pt-5 pb-2 flex flex-col flex-grow justify-between min-h-[180px]">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <HiOutlineClock className="text-xs text-purple-500" />
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h2 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 tracking-tight transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h2>
                    </div>

                    {/* Footer Author Profile Lockup */}
                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name}`}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-100 shrink-0"
                          alt=""
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-700 truncate leading-none">
                              {post.author?.name || 'System User'}
                            </span>
                            {post.author?.role === 'admin' && (
                              <span className="inline-flex items-center justify-center bg-purple-100 text-purple-600 rounded-full font-black text-[7px] w-3 h-3 shrink-0">✓</span>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">{post.author?.role || 'Author'}</p>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shrink-0 transform group-hover:translate-x-0.5">
                        <HiOutlineArrowRight className="text-sm" />
                      </div>
                    </div>

                  </div>
                </Link>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Index;