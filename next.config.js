const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpack: config => {
    config.resolve.alias['~'] = path.resolve(__dirname);
    config.resolve.alias['three/jsm'] = path.join(__dirname, 'node_modules/three/examples/jsm');
    config.plugins.push(new webpack.ProvidePlugin({
      'THREE': 'three'
    }));
    return config;
  }
};