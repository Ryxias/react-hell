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

  if(req.session.username == undefined){
    console.log("# Username not set in session yet");
  } else {
    console.log("# Username from session: "+ req.session.username);
  }

});


router.get('/*', (req, res, next) => {
  return res.redirect('/');
});


module.exports = router;
