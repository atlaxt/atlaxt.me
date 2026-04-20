import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  rules: {
    'e18e/prefer-static-regex': 'off',
    'regexp/no-unused-capturing-group': 'off',
    'vue/prop-name-casing': 'off',
    'no-cond-assign': 'off',
  },
})
