module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  ignorePatterns: ['node_modules', 'dist', 'build'],
  extends: [
    'react-app',
    'react-app/jest',
    'eslint:recommended',
    'airbnb',
    'airbnb/hooks',
    'plugin:react/jsx-runtime',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'jsx-a11y', 'import', 'react-hooks', 'prettier'],
  rules: {
    'react/state-in-constructor': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/destructuring-assignment': [
      1,
      'always',
      { ignoreClassFields: true },
    ],
    'react/jsx-props-no-spreading': [1, { custom: 'ignore' }],
    'prettier/prettier': 'error',
    'linebreak-style': [0, 'unix'],
    'no-plusplus': 'off',
    'no-param-reassign': ['error', { props: false }],
    'import/no-unresolved': [2, { caseSensitive: false }],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'import/order': [
      2,
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
      },
    ],
  },
  settings: {
    version: 'detect',
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
};
