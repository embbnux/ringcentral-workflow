const path = require('path');
const webpack = require('webpack');

const getBaseConfig = require('./getWebpackBaseConfig');
const buildPath = path.resolve(__dirname, 'frontend');
const outputPath = path.resolve(__dirname, 'public');

const baseConfig = getBaseConfig();

function getDevWebpackConfig(config) {
  config.devServer = {
    hot: true,
    port: 8088,
    static: buildPath,
  };
  config.output = {
    path: outputPath,
    filename: '[name].js',
  };
  config.plugins = [
    ...config.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ];
  config.devtool = 'eval-source-map';
  config.mode = 'development';
  return config;
}

module.exports = getDevWebpackConfig(baseConfig);
