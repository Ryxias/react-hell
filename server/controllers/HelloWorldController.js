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
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css" integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt" crossorigin="anonymous">
  </head>

  <body>
    <a class="fixedLink" href="https://www.instagram.com/thekevinwang">
      <i class="fab fa-instagram"></i>the<strong>kevinwang</strong>
    </a>

    <div class="nav">
      <nbsp>
      <a href="#pageOne">1</a>
      <a href="#pageTwo">2</a>
      <a href="#pageThree">3</a>
      <a href="#pageFour">Form</a>
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
    <div class"fullPage" id="pageFour">
      <h1>Leave a note!</h1>
      <p>
        <form method="post" action="/helloworld/form">
          Name: <br>
          <input type="text" name="username" placeholder="Who are you?">
          <br>
          Comment: <br>
          <textarea name="text" rows="5" cols="30" placeholder="Leave me a message!"></textarea>
          <br><br>
          <input type="submit" value="Send">
        </form>
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
   * Controller for Kevin's form
   */
  form_action(req, res, next) {
    const username = req.body.username;
    const text = req.body.text;

    // Don't worry too much about this line YET. I can explain how it works eventually.
    const CommentModel = this.get('ConnectionManager').get('Comment')
    const new_comment = CommentModel.build();

    new_comment.username = username;
    new_comment.text = text;

    // Ooof...
    // this syntax may look super gnarly. Don't worry too much about it yet!
    return new_comment.save()
      .then(() => {
        return res.redirect('/helloworld');
      }
    );
    // return res.send(
    //   `
    //   <html>
    //     <head>
    //       <title>Form</title>
    //       <link rel="stylesheet" rel="text/css" href="/statics/css/helloworld.css">
    //       <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css" integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt" crossorigin="anonymous">
    //     </head>
    //     <body>
    //       <div class"fullPage" id="pageFour">
    //         <h1>You left a note!</h1>
    //         <p>
    //           ${username} said: <br> "${text}" <br>
    //           <br>
    //           <a href="/helloworld"><i class="fas fa-arrow-circle-left"></i><a>
    //         </p>
    //       </div>
    //     </body>
    //   <html>
    //   `
    // );
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
