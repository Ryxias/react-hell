'use strict';

const { Controller } = require('express-route-registry');

class HelloWorldController extends Controller {

  /*
   * FIXME (thekevinwang) fill me in!
   */
  index_action(req, res, next) {
    const today = Date();

    return res.send(

      //for stylesheet's href:
      //http://localhost:8000/statics/css/helloworld.css   - when working locally
      //http://chuuni.me/statics/css/helloworld.css        - before pushing to origin
`
<html>
  <head>
    <link rel="stylesheet" href="/statics/css/helloworld.css">
  </head>

  <body>
    <header>
      <h1>byKevin</h1>
    </header>
    <br>

    <div class="tab">
      <button class="tablinks" onclick="openTab(event, 'Home')">Home</button>
      <button class="tablinks" onclick="openTab(event, 'Instagram')">IG</button>
      <button class="tablinks" onclick="openTab(event, 'Medium')">Medium</button>
    </div>

    <div id="Home" class="tabcontent">
      <h3>Home</h3>
      <p>This is my home page!</p>
    </div>

    <div id="Instagram" class="tabcontent">
      <h3>Instagram</h3>
      <p>See my Instagram feed.</p>
    </div>

    <div id="Medium" class="tabcontent">
      <h3>Medium</h3>
      <p>Read about my coding adventures.</p>
    </div>



    <div align='center'>
      <button type="button" onclick="play_sr_open()">Magical Sound!</button>
      <audio id="sr_open" src="/statics/sound/sr_open.mp3" autostart="false" ></audio>
      <audio id="ur_open" src="/statics/sound/ur_open.mp3" autostart="false" ></audio>
    </div>


    <p>
      ...or click bunny for another sound!<br>
      <img onclick="play_ur_open()" src="https://pbs.twimg.com/profile_images/965036344216039424/NQOVAYZ-_400x400.jpg"; height="200"; width="200";> <br>
      I started coding this page on <br>
      6 . 6 . 2 0 1 8 <br>
    </p>

      <hr color='F53D41' size="1px" width='300px'/>

    <p>
        Below, I used JavaScript & js string interpolation for "\${Date()}"
        <ul id="date" align="center"></ul>

        </li>
    </p>

    <script>
      function openTab(evt, tabName) {
          var i, tabcontent, tablinks;
          tabcontent = document.getElementsByClassName("tabcontent");
          for (i = 0; i < tabcontent.length; i++) {
              tabcontent[i].style.display = "none";
          }
          tablinks = document.getElementsByClassName("tablinks");
          for (i = 0; i < tablinks.length; i++) {
              tablinks[i].className = tablinks[i].className.replace(" active", "");
          }
          document.getElementById(tabName).style.display = "block";
          evt.currentTarget.className += " active";
      }

      function play_sr_open() {
        var sound = document.getElementById("sr_open");
        sound.play()
      }
      function play_ur_open() {
        var sound = document.getElementById("ur_open");
        sound.play()
      }
      document.getElementById("date").innerHTML = "${today}";
    </script>

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
   * Controller action for testing
   */
  another_action(req, res, next) {
    return res.render('sample', {
      variable1: 'hello',
      variable2: 'world',

      foo_array: [
        {
          foo_name: 'zz',
          foo_value: 'aa',
        },
        {
          foo_name: 'qqqqqq',
          foo_value: 'ppikachu',
        },
        {
          foo_name: 'NNO',
          foo_value: 'aaaaaaaaaa',
        },
      ],
    });
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
