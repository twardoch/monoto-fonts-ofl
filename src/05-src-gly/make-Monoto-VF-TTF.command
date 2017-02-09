#!/usr/bin/env bash

dir=${0%/*}
if [ "$dir" = "$0" ]; then
  dir="."
fi
cd "$dir"

fontmake -g Monoto-VF.glyphs --verbose 'DEBUG' --keep-overlaps --no-production-names -o variable --kern-writer-module feaLab.writers.kernFeatureNoWriter --mark-writer-module feaLab.writers.markFeatureNoWriter

mkdir -p variable_ttf
mv master_ufo/Monoto-GX.ttf variable_ttf/Monoto-VF.ttf
#ttx -m variable_ttf/Monoto-VF.ttf -o ../../fonts/Monoto-VF-TTF/Monoto-VF.ttf variable_ttf/Monoto-VF.ttx
