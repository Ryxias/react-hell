'use strict';

const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const NODE_ENV = process.env.NODE_ENV;

const { analyzer_mode, analyzer_port } = (() => {
  const ENABLE = false; // set this to true and it will boot up the bundle analyzer
  if (!ENABLE || NODE_ENV === 'production') {
    return { analyzer_mode: 'disabled', analyzer_port: 0 };
  }
  return { analyzer_mode: 'server', analyzer_port: 8001 };
})();

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
  plugins: [
    new BundleAnalyzerPlugin({
      // Can be `server`, `static` or `disabled`.
      // In `server` mode analyzer will start HTTP server to show bundle report.
      // In `static` mode single HTML file with bundle report will be generated.
      // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
      analyzerMode: analyzer_mode,
      // Host that will be used in `server` mode to start HTTP server.
      analyzerHost: '127.0.0.1',
      // Port that will be used in `server` mode to start HTTP server.
      analyzerPort: analyzer_port,
      // Path to bundle report file that will be generated in `static` mode.
      // Relative to bundles output directory.
      reportFilename: 'report.html',
      // Module sizes to show in report by default.
      // Should be one of `stat`, `parsed` or `gzip`.
      // See "Definitions" section for more information.
      defaultSizes: 'parsed',
      // Automatically open report in default browser
      openAnalyzer: true,
      // If `true`, Webpack Stats JSON file will be generated in bundles output directory
      generateStatsFile: false,
      // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
      // Relative to bundles output directory.
      statsFilename: 'stats.json',
      // Options for `stats.toJson()` method.
      // For example you can exclude sources of your modules from stats file with `source: false` option.
      // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
      statsOptions: null,
      // Log level. Can be 'info', 'warn', 'error' or 'silent'.
      logLevel: 'info'
    }),
  ]
};
