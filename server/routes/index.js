'use strict';

//
// Route index
//   The global route configuration file
//
const router = require('express').Router();

router.use('/react', require('./react-base'));
router.use('/', require('./base'));
router.use('/sif', require('./sif'));
router.use('/blog', require('./blog'));

module.exports = router;
