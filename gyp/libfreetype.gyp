{
  'targets': [
    {
      'target_name': 'libfreetype',
      'type': 'static_library',
      'defines': [
        'FT2_BUILD_LIBRARY',
      ],
      'include_dirs': [
        '../src/freetype-2.5.3/include/',
      ],
      'sources': [
        # From src/freetype-2.5.3/docs/INSTALL.ANY
        # This is for the default config. If we want to customize the config, we
        # need to create a custom ftconfig.h with the appropriate definitions
        # according to src/freetype-2.5.3/docs/CUSTOMIZING.

        # base components (required)
        '../src/freetype-2.5.3/src/base/ftsystem.c',
        '../src/freetype-2.5.3/src/base/ftinit.c',
        '../src/freetype-2.5.3/src/base/ftdebug.c',

        '../src/freetype-2.5.3/src/base/ftbase.c',

        '../src/freetype-2.5.3/src/base/ftbbox.c',       # recommended, see <ftbbox.h>
        '../src/freetype-2.5.3/src/base/ftglyph.c',      # recommended, see <ftglyph.h>

        '../src/freetype-2.5.3/src/base/ftbdf.c',        # optional, see <ftbdf.h>
        '../src/freetype-2.5.3/src/base/ftbitmap.c',     # optional, see <ftbitmap.h>
        '../src/freetype-2.5.3/src/base/ftcid.c',        # optional, see <ftcid.h>
        '../src/freetype-2.5.3/src/base/ftfstype.c',     # optional
        '../src/freetype-2.5.3/src/base/ftgasp.c',       # optional, see <ftgasp.h>
        '../src/freetype-2.5.3/src/base/ftgxval.c',      # optional, see <ftgxval.h>
        '../src/freetype-2.5.3/src/base/ftlcdfil.c',     # optional, see <ftlcdfil.h>
        '../src/freetype-2.5.3/src/base/ftmm.c',         # optional, see <ftmm.h>
        '../src/freetype-2.5.3/src/base/ftotval.c',      # optional, see <ftotval.h>
        '../src/freetype-2.5.3/src/base/ftpatent.c',     # optional
        '../src/freetype-2.5.3/src/base/ftpfr.c',        # optional, see <ftpfr.h>
        '../src/freetype-2.5.3/src/base/ftstroke.c',     # optional, see <ftstroke.h>
        '../src/freetype-2.5.3/src/base/ftsynth.c',      # optional, see <ftsynth.h>
        '../src/freetype-2.5.3/src/base/fttype1.c',      # optional, see <t1tables.h>
        '../src/freetype-2.5.3/src/base/ftwinfnt.c',     # optional, see <ftwinfnt.h>
        '../src/freetype-2.5.3/src/base/ftxf86.c',       # optional, see <ftxf86.h>

        # font drivers (optional; at least one is needed)
        '../src/freetype-2.5.3/src/bdf/bdf.c',           # BDF font driver
        '../src/freetype-2.5.3/src/cff/cff.c',           # CFF/OpenType font driver
        '../src/freetype-2.5.3/src/cid/type1cid.c',      # Type 1 CID-keyed font driver
        '../src/freetype-2.5.3/src/pcf/pcf.c',           # PCF font driver
        '../src/freetype-2.5.3/src/pfr/pfr.c',           # PFR/TrueDoc font driver
        '../src/freetype-2.5.3/src/sfnt/sfnt.c',         # SFNT files support (TrueType & OpenType)
        '../src/freetype-2.5.3/src/truetype/truetype.c', # TrueType font driver
        '../src/freetype-2.5.3/src/type1/type1.c',       # Type 1 font driver
        '../src/freetype-2.5.3/src/type42/type42.c',     # Type 42 font driver
        '../src/freetype-2.5.3/src/winfonts/winfnt.c',   # Windows FONT / FNT font driver

        # rasterizers (optional; at least one is needed for vector formats)
        '../src/freetype-2.5.3/src/raster/raster.c',     # monochrome rasterizer
        '../src/freetype-2.5.3/src/smooth/smooth.c',     # anti-aliasing rasterizer

        # auxiliary modules (optional)
        '../src/freetype-2.5.3/src/autofit/autofit.c',   # auto hinting module
        '../src/freetype-2.5.3/src/cache/ftcache.c',     # cache sub-system (in beta)
        '../src/freetype-2.5.3/src/gzip/ftgzip.c',       # support for compressed fonts (.gz)
        '../src/freetype-2.5.3/src/lzw/ftlzw.c',         # support for compressed fonts (.Z)
        '../src/freetype-2.5.3/src/bzip2/ftbzip2.c',     # support for compressed fonts (.bz2)
        '../src/freetype-2.5.3/src/gxvalid/gxvalid.c',   # TrueTypeGX/AAT table validation
        '../src/freetype-2.5.3/src/otvalid/otvalid.c',   # OpenType table validation
        '../src/freetype-2.5.3/src/psaux/psaux.c',       # PostScript Type 1 parsing
        '../src/freetype-2.5.3/src/pshinter/pshinter.c', # PS hinting module
        '../src/freetype-2.5.3/src/psnames/psnames.c',   # PostScript glyph names support
      ],
      'conditions': [
        [ 'OS=="mac"', {
          'sources': [
            '../src/freetype-2.5.3/src/base/ftmac.c',        # only on the Macintosh
          ],
        }],
      ],
      'direct_dependent_settings': {
        'include_dirs': [
          '../src/freetype-2.5.3/include',
        ],
      },
    }
  ]
}
