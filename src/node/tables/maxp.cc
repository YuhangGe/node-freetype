#include <nan.h>
#include <ft2build.h>
#include "../freetype.h"
#include FT_TRUETYPE_TABLES_H

NAN_METHOD(FreeType::GetMaxProfileTable) {
    NanScope();
    FreeType* ff = ObjectWrap::Unwrap<FreeType>(args.This());
    TT_MaxProfile* maxp = (TT_MaxProfile*) FT_Get_Sfnt_Table(ff->face, ft_sfnt_maxp);
    if(maxp == NULL) {
        NanReturnUndefined();
    }
    Local<Object> obj = NanNew<Object>();

//typedef struct  TT_MaxProfile_
//  {
//    FT_Fixed   version;
//    FT_UShort  numGlyphs;
//    FT_UShort  maxPoints;
//    FT_UShort  maxContours;
//    FT_UShort  maxCompositePoints;
//    FT_UShort  maxCompositeContours;
//    FT_UShort  maxZones;
//    FT_UShort  maxTwilightPoints;
//    FT_UShort  maxStorage;
//    FT_UShort  maxFunctionDefs;
//    FT_UShort  maxInstructionDefs;
//    FT_UShort  maxStackElements;
//    FT_UShort  maxSizeOfInstructions;
//    FT_UShort  maxComponentElements;
//    FT_UShort  maxComponentDepth;
//
//  } TT_MaxProfile;

    OBJ_SET_INTEGER("version", maxp->version);
    OBJ_SET_INTEGER("numGlyphs", maxp->numGlyphs);
    OBJ_SET_INTEGER("maxPoints", maxp->maxPoints);
    OBJ_SET_INTEGER("maxContours", maxp->maxContours);
    OBJ_SET_INTEGER("maxCompositePoints", maxp->maxCompositePoints);
    OBJ_SET_INTEGER("maxCompositeContours", maxp->maxCompositeContours);
    OBJ_SET_INTEGER("maxZones", maxp->maxZones);
    OBJ_SET_INTEGER("maxTwilightPoints", maxp->maxTwilightPoints);
    OBJ_SET_INTEGER("maxStorage", maxp->maxStorage);
    OBJ_SET_INTEGER("maxFunctionDefs", maxp->maxFunctionDefs);
    OBJ_SET_INTEGER("maxInstructionDefs", maxp->maxInstructionDefs);
    OBJ_SET_INTEGER("maxStackElements", maxp->maxStackElements);
    OBJ_SET_INTEGER("maxSizeOfInstructions", maxp->maxSizeOfInstructions);
    OBJ_SET_INTEGER("maxComponentElements", maxp->maxComponentElements);
    OBJ_SET_INTEGER("maxComponentDepth", maxp->maxComponentDepth);

    NanReturnValue(obj);
}