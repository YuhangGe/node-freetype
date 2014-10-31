'use strict';

// See documentation here: http://www.microsoft.com/typography/otspec/hmtx.htm

var _ = require('underscore');
var ByteBuffer = require('../byte_buffer.js');

function createHtmxTable(font) {
    var glyphs = font._glyphs;

    var buf = ByteBuffer.prototype.create(glyphs.length * 4);
    _.forEach(glyphs, function (glyph) {
        buf.writeUint16(glyph.advanceWidth); //advanceWidth
        buf.writeInt16(glyph.leftSideBearing); //lsb
    });
    return buf;
}

module.exports = createHtmxTable;
