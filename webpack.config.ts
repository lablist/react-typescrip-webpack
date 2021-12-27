import path from "path";
import {DefinePlugin} from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const webpackConfig = () => ({
  entry: "./src/index.tsx",
  ...(process.env.production || !process.env.development
    ? {}
    : { devtool: "cheap-module-eval-source-map" }),
  target: "web",
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
  },
  devServer: {
    historyApiFallback: { index: "/", disableDotRule: true }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
      {
        test: /\.css$/,
        loader: "css-loader",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset",
        generator: {
          filename: "img/[hash][ext]"
        }
      },
      {
        test: /\.(woff(2)?|ttf)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset",
        generator: {
          filename: "fonts/[hash][ext]"
        }
      }
    ]
  },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "build.js",
    assetModuleFilename: "assets/[name][ext]"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/assets/index.html",
      favicon: "./src/assets/favicon.png"
    }),
    new DefinePlugin({
      "process.env": process.env.production || !process.env.development,
    })
  ],
})

module.exports = webpackConfig;
