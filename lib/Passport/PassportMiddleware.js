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
        return this.UserStore.findUserByEmail(email)
          .then(user => {
            if (!user) {
              done(null, false, { message: 'No user found.' });
              return null;
            }
            return user.verifyPassword(password)
              .then(verified => {
                if (verified) {
                  done(null, user);
                  return null;
                } else {
                  done(null, false, {message: 'Incorrect email or password.'});
                  return null;
                }
              });
          })
          .catch(err => {
            done(err);
            return null;
          });
      }
    ));

    this.passport.serializeUser((user, done) => {
      done(null, user.id);
      return null;
    });

    this.passport.deserializeUser((id, done) => {
      return this.UserStore.findUserById(id)
        .then(user => {
          done(null, user);
          return null;
        })
        .catch(err => {
          done(err);
          return null;
        });
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
