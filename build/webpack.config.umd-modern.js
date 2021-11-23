const webpackConf = require('./webpack.config.umd.js');

webpackConf.output.filename = 'index.modern.min.js';
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
                    targets: ['Chrome > 73'],
                    useBuiltIns: 'usage',
                    corejs: 3
                }
            ],
            '@babel/typescript'
        ]
    };
});

module.exports = webpackConf;
