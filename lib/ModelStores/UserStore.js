'use strict';

class UserStore {
  constructor(ConnectionManager) {
    this.User = ConnectionManager.get('User');
  }

  findUserById(id) {
    return this.User.findById(id);
  }

  findUserByEmail(email) {
    return this.User.findOne({
      where: {
        email: email
      }
    });
  }

  createUser(email) {
    return this.User.create({
      email: email,
    });
  }
}
module.exports = UserStore;
