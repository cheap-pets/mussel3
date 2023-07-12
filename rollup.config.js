import path from 'path'

import browserslist from 'browserslist'

import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

import swc from 'rollup-plugin-swc'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'

import postcssCalc from 'postcss-calc'
import autoprefixer from 'autoprefixer'
import postcssNest from 'postcss-nested'
import postcssAdvanced from 'postcss-advanced-variables'

import { string } from 'rollup-plugin-string'
import { yellow } from 'colorette'

import variables from './src/schemes/postcss-variables.js'

import { fileURLToPath } from 'url'

const isDevEnv = process.env.dev
const currentDir = path.dirname(fileURLToPath(import.meta.url))

export default {
  input: 'src/index.js',
  output: {
    file: isDevEnv ? 'dist/mussel.js' : 'dist/mussel.min.js',
    format: 'umd',
    name: 'mussel',
    globals: {
      vue: 'Vue'
    },
    sourcemap: true
  },
  external: ['vue'],
  plugins: [
    alias({
      entries: [
        {
          find: '~icons',
          replacement: path.resolve(currentDir, 'node_modules/@tabler/icons/icons')
        },
        {
          find: '@',
          replacement: path.resolve(currentDir, 'src')
        }
      ]
    }),
    vue(),
    string({
      include: '**/*.svg'
    }),
    postcss({
      extensions: ['.css', '.pcss', '.postcss'],
      minimize: !isDevEnv,
      plugins: [
        postcssAdvanced({ variables }),
        // postcssCustomProps,
        postcssCalc,
        postcssNest,
        autoprefixer
      ],
      extract: path.resolve(currentDir, isDevEnv ? 'dist/mussel.css' : 'dist/mussel.min.css')
    }),
    resolve({
      mainFields: ['module', 'main', 'browser']
    }),
    swc.default({
      jsc: {
        minify: {
          mangle: !isDevEnv
        }
      },
      env: {
        targets: browserslist.findConfig(currentDir).defaults,
        coreJs: 3
      },
      minify: !isDevEnv
    }),
    commonjs()
  ],
  onwarn: warning => {
    const { code, plugin, id, input, message } = warning

    console.warn(yellow(`[!] ${code || warning}`))

    if (plugin) console.warn(yellow(`... Plugin: ${plugin}`))
    if (id) console.warn(yellow(`... id: ${id}`))
    if (input) console.warn(yellow(`... Input: ${input.file || input}`))
    if (message) console.warn(yellow(`... message: ${message}`))
  }
}
