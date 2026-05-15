import  { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiOutlineThumbUp, HiThumbUp, HiOutlineChatAlt2, HiOutlineClock, HiOutlineShare } from 'react-icons/hi';
import CommentSection from '../components/CommentSection';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.root.user);

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPostAndRelated = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/post/getpost/${slug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        if (data.success) {
          setPost(data.post);
          // Fetch related posts based on category
          const relatedRes = await fetch(
            `http://localhost:3000/api/post/related?category=${data.post.category}&currentPostId=${data.post._id}`
          );
          const relatedData = await relatedRes.json();
          if (relatedData.success) {
            setRelatedPosts(relatedData.relatedPosts);
          }
          setError(false);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPostAndRelated();
  }, [slug]);

  const handleLike = async () => {
    if (!currentUser) return navigate('/sign-in');
    try {
      const res = await fetch(`http://localhost:3000/api/post/likePost/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setPost((prev) => ({ ...prev, likes: data.likes })); // 👈 functional update
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>
  );

  if (error || !post) return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-bold text-slate-800">Post not found!</h1>
      <Link to="/" className="text-purple-600 hover:underline mt-4 inline-block">Back to home</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#fafafa] pb-20">
      {/* Progress Bar or Breadcrumb could go here */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT SIDE: MAIN ARTICLE */}
          <div className="lg:col-span-8">
            {/* Header Info */}
            <div className="mb-8">
              <span className="bg-purple-100 text-purple-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                {post.title}
              </h1>

              <div className="flex items-center justify-between py-6 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name}`}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    alt="author"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{post.author?.name}</p>
                    <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                      <HiOutlineClock />
                      <span>{new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                  <HiOutlineShare size={20} />
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative group mb-10">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-[300px] md:h-[500px] object-cover rounded-[2.5rem] shadow-xl"
              />
            </div>

            {/* Content Body - Using Tailwind Prose for clean typography */}
            <div
              className="prose prose-lg md:prose-xl max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-img:rounded-3xl prose-a:text-purple-600"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Interaction Bar (Likes) */}
            <div className="mt-16 mb-10 p-8 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-8">
                <button
                  onClick={handleLike}
                  className="group flex items-center gap-3 transition-all"
                >
                  <div className={`p-3 rounded-2xl transition-all ${post.likes.includes(currentUser?._id) ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                    {post.likes.includes(currentUser?._id) ? <HiThumbUp size={24} /> : <HiOutlineThumbUp size={24} />}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-bold text-slate-800">{post.likes.length}</span>
                    <span className="text-xs text-slate-400 font-medium">Likes</span>
                  </div>
                </button>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl">
                    <HiOutlineChatAlt2 size={24} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-bold text-slate-800">Comments</span>
                    <span className="text-xs text-slate-400 font-medium">Join the discussion</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment Section Component */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm">
              <CommentSection postId={post._id} />
            </div>
          </div>

          {/* RIGHT SIDE: SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">

              {/* Related Posts */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                  Related Stories
                </h3>
                <div className="space-y-6">
                  {relatedPosts.length > 0 ? (
                    relatedPosts.map((rPost) => (
                      <Link
                        key={rPost._id}
                        to={`/post/${rPost.slug}`}
                        className="group flex gap-4 items-center"
                      >
                        <div className="relative shrink-0 overflow-hidden rounded-2xl w-20 h-20">
                          <img
                            src={rPost.featuredImage}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            alt={rPost.title}
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">
                            {rPost.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
                            {new Date(rPost.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm italic">No related content available.</p>
                  )}
                </div>
              </div>

              {/* Promo Card */}
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-600 rounded-full blur-[80px] opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <h4 className="font-bold text-xl mb-3 relative z-10">Write your own story?</h4>
                <p className="text-slate-400 text-sm mb-6 relative z-10">Share your expertise with our growing community of developers.</p>
                <Link to="/create-post" className="block text-center py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-purple-50 transition-colors relative z-10">
                  Start Writing
                </Link>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
};

export default PostDetail;