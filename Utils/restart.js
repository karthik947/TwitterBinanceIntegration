let restart = {
  TO: '',
  update() {
    clearTimeout(restart.TO);
    restart.TO = setTimeout(process.exit, 30 * 1000); //restart in 30 secs
  },
};

module.exports = restart;
