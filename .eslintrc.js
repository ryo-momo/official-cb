module.exports = {
    ignorePatterns: ['tempCodeRunnerFile.ts'],
    env: {
        es2021: true,
        node: true,
    },
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
        {
            files: ['.eslintrc.js'],
            rules: {
                'functional/immutable-data': 'off', // このファイルに対してルールを無効にする
            },
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true,
    },
    plugins: ['@typescript-eslint', 'unicorn', 'functional', 'import', 'prefer-arrow-functions'],
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/naming-convention': [
            'warn',
            {
                selector: [
                    'classProperty',
                    'objectLiteralProperty',
                    'typeProperty',
                    'classMethod',
                    'objectLiteralMethod',
                    'typeMethod',
                    'accessor',
                    'enumMember',
                ],
                format: null,
                modifiers: ['requiresQuotes'],
            },
            {
                selector: 'variable',
                format: ['camelCase'],
                types: ['function', 'boolean'],
            },
            {
                selector: 'typeLike',
                format: ['PascalCase'],
            },
        ],
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false,
                },
            },
        ],
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/prefer-readonly': 'warn',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        'no-implicit-coercion': 'error',
        'prefer-template': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        'unicorn/prefer-switch': 'error',
        'no-fallthrough': 'error',
        'no-restricted-globals': [
            'error',
            'eval',
            'Boolean',
            'Function',
            'globalThis',
            { name: 'isFinite', message: 'use Number.isFinite instead.' },
            { name: 'isNaN', message: 'use Number.isNaN instead.' },
        ],
        '@typescript-eslint/method-signature-style': 'error',
        'import/no-cycle': 'error',
        'import/no-useless-path-segments': 'error',
        '@typescript-eslint/consistent-type-imports': [
            'error',
            {
                prefer: 'type-imports',
                fixStyle: 'inline-type-imports',
                disallowTypeAnnotations: true,
            },
        ],
        'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
        '@typescript-eslint/consistent-type-exports': 'error',
        '@typescript-eslint/require-array-sort-compare': 'error',
        'arrow-body-style': ['error', 'as-needed'],
        'func-style': 'error',
        'prefer-arrow-functions/prefer-arrow-functions': [
            'error',
            {
                classPropertiesAllowed: false,
                disallowPrototype: false,
                returnStyle: 'unchanged',
                singleReturnOnly: false,
            },
        ],
    },
};
