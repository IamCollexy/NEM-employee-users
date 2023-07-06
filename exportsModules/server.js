console.log('Hello WORLD');
// console.log(global);
const os = require('os');
// console.log(os.type());
// console.log(os.version());

// console.log(os.homedir());

const path = require('path');

// console.log(__dirname);
// console.log(__filename);
// console.log(path.dirname(__filename));
// console.log(path.basename(__filename));
// console.log(path.extname(__filename));
// console.log(path.parse(__filename));
const { add, subtract, multiply, divide } = require('./math');

console.log(add(3, 4));
console.log(subtract(3, 4));
console.log(multiply(3, 4));
console.log(divide(3, 4));
