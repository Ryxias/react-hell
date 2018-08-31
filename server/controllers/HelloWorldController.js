'use strict';

const { Controller } = require('express-route-registry');

class HelloWorldController extends Controller {

  /*
   *  Derek wrote "Service Container", which names the 'service' after the CLASS.
   *  class - you're creating a definition or prototype in javascript.
   *  "new" keyword - how you create an instance of a class.

   *  ServiceContainer is creating an instance for you.
   *  when you use new, you're calling the constructor method.
   */

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
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css" integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt" crossorigin="anonymous">
  </head>

  <body>
    <a class="fixedLink" href="https://www.instagram.com/thekevinwang">
      <i class="fab fa-instagram"></i>the<strong>kevinwang</strong>
    </a>

    <div class="nav">
      <a href="#pageOne">1</a>
      <a href="#pageTwo">2</a>
      <a href="#pageThree">3</a>
      <a href="#pageFour">4</a>
    </div>

    <div class="fullPage" id="pageOne">
      <h1>Kevin here</h1>
    </div>
    <div class="fullPage" id="pageTwo">
      <h1>I'm a noob at web development...</h1>
    </div>
    <div class="fullPage" id="pageThree">
      <h1>...and all things Code.</h1>
      <p>
        It's all quite tricky when you have a degree in <strong>Jazz Performance</strong>.<br>
        <br><a href="#pageOne"><i class="fas fa-caret-up"></i></a>
        <!-- check fontawesome.com -->
      </p>
    </div>
    <div class="fullPage" id="pageFour">

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

  get_form_action(req, res, next) { //sending the browser some HTTP that renders a formbox. a get-verb and the form-route

    return res.send(

      //method value == HTTP verb
      //browser is the method, and figures out where to send the action
      `
      <html>
        <body>
          <form method="POST" action="/form">
            <input type="text" name="name" />
            <input type="text" name="comment" />
            <input type="submit" value="Submit" />
          </form>
        </body>
      </html>
      `
    );
  }

  post_form_action(req, res, next) {
    const name = req.body.name;
    const comment = req.body.comment;
    return res.send(
      //string interpolation ${}
      `
      Hi ${name}. You said ${comment}
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
