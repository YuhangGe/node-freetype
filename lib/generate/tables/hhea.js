'use strict';

// See documentation here: http://www.microsoft.com/typography/otspec/hhea.htm

var ByteBuffer = require('../../byte_buffer.js');

function createHHeadTable(hhea) {

    var buf = ByteBuffer.prototype.create(36); // fixed table length

    buf.writeInt32(hhea.version); // version
    buf.writeInt16(hhea.ascender); // ascent
    buf.writeInt16(hhea.descender); // descend
    buf.writeInt16(hhea.lineGap); // lineGap

    buf.writeUint16(hhea.advanceWidthMax); // advanceWidthMax

    buf.writeInt16(hhea.minLeftSideBearing); // minLeftSideBearing
    buf.writeInt16(hhea.minRightSideBearing); // minRightSideBearing
    buf.writeInt16(hhea.xMaxExtent); // xMaxExtent
    buf.writeInt16(hhea.caretSlopeRise); // caretSlopeRise
    buf.writeInt16(hhea.caretSlopeRun); // caretSlopeRun
    buf.writeInt16(hhea.caretOffset); // caretSlopeRun

    buf.writeInt16(hhea.reserved[0]); // reserved0
    buf.writeInt16(hhea.reserved[1]); // reserved1
    buf.writeInt16(hhea.reserved[2]); // reserved2
    buf.writeInt16(hhea.reserved[3]); // reserved3

    buf.writeInt16(hhea.metricDataFormat); // metricDataFormat
    buf.writeUint16(hhea.numberOfHMetrics); // numberOfHMetrics

    return buf;
}

module.exports = createHHeadTable;
