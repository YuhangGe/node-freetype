var freetype = require('../build/Release/node-freetype.node');
var _ = require('underscore');
var parse = require('./parse/parse.js');
var loca = require('./parse/loca.js');
var glyf = require('./parse/glyf.js');
var d = function () {
    console.error.apply(this, arguments);
};

module.exports.parse = parseFont;

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

function parseFont(buffer) {
    var _free_font = freetype.parse(buffer);
    return new Font(_free_font, buffer);
}

function Font(free_font, buffer) {
    this._free_font = free_font;
    this._buffer = buffer;
    this._glyph_cache = [];
    this._name_cache = [];
    this._tables = {
        'head' : null,
        'os2' : null,
        'name' :  null,
        'info' : null,
        'post' : null,
        'pclt' : null,
        'maxp' : null,
        'hhea' : null,
        'vhea' : null,
        'loca' : null
    };
    this._offset = {};
    this.tables = {};

    this.init_info();
    this.init_table();

    this._parse();

}

Font.prototype._parse = function() {
    var data = this._buffer;
    var version = parse.getFixed(data, 0);
    if (version === 1.0) {
        this.info.outlinesFormat = 'truetype';
    } else {
        version = parse.getTag(data, 0);
        if (version === 'OTTO') {
            this.info.outlinesFormat = 'cff';
        } else {
            throw new Error('Unsupported OpenType version ' + version);
        }
    }

    var numTables = parse.getUShort(data, 4);

    var glyfOffset, locaOffset, cffOffset;

    // Offset into the table records.
    var p = 12;
    for (var i = 0; i < numTables; i += 1) {
        var tag = parse.getTag(data, p);
        this._offset[tag] = parse.getULong(data, p + 8);
        p += 16;

//        switch (tag) {
//            case 'cmap':
//                break;
//            case 'head':
//                break;
//            case 'hhea':
//                break;
//            case 'hmtx':
////                hmtxOffset = offset;
//                break;
//            case 'maxp':
//                break;
//            case 'name':
//                break;
//            case 'OS/2':
//                break;
//            case 'post':
////                font.tables.post = post.parse(data, offset);
////                font.glyphNames = new encoding.GlyphNames(font.tables.post);
//                break;
//            case 'glyf':
//                glyfOffset = offset;
//                break;
//            case 'loca':
//                locaOffset = offset;
//                break;
//            case 'CFF ':
//                cffOffset = offset;
//                break;
//            case 'kern':
////                kernOffset = offset;
//                break;
//            case 'GPOS':
////                gposOffset = offset;
//                break;
//        }
    }

    if (this._offset['glyf'] && this._offset['loca']) {
//        shortVersion = indexToLocFormat === 0;
//        var maxp = this.tables.maxp;
//        var numGlyphs = maxp.numGlyphs;
//        var locaTable = loca.parse(data, locaOffset, numGlyphs, 0);
//        this._tables.loca = locaTable;
//        font.glyphs = glyf.parse(data, glyfOffset, locaTable, font);
//        hmtx.parse(data, hmtxOffset, font.numberOfHMetrics, font.numGlyphs, font.glyphs);
//        encoding.addGlyphNames(font);
//        console.log('load truetype font');
    } else if (this._offset['cff']) {
        throw new Exception('Not implemented. todo: cff format support.');
//        cff.parse(data, cffOffset, font);
//        encoding.addGlyphNames(font);
    } else {
        throw new Exception('Unsupported font file format.');
    }
//
//    if (font.supported) {
//        if (kernOffset) {
//            font.kerningPairs = kern.parse(data, kernOffset);
//        } else {
//            font.kerningPairs = {};
//        }
//        if (gposOffset) {
//            gpos.parse(data, gposOffset, font);
//        }
//    }
};

Font.prototype._getLocaTable = function() {
    var maxp = this.tables.maxp;
    var numGlyphs = maxp.numGlyphs;
    this._tables.loca = loca.parse(this._buffer, this._offset['loca'], numGlyphs, 0);
};

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

    table.__defineGetter__("pclt", function() {
        if(ins._tables.pclt === null) {
            ins._tables.pclt = ins._free_font.getPcltTable();
        }
        return ins._tables.pclt;
    });
    table.__defineGetter__("loca", function() {
        if(ins._tables.loca === null) {
            ins._getLocaTable();
        }
        return ins._tables.loca;
    });
    table.__defineGetter__("post", function() {
        if(ins._tables.post === null) {
            ins._tables.post = ins._free_font.getPostTable();
        }
        return ins._tables.post;
    });
    table.__defineGetter__("maxp", function() {
        if(ins._tables.maxp === null) {
            ins._tables.maxp = ins._free_font.getMaxProfileTable();
        }
        return ins._tables.maxp;
    });
    table.__defineGetter__("os2", function() {
        if(ins._tables.os2 === null) {
            ins._tables.os2 = ins._free_font.getOS2Table();
        }
        return ins._tables.os2;
    });
    table.__defineGetter__("hhea", function() {
        if(ins._tables.hhea === null) {
            ins._tables.hhea = ins._free_font.getHheaTable();
        }
        return ins._tables.hhea;
    });
    table.__defineGetter__("vhea", function() {
        if(ins._tables.vhea === null) {
            ins._tables.vhea = ins._free_font.getVheaTable();
        }
        return ins._tables.vhea;
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

Font.prototype.getCharIndex = function(charcode) {
    if(typeof charcode === 'string') {
        charcode = _.map(charcode, function(chr) {
            return chr.charCodeAt(0);
        });
    } else if(typeof charcode !== 'number' && !charcode instanceof Array) {
        throw new Exception('bad arguments at Font::getCharIndex');
    }
    return this._free_font.getCharIndex(charcode);
};


Font.prototype._getCharGlyph = function(idx) {
    if(!this._glyph_cache[idx]) {
        this._glyph_cache[idx] = glyf.parseGlyfByIndex(this._buffer, this._offset['glyf'], this.tables.loca, idx);
    }
    return this._glyph_cache[idx];
};

Font.prototype._getGlyphName = function(idx) {
    if(!this._name_cache[idx]) {
        this._name_cache[idx] = this._free_font.getGlyphName(idx);
    }
    return this._name_cache[idx];
};

Font.prototype.getGlyphName = function(idx_array) {
   if(idx_array instanceof Array) {
       var me = this;
       return _.map(idx_array, function(idx) {
          return me._getGlyphName(idx);
       });
   } else {
       return this._getGlyphName(idx_array);
   }
};

Font.prototype.getCharGlyph = function(chr) {

    var me = this;

    var idx_array;
    if(typeof chr === 'string') {
        if(chr.length === 0) {
            throw 'bad arguments';
        } else if(chr.length ===1) {
            return this._getCharGlyph( this._free_font.getCharIndex(chr.charCodeAt(0)));
        } else {
            chr = _.map(chr, function(c) {
                return c.charCodeAt(0);
            });
            idx_array = this._free_font.getCharIndex(chr);
        }

    }  else if(chr instanceof  Array) {
        chr = _.map(chr, function(c) {
            if(typeof c === 'string') {
                return c.charCodeAt(0);
            } else if(typeof c === 'number') {
                return c;
            } else {
                throw new Exception('bad arguments');
            }
        });
        idx_array = this._free_font.getCharIndex(chr);
    } else if(typeof chr === 'number') {
        return this._getCharGlyph(this._free_font.getCharIndex(chr));
    } else {
        throw new Exception('bad arguments');
    }

    return _.map(idx_array, function(idx) {
        return me._getCharGlyph(idx);
    });
};



Font.prototype.generateSubFont = function(sub_charset) {
    //return new Font
    if(typeof sub_charset !== 'string' || sub_charset.length === 0) {
        return null;
    }

    var cc_arr = _.map(sub_charset, function(chr) {
        return chr.charCodeAt(0);
    });
    var idx_arr = this._free_font.getCharIndex(cc_arr);
//    d(idx_arr);
//    return null;

    var name_arr = this.getGlyphName(idx_arr);

    return name_arr;
};

Font.prototype.toWOFF = function() {

};

Font.prototype.toTTF = function() {

};

Font.prototype.toOTF = function() {
    //todo
};
