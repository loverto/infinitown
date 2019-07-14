module.exports = {
    parser: "babel-eslint",
    root: true,
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    rules: {
        "indent": ["error", 4],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "arrow-parens": 0
    }
}
