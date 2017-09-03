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
};
