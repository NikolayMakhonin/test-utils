'use strict'

module.exports = {
  require: [
    'tsconfig-paths/register',
    'ts-node/register',
    './src/register/register.ts',
  ],
  'watch-files': ['./src/**'],
  ignore       : ['./**/*.d.ts', './**/-deprecated/**'],
  'node-option': [
    // 'prof',
  ],
}
