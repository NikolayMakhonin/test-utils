import funcEsDefault, {funcEs} from 'src/common/test/module-es'
// eslint-disable-next-line node/no-extraneous-import
import funcCjs from 'assets'

describe('common', function () {
  it('assert + imports', function () {
    assert.strictEqual(funcEs(), 'funcEs')
    assert.strictEqual(funcEsDefault(), 'funcEsDefault')
    assert.strictEqual(funcCjs(), 'funcEsDefault, funcEs, funcCjs')
    console.log('OK')
  })
})
