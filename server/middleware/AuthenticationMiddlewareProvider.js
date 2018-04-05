'use strict';

class AuthenticationMiddlewareProvider {

  apiRequiresLoggedInUser() {
    const apiRequiresLoggedInUserMiddleware = (req, res, next) => {
      if (!('user' in req) || !req.user) {
        return res.status(403).send({
          success: false,
          message: 'You must be logged in to use this',
          code: 'not_logged_in',
        });
      }

      return next();
    };
    return apiRequiresLoggedInUserMiddleware;
  }

}
module.exports = AuthenticationMiddlewareProvider;
