'use strict';

const { Controller } = require('express-route-registry');

/**
 * All API endpoints that deal with authentication
 *
 * This is meant to be called through the browser as it leverages the session cookie
 *
 * A successfully logged in user is provided to other controllers at "req.user" via Passport. The absence of
 * this object means the user is not logged in.
 */
class AuthenticationController extends Controller {

  /**
   * User logins in
   */
  login_action(req, res, next) {
    this.get('PassportMiddleware').authenticateThroughPassport(function (error, user, info) {
      if (error) {
        return genericAuthenticationFailResponse(res, error, '40817394BEIUFNOWDO');
      }
      if (!user) {
        return genericAuthenticationFailResponse(res, info, '4397484PIEJFNSDF');
      }
      return req.login(user, err => {
        if (err) {
          return genericAuthenticationFailResponse(res, err, '50883489PLSFBEI');
        }
        return res.send({
          success: true,
          message: 'Login successful',
          system_code: '20098372872PLELEKSBSNEN',
          user: user.publish()
        });
      })
    })(req, res, next);

    function genericAuthenticationFailResponse(res, error, system_code = '000000XYABELFN') {
      return res.status(400).send({
        success: false,
        message: 'Authentication unsuccessful',
        system_code,
        error, // Maybe omit this in the future for security reasons
      });
    }
  }

  whoami_action(req, res, next) {
    if (!req.user) {
      return res.status(404).send({
        success: false,
        message: 'Not logged in',
        system_code: '40008197PLLZDFBEUNF',
        user: null,
      });
    }
    return res.send({
      success: true,
      message: 'User is logged in',
      system_code: '2000716263JJJEWEUFBE',
      user: req.user.publish(),
    });
  }

  logout_action(req, res, next) {
    req.logout();
    res.send({ success: true });
  }

  /**
   * Need to be logged in to do this
   */
  change_password_action(req, res, next) {
    const user = req.user;
    const old_password = req.body.old_password;
    const new_password = req.body.new_password;

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Not logged in',
        system_code: '400008PIMWIWIBANLXQP',
      });
    }
    return user.verifyPassword(old_password)
      .then(answer => {
        if (answer) {
          return user.setPasswordAndSave(new_password)
            .then(user => {
              return res.send({
                success: true,
                message: 'Password changed',
                system_code: '200006837BUENIENFL',
                user: user.publish(),
              });
            });
        } else {
          return res.status(403).send({
            success: false,
            system_code: '40000000IWMIMPLLQLQ',
            message: 'Wrong password',
          });
        }
      })
      .catch(err => {
        return res.status(400).send({
          success: false,
          message: 'Whoops, something went wrong!',
          system_code: '5000YYWVNLAXKWP',
          error: err,
        });
      });
  }

  /**
   *
   */
  register_action(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    return this.get('UserStore').findUserByEmail(email)
      .then(user => {
        if (user) {
          return res.status(409).send({
            success: false,
            message: 'A user with that email already exists',
            system_code: '4000201804040229LOWBNOEOPDQL',
          });
        }
        return this.get('UserStore').createUser(email)
          .then(user => user.setPasswordAndSave(password))
          .then(user => res.send({
            success: true,
            message: 'Successfully registered',
            system_code: '2000201804040229YYQBWBWNWQPQP',
            user: user.publish(),
          }));
      })
      .catch(err => res.status(400).send({
        success: false,
        message: err.message,
        system_code: '4000201804040229PLQLWOLWDB',
        error: err,
      }));
  }

}
module.exports = AuthenticationController;
