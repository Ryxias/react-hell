module.exports = app => {

  // Welcome page
  app.get('/', (req, res, next) => {
    return res.render('index',
      {
        header: true,
        footer: true,
        title: 'Hello!',
        message: 'Home of the Chuuni'
      }
    )
  });

  // Love Live Gacha crap
  app.get('/sif/random', (req, res, next) => {
    const LoveLiveClient = require('../../lib/love_live_client');
    const ll_client = new LoveLiveClient();

    ll_client.getRandomCard().then((card) => {
      return res.render('sif',
        {
          header: true,
          footer: true,
          title: card.getName(),
          card_image_url: card.getImageUrl(),
        }
      );
    });
  });

  // Test endpoint
  app.get('/sif/gacha', (req, res) => {
    const LoveLiveClient = require('../../lib/love_live_client');
    const ll_client = new LoveLiveClient();

    ll_client.gachaRCard().then((card) => {
      return res.render('sif',
        {
          header: true,
          footer: true,
          title: card.getName(),
          card_image_url: card.getImageUrl(),
        }
      );
    });
  });
};
