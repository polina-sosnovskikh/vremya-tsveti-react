import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import placeholderImg from '../assets/working_map.png';

const GEO_STORAGE_KEY = 'vremya_tsveti_geo';

const spbDistrictsPollen = [
    { name: 'Центральный район', lat: 59.9343, lng: 30.3351, level: 'high' },
    { name: 'Адмиралтейский район', lat: 59.9194, lng: 30.3056, level: 'high' },
    { name: 'Василеостровский район', lat: 59.9444, lng: 30.2786, level: 'medium' },
    { name: 'Петроградский район', lat: 59.9667, lng: 30.3117, level: 'medium' },
    { name: 'Выборгский район', lat: 60.0167, lng: 30.3500, level: 'low' },
    { name: 'Калининский район', lat: 60.0167, lng: 30.4167, level: 'low' },
    { name: 'Красногвардейский район', lat: 59.9500, lng: 30.4833, level: 'medium' },
    { name: 'Невский район', lat: 59.9000, lng: 30.4833, level: 'high' },
    { name: 'Фрунзенский район', lat: 59.8667, lng: 30.3500, level: 'medium' },
    { name: 'Московский район', lat: 59.8500, lng: 30.3167, level: 'low' },
    { name: 'Кировский район', lat: 59.8500, lng: 30.2500, level: 'low' },
    { name: 'Красносельский район', lat: 59.8000, lng: 30.1000, level: 'low' },
    { name: 'Приморский район', lat: 60.0167, lng: 30.2000, level: 'medium' },
    { name: 'Курортный район', lat: 60.1000, lng: 29.9500, level: 'low' },
    { name: 'Пушкинский район', lat: 59.7167, lng: 30.4000, level: 'low' },
    { name: 'Колпинский район', lat: 59.7500, lng: 30.5833, level: 'low' },
    { name: 'Кронштадтский район', lat: 59.9917, lng: 29.7667, level: 'low' },
    { name: 'Петродворцовый район', lat: 59.8833, lng: 29.9000, level: 'low' },
];

const levelColors = { high: '#eb5757', medium: '#f9ed7b', low: '#5ed6a2' };
const levelLabels = { high: 'Высокая', medium: 'Средняя', low: 'Низкая' };
const levelEmojis = { high: '🔴', medium: '🟡', low: '🟢' };

export default function MapPage() {
    const [activeTab, setActiveTab] = useState('pollen');
    const [selectedAllergen, setSelectedAllergen] = useState('Берёза');
    const [currentCity, setCurrentCity] = useState('Санкт-Петербург');
    const [locationTime, setLocationTime] = useState('');
    
    // Состояния для поиска
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const userMarkerRef = useRef(null);

    // Форматирование времени
    const updateTime = () => {
        const now = new Date();
        setLocationTime(`Обновлено: ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    };

    // 1. Инициализация карты
    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapInstanceRef.current = L.map(mapContainerRef.current, {
            center: [59.9343, 30.3351],
            zoom: 11,
            zoomControl: false,
            attributionControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(mapInstanceRef.current);

        try {
            const saved = localStorage.getItem(GEO_STORAGE_KEY);
            if (saved) {
                const geoData = JSON.parse(saved);
                if (geoData && geoData.city) {
                    setCurrentCity(geoData.city);
                    if (geoData.lat && geoData.lng) {
                        mapInstanceRef.current.setView([geoData.lat, geoData.lng], 13);
                        addUserMarker(geoData.lat, geoData.lng);
                    }
                }
            }
        } catch (e) {
            console.error('Ошибка восстановления геолокации:', e);
        }

        updateTime();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // 2. Добавление маркеров пыльцы
    const addPollenMarkers = () => {
        if (!mapInstanceRef.current) return;
        
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        spbDistrictsPollen.forEach(district => {
            const marker = L.circleMarker([district.lat, district.lng], {
                radius: 18,
                fillColor: levelColors[district.level],
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
            }).addTo(mapInstanceRef.current);

            marker.bindPopup(`
                <div style="font-family: 'Montserrat', sans-serif; min-width: 160px; padding: 4px 0;">
                    <strong style="font-size: 14px; color: #454e4a; display: block; margin-bottom: 6px;">
                        ${district.name}
                    </strong>
                    <span style="font-size: 13px; color: #454e4a; font-weight: 500;">
                        ${levelEmojis[district.level]} ${selectedAllergen}: ${levelLabels[district.level]}
                    </span>
                </div>
            `);
            markersRef.current.push(marker);
        });
    };

    useEffect(() => {
        if (mapInstanceRef.current && activeTab === 'pollen') {
            addPollenMarkers();
        }
    }, [selectedAllergen, activeTab]);

    useEffect(() => {
        if (!mapInstanceRef.current) return;
        if (activeTab === 'pollen') {
            setTimeout(() => mapInstanceRef.current.invalidateSize(), 100);
        }
    }, [activeTab]);

    const handleZoomIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
    };
    
    const handleZoomOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
    };

    const addUserMarker = (lat, lng) => {
        if (!mapInstanceRef.current) return;
        if (userMarkerRef.current) {
            mapInstanceRef.current.removeLayer(userMarkerRef.current);
        }

        const userIcon = L.divIcon({
            className: 'user-location-marker-leaflet',
            html: `
                <div class="user-location-marker__dot"></div>
                <div class="user-location-marker__pulse"></div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        });

        userMarkerRef.current = L.marker([lat, lng], { icon: userIcon }).addTo(mapInstanceRef.current);
        userMarkerRef.current.bindPopup('<strong>Вы здесь</strong>').openPopup();
    };

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&accept-language=ru`);
            if (!response.ok) throw new Error('HTTP error');
            const data = await response.json();
            const address = data.address || {};
            return address.city || address.town || address.village || address.suburb || address.state || 'Моё местоположение';
        } catch (error) {
            console.error('Ошибка геокодирования:', error);
            return null;
        }
    };

    const handleGeoClick = () => {
        if (!navigator.geolocation) {
            alert('Ваш браузер не поддерживает геолокацию.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const city = await reverseGeocode(latitude, longitude);
                const finalCity = city || 'Моё местоположение';
                
                setCurrentCity(finalCity);
                
                localStorage.setItem(GEO_STORAGE_KEY, JSON.stringify({ 
                    city: finalCity, lat: latitude, lng: longitude, timestamp: Date.now() 
                }));

                if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([latitude, longitude], 13, { duration: 1.5 });
                    addUserMarker(latitude, longitude);
                }
                updateTime();
            },
            (error) => {
                let message = 'Не удалось получить геолокацию';
                if (error.code === error.PERMISSION_DENIED) message = 'Доступ к геолокации запрещён. Разрешите доступ в настройках браузера.';
                alert(message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
        );
    };

    const filteredDistricts = spbDistrictsPollen.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDistrictSelect = (districtName) => {
        setSearchQuery(districtName);
        setIsDropdownOpen(false); // Закрываем список после выбора
        const district = spbDistrictsPollen.find(d => d.name === districtName);
        if (district && mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([district.lat, district.lng], 12, { duration: 1.5 });
            setCurrentCity(districtName);
            updateTime();
        }
    };

    return (
        <div className="map-page">
            <div className="date-bar">
                <div className="date-bar__inner">
                    <span className="date-bar__text">
                        {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>
            </div>

            <div className="map-tabs">
                <div className="map-tabs__list">
                    <button 
                        className={`map-tabs__tab ${activeTab === 'pollen' ? 'map-tabs__tab--active' : ''}`}
                        onClick={() => setActiveTab('pollen')}
                    >
                        Карта пыльцы
                    </button>
                    <button 
                        className={`map-tabs__tab ${activeTab === 'symptoms' ? 'map-tabs__tab--active' : ''}`}
                        onClick={() => setActiveTab('symptoms')}
                    >
                        Карта симптомов
                    </button>
                </div>
            </div>

            <div className="pollen-selector">
                <div className="pollen-selector__list">
                    {['Берёза', 'Ольха', 'Злаки', 'Дуб', 'Лещина'].map(allergen => (
                        <button 
                            key={allergen}
                            className="pollen-selector__btn"
                            aria-pressed={selectedAllergen === allergen}
                            onClick={() => setSelectedAllergen(allergen)}
                        >
                            {allergen}
                        </button>
                    ))}
                </div>
            </div>

            {/* ИСПРАВЛЕННЫЙ БЛОК ПОИСКА */}
            <div className="search" style={{ position: 'relative', zIndex: 2000 }}>
                <div className="search__wrapper">
                    <label className="search__label">
                        <svg className="search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input 
                            type="text" 
                            className="search__input" 
                            placeholder="Поиск района..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsDropdownOpen(true)}
                            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Задержка, чтобы клик по элементу успел сработать
                        />
                    </label>
                    
                    {/* Выпадающий список */}
                    {isDropdownOpen && (
                        <div className="search__dropdown search__dropdown--active">
                            <div className="search__dropdown-header">Районы</div>
                            <ul className="search__dropdown-list">
                                {filteredDistricts.length > 0 ? (
                                    filteredDistricts.map(d => (
                                        <li 
                                            key={d.name} 
                                            className={`search__dropdown-item ${currentCity === d.name ? 'search__dropdown-item--selected' : ''}`}
                                            onClick={() => handleDistrictSelect(d.name)}
                                        >
                                            {d.name}
                                        </li>
                                    ))
                                ) : (
                                    <li className="search__dropdown-empty" style={{ display: 'block' }}>Ничего не найдено</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="map-area">
                <div className="map">
                    <div 
                        ref={mapContainerRef} 
                        id="map" 
                        style={{ width: '100%', height: '100%', display: activeTab === 'pollen' ? 'block' : 'none' }}
                    ></div>

                    {activeTab === 'pollen' && (
                        <>
                            <div className="map-legend">
                                <div className="map-legend__title">Концентрация: {selectedAllergen}</div>
                                <ul className="map-legend__list">
                                    <li className="map-legend__item">
                                        <span className="map-legend__color map-legend__color--high"></span>
                                        <span className="map-legend__label">Высокая</span>
                                    </li>
                                    <li className="map-legend__item">
                                        <span className="map-legend__color map-legend__color--medium"></span>
                                        <span className="map-legend__label">Средняя</span>
                                    </li>
                                    <li className="map-legend__item">
                                        <span className="map-legend__color map-legend__color--low"></span>
                                        <span className="map-legend__label">Низкая</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="map-location">
                                <div className="map-location__city">{currentCity}</div>
                                <div className="map-location__time">{locationTime}</div>
                            </div>

                            <div className="map-controls">
                                <button className="map-controls__btn map-controls__btn--zoom-in" onMouseDown={e => e.stopPropagation()} onClick={handleZoomIn}>+</button>
                                <button className="map-controls__btn map-controls__btn--zoom-out" onMouseDown={e => e.stopPropagation()} onClick={handleZoomOut}>−</button>
                                <button className="map-controls__btn map-controls__btn--geo" onClick={handleGeoClick}>
                                    <svg className="map-controls__geo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}

                    {activeTab === 'symptoms' && (
                        <div className="map-placeholder">
                            <div className="map-placeholder__content">
                                <img className="map-placeholder__icon" src={placeholderImg} alt="Карта в разработке" />
                                <h3 className="map-placeholder__title">Карта симптомов в разработке</h3>
                                <p className="map-placeholder__text">Этот раздел скоро будет доступен.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}