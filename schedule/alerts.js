import * as json from '../json/json.js';
const elt = document.querySelector('#alerts');

export const put = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};
export const get = (key) => JSON.parse(window.localStorage.getItem(key));

const data = get('alerts') || {};

export const load = async (customAlerts = {}) => {
  const alerts = {
    ...(await json.load('schedule-messages.json')),
    ...customAlerts,
  } || {};
  Object.entries(alerts)
    .forEach(([k, v]) => {
      if (data.hidden && data.hidden.includes(k)) return;
      const e = document.createElement('div');
      e.classList.add('alert', 'alert-dismissible', `alert-${v.type}`);

      const close = document.createElement('button');
      close.type = 'button';
      close.classList.add('btn-close');
      close.setAttribute('data-bs-dismiss', 'alert');
      e.appendChild(close);
      e.innerHTML += `<strong>${v.title}</strong><br>`;
      e.innerHTML += v.description;

      elt.appendChild(e);

      e.addEventListener('click', () => {
        e.classList.add('yeet'); // Animate the disappearance

        // update localstorage
        if (!data.hidden) data.hidden = [];
        data.hidden.push(k);
        put('alerts', data);

        setTimeout(() => { // Yeet the elt after css animation done
          elt.removeChild(e);
        }, 500);
      });
    });
};
