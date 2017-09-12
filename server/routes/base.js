'use strict';

const router = require('express').Router();

// Welcome page
router.get('/', (req, res, next) => {
  return res.render('index',
    {
      header: true,
      footer: true,
      title: 'Chuuni.me - Home of the Chuuni',
      css: ['index.css'],

      message: 'What even is CSS',
    }
  );
});


// Anime crap
router.get('/animu', (req, res, next) => {
  res.redirect('/');
});

// D&D resources
router.get('/dnd', (req, res, next) => {
  res.redirect('/');
});

module.exports = router;
