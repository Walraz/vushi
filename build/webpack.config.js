const webpack = require('webpack')
const path = require('path')
const glob = require('glob')

const resolve = dir => path.join(__dirname, '..', dir)

const CLASS_NAMESPACE = 'su'
const ROOT_PATH = resolve('/')

const componentFiles = glob.sync(resolve('/src/components/**/*.vue'))

const components = {}

componentFiles.forEach(path => {
  const fileSplit = path.split('/')
  const componentName = fileSplit[fileSplit.length - 1]
    .toLowerCase()
    .split('.')[0]
  Object.assign(components, {
    [`lib/${componentName}`]: path,
  })
})

module.exports = {
  entry: {
    sushi: `${ROOT_PATH}/docs/index.js`,
  },
  output: {
    path: `${ROOT_PATH}/dist`,
    filename: `[name].js`,
    publicPath: '/dist/',
    libraryTarget: 'umd',
    library: 'vushi',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          failOnWarning: false,
          failOnError: false,
          formatter: require('eslint-friendly-formatter'),
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        options: {
          cssModules: {
            localIdentName: `${CLASS_NAMESPACE}-[local]---[hash:base64:5]`,
            camelCase: true,
          },
          postcss: {
            config: {
              path: `${ROOT_PATH}/postcssrc.js`,
            },
          },
          loaders: {
            js: 'babel-loader',
            stylus: 'vue-style-loader!css-loader!stylus-loader',
          },
          template: {
            doctype: 'html',
          },
        },
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: `${ROOT_PATH}/postcssrc.js`,
              },
            },
          },
          {
            loader: 'stylus-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.vue', '.js', '.styl', '.*'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    },
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
  },
  performance: {
    hints: false,
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        stylus: {
          import: [
            path.resolve(__dirname, '../src/core/base/functions.styl'),
            path.resolve(__dirname, '../src/core/base/variables.styl'),
          ],
        },
      },
    }),
  ],
}

if (process.env.NODE_ENV === 'production') {
  module.exports.entry = {
    core: `${ROOT_PATH}/src/main.js`,
    ...components,
  }
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ])
}
