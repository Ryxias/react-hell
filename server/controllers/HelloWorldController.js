'use strict';

const { Controller } = require('express-route-registry');

class HelloWorldController extends Controller {

  /*
   * FIXME (thekevinwang) fill me in!
   */
  index_action(req, res, next) {
    const variable = '& < > " \' /' ;

    return res.send(
`
<html>
  <head>
    <link rel="stylesheet" href="http://localhost:8000/statics/css/helloworld.css">
  </head>
  <body>
    <h1>Red &lt;h1?&gt;</h1>

      <button id="sound"; type="button" onclick="sound()">Sound</button>


    <p>Here's there start of a paragraph. Unordered list below... <br>
    <p>Also, I'm using an external CSS file!</p>
      <ul>
        <li><b>Bold Text</b></li>
        <li><strong>Strong Text</strong></li>
        <li><a href="https://www.google.com" target="_blank">Google</a> opens in new tab!</li>
        <li>Below, I used JavaScript & js string interpolation for "\${Date()}"
        <li id="demo"></p>
          <script>
            document.getElementById("demo").innerHTML = "${Date()}";
          </script>
        <li>Below is a picture of a bunny... <br>
          <img src="https://pbs.twimg.com/profile_images/965036344216039424/NQOVAYZ-_400x400.jpg"; height="200"; width="200";>
        </li>
        <li>${variable}</li>
      </ul>
    </p>

    <!-- begin wwww.htmlcommentbox.com -->
      <div id="HCB_comment_box"><a href="http://www.htmlcommentbox.com">Comment Box</a> is loading comments...</div>
      <link rel="stylesheet" type="text/css" href="//www.htmlcommentbox.com/static/skins/bootstrap/twitter-bootstrap.css?v=0" />
      <script
        type="text/javascript" id="hcb"> /*<!--*/
        if(!window.hcb_user){hcb_user={};} (function(){var s=document.createElement("script"),
        l=hcb_user.PAGE || (""+window.location).replace(/'/g,"%27"),
        h="//www.htmlcommentbox.com";s.setAttribute("type","text/javascript");s.setAttribute("src", h+"/jread?page="+encodeURIComponent(l).replace("+","%2B")+"&opts=16862&num=10&ts=1528389398444");
        if (typeof s!="undefined") document.getElementsByTagName("head")[0].appendChild(s);})(); /*-->*/
      </script>
    <!-- end  -->

  </body>
</html>
`
    );
  }

  /**
   * Presents a health
   */
  health_check_action(req, res, next) {
    // Check database connection
    const checkDatabaseStatus = this.get('ConnectionManager').sequelize_connection.query('SHOW TABLES')
      .then(result => {
        // result returns a funky object. It's an array of objects with keys: "Tables_in_{dbname}"
        return {
          healthy: true,
          result,
        };
      })
      .catch(err => {
        return {
          healthy: false,
          error: err,
        };
      });

    return Promise.resolve([ checkDatabaseStatus ])
      .spread((database_status) => {
        const { message, healthy } = (() => {
          if (!database_status.healthy) {
            return {
              message: 'There seems to be a problem with your database',
              healthy: false,
            };
          }
          return {
            message: 'BEEP BEEP BOOP BOOP go to localhost:8000/helloworld ... Kevin',
            healthy: true,
          };
        })();
        return res.send({
          success: true,
          message,
          healthy,
          database: database_status,
        });
      })
      .catch(err => res.status(500).send({ success: false, message: err.message, system_code: '5000PYHBWLMANE'}));
  }

}
module.exports = HelloWorldController;
