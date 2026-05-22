import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { HiPencilAlt, HiTrash, HiChevronDown, HiChevronUp } from 'react-icons/hi';

const CommentSection = ({ postId }) => {
  const { user: currentUser } = useSelector((state) => state.root.user);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  // 1. Setup a Ref to track the top of the comment section
  const sectionTopRef = useRef(null);

  const INITIAL_LIMIT = 3;
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);

  // 2. Updated handleShowLess using the Ref
  const handleShowLess = () => {
    setDisplayLimit(INITIAL_LIMIT);
    if (sectionTopRef.current) {
      sectionTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200 || comment.trim() === '') return;
    try {
      const res = await fetch('http://localhost:3000/api/comment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: comment, postId, userId: currentUser._id }),
      });

      if (res.ok) {
        const data = await res.json();
        setComment('');
        const newCommentWithUser = {
          ...data,
          userId: {
            _id: currentUser._id,
            name: currentUser.name,
            avatar: currentUser.avatar
          }
        };
        setComments([newCommentWithUser, ...comments]);
      }
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comment/getPostComments/${postId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchComments();
  }, [postId]);

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setComments(comments.filter((c) => c._id !== commentId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveEdit = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/comment/editComment/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: editedContent }),
      });
      if (res.ok) {
        const data = await res.json();
        // Since backend uses populate, data will contain the userId object
        setComments(comments.map((c) => (c._id === commentId ? { ...c, content: data.content } : c)));
        setEditingCommentId(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    /* 3. Attach the ref here */
    <div ref={sectionTopRef} className="max-w-2xl mx-auto w-full p-3 scroll-mt-24">
      {currentUser ? (
        <form onSubmit={handleSubmit} className="border border-purple-100 bg-white rounded-2xl p-4 shadow-sm">
          <textarea
            placeholder="What are your thoughts?"
            rows="3"
            className="w-full outline-none text-sm resize-none"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50">
            <p className="text-gray-400 text-xs font-medium">{200 - comment.length} characters left</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-purple-200">
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-sm text-gray-500">Sign in to join the conversation.</p>
        </div>
      )}

      <div className="space-y-4 mt-8">
        {comments.slice(0, displayLimit).map((c) => (
          <div key={c._id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 transition-all hover:shadow-md">
            <img
              src={c.userId?.avatar || `https://ui-avatars.com/api/?name=${c.userId?.name}`}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              alt="avatar"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800">@{c.userId?.name || 'user'}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {currentUser && (currentUser._id === c.userId?._id || currentUser.role === 'admin') && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setEditingCommentId(c._id); setEditedContent(c.content); }}
                      className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <HiPencilAlt size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                )}
              </div>

              {editingCommentId === c._id ? (
                <div className="mt-2 animate-in fade-in zoom-in duration-200">
                  <textarea
                    className="w-full border border-purple-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-purple-100"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => setEditingCommentId(null)} className="text-xs font-bold text-gray-400 hover:text-gray-600 px-3 py-1 transition-colors">Cancel</button>
                    <button onClick={() => handleSaveEdit(c._id)} className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-black transition-colors">Update</button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed">{c.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Show Less Toggle Container */}
      <div className="flex flex-col gap-2 mt-6">
        {comments.length > displayLimit && (
          <button
            onClick={() => setDisplayLimit(prev => prev + 5)}
            className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-purple-600 hover:bg-purple-50 rounded-2xl border border-purple-100 transition-all active:scale-95"
          >
            <span>Show More Comments</span>
            <HiChevronDown size={18} />
          </button>
        )}

        {displayLimit > INITIAL_LIMIT && (
          <button
            onClick={handleShowLess}
            className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all active:scale-95"
          >
            <span>Show Less</span>
            <HiChevronUp size={18} />
          </button>
        )}
      </div>

      <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">
        Showing {Math.min(displayLimit, comments.length)} of {comments.length} comments
      </p>
    </div>
  );
};

export default CommentSection;