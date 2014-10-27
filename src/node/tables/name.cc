#include <nan.h>
#include <ft2build.h>
#include "../freetype.h"
#include FT_SFNT_NAMES_H

NAN_METHOD(FreeType::GetNameTable) {
    NanScope();
    FreeType* ff = ObjectWrap::Unwrap<FreeType>(args.This());

    FT_UInt count = FT_Get_Sfnt_Name_Count(ff->face);
//    printf("name count: %d\n", count);

    Local<Array> names = Array::New(count);
    for(int i=0;i<count;i++) {
        FT_SfntName nameTable;
        if(FT_Get_Sfnt_Name(ff->face, i, &nameTable)) {
            continue;
        }
        Local<Object> obj = Object::New();
        OBJ_SET_INTEGER("platformId", nameTable.platform_id);
        OBJ_SET_INTEGER("encodingId", nameTable.encoding_id);
        OBJ_SET_INTEGER("languageId", nameTable.language_id);
        OBJ_SET_INTEGER("nameId", nameTable.name_id);
        OBJ_SET_INTEGER("stringLen", nameTable.string_len);

        Local<Object> sbuf = NanNewBufferHandle((char*)nameTable.string, nameTable.string_len);
        obj->Set(String::NewSymbol("string"), sbuf);

        names->Set(i, obj);
    }



    NanReturnValue(names);
}