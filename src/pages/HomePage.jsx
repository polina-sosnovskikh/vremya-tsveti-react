import { ViewDateProvider } from '../hooks/useViewDate.jsx';
import Calendar from '../components/calendar/Calendar.jsx';
import Rating from '../components/rating/Rating.jsx';
import Medications from '../components/medications/Medications.jsx';
import Symptoms from '../components/symptoms/Symptoms.jsx';

export default function HomePage() {
  return (
    <ViewDateProvider>
      <div className="page-title">
        <div className="page-title__inner">
          <h1 className="page-title__text">Дневник</h1>
          <div className="page-title__actions">
            <button className="page-title__btn" aria-label="Поиск">
              <svg className="page-title__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="main--dashboard">
        <Symptoms />
        
        <div className="dashboard-report">
          <div className="calendar-with-report">
            <Calendar />
            <button className="download-report" type="button">
              <svg className="report-download__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span className="download-report__text">Скачать отчёт</span>
            </button>
          </div>
          
          <Rating />
          <Medications />
        </div>
      </div>
    </ViewDateProvider>
  );
}