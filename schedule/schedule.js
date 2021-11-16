const lunchSel = document.querySelector('#lunch');
const toggle12hr = document.querySelector('#time');
const clock = document.querySelector('#clock');
const image = document.querySelector('#schedule-img');
const progressbar = document.querySelector('#progressbar');
const progressbararea = document.querySelector('#progressbar-area');
const defaultImage = '../image/Default_Schedule.jpg';
const dayProgressBar = document.querySelector('#progress-day');
const periodElts = [];

const speed = 2; // Times to run per second

const searches = {};
for (const i of window.location.search.substr(1)
  .split('&')) {
  const [k, v] = i.split('=');
  if (k && v) {
    searches[k] = v;
  }
}
toggle12hr.checked = searches.twelveHour === 'true';

searches.twelveHour = searches.twelveHour ?? false;
for (const k in searches) {
  if (searches[k] === 'true' || searches[k] === 'false') {
    searches[k] = searches[k] === 'true';
  }
}
searches.update = () => {
  let s = '?';
  for (const k in searches) {
    if (k !== 'update') {
      s += `${k}=${searches[k]}&`;
    }
  }
  window.location.search = s;
};

if (searches.lunch === undefined) {
  searches.lunch = 'a';
}
lunchSel.value = searches.lunch;

// Using 'Let' so that it can be changed with `currentSchedule = schedule.SOMETHING` in the console
let currentSchedule = currentDate.getDay() === 3 ? schedules.advisory : schedules.regular;

const scheduleSelect = document.querySelector('#schedule-select');
Object.keys(schedules)
  .forEach((s) => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.innerText = titleCase(s);
    scheduleSelect.appendChild(opt);
  });
scheduleSelect.selected = currentDate.getDay() === 3 ? 'advisory' : 'regular';
scheduleSelect.addEventListener('change', (e) => {
  currentSchedule = schedules[scheduleSelect.value];
  image.src = currentSchedule.image || defaultImage;
});

function timeLeft(d = new Date()) {
  if (d.getDay() === 0 || d.getDay() === 6) {
    return {
      inClass: false,
      weekend: true,
      day: d.getDay === 0 ? 'Sunday' : 'Saturday',
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
  if ((currentSchedule.after_lunch[1].end - d) / 1000 < 0) {
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
  let nextPd = {
    name: 'none',
  };
  for (const arr of [
    'before_lunch',
    `lunch_${searches.lunch}`,
    'after_lunch',
  ]) {
    for (const c of currentSchedule[arr]) {
      const minsStart = (c.start - d) / 1000;
      const minsEnd = (c.end - d) / 1000;
      if (currentPd.unset && minsStart <= 0 && minsEnd >= 0) {
        currentPd = c;
      }
      if (minsStart > 0 || minsEnd > 0) startTimes.push(c);
    }
  }
  startTimes.sort((a, b) => a.start - b.start);

  if (startTimes[0] === currentPd && startTimes.length > 1) {
    [_, nextPd] = startTimes[1];
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
  const dayEnd = currentSchedule.after_lunch[1].end.valueOf();
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

  const hour = (`${hr}`).padStart(2, 0);
  const mins = (`${date.getMinutes()}`).padStart(2, 0);
  const secs = (`${date.getSeconds()}`).padStart(2, 0);
  const ampm = searches.twelveHour ? (date.getHours() < 12 ? ' <small>AM</small>' : ' <small>PM</small>') : '';

  clock.innerHTML = `${hour}:${mins}:${secs}${ampm}`;
}

function updateProgressBar() {
  const dayStart = currentSchedule.before_lunch[0].start.valueOf() / 1000;
  const current = (Date.now()
    .valueOf() / 1000) - dayStart;
  const periods = getDayPeriods();

  for (const period of periods) {
    const l = period.end - period.start;
    const c = current - period.start;
    const t = c / l;

    // console.log(dayStart, current, c, period);
    if (c > 0 && c < l) {
      progressbar.style = `width: ${t * 100}%`;
      progressbararea.title = `${Math.round(t * 100)}%`;
    }
  }
}

function updateDayProgressBar(time = new Date()) {
  const dayStart = currentSchedule.before_lunch[0].start.valueOf();
  const current = (time.valueOf() / 1000) - (dayStart / 1000);
  const periods = getDayPeriods();

  for (const si in periods) {
    const i = +si;
    const period = periods[i];

    if (period.start < current && period.end < current) {
      periodElts[i].progress.classList.remove('progress-rounded', 'progress-bar-striped', 'progress-bar-animated', 'hide', 'progress-bar-completed');
      periodElts[i].progress.classList.add('progress-bar-complete');
      periodElts[i].blank.classList.add('hide');
      periodElts[i].progress.style = `width: ${period.width * 100}%`;
      periodElts[i].blank.style = 'width: 0%';
    } else if (period.start < current && period.end > current) {
      const l = period.end - period.start;
      const c = current - period.start;
      const t = c / l;
      const w = period.width * t;
      periodElts[i].progress.classList.add('progress-rounded', 'progress-bar-striped', 'progress-bar-animated');

      periodElts[i].progress.classList.remove('hide');
      periodElts[i].blank.classList.remove('hide');
      periodElts[i].progress.style = `width: ${w * 100}%`;
      periodElts[i].blank.style = `width: ${(period.width - w) * 100}%`;
    } else {
      periodElts[i].progress.classList.remove('progress-rounded', 'progress-bar-striped', 'progress-bar-animated');

      periodElts[i].progress.classList.add('hide');
      periodElts[i].blank.classList.remove('hide');
      periodElts[i].progress.style = 'width: 0%';
      periodElts[i].blank.style = `width: ${period.width * 100}%`;
    }
  }
}

function timeLoopAndUpdate(d = new Date()) {
  if (currentDate.getDate() !== new Date().getDate()) {
    currentDate = new Date();
  }

  lunchSel.value = searches.lunch;
  prevSearches = searches;
  searches.lunch = lunchSel.value;

  if (searches.lunch) {
    lunchSel.value = searches.lunch;
  }
  if (searches.twelveHour !== undefined) {
    toggle12hr.checked = searches.twelveHour;
  }
  if (searches !== prevSearches) {
    searches.update();
  }

  info = timeLeft(d);

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
      HTMLOut = `<h2 class="subtitle">School hasn't started yet.<h2>
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
        <h3 class="output-text" id="time-left">${time(info.nextPd.start, true)} (In ${formatTime(info.nextPdStartsIn)})</h3>`;
  } else {
    HTMLOut = `<h2 class="subtitle">Period:</h2>
    <h3 class="output-text" id="current-period">${info.currentPd.name}</h3>
    <h2 class="subtitle">Ends At:</h2>
    <h3 class="output-text" id="time-left">${time(info.currentPd.end, true)} (${formatTime(info.currentPdTimeLeft)} left)</h3>`;
    if (info.nextPd.inClass !== false) {
      HTMLOut += `<h2 class="subtitle">Next Period:</h2>
    <h3 class="output-text">${info.nextPd.name}</h3>
    <h2 class="subtitle">Starts At:</h2>
    <h3 class="output-text" id="time-left">${time(info.nextPd.start, true)} (In ${formatTime(info.nextPdStartsIn)})</h3>
    `;
    }
    document.querySelector('title').innerText = `Period ${info.currentPd.name
    } : ${formatTime(info.currentPdTimeLeft)}`;
  }
  document.querySelector('#schedule').innerHTML = HTMLOut;

  updateDayProgressBar();
  updateProgressBar();

  ++iteration;
  updateClock();
}

function addDayProgressBar() {
  const periods = getDayPeriods();
  for (const period of periods) {
    const passing = period.name === 'Passing';
    const eltProgress = document.createElement('div');
    eltProgress.title = titleCase(period.name);
    eltProgress.id = `${period.name + (passing ? period.start : '')}-progress`; // Used to call it back later
    eltProgress.style = 0;
    eltProgress.classList.add('progress-bar', 'pd', `bg-${passing ? 'info' : 'primary'}`);
    eltProgress.innerText = passing ? '' : titleCase(period.name);
    eltProgress.style = 'width: 0%';
    dayProgressBar.appendChild(eltProgress);

    const eltBlank = document.createElement('div');
    eltBlank.title = titleCase(period.name);
    eltBlank.id = period.name + (passing ? period.start : ''); // Used to call it back later
    eltBlank.style = 0;
    eltBlank.classList.add('progress-bar', 'pd', 'bg-none', 'progress-bar-filler');
    eltBlank.style = `width: ${period.width * 100}%`;
    dayProgressBar.appendChild(eltBlank);

    periodElts.push({
      progress: eltProgress,
      blank: eltBlank,
    });
  }
}

addDayProgressBar();
timeLoopAndUpdate();
setInterval(timeLoopAndUpdate, 1000 / speed);
