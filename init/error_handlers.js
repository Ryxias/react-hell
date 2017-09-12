const not_found_handler = (req, res, next) => {
  res.status(404).send("Whoops! I can't seem to find what you're looking for!")
};

const default_error_handler = (err, req, res, next) => {
  res.send("Whoops, something went wrong!");
};

module.exports = { not_found_handler, default_error_handler };
