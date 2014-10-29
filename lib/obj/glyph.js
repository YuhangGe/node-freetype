var _ = require('underscore');
module.exports = Glyph;

function Glyph(idx, data_offset, data_length) {
    this.name = '';
    this.unicode = 0;
    this.lsb = 0;
    this.width = 0; //advancedWidth

    this.index = (_.isNumber(idx) && idx >= 0) ? idx : 0;
    this.data_offset = (_.isNumber(data_offset) && data_offset>=0) ? data_offset : 0;
    this.data_length = (_.isNumber(data_length) && data_length>=0) ? data_length : 0;
    this._size = this.data_length % 4 === 0 ? this.data_length : this.data_length + 4 - this.data_length % 4;

    this.isEmpty = this._size <= 0;

    this.parsed = false;

    this.numberOfContours = 0;
    this.xMin = 0;
    this.xMax = 0;
    this.yMin = 0;
    this.yMax = 0;

    this.endPointIndices = null;
    this.instructionLength = 0;
    this.instructions = null;
    this.points = null;
    this.isComposite = false;
    this.components = null;
}

Glyph.prototype.__defineGetter__('size', function() {
    return this.isEmpty ? 12 : this._size;
});
Glyph.prototype.__defineSetter__('size', function(siz) {
   this.data_length = siz;
   this.isEmpty = false;
   this._size = siz % 4 !== 0 ? siz + 4 - siz % 4 : siz;
});