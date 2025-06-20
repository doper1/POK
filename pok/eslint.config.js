const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/*', 'coverage/*', 'docs/*'],
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
      
      // Enhanced dead code detection rules
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          caughtErrors: 'all',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'no-duplicate-imports': ['warn', { includeExports: true }],
      
      // Unreachable and dead code rules
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      
      // Unused expressions and statements
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      'no-unused-labels': 'error',
      'no-unused-private-class-members': 'error',
      
      // Useless code patterns
      'no-useless-assignment': 'error',
      'no-useless-catch': 'error',
      'no-useless-return': 'error',
      'no-useless-constructor': 'error',
      'no-useless-escape': 'error',
      'no-useless-concat': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-rename': 'error',
      'no-useless-call': 'error',
      
      // Additional dead code detection
      'no-lone-blocks': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-empty-function': [
        'error',
        {
          allow: ['arrowFunctions', 'functions', 'methods'],
        },
      ],
      
      'no-undef': 'off',
    },
  },
];
