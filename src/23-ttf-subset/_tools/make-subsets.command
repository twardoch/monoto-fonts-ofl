#!/usr/bin/env bash

dir=${0%/*}
if [ "$dir" = "$0" ]; then
  dir="."
fi
cd "$dir"

ls -1 ../../22-ttf-tr-ah/*.ttf | while read p; do echo "Processing $p"; $(dirname "$0")/subset.sh "$p" "../$(basename "$p")"; done;
echo "Done"
