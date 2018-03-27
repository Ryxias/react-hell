'use strict';

class UserStore {
  constructor(ConnectionManager) {
    this.User = ConnectionManager.get('User');
  }

  findUserById(id) {
    return this.User.findById(id);
  }
}
module.exports = UserStore;
