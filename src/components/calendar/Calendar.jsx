import { useState } from 'react';
import { useViewDate } from '../../hooks/useViewDate.jsx';
import { getTodayString, formatDate } from '../../utils/storage.js';

const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const weekdayNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getWeekTitle(monday) {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const startMonth = monday.getMonth();
  const startYear = monday.getFullYear();
  const endMonth = sunday.getMonth();
  const endYear = sunday.getFullYear();

  if (startMonth === endMonth && startYear === endYear) return `${monthNames[startMonth]} ${startYear}`;
  if (startYear === endYear) return `${monthNames[startMonth]} — ${monthNames[endMonth]} ${startYear}`;
  return `${monthNames[startMonth]} ${startYear} — ${monthNames[endMonth]} ${endYear}`;
}

export default function Calendar() {
  const { viewDate, setViewDate } = useViewDate();
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = getTodayString();
  const monday = getMonday(currentWeekDate);

  const prevWeek = () => {
    const newDate = new Date(currentWeekDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekDate(newDate);
  };

  const nextWeek = () => {
    const nextWeekDate = new Date(currentWeekDate);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    nextWeekDate.setHours(0, 0, 0, 0);
    if (nextWeekDate > today) return;
    setCurrentWeekDate(nextWeekDate);
  };

  return (
    <div className="calendar-main">
      <div className="calendar-main__header">
        <button className="calendar-main__nav calendar-main__nav--prev" onClick={prevWeek}>&lt;</button>
        <h2 className="calendar-main__title">{getWeekTitle(monday)}</h2>
        <button className="calendar-main__nav calendar-main__nav--next" onClick={nextWeek}>&gt;</button>
      </div>
      <div className="calendar-main__grid">
        {weekdayNames.map(d => <span key={d} className="calendar-main__weekday">{d}</span>)}
        
        {Array.from({ length: 7 }).map((_, i) => {
          const date = new Date(monday.getTime());
          date.setDate(monday.getDate() + i);
          const dateStr = formatDate(date);
          
          const isToday = dateStr === todayStr;
          const isFuture = date > today;
          const isSelected = dateStr === viewDate;

          let classes = 'calendar-main__day';
          if (isToday) classes += isSelected ? ' calendar-main__day--today' : ' calendar-main__day--today-dim';
          else if (isFuture) classes += isSelected ? ' calendar-main__day--future-selected' : ' calendar-main__day--future';
          else if (isSelected) classes += ' calendar-main__day--selected';

          return (
            <button key={dateStr} className={classes} onClick={() => setViewDate(dateStr)}>
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}