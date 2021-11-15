const currentDate = new Date(); // Able to update this for testing purposes.

window.onload = async () => {
  loadSettings();
  loadSchedules();
};

const dragItem = document.querySelector('#settings');
const container = document.querySelector('body');

let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
function dragStart(e) {
  if (e.type === 'touchstart') {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }

  if (e.target === dragItem) {
    active = true;
  }
}

function dragEnd() {
  initialX = currentX;
  initialY = currentY;

  active = false;
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

function drag(e) {
  if (active) {
    e.preventDefault();

    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, dragItem);
  }
}

container.addEventListener('touchstart', dragStart, false);
container.addEventListener('touchend', dragEnd, false);
container.addEventListener('touchmove', drag, false);

container.addEventListener('mousedown', dragStart, false);
container.addEventListener('mouseup', dragEnd, false);
container.addEventListener('mousemove', drag, false);
