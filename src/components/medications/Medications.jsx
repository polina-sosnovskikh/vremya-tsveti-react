import { useState, useEffect } from 'react';
import { useViewDate } from '../../hooks/useViewDate.jsx';
import { getDayData, saveDayData, getTodayString, formatDate } from '../../utils/storage.js';

export default function Medications() {
  const { viewDate } = useViewDate();
  const [medications, setMedications] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ time: '09:00', name: '', dose: '' });

  const today = getTodayString();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  let suffix = 'сегодня';
  if (viewDate === yesterdayStr) suffix = 'вчера';
  else if (viewDate !== today) {
    const d = new Date(viewDate);
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    suffix = `за ${d.getDate()} ${months[d.getMonth()]}`;
  }

  useEffect(() => {
    const data = getDayData(viewDate);
    setMedications(data.medications || []);
    if (!data.medications || data.medications.length === 0) setIsAdding(true);
    else setIsAdding(false);
  }, [viewDate]);

  const handleAdd = () => {
    if (!formData.time || !formData.name || !formData.dose) return;
    const newMeds = [...medications, { id: 'med-' + Date.now(), ...formData, taken: false }];
    setMedications(newMeds);
    saveDayData(viewDate, { medications: newMeds });
    setIsAdding(false);
    setFormData({ time: '09:00', name: '', dose: '' });
  };

  const toggleMed = (id, isTaken) => {
    const newMeds = medications.map(m => m.id === id ? { ...m, taken: isTaken } : m);
    setMedications(newMeds);
    saveDayData(viewDate, { medications: newMeds });
  };

  const removeMed = (id) => {
    const newMeds = medications.filter(m => m.id !== id);
    setMedications(newMeds);
    saveDayData(viewDate, { medications: newMeds });
    if (newMeds.length === 0) setIsAdding(true);
  };

  const takenCount = medications.filter(m => m.taken).length;

  return (
    <div className="medications-main">
      <div className="medications-main__header">
        <h2 className="medications-main__title">Лекарства</h2>
        <span className="medications-main__badge">{takenCount}/{medications.length} {suffix}</span>
      </div>
      
      <div className="medications-list" id="medications-list">
        {medications.map(med => (
          <div className="medication-item" key={med.id}>
            <div className="medication-item__check">
              <input 
                type="checkbox" 
                className="medication-item__input" 
                id={`med-${med.id}`} 
                checked={med.taken} 
                onChange={(e) => toggleMed(med.id, e.target.checked)} 
              />
              <label className="medication-item__checkbox" htmlFor={`med-${med.id}`}></label>
            </div>
            <div className="medication-item__content">
              <div className="medication-item__time">{med.time} — {med.name}</div>
              <div className="medication-item__desc">{med.dose} • {med.taken ? 'Принято' : 'Ожидает'}</div>
            </div>
            <button className="medication-item__more" onClick={() => removeMed(med.id)} type="button" aria-label="Удалить">×</button>
          </div>
        ))}

        {isAdding ? (
          <div className="medication-add-form" id="inline-add-form">
            <input type="time" className="medication-add-form__time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            <input type="text" className="medication-add-form__name" placeholder="Название лекарства" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="text" className="medication-add-form__dose" placeholder="Дозировка" value={formData.dose} onChange={e => setFormData({...formData, dose: e.target.value})} />
            <div className="medication-add-form__actions">
              <button className="medication-add-form__btn" onClick={handleAdd} type="button">Добавить</button>
              {medications.length > 0 && (
                <button className="medication-add-form__cancel" onClick={() => setIsAdding(false)} type="button">Отмена</button>
              )}
            </div>
          </div>
        ) : (
          <button className="medication-add-more-btn" onClick={() => setIsAdding(true)} type="button">
            + Добавить ещё лекарство
          </button>
        )}
      </div>
    </div>
  );
}