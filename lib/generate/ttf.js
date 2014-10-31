'use strict';

var _ = require('underscore');
var ByteBuffer = require('./byte_buffer.js');

var createOS2Table = require('./tables/os2.js');
var createCMapTable = require('./tables/cmap.js');
var createGlyfTable = require('./tables/glyf.js');
var createHeadTable = require('./tables/head.js');
var createHHeadTable = require('./tables/hhea.js');
var createHtmxTable = require('./tables/hmtx.js');
var createLocaTable = require('./tables/loca.js');
var createMaxpTable = require('./tables/maxp.js');
var createNameTable = require('./tables/name.js');
var createPostTable = require('./tables/post.js');

// Tables
var TABLES = [
    { innerName: 0x4f532f32, create: createOS2Table, order: 4 }, //OS/2
    { innerName: 0x636d6170, create: createCMapTable, order: 6 }, // cmap
    { innerName: 0x676c7966, create: createGlyfTable, order: 8 }, // glyf
    { innerName: 0x68656164, create: createHeadTable, order: 2 }, // head
    { innerName: 0x68686561, create: createHHeadTable, order: 1 }, // hhea
    { innerName: 0x686d7478, create: createHtmxTable, order: 5 }, // hmtx
    { innerName: 0x6c6f6361, create: createLocaTable, order: 7 }, // loca
    { innerName: 0x6d617870, create: createMaxpTable, order: 3 }, // maxp
    { innerName: 0x6e616d65, create: createNameTable, order: 9 }, // name
    { innerName: 0x706f7374, create: createPostTable, order: 10 } // post
];

// Various constants
var CONST = {
    VERSION: 0x10000,
    CHECKSUM_ADJUSTMENT: 0xB1B0AFBA
};

function d() {
    console.log.apply(this, arguments);
}

function ulong(t) {
    /*jshint bitwise:false*/
    t &= 0xffffffff;
    if (t < 0) {
        t += 0x100000000;
    }
    return t;
}

function calc_checksum(buf) {
    var sum = 0;
    var nlongs = Math.floor(buf.length / 4);

    for (var i = 0; i < nlongs; ++i) {
        var t = buf.getUint32(i * 4);
        sum = ulong(sum + t);
    }
    var leftBytes = buf.length - nlongs * 4; //extra 1..3 bytes found, because table is not aligned. Need to include them in checksum too.
    if (leftBytes > 0) {
        var leftRes = 0;
        for (i = 0; i < 4; i++) {
            /*jshint bitwise:false*/
            leftRes = (leftRes << 8) + ((i < leftBytes) ? buf.getUint8(nlongs * 4 + i) : 0);
        }
        sum = ulong(sum + leftRes);
    }
    return sum;
}

function generateTTF(font) {

    //d('hhea:');
    //d(font.tables.hhea);
    //d('\nhead:');
    //d(font.tables.head);
    //d(font.tables.name);
    //d(font.tables.post);
    // Add tables
    var headerSize = 12 + 16 * TABLES.length; // TTF header plus table headers
    var bufSize = headerSize;
    _.forEach(TABLES, function (table) {
        //store each table in its own buffer
        table.buffer = table.create(font);
        table.length = table.buffer.length;
        table.corLength = table.length + (4 - table.length % 4) % 4; // table size should be divisible to 4
        table.checkSum = calc_checksum(table.buffer);
        bufSize += table.corLength;
    });

    //calculate offsets
    var offset = headerSize;
    _.forEach(_.sortBy(TABLES, 'order'), function (table) {
        table.offset = offset;
        offset += table.corLength;
    });

    //create TTF buffer

    var buf = ByteBuffer.prototype.create(bufSize);
    //special constants
    var entrySelector = Math.floor(Math.log(TABLES.length) / Math.LN2);
    var searchRange = Math.pow(2, entrySelector) * 16;
    var rangeShift = TABLES.length * 16 - searchRange;

    // Add TTF header
    buf.writeUint32(CONST.VERSION);
    buf.writeUint16(TABLES.length);
    buf.writeUint16(searchRange);
    buf.writeUint16(entrySelector);
    buf.writeUint16(rangeShift);

    //d('h:', CONST.VERSION, TABLES.length, searchRange, entrySelector, rangeShift, buf.offset);
    _.forEach(TABLES, function (table, i) {
        buf.writeUint32(table.innerName); //inner name
        buf.writeUint32(table.checkSum); //checksum
        buf.writeUint32(table.offset); //offset
        buf.writeUint32(table.length); //length
    });
    //function __t(n) {
    //    var a = [(n>>>24) & 0xff, (n>>>16) & 0xff, (n>>>8) & 0xff, n & 0xff];
    //    return String.fromCharCode.apply(this, a);
    //}
    var headOffset = 0;
    _.forEach(_.sortBy(TABLES, 'order'), function (table) {
        if (table.innerName === 0x68656164) { //we must store head offset to write font checksum
            headOffset = buf.tell();
        }
        //d(__t(table.innerName), table.corLength, table.offset);
        //d(table.buffer.buffer);
        var kk = buf.tell();
        buf.writeBytes(table.buffer.buffer);
        for (var i = table.length; i < table.corLength; i++) { //align table to be divisible to 4
            buf.writeUint8(0);
        }
        //d(buf.buffer.slice(kk, buf.tell()));
        //d('\n\n\n');
    });

    // Write font checksum (corrected by magic value) into HEAD table
    buf.setUint32(headOffset + 8, ulong(CONST.CHECKSUM_ADJUSTMENT - calc_checksum(buf)));

    //d(buf.getUint16())
    return buf.buffer;
}

module.exports = generateTTF;
