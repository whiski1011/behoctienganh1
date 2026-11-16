# Bé Học Tiếng Anh 1

Ứng dụng học tiếng Anh cho học sinh lớp 1 (Android APK + bản web).

- `app/www/` – giao diện, trò chơi, nội dung bài học
- `packs/audio.zip` – 1.545 đoạn giọng đọc thu sẵn (gom lại cho gọn repo)
- `packs/img.zip` – 324 hình minh họa 3D (Fluent Emoji 3D – Microsoft, giấy phép MIT)
- `android/` – vỏ Android (WebView, giọng đọc, nhận giọng nói, sao lưu)
- `tests/` – kiểm thử tự động · `tools/` – công cụ tạo giọng đọc, font, hình

## Build APK
Cần JDK 17+, Android SDK (platform 35, build-tools 35) và Gradle 8.9+:

    ./build.sh

`build.sh` tự giải nén `packs/*.zip` vào `app/www/` trước khi đóng gói.

## Chạy bản web
Giải nén `packs/audio.zip` và `packs/img.zip` vào `app/www/`, rồi mở `app/www/index.html`.
Nếu dùng GitHub Pages: Settings → Pages → Source chọn **GitHub Actions**; workflow `.github/workflows/pages.yml` tự giải nén và đăng.

## Lưu ý
Giữ kỹ `android/behoc-release.jks` (mật khẩu `behoc2026`) – cần file này để bản cập nhật cài đè được lên bản cũ.
