#include <nan.h>
#include "freetype.h"

using namespace v8;

NAN_METHOD(CreateFreeType) {
  NanScope();
  NanReturnValue(FreeType::NewInstance(args));
}

void Init(Handle<Object> exports) {
  FreeType::Init();
  exports->Set(String::NewSymbol("parse"), FunctionTemplate::New(CreateFreeType)->GetFunction());
}

NODE_MODULE(node_freetype, Init)
