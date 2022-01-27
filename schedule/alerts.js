// eslint-disable-next-line no-unused-vars
const alerts = {
  data: null,
  elt: document.querySelector('#alerts'),
  async load(customAlerts = {}) {
    this.data = this.get('alerts') || {};
    const data = {
      ...(await json.load('schedule-messages.json')),
      ...customAlerts,
    } || {};
    Object.entries(data)
      .forEach(([k, v]) => {
        if (this.data.hidden && this.data.hidden.includes(k)) return;
        const e = document.createElement('div');
        e.classList.add('alert', 'alert-dismissible', `alert-${v.type}`);

        const close = document.createElement('button');
        close.type = 'button';
        close.classList.add('btn-close');
        close.setAttribute('data-bs-dismiss', 'alert');
        e.appendChild(close);
        e.innerHTML += `<strong>${v.title}</strong><br>`;
        e.innerHTML += v.description;

        this.elt.appendChild(e);

        e.addEventListener('click', () => {
          e.classList.add('yeet'); // Animate the disappearance

          // update localstorage
          if (!this.data.hidden) this.data.hidden = [];
          this.data.hidden.push(k);
          this.put('alerts', this.data);

          setTimeout(() => { // Yeet the elt after css animation done
            this.elt.removeChild(e);
          }, 500);
        });
      });
  },
  put(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    return JSON.parse(window.localStorage.getItem(key));
  },
};
