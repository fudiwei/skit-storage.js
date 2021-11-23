const { webpack } = require('webpack');
const webpackConf = require('./webpack.config.umd.js');

webpackConf.output.filename = 'index.cjs.min.js';
webpackConf.output.library = undefined;
webpackConf.output.libraryExport = undefined;
webpackConf.output.libraryTarget = 'commonjs2';
webpackConf.output.umdNamedDefine = false;
webpackConf.target = ['node'];
webpackConf.module.rules.forEach(rule => {
    if (!rule.use || rule.use.loader !== 'babel-loader') {
        return;
    }

    rule.use.options = {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: ['Chrome > 51'],
                    useBuiltIns: 'usage',
                    corejs: 3
                }
            ],
            '@babel/typescript'
        ]
    };
});

module.exports = webpackConf;
