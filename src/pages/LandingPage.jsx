import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Убедись, что картинка маскота лежит в src/assets (замени имя файла, если оно другое)
import mascotImg from '../assets/pyla_main.png'; 

export default function LandingPage() {
  const navigate = useNavigate();
  const mascotRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // 1. Анимация появления элементов при загрузке
    const elements = [headerRef.current, contentRef.current, ctaRef.current];
    elements.forEach((el, index) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + index * 200);
    });

    // 2. Интерактивный маскот (следит за курсором)
    const handleMouseMove = (e) => {
      const mascot = mascotRef.current;
      if (!mascot) return;
      
      const rect = mascot.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const tiltX = Math.cos(angle) * 10;
      const tiltY = Math.sin(angle) * 10;

      mascot.style.transform = `translate(${tiltX}px, ${tiltY}px)`;
    };

    const handleMouseLeave = () => {
      if (mascotRef.current) {
        mascotRef.current.style.transform = 'translate(0, 0)';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Очистка при размонтировании компонента
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Плавный переход на главную
  const handleStart = () => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0';
    setTimeout(() => {
      navigate('/home');
      document.body.style.opacity = '1'; // Возвращаем видимость для новой страницы
    }, 500);
  };

  return (
    <div className="landing-body">
      <header className="landing-header" ref={headerRef}>
        <div className="landing-header__logo">Время Цвести</div>
      </header>

      <main className="landing-main">
        <div className="landing-content" ref={contentRef}>
          <h1 className="landing-content__title">
            Добро пожаловать в приложение для отслеживания аллергии и самочувствия
          </h1>
          <p className="landing-content__text">
            Ваш личный дневник здоровья всегда под рукой.
          </p>
        </div>

        <div className="landing-mascot" ref={mascotRef}>
          <img 
            className="landing-mascot__image" 
            src={mascotImg} 
            alt="Маскот" 
          />
        </div>

        <div className="landing-cta" ref={ctaRef}>
          <button 
            className="landing-cta__btn" 
            onClick={handleStart}
            type="button"
          >
            Начать
          </button>
        </div>
      </main>
    </div>
  );
}