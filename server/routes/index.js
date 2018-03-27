'use strict';

//
// Route index
//   The global route configuration file
//
const router = require('express').Router();

// The API router needs to be registered before base, due to the /* matcher
router.use('/api', require('./api'));

router.use('/', require('./base'));

router.use('/blog', require('./blog'));

module.exports = router;
