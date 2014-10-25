node-freetype
============

nodejs [freetype](www.freetype.org) binding, inspired by
 [freetype2](https://github.com/ericfreese/node-freetype2.git),
 but keep focus on opentype(ttf, otf and woff).
  
Usage
--------
    
    var freetype = require('node-freetype');
    var fs = require('fs');
    var path = require('path');
    var _ = require('underscore');
    
    
    var src = fs.readFileSync('NotoSansHans-Black.ttf');
    var font = freetype.parse(src);
    
    console.log(font.tables.head);
    console.log(font.tables.head.magicNumber.toString(16));


Todo
-------

* more tables(os2, name etc)
* glyphs