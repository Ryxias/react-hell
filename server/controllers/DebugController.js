'use strict';

const { Controller } = require('express-route-registry');

class DebugController extends Controller {

  /**
   * Renders all routes available to the application as JSON
   */
  get_all_routes_action(req, res, next) {
    res.send(this.get('RouteRegistry').getAll().map(this._publishRoute));
  }

  /**
   * When passed a query parameter of q="..." it will attempt to find a routing match,
   * or return nothing if no match.
   */
  get_match_routes_action(req, res, next) {
    const path = req.query.q;

    if (!path) {
      throw new BadRequestError('Please provide a path to match on query parameter "q".', '50000001IHUWGVEJFGKJWEHBF');
    }

    const route = this.get('RouteRegistry').match(path);

    if (route) {
      res.send(this._publishRoute(route));
    } else {
      res.status(404).send('No matching route found');
    }
  }

  _publishRoute(route) {
    const middleware = route.getMiddleware().map(_middleware => _middleware.name);
    const parameter_converters = route.getParameterConverters()
      .map(
        _converter => ({ id: _converter.id, parameter_converter: _converter.parameter_converter.name || '(Anonymous function)' })
      );

    return {
      methods: route.getMethods(),
      path: route.getCanonicalRoutePath(),
      controller_id: route.controller_service_id || null,
      controller_class: route.controller ? route.controller.constructor.name : null,
      action_name: ('string' === typeof route.action) ? route.action : route.action.name || null,
      name: route.getName(),
      middleware,
      parameter_converters,
    };
  }
}
module.exports = DebugController;
