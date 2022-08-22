import {
  titleCase,
  formatTime,
  time,
  weekDays,
  currentDate,
} from './helper.js';

import * as alerts from './alerts.js';
import schedules from './schedules.js';
import searches from './searchParams.js';
import elements from './elements.js';

const defaultImage = '../image/Default_Schedule.jpg';
const periodElts = [];

const nextBreak = new Date(2023, 4, 26, 14, 40, 0, 0);
// const nextBreak = new Date(2021, 10, 29, 14, 50, 0, 0);

const now = new Date();
now.setHours(0, 0, 0, 0);
const breakDays = weekDays(now, nextBreak);
const updateNextBreak = breakDays === 1;
elements.nextBreak.innerText = `${breakDays}`;
elements.nextBreakUnits.innerText = ` day${breakDays === 1 ? '' : 's'}`;

const updateBreak = () => {
  const n = new Date();
  const s = (nextBreak - n) / 1000;
  elements.nextBreak.innerText = formatTime(s);
};

const speed = 2; // Times to run per second

elements.tray.querySelector('#settings-toggle')
  .addEventListener('click', () => {
    elements.settings.classList.toggle('hide');
    elements.tray.querySelector('#settings-toggle')
      .classList
      .toggle('btn-dark');
  });

elements.tray.querySelector('#clock-toggle')
  .addEventListener('click', () => {
    clock.classList.toggle('hide-text');
    elements.tray.querySelector('#clock-toggle')
      .classList
      .toggle('btn-dark');
  });

window.location.search
  .substr(1)
  .split('&')
  .forEach((s) => {
    const [k, v] = s.split('=');
    if (k && v) searches[k] = v;
  });

elements.toggle12hr.checked = searches.twelveHour === 'true';
searches.twelveHour = searches.twelveHour ?? false;

for (const k in searches) {
  if (searches[k] === 'true' || searches[k] === 'false') {
    searches[k] = searches[k] === 'true';
  }
}

if (searches.lunch === undefined) {
  searches.lunch = 'a';
}
elements.lunchSel.value = searches.lunch;

let currentSchedule = currentDate.getDay() === 3 ? schedules.advisory : schedules.regular;
for (const schedule of Object.values(schedules)) {
  if (schedule.date
    && schedule.date.getDate() === currentDate.getDate()
    && schedule.date.getMonth() === currentDate.getMonth()) {
    currentSchedule = schedule;
    break;
  }
}

const scheduleSelect = document.querySelector('#schedule-select');
Object.keys(schedules)
  .forEach((s) => {
    if (schedules[s].hide) return;
    const opt = document.createElement('option');
    opt.value = s;
    opt.innerText = titleCase(s);
    scheduleSelect.appendChild(opt);
  });
scheduleSelect.selected = currentDate.getDay() === 3 ? 'advisory' : 'regular';
scheduleSelect.addEventListener('change', () => {
  currentSchedule = schedules[scheduleSelect.value];
  image.src = currentSchedule.image || defaultImage;
});

function timeLeft(d = new Date()) {
  if (d.getDay() === 0 || d.getDay() === 6) {
    return {
      inClass: false,
      weekend: true,
      day: d.getDay() === 0 ? 'Sunday' : 'Saturday',
    };
  }
  if ((currentSchedule.before_lunch[0].start - d) / 1000 > 0) {
    const tl = (currentSchedule.before_lunch[0].start - d) / 1000;
    return {
      inClass: false,
      before_school: true,
      after_school: false,
      tl,
    };
  }
  if ((currentSchedule.after_lunch[currentSchedule.after_lunch.length - 1].end - d) / 1000 < 0) {
    return {
      inClass: false,
      before_school: false,
      after_school: true,
      tl: 0,
    };
  }
  const startTimes = [];
  let currentPd = {
    name: 'Passing',
    inClass: false,
    unset: true,
  };
  let nextPd;
  [
    'before_lunch',
    `lunch_${searches.lunch}`,
    'after_lunch',
  ].forEach((arr) => {
    currentSchedule[arr].forEach((c) => {
      const minsStart = (c.start - d) / 1000;
      const minsEnd = (c.end - d) / 1000;
      if (currentPd.unset && minsStart <= 0 && minsEnd >= 0) {
        currentPd = c;
      }
      if (minsStart > 0 || minsEnd > 0) startTimes.push(c);
    });
  });
  startTimes.sort((a, b) => a.start - b.start);

  if (startTimes[0] === currentPd && startTimes.length > 1) {
    [, nextPd] = startTimes;
  } else {
    [nextPd] = startTimes;
  }
  if (currentPd.name === '7') {
    nextPd = {
      name: 'none',
      inClass: false,
      before_school: false,
      after_school: true,
    };
  }
  const currentPdTimeLeft = (currentPd.end - d) / 1000;
  const nextPdStartsIn = (nextPd.start - d) / 1000;
  return {
    inClass: true,
    currentPd,
    currentPdTimeLeft,
    nextPd,
    nextPdStartsIn,
  };
}

function getDayPeriods() {
  const dayStart = currentSchedule.before_lunch[0].start.valueOf();
  const dayEnd = currentSchedule.after_lunch[currentSchedule.after_lunch.length - 1].end.valueOf();
  const dayLength = (dayEnd - dayStart) / 1000;
  const periods = [];
  let prev = null;
  [
    'before_lunch',
    `lunch_${searches.lunch}`,
    'after_lunch',
  ].forEach((l) => currentSchedule[l].forEach((pd) => {
    const end = (pd.end.valueOf() - dayStart) / 1000;
    const start = (pd.start.valueOf() - dayStart) / 1000;
    const length = end - start;
    const width = length / dayLength;
    if (prev !== null && prev.end !== start) {
      periods.push({
        name: 'Passing',
        start: prev.end,
        end: start,
        length: start - prev.end,
        width: (start - prev.end) / dayLength,
      });
    }
    const per = {
      name: pd.name,
      start,
      end,
      length,
      width,
    };
    periods.push(per);
    prev = per;
  }));
  return periods;
}

function updateClock() {
  const date = new Date();

  const hr = date.getHours() > 12 && searches.twelveHour ? date.getHours() - 12 : date.getHours();

  const hour = (`${hr}`).padStart(2, '0');
  const mins = (`${date.getMinutes()}`).padStart(2, '0');
  const secs = (`${date.getSeconds()}`).padStart(2, '0');
  let ampm;
  if (searches.twelveHour) {
    ampm = date.getHours() < 12 ? ' <small>AM</small>' : ' <small>PM</small>';
  } else {
    ampm = '';
  }

  clock.innerHTML = `${hour}:${mins}:${secs}${ampm}`;
}

function updateProgressBar() {
  const dayStart = currentSchedule.before_lunch[0].start.valueOf() / 1000;
  const current = (Date.now()
    .valueOf() / 1000) - dayStart;
  const periods = getDayPeriods();

  periods.forEach((period) => {
    const l = period.end - period.start;
    const c = current - period.start;
    const t = c / l;

    // console.log(dayStart, current, c, period);
    if (c > 0 && c < l) {
      elements.progressbar.style.width = `${t * 100}%`;
      elements.progressbararea.title = `${Math.round(t * 100)}%`;
    }
  });
}

function updateDayProgressBar(time = new Date()) {
  const dayStart = currentSchedule.before_lunch[0].start.valueOf();
  const current = (time.valueOf() / 1000) - (dayStart / 1000);
  const periods = getDayPeriods();

  periods.forEach((period, i) => {
    const periodElt = periodElts[i];
    if (period.start < current && period.end < current) {
      periodElt.progress.classList.remove('progress-rounded', 'progress-bar-striped', 'progress-bar-animated', 'hide', 'progress-bar-completed');
      periodElt.progress.classList.add('progress-bar-complete');
      periodElt.blank.classList.add('hide');
      periodElt.progress.style.width = `${period.width * 100}%`;
      periodElt.blank.style.width = '0%';
    } else if (period.start < current && period.end > current) {
      const l = period.end - period.start;
      const c = current - period.start;
      const t = c / l;
      const w = period.width * t;
      periodElt.progress.classList.add('progress-rounded', 'progress-bar-striped', 'progress-bar-animated');

      periodElt.progress.classList.remove('hide');
      periodElt.blank.classList.remove('hide');
      periodElt.progress.style.width = `${w * 100}%`;
      periodElt.blank.style.width = `${(period.width - w) * 100}%`;
    } else {
      periodElt.progress.classList.remove('progress-rounded', 'progress-bar-striped', 'progress-bar-animated');

      periodElt.progress.classList.add('hide');
      periodElt.blank.classList.remove('hide');
      periodElt.progress.style.width = '0%';
      periodElt.blank.style.width = `${period.width * 100}%`;
    }
  });
}

function timeLoopAndUpdate(d = new Date()) {
  if (currentDate.getDate() !== new Date().getDate()) {
    currentDate = new Date();
  }

  if (updateNextBreak) {
    updateBreak();
    elements.nextBreakUnits.innerText = '';
  }

  elements.lunchSel.value = searches.lunch;
  const prevSearches = searches;
  searches.lunch = elements.lunchSel.value;

  if (searches.lunch) {
    elements.lunchSel.value = searches.lunch;
  }
  if (searches.twelveHour !== undefined) {
    elements.toggle12hr.checked = searches.twelveHour;
  }
  if (searches !== prevSearches) {
    searches.update();
  }

  const info = timeLeft(d);

  let HTMLOut;
  if (!info.inClass) {
    if (info.weekend) {
      HTMLOut = '<h2 class="subtitle">It\'s the weekend, there\'s no school.</h2>';
      document.querySelector(
        'title',
      ).innerText = 'It\'s the weekend, there\'s no school.';
    } else if (info.after_school) {
      HTMLOut = '<h2 class="subtitle">School\'s over for today!</h2>';
      document.querySelector(
        'title',
      ).innerText = 'School Over For Today!';
    } else if (info.before_school) {
      HTMLOut = `
          <h2 class="subtitle">School hasn't started yet.
              <h2>
                  <h2 class="subtitle">Next Period:</h2>
                  <h3 class="output-text">1</h3>
                  <h2 class="subtitle">Starts At:</h2>
                  <h3 class="output-text" id="time-left">7:20 (In ${formatTime(info.tl)})</h3>
      `;
      document.querySelector('title').innerText = 'School Hasn\'t Started Yet!';
    }
  } else if (info.currentPd.name === 'Passing') {
    document.querySelector('title').innerText = `Period ${info.nextPd.name
    } starts in ${formatTime(info.nextPdStartsIn)}`;
    HTMLOut = `
        <h2 class="subtitle">Period:</h2>
        <h3 class="output-text">${info.currentPd.name}</h3>

        <h2 class="subtitle">Next Period:</h2>
        <h3 class="output-text">${info.nextPd.name}</h3>
        <h2 class="subtitle">Starts At:</h2>
        <h3 class="output-text" id="time-left"><span
                class="time">${time(info.nextPd.start, true)}</span> (In <span
                class="time">${formatTime(info.nextPdStartsIn)}</span>)</h3>`;
  } else {
    HTMLOut = `<h2 class="subtitle">Period:</h2>
    <h3 class="output-text" id="current-period">${info.currentPd.name}</h3>
    <h2 class="subtitle">Ends At:</h2>
    <h3 class="output-text" id="time-left"><span
            class="time">${time(info.currentPd.end, true)}</span> (<span
            class="time">${formatTime(info.currentPdTimeLeft)}</span> left)</h3>`;
    if (info.nextPd.inClass !== false) {
      HTMLOut += `<h2 class="subtitle">Next Period:</h2>
      <h3 class="output-text">${info.nextPd.name}</h3>
      <h2 class="subtitle">Starts At:</h2>
      <h3 class="output-text" id="time-left"><span
              class="time">${time(info.nextPd.start, true)}</span> (In <span
              class="time">${formatTime(info.nextPdStartsIn)}</span>)</h3>
      `;
    }
    document.querySelector('title').innerText = `${Number.isNaN(+info.currentPd.name) ? '' : 'Period'} ${info.currentPd.name
    } | ${formatTime(info.currentPdTimeLeft)} left`;
  }
  document.querySelector('#schedule').innerHTML = HTMLOut;

  updateDayProgressBar();
  updateProgressBar();

  updateClock();
}

function addDayProgressBar() {
  const periods = getDayPeriods();
  periods.forEach((period) => {
    const passing = period.name === 'Passing';
    const eltProgress = document.createElement('div');

    eltProgress.title = titleCase(period.name);
    eltProgress.style = 0;
    eltProgress.classList.add('progress-bar', 'pd', `bg-${passing ? 'info' : 'primary'}`);
    eltProgress.innerText = passing ? '' : titleCase(period.name);
    eltProgress.style.width = '0%';
    elements.dayProgressBar.appendChild(eltProgress);

    const eltBlank = document.createElement('div');
    eltBlank.title = titleCase(period.name);
    eltBlank.style = 0;
    eltBlank.classList.add('progress-bar', 'pd', 'bg-none', 'progress-bar-filler');
    eltBlank.style.width = `${period.width * 100}%`;
    elements.dayProgressBar.appendChild(eltBlank);

    periodElts.push({
      progress: eltProgress,
      blank: eltBlank,
    });
  });
}

export const start = async () => {
  await alerts.load(); // Load alert modals
  addDayProgressBar();
  timeLoopAndUpdate();
  setInterval(timeLoopAndUpdate, 1000 / speed);
};
