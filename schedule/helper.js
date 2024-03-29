import searches from './searchParams.js';

export const currentDate = new Date();

export function titleCase(str) {
  return str.split('_')
    .map((w) => w[0].toUpperCase() + w.substr(1))
    .join(' ');
}

export function formatTime(seconds, twelveHour = false) {
  let hour = seconds / 3600;
  let min = Math.floor(seconds / 60) % 60;
  let sec = Math.floor(seconds % 60);

  if (twelveHour) {
    hour = hour % 12 === 0 ? 12 : 0;
  }

  hour = Math.floor(hour);

  const hourS = (`${hour}`).padStart(2, 0);
  min = (`${min}`).padStart(2, 0);
  sec = (`${sec}`).padStart(2, 0);

  return hour === 0 ? `${min}:${sec}` : `${hour}:${min.padStart(2, 0)}:${sec}`;
}

export function time(t) {
  if (typeof t === 'string') {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      +t.split(':')[0],
      +t.split(':')[1],
      t.split(':').length === 3 ? +t.split(':')[2] : 0,
    );
  }
  return formatTime(
    t.getHours() * 60 + t.getMinutes(),
    t.getSeconds(),
    searches.twelveHour,
  );
}

export function createClass(name, start, end) {
  return {
    name,
    start: time(start),
    end: time(end),
  };
}

/**
 * @param startDate {Date}
 * @param endDate {Date}
 * @returns {number}
 */
export function weekDays(startDate, endDate) {
  let count = 0;
  const curDate = new Date(startDate.getTime());
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
}
