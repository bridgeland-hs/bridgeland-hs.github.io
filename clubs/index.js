import * as json from '../json/json.js';

const table = document.querySelector('#clubs');
const nameFilter = document.querySelector('#name-filter');
const loadingIcon = document.querySelector('#loading');

const addClub = (club) => {
  const tr = document.createElement('tr');
  tr.classList.add('table-dark');
  Object.keys(club)
    .forEach((k, i) => {
      if (k === 'info_video') return; // Skip for now, may get proper data later
      const td = document.createElement(i === 0 ? 'th' : 'td');
      td.innerText = club[k];
      if (k === 'sponsor' && club[k].toLowerCase()
        .endsWith('@cfisd.net')) {
        td.innerText = club[k].split('@')[0].replace(/\./g, ' ');
      }
      tr.appendChild(td);
    });
  table.querySelector('tbody')
    .appendChild(tr);
};

window.onload = async () => {
  const clubs = await json.load('clubs.json');

  loadingIcon.style.display = 'none';

  if (!clubs) {
    alert('Error loading page!');
  }

  Object.keys(clubs[0])
    .forEach((k) => {
      if (k === 'info_video') return; // Skip for now, may get proper data later
      const th = document.createElement('th');
      th.innerText = k
        .split('_')
        .map((s) => s[0].toUpperCase() + s.substr(1))
        .join(' ');
      th.scope = 'col';
      table.querySelector('thead tr')
        .appendChild(th);
    });

  clubs.forEach(addClub);

  nameFilter.addEventListener('input', (e) => {
    e.preventDefault();
    table.querySelector('tbody').innerHTML = '';
    const filter = nameFilter.value.toLowerCase();
    clubs
      .filter(
        (club) => club.name.toLowerCase()
          .includes(filter)
          || club.sponsor.toLowerCase()
            .includes(filter),
      )
      .forEach(addClub);
  });
};
