#!/usr/bin/env bash
# Turns an app loop's master (one shape of one film) into the files the site
# serves, in public/media/app/:
#
#   <name>-<w>.av1.mp4    AV1, 10-bit      Chrome, Edge, Firefox, newer Apple
#   <name>-<w>.hevc.mp4   HEVC, 10-bit     Safari on every other Apple device
#   <name>-<w>.h264.mp4   H.264, 8-bit     anything older
#   <name>-poster-<w>.jpg                  the poster
#
# The same three codecs, in the same order, as scripts/film/prepare_film.sh,
# and 10-bit for the same reason: the app's orb is a soft gradient and 8 bits
# breaks a gradient into blocks. There is no sound, so there is no audio stream.
#
#   scripts/film/prepare_loop.sh <master.mp4> <poster.png> <name> <width>
#
# <name> carries the shape, for example cary-tour-portrait. 720 wide is enough
# for a phone-shaped column; a wide film shown across the page wants 1920.
# Register the result in content/app-loops.ts with the codec strings this prints.
set -euo pipefail

master=$1
poster=$2
name=$3
w=$4
root=$(cd "$(dirname "$0")/../.." && pwd)
out="$root/public/media/app"
mkdir -p "$out"

ff() { ffmpeg -nostdin -hide_banner -v error -y "$@"; }
scale="scale=$w:-2:flags=lanczos"

ff -i "$master" -an -vf "$scale" \
  -c:v libsvtav1 -preset 5 -crf 40 -g 240 -pix_fmt yuv420p10le \
  -svtav1-params "tune=0:enable-variance-boost=1" -movflags +faststart "$out/$name-$w.av1.mp4" 2>/dev/null

ff -i "$master" -an -vf "$scale" \
  -c:v libx265 -preset slow -crf 24 -pix_fmt yuv420p10le -tag:v hvc1 \
  -x265-params "log-level=error:keyint=240" -movflags +faststart "$out/$name-$w.hevc.mp4"

ff -i "$master" -an -vf "$scale" \
  -c:v libx264 -preset slow -tune animation -crf 22 -x264-params aq-mode=3 \
  -profile:v high -pix_fmt yuv420p -movflags +faststart "$out/$name-$w.h264.mp4"

ff -i "$poster" -vf "$scale" -q:v 3 "$out/$name-poster-$w.jpg"

for f in "$out/$name-$w".*.mp4; do
  v=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,profile,level,pix_fmt,width,height -of csv=p=0 "$f")
  printf '%-40s %6s KB   %s\n' "$(basename "$f")" "$(( $(wc -c < "$f") / 1024 ))" "$v"
done
