const path = require('path');

const DIR_SRC = path.resolve('./src');
const DIR_DIST = path.resolve('./dist');

/**
 *
 * @typedef { import("webpack").Configuration } Configuration
 * @type {Configuration}
 */
module.exports = {
    mode: 'production',

    context: DIR_SRC,

    entry: './index.ts',

    output: {
        path: DIR_DIST,
        filename: 'index.min.js',
        library: '$$storage',
        libraryExport: '$$storage',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    devtool: 'source-map',

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
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: 'defaults',
                                    useBuiltIns: 'usage',
                                    corejs: 3
                                }
                            ],
                            '@babel/typescript'
                        ],
                        plugins: [
                            [
                                '@babel/plugin-transform-runtime',
                                {
                                    corejs: 3
                                }
                            ],
                            '@babel/proposal-class-properties',
                            '@babel/proposal-object-rest-spread'
                        ],
                        sourceType: 'unambiguous'
                    }
                },
                exclude: /node_modules/
            }
        ]
    }
};
