module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": "defaults",
                "useBuiltIns": "usage",
                "corejs": 3
            }
        ],
        "@babel/typescript"
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": 3
            }
        ],
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread"
    ],
    "sourceType": "unambiguous"
};
