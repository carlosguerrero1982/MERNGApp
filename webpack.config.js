// Ecmascript6 and CSS 
module.exports = {
    entry: 'index.js',
    output: {
      path: __dirname + '/dist',
      filename: 'bundle.js'
    },
    module: {
      loaders : [
        {
          test: /\.css$/,
          loader: "style-loader!css-loader"
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude:/node_modules/,
          query: {
            presets:['es2015']
          }
        }
      ]
    }
  }