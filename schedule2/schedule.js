let schedules = null;
let currentSchedule = null;

const getSchedules = async () => {
  schedules = await json.load('schedule.json');
  if (schedules == null) {
    alert('Failed to load schedules!');
    throw new Error('Failed to load schedules!');
  }
  return schedules;
};

// eslint-disable-next-line no-unused-vars
const loadSchedules = async () => {
  schedules = await getSchedules();

  const day = currentDate.getDay();

  switch (day) {
    case 1: // Weekdays
    case 2:
    case 4:
    case 5:
      currentSchedule = schedules.regular;
      break;
    case 3: // Advisory (Wednesday)
      currentSchedule = schedules.advisory;
      break;
    default: // Weekend
      currentSchedule = null;
      break;
  }
};
