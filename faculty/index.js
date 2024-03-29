import * as json from '../json/json.js';
const teacherList = document.querySelector('#faculty-list');
const nameFilter = document.querySelector('#name-filter');
const list = document.querySelector('#list');
const loadingIcon = document.querySelector('#loading');

const addName = (teacher) => {
  const li = document.createElement('li');
  li.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-center',
  );
  li.innerHTML = `
      <h3 class="name">${teacher.name}</h3>
      <a href="mailto:${teacher.email}">${teacher.email}</a>
  `;
  teacherList.appendChild(li);
};

window.onload = async () => {
  const teachers = await json.load('teachers.json');
  teachers.forEach(addName);
  loadingIcon.style.display = 'none';

  nameFilter.addEventListener('input', (e) => {
    e.preventDefault();
    teacherList.innerHTML = '';
    const filter = nameFilter.value.toLowerCase();
    teachers.filter((teacher) => teacher.name.toLowerCase()
      .includes(filter))
      .forEach(addName);
  });
};
