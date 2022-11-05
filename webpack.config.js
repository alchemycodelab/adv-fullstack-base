/* eslint-disable no-undef */
import CopyPlugin from 'copy-webpack-plugin'
import HtmlPlugin from 'html-webpack-plugin'
import autoprefixer from 'autoprefixer'
import dotenv from 'dotenv'
import path from 'node:path'
import postcssImport from 'postcss-import'
import postcssNested from 'postcss-nested'
import webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Part of a series of settings to allow use of process.env in the web. See also
// the resolve -> alias setting in this file, the ProvidePlugin usage in this
// file, and the added process package.
const env = Object.entries({
  ...dotenv.config(),
  ...process.env,
}).reduce((acc, [key, value]) => {
  acc[key] = value;
  return acc;
}, {});

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
    new webpack.EnvironmentPlugin(env),
    new CopyPlugin({
      patterns: [{ from: 'public' }],
    }),
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
          {
            loader: 'style-loader',
          },
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
