module.exports = {
    env: {
        es6: true,
        browser: true,
        commonjs: true,
        amd: true,
        webpack: true
    },
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:mocha/recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    globals: {
        'wx': true,   // 微信小程序宿主环境
        'qq': true,   // QQ 小程序宿主环境
        'my': true,   // 支付宝小程序宿主环境
        'swan': true, // 百度小程序宿主环境
        'tt': true,   // 头条小程序宿主环境
        'uni': true   // uni-app
    },
    overrides: [
        {
            files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
            env: {
                mocha: true
            }
        }
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint', 'prettier', 'mocha'],
    rules: {
        'indent': ['error', 4, { SwitchCase: 1 }],
        'linebreak-style': ['warn', 'windows'],
        'max-len': ['warn', 160],
        'no-console': 'off',
        'no-extra-boolean-cast': 'off',
        'prettier/prettier': ['warn', { trailingComma: 'none' }],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off'
    }
};
