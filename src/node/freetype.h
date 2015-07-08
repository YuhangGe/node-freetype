#ifndef NODE_FREETYPE_H
#define NODE_FREETYPE_H

#include <nan.h>
#include <vector>
#include <ft2build.h>
#include FT_FREETYPE_H

#define OBJ_SET_INTEGER(key, value) \
  obj->Set(NanNew<String>(key), NanNew<Number>(value))

#define OBJ_SET_STRING(key, value) \
  obj->Set(NanNew<String>(key), NanNew<String>(value))

#define OBJ_SET_ARRAY(key, value, length)   \
    {                                       \
        Local<Array> arr = NanNew<Array>(length);    \
        for(int i=0;i<length;i++) {             \
            arr->Set(i, NanNew<Number>(value[i]));              \
        }                                       \
        obj->Set(NanNew<String>(key), arr); \
    }

using namespace v8;

class FreeType : public node::ObjectWrap {
  public:
    static void Init(Handle<Object> exports);
    static Handle<Value> NewInstance(_NAN_METHOD_ARGS_TYPE args);

    FT_Face face;


  private:
    explicit FreeType(const FT_Byte* file_base, FT_Long file_size);
    ~FreeType();

    static NAN_METHOD(New);
    static Persistent<Function> constructor;
    static NAN_METHOD(GetGlyphArray);
    static NAN_METHOD(Test);

    static NAN_METHOD(GetHeadTable);
    static NAN_METHOD(GetOS2Table);
    static NAN_METHOD(GetNameTable);
    static NAN_METHOD(GetInfoTable);
    static NAN_METHOD(GetPcltTable);
    static NAN_METHOD(GetPostTable);
    static NAN_METHOD(GetMaxProfileTable);
    static NAN_METHOD(GetHheaTable);
    static NAN_METHOD(GetVheaTable);

    static NAN_METHOD(GetCharIndex);
    static NAN_METHOD(GetGlyphName);

    static FT_Library library;
};

#endif