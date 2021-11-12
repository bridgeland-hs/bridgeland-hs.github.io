const lunchSel = document.querySelector('#lunch');
const toggle12hr = document.querySelector('#time');
const clock = document.querySelector('#clock');
const offsetEl = document.querySelector('#offset');
const image = document.querySelector('#schedule-img');
const progressbar = document.querySelector('#progressbar');
const progressbararea = document.querySelector('#progressbar-area');
const percent = document.querySelector('#header #percent');
const defaultImage = '../image/Default_Schedule.jpg';
const dayProgressBar = document.querySelector('#progress-day')

let offset = 0;

offsetEl.addEventListener('input', (e) => (offset = offsetEl.valueAsNumber));

const searches = {};
for (let i of location.search.substr(1).split('&')) {
	let x = i.split('=');
	if (x.length == 2) {
		searches[x[0]] = x[1];
	}
}
toggle12hr.checked = searches.twelveHour == 'true';

searches.twelveHour = searches.twelveHour ?? false;
for (let k in searches) {
	if (searches[k] == 'true' || searches[k] == 'false') {
		searches[k] = searches[k] == 'true';
	}
}
searches.update = function () {
	let s = '?';
	for (let k in searches) {
		if (k != 'update') {
			s += k + '=' + searches[k] + '&';
		}
	}
	location.search = s;
};

if (searches.lunch == undefined) {
	searches.lunch = 'a';
}
lunchSel.value = searches.lunch;

// Using 'Let' so that it can be changed with `currentSchedule = schedule.SOMETHING` in the console
let currentSchedule = currentDate.getDay() == 3 ? schedules.advisory : schedules.regular;

let twelveHr = toggle12hr.checked;
let lunch = lunchSel.value;

const scheduleSelect = document.querySelector('#schedule-select');
Object.keys(schedules).forEach(s => {
	const opt = document.createElement('option');
	opt.value = s;
	opt.innerText = titleCase(s);
	scheduleSelect.appendChild(opt);
});
scheduleSelect.selected = currentDate.getDay() == 3 ? 'advisory' : 'regular';
scheduleSelect.addEventListener('change', (e) => {
	currentSchedule = schedules[scheduleSelect.value];
	image.src = currentSchedule.image || defaultImage;
});

function timeLeft(d = new Date()) {
	if (d.getDay() == 0 || d.getDay() == 6) {
		return {
			inClass: false,
			weekend: true,
			day: d.getDay == 0 ? 'Sunday' : 'Saturday',
		};
	} else {
		if ((currentSchedule.before_lunch[0].start - d) / 1000 > 0) {
			let tl = (currentSchedule.before_lunch[0].start - d) / 1000;
			return {
				inClass: false,
				before_school: true,
				after_school: false,
				tl,
			};
		} else if ((currentSchedule.after_lunch[1].end - d) / 1000 < 0) {
			return {
				inClass: false,
				before_school: false,
				after_school: true,
				tl: 0,
			};
		} else {
			let startTimes = [];
			let prevPd = {
				name: 'none',
			}
			let currentPd = {
				name: 'Passing',
				inClass: false,
				unset: true,
			};
			let nextPd = {
				name: 'none',
			};
			for (let arr of [
				'before_lunch',
				'lunch_' + searches.lunch,
				'after_lunch',
			]) {
				for (let c of currentSchedule[arr]) {
					const minsStart = (c.start - d) / 1000;
					const minsEnd = (c.end - d) / 1000;
					if (currentPd.unset && minsStart <= 0 && minsEnd >= 0) {
						prevPd = currentPd;
						currentPd = c;
					}
					if (minsStart > 0 || minsEnd > 0) startTimes.push(c);
				}
			}
			startTimes.sort((a, b) => {
				a.start - b.start;
			});

			if (startTimes[0] == currentPd && startTimes.length > 1) {
				nextPd = startTimes[1];
			} else {
				nextPd = startTimes[0];
			}
			if (currentPd.name == '7') {
				nextPd = {
					name: 'none',
					inClass: false,
					before_school: false,
					after_school: true,
				};
			}
			let currentPdTimeLeft = (currentPd.end - d) / 1000;
			let nextPdStartsIn = (nextPd.start - d) / 1000;
			updateProgressBar(currentPd.start || prevPd.end, currentPd.end || nextPd.start, new Date(), currentPd);
			return {
				inClass: true,
				currentPd,
				currentPdTimeLeft,
				nextPd,
				nextPdStartsIn,
			};
		}
	}
}

function timeLoopAndUpdate(d = new Date()) {
	if (currentDate.getDate() != new Date().getDate()) {
		currentDate = new Date();
	}

	lunchSel.value = searches.lunch;
	prevSearches = searches;
	searches.lunch = lunchSel.value;

	if (searches.lunch) {
		lunchSel.value = searches.lunch;
	}
	if (searches.twelveHour != undefined) {
		toggle12hr.checked = searches.twelveHour;
	}
	if (searches != prevSearches) {
		searches.update();
	}

	info = timeLeft(d);

	if (!info.inClass) {
		if (info.weekend) {
			HTMLOut = `<h2 class="subtitle">It's the weekend, there's no school.</h2>`;
			document.querySelector(
				'title'
			).innerText = `It's the weekend, there's no school.`;
		} else if (info.after_school) {
			HTMLOut = `<h2 class="subtitle">School's over for today!</h2>`;
			document.querySelector(
				'title'
			).innerText = `School Over For Today!`;
		} else if (info.before_school) {
			HTMLOut = `<h2 class="subtitle">School hasn't started yet.<h2>
    <h2 class="subtitle">Next Period:</h2>
    <h3 class="output-text">1</h3>
    <h2 class="subtitle">Starts At:</h2>
    <h3 class="output-text" id="time-left">7:20 (In ${formatTime(info.tl)})</h3>
    `;
			document.querySelector('title').innerText = `School Hasn't Started Yet!`;
		}
	} else if (info.currentPd.name == 'Passing') {
		document.querySelector('title').innerText = `Period ${info.nextPd.name
			} starts in ${formatTime(info.nextPdStartsIn)}`;
		HTMLOut = `
        <h2 class="subtitle">Period:</h2>
        <h3 class="output-text">${info.currentPd.name}</h3>

        <h2 class="subtitle">Next Period:</h2>
        <h3 class="output-text">${info.nextPd.name}</h3>
        <h2 class="subtitle">Starts At:</h2>
        <h3 class="output-text" id="time-left">${time(info.nextPd.start, true)} (In ${formatTime(
			info.nextPdStartsIn
		)})</h3>`;
	} else {
		HTMLOut = `<h2 class="subtitle">Period:</h2>
    <h3 class="output-text" id="current-period">${info.currentPd.name}</h3>
    <h2 class="subtitle">Ends At:</h2>
    <h3 class="output-text" id="time-left">${time(info.currentPd.end, true)} (${formatTime(
			info.currentPdTimeLeft
		)} left)</h3>`;
		if (info.nextPd.inClass != false) {
			HTMLOut += `<h2 class="subtitle">Next Period:</h2>
    <h3 class="output-text">${info.nextPd.name}</h3>
    <h2 class="subtitle">Starts At:</h2>
    <h3 class="output-text" id="time-left">${time(info.nextPd.start, true)} (In ${formatTime(
				info.nextPdStartsIn
			)})</h3>
    `;
		}
		document.querySelector('title').innerText = `Period ${info.currentPd.name
			} : ${formatTime(info.currentPdTimeLeft)}`;
	}
	document.querySelector('#schedule').innerHTML = HTMLOut;
	updateClock();
}

function updateClock() {
	const date = new Date();

	const hr = date.getHours() > 12 && searches.twelveHour ? date.getHours() - 12 : date.getHours();

	const hour = ('' + hr).padStart(2, 0);
	const mins = ('' + date.getMinutes()).padStart(2, 0);
	const secs = ('' + date.getSeconds()).padStart(2, 0);
	const ampm = searches.twelveHour ? (date.getHours() < 12 ? ' <small>AM</small>' : ' <small>PM</small>') : '';


	clock.innerHTML = `${hour}:${mins}:${secs}${ampm}`;
}

function updateProgressBar(initial, final, current, currentPd) {
	try {
		const length = final.valueOf() - initial.valueOf();
		const currentS = current.valueOf() - initial.valueOf();
		const perc = (currentS / length) * 100
		if (currentPd.name == 'none') {
			progressbar.style = 'width: 0%';
			progressbararea.title = ''
			return;
		};
		progressbar.style = 'width: ' + perc + '%';
		progressbararea.title = Math.round(perc) + '%';
	} catch (e) {
		progressbar.style = 'width: 0%';
		progressbararea.title = ''
	}
	updateDayProgressBar()
}

function updateDayProgressBar(time = new Date()) {
	const dayStart = currentSchedule.before_lunch[0].start.valueOf();
	const dayEnd = currentSchedule.after_lunch[1].end.valueOf();
	current = (time.valueOf() / 1000) - (dayStart / 1000);
	const dayLength = (dayEnd - dayStart) / 1000;
	periods = [];
	let prev = null;
	[
		'before_lunch',
		'lunch_' + searches.lunch,
		'after_lunch',
	].forEach(l => currentSchedule[l].forEach(pd => {
		const end = (pd.end.valueOf() - dayStart) / 1000;
		const start = (pd.start.valueOf() - dayStart) / 1000;
		const length = end - start;
		const width = length / dayLength;
		if (prev != null && prev.end != start) {
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
			width
		}
		periods.push(per);
		prev = per;
	}));

	dayProgressBar.innerHTML = '';
	for (const period of periods) {
		const passing = period.name === 'Passing';
		if (period.start < current && period.end < current) { // Completed periods

			dayProgressBar.innerHTML += `<div
			 class="progress-bar bg-${passing ? 'info' : 'primary'} pd"
			 title="${period.name}"
			 style="width: ${period.width * 100}%;">
			 ${passing ? '' : titleCase(period.name)}
			 </div>`
		} else if (period.start < current && period.end > current) { // Partial Bar
			const l = period.end - period.start;
			const c = current - period.start;
			const t = c / l;
			dayProgressBar.innerHTML += `<div
			 class="progress-bar bg-${period.name === 'Passing' ? 'info' : 'primary'} progress-bar-striped progress-rounded pd"
			 title="${period.name}"
			 style="width: ${period.width * 100 * t}%;">
			 ${passing ? '' : titleCase(period.name)}
			 </div>`
		}

	}

	// periods.forEach()
}

timeLoopAndUpdate();
setInterval(timeLoopAndUpdate, 500);
