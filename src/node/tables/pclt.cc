#include <nan.h>
#include <ft2build.h>
#include "../freetype.h"
#include FT_TRUETYPE_TABLES_H

NAN_METHOD(FreeType::GetPcltTable) {
    NanScope();
    FreeType* ff = ObjectWrap::Unwrap<FreeType>(args.This());
    TT_PCLT* pclt = (TT_PCLT*) FT_Get_Sfnt_Table(ff->face, ft_sfnt_pclt);
    if(pclt == NULL) {
        NanReturnUndefined();
    }
    Local<Object> obj = NanNew<Object>();
//
//
//typedef struct  TT_PCLT_
//  {
//    FT_Fixed   Version;
//    FT_ULong   FontNumber;
//    FT_UShort  Pitch;
//    FT_UShort  xHeight;
//    FT_UShort  Style;
//    FT_UShort  TypeFamily;
//    FT_UShort  CapHeight;
//    FT_UShort  SymbolSet;
//    FT_Char    TypeFace[16];
//    FT_Char    CharacterComplement[8];
//    FT_Char    FileName[6];
//    FT_Char    StrokeWeight;
//    FT_Char    WidthType;
//    FT_Byte    SerifStyle;
//    FT_Byte    Reserved;
//
//  } TT_PCLT;
    OBJ_SET_INTEGER("version", pclt->Version);
    OBJ_SET_INTEGER("fontNumber", pclt->FontNumber);
    OBJ_SET_INTEGER("pitch", pclt->Pitch);
    OBJ_SET_INTEGER("xHeight", pclt->xHeight);
    OBJ_SET_INTEGER("style", pclt->Style);
    OBJ_SET_INTEGER("typeFamily", pclt->TypeFamily);
    OBJ_SET_INTEGER("capHeight", pclt->CapHeight);
    OBJ_SET_INTEGER("symbolSet", pclt->SymbolSet);

    OBJ_SET_ARRAY("typeFace", pclt->TypeFace, 16);
    OBJ_SET_ARRAY("characterComplement", pclt->CharacterComplement, 8);
    OBJ_SET_ARRAY("fileName", pclt->FileName, 6);

    OBJ_SET_INTEGER("strokeWeight", pclt->StrokeWeight);
    OBJ_SET_INTEGER("widthType", pclt->WidthType);
    OBJ_SET_INTEGER("serifStyle", pclt->SerifStyle);
    OBJ_SET_INTEGER("reserved", pclt->Reserved);

    NanReturnValue(obj);
}