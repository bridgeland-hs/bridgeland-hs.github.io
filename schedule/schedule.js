let currentDate = new Date();
const lunchSel = document.querySelector('#lunch');
const toggle12hr = document.querySelector('#time');
const advisoryCheck = document.querySelector('#advisory');

const clock = document.querySelector('#clock');

const offsetEl = document.querySelector('#offset');

let offset = 0;

offsetEl.addEventListener('input', (e) => (offset = offsetEl.valueAsNumber));

// hash = location.hash.split("#");
// if (hash[0].match(/[abc]$/i)) {
//     lunchSel.value = location.hash[1];
// }
const searches = {};
for (let i of location.search.substr(1).split('&')) {
	let x = i.split('=');
	if (x.length == 2) {
		searches[x[0]] = x[1];
	}
}
advisoryCheck.checked = searches.advisory == 'true';
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

const schedule = {
	regular: {
		before_lunch: [
			createClass('1', '7:20', '8:12'),
			createClass('2', '8:18', '9:15'),
			createClass('3', '9:21', '10:13'),
		],

		lunch_a: [
			createClass('lunch', '10:13', '10:43'),
			createClass('4', '10:49', '11:42'),
			createClass('5', '11:48', '12:54'),
		],
		lunch_b: [
			createClass('4', '10:19', '11:12'),
			createClass('lunch', '11:12', '11:42'),
			createClass('5', '11:48', '12:54'),
		],
		lunch_c: [
			createClass('4', '10:19', '11:12'),
			createClass('5a', '11:18', '11:48'),
			createClass('lunch', '11:48', '12:18'),
			createClass('5b', '12:24', '12:54'),
		],
		lunch_d: [
			createClass('4', '10:19', '11:12'),
			createClass('5', '11:18', '12:24'),
			createClass('lunch', '12:24', '12:54'),
		],

		after_lunch: [
			createClass('6', '13:00', '13:52'),
			createClass('7', '13:58', '14:50'),
		],
	},
	advisory: {
		before_lunch: [
			createClass('1', '7:20', '8:06'),
			createClass('2', '8:12', '9:03'),
			createClass('Advisory', '9:03', '9:33'),
			createClass('3', '9:39', '10:25'),
		],

		lunch_a: [
			createClass('lunch', '10:25', '10:55'),
			createClass('4', '11:01', '11:50'),
			createClass('5', '11:56', '12:59'),
		],
		lunch_b: [
			createClass('4', '10:31', '11:19'),
			createClass('lunch', '11:19', '11:49'),
			createClass('5', '11:55', '12:59'),
		],
		lunch_c: [
			createClass('4', '10:31', '11:19'),
			createClass('5a', '11:25', '11:56'),
			createClass('lunch', '11:56', '12:26'),
			createClass('5b', '12:32', '12:59'),
		],
		lunch_d: [
			createClass('4', '10:31', '11:19'),
			createClass('5', '11:25', '12:29'),
			createClass('lunch', '12:29', '12:59'),
		],

		after_lunch: [
			createClass('6', '13:05', '13:54'),
			createClass('7', '14:00', '14:50'),
		],
	},
	pepRally: {
		before_lunch: [
			createClass('1', '7:20', '8:02'),
			createClass('2', '8:08', '8:50'),
			createClass('3', '8:56', '9:38'),
		],

		lunch_a: [
			createClass('lunch', '9:38', '10:08'),
			createClass('4', '10:14', '11:08'),
			createClass('5', '11:14', '12:08'),
		],
		lunch_b: [
			createClass('4', '9:44', '10:30'),
			createClass('lunch', '10:30', '11:00'),
			createClass('5', '11:06', '12:08'),
		],
		lunch_c: [
			createClass('4', '9:44', '10:30'),
			createClass('5a', '10:36', '11:02'),
			createClass('lunch', '11:02', '12:32'),
			createClass('5b', '12:38', '12:08'),
		],
		lunch_d: [
			createClass('4', '9:44', '10:30'),
			createClass('5', '10:36', '11:38'),
			createClass('lunch', '11:38', '12:08'),
		],

		after_lunch: [
			createClass('6', '12:14', '12:59'),
			createClass('7', '13:05', '14:50'),
		]
	}
};

// Using 'Let' so that it can be changed with `currentSchedule = schedule.SOMETHING` in the console
let currentSchedule =
	searches.advisory || 
	currentDate.getDay() == 3 ? schedule.advisory : schedule.regular;

let twelveHr = toggle12hr.checked;
let lunch = lunchSel.value;

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
					if (currentPd.unset && minsStart <= 0 && minsEnd >= 0)
						currentPd = c;
					if (minsStart > 0 || minsEnd > 0) startTimes.push(c);
					// console.log(`${c.name}: ${minsStart}, ${minsEnd}`);
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
			// console.log(startTimes);
			let currentPdTimeLeft = (currentPd.end - d) / 1000;
			let nextPdStartsIn = (nextPd.start - d) / 1000;
			// console.log(
			// 	`Current Period: ${currentPd.name}, Time Left: ${currentPdTimeLeft}\nNext Period: ${nextPd.name}, Starts in: ${nextPdStartsIn}`
			// );
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
			HTMLOut = `<h2 class="subtitle">It's ${info.day}, there's no school.</h2>`;
			document.querySelector(
				'title'
			).innerText = `It's ${info.day}, there's no school.`;
		} else if (info.after_school) {
			HTMLOut = `<h2 class="subtitle">School's over for today!</h2>`;
			document.querySelector(
				'title'
			).innerText = `School Over For Today!`;
		} else if (info.before_school) {
			HTMLOut = `<h2 class="subtitle">School hasn't started yet.<h2>
    <h2 class="subtitle">Next Period:</h2>
    <h3>1</h3>
    <h2 class="subtitle">Starts At:</h2>
    <h3 id="time-left">7:20 (In ${formatTime(info.tl)})</h3>
    `;
			document.querySelector(
				'title'
			).innerText = `School Hasn't Started Yet!`;
		}
	} else if (info.currentPd.name == 'Passing') {
		document.querySelector('title').innerText = `Period ${
			info.nextPd.name
		} starts in ${formatTime(info.nextPdStartsIn)}`;
		HTMLOut = `
        <h2 class="subtitle">Period:</h2>
        <h3>${info.currentPd.name}</h3>

        <h2 class="subtitle">Next Period:</h2>
        <h3>${info.nextPd.name}</h3>
        <h2 class="subtitle">Starts At:</h2>
        <h3 id="time-left">${time(info.nextPd.start, true)} (In ${formatTime(
			info.nextPdStartsIn
		)})</h3>`;
	} else {
		HTMLOut = `<h2 class="subtitle">Period:</h2>
    <h3 id="current-period">${info.currentPd.name}</h3>
    <h2 class="subtitle">Ends At:</h2>
    <h3 id="time-left">${time(info.currentPd.end, true)} (${formatTime(
			info.currentPdTimeLeft
		)} left)</h3>`;
		if (info.nextPd.inClass != false) {
			HTMLOut += `<h2 class="subtitle">Next Period:</h2>
    <h3>${info.nextPd.name}</h3>
    <h2 class="subtitle">Starts At:</h2>
    <h3 id="time-left">${time(info.nextPd.start, true)} (In ${formatTime(
				info.nextPdStartsIn
			)})</h3>
    `;
		}
		document.querySelector('title').innerText = `Period ${
			info.currentPd.name
		} : ${formatTime(info.currentPdTimeLeft)}`;
	}
	document.querySelector('#schedule').innerHTML = HTMLOut;
	updateClock();
}

function time(t) {
	// return new Date(`${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2, '0')}-${currentDate.getDate()}T${t}:00`)
	if (typeof t == 'string') {
		return new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			currentDate.getDate(),
			t.split(':')[0],
			t.split(':')[1],
			t.split(':').length == 3 ? t.split(':')[2] : 0
		);
	} else {
		return formatTime(
			t.getHours() * 60 + t.getMinutes(),
			t.getSeconds(),
			searches.twelveHour
		);
	}
}

function createClass(name, start, end) {
	return {
		name,
		start: time(start),
		end: time(end),
	};
}

function formatTime(seconds, twelveHour = false) {
	seconds += offset;

	let hour = seconds / 3600;
	let min = Math.floor(seconds / 60) % 60;
	let sec = Math.floor(seconds % 60);

	hour = twelveHour ? (hour % 12 === 0 ? 12 : 0) : hour;

	hour = Math.floor(hour);

	let hourS = (hour + '').padStart(2, 0);
	min = min + '';
	sec = (sec + '').padStart(2, 0);

	return hour == 0 ? `${min}:${sec}` : `${hour}:${min.padStart(2, 0)}:${sec}`;
}

function updateClock() {
	const date = new Date();

	const hr =
		searches.twelveHour || false
			? date.getHours() % 12 === 0
				? 12
				: 0
			: date.getHours();

	const hour = ('' + hr).padStart(2, 0);
	const mins = ('' + date.getMinutes()).padStart(2, 0);
	const secs = ('' + date.getSeconds()).padStart(2, 0);

	clock.innerHTML = `<br><br><h2 class="subtitle" id="clock">${hour}:${mins}:${secs}</h2>`;
}

function resize() {
	// document.querySelector("p#w").innerText = window.innerWidth;
	// document.querySelector("p#h").innerText = window.innerHeight;

	if (window.innerHeight * 1.1 > window.innerWidth) {
		document.querySelector('div.content').style.display = 'block'; // justify-content: space-between;
		document.querySelector('#schedule-img').style.width = '85%';
	} else {
		document.querySelector('div.content').style = '';
		document.querySelector('#schedule-img').style = '';
	}
}
window.onresize = resize;
resize();

timeLoopAndUpdate();
setInterval(timeLoopAndUpdate, 500);
