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

void FreeType::Init(Handle<Object> exports) {
  Isolate* isolate = Isolate::GetCurrent();

  if (FT_Init_FreeType(&library)) {
//    printf('init freetype failure');
    exit(EXIT_FAILURE);
  }

  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);

  tpl->SetClassName(NanNew<String>("FreeType"));
  tpl->InstanceTemplate()->SetInternalFieldCount(1);


    NODE_SET_PROTOTYPE_METHOD(tpl, "getHeadTable", GetHeadTable);
    NODE_SET_PROTOTYPE_METHOD(tpl, "getOS2Table", GetOS2Table);
    NODE_SET_PROTOTYPE_METHOD(tpl, "getNameTable", GetNameTable);
    NODE_SET_PROTOTYPE_METHOD(tpl, "getInfo", GetInfoTable);
    NODE_SET_PROTOTYPE_METHOD(tpl, "getPostTable", GetPostTable);
    NODE_SET_PROTOTYPE_METHOD(tpl, "getPcltTable", GetPcltTable);
    NODE_SET_PROTOTYPE_METHOD(tpl, "getMaxProfileTable", GetMaxProfileTable);
    NODE_SET_PROTOTYPE_METHOD(tpl, "getHheaTable", GetHheaTable);
    NODE_SET_PROTOTYPE_METHOD(tpl, "getVheaTable", GetVheaTable);
    NODE_SET_PROTOTYPE_METHOD(tpl, "getCharIndex", GetCharIndex);
    NODE_SET_PROTOTYPE_METHOD(tpl, "getGlyphName", GetGlyphName);

  constructor.Reset(isolate, tpl->GetFunction());
  exports->Set(String::NewFromUtf8(isolate, "FreeType"), tpl->GetFunction());
}

void FreeType::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);

  if (args.IsConstructCall()) {
      FreeType* obj = new FreeType(
        (FT_Byte*)node::Buffer::Data(args[0]->ToObject()),
        (FT_Long)node::Buffer::Length(args[0]->ToObject())
      );
      obj->Wrap(args.This());
      args.GetReturnValue().Set(args.This());
  } else {
    Local<Value> argv[1] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    args.GetReturnValue().Set(cons->NewInstance(1, argv));
  }
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
//          printf("cd: %lu \n", code);
          FT_Load_Char(obj->face, code, 0);
        }
    }

    
    int idx = 0;
    std::vector< v8::Local<Object> > g_arr;


    while(idx<len) {
      FT_GlyphSlot glyph = NULL;
//      printf("idx: %d\n", idx);
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

//      printf("g: %d \n", glyph->format);

      v8::Local<Object> _g = NanNew<Object>();
      _g->Set(NanNew<String>("glyphFormat"), NanNew<Number>(glyph->format));

      g_arr.push_back(_g);

      // printf("ps: %d \n", g_arr.size());

    }

    v8::Local<Array> rtn_arr = NanNew<Array>(g_arr.size());

    len = g_arr.size();
    for(idx=0;idx<len;idx++) {
      rtn_arr->Set(idx, g_arr[idx]);
    }

    // printf("num glyphs: %ld\n", obj->face->num_glyphs);
    // printf("num glyphs");

    NanReturnValue(rtn_arr);
}

NAN_METHOD(FreeType::GetCharIndex) {
    NanScope();
    if(args.Length() != 1) {
        NanReturnUndefined();
    }
    FT_UInt idx = 0;
    FT_ULong cc = 0;
    FreeType* ff = ObjectWrap::Unwrap<FreeType>(args.This());

    if(args[0]->IsNumber()) {
        cc = Local<Integer>::Cast(args[0])->Value();
        idx = FT_Get_Char_Index(ff->face, cc);
        NanReturnValue(NanNew<Integer>(idx));
    } else if(args[0]->IsArray()) {
        Local<Array> arr= Local<Array>::Cast(args[0]);
        int len = arr->Length();
        Local<Array> rtnArr = NanNew<Array>(len);
        for(int i = 0; i < len; i++) {
            v8::Local<v8::Value> ele = arr->Get(i);
            if(ele->IsInt32()) {
               cc = (FT_ULong) ele->IntegerValue();
               idx = FT_Get_Char_Index(ff->face, cc);
               rtnArr->Set(i, NanNew<Integer>(idx));
            } else {
               rtnArr->Set(i, NanNew<Integer>(-1));
            }
        }
        NanReturnValue(rtnArr);
    } else {
        NanReturnUndefined();
    }

}

NAN_METHOD(FreeType::GetGlyphName) {
    NanScope();
        if(args.Length() != 1) {
            NanReturnUndefined();
        }
        FT_UInt idx = 0;
        FreeType* ff = ObjectWrap::Unwrap<FreeType>(args.This());

        const int b_len = 128;
        char buf[128];
        if(args[0]->IsNumber()) {
            idx = Local<Integer>::Cast(args[0])->Value();
            if(FT_Get_Glyph_Name(ff->face, idx, buf, b_len) == 0) {
                NanReturnValue(NanNew<String>(buf));
            } else {
                NanReturnUndefined();
            }
        } else if(args[0]->IsArray()) {
            Local<Array> arr= Local<Array>::Cast(args[0]);
            int len = arr->Length();
            Local<Array> rtnArr = NanNew<Array>(len);
            for(int i = 0; i < len; i++) {
                v8::Local<v8::Value> ele = arr->Get(i);
                if(ele->IsInt32()) {
                   idx = (FT_ULong) ele->IntegerValue();
                   if(FT_Get_Glyph_Name(ff->face, idx, buf, b_len) == 0) {
                      rtnArr->Set(i, NanNew<String>(buf));
                   } else {
                      rtnArr->Set(i, NanUndefined());
                   }
                } else {
                   rtnArr->Set(i, NanUndefined());
                }
            }
            NanReturnValue(rtnArr);
        } else {
            NanReturnUndefined();
        }
}