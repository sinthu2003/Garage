/**
 * usage: import this file in main.tsx or index.tsx to block console outputs
 */

const noop = () => { };

// Override all console methods to silence output
console.log = noop;
console.warn = noop;
console.error = noop;
console.info = noop;
console.debug = noop;
console.table = noop;
console.trace = noop;
console.group = noop;
console.groupEnd = noop;
console.groupCollapsed = noop;
console.count = noop;
console.countReset = noop;
console.time = noop;
console.timeLog = noop;
console.timeEnd = noop;
