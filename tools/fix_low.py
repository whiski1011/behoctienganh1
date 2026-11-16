"""Thu thêm vài lượt cho các đoạn còn bị nghe sai; chỉ thay khi có bản được nhận dạng đúng."""
import sys, json, os, re
sys.argv=[sys.argv[0],"/tmp/tts/phrases.json","/home/claude/app/www/audio","/tmp/clips_ignore.js","none"]
src=open("/home/claude/tools/gen_audio.py").read().split("todo = [p for p in phrases")[0]
exec(src)
want={(x["lang"],x["text"]) for x in phrases}
SKIP={"write","ee","tee","see","jee","rô-bốt"}
low=[(k,v) for k,v in report.items() if (v["lang"],v["text"]) in want and v["score"]<0.67 and v["text"] not in SKIP]
from kokoro_onnx import Kokoro
kk=Kokoro("/tmp/tts/kokoro-v1.0.onnx","/tmp/tts/voices-v1.0.bin")
from vieneu import Vieneu
vv=Vieneu()
fixed=0
for k,v in low:
    lang,text=v["lang"],v["text"]; ok=False
    m=LETTER_RE.match(text) if lang=="en" else None
    alts=(LN[m.group(1)]+text[m.end():],) if m else ()
    base=alts[0] if m else text
    cap=base[0].upper()+base[1:]
    if lang=="en":
        vars_=[(cap+".", "af_heart",0.8),(cap+"!", "af_heart",0.85),(cap+".", "af_nova",0.9),(cap+".", "af_sarah",0.85),(cap+".", "af_bella",0.8),(cap+",", "af_heart",0.9)]
    else:
        end="" if re.search(r"[.!?]$",text) else "."
        vars_=[(cap+end,0.2),(cap+end,0.45),(text+end,0.55),(cap+("!" if end else ""),0.3),(cap+end,0.65),(text+end,0.25),(cap+end,0.5),(cap+end,0.35)]
    for i,var in enumerate(vars_):
        wav=f"{WORK}/{k}_x{i}.wav"
        try:
            if lang=="en":
                a,sr=kk.create(var[0],voice=var[1],speed=var[2],lang="en-us"); sf.write(wav,a,sr)
            else:
                vv.save(vv.infer(var[0],voice="Mai Anh",temperature=var[1]),wav)
        except Exception as e: continue
        hyp=transcribe(wav,lang); sc=score(text,hyp,lang,alts)
        if sc>=0.99 or (sc>=0.8 and len(text.split())>3):
            finalize(wav,os.path.join(OUT,k+".mp3")); v.update(score=round(sc,3),heard=hyp,fix=True); ok=True; fixed+=1; break
    print("OK " if ok else "-- ",lang,text,"->",hyp,flush=True)
json.dump(report,open(REPORT,"w"),ensure_ascii=False)
print("fixed",fixed,"of",len(low))
