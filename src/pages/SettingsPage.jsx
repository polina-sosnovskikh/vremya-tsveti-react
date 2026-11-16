import { useState, useEffect } from 'react';
import Modal from '../components/common/Modal.jsx'; // <-- Импортируем нашу универсальную модалку

function SettingsModal({ isOpen, type, title, message, placeholder, defaultValue, onConfirm, onCancel }) {
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultValue || '');
      setHasError(false);
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (type === 'prompt' && !inputValue.trim()) {
      setHasError(true);
      setTimeout(() => setHasError(false), 1500);
      return;
    }
    onConfirm(type === 'prompt' ? inputValue.trim() : true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} className="settings-modal-overlay">
      <div className="settings-modal">
        <button className="settings-modal__close" onClick={onCancel} type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h3 className="settings-modal__title">{title}</h3>
        {message && <p className="settings-modal__message">{message}</p>}
        
        {type === 'prompt' && (
          <input 
            type="text" 
            className={`settings-modal__input ${hasError ? 'settings-modal__input--error' : ''}`}
            placeholder={placeholder}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleConfirm()}
          />
        )}

        <div className="settings-modal__buttons">
          {type !== 'alert' && (
            <button className="settings-modal__btn settings-modal__btn--cancel" onClick={onCancel}>
              Отмена
            </button>
          )}
          <button className="settings-modal__btn settings-modal__btn--confirm" onClick={handleConfirm}>
            {type === 'prompt' ? 'Сохранить' : type === 'confirm' ? 'Да' : 'Понятно'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function SettingsPage() {
  const [userName, setUserName] = useState('Полина');
  const [allergens, setAllergens] = useState([]);
  
  const [toggles, setToggles] = useState({ push: true, email: false, sound: true });
  const [surveyRating, setSurveyRating] = useState(null);
  const [surveyChecked, setSurveyChecked] = useState([]);

  const [modal, setModal] = useState({ isOpen: false, type: 'alert', title: '', message: '', placeholder: '', defaultValue: '', action: null });

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) setUserName(savedName);

    const savedAllergens = localStorage.getItem('vremya_tsveti_allergens');
    if (savedAllergens) {
      setAllergens(JSON.parse(savedAllergens));
    } else {
      setAllergens(['Берёза', 'Пыльца злаковых трав', 'Клещи домашней пыли']);
    }
  }, []);

  const saveAllergens = (newAllergens) => {
    setAllergens(newAllergens);
    localStorage.setItem('vremya_tsveti_allergens', JSON.stringify(newAllergens));
  };

  const openEditProfile = () => {
    setModal({
      isOpen: true, type: 'prompt', title: 'Редактировать профиль', message: 'Введите новое имя:', placeholder: 'Ваше имя', defaultValue: userName,
      action: (newName) => {
        setUserName(newName);
        localStorage.setItem('user_name', newName);
        setModal({ isOpen: false });
      }
    });
  };

  const openAddAllergen = () => {
    setModal({
      isOpen: true, type: 'prompt', title: 'Добавить аллерген', message: 'Введите название аллергена:', placeholder: 'Например: Амброзия',
      action: (name) => {
        if (name && !allergens.includes(name)) saveAllergens([...allergens, name]);
        setModal({ isOpen: false });
      }
    });
  };

  const confirmRemoveAllergen = (name) => {
    setModal({
      isOpen: true, type: 'confirm', title: 'Удалить аллерген', message: `Вы уверены, что хотите удалить "${name}"?`,
      action: () => {
        saveAllergens(allergens.filter(a => a !== name));
        setModal({ isOpen: false });
      }
    });
  };

  const submitSurvey = () => {
    if (!surveyRating) {
      setModal({ isOpen: true, type: 'alert', title: 'Оценка не выбрана', message: 'Пожалуйста, оцените приложение по шкале от 1 до 5.' });
      return;
    }
    localStorage.setItem('vremya_tsveti_survey', JSON.stringify({ rating: surveyRating, checked: surveyChecked }));
    setModal({ isOpen: true, type: 'alert', title: 'Спасибо!', message: 'Ваш отзыв очень важен для нас.' });
  };

  return (
    <div className="main">
      <div className="page-title">
        <div className="page-title__inner">
          <h1 className="page-title__text">Настройки</h1>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-profile">
          <div className="profile">
            <div className="profile__avatar-wrap">
              <div className="profile__avatar" style={{ backgroundColor: 'var(--мятный)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: '#fff' }}>
                {userName.charAt(0)}
              </div>
              <button className="profile__edit-btn" onClick={openEditProfile} type="button">
                <svg className="profile__edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
            <h2 className="profile__name">{userName}</h2>
            <div className="profile__since">В приложении с мая 2024</div>
          </div>

          <div className="allergens">
            <h3 className="allergens__title">Мои аллергены</h3>
            <span className="allergens__count">{allergens.length} аллергена</span>
            <div className="allergens__list">
              {allergens.map(allergen => (
                <div className="allergen-tag" key={allergen}>
                  <span className="allergen-tag__text">{allergen}</span>
                  <button className="allergen-tag__remove" onClick={() => confirmRemoveAllergen(allergen)} type="button">×</button>
                </div>
              ))}
              <button className="allergen-tag allergen-tag--add" onClick={openAddAllergen} type="button">
                + Добавить
              </button>
            </div>
          </div>
          
          <button className="logout-btn" type="button" onClick={() => setModal({ isOpen: true, type: 'confirm', title: 'Выход', message: 'Вы уверены, что хотите выйти?', action: () => setModal({ isOpen: false }) })}>
            <svg className="logout-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span className="logout-btn__text">Выйти из аккаунта</span>
          </button>
        </div>

        <div className="settings-interact">
          <div className="settings-menu">
            <h2 className="settings-menu__title">Основные</h2>
            <ul className="settings-menu__list">
              <li className="settings-menu__item">
                <div className="settings-menu__icon-wrap settings-menu__icon-wrap--bell">🔔</div>
                <span className="settings-menu__label">Push-уведомления</span>
                <label className="toggle">
                  <input type="checkbox" className="toggle__input" checked={toggles.push} onChange={(e) => setToggles({...toggles, push: e.target.checked})} />
                  <span className="toggle__slider"></span>
                </label>
              </li>
              <li className="settings-menu__item">
                <div className="settings-menu__icon-wrap settings-menu__icon-wrap--bell">✉️</div>
                <span className="settings-menu__label">Email-рассылка</span>
                <label className="toggle">
                  <input type="checkbox" className="toggle__input" checked={toggles.email} onChange={(e) => setToggles({...toggles, email: e.target.checked})} />
                  <span className="toggle__slider"></span>
                </label>
              </li>
              <li className="settings-menu__item">
                <div className="settings-menu__icon-wrap settings-menu__icon-wrap--language">🌐</div>
                <span className="settings-menu__label">Язык приложения</span>
                <span className="settings-menu__value">Русский</span>
              </li>
              <li className="settings-menu__item">
                <div className="settings-menu__icon-wrap settings-menu__icon-wrap--lock">🔒</div>
                <span className="settings-menu__label">Конфиденциальность</span>
                <button className="settings-menu__arrow-btn">➔</button>
              </li>
            </ul>
          </div>

          <div className="contact-support">
            <h2 className="contact-support__title">Поддержка</h2>
            <p className="contact-support__subtitle">Если у вас возникли вопросы или проблемы, напишите нам.</p>
            <div className="contact-support__form">
              <label className="contact-support__label">Сообщение</label>
              <div className="contact-support__input-wrap">
                <input type="text" className="contact-support__input" placeholder="Опишите вашу проблему..." />
              </div>
            </div>
            <ul className="contact-support__list">
              <li className="contact-support__item">
                <div className="contact-support__item-icon-wrap contact-support__item-icon-wrap--tg">✈️</div>
                <div className="contact-support__item-content">
                  <div className="contact-support__item-title">Telegram</div>
                  <div className="contact-support__item-value">@vremya_tsveti_support</div>
                </div>
              </li>
              <li className="contact-support__item">
                <div className="contact-support__item-icon-wrap contact-support__item-icon-wrap--phone">📞</div>
                <div className="contact-support__item-content">
                  <div className="contact-support__item-title">Телефон</div>
                  <div className="contact-support__item-value">8 (800) 555-35-35</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="survey">
            <h2 className="survey__title">Оцените приложение</h2>
            <div className="survey__question">
              <div className="survey__question-text">Насколько вероятно, что вы порекомендуете нас друзьям?</div>
              <div className="survey__question-subtext">1 — точно нет, 5 — обязательно порекомендую</div>
              <div className="survey__rating-wrapper">
                <div className="survey__rating">
                  {[1, 2, 3, 4, 5].map(num => {
                    let activeClass = '';
                    if (surveyRating === num) {
                      if (num <= 2) activeClass = 'survey__rating-btn--mint';
                      else if (num === 3) activeClass = 'survey__rating-btn--yellow';
                      else activeClass = 'survey__rating-btn--red';
                    }
                    return (
                      <button 
                        key={num} 
                        type="button" 
                        className={`survey__rating-btn ${surveyRating === num ? `survey__rating-btn--active ${activeClass}` : ''}`}
                        onClick={() => setSurveyRating(num)}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
                <div className="survey__rating-labels">
                  <span className="survey__rating-label">Точно нет</span>
                  <span className="survey__rating-label">Обязательно</span>
                </div>
              </div>

              <div className="survey__question-text">Что вам больше всего нравится?</div>
              <div className="survey__checkboxes">
                {['Дизайн', 'Удобство', 'Точность прогноза', 'Сообщество'].map(item => (
                  <label className="survey__checkbox" key={item}>
                    <input 
                      type="checkbox" 
                      className="survey__checkbox-input" 
                      checked={surveyChecked.includes(item)}
                      onChange={(e) => {
                        if (e.target.checked) setSurveyChecked([...surveyChecked, item]);
                        else setSurveyChecked(surveyChecked.filter(i => i !== item));
                      }}
                    />
                    <span className="survey__checkbox-text">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            <button className="survey__submit-btn" onClick={submitSurvey} type="button">Отправить отзыв</button>
          </div>
          
          <div className="settings-mascot">
            <div style={{ fontSize: '80px' }}>🌸</div>
          </div>
        </div>
      </div>

      <SettingsModal 
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        placeholder={modal.placeholder}
        defaultValue={modal.defaultValue}
        onConfirm={(val) => modal.action && modal.action(val)}
        onCancel={() => setModal({ isOpen: false })}
      />
    </div>
  );
}