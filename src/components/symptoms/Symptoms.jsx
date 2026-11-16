import { useState, useEffect } from 'react';
import { useViewDate } from '../../hooks/useViewDate.jsx';
import { getDayData, saveDayData } from '../../utils/storage.js';
import { symptomsData, symptomIcons, symptomColors } from '../../data/symptoms.js'; // Создай этот файл из своего data.js

export default function Symptoms() {
  const { viewDate } = useViewDate();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    const data = getDayData(viewDate);
    setSelectedSymptoms(data.symptoms || []);
  }, [viewDate]);

  const toggleSymptom = (id) => {
    let newSymptoms;
    if (selectedSymptoms.includes(id)) {
      newSymptoms = selectedSymptoms.filter(s => s !== id);
    } else {
      newSymptoms = [...selectedSymptoms, id];
    }
    setSelectedSymptoms(newSymptoms);
    saveDayData(viewDate, { symptoms: newSymptoms });
  };

  return (
    <div className="dashboard-state">
      <div className="symptoms-section">
        <h2 className="symptoms-section__title">Симптомы</h2>
        <div className="symptoms-accordion">
          {symptomsData.map((category) => (
            <div className="symptom-category" key={category.category}>
              <button 
                className={`symptom-category__header ${openCategory === category.category ? 'symptom-category__header--active' : ''}`}
                onClick={() => setOpenCategory(openCategory === category.category ? null : category.category)}
              >
                <span className="symptom-category__arrow">{openCategory === category.category ? '▼' : '▶'}</span>
                <span className="symptom-category__name">{category.category}</span>
              </button>
              
              {openCategory === category.category && (
                <div className="symptom-category__items">
                  {category.items.map(item => (
                    <label className="symptom-item" key={item.id}>
                      <input 
                        type="checkbox" 
                        className="symptom-item__checkbox"
                        checked={selectedSymptoms.includes(item.id)}
                        onChange={() => toggleSymptom(item.id)}
                      />
                      <span className="symptom-item__name">{item.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="today-symptoms-main">
        <div className="today-symptoms-main__header">
          <h2 className="today-symptoms-main__title">Симптомы сегодня</h2>
        </div>
        <div className="today-symptoms-grid">
          {selectedSymptoms.length === 0 ? (
            <div className="today-symptoms-empty">Нет отмеченных симптомов</div>
          ) : (
            selectedSymptoms.map(id => {
              const category = symptomsData.find(c => c.items.some(i => i.id === id));
              const item = category?.items.find(i => i.id === id);
              const icon = symptomIcons[id] || '🤒';
              const color = symptomColors[category?.category] || 'var(--прозрачный-мятный)';
              
              return (
                <div className="symptom-card-main" key={id}>
                  <div className="symptom-card-main__icon" style={{ backgroundColor: color }}>{icon}</div>
                  <div className="symptom-card-main__content">
                    <span className="symptom-card-main__category">{category?.category}</span>
                    <span className="symptom-card-main__text">{item?.name}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}