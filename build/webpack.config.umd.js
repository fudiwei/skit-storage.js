const path = require('path');

const babelConf = require('./babel.config.js');

const DIR_SRC = path.resolve('./src');
const DIR_DIST = path.resolve('./dist');

/**
 *
 * @typedef { import("webpack").Configuration } Configuration
 * @type {Configuration}
 */
module.exports = {
    mode: 'development',

    context: DIR_SRC,

    entry: './index.ts',

    output: {
        path: DIR_DIST,
        filename: 'index.js',
        library: '$$storage',
        libraryExport: '$$storage',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    node: {
        __filename: true,
        __dirname: true
    },

    resolve: {
        alias: {
            '@': DIR_SRC
        },
        extensions: ['.ts', '.js'],
        modules: ['node_modules', '*']
    },

    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                use: {
                    loader: 'babel-loader',
                    options: babelConf
                },
                exclude: /node_modules/
            }
        ]
    }
};
