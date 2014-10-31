'use strict';

// See documentation here: http://www.microsoft.com/typography/otspec/maxp.htm

var _ = require('underscore');
var ByteBuffer = require('../byte_buffer.js');

// Find max points in glyph TTF contours.
function getMaxPoints(glyphs) {
    return 0;
//    return _.max(_.map(glyphs, function (glyph) {
//        return glyph.points.length;
//    }));
}

function getMaxContours(glyphs) {
    return 0;
//    return _.max(_.map(glyphs, function (glyph) {
//        return glyph.ttfContours.length;
//    }));
}

function createMaxpTable(font) {
    var glyphs = font._glyphs;
    var buf = ByteBuffer.prototype.create(32);
    var maxp = font.tables.maxp;

    buf.writeInt32(maxp.version); // version
    buf.writeUint16(glyphs.length); // numGlyphs
    buf.writeUint16(maxp.maxPoints);// getMaxPoints(glyphs)); // maxPoints
    buf.writeUint16(maxp.maxContours); //getMaxContours(glyphs)); // maxContours
    buf.writeUint16(maxp.maxCompositePoints); // maxCompositePoints
    buf.writeUint16(maxp.maxCompositeContours); // maxCompositeContours
    buf.writeUint16(maxp.maxZones); // maxZones
    buf.writeUint16(maxp.maxTwilightPoints); // maxTwilightPoints
    // It is unclear how to calculate maxStorage, maxFunctionDefs and maxInstructionDefs.
    // These are magic constants now, with values exceeding values from FontForge
    buf.writeUint16(maxp.maxStorage); // maxStorage
    buf.writeUint16(maxp.maxFunctionDefs); // maxFunctionDefs
    buf.writeUint16(maxp.maxInstructionDefs); // maxInstructionDefs
    buf.writeUint16(maxp.maxStackElements); // maxStackElements
    buf.writeUint16(maxp.maxSizeOfInstructions); // maxSizeOfInstructions
    buf.writeUint16(maxp.maxComponentElements); // maxComponentElements
    buf.writeUint16(maxp.maxComponentDepth); // maxComponentDepth

    return buf;
}

module.exports = createMaxpTable;
