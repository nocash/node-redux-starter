import path from 'path'
import webpack from 'webpack'
import PATHS from './paths'

const development = {
  devtool: 'cheap-module-source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    path.join(PATHS.src, 'index.js'),
  ],
  devServer: {
    proxy: {
      '*': 'http://localhost:8000',
    },
    contentBase: PATHS.dist,
    publicPath: '/',
    hot: true,
    historyApiFallback: true,
    progress: true,
    stats: 'errors-only',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
}

export default development
