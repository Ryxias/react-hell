'use strict';

module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  bail: true,
  verbose: false,
  testRegex: "/__tests__/.*.spec.(js)?$",
  globalSetup: "./jest_init.js", // This filepath is relative to the config file
};
