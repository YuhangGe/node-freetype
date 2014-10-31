'use strict';

// See documentation here: http://www.microsoft.com/typography/otspec/post.htm

var _ = require('underscore');
var ByteBuffer = require('../byte_buffer.js');

function tableSize(glyphs, names) {
    var result = 36; // table header
    result += glyphs.length * 2; // name declarations
    _.forEach(names, function (name) {
        result += name.length;
    });
    return result;
}

function pascalString(str) {
    var bytes = [];
    var len = str ? (str.length < 256 ? str.length : 255) : 0; //length in Pascal string is limited with 255
    bytes.push(len);
    for (var i = 0; i < len; i++) {
        var char = str.charCodeAt(i);
        bytes.push(char < 128 ? char : 95); //non-ASCII characters are substituted with '_'
    }
    return bytes;
}

function createPostTable(font) {
    var post_table = font.tables.post;
    var glyphs = font._glyphs;
    var names = [];

    _.forEach(glyphs, function (glyph) {
        if (glyph.unicode !== 0) {
            names.push(pascalString(glyph.name));
        }
    });

    var buf = ByteBuffer.prototype.create(tableSize(glyphs, names));

    buf.writeInt32(post_table.formatType); // formatType,  version 2.0
    buf.writeInt32(post_table.italicAngle); // italicAngle
    buf.writeInt16(post_table.underlinePosition); // underlinePosition
    buf.writeInt16(post_table.underlineThickness); // underlineThickness
    buf.writeUint32(post_table.isFixedPitch); // isFixedPitch
    buf.writeUint32(post_table.minMemType42); // minMemType42
    buf.writeUint32(post_table.maxMemType42); // maxMemType42
    buf.writeUint32(post_table.minMemType1); // minMemType1
    buf.writeUint32(post_table.maxMemType1); // maxMemType1
    buf.writeUint16(glyphs.length); // numberOfGlyphs

    // Array of glyph name indexes
    var index = 258; // first index of custom glyph name, it is calculated as glyph name index + 258

    _.forEach(glyphs, function (glyph) {
        if (glyph.unicode === 0) {
            buf.writeUint16(0);// missed element should have .notDef name in the Macintosh standard order.
        } else {
            buf.writeUint16(index++);
        }
    });

    // Array of glyph name indexes
    _.forEach(names, function (name) {
        buf.writeBytes(name);
    });

    return buf;
}

module.exports = createPostTable;
