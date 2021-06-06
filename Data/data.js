const jsonfile = require('jsonfile');
const path = require('path');
const file = path.join(__dirname, 'data.json');
const writeOptions = { spaces: 2, EOL: '\r\n', finalEOL: false };

let config = {
  async get() {
    try {
      return await jsonfile.readFile(file);
    } catch (err) {
      throw err;
    }
  },
  async set(pl) {
    try {
      let { items } = await jsonfile.readFile(file);
      items = items.find((d) => d.id === pl.id)
        ? items.map((d) => (d.id === pl.id ? pl : d))
        : [pl, ...items];
      return await jsonfile.writeFile(file, { items }, writeOptions);
    } catch (err) {
      throw err;
    }
  },
  async delete({ id }) {
    try {
      let { items } = await jsonfile.readFile(file);
      items = items.filter((d) => d.id !== id);
      return await jsonfile.writeFile(file, { items }, writeOptions);
    } catch (err) {
      throw err;
    }
  },
  async saveAll(items) {
    try {
      return await jsonfile.writeFile(file, { items }, writeOptions);
    } catch (err) {
      throw err;
    }
  },
};

module.exports = config;
