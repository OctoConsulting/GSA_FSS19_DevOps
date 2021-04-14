const path = require('path');
var ZipPlugin = require('zip-webpack-plugin');
module.exports = {
    entry: ['./src/index.ts'],
    mode: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
    optimization: {
        minimize: process.env.NODE_ENV == 'development' ? false : true,
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist/get-nsn-service-details'),
        filename: 'index.js',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                test: /\.ts?$/,
            },
        ],
    },
    externals: {
        'aws-sdk': 'aws-sdk',
    },
    plugins: [
        new ZipPlugin({
            filename: 'index.zip',
        }),
    ],
};
