const ArcGISPlugin = require("@arcgis/webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "[name].bundle.js",
    publicPath: "",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "src"),
        use: [
          "cache-loader",
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|webp)$/,
        use: [
          "cache-loader",
          {
            loader: "url-loader",
            options: {
              // Inline files smaller than 10 kB (10240 bytes)
              limit: 10 * 1024,
            },
          },
        ],
      },
      {
        test: /\.(wsv|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "build/[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },

  plugins: [
    new FaviconsWebpackPlugin("./public/favicon.ico"), // svg works too!
    new ArcGISPlugin({
      useDefaultAssetLoaders: false,
    }),
    new HtmlWebPackPlugin({
      title: "المستكشف الجغرافى لوزاره الرياضة",
      chunksSortMode: "none",
      meta: {
        viewport:
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],

  resolve: {
    modules: [path.resolve(__dirname, "/src"), "node_modules/"],
    extensions: [".js", ".scss"],
  },

  externals: [
    (context, request, callback) => {
      if (/pe-wasm$/.test(request)) {
        return callback(null, "amd " + request);
      }
      callback();
    },
  ],

  node: {
    process: false,
    global: false,
    fs: "empty",
  },
};
