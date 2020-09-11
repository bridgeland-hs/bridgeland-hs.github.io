const currentDate = new Date();
const schedule = {
    "regular": {
        "before_lunch": [
            createClass("1", "7:20", "8:11"),
            createClass("2", "8:17", "9:13"),
            createClass("3", "9:19", "10:10"),
        ],

        "lunch_a": [
            createClass("lunch", "10:10", "10:40"),
            createClass("4", "10:49", "11:39"),
            createClass("5", "11:45", "12:50"),
        ],
        "lunch_b": [
            createClass("4", "10:16", "11:09"),
            createClass("lunch", "11:09", "11:39"),
            createClass("5", "11:45", "12:50"),
        ],
        "lunch_c": [
            createClass("4", "10:16", "11:09"),
            createClass("5a", "11:15", "11:44"),
            createClass("lunch", "11:44", "12:14"),
            createClass("5d", "12:20", "12:50"),
        ],
        "lunch_d": [
            createClass("4", "10:16", "11:09"),
            createClass("5", "11:15", "12:20"),
            createClass("lunch", "12:20", "12:50"),
        ],

        "after_lunch": [
            createClass("6", "12:56", "13:47"),
            createClass("7", "13:53", "14:50"),
        ]
    },
    "advisory": ["7:20", "8:06"]
}
const currentSchedule = currentDate.getDay() == 3 ? schedule.advisory : schedule.regular;
const lunch = "c";

// const schedule = {
//     regular: ["7:20", "8:11"],
//     advisory: ["7:20", "8:06"],
// }


function timeLeft(d = new Date()) {
    const t = d; // current date
    // Math.round((time("18:00")-t)/60000) //

    if (t.getDay() == 0 || t.getDay() == 6) {
        console.log("weekend");
    } else {
        if (Math.round((currentSchedule.before_lunch[0].start - t) / 60000) > 0) {
            console.log(`BEFORE CLASS ${formatTime(Math.round((currentSchedule.before_lunch[0].start - t) / 60000))} Left`);

        } else {
            startTimes = []
            let currentPeriod;
            for (var c of currentSchedule.before_lunch) {
                const minsStart = Math.round((c.start - t) / 60000);
                const minsEnd = Math.round((c.end - t) / 60000);
                if(minsStart <= 0 && minsEnd >= 0) currentPeriod = c;
                if (minsStart > 0) startTimes.push(c);
                console.log(`${c.name}: ${minsStart}, ${minsEnd}`);
            }
            // for (var c of currentSchedule["lunch_" + lunch]) {
            //     const mins = Math.round((c.start - t) / 60000);
            //     if (mins > 0) startTimes.push(c);
            //     console.log(`${c.name}: ${mins}`);
            // }
            // for (var c of currentSchedule.after_lunch) {
            //     const mins = Math.round((c.start - t) / 60000);
            //     if (mins > 0) startTimes.push(c);
            //     console.log(`${c.name}: ${mins}`);
            // }
            startTimes.sort((a, b) => {a.start-b.start});
            console.log(startTimes);
            console.log(`Current Period: ${c.name}`);
        }
    }

}

function time(time) {
    // return new Date(`${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2, '0')}-${currentDate.getDate()}T${time}:00`)
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), time.split(':')[0], time.split(':')[1])
}

function createClass(name, start, end) {
    return {
        name,
        start: time(start),
        end: time(end)
    }
}

function formatTime(mins) {
    return `${String(Math.floor(mins/60)).padStart(2, 0)}:${String(mins % 60).padStart(2, 0)}`;
}