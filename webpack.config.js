/* eslint-disable no-undef */
import CopyPlugin from 'copy-webpack-plugin'
import HtmlPlugin from 'html-webpack-plugin'
import autoprefixer from 'autoprefixer'
import dotenv from 'dotenv'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'node:path'
import postcssImport from 'postcss-import'
import postcssNested from 'postcss-nested'
import webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// There can be a lot of environment variables, and many of them private. We
// want a way to inject configuration via environment variables into the UI at
// build time. List variables here to ensure they are included.
const includeEnvironmentVariables = [
]
// Part of a series of settings to allow use of process.env in the web. See also
// the resolve -> alias setting in this file, the ProvidePlugin usage in this
// file, and the added process package.
const env = Object.fromEntries(
  Object.entries({
    ...dotenv.config(),
    ...process.env,
  }).filter(([k, _v]) => includeEnvironmentVariables.includes(k)),
)

export default {
  entry: './client/app.tsx',
  output: {
    filename: 'bundle.[hash].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
  },
  devServer: {
    port: 7891,
    historyApiFallback: true,
    proxy: {
      '/api/v1': {
        pathRewrite: {
          '^/api/v1': ''
        },
        target: 'http://localhost:7890',
      },
    },
  },
  plugins: [
    new HtmlPlugin({ template: './client/index.html' }),
    new CleanWebpackPlugin(),
    // This provides the environment variable data to Webpack. This environment
    // variable data comes from the environment variables themselves, plus the
    // .env file (with environment variables winning conflicts). To make this
    // completely work, see the resolve.alias section as well as the
    // ProvidePlugin in this plugin section, and finally the environment
    // processing code above this configuration in this file.
    new webpack.EnvironmentPlugin(env),
    new CopyPlugin({
      patterns: [{ from: 'public' }],
    }),
    // This extracts CSS data and puts it into a CSS file, which is then
    // included in our index.html. The gathering of the CSS data is done via the
    // plugin's loader, which can be seen in the rules section below for CSS.
    new MiniCssExtractPlugin(),
    // Bring this in to allow use of process.env in the web. See also the
    // resolve -> alias setting in this file, dotenv usage in this file, and
    // the added process package.
    new webpack.ProvidePlugin({
      process: 'process/browser',
      React: 'react',
    }),
  ],
  resolve: {
    alias: {
      // Use this to allow use of process.env in the web. See also the
      // ProvidePlugin usage in this file, dotenv usage in this file, and the
      // added process package.
      process: 'process/browser',
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          // css-loader lets us import css files. MiniCssExtractPlugin takes the
          // CSS data and stuffs it into a css file for us. That file is then
          // later included in our index.html by the same plugin employed in the
          // plugins section. This plugin must be the last in order in order to
          // work correctly (and thus needs to be on the top).
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  postcssImport(),
                  autoprefixer(),
                  postcssNested(),
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(jpeg|jpg|png|svg|gif)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
