module.exports = {
  context: __dirname,
  entry: './lib/index.js',
  output: {
    filename: 'main.js'
  },
  resolve: {
    extensions: [".js"]
  },
  devtool: 'source-map'
};