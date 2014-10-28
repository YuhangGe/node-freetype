// 这个文件参考了opentype.js的代码。特此说明。
// Parsing utility functions

'use strict';

// Retrieve an unsigned byte from the buffer.
exports.getByte = function getByte(buffer, offset) {
    return buffer.readUInt8(offset);
};

exports.getCard8 = exports.getByte;

// Retrieve an unsigned 16-bit short from the buffer.
// The value is stored in big endian.
exports.getUShort = function (buffer, offset) {
    return buffer.readUInt16BE(offset);
};

exports.getCard16 = exports.getUShort;

// Retrieve a signed 16-bit short from the buffer.
// The value is stored in big endian.
exports.getShort = function (buffer, offset) {
    return buffer.readInt16BE(offset);
};

// Retrieve an unsigned 32-bit long from the buffer.
// The value is stored in big endian.
exports.getULong = function (buffer, offset) {
    return buffer.readUInt32BE(offset);
};

// Retrieve a 32-bit signed fixed-point number (16.16) from the buffer.
// The value is stored in big endian.
exports.getFixed = function (buffer, offset) {
    var decimal, fraction;
    decimal = buffer.readInt16BE(offset);
    fraction = buffer.readUInt16BE(offset + 2);
    return decimal + fraction / 65535;
};

// Retrieve a 4-character tag from the buffer.
// Tags are used to identify tables.
exports.getTag = function (buffer, offset) {
    var tag = '', i;
    for (i = offset; i < offset + 4; i += 1) {
        tag += String.fromCharCode(buffer.readInt8(i));
    }
    return tag;
};

// Retrieve an offset from the buffer.
// Offsets are 1 to 4 bytes in length, depending on the offSize argument.
exports.getOffset = function (buffer, offset, offSize) {
    var i, v;
    v = 0;
    for (i = 0; i < offSize; i += 1) {
        v <<= 8;
        v += buffer.readUInt8(offset + i);
    }
    return v;
};

// Retrieve a number of bytes from start offset to the end offset from the buffer.
exports.getBytes = function (buffer, startOffset, endOffset) {
    var bytes, i;
    bytes = [];
    for (i = startOffset; i < endOffset; i += 1) {
        bytes.push(buffer.readUInt8(i));
    }
    return bytes;
};

// Convert the list of bytes to a string.
exports.bytesToString = function (bytes) {
    var s, i;
    s = '';
    for (i = 0; i < bytes.length; i += 1) {
        s += String.fromCharCode(bytes[i]);
    }
    return s;
};

var typeOffsets = {
    byte: 1,
    uShort: 2,
    short: 2,
    uLong: 4,
    fixed: 4,
    longDateTime: 8,
    tag: 4
};

// A stateful parser that changes the offset whenever a value is retrieved.
// The data is a buffer.
function Parser(data, offset) {
    this.data = data;
    this.offset = offset;
    this.relativeOffset = 0;
}

Parser.prototype.parseByte = function () {
    var v = this.data.readUInt8(this.offset + this.relativeOffset);
    this.relativeOffset += 1;
    return v;
};

Parser.prototype.parseChar = function () {
    var v = this.data.readInt8(this.offset + this.relativeOffset);
    this.relativeOffset += 1;
    return v;
};

Parser.prototype.parseCard8 = Parser.prototype.parseByte;

Parser.prototype.parseUShort = function () {
    var v = this.data.readUInt16BE(this.offset + this.relativeOffset);
    this.relativeOffset += 2;
    return v;
};
Parser.prototype.parseCard16 = Parser.prototype.parseUShort;
Parser.prototype.parseSID = Parser.prototype.parseUShort;
Parser.prototype.parseOffset16 = Parser.prototype.parseUShort;

Parser.prototype.parseShort = function () {
    var v = this.data.readInt16BE(this.offset + this.relativeOffset);
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseF2Dot14 = function () {
    var v = this.data.readInt16BE(this.offset + this.relativeOffset) / 16384;
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseULong = function () {
    var v = exports.getULong(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v;
};

Parser.prototype.parseFixed = function () {
    var v = exports.getFixed(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v;
};

Parser.prototype.parseOffset16List =
Parser.prototype.parseUShortList = function (count) {
    var offsets = new Array(count),
        buffer = this.data,
        offset = this.offset + this.relativeOffset;
    for (var i = 0; i < count; i++) {
        offsets[i] = exports.getUShort(buffer, offset);
        offset += 2;
    }
    this.relativeOffset += count * 2;
    return offsets;
};

Parser.prototype.parseString = function (length) {
    var buffer = this.data,
        offset = this.offset + this.relativeOffset,
        string = '';
    this.relativeOffset += length;
    for (var i = 0; i < length; i++) {
        string += String.fromCharCode(buffer.readUInt8(offset + i));
    }
    return string;
};

Parser.prototype.parseTag = function () {
    return this.parseString(4);
};

// LONGDATETIME is a 64-bit integer.
// JavaScript and unix timestamps traditionally use 32 bits, so we
// only take the last 32 bits.
Parser.prototype.parseLongDateTime = function() {
    var v = exports.getULong(this.data, this.offset + this.relativeOffset + 4);
    this.relativeOffset += 8;
    return v;
};

Parser.prototype.parseFixed = function() {
    var v = exports.getULong(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v / 65536;
};

Parser.prototype.parseVersion = function() {
    var major = exports.getUShort(this.data, this.offset + this.relativeOffset);
    // How to interpret the minor version is very vague in the spec. 0x5000 is 5, 0x1000 is 1
    // This returns the correct number if minor = 0xN000 where N is 0-9
    var minor = exports.getUShort(this.data, this.offset + this.relativeOffset + 2);
    this.relativeOffset += 4;
    return major + minor / 0x1000 / 10;
};

Parser.prototype.skip = function (type, amount) {
    if (amount === undefined) {
        amount = 1;
    }
    this.relativeOffset += typeOffsets[type] * amount;
};

exports.Parser = Parser;
