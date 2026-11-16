import { getRelativeTime } from '../../utils/time.js';
import likeOutline from '../../assets/like.png';
import likeFilled from '../../assets/like_checked.png';
import commentOutline from '../../assets/add_comment.png';

export default function Post({ post, onLike, onComment }) {
  const likeSrc = post.liked ? likeFilled : likeOutline;

  return (
    <article className="post" id={post.id}>
      <div className="post__header">
        <div className={`post__avatar ${post.avatarClass}`}>{post.initial}</div>
        <div className="post__meta">
          <div className="post__author">{post.author}</div>
          <div className="post__time">{getRelativeTime(post.timestamp)}</div>
        </div>
      </div>
      
      <div className="post__content">
        <p className="post__text">{post.text}</p>
      </div>
      
      <div className="post__actions">
        <button 
          className={`post__like-btn ${post.liked ? 'post__like-btn--active' : ''}`} 
          type="button" 
          aria-label="Нравится"
          onClick={() => onLike(post.id)}
        >
          <img className="post__like-icon" src={likeSrc} alt="like" width="20" height="20" />
          <span className="post__like-count">{post.likes || 0}</span>
        </button>
        
        <button 
          className="post__comment-btn" 
          type="button" 
          aria-label="Комментировать"
          onClick={onComment}
        >
          <img className="post__comment-icon" src={commentOutline} alt="comment" width="20" height="20" />
          <span className="post__comment-count">0 комментариев</span>
        </button>
      </div>
    </article>
  );
}