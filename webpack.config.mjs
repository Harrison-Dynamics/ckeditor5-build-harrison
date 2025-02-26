import path from 'path'
import module from 'module'
import { fileURLToPath } from 'url'

import { CKEditorTranslationsPlugin } from '@ckeditor/ckeditor5-dev-translations'
import { loaders } from '@ckeditor/ckeditor5-dev-utils'
import TerserPlugin from 'terser-webpack-plugin'

const require = module.createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: path.resolve(__dirname, 'src', 'index.js'),

    output: {
        // The name under which the editor will be exported.
        library: 'HarrisonEditor',

        path: path.resolve(__dirname, 'build'),
        filename: 'build.js',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },

    plugins: [
        new CKEditorTranslationsPlugin({
            language: 'ro'
        })
    ],

    optimization: {
        minimizer: [
            new TerserPlugin({
                // sourceMap: true,
                terserOptions: {
                    output: {
                        // Preserve CKEditor 5 license comments.
                        comments: /^!/
                    }
                },
                extractComments: false
            })
        ]
    },

    module: {
        rules: [
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                use: ['raw-loader']
            },
            loaders.getStylesLoader({
                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
                minify: true
            }),
        ]
    }
};

