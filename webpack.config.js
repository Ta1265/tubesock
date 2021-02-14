module.exports = {
  entry: `${__dirname}/client/src/index.tsx`,
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/client/dist`,
  },

  module: {
    rules: [
      {
        resolve: { extensions: ['.ts', '.tsx', 'js', 'jsx'] },
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        }],
      },
    ],
  },
};
