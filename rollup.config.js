import path from 'path'

import browserslist from 'browserslist'

import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

import swc from 'rollup-plugin-swc'
import vue from 'unplugin-vue/rollup'
import sass from 'rollup-plugin-sass'

import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import simpleVars from 'postcss-simple-vars'
import discardComments from 'postcss-discard-comments'

import { string } from 'rollup-plugin-string'

import { fileURLToPath } from 'url'

import variables from './src/schemes/variables.js'

const isDevEnv = process.env.dev
const currentDir = path.dirname(fileURLToPath(import.meta.url))

function warn (...args) {
  console.warn('\x1b[33m%s', ...args, '\x1b[0m')
}

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
    vue({
      inlineTemplate: !isDevEnv
    }),
    string({
      include: '**/*.svg'
    }),
    sass({
      include: ['**/*.css', '**/*.scss' ],
      exclude: [],
      output: true,
      options: {
        data: Object.entries(variables).map(([key, value]) => `$${key}: ${value};`).join('\n'),
        outputStyle: isDevEnv ? 'expanded' : 'compressed',
        stripComments: true
      },
      processor: css => postcss([simpleVars({ variables }), discardComments, autoprefixer])
        .process(css, { from: undefined })
        .then(result => result.css)
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

    warn(`[!] ${code || warning}`)

    if (plugin) warn(`... Plugin: ${plugin}`)
    if (id) warn(`... id: ${id}`)
    if (input) warn(`... Input: ${input.file || input}`)
    if (message) warn(`... message: ${message}`)
  }
}
