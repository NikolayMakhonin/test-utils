import { expect } from 'expect';
export { expect as default } from 'expect';

// const _expect: typeof expect = typeof (expect as any).default === 'function'
//   ? (expect as any).default
//   : expect
expect.extend({
    or(received, ...expecteds) {
        function message() {
            return `expected ${expecteds
                .map(expected => this.utils.printExpected(expected))
                .join(' | ')}, but received ${this.utils.printReceived(received)}`;
        }
        for (let i = 0, len = expecteds.length; i < len; i++) {
            const expected = expecteds[i];
            if ((expected
                && typeof expected.asymmetricMatch === 'function'
                && expected.asymmetricMatch(received))
                || received === expected) {
                return {
                    pass: true,
                    message,
                };
            }
        }
        return {
            pass: false,
            message,
        };
    },
});
