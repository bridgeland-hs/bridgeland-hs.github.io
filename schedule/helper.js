const currentDate = new Date();

// eslint-disable-next-line no-unused-vars
function titleCase(str) {
  return str.split('_')
    .map((w) => w[0].toUpperCase() + w.substr(1))
    .join(' ');
}

function formatTime(seconds, twelveHour = false) {
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

function time(t) {
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

// eslint-disable-next-line no-unused-vars
function createClass(name, start, end) {
  return {
    name,
    start: time(start),
    end: time(end),
  };
}
