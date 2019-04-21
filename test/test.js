const fs = require('fs')
const transform = require('../index')
const source = fs.readFileSync(__dirname + '/test.vue').toString()

console.log(transform(source))
