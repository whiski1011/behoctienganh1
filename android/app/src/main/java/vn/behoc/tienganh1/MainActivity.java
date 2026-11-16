package vn.behoc.tienganh1;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.media.AudioManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

public class MainActivity extends Activity {
    private static final int REQ_MIC = 42;
    private static final int REQ_RESTORE = 43;
    private static final int REQ_STORAGE = 44;
    private static final String BK_DIR = "BeHocTiengAnh";
    private static final String BK_NAME = "BeHocTiengAnh_saoluu.json";
    private WebView web;
    private TextToSpeech tts;
    private volatile boolean ttsReady = false;
    private final Map<String, Voice> chosenVoice = new HashMap<>();
    private SpeechRecognizer recognizer;
    private String pendingListenLang = null;
    private final Handler ui = new Handler(Looper.getMainLooper());

    // Tên giọng nữ ưu tiên (Google TTS / Samsung TTS)
    private static final String[] FEMALE_EN = {"en-us-x-tpf", "en-us-x-sfg", "en-us-x-iob", "en-us-x-iog", "en-us-x-tpc", "smtf", "female"};
    private static final String[] FEMALE_VI = {"vi-vn-x-gft", "vi-vn-x-vic", "vi-vn-x-vid", "vi-vn-language", "smtf", "female"};
    private static final String[] MALE = {"male", "smtm", "-x-iol", "-x-iom", "-x-tpd", "-x-vie", "-x-vif", "-x-gbd", "-x-gbg", "-x-rjs"};

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setVolumeControlStream(AudioManager.STREAM_MUSIC);

        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#29B6F6"));
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(true);
        s.setTextZoom(100);          // không cho cỡ chữ hệ thống làm vỡ bố cục
        s.setSupportZoom(false);
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient());
        web.addJavascriptInterface(new Bridge(), "Native");
        setContentView(web);
        hideSystemBars();
        web.loadUrl("file:///android_asset/www/index.html");

        tts = new TextToSpeech(this, status -> {
            if (status == TextToSpeech.SUCCESS) {
                ttsReady = true;
                pickDefaultVoice("en");
                pickDefaultVoice("vi");
                tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                    @Override public void onStart(String id) { }
                    @Override public void onDone(String id) { js("window.__ttsDone&&__ttsDone(" + safeId(id) + ")"); }
                    @Override public void onError(String id) { js("window.__ttsDone&&__ttsDone(" + safeId(id) + ")"); }
                    @Override public void onStop(String id, boolean interrupted) { js("window.__ttsDone&&__ttsDone(" + safeId(id) + ")"); }
                });
                js("window.onVoicesReady&&onVoicesReady()");
            }
        });
    }

    private static String safeId(String id) {
        try { return String.valueOf(Long.parseLong(id)); } catch (Exception e) { return "0"; }
    }

    private void js(final String code) {
        ui.post(() -> { if (web != null) web.evaluateJavascript(code, null); });
    }

    private static Locale localeOf(String lang) {
        return "vi".equals(lang) ? new Locale("vi", "VN") : Locale.US;
    }

    private List<Voice> voicesFor(String lang) {
        List<Voice> out = new ArrayList<>();
        if (!ttsReady) return out;
        try {
            Set<Voice> all = tts.getVoices();
            if (all == null) return out;
            for (Voice v : all) {
                Locale l = v.getLocale();
                if (l == null || !lang.equalsIgnoreCase(l.getLanguage())) continue;
                if ("en".equals(lang) && !"US".equalsIgnoreCase(l.getCountry())) continue;   // chỉ giọng Anh - Mỹ
                Set<String> f = v.getFeatures();
                if (f != null && f.contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED)) continue;
                out.add(v);
            }
        } catch (Exception ignored) { }
        return out;
    }

    private int score(String name, String lang) {
        String n = name.toLowerCase(Locale.ROOT);
        int s = 0;
        for (String m : MALE) if (n.contains(m) && !n.contains("female")) { s -= 50; break; }
        String[] pref = "vi".equals(lang) ? FEMALE_VI : FEMALE_EN;
        for (int i = 0; i < pref.length; i++) if (n.contains(pref[i])) s += 40 - i;
        if (n.contains("local")) s += 3;
        if ("en".equals(lang) && n.startsWith("en-us")) s += 2;
        return s;
    }

    private void pickDefaultVoice(String lang) {
        Voice best = null; int bestScore = Integer.MIN_VALUE;
        for (Voice v : voicesFor(lang)) {
            int sc = score(v.getName(), lang);
            if (sc > bestScore) { bestScore = sc; best = v; }
        }
        if (best != null) chosenVoice.put(lang, best);
    }

    // ================= Cầu nối JavaScript =================
    public class Bridge {
        @JavascriptInterface
        public String ttsReady() { return ttsReady ? "1" : "0"; }

        @JavascriptInterface
        public int langStatus(String lang) {
            if (!ttsReady) return -2;
            try { return tts.isLanguageAvailable(localeOf(lang)); } catch (Exception e) { return -2; }
        }

        @JavascriptInterface
        public String voices(String lang) {
            JSONArray arr = new JSONArray();
            for (Voice v : voicesFor(lang)) {
                try {
                    JSONObject o = new JSONObject();
                    o.put("name", v.getName());
                    o.put("local", !v.isNetworkConnectionRequired());
                    o.put("quality", v.getQuality());
                    o.put("locale", v.getLocale().toString());
                    arr.put(o);
                } catch (Exception ignored) { }
            }
            return arr.toString();
        }

        @JavascriptInterface
        public void setVoice(String lang, String name) {
            for (Voice v : voicesFor(lang)) if (v.getName().equals(name)) { chosenVoice.put(lang, v); return; }
        }

        @JavascriptInterface
        public void speak(String text, String lang, int id, float rate, float pitch) {
            if (!ttsReady) { js("window.__ttsDone&&__ttsDone(" + id + ")"); return; }
            try {
                Voice v = chosenVoice.get(lang);
                if (v != null) tts.setVoice(v); else tts.setLanguage(localeOf(lang));
                tts.setSpeechRate(rate);
                tts.setPitch(pitch);
                Bundle b = new Bundle();
                b.putInt(TextToSpeech.Engine.KEY_PARAM_STREAM, AudioManager.STREAM_MUSIC);
                int r = tts.speak(text, TextToSpeech.QUEUE_ADD, b, String.valueOf(id));
                if (r != TextToSpeech.SUCCESS) js("window.__ttsDone&&__ttsDone(" + id + ")");
            } catch (Exception e) {
                js("window.__ttsDone&&__ttsDone(" + id + ")");
            }
        }

        @JavascriptInterface
        public void stop() { if (ttsReady) try { tts.stop(); } catch (Exception ignored) { } }

        @JavascriptInterface
        public void openTtsSettings() {
            ui.post(() -> {
                try {
                    Intent i = new Intent("com.android.settings.TTS_SETTINGS");
                    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(i);
                } catch (Exception e) {
                    try { startActivity(new Intent(android.provider.Settings.ACTION_SETTINGS)); } catch (Exception ignored) { }
                }
            });
        }

        @JavascriptInterface
        public boolean sttAvailable() {
            try { return SpeechRecognizer.isRecognitionAvailable(MainActivity.this); } catch (Exception e) { return false; }
        }

        @JavascriptInterface
        public void listen(final String lang) { ui.post(() -> startListening(lang)); }

        @JavascriptInterface
        public void stopListen() {
            ui.post(() -> { if (recognizer != null) try { recognizer.cancel(); } catch (Exception ignored) { } });
        }

        @JavascriptInterface
        public String backup(String json) { return writeBackup(json); }

        @JavascriptInterface
        public void pickRestore() {
            ui.post(() -> {
                try {
                    Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                    i.addCategory(Intent.CATEGORY_OPENABLE);
                    i.setType("*/*");
                    startActivityForResult(i, REQ_RESTORE);
                } catch (Exception e) { js("window.__restoreError&&__restoreError()"); }
            });
        }

        @JavascriptInterface
        public String appVersion() { return BuildConfigHolder.VERSION; }
    }

    private void hideSystemBars() {
        // Toàn màn hình cho bé: ẩn thanh trạng thái, vuốt từ mép trên để hiện lại
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemBars();
    }

    // ================= Sao lưu =================
    private String writeBackup(String json) {
        byte[] data = json.getBytes(StandardCharsets.UTF_8);
        try {
            if (Build.VERSION.SDK_INT >= 29) {
                ContentResolver r = getContentResolver();
                Uri coll = MediaStore.Downloads.EXTERNAL_CONTENT_URI;
                String rel = Environment.DIRECTORY_DOWNLOADS + "/" + BK_DIR + "/";
                Uri target = null;
                try (Cursor c = r.query(coll, new String[]{MediaStore.MediaColumns._ID},
                        MediaStore.MediaColumns.RELATIVE_PATH + "=? AND " + MediaStore.MediaColumns.DISPLAY_NAME + "=?",
                        new String[]{rel, BK_NAME}, null)) {
                    if (c != null && c.moveToFirst()) target = Uri.withAppendedPath(coll, String.valueOf(c.getLong(0)));
                }
                if (target == null) {
                    ContentValues v = new ContentValues();
                    v.put(MediaStore.MediaColumns.DISPLAY_NAME, BK_NAME);
                    v.put(MediaStore.MediaColumns.MIME_TYPE, "application/json");
                    v.put(MediaStore.MediaColumns.RELATIVE_PATH, rel);
                    target = r.insert(coll, v);
                }
                if (target == null) return "";
                try (OutputStream os = r.openOutputStream(target, "wt")) { if (os == null) return ""; os.write(data); }
                return "Download/" + BK_DIR + "/" + BK_NAME;
            } else {
                File dir;
                String shown;
                if (checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
                    dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), BK_DIR);
                    shown = "Download/" + BK_DIR + "/" + BK_NAME;
                } else {
                    ui.post(() -> requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQ_STORAGE));
                    dir = getExternalFilesDir(null);
                    shown = "Android/data/" + getPackageName() + "/files/" + BK_NAME;
                }
                if (dir == null) return "";
                if (!dir.exists() && !dir.mkdirs()) return "";
                try (FileOutputStream fo = new FileOutputStream(new File(dir, BK_NAME))) { fo.write(data); }
                return shown;
            }
        } catch (Exception e) {
            return "";
        }
    }

    static class BuildConfigHolder { static final String VERSION = "1.5.1"; }

    // ================= Nhận diện giọng nói =================
    private void sttEvent(String type, JSONArray list, String code) {
        try {
            JSONObject o = new JSONObject();
            o.put("type", type);
            if (list != null) o.put("list", list);
            if (code != null) o.put("code", code);
            js("window.__stt&&__stt(" + JSONObject.quote(o.toString()) + ")");
        } catch (Exception ignored) { }
    }

    private void startListening(String lang) {
        if (Build.VERSION.SDK_INT >= 23 && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            pendingListenLang = lang;
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC);
            return;
        }
        if (!SpeechRecognizer.isRecognitionAvailable(this)) { sttEvent("error", null, "unavailable"); return; }
        try { if (ttsReady) tts.stop(); } catch (Exception ignored) { }
        try {
            if (recognizer == null) {
                recognizer = SpeechRecognizer.createSpeechRecognizer(this);
                recognizer.setRecognitionListener(new RecognitionListener() {
                    @Override public void onReadyForSpeech(Bundle params) { sttEvent("ready", null, null); }
                    @Override public void onBeginningOfSpeech() { sttEvent("begin", null, null); }
                    @Override public void onRmsChanged(float rmsdB) { }
                    @Override public void onBufferReceived(byte[] buffer) { }
                    @Override public void onEndOfSpeech() { sttEvent("end", null, null); }
                    @Override public void onError(int error) {
                        String c;
                        switch (error) {
                            case SpeechRecognizer.ERROR_NO_MATCH: c = "no-match"; break;
                            case SpeechRecognizer.ERROR_SPEECH_TIMEOUT: c = "timeout"; break;
                            case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS: c = "permission"; break;
                            case SpeechRecognizer.ERROR_NETWORK:
                            case SpeechRecognizer.ERROR_NETWORK_TIMEOUT: c = "network"; break;
                            default: c = String.valueOf(error);
                        }
                        sttEvent("error", null, c);
                    }
                    @Override public void onResults(Bundle results) {
                        JSONArray arr = new JSONArray();
                        ArrayList<String> l = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                        if (l != null) for (String x : l) arr.put(x);
                        // độ tin cậy của từng kết quả (0..1) – dùng để chấm điểm phát âm
                        JSONArray conf = new JSONArray();
                        float[] cf = results.getFloatArray(SpeechRecognizer.CONFIDENCE_SCORES);
                        if (cf != null) for (float c : cf) { try { conf.put((double) c); } catch (Exception ignored) { } }
                        try {
                            JSONObject o = new JSONObject();
                            o.put("type", "result"); o.put("list", arr); o.put("conf", conf);
                            js("window.__stt&&__stt(" + JSONObject.quote(o.toString()) + ")");
                        } catch (Exception e) { sttEvent("result", arr, null); }
                    }
                    @Override public void onPartialResults(Bundle partialResults) {
                        ArrayList<String> l = partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                        if (l != null && !l.isEmpty() && l.get(0) != null && !l.get(0).isEmpty()) {
                            try { JSONObject o = new JSONObject(); o.put("type", "partial"); o.put("text", l.get(0));
                                js("window.__stt&&__stt(" + JSONObject.quote(o.toString()) + ")"); } catch (Exception ignored) { }
                        }
                    }
                    @Override public void onEvent(int eventType, Bundle params) { }
                });
            }
            Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang);
            i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, lang);
            i.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
            i.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);   // hiện chữ ngay khi bé đang nói
            // bé nói xong, ngừng khoảng 1 giây là máy tự kết thúc và chấm điểm
            i.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 1200L);
            i.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 1000L);
            i.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, getPackageName());
            recognizer.startListening(i);
        } catch (Exception e) {
            sttEvent("error", null, "start");
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQ_RESTORE || resultCode != RESULT_OK || data == null || data.getData() == null) return;
        try (InputStream in = getContentResolver().openInputStream(data.getData())) {
            if (in == null) throw new Exception("null");
            BufferedReader br = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(); char[] buf = new char[8192]; int n;
            while ((n = br.read(buf)) > 0) { sb.append(buf, 0, n); if (sb.length() > 4_000_000) break; }
            js("window.__restoreData&&__restoreData(" + JSONObject.quote(sb.toString()) + ")");
        } catch (Exception e) {
            js("window.__restoreError&&__restoreError()");
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_MIC) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED && pendingListenLang != null) {
                startListening(pendingListenLang);
            } else {
                sttEvent("error", null, "permission");
            }
            pendingListenLang = null;
        }
    }

    // ================= Vòng đời =================
    @Override
    public void onBackPressed() {
        if (web == null) { super.onBackPressed(); return; }
        web.evaluateJavascript("window.appBack?appBack():'0'", value -> {
            if (value == null || value.contains("0")) finish();
        });
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (web != null) { web.evaluateJavascript("window.appPause&&appPause()", null); web.onPause(); }
        try { if (ttsReady) tts.stop(); } catch (Exception ignored) { }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) { web.onResume(); web.evaluateJavascript("window.appResume&&appResume()", null); }
    }

    @Override
    protected void onDestroy() {
        try { if (tts != null) tts.shutdown(); } catch (Exception ignored) { }
        try { if (recognizer != null) recognizer.destroy(); } catch (Exception ignored) { }
        if (web != null) { web.destroy(); web = null; }
        super.onDestroy();
    }
}
