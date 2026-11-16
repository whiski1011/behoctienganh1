"""Thu sẵn giọng đọc cho toàn bộ câu chữ trong app.
EN: Kokoro (giọng nữ Mỹ af_heart, Apache-2.0)   VI: VieNeu-TTS v3 Turbo (giọng nữ miền Bắc "Mai Anh", Apache-2.0)
Mỗi đoạn được nhận dạng lại bằng Whisper; đoạn nào nghe không khớp sẽ được thu lại, giữ bản tốt nhất.
python3 tools/gen_audio.py phrases.json OUT_AUDIO_DIR OUT_CLIPS_JS"""
import json, sys, os, re, hashlib, difflib, subprocess, time
import numpy as np, soundfile as sf

PH, OUT, CLIPS_JS = sys.argv[1], sys.argv[2], sys.argv[3]
WORK = "/tmp/tts/work"; os.makedirs(WORK, exist_ok=True); os.makedirs(OUT, exist_ok=True)
REPORT = os.path.join(WORK, "report.json")
report = json.load(open(REPORT)) if os.path.exists(REPORT) else {}
phrases = json.load(open(PH))
only = sys.argv[4] if len(sys.argv) > 4 else None  # "en" | "vi"

LN = {"ay": "A", "bee": "B", "see": "C", "dee": "D", "ee": "E", "ef": "F", "jee": "G", "aitch": "H", "eye": "I", "jay": "J", "kay": "K", "el": "L", "em": "M", "en": "N", "oh": "O", "pee": "P", "cue": "Q", "are": "R", "ess": "S", "tee": "T", "you": "U", "vee": "V", "double you": "W", "ex": "X", "why": "Y", "zed": "Z"}
LETTER_RE = re.compile(r"^(" + "|".join(sorted(map(re.escape, LN), key=len, reverse=True)) + r")(?=$| is for |\. )")
NUM_VI = "không một hai ba bốn năm sáu bảy tám chín mười".split()
NUM_EN = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty".split()

def key(p): return hashlib.md5((p["lang"] + "|" + p["text"]).encode()).hexdigest()[:10]
def norm(s, lang):
    s = s.lower()
    nums = NUM_VI if lang == "vi" else NUM_EN
    s = re.sub(r"\b(\d{1,2})\b", lambda m: nums[int(m.group(1))] if int(m.group(1)) < len(nums) else m.group(1), s)
    s = s.replace("t-shirt", "t shirt").replace("rô-bốt", "robot").replace("rô bốt", "robot").replace("’", "'")
    return re.sub(r"[^\w' ]", " ", s).split()
def score(target, hyp, lang, alts=()):
    best = 0
    for t in (target, *alts):
        a, b = norm(t, lang), norm(hyp, lang)
        best = max(best, difflib.SequenceMatcher(None, a, b).ratio())
    return best

def load16(path):
    raw = subprocess.run(["ffmpeg", "-v", "quiet", "-i", path, "-ar", "16000", "-ac", "1", "-f", "f32le", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.float32)
    pad = np.zeros(4800, dtype=np.float32)        # đệm 0,3 s để Whisper bớt "bịa" với đoạn rất ngắn
    return np.concatenate([pad, a, pad])

from faster_whisper import WhisperModel
asr = {}
def transcribe(path, lang):
    name = "/tmp/tts/pho-small" if lang == "vi" else "medium"   # PhoWhisper (VinAI) chấm tiếng Việt
    if name not in asr: asr[name] = WhisperModel(name, device="cpu", compute_type="int8")
    seg, _ = asr[name].transcribe(load16(path), language=lang, beam_size=5, vad_filter=False, condition_on_previous_text=False)
    return " ".join(s.text for s in seg).strip()

def finalize(wav, mp3):
    # cắt khoảng lặng nhẹ nhàng (giữ phụ âm đầu), chuẩn hóa âm lượng, xuất mp3 mono
    a, sr = sf.read(wav); a = a if a.ndim == 1 else a.mean(1)
    env = np.abs(a); thr = 10 ** (-42 / 20) * max(1e-6, env.max())
    idx = np.where(env > thr)[0]
    s0 = max(0, idx[0] - int(0.15 * sr)) if len(idx) else 0
    e0 = min(len(a), idx[-1] + int(0.25 * sr)) if len(idx) else len(a)
    t = wav + ".cut.wav"; sf.write(t, a[s0:e0], sr)
    subprocess.run(["ffmpeg", "-v", "quiet", "-y", "-i", t, "-af", "afade=t=in:d=0.02,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=24000",
                    "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "48k", mp3], check=True)
    os.remove(t)

kok = vn = None
def synth_en(text, attempt, path):
    global kok
    if kok is None:
        from kokoro_onnx import Kokoro
        kok = Kokoro("/tmp/tts/kokoro-v1.0.onnx", "/tmp/tts/voices-v1.0.bin")
    voice, speed, form = [("af_heart", 0.92, 0), ("af_heart", 0.9, 1), ("af_heart", 0.85, 2), ("af_bella", 0.9, 1), ("af_sarah", 0.9, 1), ("af_heart", 1.0, 1)][attempt]
    say = text
    if form and len(text.split()) <= 2 and not re.search(r"[.!?]$", text):
        say = text + "." if form == 1 else text[0].upper() + text[1:] + "!"
    m = LETTER_RE.match(text)
    if m: say = LN[m.group(1)] + text[m.end():]          # đọc tên chữ cái bằng chính chữ cái
    if say.strip() in LN.values(): say = say + "."
    a, sr = kok.create(say, voice=voice, speed=speed, lang="en-us")
    sf.write(path, a, sr)

def synth_vi(text, attempt, path):
    global vn
    if vn is None:
        from vieneu import Vieneu
        vn = Vieneu()
    say = text if re.search(r"[.!?]$", text) else text + "."
    temp = [0.4, 0.5, 0.3, 0.6, 0.45, 0.35][attempt]
    a = vn.infer(say, voice="Mai Anh", temperature=temp)
    vn.save(a, path)

todo = [p for p in phrases if (not only or p["lang"] == only)]
t0 = time.time()
for n, p in enumerate(todo):
    k = key(p); mp3 = os.path.join(OUT, k + ".mp3")
    lang, text = p["lang"], p["text"]
    if k in report and os.path.exists(mp3):
        r0 = report[k]
        if r0.get("judge2") or (lang == "en" and (len(text.split()) > 1 and not LETTER_RE.match(text))):
            continue
        if lang == "vi" and len(text.split()) > 3 and r0.get("judge") == "pho" and r0["score"] >= 0.6: continue
        hyp = transcribe(mp3, lang); sc = score(text, hyp, lang, (LN[LETTER_RE.match(text).group(1)] + text[LETTER_RE.match(text).end():],) if lang == "en" and LETTER_RE.match(text) else ())
        r0.update(score=round(sc, 3), heard=hyp, judge2=True)
        if sc >= 0.6:
            json.dump(report, open(REPORT, "w"), ensure_ascii=False); continue
        print(f"  thu lại: {text!r} (nghe: {hyp!r})", flush=True)
    alts = ()
    m = LETTER_RE.match(text) if lang == "en" else None
    if m: alts = (LN[m.group(1)] + text[m.end():],)
    short = len(text.split()) <= 3
    tries = (6 if short else 4) if lang == "vi" else 2
    accept = 0.67 if short else 0.6
    best = (-1, None, "")
    for at in range(tries):
        wav = os.path.join(WORK, f"{k}_{at}.wav")
        try:
            (synth_en if lang == "en" else synth_vi)(text, at, wav)
        except Exception as e:
            print("synth fail", text, e); continue
        if lang == "en" and not alts and len(text.split()) > 1:
            hyp, sc = "(Kokoro, không cần kiểm)", 1.0   # câu tiếng Anh nhiều từ: Kokoro ổn định
            best = (sc, wav, hyp); break
        hyp = transcribe(wav, lang)
        sc = score(text, hyp, lang, alts)
        if sc > best[0]: best = (sc, wav, hyp)
        if sc >= accept: break
    if best[1] is None: continue
    finalize(best[1], mp3)
    report[k] = {"lang": lang, "text": text, "score": round(best[0], 3), "heard": best[2], "tries": at + 1, "judge": "pho" if lang == "vi" else "whisper"}
    if n % 10 == 0 or lang == "vi":
        json.dump(report, open(REPORT, "w"), ensure_ascii=False)
        el = time.time() - t0
        print(f"[{n+1}/{len(todo)}] {el/60:.1f}m  {lang} {best[0]:.2f} {text!r} -> {best[2]!r}", flush=True)
json.dump(report, open(REPORT, "w"), ensure_ascii=False)

# manifest cho app
clips = {f'{v["lang"]}|{v["text"]}': k for k, v in report.items() if os.path.exists(os.path.join(OUT, k + ".mp3"))}
want = {p["lang"] + "|" + p["text"] for p in phrases}
clips = {k: v for k, v in clips.items() if k in want}
open(CLIPS_JS, "w").write("window.CLIPS=" + json.dumps(clips, ensure_ascii=False, separators=(",", ":")) + ";\n")
low = sorted([v for v in report.values() if v["score"] < 0.8], key=lambda v: v["score"])
print(f"DONE clips={len(clips)}/{len(want)} low={len(low)}")
for v in low[:60]: print(f'  {v["score"]:.2f} {v["lang"]} {v["text"]!r} -> {v["heard"]!r}')
