'use strict';

//
// Initializes, configures passport
//
const LocalStrategy = require('passport-local').Strategy;

class PassportMiddleware {
  constructor(UserStore) {
    this.UserStore = UserStore;
    this.passport = require('passport');
    this.initializePassport();
  }

  initializePassport() {
    // Passport Configuration
    this.passport.use(new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      (email, password, done) => {
        //console.log('local strat',email,password);
        this.UserStore.findUserByEmail(email)
          .then(user => {
            if (!user) {
              return [null, null];
            }
            return [user, user.verifyPassword(password)];
          })
          .spread((user, verified) => {
            if (!user) {
              return done(null, false, {message: 'No user found.'});
            } else if (verified) {
              return done(null, user);
            } else {
              return done(null, false, {message: 'Incorrect email or password.'});
            }
          })
          .catch(done);
      }
    ));

    this.passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    this.passport.deserializeUser((id, done) => {
      this.UserStore.findUserById(id)
        .then(user => {
          return done(null, user);
        })
        .catch(done);
    });
  }

  getPassport() {
    return this.passport;
  }

  authenticateThroughPassport(callback) {
    return this.passport.authenticate('local', callback);
  }
}

module.exports = PassportMiddleware;
