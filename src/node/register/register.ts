import 'src/common/register/register'
import _expect from 'src/node/register/expect/expect'

;(global as any).expect = _expect

declare global {
  const expect: typeof _expect
}
