'use strict';

const { Controller } = require('express-route-registry');

class HelloWorldController extends Controller {

  /**
   * FIXME (thekevinwang) fill me in!
   */
  index_action(req, res, next) {
    const variable = 'This is how you put stuff in!';


    return res.send(
`
<html>
  <body>
    <ul>
      <li>Hello!</li>
      <li>World!</li>
      <li>${variable}</li>
    </ul>
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
            message: 'Your webserver is up and running',
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
