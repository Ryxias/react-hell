'use strict';

//
// Route index
//   The global route configuration file
//
const router = require('express').Router();

router.use('/', require('./base'));
router.use('/sif', require('./sif'));

module.exports = router;
