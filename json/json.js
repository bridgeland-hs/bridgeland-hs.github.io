// eslint-disable-next-line no-unused-vars
const json = {

  /**
   * Load a JSON file from the GitHub repo
   * @param {String} file The file to load
   * @returns The content of the file
   */
  async load(file) {
    try {
      const fileT = file.endsWith('.json') ? file : `${file}.json`;
      const url = `../json/${fileT}`;
      const response = await fetch(url);
      return response.json();
    } catch (ex) {
      console.error(ex);
      return null;
    }
  },
};
