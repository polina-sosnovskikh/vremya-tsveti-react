export function getRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const MS_IN_MINUTE = 60 * 1000;
    const MS_IN_HOUR = 60 * MS_IN_MINUTE;
    const MS_IN_DAY = 24 * MS_IN_HOUR;
    const MS_IN_WEEK = 7 * MS_IN_DAY;
    
    if (diff < MS_IN_MINUTE) return 'Только что';
    if (diff < MS_IN_HOUR) {
        const minutes = Math.floor(diff / MS_IN_MINUTE);
        return `${minutes} ${getMinutesWord(minutes)} назад`;
    }
    if (diff < MS_IN_DAY) {
        const hours = Math.floor(diff / MS_IN_HOUR);
        return `${hours} ${getHoursWord(hours)} назад`;
    }
    if (diff < MS_IN_WEEK) {
        const days = Math.floor(diff / MS_IN_DAY);
        return `${days} ${getDaysWord(days)} назад`;
    }
    
    const date = new Date(timestamp);
    const dayNum = date.getDate();
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${dayNum} ${months[date.getMonth()]}`;
}

function getMinutesWord(n) {
    if (n % 10 === 1 && n % 100 !== 11) return 'минуту';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'минуты';
    return 'минут';
}

function getHoursWord(n) {
    if (n % 10 === 1 && n % 100 !== 11) return 'час';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'часа';
    return 'часов';
}

function getDaysWord(n) {
    if (n % 10 === 1 && n % 100 !== 11) return 'день';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'дня';
    return 'дней';
}