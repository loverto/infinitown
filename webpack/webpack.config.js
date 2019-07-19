const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ThreeWebpackPlugin = require('@wildpeaks/three-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: './src/index.js'
    },
    resolve: {
        alias: {
            module: path.resolve(__dirname, '../module')
        },
    },

    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'inline-source-map', devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new ThreeWebpackPlugin(),
        // new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            inject: true,
            template: 'index.html',
            title: '管理输出'
        }),
        new webpack.NamedModulesPlugin(),
        new CopyWebpackPlugin([
            { from: './assets', to: 'assets' },
            { from: './img', to: 'img' },
            { from: './textures', to: 'textures' },
            { from: './css', to: 'css' },
            { from: './js', to: 'js' }
        ]),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            _: 'lodash',
            TWEEN: '@tweenjs/tween.js',
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }, {test: /jquery-mousewheel/, loader: "imports-loader?define=>false&this=>window"},
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['eslint-loader', 'babel-loader'],
                enforce: "pre",
                include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'module')], // 指定检查的目录
            }
        ]
    },
};
