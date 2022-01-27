export default {
  update() {
    let s = '?';
    Object.entries(this)
      .forEach(([k, v]) => {
        if (k !== 'update') {
          s += `${k}=${v}&`;
        }
      });
    window.location.search = s;
  },
};
