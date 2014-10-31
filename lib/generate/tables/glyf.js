'use strict';

// See documentation here: http://www.microsoft.com/typography/otspec/glyf.htm

var _ = require('underscore');
var ByteBuffer = require('../byte_buffer.js');

function tableSize(glyphs) {
    var result = 0;
    _.forEach(glyphs, function (glyph) {
        result += glyph.size;
    });
//  font.ttf_glyph_size = result; //sum of all glyph lengths
    return result;
}

function createGlyfTable(font) {
    var glyphs = font._glyphs;
    var data = font._glyphs_data;

    var buf = ByteBuffer.prototype.create(tableSize(glyphs));
    //console.log(glyphs.length);

    _.forEach(glyphs, function (glyph) {
        if (glyph.isEmpty) {
            return;
        }

        var offset = buf.tell();
        buf.writeBytes(data, glyph.data_offset, glyph.data_offset + glyph.data_length);
        var tail = (buf.tell() - offset) % 4;
        if (tail !== 0) { // glyph size must be divisible by 4.
            for (; tail < 4; tail++) {
                buf.writeUint8(0);
            }
        }
    });

    return buf;
}

module.exports = createGlyfTable;
