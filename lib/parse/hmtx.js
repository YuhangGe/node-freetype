// The `hmtx` table contains the horizontal metrics for all glyphs.
// https://www.microsoft.com/typography/OTSPEC/hmtx.htm

'use strict';

var parse = require('./parse.js');

// Parse the `hmtx` table, which contains the horizontal metrics for all glyphs.
// This function augments the glyph array, adding the advanceWidth and leftSideBearing to each glyph.
function parseHmtxTable(data, start, numMetrics, numGlyphs, glyphs) {
    var p, i, glyph, advanceWidth, leftSideBearing;
    p = new parse.Parser(data, start);
    for (i = 0; i < numGlyphs; i += 1) {
        // If the font is monospaced, only one entry is needed. This last entry applies to all subsequent glyphs.
        if (i < numMetrics) {
            advanceWidth = p.parseUShort();
            leftSideBearing = p.parseShort();
        }
        glyph = glyphs[i];
        glyph.advanceWidth = advanceWidth;
        glyph.leftSideBearing = leftSideBearing;
    }
}

function getHmtx(data, start, numMetrics, glyphIndex) {
    if(glyphIndex >= numMetrics) {
        glyphIndex = numMetrics - 1;
    }
    var offset = glyphIndex * 4;
    var width = parse.getUShort(data, start + offset);
    var lsb = parse.getShort(data, start + offset + 2);
    return {
        advanceWidth : width,
        leftSideBearing : lsb
    };
}
exports.parse = parseHmtxTable;
exports.getHmtx = getHmtx;



