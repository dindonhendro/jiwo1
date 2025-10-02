// Polyfill for Node.js APIs in browser environment
if (typeof global === 'undefined') {
  var global = globalThis;
}

// Suppress specific warnings that can cause build issues
const originalWarn = console.warn;
console.warn = function(...args) {
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    (args[0].includes('Critical dependency') || 
     args[0].includes('Module not found: Error: Can\'t resolve \'encoding\''))
  ) {
    return;
  }
  originalWarn.apply(console, args);
};