const funcEsDefault = require('../module-es').default
const {funcEs} = require('../module-es')

module.exports = function funcCjs() {
  return [funcEsDefault(), funcEs(), 'funcCjs'].join(', ')
}
