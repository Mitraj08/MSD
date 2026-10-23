import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage, formatDate } from '../api.js';

export default function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPost(null);
    setError('');
    api
      .get(`/posts/${id}`)
      .then((res) => {
        setPost(res.data.post);
        setCanEdit(res.data.canEdit);
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  const remove = async () => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  if (error) {
    return (
      <div className="card narrow">
        <p className="notice error">{error}</p>
        <Link to="/">Back to all posts</Link>
      </div>
    );
  }
  if (!post) return <p className="empty">Loading post...</p>;

  return (
    <article className="card article">
      <p className="meta">
        <Link to="/">All posts</Link>
      </p>
      <h1>{post.title}</h1>
      <p className="meta">
        {post.author?.name || 'Unknown'} on {formatDate(post.createdAt)}
        {post.status === 'draft' && <span className="badge draft">Draft</span>}
      </p>
      <div className="body">{post.content}</div>
      {post.tags.length > 0 && (
        <div className="tags">
          {post.tags.map((t) => (
            <span key={t} className="tag static">
              {t}
            </span>
          ))}
        </div>
      )}
      {canEdit && (
        <div className="actions-row">
          <Link to={`/posts/${post._id}/edit`} className="btn">
            Edit post
          </Link>
          <button type="button" className="btn btn-danger" onClick={remove}>
            Delete post
          </button>
        </div>
      )}
    </article>
  );
}
