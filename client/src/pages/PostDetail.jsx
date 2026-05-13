// Ensure you import the quill CSS here too!
import 'react-quill/dist/quill.snow.css';

const PostDetail = ({ post }) => {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-5xl font-bold mb-5">{post.title}</h1>
      <img src={post.image} className="w-full rounded-3xl mb-10" />

      {/* This 'ql-editor' class is the magic that shows bullet points! */}
      <div
        className="ql-editor prose lg:prose-xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};