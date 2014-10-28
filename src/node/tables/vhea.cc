#include <nan.h>
#include <ft2build.h>
#include "../freetype.h"
#include FT_TRUETYPE_TABLES_H

NAN_METHOD(FreeType::GetVheaTable) {
    NanScope();
    FreeType* ff = ObjectWrap::Unwrap<FreeType>(args.This());
    TT_VertHeader* vhea = (TT_VertHeader*) FT_Get_Sfnt_Table(ff->face, ft_sfnt_vhea);
    if(vhea == NULL) {
        NanReturnUndefined();
    }

    Local<Object> obj = Object::New();

//typedef struct  TT_VertHeader_
//  {
//    FT_Fixed   Version;
//    FT_Short   Ascender;
//    FT_Short   Descender;
//    FT_Short   Line_Gap;
//
//    FT_UShort  advance_Height_Max;      /* advance height maximum */
//
//    FT_Short   min_Top_Side_Bearing;    /* minimum left-sb or top-sb       */
//    FT_Short   min_Bottom_Side_Bearing; /* minimum right-sb or bottom-sb   */
//    FT_Short   yMax_Extent;             /* xmax or ymax extents            */
//    FT_Short   caret_Slope_Rise;
//    FT_Short   caret_Slope_Run;
//    FT_Short   caret_Offset;
//
//    FT_Short   Reserved[4];
//
//    FT_Short   metric_Data_Format;
//    FT_UShort  number_Of_VMetrics;
//
//    /* The following fields are not defined by the TrueType specification */
//    /* but they're used to connect the metrics header to the relevant     */
//    /* `HMTX' or `VMTX' table.                                            */
//
//    void*      long_metrics;
//    void*      short_metrics;
//
//  } TT_VertHeader;

    OBJ_SET_INTEGER("version", vhea->Version);
    OBJ_SET_INTEGER("ascender", vhea->Ascender);
    OBJ_SET_INTEGER("descender", vhea->Descender);
    OBJ_SET_INTEGER("lineGap", vhea->Line_Gap);
    OBJ_SET_INTEGER("advanceHeightMax", vhea->advance_Height_Max);      /* advance height maximum */
    OBJ_SET_INTEGER("minTopSideBearing", vhea->min_Top_Side_Bearing);    /* minimum left-sb or top-sb       */
    OBJ_SET_INTEGER("minBottomSideBearing", vhea->min_Bottom_Side_Bearing); /* minimum right-sb or bottom-sb   */
    OBJ_SET_INTEGER("yMaxExtent", vhea->yMax_Extent);             /* xmax or ymax extents            */
    OBJ_SET_INTEGER("caretSlopeRise", vhea->caret_Slope_Rise);
    OBJ_SET_INTEGER("caretSlopeRun", vhea->caret_Slope_Run);
    OBJ_SET_INTEGER("caretOffset", vhea->caret_Offset);

    OBJ_SET_ARRAY("reserved", vhea->Reserved, 4);

    OBJ_SET_INTEGER("metricDataFormat", vhea->metric_Data_Format);
    OBJ_SET_INTEGER("numberOfVMetrics", vhea->number_Of_VMetrics);


    NanReturnValue(obj);
}