/* eslint-disable no-unused-vars */

const titleCase = (str) => {
  const s = str.toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const dateFromTime = (time) => {
  const d = new Date();
  d.setHours(time.split(':')[0]);
  d.setMinutes(time.split(':')[1]);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
};

const timeFromDate = (date) => {
  const currentTime = new Date();
  const hrs = currentTime.getHours() > 12 && settings.twelveHour
    ? currentTime.getHours() - 12
    : currentTime.getHours();
  const hours = (`${hrs}`).padStart(2, '0');
  const minutes = (`${currentTime.getMinutes()}`).padStart(2, '0');
  const seconds = (`${currentTime.getSeconds()}`).padStart(2, '0');
};

const timeFromSeconds = (seconds, showSeconds) => {
  // eslint-disable-next-line no-param-reassign
  seconds = Math.round(seconds);
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds - (hrs * 3600)) / 60);
  const secs = seconds - (hrs * 3600) - (mins * 60);

  const hours = (`${hrs}`);
  const minutes = (`${mins}`).padStart(2, '0');
  const fSeconds = `:${(`${secs}`).padStart(2, '0')}`;

  const time = `${hours}:${minutes}${showSeconds ? fSeconds : ''}`;
  return time;
};
