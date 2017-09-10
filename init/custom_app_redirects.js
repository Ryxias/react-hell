// Add a listener that redirects incoming HTTP requests to HTTPS
const redirect_http_to_https = (req, res, next) => {
  // As it turns out this is extremely not-trivial since the environments upon which this
  // application operates are behind TLS-terminating devices, which forward the request
  // as HTTP.
  //
  // Instead, we rely on a specific headers that the services provide.  AWS ELB provides
  // a header called X-FORWARDED-PROTO
  // @see https://www.allcloud.io/how-to/how-to-force-https-behind-aws-elb/
  //
  // The caveat here is that `req.protocol` is permanently broken :(
  if (req.header('x-https-protocol') // Sometimes Nginx
    || req.header('x-forwarded-proto') === 'https' // AWS ELB
  ) {
    next();
    return;
  }
  res.redirect('https://' + req.hostname + req.originalUrl);
};


module.exports = {
  redirect_http_to_https
};
