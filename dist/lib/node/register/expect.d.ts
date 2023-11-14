import { expect } from 'expect';
declare type ExpectExt = typeof expect & {
    or: (...args: any[]) => any;
};
declare const _default: ExpectExt;
export default _default;
