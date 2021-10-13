const json = {
    
    urlBase: 'https://raw.githubusercontent.com/bridgeland-hs/bridgeland-hs.github.io/master/json/',

    /**
     * Load a JSON file from the GitHub repo
     * @param {String} file The file to load
     * @returns The content of the file
     */
    async load(file) {
        file = file.endsWith('.json') ? file : file + '.json';
        const response = await fetch(this.urlBase + file);
        const data = await response.json();
        return data;
    }
}