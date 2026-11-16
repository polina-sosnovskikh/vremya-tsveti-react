import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ForecastPage from './pages/ForecastPage.jsx';
import MapPage from './pages/MapPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx'; // <-- Добавили

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route element={<Layout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/forecast" element={<ForecastPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/settings" element={<SettingsPage />} /> {/* <-- Заменили */}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}