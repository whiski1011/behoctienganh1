# Bé Học Tiếng Anh 1

Ứng dụng học tiếng Anh cho học sinh lớp 1 (Android APK + bản web).

- `app/www/` – giao diện, trò chơi, nội dung bài học
- `packs/audio.zip` – 1.545 đoạn giọng đọc thu sẵn (gom lại cho gọn repo)
- `packs/img.zip` – 324 hình minh họa 3D (Fluent Emoji 3D – Microsoft, giấy phép MIT)
- `android/` – vỏ Android · `tests/` – kiểm thử · `tools/` – công cụ tạo giọng đọc, hình

## Chạy bản web trên GitHub Pages
Settings → Pages → Source: **Deploy from a branch**, Branch: **main**, thư mục **/ (root)** → Save.
Vài phút sau mở `https://<tên-tài-khoản>.github.io/<tên-repo>/`.
Lần đầu mở, app tự tải `packs/*.zip` (khoảng 7 MB) rồi chạy – không cần giải nén.

## Build APK
Cần JDK 17+, Android SDK (platform 35) và Gradle 8.9+: `./build.sh`

## Lưu ý
Giữ kỹ `android/behoc-release.jks` (mật khẩu `behoc2026`) để bản cập nhật cài đè được lên bản cũ. Nên để repo ở chế độ Private.
