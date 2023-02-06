'use strict'

module.exports = {
  require: [
    'tsconfig-paths/register',
    'ts-node/register',
    './src/node/register/register.ts',
  ],
  'watch-files': ['./src/**'],
  ignore       : ['./**/*.d.ts', './**/-deprecated/**'],
  'node-option': [
    // 'prof',
  ],
}
