'use strict';

class UserStore {
  constructor(ConnectionManager) {
    this.SlackUser = ConnectionManager.get('SlackUser');
  }

  findSlackUserByUserId(user_id) {
    return this.SlackUser.findOne({
      where: {
        user_id: user_id,
      }
    });
  }

  findSlackUserBySlackUserId(slack_user_id) {
    return this.SlackUser.findOne({
      where: {
        slack_user_id: slack_user_id,
      },
    });
  }


  createNewForUserId(user_id, slack_channel_id, slack_user_id) {
    return this.SlackUser.create({
      user_id,
      slack_user_id,
      slack_channel_id,
    });
  }
}
module.exports = UserStore;
