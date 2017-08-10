const path = require('path') // node 的核心模块，用来处理路径问题
const HtmlWebpackPlugin = require('html-webpack-plugin') // 处理 index.html
const CleanWebpackPlugin = require('clean-webpack-plugin') // 清除目录
const webpack = require('webpack')

function join(...args) { // ...args 出现在参数中叫做 rest 参数，它是把所有剩余参数放入一个数组
  return path.join(__dirname, ...args) // 出现在非函数参数的位置，...args 表示展示操作符，表示将数组展开，元素一个一个的摆放到这里
}

module.exports = {
  entry: join('./src/main.js'), // 如果是相对路径 ./ 不能省，建议也写成动态的绝对路径
  output: {
    path: join('./dist'), // 必须是绝对路径，利用 __dirname 拼接一个动态的绝对路径
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map', // 配置该选项就会在开发阶段加入 source-map
  // 插件都需要手动 require 加载
  devServer: {
    contentBase: './dist', // 将 dist 作为 Web 服务的目录
    hot: true // 使用热更新
  },
  plugins: [
    // 打包之前，先把 dist 目录清除
    new CleanWebpackPlugin([join('./dist')]),
    // 表示插件的意思，一般用于对 js压缩、css压缩、html的处理等资源配置
    // 该插件默认会在打包输出的 path 路径中生成一个 index.html 文件
    // 该文件中会自动引入打包的结果文件
    new webpack.HotModuleReplacementPlugin(), // 配置热更新
    new HtmlWebpackPlugin({
      // title: 'hello'a
      template: join('./index.html')
    })
  ],
  // loader 不需要手动加载
  module: { // 表示对模块资源的一些配置处理
    rules: [
      // 当 import .css 文件资源的时候，使用 style-loader 和 css-loader 加载处理
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      { // 当加载以 /\.(png|svg|jpg|gif)$/ 结尾的后缀名的文件的时候，使用 file-loader 加载处理
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader' // less-loader 依赖于 less
        ]
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'] // 依赖于 vue-template-compiler
      }
    ]
  }
}
