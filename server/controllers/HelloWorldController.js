'use strict';

const { Controller } = require('express-route-registry');

class HelloWorldController extends Controller {

  /**
   * FIXME (thekevinwang) fill me in!
   */
  index_action(req, res, next) {
    return res.send(
`
<html>
  <body>
    <div>Hello world!</div>
  </body>
</html>

<script>
  alert('omfg');
</script>
`
    );
  }

}
module.exports = HelloWorldController;
