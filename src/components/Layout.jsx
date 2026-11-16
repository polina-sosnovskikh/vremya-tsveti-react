import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <header className="header">
        <div className="header__inner">
          {/* ТЕПЕРЬ ВЕДЕТ НА ЛЕНДИНГ */}
          <Link to="/" className="header__logo">
            <span className="header__logo-text">Время Цвести</span>
          </Link>
          
          <nav className="nav nav--desktop">
            <Link to="/home" className={`nav__link ${path === '/home' ? 'nav__link--active' : ''}`}>Главная</Link>
            <Link to="/forecast" className={`nav__link ${path === '/forecast' ? 'nav__link--active' : ''}`}>Прогноз</Link>
            <Link to="/map" className={`nav__link ${path === '/map' ? 'nav__link--active' : ''}`}>Карта</Link>
            <Link to="/community" className={`nav__link ${path === '/community' ? 'nav__link--active' : ''}`}>Сообщество</Link>
            <Link to="/settings" className={`nav__link ${path === '/settings' ? 'nav__link--active' : ''}`}>Настройки</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </>
  );
}