'use strict';

const router = require('express').Router();

// Welcome page
router.get('/', (req, res, next) => {
  return res.render('index',
    {
      header: true,
      footer: true,
      title: 'Hello!',
      css: ['index.css'],

      message: 'Home of the Chuuni',
    }
  )
});

module.exports = router;
