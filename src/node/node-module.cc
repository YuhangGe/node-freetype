#include <nan.h>
#include "freetype.h"

using namespace v8;

void Init(Handle<Object> exports) {
  FreeType::Init(exports);
}

NODE_MODULE(node_freetype, Init)
