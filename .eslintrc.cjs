module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: 'eslint:recommended',
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs,ts}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    },
};
