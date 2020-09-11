const currentDate = new Date();

// const schedule = {
//     regular: ["7:20", "8:11"],
//     advisory: ["7:20", "8:06"],
// }

const schedule = {
    "regular": {
        "before_lunch": [createClass("1", "7:20", "8:11"), createClass("2", "8:17", "9:13"), createClass("3", "9:19", "10:10")],
        "lunch_a": [createClass("lunch", "10:10", "10:40"), createClass("4", "10:49", "11:39"), createClass("5", "11:45", "12:50")],
        "lunch_b": [],
        "lunch_c": [],
        "lunch_d": [],
        "after_lunch": []
    },
    "advisory": ["7:20", "8:06"]
}

function timeLeft() {
    const currentTime = new Date();

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