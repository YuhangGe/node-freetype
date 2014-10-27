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
    OBJ_SET_INTEGER("usWeightClass", os2->usWeightClass);
    OBJ_SET_INTEGER("usWidthClass", os2->usWidthClass);
    OBJ_SET_INTEGER("fsType", os2->fsType);
    OBJ_SET_INTEGER("ySubscriptXSize", os2->ySubscriptXSize);
    OBJ_SET_INTEGER("ySubscriptYSize", os2->ySubscriptYSize);
    OBJ_SET_INTEGER("ySubscriptXOffset", os2->ySubscriptXOffset);
    OBJ_SET_INTEGER("ySubscriptYOffset", os2->ySubscriptYOffset);
    OBJ_SET_INTEGER("ySuperscriptXSize", os2->ySuperscriptXSize);
    OBJ_SET_INTEGER("ySuperscriptYSize", os2->ySuperscriptYSize);
    OBJ_SET_INTEGER("ySuperscriptXOffset", os2->ySuperscriptXOffset);
    OBJ_SET_INTEGER("ySuperscriptYOffset", os2->ySuperscriptYOffset);
    OBJ_SET_INTEGER("yStrikeoutSize", os2->yStrikeoutSize);
    OBJ_SET_INTEGER("yStrikeoutPosition", os2->yStrikeoutPosition);
    OBJ_SET_INTEGER("sFamilyClass", os2->sFamilyClass);

    OBJ_SET_ARRAY("panose", os2->panose, 10);

    OBJ_SET_INTEGER("ulUnicodeRange1", os2->ulUnicodeRange1);        /* Bits 0-31   */
    OBJ_SET_INTEGER("ulUnicodeRange2", os2->ulUnicodeRange2);        /* Bits 32-63  */
    OBJ_SET_INTEGER("ulUnicodeRange3", os2->ulUnicodeRange3);        /* Bits 64-95  */
    OBJ_SET_INTEGER("ulUnicodeRange4", os2->ulUnicodeRange4);        /* Bits 96-127 */
    //

    OBJ_SET_ARRAY("achVendID", os2->achVendID, 4);

    OBJ_SET_INTEGER("fsSelection", os2->fsSelection);
    OBJ_SET_INTEGER("usFirstCharIndex", os2->usFirstCharIndex);
    OBJ_SET_INTEGER("usLastCharIndex", os2->usLastCharIndex);
    OBJ_SET_INTEGER("sTypoAscender", os2->sTypoAscender);
    OBJ_SET_INTEGER("sTypoDescender", os2->sTypoDescender);
    OBJ_SET_INTEGER("sTypoLineGap", os2->sTypoLineGap);
    OBJ_SET_INTEGER("usWinAscent", os2->usWinAscent);
    OBJ_SET_INTEGER("usWinDescent", os2->usWinDescent);
    //
    //      /* only version 1 and higher: */
    //
    OBJ_SET_INTEGER("ulCodePageRange1", os2->ulCodePageRange1);       /* Bits 0-31   */
    OBJ_SET_INTEGER("ulCodePageRange2", os2->ulCodePageRange2);       /* Bits 32-63  */
    //
    //      /* only version 2 and higher: */
    //
    OBJ_SET_INTEGER("sxHeight", os2->sxHeight);
    OBJ_SET_INTEGER("sCapHeight", os2->sCapHeight);
    OBJ_SET_INTEGER("usDefaultChar", os2->usDefaultChar);
    OBJ_SET_INTEGER("usBreakChar", os2->usBreakChar);
    OBJ_SET_INTEGER("usMaxContext", os2->usMaxContext);
    //
    //      /* only version 5 and higher: */
    //
    OBJ_SET_INTEGER("usLowerOpticalPointSize", os2->usLowerOpticalPointSize);       /* in twips (1/20th points) */
    OBJ_SET_INTEGER("usUpperOpticalPointSize", os2->usUpperOpticalPointSize);       /* in twips (1/20th points) */

    NanReturnValue(obj);
}
