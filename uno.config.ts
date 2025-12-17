import {
    defineConfig,
    presetIcons,
    presetUno,
    transformerDirectives,
} from 'unocss'

export default defineConfig({
    presets: [
        presetUno({
            dark: 'class',
        }),
        presetIcons({
            scale: 1.2,
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
            },
        }),
    ],
    transformers: [
        transformerDirectives(),
    ],
    shortcuts: {
        // Buttons
        'btn': 'px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2',
        'btn-primary': 'btn bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25',
        'btn-default': 'btn bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200',
        'btn-success': 'btn bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
        'btn-ghost': 'btn hover:bg-gray-100 dark:hover:bg-gray-800',
        // Card
        'card': 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5',
        // Input
        'input': 'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
        // Alert/Message
        'alert': 'px-4 py-3 rounded-lg text-sm',
        'alert-error': 'alert bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800',
        'alert-success': 'alert bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
        'alert-warning': 'alert bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
    },
    theme: {
        colors: {
            primary: {
                DEFAULT: '#10b981',
                50: '#ecfdf5',
                100: '#d1fae5',
                200: '#a7f3d0',
                300: '#6ee7b7',
                400: '#34d399',
                500: '#10b981',
                600: '#059669',
                700: '#047857',
                800: '#065f46',
                900: '#064e3b',
            },
        },
    },
})
