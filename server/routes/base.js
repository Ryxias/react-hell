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

// Blog
router.get('/blog', (req, res, next) => {
  return res.render('blog',
    {
      header: true,
      footer: true,
      title: 'A Blahg of Learning',
      css: ['blog.css'],
    }
  );
});

module.exports = router;
