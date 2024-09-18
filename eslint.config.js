const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/*', 'coverage/*', 'docs/*', '**/.*'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      camelcase: 'error',
      'max-len': [
        'error',
        {
          code: 80,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTrailingComments: true,
          ignoreTemplateLiterals: true,
        },
      ],
      quotes: [
        'error',
        'single',
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      'for-direction': 'error',
      'getter-return': 'error',
      'no-cond-assign': ['error', 'always'],
      'no-const-assign': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-else-if': 'warn',
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-duplicate-imports': ['warn', { includeExports: true }],
    },
  },
];
