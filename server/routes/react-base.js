'use strict';

const router = require('express').Router();

// Welcome page
router.get('/', (req, res, next) => {
  res.sendFile('index.html', { root: `${__dirname}/../../public_react` })
});

module.exports = router;
