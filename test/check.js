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

//todo
//font.tables.os2
//font.tables.name
//font.glyph.getByCharCode(97);
//font.glyph.getByString('abcd我爱你');
