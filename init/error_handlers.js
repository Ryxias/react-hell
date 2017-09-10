const not_found_handler = (req, res, next) => {
  res.status(404).send("Whoops! I can't seem to find what you're looking for!")
};

module.exports = { not_found_handler };
