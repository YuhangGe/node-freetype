#ifndef NODE_FREETYPE_H
#define NODE_FREETYPE_H

#include <nan.h>
#include <vector>
#include <ft2build.h>
#include FT_FREETYPE_H
#include FT_TRUETYPE_TABLES_H

using namespace v8;

class FreeType : public node::ObjectWrap {
  public:
    static void Init();
    static Handle<Value> NewInstance(_NAN_METHOD_ARGS_TYPE args);

    FT_Face face;


  private:
    explicit FreeType(const FT_Byte* file_base, FT_Long file_size);
    ~FreeType();

    static NAN_METHOD(New);
    static Persistent<Function> constructor;
    static NAN_METHOD(GetGlyphArray);
    static NAN_METHOD(Test);

    static NAN_METHOD(GetHeader);
    static NAN_METHOD(GetOS2);
    
    static FT_Library library;
    void SetObjectProperties(Handle<Object> obj);
//    std::vector<FT_UInt> AvailableCharacters();
};

#endif