#!/bin/bash
pyftsubset $1 \
--unicodes-file=$(dirname "$0")/subset.txt \
--ignore-missing-glyphs \
--output-file=$2 \
--notdef-outline \
--recommended-glyphs \
--name-IDs='*' \
--name-legacy \
--name-languages='*' \
--glyph-names \
--legacy-cmap \
--recalc-timestamp \
--canonical-order \
