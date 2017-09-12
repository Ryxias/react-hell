//
// Connect Chuubot and provide an example of how to create a listener
//

module.exports = (config) => {
  const chuu = require(PROJECT_ROOT + '/lib/slackbot_framework')(config.slack);

// Add dumb listener for baachuu
  chuu.on(/chuu/, (message, send) => { send('baaaaaaaaaa'); });

// Add the
  chuu.on(/!gacha/, (message, send) => {
    const LoveLiveClient = require(PROJECT_ROOT + '/lib/love_live_client');
    let ll_client = new LoveLiveClient();
    ll_client.gachaRCard().then((card) => {
      send('[' + card.getId() + '] ' + card.getName() + ' - ' + card.getImageUrl());
    });
  });

  return chuu;
};
