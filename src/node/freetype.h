#ifndef NODE_FREETYPE_H
#define NODE_FREETYPE_H

#include <nan.h>
#include <vector>
#include <ft2build.h>
#include FT_FREETYPE_H

#define OBJ_SET_INTEGER(key, value) \
  obj->Set(String::NewSymbol(key), Integer::New(value))

#define TPL_SET_FUNC(name, func) \
  tpl->PrototypeTemplate()->Set(String::NewSymbol(name), \
      FunctionTemplate::New(func)->GetFunction())


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

    static NAN_METHOD(GetHeaderTable);
    static NAN_METHOD(GetOS2Table);
    static NAN_METHOD(GetNameTable);
    static NAN_METHOD(GetInfoTable);

    static FT_Library library;
};

#endif