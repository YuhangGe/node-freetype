var fs = require('fs'),
    freetype = require('../index.js');

var buf = fs.readFileSync(process.argv[2]);
var font = freetype.parse(buf);

console.log(font);
