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
d(font.tables.hhea);
//d(font.tables.name);
var gs = _.map([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], function(v) {
    return font._getCharGlyph(v);
});
var i = 0;
gs.forEach(function(g) {
    d(g.data_offset, g.data_offset - font._offset['glyf'], g.data_length, g.size, font.tables.loca[i++]);
});

//d(font.generateSubFont('a葛,bcdef. '));

//var woff_buffer = font.generateSubFont('abcdefg葛羽航').toWOFF();
//fs.writeFileSync('test.woff', woff_buffer);
//todo
//font.tables.os2
//font.tables.name
//font.glyph.getByCharCode(97);
//font.glyph.getByString('abcd我爱你');
