import path from 'path'
import browserslist from 'browserslist'

import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'

import swc from 'rollup-plugin-swc'
import vue from 'unplugin-vue/rollup'
import sass from '@cheap-pets/rollup-plugin-postcss-scss'

import { string } from 'rollup-plugin-string'

import { fileURLToPath } from 'url'
import { getColorVariables } from './src/theme.js'

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
    assetFileNames: '[name].[ext]',
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
      extract: true,
      minify: isDevEnv ? 0 : 1,
      variables: getColorVariables()
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
    })
    // commonjs()
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
