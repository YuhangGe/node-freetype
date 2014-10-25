{
  'targets': [
    {
      'target_name': 'node-freetype',
      'dependencies': [
        'libfreetype.gyp:libfreetype'
      ],
      'sources': [
        'src/node/node-module.cc',
        'src/node/freetype.cc',
        'src/node/tables/header.cc',
        'src/node/tables/name.cc',
        'src/node/tables/os2.cc'
      ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ],
    }
  ]
}
