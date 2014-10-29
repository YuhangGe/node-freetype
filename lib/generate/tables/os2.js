'use strict';

// See documentation here: http://www.microsoft.com/typography/otspec/os2.htm

var _ = require('underscore');
var ByteBuffer = require('../byte_buffer.js');

//get first glyph unicode
function getFirstCharIndex(font) {
    var minGlyph = _.min(font.glyphs, function (glyph) {
        return (glyph.unicode === 0) ? 0xFFFF : (glyph.unicode || 0);
    });
    if (minGlyph) {
        return minGlyph.unicode > 0xFFFF ? 0xFFFF : (minGlyph.unicode || 0);
    } else {
        return 0xFFFF;
    }
}

//get last glyph unicode
function getLastCharIndex(font) {
    var maxGlyph = _.max(font.glyphs, 'unicode');
    if (maxGlyph) {
        return maxGlyph.unicode > 0xFFFF ? 0xFFFF : (maxGlyph.unicode || 0);
    } else {
        return 0xFFFF;
    }
}

function createOS2Table(font) {

    var buf = ByteBuffer.prototype.create(86);
    var os2 = font.tables.os2;

    buf.writeUint16(1); //version
    buf.writeInt16(os2.avgWidth); // xAvgCharWidth
    buf.writeUint16(os2.weightClass); // usWeightClass
    buf.writeUint16(os2.widthClass); // usWidthClass
    buf.writeInt16(os2.fsType); // fsType
    buf.writeInt16(os2.ySubscriptXSize); // ySubscriptXSize
    buf.writeInt16(os2.ySubscriptYSize); //ySubscriptYSize
    buf.writeInt16(os2.ySubscriptXOffset); // ySubscriptXOffset
    buf.writeInt16(os2.ySubscriptYOffset); // ySubscriptYOffset
    buf.writeInt16(os2.ySuperscriptXSize); // ySuperscriptXSize
    buf.writeInt16(os2.ySuperscriptYSize); // ySuperscriptYSize
    buf.writeInt16(os2.ySuperscriptXOffset); // ySuperscriptXOffset
    buf.writeInt16(os2.ySuperscriptYOffset); // ySuperscriptYOffset
    buf.writeInt16(os2.yStrikeoutSize); // yStrikeoutSize
    buf.writeInt16(os2.yStrikeoutPosition); // yStrikeoutPosition
    buf.writeInt16(os2.familyClass); // sFamilyClass
    buf.writeUint8(os2.panose[0]); // panose.bFamilyType
    buf.writeUint8(os2.panose[1]); // panose.bSerifStyle
    buf.writeUint8(os2.panose[2]); // panose.bWeight
    buf.writeUint8(os2.panose[3]); // panose.bProportion
    buf.writeUint8(os2.panose[4]); // panose.bContrast
    buf.writeUint8(os2.panose[5]); // panose.bStrokeVariation
    buf.writeUint8(os2.panose[6]); // panose.bArmStyle
    buf.writeUint8(os2.panose[7]); // panose.bLetterform
    buf.writeUint8(os2.panose[8]); // panose.bMidline
    buf.writeUint8(os2.panose[9]); // panose.bXHeight
    buf.writeUint32(os2.ulUnicodeRange1); // ulUnicodeRange1
    buf.writeUint32(os2.ulUnicodeRange2); // ulUnicodeRange2
    buf.writeUint32(os2.ulUnicodeRange3); // ulUnicodeRange3
    buf.writeUint32(os2.ulUnicodeRange4); // ulUnicodeRange4
    buf.writeUint8(os2.achVendID[0]); //achVendID
    buf.writeUint8(os2.achVendID[1]);
    buf.writeUint8(os2.achVendID[2]);
    buf.writeUint8(os2.achVendID[3]);
    buf.writeUint16(os2.fsSelection); // fsSelection
    buf.writeUint16(getFirstCharIndex(font)); // usFirstCharIndex
    buf.writeUint16(getLastCharIndex(font)); // usLastCharIndex
    buf.writeInt16(os2.sTypoAscender); // sTypoAscender
    buf.writeInt16(os2.sTypoDescender); // sTypoDescender
    buf.writeInt16(os2.sTypoLineGap); // lineGap
    // Enlarge win acscent/descent to avoid clipping
    buf.writeInt16(os2.usWinAscent); // usWinAscent
    buf.writeInt16(os2.usWinDescent); // usWinDescent
    buf.writeInt32(os2.ulCodePageRange1); // ulCodePageRange1, Latin 1
    buf.writeInt32(os2.ulCodePageRange2); // ulCodePageRange2

    return buf;
}

module.exports = createOS2Table;
