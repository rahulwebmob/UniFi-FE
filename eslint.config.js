import globals from 'globals'
import eslintJs from '@eslint/js'
import eslintTs from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import perfectionistPlugin from 'eslint-plugin-perfectionist'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'

// ----------------------------------------------------------------------

/**
 * @rules common
 * from 'react', 'eslint-plugin-react-hooks'...
 */
const commonRules = () => ({
  ...reactHooksPlugin.configs.recommended.rules,
  'func-names': 1,
  'no-bitwise': 2,
  'no-unused-vars': 0,
  'object-shorthand': 1,
  'no-useless-rename': 1,
  'default-case-last': 2,
  'consistent-return': 2,
  'no-constant-condition': 1,
  'default-case': [2, { commentPattern: '^no default$' }],
  'lines-around-directive': [2, { before: 'always', after: 'always' }],
  'arrow-body-style': [
    2,
    'as-needed',
    { requireReturnForObjectLiteral: false },
  ],
  // Disable problematic rules that aren't available
  'filenames/match-regex': 0,
  'jsx-a11y/anchor-is-valid': 0,
  'jsx-a11y/media-has-caption': 0,
  // react
  'react/jsx-key': 0,
  'react/prop-types': 0,
  'react/display-name': 0,
  'react/no-children-prop': 0,
  'react/jsx-boolean-value': 2,
  'react/self-closing-comp': 2,
  'react/react-in-jsx-scope': 0,
  'react/jsx-no-useless-fragment': [1, { allowExpressions: true }],
  'react/jsx-curly-brace-presence': [2, { props: 'never', children: 'never' }],
  // typescript
  '@typescript-eslint/no-shadow': 2,
  '@typescript-eslint/no-explicit-any': 0,
  '@typescript-eslint/no-empty-object-type': 0,
  '@typescript-eslint/consistent-type-imports': 1,
  '@typescript-eslint/no-unused-vars': [1, { args: 'none' }],
})

/**
 * @rules import
 * from 'eslint-plugin-import'.
 */
const importRules = () => ({
  ...importPlugin.configs.recommended.rules,
  'import/named': 0,
  'import/export': 0,
  'import/default': 0,
  'import/namespace': 0,
  'import/no-named-as-default': 0,
  'import/newline-after-import': 2,
  'import/no-named-as-default-member': 0,
  'import/prefer-default-export': 0,
  'import/no-extraneous-dependencies': 0,
  'import/no-cycle': [
    0, // disabled if slow
    {
      maxDepth: '∞',
      ignoreExternal: false,
      allowUnsafeDynamicCyclicDependency: false,
    },
  ],
})

/**
 * @rules unused imports
 * from 'eslint-plugin-unused-imports'.
 */
const unusedImportsRules = () => ({
  'unused-imports/no-unused-imports': 1,
  'unused-imports/no-unused-vars': [
    0,
    {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      argsIgnorePattern: '^_',
    },
  ],
})

/**
 * @rules sort or imports/exports
 * from 'eslint-plugin-perfectionist'.
 */
const sortImportsRules = () => {
  const customGroups = {
    mui: ['custom-mui'],
    auth: ['custom-auth'],
    hooks: ['custom-hooks'],
    utils: ['custom-utils'],
    types: ['custom-types'],
    routes: ['custom-routes'],
    sections: ['custom-sections'],
    components: ['custom-components'],
  }

  return {
    'perfectionist/sort-named-imports': [
      1,
      { type: 'line-length', order: 'asc' },
    ],
    'perfectionist/sort-named-exports': [
      1,
      { type: 'line-length', order: 'asc' },
    ],
    'perfectionist/sort-exports': [
      1,
      {
        order: 'asc',
        type: 'line-length',
        groupKind: 'values-first',
      },
    ],
    'perfectionist/sort-imports': [
      2,
      {
        order: 'asc',
        ignoreCase: true,
        type: 'line-length',
        environment: 'node',
        maxLineLength: undefined,
        newlinesBetween: 'always',
        internalPattern: ['^src/.+'],
        groups: [
          'style',
          'side-effect',
          'type',
          ['builtin', 'external'],
          customGroups.mui,
          customGroups.routes,
          customGroups.hooks,
          customGroups.utils,
          'internal',
          customGroups.components,
          customGroups.sections,
          customGroups.auth,
          customGroups.types,
          ['parent', 'sibling', 'index'],
          ['parent-type', 'sibling-type', 'index-type'],
          'object',
          'unknown',
        ],
        customGroups: {
          value: {
            [customGroups.mui]: ['^@mui/.+'],
            [customGroups.auth]: ['^src/auth/.+'],
            [customGroups.hooks]: ['^src/hooks/.+'],
            [customGroups.utils]: ['^src/utils/.+'],
            [customGroups.types]: ['^src/types/.+'],
            [customGroups.routes]: ['^src/routes/.+'],
            [customGroups.sections]: ['^src/sections/.+'],
            [customGroups.components]: ['^src/components/.+'],
          },
        },
      },
    ],
  }
}

/**
 * Custom ESLint configuration.
 */
export const customConfig = {
  plugins: {
    'react-hooks': reactHooksPlugin,
    'unused-imports': unusedImportsPlugin,
    perfectionist: perfectionistPlugin,
    import: importPlugin,
  },
  settings: {
    // https://www.npmjs.com/package/eslint-import-resolver-typescript
    ...importPlugin.configs.typescript.settings,
    'import/resolver': {
      ...importPlugin.configs.typescript.settings['import/resolver'],
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    ...commonRules(),
    ...importRules(),
    ...unusedImportsRules(),
    ...sortImportsRules(),
  },
}

// ----------------------------------------------------------------------

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { ignores: ['*', '!src/', '!eslint.config.*'] },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: process.cwd(),
      },
    },
    settings: { react: { version: 'detect' } },
  },
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommendedTypeChecked,
  ...eslintTs.configs.stylisticTypeChecked,
  reactPlugin.configs.flat.recommended,
  customConfig,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 1,
      '@typescript-eslint/no-unused-vars': 1,
      '@typescript-eslint/no-unsafe-assignment': 1,
      '@typescript-eslint/no-unsafe-member-access': 1,
      '@typescript-eslint/no-unsafe-call': 1,
      '@typescript-eslint/no-unsafe-return': 1,
      '@typescript-eslint/no-unsafe-argument': 1,
      '@typescript-eslint/no-floating-promises': 2,
      '@typescript-eslint/require-await': 1,
      '@typescript-eslint/no-misused-promises': 2,
      '@typescript-eslint/await-thenable': 2,
      '@typescript-eslint/no-unnecessary-type-assertion': 1,
      '@typescript-eslint/restrict-template-expressions': 1,
      '@typescript-eslint/restrict-plus-operands': 1,
      '@typescript-eslint/no-base-to-string': 1,
      '@typescript-eslint/no-duplicate-type-constituents': 1,
      '@typescript-eslint/no-redundant-type-constituents': 1,
      '@typescript-eslint/no-unnecessary-condition': 1,
      '@typescript-eslint/prefer-nullish-coalescing': 1,
      '@typescript-eslint/prefer-optional-chain': 1,
      'react-refresh/only-export-components': 0,
    }
  }
]
