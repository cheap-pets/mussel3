module.exports = {
  root: true,
  extends: [
    "stylelint-config-recommended-scss",
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-clean-order'
  ],
  rules: {
    // 'indentation': 2,
    'no-duplicate-selectors': null,
    'no-descending-specificity': null
  }
}
