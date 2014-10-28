var freetype = require('../index.js');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var d = function() {
    console.error.apply(this, arguments);
};

var src = fs.readFileSync(path.join(__dirname, 'fonts/times.ttf'));
var font = freetype.parse(src);

//var charset = 'abcdefg中国超级账号';
var charset = 'a中';

var charcode = _.map(charset, function(c) {
    return c.charCodeAt(0);
});

//var glyphs = font.getGlyphArray(charcode);

//console.log(font.info);
//console.log(font.tables.head);
//console.log(font.tables.os2);
//console.log(font.tables.maxp);
//console.log(font.tables.hhea);
//console.log(font.tables.vhea);
//for(var k in font.tables.name) {
//    console.log(k, font.tables.name[k]);
//}
//d(font.tables.loca);

d(font.generateSubFont('a葛,bcdef. '));

//var woff_buffer = font.generateSubFont('abcdefg葛羽航').toWOFF();
//fs.writeFileSync('test.woff', woff_buffer);
//todo
//font.tables.os2
//font.tables.name
//font.glyph.getByCharCode(97);
//font.glyph.getByString('abcd我爱你');
