#include <nan.h>
#include <ft2build.h>
#include "../freetype.h"
#include FT_SFNT_NAMES_H

NAN_METHOD(FreeType::GetInfoTable) {
    NanScope();
    FreeType* ff = ObjectWrap::Unwrap<FreeType>(args.This());
    FT_Face face = ff->face;

    Local<Object> obj = NanNew<Object>();

    OBJ_SET_INTEGER("numFaces", face->num_faces);
    OBJ_SET_INTEGER("faceIndex", face->face_index);
    OBJ_SET_INTEGER("faceFlags", face->face_flags);
    OBJ_SET_INTEGER("styleFlags", face->style_flags);
    OBJ_SET_INTEGER("numGlyphs", face->num_glyphs);
    OBJ_SET_STRING("familyName", face->family_name);
    OBJ_SET_STRING("styleName", face->style_name);
    OBJ_SET_INTEGER("numFixedSizes", face->num_fixed_sizes);
    OBJ_SET_INTEGER("numCharmaps", face->num_charmaps);
    OBJ_SET_INTEGER("unitsPerEM", face->units_per_EM);
    OBJ_SET_INTEGER("ascender", face->ascender);
    OBJ_SET_INTEGER("descender", face->descender);
    OBJ_SET_INTEGER("height", face->height);
    OBJ_SET_INTEGER("maxAdvanceWidth", face->max_advance_width);
    OBJ_SET_INTEGER("maxAdvanceHeight", face->max_advance_height);
    OBJ_SET_INTEGER("underlinePosition", face->underline_position);
    OBJ_SET_INTEGER("underlineThickness", face->underline_thickness);

    NanReturnValue(obj);
}