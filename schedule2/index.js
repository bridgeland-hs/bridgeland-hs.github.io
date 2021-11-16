// Maybe I'll finish this, but for now, I'm just going to change the original

let currentDate = new Date(); // Able to update this for testing purposes.

window.onload = async () => {
  loadSettings();
  await loadSchedules();
  loadPanels();
};


const clock = document.querySelector('#clock');

const updateClock = () => {
  const t = new Date();
  const hrs = t.getHours() > 12 && settings.twelveHour
    ? t.getHours() - 12
    : t.getHours();
  const hours = (`${hrs}`).padStart(2, '0');
  const minutes = (`${t.getMinutes()}`).padStart(2, '0');
  const seconds = (`${t.getSeconds()}`).padStart(2, '0');

  clock.innerHTML = `<h1 class="clock-display">${hours}:${minutes}${settings.showSeconds ? (`:${seconds}`) : ''}</h1>`;
};

updateClock();
setInterval(updateClock, 250);
