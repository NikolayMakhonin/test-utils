import { expect as expect$1 } from 'expect';

const expect = expect$1;
expect.extend({
    custom(received, expected) {
        const result = expected.call(this, received);
        if (typeof result === 'boolean') {
            // it is asymmetric match
            return {
                pass: result,
                message: void 0, // message is not used in asymmetric match
            };
        }
        return result;
    },
});
const custom = expect.custom;
expect.custom = (match, message) => {
    if (message == null) {
        return custom.call(expect, match);
    }
    const newMatch = function newMatch() {
        return match.apply(this, arguments);
    };
    Object.defineProperty(newMatch, 'name', { value: match.name });
    if (typeof message === 'string') {
        newMatch.toString = function toString() {
            return message;
        };
    }
    else if (typeof message === 'function') {
        newMatch.toString = message;
    }
    else {
        throw new Error('expect.custom: message must be a string or a function');
    }
    return custom.call(expect, newMatch);
};

export { expect as default };
