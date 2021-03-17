const webpackConf = require('./webpack.config.umd.js');

webpackConf.mode = 'production';
webpackConf.output.filename = 'index.modern.js';
webpackConf.target = ['web', 'es5'];
webpackConf.module.rules = [
    {
        test: /\.(js|ts)$/,
        use: {
            loader: 'babel-loader',
            options: {
                'presets': [
                    [
                        '@babel/preset-env',
                        {
                            'targets': ['chrome >= 80'],
                            'useBuiltIns': 'usage',
                            'corejs': 3
                        }
                    ],
                    '@babel/typescript'
                ],
                'plugins': [
                    [
                        '@babel/plugin-transform-arrow-functions',
                        {
                            'spec': true
                        }
                    ],
                    '@babel/plugin-proposal-nullish-coalescing-operator',
                    '@babel/plugin-proposal-optional-chaining'
                ]
            }
        },
        exclude: /node_modules/
    }
];

module.exports = webpackConf;
