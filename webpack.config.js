const path = require('path');
// Optimizes duplicates in splitted bundles 
const webpack = require('webpack');
// output folder location
const distFolder = path.join(__dirname, 'dist');

module.exports = {
  mode: 'development',
  entry: './main.js',
  context: path.resolve(__dirname, 'src/'),
  plugins: [
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: distFolder,
    //publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: /src/,
        use: {
          loader: "babel-loader",
        }
      },
    ]
  },
  resolve: {
    extensions: [ ".js" ]
  },
  output: {
    filename: '[name].bundle.js',
    path: distFolder,
    publicPath: "/",
  }
};
