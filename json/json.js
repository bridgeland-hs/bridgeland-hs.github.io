/**
 * Load a JSON file from the GitHub repo
 * @param {String} file The file to load
 * @returns The content of the file
 */
export const load = async (file) => {
  try {
    const fileT = file.endsWith('.json') ? file : `${file}.json`;
    const url = `../json/${fileT}`;
    const response = await fetch(url);
    return response.json();
  } catch (ex) {
    console.error(ex);
    return null;
  }
};
