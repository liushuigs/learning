const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path')

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader",
            }
          ]
      },
      {
          test: /\.svg$/,
          use: [{
              loader: 'svg-inline-loader'
          }]
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
    new MonacoWebpackPlugin()
  ]
}