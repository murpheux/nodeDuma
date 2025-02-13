// eslint.config.js

export default [
    {
        rules: {
            semi: ['error', 'never'],
            'no-console': 'warn',
            'no-unused-vars': ['error', {'args': 'after-used', 'argsIgnorePattern': '^_'}],
            'no-use-before-define': 'error',
            'no-alert': 'error',
            'indent': ['error', 4],
            quotes: ['warn', 'single'],
            'spaced-comment': ['error', 'always', {
                'line': {
                    'markers': ['/'],
                    'exceptions': ['-', '+']
                },
                'block': {
                    'markers': ['!'],
                    'exceptions': ['*'],
                    'balanced': true
                }
            }],
        }
    }
]
