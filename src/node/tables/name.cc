#include <nan.h>
#include <ft2build.h>
#include "../freetype.h"
#include FT_SFNT_NAMES_H

NAN_METHOD(FreeType::GetNameTable) {
    NanScope();
    FreeType* ff = ObjectWrap::Unwrap<FreeType>(args.This());
    Local<Object> obj = Object::New();

    OBJ_SET_INTEGER("a", 45);

    FT_UInt count = FT_Get_Sfnt_Name_Count(ff->face);
    printf("name count: %d\n", count);
//    for(int i=0;i<count;i++) {

//    }



    NanReturnValue(obj);
}