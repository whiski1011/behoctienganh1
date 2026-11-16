#!/bin/bash
# Đóng gói mã nguồn gọn cho GitHub (< 100 file): âm thanh + hình gom vào packs/*.zip
set -e
cd /home/claude
VER=$(grep -o 'versionName "[^"]*"' android/app/build.gradle | cut -d'"' -f2)
G=/tmp/gh/BeHocTiengAnh1; rm -rf /tmp/gh; mkdir -p $G/app $G/packs
cp -r app/www $G/app/ && rm -rf $G/app/www/audio $G/app/www/img
(cd app/www && zip -qr -0 $G/packs/audio.zip audio && zip -qr -0 $G/packs/img.zip img)
mkdir -p $G/android/app/src/main && cp -r android/app/src/main/java android/app/src/main/res android/app/src/main/AndroidManifest.xml $G/android/app/src/main/
cp android/app/build.gradle $G/android/app/ && cp android/build.gradle android/settings.gradle android/gradle.properties android/behoc-release.jks $G/android/
mkdir -p $G/tests $G/tools && cp tests/*.js $G/tests/ && cp tools/* $G/tools/
cp -r gh_extra/. $G/
chmod +x $G/build.sh
cd /tmp/gh && rm -f /home/claude/out/BeHocTiengAnh1_source_github_*.zip && zip -qr /home/claude/out/BeHocTiengAnh1_source_github_v$VER.zip BeHocTiengAnh1
echo "files: $(find BeHocTiengAnh1 -type f | wc -l) -> out/BeHocTiengAnh1_source_github_v$VER.zip"
