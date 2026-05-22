import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HiOutlineThumbUp,
  HiThumbUp,
  HiOutlineClock,
  HiOutlineShare,
  HiOutlineBookmark,
  HiArrowLeft,
  HiLink,
  HiCheck,
} from 'react-icons/hi';
// Importing specific brand icons for professional look
import { FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import CommentSection from '../components/CommentSection';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.root.user);

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Share Menu UI States
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useRef(null);

  useEffect(() => {
    const fetchPostAndRelated = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/post/getpost/${slug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        if (data.success) {
          setPost(data.post);
          const relatedRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/post/related?category=${data.post.category}&currentPostId=${data.post._id}`
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

  // Close share menu if clicking anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLike = async () => {
    if (!currentUser) return navigate('/sign-in');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/post/likePost/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setPost((prev) => ({ ...prev, likes: data.likes }));
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  // Smart Social Sharing Framework
  const handleShareShareAction = async () => {
    const currentUrl = window.location.href;
    const shareTitle = post?.title || 'Check out this awesome post!';

    // 1. If user is on a Mobile device supporting native app triggers
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: currentUrl,
        });
      } catch (err) {
        console.log('Native share canceled or failed', err);
      }
    } else {
      // 2. Desktop Fallback UI: Toggle Custom Dropdown Menu
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading article…</p>
        </div>
      </div>
    );

  if (error || !post)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 px-6 bg-white">
        <p className="text-7xl font-black text-slate-200 tracking-tighter">404</p>
        <h1 className="text-xl font-bold text-slate-800">Post not found</h1>
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 hover:bg-violet-600 hover:text-white px-5 py-3 rounded-xl transition-all"
        >
          <HiArrowLeft /> Back to home
        </Link>
      </div>
    );

  const isLiked = post.likes.includes(currentUser?._id);
  const encodedUrl = encodeURIComponent(window.location.href);
  const encodedTitle = encodeURIComponent(post.title);

  return (
    <main className="min-h-screen bg-white selection:bg-violet-100 selection:text-violet-900">

      {/* ── TOP NAV STRIP ── */}
      <div className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
          >
            <HiArrowLeft size={16} />
            Back
          </button>

          <span className="text-[10px] font-black tracking-widest uppercase text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full border border-violet-100/60">
            {post.category}
          </span>

          {/* Share Action Trigger Wrapper Component */}
          <div className="relative" ref={shareMenuRef}>
            <button
              onClick={handleShareShareAction}
              className={`p-2 rounded-xl border border-transparent transition-all text-slate-400 hover:text-slate-800 ${showShareMenu ? 'bg-slate-100 border-slate-200 text-slate-800' : 'hover:bg-slate-50'}`}
            >
              <HiOutlineShare size={18} />
            </button>

            {/* Desktop Fallback Menu Dropdown Box */}
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Share Story</p>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <FaTwitter className="text-sky-500" /> Twitter / X
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <FaFacebookF className="text-blue-600" /> Facebook
                </a>

                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <FaLinkedinIn className="text-blue-700" /> LinkedIn
                </a>

                <div className="h-px bg-slate-100 my-1" />

                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors text-left"
                >
                  {copied ? (
                    <>
                      <HiCheck className="text-green-500" size={16} />
                      <span className="text-green-600 font-medium">Copied Link!</span>
                    </>
                  ) : (
                    <>
                      <HiLink className="text-slate-400" size={16} />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT BLOCK ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">

        {/* ── TITLE & HEADER SECTION ── */}
        <div className="pt-12 pb-8 md:pt-16 md:pb-12 border-b border-slate-100 mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-[2.6rem] font-black text-slate-900 leading-[1.2] tracking-tight mb-8">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
            <div className="flex items-center gap-3.5">
              <img
                src={
                  post.author?.avatar ||
                  `https://ui-avatars.com/api/?name=${post.author?.name}&background=ede9fe&color=7c3aed`
                }
                className="w-12 h-12 rounded-full ring-4 ring-white shadow-sm object-cover"
                alt="author"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">{post.author?.name}</p>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1 font-medium">
                  <HiOutlineClock className="shrink-0" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </span>
                </div>
              </div>
            </div>
            <button className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 transition-all self-start sm:self-auto shadow-sm">
              <HiOutlineBookmark size={15} className="text-slate-400" />
              Save Article
            </button>
          </div>
        </div>

        {/* ── FEATURED IMAGE ── */}
        <div className="mb-12 overflow-hidden rounded-2xl md:rounded-3xl shadow-md border border-slate-100">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-[240px] sm:h-[360px] md:h-[460px] object-cover"
          />
        </div>

        {/* ── ARTICLE TEXT LAYOUT ── */}
        <div className="w-full overflow-hidden">
          <article
            className="prose prose-base sm:prose-lg max-w-none
              break-words whitespace-pre-wrap [word-break:break-word]
              prose-ul:list-disc prose-ul:ml-6 prose-ul:my-4
              prose-ol:list-decimal prose-ol:ml-6 prose-ol:my-4
              prose-li:text-slate-700 prose-li:my-1 prose-li:pl-1
              prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
              prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-violet-600 prose-a:font-semibold prose-a:underline-offset-4 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-img:shadow-md prose-img:my-8
              prose-blockquote:border-l-4 prose-blockquote:border-violet-600 prose-blockquote:bg-violet-50/40 prose-blockquote:px-6 prose-blockquote:py-1 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-700 prose-blockquote:font-medium prose-blockquote:not-italic
              prose-strong:text-slate-900 prose-strong:font-bold
              prose-code:text-violet-600 prose-code:bg-slate-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-code:break-all"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* ── INTERACTION FOOTER ── */}
        <div className="mt-16 flex items-center gap-6 py-6 border-y border-slate-100">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 ${isLiked
              ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-violet-100'
              : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
          >
            {isLiked ? <HiThumbUp size={16} /> : <HiOutlineThumbUp size={16} />}
            {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
          </button>

          {/* Quick Share Action Shortcut inside the Content Base */}
          <button
            onClick={handleShareShareAction}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors ml-auto"
          >
            <HiOutlineShare size={18} className="text-slate-300" />
            Share Article
          </button>
        </div>

        {/* ── COMMENTS SECTION ── */}
        <div className="mt-14 mb-20">
          <CommentSection postId={post._id} />
        </div>

        {/* ── RELATED POSTS SECTION ── */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-slate-100 pt-16 mb-16">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 bg-slate-50 w-fit px-3 py-1 rounded">
              Related Stories
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost._id}
                  to={`/post/${rPost.slug}`}
                  className="group block"
                >
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm mb-4">
                    <img
                      src={rPost.featuredImage}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      alt={rPost.title}
                    />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-violet-600 transition-colors mb-2">
                    {rPost.title}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-400">
                    {new Date(rPost.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── BOTTOM CTA ── */}
        <div className="mb-24 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div>
            <h4 className="font-black text-slate-900 text-base mb-1.5">Share your narrative</h4>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
              Join our engineering and development ecosystem to publish your custom insights with technical readers worldwide.
            </p>
          </div>
          <Link
            to="/create-post"
            className="shrink-0 px-6 py-3.5 bg-violet-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-violet-700 shadow-md shadow-violet-100 active:scale-95 transition-all whitespace-nowrap text-center"
          >
            Start Writing
          </Link>
        </div>

      </div>
    </main>
  );
};

export default PostDetail;