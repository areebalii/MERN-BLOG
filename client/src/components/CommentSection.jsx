import { useState } from 'react';
import { useSelector } from 'react-redux';

const CommentSection = ({ postId }) => {
  const { user: currentUser } = useSelector((state) => state.root.user);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;
    // Inside CommentSection.jsx
    const res = await fetch('http://localhost:3000/api/comment/create', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: comment, postId, userId: currentUser._id }),
    });
    if (res.ok) {
      setComment('');
      const data = await res.json();
      setComments([data, ...comments]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <form onSubmit={handleSubmit} className="border border-purple-200 rounded-2xl p-4">
          <textarea
            placeholder="Add a comment..."
            rows="3"
            className="w-full outline-none text-sm"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">{200 - comment.length} characters remaining</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">Submit</button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-500">Please sign in to comment.</p>
      )}

      {/* List Comments Here using comments.map(...) */}
      <div className="space-y-4 mt-6">
        {comments.map((c) => (
          <div key={c._id} className="border border-purple-200 rounded-2xl p-4">
            <p className="text-sm text-gray-500">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;