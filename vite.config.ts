import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check',
  },
  test: {},
  lint: {
    ignorePatterns: ['**/dist/**'],
    options: {
      typeAware: true,
      typeCheck: true,
      reportUnusedDisableDirectives: 'warn',
    },
    plugins: ['unicorn', 'eslint', 'typescript', 'oxc', 'import', 'promise'],
    env: {
      builtin: true,
      es2026: true,
      browser: true,
    },
    categories: {
      correctness: 'deny',
      suspicious: 'warn',
    },
    rules: {
      curly: ['warn', 'multi'],
      'arrow-body-style': ['warn', 'as-needed'],
      'no-shadow': 0,
      'no-useless-rename': 'warn',
      'no-var': 'deny',
      'no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      'oxc/branches-sharing-code': 'error',
      'oxc/no-barrel-file': 'error',

      'import/export': 'deny',
      'import/no-duplicates': 'warn',
      'import/no-empty-named-blocks': 'warn',
      'import/no-cycle': 'deny',
      'import/no-named-default': 'warn',
      'import/namespace': 0,
      'import/named': 0,
      'import/default': 0,
      'import/no-named-as-default-member': 0,
      'import/no-named-as-default': 0,
      'import/no-unassigned-import': [
        'warn',
        {
          allow: [
            '**/*.css',
            'react',
            'temporal-polyfill/global',
            'vite-plus/test/browser/context',
          ],
        },
      ],
      'typescript/no-deprecated': 'warn',
      'typescript/no-explicit-any': 'warn',
      'typescript/no-unnecessary-type-constraint': 'warn',
      'typescript/no-redundant-type-constituents': 'warn',
      'typescript/no-useless-empty-export': 'warn',
      'typescript/no-unsafe-type-assertion': 0,
      'typescript/no-extra-non-null-assertion': 'deny',
      'typescript/no-non-null-asserted-optional-chain': 'deny',
      'typescript/prefer-as-const': 'warn',
      'typescript/no-duplicate-enum-values': 'deny',
      'typescript/triple-slash-reference': 'deny',
      'typescript/no-misused-new': 'deny',
      'typescript/no-this-alias': 'warn',
      'typescript/no-unsafe-declaration-merging': 'deny',
      'typescript/await-thenable': 'deny',
      'typescript/no-floating-promises': 'deny',
      'typescript/no-for-in-array': 'deny',
      'typescript/no-implied-eval': 'deny',
      'typescript/no-base-to-string': 'warn',
      'typescript/restrict-template-expressions': 'warn',
      'typescript/unbound-method': 'warn',

      'unicorn/no-array-for-each': 'warn',
      'unicorn/prefer-array-find': 'warn',

      'promise/param-names': 'deny',
      'promise/no-new-statics': 'deny',
      'promise/valid-params': 'deny',
    },
    overrides: [
      {
        files: ['**/*.{test,spec}.*', 'rt.d.ts'],
        plugins: ['vitest'],
        rules: {
          'typescript/no-explicit-any': 0,
          'typescript/no-unsafe-argument': 0,
          'typescript/no-unsafe-assignment': 0,
          'typescript/no-unsafe-call': 0,
          'typescript/no-unsafe-member-access': 0,
          'typescript/no-unsafe-return': 0,
        },
      },
    ],
  },
  fmt: {
    ignorePatterns: ['**/dist/**'],
    semi: false,
    singleQuote: true,
    sortPackageJson: true,
    sortTailwindcss: {
      functions: ['clsx', 'cn', 'cx', 'cva'],
    },
    sortImports: {
      partitionByComment: true,
      internalPattern: ['@/', '@.storybook/', '#/'],
    },
  },
  run: {
    cache: true,
  },
})
