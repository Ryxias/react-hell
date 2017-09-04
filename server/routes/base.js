module.exports = app => {

  // Welcome page
  app.get('/', (req, res, next) => {
    return res.render('index',
      {
        title: 'Hello!',
        message: 'Home of the Chuuni'
      }
    )
  });

  // Love Live Gacha crap
  app.get('/sif/random', (req, res, next) => {

    const http = require('http');

    const MAX_CARD_ID = 1234;
    let card_id = Math.floor(Math.random() * MAX_CARD_ID);
    http.get(
      {
        hostname: 'schoolido.lu',
        port: 80,
        path: '/api/cards/' + card_id + '/',
      },
      (result) => {
        let data = '';
        result.on('data', (chunk) => {
          data += chunk;
        });
        result.on('end', () => {
          let card_data = JSON.parse(data);
          let card_name = card_data['idol']['name'];
          let card_image_url = 'http:' + card_data['card_image'];

          return res.render('sif',
            {
              card_name: card_name,
              card_image_url: card_image_url,
            }
          );
        });
      }
    );
  });
};
