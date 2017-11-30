'use strict';

const router = require('express').Router();


/**
 * The universal react root, sending the react index file
 */
router.get('/', (req, res, next) => {
  res.sendFile(
    'index.html',
    {
      root: `${PROJECT_ROOT}/public`
    }
  );
});


router.get('/*', (req, res, next) => {
  res.redirect('/');
});


module.exports = router;
