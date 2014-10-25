#include <nan.h>
#include <ft2build.h>
#include "../freetype.h"
#include FT_TRUETYPE_TABLES_H

NAN_METHOD(FreeType::GetOS2Table) {
  NanScope();
  FreeType* ff = ObjectWrap::Unwrap<FreeType>(args.This());
  TT_OS2* os2 = (TT_OS2*) FT_Get_Sfnt_Table(ff->face, ft_sfnt_os2);
  if(os2 == NULL) {
    NanReturnNull();
  }

//   typedef struct  TT_OS2_
//    {
//      FT_UShort  version;                /* 0x0001 - more or 0xFFFF */
//      FT_Short   xAvgCharWidth;
//      FT_UShort  usWeightClass;
//      FT_UShort  usWidthClass;
//      FT_Short   fsType;
//      FT_Short   ySubscriptXSize;
//      FT_Short   ySubscriptYSize;
//      FT_Short   ySubscriptXOffset;
//      FT_Short   ySubscriptYOffset;
//      FT_Short   ySuperscriptXSize;
//      FT_Short   ySuperscriptYSize;
//      FT_Short   ySuperscriptXOffset;
//      FT_Short   ySuperscriptYOffset;
//      FT_Short   yStrikeoutSize;
//      FT_Short   yStrikeoutPosition;
//      FT_Short   sFamilyClass;
//
//      FT_Byte    panose[10];
//
//      FT_ULong   ulUnicodeRange1;        /* Bits 0-31   */
//      FT_ULong   ulUnicodeRange2;        /* Bits 32-63  */
//      FT_ULong   ulUnicodeRange3;        /* Bits 64-95  */
//      FT_ULong   ulUnicodeRange4;        /* Bits 96-127 */
//
//      FT_Char    achVendID[4];
//
//      FT_UShort  fsSelection;
//      FT_UShort  usFirstCharIndex;
//      FT_UShort  usLastCharIndex;
//      FT_Short   sTypoAscender;
//      FT_Short   sTypoDescender;
//      FT_Short   sTypoLineGap;
//      FT_UShort  usWinAscent;
//      FT_UShort  usWinDescent;
//
//      /* only version 1 and higher: */
//
//      FT_ULong   ulCodePageRange1;       /* Bits 0-31   */
//      FT_ULong   ulCodePageRange2;       /* Bits 32-63  */
//
//      /* only version 2 and higher: */
//
//      FT_Short   sxHeight;
//      FT_Short   sCapHeight;
//      FT_UShort  usDefaultChar;
//      FT_UShort  usBreakChar;
//      FT_UShort  usMaxContext;
//
//      /* only version 5 and higher: */
//
//      FT_UShort  usLowerOpticalPointSize;       /* in twips (1/20th points) */
//      FT_UShort  usUpperOpticalPointSize;       /* in twips (1/20th points) */
//
//    } TT_OS2;

  Local<Object> obj = Object::New();

  OBJ_SET_INTEGER("version", os2->version);
  OBJ_SET_INTEGER("xAvgCharWidth", os2->xAvgCharWidth);

  NanReturnValue(obj);
}
