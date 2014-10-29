'use strict';

// See documentation here: http://www.microsoft.com/typography/otspec/loca.htm

var _ = require('lodash');
var ByteBuffer = require('../../byte_buffer.js');

function tableSize(glyphs, isShortFormat) {
    return (glyphs.length + 1) * (isShortFormat ? 2 : 4); // by glyph count + tail
}

function createLocaTable(glyphs, isShortFormat) {

    if(!isShortFormat) {
        throw 'not implement.';
    }
    var buf = ByteBuffer.prototype.create(tableSize(glyphs, isShortFormat));

    var location = 0;
    // Array of offsets in GLYF table for each glyph
    _.forEach(glyphs, function (glyph) {
        if(glyph.isEmpty) {
            buf.writeUint32(location);
        } else {
            buf.writeUint32(location);
            location += glyph.size;
        }
//        if (isShortFormat) {
//            buf.writeUint16(location);
//            location += glyph.size / 2; // actual location must be divided to 2 in short format
//        } else {
//            buf.writeUint32(location);
//            location += glyph.size; //actual location is stored as is in long format
//        }
    });

    // The last glyph location is stored to get last glyph length
    if (isShortFormat) {
        buf.writeUint16(location);
    } else {
        buf.writeUint32(location);
    }

    return buf;
}

module.exports = createLocaTable;
