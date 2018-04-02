'use strict';

const { Controller } = require('express-route-registry');

class AuthenticationController extends Controller {

  login_action(req, res, next) {
    this.get('PassportMiddleware').authenticateThroughPassport(function (error, user, info) {
      if (error) {
        return next(error);
      }
      if (!user) {
        return next(new Error(info.message));
      }
      return req.login(user, err => {
        if (err) {
          return next(err);
        }
        return res.send({
          success: true,
          user: user.publish()
        });
      })
    })(req, res, next);
  }

  whoami_action(req, res, next) {
    if (!req.user) {
      return {
        user: null,
        message: 'Not logged in',
      }
    }
    return res.send({
      user: req.user.publish(),
    });
  }

  logout_action(req, res, next) {
    req.logout();
    res.send({ success: true });
  }

  change_password_action(req, res, next) {
    const email = req.body.email;
    const old_password = req.body.old_password;
    const new_password = req.body.new_password;

    return this.get('UserStore').findUserByEmail(email)
      .then(user => {
        if (!user) {
          return res.status(404).send({
            success: false,
            message: 'Nope',
          });
        }
        return user.verifyPassword(old_password)
          .then(answer => {
            if (answer) {
              return user.setPasswordAndSave(new_password)
                .then(user => {
                  return res.send({ success: true, user });
                });
            } else {
              return res.status(403).send({ success: false, message: 'Wrong' });
            }
          });
      })
      .catch(err => res.status(400).send({
        success: false,
        message: err.message,
        error: err,
      }));
  }

  reset_password_action(req, res, next) {

  }

  register_action(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    return this.get('UserStore').createUser(email)
      .then(user => user.setPasswordAndSave(password))
      .then(user => res.send({
        success: true,
        message: 'Successfully registered',
        user: user.publish(),
      }))
      .catch(err => res.status(400).send({
        success: false,
        message: err.message,
        error: err,
      }));
  }

}
module.exports = AuthenticationController;
