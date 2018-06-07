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
