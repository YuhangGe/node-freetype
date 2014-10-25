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
        'name' :  null,
        'info' : null
    };
    this.tables = {};

    this.init_info();
    this.init_table();
}

Font.prototype.init_info = function() {
    this.__defineGetter__("info", function() {
        if(this._tables.info === null) {
            this._tables.info = this._free_font.getInfo();
        }
        return this._tables.info;
    });
};

Font.prototype.init_table = function() {
    var ins = this,
        table = this.tables;
    table.__defineGetter__("head", function() {
        if(ins._tables.head === null) {
            ins._tables.head = ins._free_font.getHeaderTable();
        }
        return ins._tables.head;
    });
    table.__defineGetter__("os2", function() {
        if(ins._tables.os2 === null) {
            ins._tables.os2 = ins._free_font.getOS2Table();
        }
        return ins._tables.os2;
    });
    table.__defineGetter__("name", function() {
       if(ins._tables.name === null) {
           ins._tables.name = ins._free_font.getNameTable();
       }
       return ins._tables.name;
    });
};