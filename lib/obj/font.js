/**
 * Created by Yuhang Ge on 14/10/29.
 */
var parse = require('../parse/parse.js');
var loca = require('../parse/loca.js');
var glyf = require('../parse/glyf.js');
var hmtx = require('../parse/hmtx.js');
var generateTTF = require('../generate/ttf.js');

var _ = require('underscore');

var d = function () {
    console.error.apply(this, arguments);
};

module.exports = Font;

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

var START_TIME = new Date('1904-01-01').getTime();

function Font(free_font, buffer) {
    this._free_font = free_font;
    this._buffer = buffer;
    this._glyph_cache = [];
    this._name_cache = [];
    this._glyphs = null;
    this._glyphs_data = null;

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

    this.init_info();
    this.init_table();

    if(this._buffer) {
        this._parse();
    }

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
    var ins = this;
    var tables = {};

    this.__defineGetter__('tables', function() {
        return tables;
    });

    this.tables.__defineGetter__('head', function() {
        if(ins._tables.head === null) {
            var h = ins._free_font.getHeadTable();
            var ct = (h.createdTime[1] >>> 0) * 1000 + START_TIME,
                mt = (h.modifiedTime[1] >>> 0) * 1000 + START_TIME;
            h.createdTime = new Date(ct);
            h.modifiedTime = new Date(mt);
            ins._tables.head = h;
        }
        return ins._tables.head;
    });
    this.tables.__defineGetter__("pclt", function() {
        if(ins._tables.pclt === null) {
            ins._tables.pclt = ins._free_font.getPcltTable();
        }
        return ins._tables.pclt;
    });
    this.tables.__defineGetter__("loca", function() {
        if(ins._tables.loca === null) {
            ins._getLocaTable();
        }
        return ins._tables.loca;
    });
    this.tables.__defineGetter__("post", function() {
        if(ins._tables.post === null) {
            ins._tables.post = ins._free_font.getPostTable();
        }
        return ins._tables.post;
    });
    this.tables.__defineGetter__("maxp", function() {
        if(ins._tables.maxp === null) {
            ins._tables.maxp = ins._free_font.getMaxProfileTable();
        }
        return ins._tables.maxp;
    });
    this.tables.__defineGetter__("os2", function() {
        if(ins._tables.os2 === null) {
            ins._tables.os2 = ins._free_font.getOS2Table();
        }
        return ins._tables.os2;
    });
    this.tables.__defineGetter__("hhea", function() {
        if(ins._tables.hhea === null) {
            ins._tables.hhea = ins._free_font.getHheaTable();
        }
        return ins._tables.hhea;
    });
    this.tables.__defineGetter__("vhea", function() {
        if(ins._tables.vhea === null) {
            ins._tables.vhea = ins._free_font.getVheaTable();
        }
        return ins._tables.vhea;
    });
    this.tables.__defineGetter__("name", function() {
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


Font.prototype._getCharGlyph = function(idx, charcode) {
    if(!this._glyph_cache[idx]) {
        var g = glyf.parseGlyfByIndex(this._buffer, this._offset['glyf'], this.tables.loca, idx);
        g.name = this._getGlyphName(idx);
        g.unicode = charcode;
        var h = hmtx.getHmtx(this._buffer, this._offset['hmtx'], this.tables.hhea.numMetrics, idx);
        g.leftSideBearing = h.leftSideBearing;
        g.advanceWidth = h.advanceWidth;
        this._glyph_cache[idx] = g;
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
    var ci, cc;
    var idx_array;
    if(typeof chr === 'string') {
        if(chr.length === 0) {
            throw 'bad arguments';
        } else if(chr.length ===1) {
            cc = chr.charCodeAt(0);
            ci = this._free_font.getCharIndex(cc);
            if(ci === 0) {
                return null;
            } else {
                return this._getCharGlyph(ci , cc);
            }
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
        ci = this._free_font.getCharIndex(chr);
        if(ci === 0) {
            return null;
        } else {
            return this._getCharGlyph(ci , chr);
        }
    } else {
        throw new Exception('bad arguments');
    }

    return _.map(idx_array, function(idx, i) {
        if(idx === 0) {
            return null;
        } else {
            return me._getCharGlyph(idx, chr[i]);
        }
    });
};



Font.prototype.generateSubFont = function(sub_charset) {
    //return new Font
    if(typeof sub_charset !== 'string' || sub_charset.length === 0) {
        return null;
    }

    var cc_arr = _.uniq(_.map(sub_charset, function(chr) {
        return chr.charCodeAt(0);
    }).sort(function(a, b) {
        return a < b ? -1 : 1;
    }), true);


    var idx_arr = this._free_font.getCharIndex(cc_arr);
    var me = this;

    var glyphs = _.filter(_.map(idx_arr, function(idx, i) {
        if(idx === 0) {
            d('warning: char `'+String.fromCharCode(cc_arr[i])+'` not found in font!');
            return null;
        } else {
            return me._getCharGlyph(idx, cc_arr[i]);
        }
    }), function(g) {
        return g !== null;
    });

    glyphs.unshift(this._getCharGlyph(0, 0)); //add .notdef

    var nextId = 0;
    glyphs.forEach(function(g) {
        g.id = nextId++;
    });

    var sub_font = new Font(null, null);
    sub_font._glyphs = glyphs;
    sub_font._glyphs_data = this._buffer;

    this._cloneTables(sub_font);

    return sub_font;

};

Font.prototype._cloneTables = function(newFont) {
    var nt = newFont._tables;
    var info = _.clone(this.info);
    var name = _.clone(this.tables.name);
    var head = _.clone(this.tables.head);
    var cmap = _.clone(this.tables.cmap);
    var os2 = _.clone(this.tables.os2);
    var post = _.clone(this.tables.post);
    var hhea = _.clone(this.tables.hhea);
    var maxp = _.clone(this.tables.maxp);

    post.numGlyphs = newFont._glyphs.length;
    info.numGlyphs = newFont._glyphs.length;
    hhea.numberOfHMetrics = newFont._glyphs.length;
    head.createdTime = new Date();
    head.modifiedTime = new Date();
    var ttf_size = 0;
    newFont._glyphs.forEach(function(g) {
//        d(g.isEmpty, g.name);
        ttf_size += g.isEmpty ? 0 : g.size;
    });

    //d('ttf_size: ', ttf_size, ttf_size.toString(16));

    head.indexToLocFormat = ttf_size < 0x20000 ? 0 : 1;
    head.indexToLocFormat = 1;
//    d(head.indexToLocFormat);

    nt.maxp = maxp;
    nt.hhea = hhea;
    nt.name = name;
    nt.head = head;
    nt.cmap = cmap;
    nt.os2 = os2;
    nt.post = post;
    nt.info = info;
};
Font.prototype.toWOFF = function() {
    var ttf_buffer = this.toTTF();
    //todo convert ttf to woff;
};

Font.prototype.toTTF = function() {
    if(this._glyphs === null) {
        //if _glyphs is null, this font is original font file.
        return this.buffer;
    }
    //sub font
    return generateTTF(this);
};

Font.prototype.toOTF = function() {
    //todo
};
