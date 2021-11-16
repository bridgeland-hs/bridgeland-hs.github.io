let schedules = null;
let currentSchedule = null;
let currentScheduleName = null;

const scheduleElt = document.querySelector('#schedule');

const day = {
  start: -1,
  end: -1,
  periods: {},
};

const getSchedules = async () => {
  schedules = await json.load('schedule.json');
  if (schedules == null) {
    alert('Failed to load schedules!');
    throw new Error('Failed to load schedules!');
  }
  return schedules;
};

/**
 * @returns {string|null}
 */
const getCurrentPeriod = () => {
  if (currentSchedule == null) {
    return null;
  }

  // const time = currentDate.getHours() * 60 + currentDate.getMinutes();
  const time = (new Date().valueOf() / 1000) - day.midnight;
  let i = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const v of day.periods) {
    if (v.start < time && v.end > time) {
      return i;
    }
    ++i;
  }
  return null;
};

const updateSchedule = () => {
  const i = getCurrentPeriod();
  if (i === null) {
    scheduleElt.innerHTML = '<h1>School\'s over!</h1>';
    return;
  }
  const curr = day.periods[i];
  const prev = day.periods[i - 1];
  const next = day.periods[i + 1];
  const time = (new Date().valueOf() / 1000) - day.midnight;
  scheduleElt.innerHTML = '';
  if (prev) {
    scheduleElt.innerHTML += `<h1>Period: ${titleCase(prev.name)}</h1>`;
    scheduleElt.innerHTML += `<h3>${timeFromSeconds(prev.start)} - ${timeFromSeconds(prev.end)}</h3>`;
  }
  if (curr) {
    // const timeLeft = (new Date().valueOf() / 1000) - day.midnight;

    scheduleElt.innerHTML += `<h1>Period: ${titleCase(curr.name)}</h1>`;
    scheduleElt.innerHTML += `<h3>${timeFromSeconds(curr.start)} - ${timeFromSeconds(curr.end)}</h3>`;
    scheduleElt.innerHTML += `<h3>Time Left: ${timeFromSeconds(curr.end - time, true)}</h3>`;
  }
  if (next) {
    scheduleElt.innerHTML += `<h1>Next Period: ${titleCase(next.name)}</h1>`;
    scheduleElt.innerHTML += `<h3>${timeFromSeconds(next.start)} - ${timeFromSeconds(next.end)}</h3>`;
    // scheduleElt.innerText += JSON.stringify(next, null, 4);
  }
};

const updateClasses = () => {
  day.periods = [];
  ['before_lunch', `lunch_${settings.lunch}`, 'after_lunch'].forEach((group) => {
    Object.values(currentSchedule[group])
      .forEach((v) => {
        // Everything relative to midnight
        const start = Math.round(dateFromTime(v.start)
          .valueOf() / 1000);
        const end = Math.round(dateFromTime(v.end)
          .valueOf() / 1000);
        day.periods.push({
          name: v.name,
          start: start - day.midnight,
          end: end - day.midnight,
          duration: end - start,
        });
      });
  });
};

// eslint-disable-next-line no-unused-vars
const loadSchedules = async () => {
  schedules = await getSchedules();

  switch (currentDate.getDay()) {
    case 1: // Weekdays
    case 2:
    case 4:
    case 5:
      currentScheduleName = 'regular';
      currentSchedule = schedules.regular;
      break;
    case 3: // Advisory (Wednesday)
      currentScheduleName = 'advisory';
      currentSchedule = schedules.advisory;
      break;
    default: // Weekend
      currentScheduleName = null;
      currentSchedule = null;
      break;
  }

  if (currentSchedule === null) return;

  const start = dateFromTime(currentSchedule.before_lunch[0].start)
    .valueOf();
  const end = dateFromTime(
    currentSchedule.after_lunch[currentSchedule.after_lunch.length - 1].end,
  )
    .valueOf();

  day.midnight = dateFromTime('00:00')
    .valueOf() / 1000;
  day.epochStart = start / 1000;
  day.epochStart = end / 1000;
  day.start = 0;
  day.end = (end - start) / 1000;

  updateClasses();
  setInterval(updateSchedule, 500);
};
