{
  'targets': [
    {
      'target_name': 'node-freetype',
      'dependencies': [
        'gyp/libfreetype.gyp:libfreetype'
      ],
      'sources': [
        'src/node/node-module.cc',
        'src/node/freetype.cc',
        'src/node/tables/header.cc',
        'src/node/tables/name.cc',
        'src/node/tables/os2.cc',
        'src/node/tables/info.cc',
        'src/node/tables/pclt.cc',
        'src/node/tables/post.cc',
        'src/node/tables/maxp.cc',
        'src/node/tables/hhea.cc',
        'src/node/tables/vhea.cc'
      ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ],
    }
  ]
}
