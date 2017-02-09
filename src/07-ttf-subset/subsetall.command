#!/usr/bin/env bash

dir=${0%/*}
if [ "$dir" = "$0" ]; then
  dir="."
fi
cd "$dir"

mkdir -p "$2"
pushd $(pwd)
ls -1 "$1"/*.ttf | while read p; do echo "Processing $p"; $(dirname "$0")/subset.sh "$p" "$(dirname "$p")/../$2/$(basename "$p")"; done;
popd
echo "Done"
