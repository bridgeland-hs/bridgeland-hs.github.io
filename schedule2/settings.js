// Handles all of the setting configuration and such

const settingsElt = document.querySelector('div#settings');
const settingsElts = {
  twelveHour: settingsElt.querySelector('input#twelve-hour'),
};

const getSetting = (setting) => {
  const value = localStorage.getItem(`settings.${setting}`);
  if (value === null) return null; // null
  if (Number.parseFloat(value)) return +value; // Number
  if (value === 'null') return null; // 'null'
  if (!Number.isNaN(new Date(`${value}`).valueOf())) return new Date(value); // Date
  return (value === 'true' || value === 'false') ? (value === 'true') : value; // Boolean or Default
};

const setSetting = (setting, value) => {
  localStorage.setItem(`settings.${setting}`, value);
};

const settings = {
  twelveHour: getSetting('twelveHour') ?? false, // Boolean
  lunch: getSetting('lunch') ?? 'a', // String: 'a' | 'b' | 'c' | 'd'
};

const toggleSettings = () => {
  if (settingsElt.classList.contains('hide')) {
    settingsElt.classList.remove('hide');
  } else {
    settingsElt.classList.add('hide');
  }
};

const updateSetting = (setting, value) => {
  setSetting(setting, value);
  settings[setting] = value;
};

// eslint-disable-next-line no-unused-vars
const loadSettings = () => {
  document.querySelector('button#settings-toggle').addEventListener('click', toggleSettings);
};
