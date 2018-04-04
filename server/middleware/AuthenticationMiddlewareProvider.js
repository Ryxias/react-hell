'use strict';

class AuthenticationMiddlewareProvider {

  apiRequiresLoggedInUser() {
    const apiRequiresLoggedInUserMiddleware = (req, res, next) => {
      if (!('user' in req) || !req.user) {
        return res.send(403).send({
          success: false,
          message: 'You must be logged in to use this',
          code: 'not_logged_in',
        });
      }

      next();
    };
    return apiRequiresLoggedInUserMiddleware;
  }

}
module.exports = AuthenticationMiddlewareProvider;
