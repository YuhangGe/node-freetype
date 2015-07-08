#include <nan.h>
#include <ft2build.h>
#include "../freetype.h"
#include FT_TRUETYPE_TABLES_H

NAN_METHOD(FreeType::GetHheaTable) {
    NanScope();
    FreeType* ff = ObjectWrap::Unwrap<FreeType>(args.This());
    TT_HoriHeader* hhea = (TT_HoriHeader*) FT_Get_Sfnt_Table(ff->face, ft_sfnt_hhea);
    if(hhea == NULL) {
        NanReturnUndefined();
    }

    Local<Object> obj = NanNew<Object>();

// typedef struct  TT_HoriHeader_
//  {
//    FT_Fixed   Version;
//    FT_Short   Ascender;
//    FT_Short   Descender;
//    FT_Short   Line_Gap;
//
//    FT_UShort  advance_Width_Max;      /* advance width maximum */
//
//    FT_Short   min_Left_Side_Bearing;  /* minimum left-sb       */
//    FT_Short   min_Right_Side_Bearing; /* minimum right-sb      */
//    FT_Short   xMax_Extent;            /* xmax extents          */
//    FT_Short   caret_Slope_Rise;
//    FT_Short   caret_Slope_Run;
//    FT_Short   caret_Offset;
//
//    FT_Short   Reserved[4];
//
//    FT_Short   metric_Data_Format;
//    FT_UShort  number_Of_HMetrics;
//
//    /* The following fields are not defined by the TrueType specification */
//    /* but they are used to connect the metrics header to the relevant    */
//    /* `HMTX' table.                                                      */
//
//    void*      long_metrics;
//    void*      short_metrics;
//
//  } TT_HoriHeader;
    OBJ_SET_INTEGER("version", hhea->Version);
    OBJ_SET_INTEGER("ascender", hhea->Ascender);
    OBJ_SET_INTEGER("descender", hhea->Descender);
    OBJ_SET_INTEGER("lineGap", hhea->Line_Gap);
    OBJ_SET_INTEGER("advanceWidthMax", hhea->advance_Width_Max);      /* advance width maximum */
    OBJ_SET_INTEGER("minLeftSideBearing", hhea->min_Left_Side_Bearing);  /* minimum left-sb       */
    OBJ_SET_INTEGER("minRightSideBearing", hhea->min_Right_Side_Bearing); /* minimum right-sb      */
    OBJ_SET_INTEGER("xMaxExtent", hhea->xMax_Extent);            /* xmax extents          */
    OBJ_SET_INTEGER("caretSlopeRise", hhea->caret_Slope_Rise);
    OBJ_SET_INTEGER("caretSlopeRun", hhea->caret_Slope_Run);
    OBJ_SET_INTEGER("caretOffset", hhea->caret_Offset);

    OBJ_SET_ARRAY("reserved", hhea->Reserved, 4);

    OBJ_SET_INTEGER("metricDataFormat", hhea->metric_Data_Format);
    OBJ_SET_INTEGER("numberOfHMetrics", hhea->number_Of_HMetrics);

    NanReturnValue(obj);
}