import funcEsDefault, {funcEs} from 'src/test/module-es'
import funcCjs from './test/assets/module-cjs.cjs'

describe('test', function () {
  it('test', function () {
    assert.strictEqual(funcEs(), 'funcEs')
    assert.strictEqual(funcEsDefault(), 'funcEsDefault')
    assert.strictEqual(funcCjs(), 'funcEsDefault, funcEs, funcCjs')
    console.log('OK')
  })
})
