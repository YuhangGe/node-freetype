var freetype = require('../build/Release/node-freetype.node');
var Font = require('./obj/font.js');

var _ = require('underscore');
var d = function () {
    console.error.apply(this, arguments);
};

module.exports.parse = parseFont;

function parseFont(buffer) {
    var _free_font = new freetype.FreeType(buffer);
    return new Font(_free_font, buffer);
}
