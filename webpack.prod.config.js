const webpack = require('webpack')
const uglifyjsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    app: './src/index.prod.js'
  },
  devtool: 'source-map',
  plugins: [
    new uglifyjsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      fabric: ['fabric', 'fabric'],
      _: 'lodash'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'temp'),
    publicPath: './temp/'
  },
}
