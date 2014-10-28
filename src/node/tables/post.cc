#include <nan.h>
#include <ft2build.h>
#include "../freetype.h"
#include FT_TRUETYPE_TABLES_H

NAN_METHOD(FreeType::GetPostTable) {
    NanScope();
    FreeType* ff = ObjectWrap::Unwrap<FreeType>(args.This());
    TT_Postscript* post = (TT_Postscript*) FT_Get_Sfnt_Table(ff->face, ft_sfnt_post);
    if(post == NULL) {
        NanReturnUndefined();
    }
    Local<Object> obj = Object::New();

// typedef struct  TT_Postscript_
//  {
//    FT_Fixed  FormatType;
//    FT_Fixed  italicAngle;
//    FT_Short  underlinePosition;
//    FT_Short  underlineThickness;
//    FT_ULong  isFixedPitch;
//    FT_ULong  minMemType42;
//    FT_ULong  maxMemType42;
//    FT_ULong  minMemType1;
//    FT_ULong  maxMemType1;
//
//    /* Glyph names follow in the file, but we don't   */
//    /* load them by default.  See the ttpost.c file.  */
//
//  } TT_Postscript;
    OBJ_SET_INTEGER("formatType", post->FormatType);
    OBJ_SET_INTEGER("italicAngle", post->italicAngle);
    OBJ_SET_INTEGER("underlinePosition", post->underlinePosition);
    OBJ_SET_INTEGER("underlineThickness", post->underlineThickness);
    OBJ_SET_INTEGER("isFixedPitch", post->isFixedPitch);
    OBJ_SET_INTEGER("minMemType42", post->minMemType42);
    OBJ_SET_INTEGER("maxMemType42", post->maxMemType42);
    OBJ_SET_INTEGER("minMemType1", post->minMemType1);
    OBJ_SET_INTEGER("maxMemType1", post->maxMemType1);
    NanReturnValue(obj);
}