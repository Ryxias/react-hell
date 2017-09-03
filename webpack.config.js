const path = require("path");

module.exports = {
  entry: "./client/index.js", // should be the main index.js of the client
  output: {
    path: path.join(__dirname, "public/assets/bundles"), 
    filename: "bundle.js" // bundles all the files together into a single file
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }, // transpiles both .js and .jsx files with ES6 into code interpretable by the browser
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  devtool: "source-map"  // easier debugging of de-minified code in browser
}