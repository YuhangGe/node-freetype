'use strict';

// wraps and reuses buffer, possibly cropped (offset, length)
var ByteBuffer = function (buffer, start, length) {
  /*jshint bitwise:false*/

  var isNested = buffer instanceof ByteBuffer;

  this.buffer = isNested ? buffer.buffer : buffer;
  this.start = (start || 0) + (isNested ? buffer.start : 0);
  this.length = length || (this.buffer.length - this.start);
  this.offset = 0;

};

ByteBuffer.prototype.getUint32 = function(offset) {
    return this.buffer.readUInt32BE(offset + this.start);
};

ByteBuffer.prototype.getUint16 = function(offset) {
    return this.buffer.readUInt16BE(offset + this.start);
};

ByteBuffer.prototype.getUint8 = function(offset) {
    return this.buffer.readUInt8(offset + this.start);
};

ByteBuffer.prototype.writeInt8 = function (value) {
    var off = this.offset + this.start;
    this.buffer.writeInt8(value, off);
    this.offset ++;
};

ByteBuffer.prototype.writeUint8 = function(value) {
    var off = this.offset + this.start;
    this.buffer.writeUInt8(value, off);
    this.offset++;
};

ByteBuffer.prototype.writeInt16 = function (value, littleEndian) {
    var off = this.offset + this.start;
    this.buffer[littleEndian ? 'writeInt16LE' : 'writeInt16BE'](value, off);
    this.offset += 2;
};

ByteBuffer.prototype.writeUint16 = function(value, littleEndian) {
    var off = this.offset + this.start;
    this.buffer[littleEndian ? 'writeUInt16LE' : 'writeUInt16BE'](value >>> 0, off);
    this.offset += 2;
};

ByteBuffer.prototype.writeInt32 = function (value, littleEndian) {
    var off = this.offset + this.start;
    this.buffer[littleEndian ? 'writeInt32LE' : 'writeInt32BE'](value, off);
    this.offset += 4;
};

ByteBuffer.prototype.writeUint32 = function(value, littleEndian) {
    var off = this.offset + this.start;
    this.buffer[littleEndian ? 'writeUInt32LE' : 'writeUInt32BE'](value >>> 0, off);
    this.offset += 4;
};

ByteBuffer.prototype.setUint32 = function(offset, value, littleEndian) {
    var off = this.start + offset;
    this.buffer[littleEndian ? 'writeUInt32LE' : 'writeUInt32BE'](value >>> 0, off);
};

ByteBuffer.prototype.setUint16 = function(offset, value, littleEndian) {
    var off = this.start + offset;
    this.buffer[littleEndian ? 'writeUInt16LE' : 'writeUInt16BE'](value >>> 0, off);
};

// get current position
//
ByteBuffer.prototype.tell = function() {
  return this.offset;
};

// set current position
//
ByteBuffer.prototype.seek = function (pos) {
  this.offset = pos;
};

ByteBuffer.prototype.fill = function (value, offset, end) {
    this.buffer.fill(value, offset, end);
};

ByteBuffer.prototype.create = function (size) {
    var buf = new Buffer(size);
    return new ByteBuffer(buf);
};

ByteBuffer.prototype.writeUint64 = function (value) {
  // we canot use bitwise operations for 64bit values because of JavaScript limitations,
  // instead we should divide it to 2 Int32 numbers
  // 2^32 = 4294967296
  var hi = Math.floor(value / 4294967296);
  var lo = value - hi * 4294967296;
  this.writeUint32(hi);
  this.writeUint32(lo);
};

ByteBuffer.prototype.writeBytes = function (data, start, end) {
    var buffer = this.buffer;
    var offset = this.offset + this.start;
    var ds = (typeof start === 'number' && start >=0 && start<data.length) ? start : 0;
    var de = (typeof end === 'number' && end > 0 && end < data.length) ? end : data.length;
    //if(data instanceof Buffer) {
    //    data.copy(buffer, offset, ds, de);
    //} else if(data instanceof  Array) {
        var k = 0;
        for(var i=ds;i<de;i++) {
            buffer[offset+k] = data[i];
            k++;
        }
    //}
    this.offset += de - ds;
};

ByteBuffer.prototype.toString = function (offset, length) {
  // default values if not set
  offset = (offset || 0);
  length = length || (this.length - offset);

  // add buffer shift
  var start = offset + this.start;
  var end = start + length;

//  var string = '';
//  for (var i = start; i < end; i++) {
//    string += String.fromCharCode(this.buffer[i]);
//  }
  return this.buffer.slice(start, end).toString();
};

ByteBuffer.prototype.toArray = function () {
    return this.buffer.slice(this.start, this.start + this.length);
};



module.exports = ByteBuffer;
