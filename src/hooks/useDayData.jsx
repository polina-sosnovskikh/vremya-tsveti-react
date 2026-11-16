import { useState, useCallback, useEffect } from 'react';
import { getDayData, saveDayData as persistDayData } from '../utils/storage.js';

export function useDayData(dateStr) {
  const [data, setData] = useState(() => getDayData(dateStr));

  useEffect(() => {
    setData(getDayData(dateStr));
  }, [dateStr]);

  const update = useCallback((patch) => {
    persistDayData(dateStr, patch);
    setData(prev => ({ ...prev, ...patch }));
  }, [dateStr]);

  return [data, update];
}