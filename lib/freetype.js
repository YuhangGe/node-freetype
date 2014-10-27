var freetype = require('../build/Release/node-freetype.node');
var _ = require('underscore');

module.exports.parse = parse;

var nameTableNames = [
    'copyright',              // 0
    'fontFamily',             // 1
    'fontSubfamily',          // 2
    'uniqueID',               // 3
    'fullName',               // 4
    'version',                // 5
    'postScriptName',         // 6
    'trademark',              // 7
    'manufacturer',           // 8
    'designer',               // 9
    'description',            // 10
    'manufacturerURL',        // 11
    'designerURL',            // 12
    'licence',                // 13
    'licenceURL',             // 14
    'reserved',               // 15
    'preferredFamily',        // 16
    'preferredSubfamily',     // 17
    'compatibleFullName',     // 18
    'sampleText',             // 19
    'postScriptFindFontName', // 20
    'wwsFamily',              // 21
    'wwsSubfamily'            // 22
];

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
           var nt = {};
           var narr = ins._free_font.getNameTable();
           var i, count = narr.length;
           for(i = 0; i < count; i++) {
               var no = narr[i],
                   platformID = no.platformId,
                   encodingID = no.encodingId,
                   languageID = no.languageId;
               var nameID = no.nameId,
                   property = nameTableNames[nameID];
               var unknowCount = 0;
//               console.log(no.nameId, no);
               // platformID - encodingID - languageID standard combinations :
               // 1 - 0 - 0 : Macintosh, Roman, English
               // 3 - 1 - 0x409 : Windows, Unicode BMP (UCS-2), en-US
               if (platformID === 3 && encodingID === 1 && languageID === 0x409) {
                   var str = no.string.toString();
                   if (property) {
                       nt[property] = str;
                   }
                   else {
                       unknowCount++;
                       nt['unknown'+unknowCount] = str;
                   }
               }

           }
           ins._tables.name = nt;
       }
       return ins._tables.name;
    });
};