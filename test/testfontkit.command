#!/usr/bin/env sh

dir=${0%/*}
if [ "$dir" = "$0" ]; then
  dir="."
fi
cd "$dir"

./testfontkit.js Monoto-VF.ttf > Monoto-VF.html && open Monoto-VF.html
