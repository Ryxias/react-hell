'use strict';

const { Controller } = require('express-route-registry');

class HelloWorldController extends Controller {

  /*
   * FIXME (thekevinwang) fill me in!
   */
  index_action(req, res, next) {
    const today = Date();

    return res.send(


`
<html>
  <head>
    <title>Not Localhost</title>
    <link rel="stylesheet" rel="text/css" href="/statics/css/helloworld.css">
  </head>

  <body>
    <a class="fixedLink" href="https://www.instagram.com/thekevinwang">
      @the<strong>kevinwang</strong>
    </a>

    <div class="nav">
      <a href="#pageOne">1</a>
      <a href="#pageTwo">2</a>
      <a href="#pageThree">3</a>
    </div>

    <div class="fullPage" id="pageOne">
      <h1>Kevin here</h1>
    </div>
    <div class="fullPage" id="pageTwo">
      <h1>I'm a noob at web design...</h1>
    </div>
    <div class="fullPage" id="pageThree">
      <h1>...and all things Code.</h1>
      <p>
        It's all quite tricky when you have a degree in <strong>Jazz Performance</strong>.<br>
        <br><a href="#pageOne">: P</a>
      </p>
    </div>

    <script>
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
      });
    </script>
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
      variable3: 'Go Back',
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
