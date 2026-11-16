import { createContext, useContext, useState, useCallback } from 'react';
import { getViewDate, setViewDate as persistViewDate } from '../utils/storage.js';

const ViewDateContext = createContext(null);

export function ViewDateProvider({ children }) {
  const [viewDate, setViewDateState] = useState(getViewDate);

  const setViewDate = useCallback((dateStr) => {
    persistViewDate(dateStr);
    setViewDateState(dateStr);
  }, []);

  return (
    <ViewDateContext.Provider value={{ viewDate, setViewDate }}>
      {children}
    </ViewDateContext.Provider>
  );
}

export function useViewDate() {
  const ctx = useContext(ViewDateContext);
  if (!ctx) throw new Error('useViewDate must be used inside ViewDateProvider');
  return ctx;
}