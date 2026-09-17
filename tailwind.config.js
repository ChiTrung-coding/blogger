/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    50:  '#f0f4ff',
                    100: '#e0e9ff',
                    200: '#c0d2ff',
                    300: '#93b0ff',
                    400: '#6085ff',
                    500: '#3b5bfc',
                    600: '#2035f1',
                    700: '#1827de',
                    800: '#1a22b4',
                    900: '#1b238e',
                    950: '#141657',
                },
                'deep-blue': {
                    50:  '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        maxWidth: '72ch',
                        color: theme('colors.slate.800'),
                        a: {
                            color: theme('colors.deep-blue.600'),
                            '&:hover': { color: theme('colors.deep-blue.800') },
                        },
                        code: {
                            backgroundColor: theme('colors.slate.100'),
                            borderRadius: theme('borderRadius.sm'),
                            padding: '0.1em 0.3em',
                            fontWeight: '400',
                        },
                        'code::before': { content: 'none' },
                        'code::after':  { content: 'none' },
                    },
                },
                dark: {
                    css: {
                        color: theme('colors.slate.200'),
                        a: {
                            color: theme('colors.deep-blue.400'),
                            '&:hover': { color: theme('colors.deep-blue.300') },
                        },
                        h1: { color: theme('colors.slate.100') },
                        h2: { color: theme('colors.slate.100') },
                        h3: { color: theme('colors.slate.100') },
                        h4: { color: theme('colors.slate.200') },
                        strong: { color: theme('colors.slate.100') },
                        blockquote: {
                            color: theme('colors.slate.300'),
                            borderLeftColor: theme('colors.deep-blue.600'),
                        },
                        code: {
                            backgroundColor: theme('colors.slate.800'),
                            color: theme('colors.slate.200'),
                        },
                        'thead th': { color: theme('colors.slate.200') },
                        'tbody tr': { borderBottomColor: theme('colors.slate.700') },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
