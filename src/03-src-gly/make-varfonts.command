#!/usr/bin/env bash

dir=${0%/*}
if [ "$dir" = "$0" ]; then
  dir="."
fi
cd "$dir"

fontmake -g Monoto-MM.glyphs --verbose 'DEBUG' --keep-overlaps --no-production-names -o variable --kern-writer-module feaLab.writers.kernFeatureNoWriter --mark-writer-module feaLab.writers.markFeatureNoWriter

mkdir -p variable_ttf
mkdir -p ../12-ttf-var
mv master_ufo/Monoto-GX.ttf variable_ttf/MonotoVF.ttf
ttx -m variable_ttf/MonotoVF.ttf -o ../12-ttf-var/MonotoVF.ttf variable_ttf/MonotoVF.ttx
