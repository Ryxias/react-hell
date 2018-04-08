'use strict';

const uuidv4 = require('uuid/v4');

class TokenStore {
  constructor(ConnectionManager) {
    this.Token = ConnectionManager.get('Token');
  }

  findByToken(token) {
    return this.Token.findOne({
      where: {
        token: token,
      }
    });
  }

  /**
   * @param context String unique context
   * @param expires Integer number of seconds before the token expires
   */
  newToken(context, expires = 300) {
    return this.Token.create({
      token: uuidv4(), // Lets not worry about collisions for now
      context: context,
      expires: Date.now() + expires,
    });
  }
}
module.exports = TokenStore;
