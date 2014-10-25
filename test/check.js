var freetype = require('../index.js');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');


var src = fs.readFileSync(path.join(__dirname, 'fonts/NotoSansHans-Black.ttf'));
var font = freetype.parse(src);

//var charset = 'abcdefg中国超级账号';
var charset = 'a中';

var charcode = _.map(charset, function(c) {
    return c.charCodeAt(0);
});

//var glyphs = font.getGlyphArray(charcode);

console.log(font.info);
console.log(font.tables.head);

//console.log(font.tables.head.magicNumber.toString(16));