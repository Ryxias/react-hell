'use strict';

const router = require('express').Router();

// Welcome page
router.get('/', (req, res, next) => {
  res.sendfile('index.html', { root: `${__dirname}/../../public_react` })
});

module.exports = router;
