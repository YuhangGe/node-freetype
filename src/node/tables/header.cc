#include <nan.h>
#include <ft2build.h>
#include "../freetype.h"
#include FT_TRUETYPE_TABLES_H

NAN_METHOD(FreeType::GetHeadTable) {
  NanScope();
  FreeType* ff = ObjectWrap::Unwrap<FreeType>(args.This());
  TT_Header* header = (TT_Header*) FT_Get_Sfnt_Table(ff->face, ft_sfnt_head);
  if(header == NULL) {
        NanReturnUndefined();
  }

  // printf("t %x \n", header->Table_Version);
  /*
  typedef struct  TT_Header_
  {
    FT_Fixed   Table_Version;
    FT_Fixed   Font_Revision;

    FT_Long    CheckSum_Adjust;
    FT_Long    Magic_Number;

    FT_UShort  Flags;
    FT_UShort  Units_Per_EM;

    FT_Long    Created [2];
    FT_Long    Modified[2];

    FT_Short   xMin;
    FT_Short   yMin;
    FT_Short   xMax;
    FT_Short   yMax;

    FT_UShort  Mac_Style;
    FT_UShort  Lowest_Rec_PPEM;

    FT_Short   Font_Direction;
    FT_Short   Index_To_Loc_Format;
    FT_Short   Glyph_Data_Format;

  } TT_Header;
*/
  Local<Object> obj = Object::New();

  OBJ_SET_INTEGER("tableVersion", header->Table_Version);
  OBJ_SET_INTEGER("fontRevision", header->Font_Revision);
  OBJ_SET_INTEGER("checkSumAdjust", header->CheckSum_Adjust);
  OBJ_SET_INTEGER("magicNumber", header->Magic_Number);
  OBJ_SET_INTEGER("flags", header->Flags);
  OBJ_SET_INTEGER("unitsPerEM", header->Units_Per_EM);

  OBJ_SET_ARRAY("createdTime", header->Created, 2);
  OBJ_SET_ARRAY("modifiedTime", header->Modified, 2);

//  printf("%lx %lx \n", header->Modified[0], header->Modified[1]);

  OBJ_SET_INTEGER("xMin", header->xMin);
  OBJ_SET_INTEGER("yMin", header->yMin);
  OBJ_SET_INTEGER("xMax", header->xMax);
  OBJ_SET_INTEGER("yMax", header->yMax);

  OBJ_SET_INTEGER("macStyle", header->Mac_Style);
  OBJ_SET_INTEGER("lowestRecPPEM", header->Lowest_Rec_PPEM);
  OBJ_SET_INTEGER("fontDirection", header->Font_Direction);
  OBJ_SET_INTEGER("indexToLocFormat", header->Index_To_Loc_Format);
  OBJ_SET_INTEGER("glyphDataFormat", header->Glyph_Data_Format);

  NanReturnValue(obj);
}
