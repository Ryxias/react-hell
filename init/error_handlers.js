const notFoundHandler = (req, res, next) => {
  res.status(404).send("Whoops! I can't seem to find what you're looking for!")
};

const defaultErrorHandler = (err, req, res, next) => {
  res.status(500).send("Whoops, something went wrong!");
  next(err); // Bubble it to the base error handler, but then the browser doesn't hang waiting for a server response
};

module.exports = {
  notFoundHandler,
  defaultErrorHandler
};
