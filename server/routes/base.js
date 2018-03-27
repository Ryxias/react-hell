'use strict';

const router = require('express').Router();


/**
 * The universal react root, sending the react index file
 */
router.get('/', (req, res, next) => {
  const path = require('path');
  const file = path.resolve(__dirname + `/../../public/index.html`);

  console.log('Sneding react index file: ' + file);
  return res.status(200).sendFile(file);
});


router.get('/*', (req, res, next) => {
  res.redirect('/');
});


module.exports = router;
