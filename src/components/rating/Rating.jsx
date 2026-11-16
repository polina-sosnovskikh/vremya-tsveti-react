import { useState, useEffect } from 'react';
import { useViewDate } from '../../hooks/useViewDate.jsx';
import { getTodayString, getDayData, saveDayData } from '../../utils/storage.js';

import greenImg from '../../assets/good_green_main.png';
import yellowImg from '../../assets/med_yellow_main.png';
import redImg from '../../assets/bad_red_main.png';

const mascotImages = { green: greenImg, yellow: yellowImg, red: redImg };

export default function Rating() {
  const { viewDate } = useViewDate();
  const [selectedRating, setSelectedRating] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const isToday = viewDate === getTodayString();
  const dayData = getDayData(viewDate);

  useEffect(() => {
    if (dayData && typeof dayData.rating === 'number' && dayData.rating >= 1 && dayData.rating <= 5) {
      setSelectedRating(dayData.rating);
    } else {
      setSelectedRating(null);
    }
  }, [viewDate, dayData.rating]);

  const handleSave = () => {
    if (!isToday) return;
    if (!selectedRating) {
      alert('Пожалуйста, выберите оценку от 1 до 5');
      return;
    }
    saveDayData(getTodayString(), { rating: selectedRating });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const getMascotSrc = () => {
    if (!selectedRating) return mascotImages.green;
    if (selectedRating <= 2) return mascotImages.green;
    if (selectedRating === 3) return mascotImages.yellow;
    return mascotImages.red;
  };

  return (
    <div className="rating-section-main">
      <div className="rating-section-main__header">
        <h2 className="rating-section-main__title">Оцените самочувствие</h2>
      </div>
      <div className="rating-section-main__content">
        <div className="rating-scale">
          <div className="rating-labels">
            <span>Отлично</span>
            <span>Плохо</span>
          </div>
          <div className="rating-buttons" id="rating-buttons" style={{ pointerEvents: isToday ? 'auto' : 'none', opacity: isToday ? 1 : 0.5 }}>
            {[1, 2, 3, 4, 5].map(v => {
              let colorClass = '';
              if (selectedRating === v) {
                if (v <= 2) colorClass = 'rating-btn--green';
                else if (v === 3) colorClass = 'rating-btn--yellow';
                else colorClass = 'rating-btn--red';
              }
              return (
                <button
                  key={v}
                  type="button"
                  className={`rating-btn ${selectedRating === v ? `rating-btn--active ${colorClass}` : ''}`}
                  onClick={() => isToday && setSelectedRating(v)}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>

        <img className="rating-mascot" src={getMascotSrc()} alt="Маскот" />
        
        <button 
          className="rating-submit" 
          id="rating-submit" 
          onClick={handleSave}
          disabled={!isToday}
          style={!isToday ? { backgroundColor: '#f0f0f0', color: '#888', cursor: 'default', fontSize: '0.85rem', whiteSpace: 'normal', lineHeight: '1.3', height: 'auto', padding: '12px 16px' } : {}}
        >
          {!isToday ? 'Оценивать самочувствие нужно день в день' : isSaved ? 'Спасибо за оценку!' : 'Готово'}
        </button>
      </div>
    </div>
  );
}