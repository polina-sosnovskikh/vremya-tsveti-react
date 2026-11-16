import { useState } from 'react';
import Modal from '../components/common/Modal.jsx';

const forecastData = {
  personalIndex: 7.8,
  mainFactor: 'Берёза',
  weather: {
    temperature: '+21°C',
    condition: 'сухо',
    wind: 'Ветер западный, 6 м/с (разносит пыльцу)',
  },
  allergens: [
    { name: 'Берёза', level: 'peak', label: 'Пик' },
    { name: 'Злаки', level: 'mid', label: 'Средне' },
  ],
  community: [
    'Ваш последний симптом: легкое першение (вчера в 21:00)',
    '72% пользователей в вашем районе отмечают зуд и заложенность носа сегодня.',
  ],
  expertAdvice: [
    'Воздержитесь от утренних прогулок с 6:00 до 11:00.',
    'Держите окна закрытыми, используйте кондиционер с HEPA-фильтром.',
    'Примите назначенное антигистаминное средство в 9:00.',
  ],
};

export default function ForecastPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date();
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const dateString = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 0' }}>
      
      <div className="forecast-intro">
        <div className="forecast-intro__content">
          <div className="forecast-intro__subtitle">Прогноз аллергической активности</div>
        </div>
        <div className="forecast-intro__details">
          <div className="forecast-intro__date">{dateString}</div>
          <div className="forecast-intro__text">Персональный прогноз на основе ваших данных и погоды.</div>
        </div>
      </div>

      <div className="personal-index">
        <div className="personal-index__header">
          <div className="personal-index__info">
            <h1 className="personal-index__title">Ваш индекс риска</h1>
            <div className="personal-index__score">
              <span className="personal-index__score-value">{forecastData.personalIndex}</span>
              <span className="personal-index__score-max">/ 10</span>
            </div>
          </div>
          
          <div className="personal-index__tooltip-wrap">
            <button className="personal-index__info-btn" type="button">
              <svg className="personal-index__info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
            <div className="personal-index__tooltip">
              <p className="personal-index__tooltip-text">
                Индекс рассчитывается на основе ваших симптомов, лекарств и уровня пыльцы в воздухе.
              </p>
            </div>
          </div>
        </div>

        <div className="personal-index__factor">
          <h3 className="personal-index__factor-title">Главный фактор</h3>
          <p className="personal-index__factor-text">
            Рассчитано на основе вашей чувствительности к {forecastData.mainFactor.toLowerCase()} и текущей розы ветров.
          </p>
        </div>
      </div>

      <div className="risk-factors">
        <h2 className="risk-factors__title">Факторы риска</h2>
        <div className="risk-factors__grid">
          
          <div className="risk-card">
            <h3 className="risk-card__title">Погода</h3>
            <div className="risk-card__content">
              <p className="risk-card__text">
                {forecastData.weather.temperature}, {forecastData.weather.condition}<br/>
                {forecastData.weather.wind}
              </p>
            </div>
          </div>

          <div className="risk-card">
            <h3 className="risk-card__title">Аллергены</h3>
            <div className="risk-card__content">
              {forecastData.allergens.map((a, i) => (
                <div className="allergen" key={i}>
                  <span className="allergen__name">{a.name}</span>
                  <span className={`allergen__badge allergen__badge--${a.level}`}>{a.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="community">
        <h3 className="community__title">В вашем районе</h3>
        <div className="community__card">
          <div className="community__text-wrap">
            {forecastData.community.map((text, i) => (
              <p className={`community__text ${i === 1 ? 'community__text--highlight' : ''}`} key={i}>{text}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="expert">
        <h3 className="expert__title">Рекомендации</h3>
        <ul className="expert__list">
          {forecastData.expertAdvice.map((text, i) => (
            <li className="expert__item" key={i}>
              <span className="expert__text">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="report">
        <h3 className="report__title">Статистика</h3>
        <button className="report__card" onClick={() => setIsModalOpen(true)} type="button" style={{cursor: 'pointer', border: 'none'}}>
          <span className="report__text">Посмотреть отчёт с прогнозом</span>
        </button>
      </div>

      {/* ИСПОЛЬЗУЕМ НОВУЮ МОДАЛКУ */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="modal report-modal">
          <button className="modal__close" onClick={() => setIsModalOpen(false)}>✕</button>
          <div className="modal__body modal__body--centered">
            <div className="report-modal__icon">📊</div>
            <h3 className="modal__title modal__title--centered">Отчёт в разработке</h3>
            <p className="modal__text">Приносим свои извинения — функция скачивания отчёта скоро будет доступна.</p>
          </div>
          <div className="modal__footer modal__footer--centered">
            <button className="modal__btn modal__btn--submit" onClick={() => setIsModalOpen(false)}>Понятно</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}