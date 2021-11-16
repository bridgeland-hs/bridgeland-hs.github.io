const panels = {
  clock: {
    elt: document.querySelector('#clock'),
    current: {
      x: 0,
      y: 0,
    },
    initial: {
      x: 0,
      y: 0,
    },
    offset: {
      x: 0,
      y: 0,
    },
  },
};

let dragging = null;

function dragStart(e) {
  if (dragging === null) return;
  console.log(e.target);

  if (e.target.id in panels) {
    dragging = panels[e.target.id];
  }
  if (e.type === 'touchstart') {
    dragging.initial.x = e.touches[0].clientX - dragging.offset.x;
    dragging.initial.y = e.touches[0].clientY - dragging.offset.y;
  } else {
    dragging.initial.x = e.clientX - dragging.offset.x;
    dragging.initial.y = e.clientY - dragging.offset.y;
  }
}

function dragEnd() {
  if (dragging === null) return;
  dragging.initial.x = dragging.current.x;
  dragging.initial.y = dragging.current.y;

  dragging = null;
}

function setTranslate(xPos, yPos, el) {
  if (dragging === null) return;
  el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

function drag(e) {
  if (dragging !== null) {
    e.preventDefault();

    if (e.type === 'touchmove') {
      dragging.current.x = e.touches[0].clientX - dragging.initial.x;
      dragging.current.y = e.touches[0].clientY - dragging.initial.y;
    } else {
      dragging.current.x = e.clientX - dragging.initial.x;
      dragging.current.y = e.clientY - dragging.initial.y;
    }

    dragging.offset.x = dragging.current.x;
    dragging.offset.y = dragging.current.y;

    setTranslate(dragging.current.x, dragging.current.y, dragging.elt);
  }
}

// eslint-disable-next-line no-unused-vars
const loadPanels = () => {
  Object.entries(panels)
    .forEach(([key, elt]) => {
      document.querySelector(`button#${key}-toggle`)
        .addEventListener('click', () => {
          elt.elt.classList.toggle('hide');
        });

      document.body.addEventListener('touchstart', dragStart, false);
      document.body.addEventListener('touchend', dragEnd, false);
      document.body.addEventListener('touchmove', drag, false);

      document.body.addEventListener('mousedown', dragStart, false);
      document.body.addEventListener('mouseup', dragEnd, false);
      document.body.addEventListener('mousemove', drag, false);
    });
};
