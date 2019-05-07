#!/bin/bash
WEBUIAPP=../backend/src/main/resources/webui
CSS_DIR=$WEBUIAPP/lib/css
FONTS_DIR=$WEBUIAPP/lib/fonts
IMG_DIR=$WEBUIAPP/lib/img

mkdir -p $CSS_DIR $FONTS_DIR $IMG_DIR

cp node_modules/bootstrap/dist/css/*   $CSS_DIR/
# cp node_modules/bootstrap/dist/fonts/* $FONTS_DIR/

# cp node_modules/font-awesome/css/*   $CSS_DIR/
# cp -r node_modules/font-awesome/fonts/* $FONTS_DIR/
