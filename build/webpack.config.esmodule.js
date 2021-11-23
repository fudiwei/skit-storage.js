const { webpack } = require('webpack');
const webpackConf = require('./webpack.config.umd.js');

webpackConf.output.filename = 'index.esm.min.js';
webpackConf.output.library = undefined;
webpackConf.output.libraryExport = undefined;
webpackConf.output.libraryTarget = 'module';
webpackConf.output.umdNamedDefine = false;
webpackConf.output.module = true;
webpackConf.target = ['web'];
webpackConf.module.rules.forEach(rule => {
    if (!rule.use || rule.use.loader !== 'babel-loader') {
        return;
    }

    rule.use.options = {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: ['Chrome > 61'],
                    useBuiltIns: 'usage',
                    corejs: 3
                }
            ],
            '@babel/typescript'
        ]
    };
});
webpackConf.experiments = Object.assign({}, webpackConf.experiments, {
    outputModule: true
});

module.exports = webpackConf;
