{
  'targets': [
    {
      'target_name': 'node-freetype',
      'dependencies': [
        'libfreetype.gyp:libfreetype'
      ],
      'sources': [
        'src/node/node-module.cc',
        'src/node/freetype.cc'
      ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ],
    }
  ]
}
