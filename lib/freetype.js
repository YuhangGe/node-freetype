var freetype = require('../build/Release/node-freetype.node');
var _ = require('underscore');

module.exports.parse = parse;


function parse(buffer) {
    var _free_font = freetype.parse(buffer);
    return new Font(_free_font);
}

function Font(free_font) {
    this._free_font = free_font;
    this._tables = {
        'head' : null,
        'os2' : null,
        'name' :  null
    };
    this.tables = {};

    init_font(this, this._free_font);
    init_table(this.tables, this);
}

function init_font(ins, font) {
    _.extend(ins, font);
}

function init_table(table, ins) {
    table.__defineGetter__("head", function() {
        if(ins._tables.head === null) {
            ins._tables.head = ins._free_font.getHeader();
        }
        return ins._tables.head;
    });
    table.__defineGetter__("os2", function() {
        if(ins._tables.os2 === null) {
            ins._tables.os2 = ins._free_font.getOS2();
        }
        return ins._tables.os2;
    });
}