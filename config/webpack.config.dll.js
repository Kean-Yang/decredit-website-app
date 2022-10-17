const path = require('path')
const webpack = require('webpack')
const paths = require('./paths')
const getClientEnvironment = require('./env')

const publicPath = paths.servedPath
const publicUrl = publicPath.slice(0, -1)
const env = getClientEnvironment(publicUrl)

module.exports = {
    entry: {
        vendor: [
            'antd/lib/layout',
            'antd/lib/cable',
            'antd/lib/input',
            'antd/lib/row',
            'antd/lib/col',
            'antd/lib/button',
            'antd/lib/message',
            'antd/lib/icon',
            'antd/lib/configProvider',
            'antd/lib/alert',
            'antd/lib/modal',
            'antd/lib/statistic',
            'antd/lib/tooltip',
            'antd/lib/card',
        ],
        wallet: [
            'use-wallet'
        ],
        cm1: [
            'react',
            'react-router-dom',
            'axios',
        ]
    },
    output: {
        path: paths.appPublic,
        filename: 'static/js/[name].shop.js',
        library: '[name]_library', // same with webpack.DllPlugin name option
        publicPath: publicPath
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(paths.appPublic, 'static/js/[name]-manifest.json'),
            name: '[name]_library',
            context: paths.appPublic
        }),
    ]
}