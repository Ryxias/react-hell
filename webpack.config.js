const path = require("path");

module.exports = {
  entry: './client/index.jsx', // should be the main index.jsx of the client
  output: {
    path: path.join(__dirname, 'public/dist'),
    filename: 'bundle.js' // bundles all the files together into a single file
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/, query: { presets:[ 'es2015', 'react', 'stage-2' ] } }, // transpiles both .js and .jsx files with ES6 into code interpretable by the browser
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/, query: { presets:[ 'es2015', 'react', 'stage-2' ] } }
    ]
  },
  devtool: 'source-map',  // easier debugging of de-minified code in browser
}
