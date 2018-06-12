'use strict';

const { Controller } = require('express-route-registry');

class HelloWorldController extends Controller {

  /*
   * FIXME (thekevinwang) fill me in!
   */
  index_action(req, res, next) {
    const variable = '& < > " \' /' ;
    var today = Date();

    return res.send(

      //for stylesheet's href:
      //http://localhost:8000/statics/css/helloworld.css   - when working locally
      //http://chuuni.me/statics/css/helloworld.css        - before pushing to origin
`
<html>
  <head>
    <link rel="stylesheet" href="http://chuuni.me/statics/css/helloworld.css">
  </head>
  <body>
    <header>
      <h1>byKevin</h1>
    </header>
      <br>

      <div align='center'>
        <button type="button" onclick="play_sr_open()">Magical Sound!</button>
        <audio id="sr_open" src="https://chuuni.me/statics/sound/sr_open.mp3" autostart="false" ></audio>
        <audio id="ur_open" src="https://chuuni.me/statics/sound/ur_open.mp3" autostart="false" ></audio>
        <script>
          function play_sr_open() {
            var sound = document.getElementById("sr_open");
            sound.play()
          }
          function play_ur_open() {
            var sound = document.getElementById("ur_open");
            sound.play()
          }
        </script>
      </div>


    <p>
      ...or click bunny for another sound!<br>
      <img onclick="play_ur_open()" src="https://pbs.twimg.com/profile_images/965036344216039424/NQOVAYZ-_400x400.jpg"; height="200"; width="200";> <br>
      I started coding this page on <br>
      6 . 6 . 2 0 1 8 <br>
    </p>
      <hr color='F53D41' size="1px" width='300px'/>


    <p>
      <strong>Strong Text</strong><br>
      <a href="https://www.google.com" target="_blank">Google</a> - opens in new tab!<br>
    </p>
        <hr color='F53D41' size="1px" width='300px'/><br>

    <p>
        Below, I used JavaScript & js string interpolation for "\${Date()}"
        <ul id="date" align="center">

          <script>
            document.getElementById("date").innerHTML = "${today}";
          </script>
        </ul>

        </li>
        <li>${variable}</li>
        api.openweathermap.org/data/2.5/forecast?zip={zip code},{country code}
    </p>

    <!-- begin HTML COMMENT BOX -->
      <div id="HCB_comment_box"><a href="http://www.htmlcommentbox.com">Comment Box</a> is loading comments...</div>

      <link rel="stylesheet" type="text/css" href="//www.htmlcommentbox.com/static/skins/bootstrap/twitter-bootstrap.css?v=0" />

      <script type="text/javascript" id="hcb">
        if(!window.hcb_user){hcb_user={};} (function(){var s=document.createElement("script"),
        l=hcb_user.PAGE || (""+window.location).replace(/'/g,"%27"),
        h="//www.htmlcommentbox.com";s.setAttribute("type","text/javascript");
        s.setAttribute("src", h+"/jread?page="+encodeURIComponent(l).replace("+","%2B")+"&opts=16862&num=10&ts=1528389398444");
        if (typeof s!="undefined") document.getElementsByTagName("head")[0].appendChild(s);})(); /*-->*/
      </script>
    <!-- end HTML COMMENT BOX  -->

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
