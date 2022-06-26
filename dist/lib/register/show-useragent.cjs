'use strict';

console.log(`USER_AGENT: ${typeof window !== 'undefined'
    ? window.navigator.userAgent
    : 'Node.JS'}`);
