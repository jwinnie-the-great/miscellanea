
// Add ES6 Array.prototype.includes (supported in Node.js, but not in TS)
interface Array<T> {
    includes(item: T): boolean
}