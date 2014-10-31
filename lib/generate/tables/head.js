'use strict';

// See documentation here: http://www.microsoft.com/typography/otspec/head.htm

var ByteBuffer = require('../byte_buffer.js');
var START_TIME = new Date('1904-1-1').getTime();

function dateToUInt64(date) {
    return Math.floor((date.getTime() - START_TIME) / 1000);
}

function createHeadTable(font) {

    var buf = ByteBuffer.prototype.create(54); // fixed table length
    var head = font.tables.head;

    buf.writeInt32(head.tableVersion); // version
    buf.writeInt32(head.fontRevision); // fontRevision
    buf.writeUint32(head.checkSumAdjustment); // checkSumAdjustment
    buf.writeUint32(head.magicNumber); // magicNumber
    // FLag meanings:
    // Bit 0: Baseline for font at y=0;
    // Bit 1: Left sidebearing point at x=0;
    // Bit 3: Force ppem to integer values for all internal scaler math; may use fractional ppem sizes if this bit is clear;
    buf.writeUint16(head.flags); // flags
    buf.writeUint16(head.unitsPerEM); // unitsPerEm
    buf.writeUint64(dateToUInt64(head.createdTime)); // created
    buf.writeUint64(dateToUInt64(head.modifiedTime)); // modified
    buf.writeInt16(head.xMin); // xMin
    buf.writeInt16(head.yMin); // yMin
    buf.writeInt16(head.xMax); // xMax
    buf.writeInt16(head.yMax); // yMax
    buf.writeUint16(head.macStyle); //macStyle
    buf.writeUint16(head.lowestRecPPEM); // lowestRecPPEM
    buf.writeInt16(head.fontDirection); // fontDirectionHint
    //todo set indexToLocFormat
    // buf.writeInt16(font.ttf_glyph_size < 0x20000 ? 0 : 1); // indexToLocFormat, 0 for short offsets, 1 for long offsets
    buf.writeInt16(head.indexToLocFormat); // indexToLocFormat, 0 for short offsets, 1 for long offsets
    buf.writeInt16(head.glyphDataFormat); // glyphDataFormat

    return buf;
}

module.exports = createHeadTable;
