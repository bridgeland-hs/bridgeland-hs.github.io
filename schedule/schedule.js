const currentDate = new Date();
const lunchSel = document.querySelector("#lunch");
if(location.hash.match(/\#[abc]$/i)){
    lunchSel.value = location.hash[1];
}
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
            createClass("5b", "12:20", "12:50"),
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
let lunch = lunchSel.value;

// const schedule = {
//     regular: ["7:20", "8:11"],
//     advisory: ["7:20", "8:06"],
// }


function timeLeft(d = new Date()) {
    const t = d; // current date
    // Math.round((time("18:00")-t)/60000) //

    if (d.getDay() == 0 || d.getDay() == 6) {
        return {
            inClass: false,
            weekend: true,
            day: d.getDay == 0 ? "Sunday" : "Saturday"
        };
    } else {
        if (Math.round((currentSchedule.before_lunch[0].start - d) / 60000) > 0) {
            let tl = Math.round((currentSchedule.before_lunch[0].start - d) / 60000);
            return {
                inClass: false,
                before_school: true,
                after_school: false,
                tl
            };

        } else if (Math.round((currentSchedule.after_lunch[1].end - d) / 60000) < 0) {
            return {
                inClass: false,
                before_school: false,
                after_school: true,
                tl: 0
            };
        } else {
            let startTimes = []
            let currentPd = {
                name: "Passing",
                inClass: false,
                unset: true,
            };
            let nextPd = {
                name: "none"
            };
            for (var arr of ["before_lunch", "lunch_" + lunch, "after_lunch"]) {
                for (var c of currentSchedule[arr]) {
                    const minsStart = Math.round((c.start - d) / 60000);
                    const minsEnd = Math.round((c.end - d) / 60000);
                    if (currentPd.unset && minsStart <= 0 && minsEnd >= 0) currentPd = c;
                    if (minsStart > 0 || minsEnd > 0) startTimes.push(c);
                    console.log(`${c.name}: ${minsStart}, ${minsEnd}`);
                }
            }
            startTimes.sort((a, b) => {
                a.start - b.start
            });

            if (startTimes[0] == currentPd && startTimes.length > 1) {
                nextPd = startTimes[1];
            } else {
                nextPd = startTimes[0];
            }
            console.log(startTimes);
            let currentPdTimeLeft = Math.round((currentPd.end - d) / 60000);
            let nextPdStartsIn = Math.round((nextPd.start - d) / 60000);
            console.log(`Current Period: ${currentPd.name}, Time Left: ${currentPdTimeLeft}\nNext Period: ${nextPd.name}, Starts in: ${nextPdStartsIn}`);
            return {
                inClass: true,
                currentPd,
                currentPdTimeLeft,
                nextPd,
                nextPdStartsIn
            }
        }
    }

}

function timeLoopAndUpdate(d = new Date()) {
    lunchSel.value=lunch;
    location.hash = "#" + lunchSel.value;


    info = timeLeft(d);
    // document.querySelector("#time-left").innerText = formatTime(info.currentPdTimeLeft);
    // document.querySelector("#current-period").innerText = info.currentPd.name;
    console.log(info);
    if (!info.inClass) {
        if (info.weekend) {
            HTMLOut = `<h2 class="subtitle">It's ${info.day}, there's no school.</h2>`;
        } else if (info.after_school) {
            HTMLOut = `<h2 class="subtitle">School's over for today!</h2>`;
        } else if (info.before_school) {
            HTMLOut = `<h2 class="subtitle">School hasn't started yet.<h2>
    <h2 class="subtitle">Next Period:</h2>
    <h3>1</h3>
    <h2 class="subtitle">Starts At:</h2>
    <h3 id="time-left">7:20 (In ${formatTime(info.tl)})</h3>
    `
        }
    } else if (info.currentPd.name=="Passing") {
        HTMLOut = `
        <h2 class="subtitle">Period:</h2>
        <h3>${info.currentPd.name}</h3>

        <h2 class="subtitle">Next Period:</h2>
        <h3>${info.nextPd.name}</h3>
        <h2 class="subtitle">Starts At:</h2>
        <h3 id="time-left">${time(info.nextPd.start)} (In ${formatTime(info.nextPdStartsIn)})</h3>`
    } else {
        HTMLOut =
            `<h2 class="subtitle">Period:</h2>
    <h3 id="current-period">${info.currentPd.name}</h3>
    <h2 class="subtitle">Ends At:</h2>
    <h3 id="time-left">${time(info.currentPd.end)} (${formatTime(info.currentPdTimeLeft)} left)</h3>

    <h2 class="subtitle">Next Period:</h2>
    <h3>${info.nextPd.name}</h3>
    <h2 class="subtitle">Starts At:</h2>
    <h3 id="time-left">${time(info.nextPd.start)} (In ${formatTime(info.nextPdStartsIn)})</h3>
    `
    }

    document.querySelector("#schedule").innerHTML = HTMLOut


}

function time(t) {
    // return new Date(`${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2, '0')}-${currentDate.getDate()}T${t}:00`)
    if (typeof t == "string") {
        return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), t.split(':')[0], t.split(':')[1])
    } else {
        return formatTime(t.getHours() * 60 + t.getMinutes());
    }
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

function resize (){
    // document.querySelector("p#w").innerText = window.innerWidth;
    // document.querySelector("p#h").innerText = window.innerHeight;
    
    if(window.innerHeight*1.1>window.innerWidth){
        document.querySelector("div.content").style.display = "block"; //justify-content: space-between;
        document.querySelector("#schedule-img").style.width = "85%"

    }else{
        document.querySelector("div.content").style = "";
        document.querySelector("#schedule-img").style = "";

    }
    
}
window.onresize = resize;
resize();


console.log(`Page Loaded in ${new Date() - currentDate}ms`);



timeLoopAndUpdate();