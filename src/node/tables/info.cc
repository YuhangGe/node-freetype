#include <nan.h>
#include <ft2build.h>
#include "../freetype.h"
#include FT_SFNT_NAMES_H

#include <nan.h>
#include <ft2build.h>
#include "../freetype.h"
#include FT_SFNT_NAMES_H

NAN_METHOD(FreeType::GetInfoTable) {
    NanScope();
    FreeType* ff = ObjectWrap::Unwrap<FreeType>(args.This());
    FT_Face face = ff->face;

    Local<Object> obj = Object::New();

    OBJ_SET_INTEGER("numFaces", face->num_faces);

      obj->Set(String::NewSymbol("face_index"), Integer::New(face->face_index));

      obj->Set(String::NewSymbol("face_flags"), Integer::New(face->face_flags));
      obj->Set(String::NewSymbol("style_flags"), Integer::New(face->style_flags));

      obj->Set(String::NewSymbol("num_glyphs"), Integer::New(face->num_glyphs));

      obj->Set(String::NewSymbol("family_name"), String::New(face->family_name));
      obj->Set(String::NewSymbol("style_name"), String::New(face->style_name));

      obj->Set(String::NewSymbol("num_fixed_sizes"), Integer::New(face->num_fixed_sizes));
      // obj->Set(String::NewSymbol("available_sizes"), Integer::New(face->available_sizes));

      obj->Set(String::NewSymbol("num_charmaps"), Integer::New(face->num_charmaps));
      // obj->Set(String::NewSymbol("charmaps"), Integer::New(face->charmaps));

      // obj->Set(String::NewSymbol("generic"), Integer::New(face->generic));


      obj->Set(String::NewSymbol("units_per_EM"), Integer::New(face->units_per_EM));
      // obj->Set(String::NewSymbol("bbox"), Integer::New(face->bbox));

      obj->Set(String::NewSymbol("ascender"), Integer::New(face->ascender));
      obj->Set(String::NewSymbol("descender"), Integer::New(face->descender));
      obj->Set(String::NewSymbol("height"), Integer::New(face->height));

      obj->Set(String::NewSymbol("max_advance_width"), Integer::New(face->max_advance_width));
      obj->Set(String::NewSymbol("max_advance_height"), Integer::New(face->max_advance_height));

      obj->Set(String::NewSymbol("underline_position"), Integer::New(face->underline_position));
      obj->Set(String::NewSymbol("underline_thickness"), Integer::New(face->underline_thickness));

    NanReturnValue(obj);
}