import {
    defineConfig,
    presetIcons,
    presetUno,
    transformerDirectives,
} from 'unocss'
import { presetDaisy } from '@ameinhardt/unocss-preset-daisy'

export default defineConfig({
    presets: [
        presetUno({
            dark: 'class',
        }),
        presetDaisy({
            themes: ['emerald', 'forest'],
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
})
