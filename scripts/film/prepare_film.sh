#!/usr/bin/env bash
# Turns a film's master into the files the site serves, in
# public/media/film/:
#
#   <name>-1080.av1.mp4    AV1, 10-bit      Chrome, Edge, Firefox, newer Apple
#   <name>-720.av1.mp4     the same, for phones
#   <name>-1080.hevc.mp4   HEVC, 10-bit     Safari on every other Apple device
#   <name>-720.hevc.mp4    the same, for phones
#   <name>-720.h264.mp4    H.264, 8-bit     anything older
#   <name>-poster-<w>.avif / .jpg           the poster, 640, 1280 and 1920 wide
#
# 10-bit because the films are soft gradients behind sharp text: at 8 bits
# the encoder breaks a gradient into visible blocks, at 10 it stays smooth
# for no more data. H.264 has no 10-bit a browser will play, so it is only
# the fallback. Every file starts playing before it has finished arriving
# (faststart), and the sound is the master's own track, re-encoded once.
#
# Measured on the first film (the platform, 45 s, a 10.5 MB master): VMAF
# 95 to 97 against the master for every file, at 1.5 to 2.5 MB each with
# the sound. AV1 is the file most visitors get, so its rate is set as low
# as the gradients allow: CRF 44 kept them smooth where 8-bit at any rate
# blocked, and CRF 48 began to show steps.
#
#   scripts/film/prepare_film.sh <master.mp4> <poster.png> <name>
#
# Register the result in content/films.ts with the codec strings this
# prints. Needs ffmpeg with libsvtav1, libx265, libx264, libaom-av1.
set -euo pipefail

master=$1
poster=$2
name=$3
root=$(cd "$(dirname "$0")/../.." && pwd)
out="$root/public/media/film"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$out"

ff() { ffmpeg -nostdin -hide_banner -v error -y "$@"; }

ff -i "$master" -vn -c:a aac -b:a 128k "$tmp/audio.m4a"

# One video stream into one file with the shared sound, playable while it
# downloads.
mux() {
  ff -i "$tmp/video.mp4" -i "$tmp/audio.m4a" -map 0:v -map 1:a -c copy \
    -movflags +faststart "$out/$name-$1.mp4"
}

for spec in "1080 44" "720 42"; do
  set -- $spec
  ff -i "$master" -an -vf "scale=-2:$1:flags=lanczos" \
    -c:v libsvtav1 -preset 5 -crf "$2" -g 240 -pix_fmt yuv420p10le \
    -svtav1-params "tune=0:enable-variance-boost=1" "$tmp/video.mp4" 2>/dev/null
  mux "$1.av1"
done

for spec in "1080 26" "720 25"; do
  set -- $spec
  ff -i "$master" -an -vf "scale=-2:$1:flags=lanczos" \
    -c:v libx265 -preset slow -crf "$2" -pix_fmt yuv420p10le -tag:v hvc1 \
    -x265-params "log-level=error:keyint=240" "$tmp/video.mp4"
  mux "$1.hevc"
done

ff -i "$master" -an -vf "scale=-2:720:flags=lanczos" \
  -c:v libx264 -preset slow -tune animation -crf 22 -x264-params aq-mode=3 \
  -profile:v high -pix_fmt yuv420p "$tmp/video.mp4"
mux "720.h264"

# The poster in 10-bit too, for the same reason as the films: at 8 bits its
# gradient came out in visible blocks, at 10 it stays smooth for a few KB.
for w in 640 1280 1920; do
  ff -i "$poster" -vf "scale=$w:-2:flags=lanczos,format=yuv444p10le" \
    -c:v libaom-av1 -still-picture 1 -crf 18 -cpu-used 4 "$out/$name-poster-$w.avif"
  ff -i "$poster" -vf "scale=$w:-2:flags=lanczos" -q:v 3 "$out/$name-poster-$w.jpg"
done

# The codec string for each file, as content/films.ts and canPlayType want
# it, and its size.
for f in "$out/$name"-*.mp4; do
  v=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,profile,level,pix_fmt,height -of csv=p=0 "$f")
  printf '%-34s %6s KB   %s\n' "$(basename "$f")" "$(( $(wc -c < "$f") / 1024 ))" "$v"
done
for f in "$out/$name"-poster-*; do
  printf '%-34s %6s KB\n' "$(basename "$f")" "$(( $(wc -c < "$f") / 1024 ))"
done
