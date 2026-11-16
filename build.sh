#!/bin/bash
# Build APK: giải nén âm thanh + hình (packs/*.zip) rồi đóng gói bằng Gradle
set -e
cd "$(dirname "$0")"
[ -d app/www/audio ] || unzip -q packs/audio.zip -d app/www
[ -d app/www/img ]   || unzip -q packs/img.zip -d app/www
rm -rf android/app/src/main/assets/www && mkdir -p android/app/src/main/assets
cp -r app/www android/app/src/main/assets/www
cd android && gradle --no-daemon -q assembleRelease
echo "APK: android/app/build/outputs/apk/release/app-release.apk"
