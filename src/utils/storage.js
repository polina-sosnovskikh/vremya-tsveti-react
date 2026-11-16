const STORAGE_KEY = 'vremya_tsveti_data';
const VIEW_DATE_KEY = 'vremya_tsveti_view_date';

export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayString() {
  return formatDate(new Date());
}

export function getAllData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getDayData(dateStr) {
  const all = getAllData();
  return all[dateStr] || { symptoms: [], medications: [], rating: null };
}

export function saveDayData(dateStr, patch) {
  const all = getAllData();
  all[dateStr] = { ...getDayData(dateStr), ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getViewDate() {
  return localStorage.getItem(VIEW_DATE_KEY) || getTodayString();
}

export function setViewDate(dateStr) {
  localStorage.setItem(VIEW_DATE_KEY, dateStr);
}