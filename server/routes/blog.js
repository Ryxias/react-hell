'use strict';

const router = require('express').Router();
const showdown  = require('showdown');
const mdconverter = new showdown.Converter();
const fs = require('fs');
Promise.promisifyAll(fs);

router.get('/', (req, res, next) => {
  fs.readFileAsync(PROJECT_ROOT + '/blog/2017-09-10.md', 'utf8').then((data) => {
    let html = mdconverter.makeHtml(data);
    return res.render('blog',
      {
        header: true,
        footer: true,
        title: 'A Blahg of Learning',
        css: ['blog.css'],
        entry: html
      }
    );
  }).catch((err) => {
    console.log(err);
    throw err;
  });
});

router.get('/:date', (req, res, next) => {
  let date = req.params.date;

  if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) { // Only match XXXX-XX-XX
    return res.redirect('/blog');
  }

  fs.readFileAsync(PROJECT_ROOT + '/blog/'+date+'.md', 'utf8').then((data) => {
    let html = mdconverter.makeHtml(data);
    return res.render('blog',
      {
        header: true,
        footer: true,
        title: 'A Blahg of Learning',
        css: ['blog.css'],
        entry: html
      }
    );
  }).catch((err) => {
    console.log(err);
    return res.redirect("/blog");
  });
});

module.exports = router;
