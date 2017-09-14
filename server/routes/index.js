'use strict';

//
// Route index
//   The global route configuration file
//
const router = require('express').Router();

router.use('/', require('./base'));
router.use('/sif', require('./sif'));
router.use('/blog', require('./blog'));
router.use('/react', require('./react-base'));

module.exports = router;
