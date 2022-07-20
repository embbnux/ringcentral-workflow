const path = require('path');
const webpack = require('webpack');

const getBaseConfig = require('./getWebpackBaseConfig');
const outputPath = path.resolve(__dirname, 'public', 'frontend');

const baseConfig = getBaseConfig();

function getProWebpackConfig(config) {
  config.output = {
    path: outputPath,
    filename: '[name].js',
  };
  config.plugins = [
    ...config.plugins,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ];
  config.mode = 'production';
  return config;
}

module.exports = getProWebpackConfig(baseConfig);
