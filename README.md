node-freetype
============

nodejs [freetype](www.freetype.org) binding, inspired by(and modified from)
 [freetype2](https://github.com/ericfreese/node-freetype2.git),
 [svg2ttf](https://github.com/fontello/svg2ttf),
 [ttf2woff](https://github.com/fontello/ttf2woff),
 and [opentype.js](https://github.com/nodebox/opentype.js.git),
 but keep focus on opentype(ttf, otf and woff), and can extract sub charset and create new font file.
  
meanwhile, node-freetype do not parse all glyphs at once like [opentype.js](https://github.com/nodebox/opentype.js.git),
so it will take little time to load big font file.

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
    console.log(font.tables.name);
    console.log(font.info);
    console.log(font.tables.maxp);
    console.log(font.tables.os2);
    console.log(font.tables.pclt);
    console.log(font.tables.post);
    console.log(font.tables.vhea);
    console.log(font.tables.hhea);

    console.log(font.getCharGlyph("a"));
    console.log(font.getCharIndex("a"));
    console.log(font.getGlyphName("a"));

    var ttf = font.generateSubFont('a bcd1234ac葛羽航中国制造');
    var ttf_buffer = ttf.toTTF();
    fs.writeFileSync('test.ttf', ttf_buffer);

    var woff_buffer = ttf.toWOFF();
    fs.writeFileSync('test.woff', woff_buffer);

Todo
-------
* support open otf file format

Bugs
------
* 在将NotoSansHans-Black.ttf文件转换后，字母和数字的宽度有问题。见test.html在chrome下的表现。
  (open test.html under test directory with Chrome and you will see this bug. but we ignore
  test directory in npm. see github files).