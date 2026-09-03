const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');
const eslintPluginPrettier = require('eslint-plugin-prettier/recommended');

module.exports = [
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'src/data-contracts/**'] },
  ...tseslint.configs.recommended,
  eslintPluginPrettier,
  eslintConfigPrettier,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    },
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
    },
  },
];
