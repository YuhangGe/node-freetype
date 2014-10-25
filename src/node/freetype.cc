#include <nan.h>
#include "freetype.h"

using namespace v8;

Persistent<Function> FreeType::constructor;

FreeType::FreeType(const FT_Byte* file_base, FT_Long file_size) {
  FT_New_Memory_Face(library, file_base, file_size, 0, &face);
}

FreeType::~FreeType() {
}

FT_Library FreeType::library;

void FreeType::Init() {
  if (FT_Init_FreeType(&library)) exit(EXIT_FAILURE);

  Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
  tpl->SetClassName(String::NewSymbol("FreeType"));
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  TPL_SET_FUNC("getHeaderTable", GetHeaderTable);
  TPL_SET_FUNC("test", Test);
  TPL_SET_FUNC("getOS2Table", GetOS2Table);
  TPL_SET_FUNC("getNameTable", GetNameTable);
  TPL_SET_FUNC("getInfo", GetInfoTable);

  constructor = v8::Persistent<Function>::New(tpl->GetFunction());
}

NAN_METHOD(FreeType::New) {
  NanScope();

  FreeType* obj = new FreeType(
    (FT_Byte*)node::Buffer::Data(args[0]->ToObject()),
    (FT_Long)node::Buffer::Length(args[0]->ToObject())
  );
  obj->Wrap(args.This());

  NanReturnValue(args.This());
}

Handle<Value> FreeType::NewInstance(_NAN_METHOD_ARGS_TYPE args) {
  NanScope();

  const unsigned argc = 1;
  Handle<Value> argv[argc] = { args[0] };
  Local<Object> instance = constructor->NewInstance(argc, argv);

  return scope.Close(instance);
}

NAN_METHOD(FreeType::Test) {
  NanScope();

  NanReturnValue(String::New("hello, world."));
}


NAN_METHOD(FreeType::GetGlyphArray) {
    NanScope();
    // printf("arg length: %d\n", args.Length());
    if(args.Length() == 0 || !args[0]->IsArray()) {
      NanReturnUndefined();
    }
    v8::Local<v8::Array> arr= v8::Local<v8::Array>::Cast(args[0]);
    int len = arr->Length();
    // std::vector<FT_ULong> charArray;

    FreeType* obj = ObjectWrap::Unwrap<FreeType>(args.This());

    for(int i = 0; i < len; i++) {
        v8::Local<v8::Value> ele = arr->Get(i);
        if(ele->IsInt32()) {
          FT_ULong code = (FT_ULong) ele->IntegerValue();
          // charArray.push_back();
          printf("cd: %lu \n", code);
          FT_Load_Char(obj->face, code, 0);
        }
    }

    
    int idx = 0;
    std::vector< v8::Local<Object> > g_arr;


    while(idx<len) {
      FT_GlyphSlot glyph = NULL;
      printf("idx: %d\n", idx);
      if(idx == 0) {
        glyph = obj->face->glyph;
      } else {
        glyph = glyph->next;
      }
      idx++;
      // printf("w: %d \n", glyph);

      if(!glyph) {
        break;
      }

      printf("g: %d \n", glyph->format);

      v8::Local<Object> _g = v8::Object::New();
      _g->Set(String::NewSymbol("glyphFormat"), Integer::New(glyph->format));

      g_arr.push_back(_g);

      // printf("ps: %d \n", g_arr.size());

    }

    v8::Local<Array> rtn_arr = Array::New(g_arr.size());

    len = g_arr.size();
    for(idx=0;idx<len;idx++) {
      rtn_arr->Set(idx, g_arr[idx]);
    }

    // printf("num glyphs: %ld\n", obj->face->num_glyphs);
    // printf("num glyphs");

    NanReturnValue(rtn_arr);
}