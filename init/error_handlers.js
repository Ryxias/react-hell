const notFoundHandler = (req, res, next) => {
  res.status(404).send("Whoops! I can't seem to find what you're looking for!")
};

const defaultErrorHandler = (err, req, res, next) => {
  console.log("++++++++++++++++++");
  console.log(err);
  res.status(500).send("Whoops, something went wrong!");
};

module.exports = {
  notFoundHandler,
  defaultErrorHandler
};
