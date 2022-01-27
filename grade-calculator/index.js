const table = {
  daily: {
    short: 'dg',
    // stuPts, maxPts, weight, percent, points
  },
  assessment: {
    short: 'as',
    // stuPts, maxPts, weight, percent, points
  },
  major: {
    short: 'mg',
    // stuPts, maxPts, weight, percent, points
  },
  totals: {
    // weight, points
  },
};

const categories = ['daily', 'assessment', 'major'];

const updateTotals = () => {
  const weightTotal = table.daily.weight.valueAsNumber
    + table.assessment.weight.valueAsNumber
    + table.major.weight.valueAsNumber;
  const pointsTotal = table.daily.pts + table.assessment.pts + table.major.pts;

  if (Number.isNaN(weightTotal)) {
    table.totals.weight.value = 0;
  } else {
    table.totals.weight.innerText = weightTotal;
  }

  if (Number.isNaN(pointsTotal)) {
    table.totals.points.value = 0;
  } else {
    table.totals.points.innerText = pointsTotal;
  }
};

const update = (e) => {
  if (e?.valueAsNumber < 0) {
    e.value = 0;
  }

  // Update all values
  for (const key of categories) {
    const category = table[key];
    const percent = Math.round(
      (category.stuPts.valueAsNumber / (category.maxPts.valueAsNumber || 1)) * 10000,
    ) / 100;

    category.percent.innerText = `${percent}%`;

    category.pts = category.weight.valueAsNumber * (percent / 100);
    category.pts *= 1000;
    category.pts = Math.round(category.pts);
    category.pts /= 1000;

    category.points.innerText = category.pts;
  }

  updateTotals();
};

window.onload = () => {
  // Setup all elements
  for (const key in table) {
    const row = table[key];

    // Add input values
    const arr = document.querySelectorAll(`#${row.short}Row input`);
    row.stuPts = arr[0];
    row.maxPts = arr[1];
    row.weight = arr[2];

    arr.forEach(e => {
      e.value = e.value || 0; // Set values to 0 if there's nothing there already
    });

    // Add percent and points output
    row.percent = document.querySelector(`#${row.short}Row #percent`);
    row.points = document.querySelector(`#${row.short}Row #points`);

    // Custom calculated values for background stuff
    row.pts = 0; // Points for each category, same as category points
  }

  // Add the totals row
  table.totals = {
    weight: document.querySelector('#totalRow #weight'),
    points: document.querySelector('#totalRow #points'),
  };

  // Make every input run the 'update' function
  document.querySelectorAll('input')
    .forEach((input) => input.addEventListener('input', update));

  // Update all values when finished loading
  update();
};
