import { useState, useEffect } from 'react';
import Post from '../components/community/Post.jsx';
import Modal from '../components/common/Modal.jsx'; // Импорт модалки

const POSTS_STORAGE_KEY = 'vremya_tsveti_community_posts';

const defaultPosts = [
  {
    id: 'static-1',
    author: 'Анна',
    avatarClass: 'post__avatar--a',
    initial: 'А',
    text: 'Сегодня берёза просто зверствует. Выпила зиртек, сижу дома, пью чай с мятой. Всем аллергикам сил! 🌿',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    likes: 12,
    liked: false
  },
  {
    id: 'static-2',
    author: 'Михаил',
    avatarClass: 'post__avatar--m',
    initial: 'М',
    text: 'Кто-нибудь пробовал промывать нос морской водой? Говорят, хорошо помогает от заложенности в сезон пыления.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    likes: 5,
    liked: true
  }
];

const articlesData = [
  { id: 1, tag: 'Аллергия', title: 'Как пережить сезон цветения: 5 главных правил' },
  { id: 2, tag: 'Здоровье', title: 'Какие антигистаминные выбрать и как их пить' },
  { id: 3, tag: 'Лайфхаки', title: 'Очистители воздуха: помогают ли они от пыльцы?' }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [filterType, setFilterType] = useState('all');
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilter, setTempFilter] = useState('all');
  
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(POSTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Ошибка загрузки постов:', e);
    }
    setPosts(defaultPosts);
  }, []);

  const savePosts = (newPosts) => {
    setPosts(newPosts);
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(newPosts));
  };

  const handleLike = (postId) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, liked: !p.liked, likes: p.liked ? Math.max(0, p.likes - 1) : p.likes + 1 };
      }
      return p;
    });
    savePosts(updated);
  };

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    const newPost = {
      id: 'post-' + Date.now(),
      author: 'Вы',
      avatarClass: 'post__avatar--a',
      initial: 'В',
      text: newPostText.trim(),
      timestamp: Date.now(),
      likes: 0,
      liked: false
    };
    savePosts([newPost, ...posts]);
    setIsPostModalOpen(false);
    setNewPostText('');
  };

  const getFilteredPosts = () => {
    const now = Date.now();
    const MS_IN_DAY = 24 * 60 * 60 * 1000;
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayTs = todayStart.getTime();
    
    let filtered = [...posts];
    if (filterType === 'today') filtered = posts.filter(p => p.timestamp >= todayTs);
    if (filterType === 'yesterday') filtered = posts.filter(p => p.timestamp >= (todayTs - MS_IN_DAY) && p.timestamp < todayTs);
    if (filterType === 'week') filtered = posts.filter(p => p.timestamp >= (now - 7 * MS_IN_DAY));
    if (filterType === 'month') filtered = posts.filter(p => p.timestamp >= (now - 30 * MS_IN_DAY));

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  };

  const searchedPosts = getFilteredPosts().filter(p => 
    p.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="page-header">
        <div className="page-header__inner">
          <h1 className="page-header__title">Сообщество</h1>
          <div className="page-header__actions">
            <button className="page-header__btn" aria-label="Поиск" onClick={() => setIsSearchOpen(true)}>
              <svg className="page-header__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button className="page-header__btn" aria-label="Фильтры" onClick={() => { setTempFilter(filterType); setIsFilterOpen(true); }}>
              <svg className="page-header__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="main" style={{ paddingTop: 0 }}>
        <div className="articles">
          <div className="articles__header">
            <h2 className="articles__title">Полезные статьи</h2>
            <a href="#" className="articles__all-link" onClick={(e) => e.preventDefault()}>Смотреть все</a>
          </div>
          <div className="articles__list">
            {articlesData.map((article) => (
              <a href="#" className="article-card" key={article.id} onClick={(e) => e.preventDefault()}>
                <div className="article-card__image-wrap">
                  <div style={{ fontSize: '40px', opacity: 0.5 }}>🌿</div>
                </div>
                <div className="article-card__content">
                  <span className="article-card__tag">{article.tag}</span>
                  <h3 className="article-card__title">{article.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="feed">
          <h2 className="feed__title">Лента сообщества</h2>
          <div className="feed__list">
            {searchedPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--серый-темнее)' }}>
                {searchQuery ? 'Ничего не найдено по вашему запросу' : 'Пока нет постов'}
              </div>
            ) : (
              searchedPosts.map(post => (
                <Post 
                  key={post.id} 
                  post={post} 
                  onLike={() => handleLike(post.id)} 
                  onComment={() => setNotification({
                    title: 'Раздел в разработке',
                    text: 'Приносим свои извинения — комментарии скоро будут доступны. Мы работаем над тем, чтобы вы могли отвечать на посты других пользователей и делиться опытом.'
                  })}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <button className="fab" onClick={() => setIsPostModalOpen(true)} aria-label="Создать пост">+</button>

      {/* --- МОДАЛКА: СОЗДАНИЕ ПОСТА --- */}
      <Modal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)}>
        <div className="modal">
          <button className="modal__close" onClick={() => setIsPostModalOpen(false)}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div className="modal__header">
            <h2 className="modal__title">Новый пост</h2>
            <p className="modal__subtitle">Расскажите о своём самочувствии или задайте вопрос</p>
          </div>
          <div className="modal__body">
            <textarea 
              className="modal__textarea" 
              placeholder="Как вы себя чувствуете сегодня?" 
              maxLength="500"
              value={newPostText}
              onChange={e => setNewPostText(e.target.value)}
            />
            <div className="modal__counter"><span>{newPostText.length}</span> / 500</div>
          </div>
          <div className="modal__footer">
            <button className="modal__btn modal__btn--cancel" onClick={() => setIsPostModalOpen(false)}>Отмена</button>
            <button className="modal__btn modal__btn--submit" disabled={!newPostText.trim()} onClick={handleCreatePost}>Опубликовать</button>
          </div>
        </div>
      </Modal>

      {/* --- МОДАЛКА: ПОИСК --- */}
      <Modal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} className="community-search-overlay">
        <div className="community-search-modal">
          <button className="community-search-modal__close" onClick={() => setIsSearchOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <h3 className="community-search-modal__title">Поиск по постам</h3>
          <input 
            type="text" 
            className="community-search-modal__input" 
            placeholder="Введите слова для поиска..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className="community-search-modal__results">
            {searchQuery && searchedPosts.length === 0 && (
              <p className="community-search-modal__empty">Ничего не найдено</p>
            )}
          </div>
        </div>
      </Modal>

      {/* --- МОДАЛКА: ФИЛЬТРЫ --- */}
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} className="community-filter-overlay">
        <div className="community-filter-modal">
          <button className="community-filter-modal__close" onClick={() => setIsFilterOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <h3 className="community-filter-modal__title">Фильтр по дате</h3>
          <div className="community-filter-chips">
            {[
              { id: 'all', label: 'Все' },
              { id: 'today', label: 'Сегодня' },
              { id: 'yesterday', label: 'Вчера' },
              { id: 'week', label: 'За неделю' },
              { id: 'month', label: 'За месяц' }
            ].map(f => (
              <button 
                key={f.id}
                className={`community-filter-chip ${tempFilter === f.id ? 'community-filter-chip--active' : ''}`}
                onClick={() => setTempFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="community-filter-modal__actions">
            <button className="community-filter-btn community-filter-btn--reset" onClick={() => { setFilterType('all'); setIsFilterOpen(false); }}>Сбросить</button>
            <button className="community-filter-btn community-filter-btn--apply" onClick={() => { setFilterType(tempFilter); setIsFilterOpen(false); }}>Применить</button>
          </div>
        </div>
      </Modal>

      {/* --- МОДАЛКА: УВЕДОМЛЕНИЕ --- */}
      <Modal isOpen={!!notification} onClose={() => setNotification(null)}>
        <div className="modal modal--notification">
          <button className="modal__close" onClick={() => setNotification(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div className="modal__body modal__body--centered">
            <div className="notification-modal__icon">⚠</div>
            <h2 className="modal__title modal__title--centered">{notification?.title}</h2>
            <p className="modal__text">{notification?.text}</p>
          </div>
          <div className="modal__footer modal__footer--centered">
            <button className="modal__btn modal__btn--submit" onClick={() => setNotification(null)}>Понятно</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}