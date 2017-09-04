module.exports = app => {

  // Welcome page
  app.get('/', (req, res, next) => {
    // return res.render('home', {
    //   header: true,
    //   footer: true,
    //   title: 'CSPA - Computer Science Proficiency Assessment',
    //   css: ['home.css'],
    //   selected_about: true,
    // })

    return res.send("Hello!");
  });
};
