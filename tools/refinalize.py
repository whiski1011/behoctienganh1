"""Xuất lại mp3 với cách cắt khoảng lặng nhẹ nhàng (giữ phụ âm đầu)."""
import json, os, glob, subprocess, sys, numpy as np, soundfile as sf
WORK="/tmp/tts/work"; OUT=sys.argv[1]
rep=json.load(open(f"{WORK}/report.json"))
def dur(path):
    return float(subprocess.run(["ffprobe","-v","quiet","-show_entries","format=duration","-of","csv=p=0",path],capture_output=True,text=True).stdout or 0)
OLD="silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,areverse"
def old_dur(w):
    o=w+".old.wav"; subprocess.run(["ffmpeg","-v","quiet","-y","-i",w,"-af",OLD,o]); d=dur(o); os.remove(o); return d
def gentle(w, mp3):
    a,sr=sf.read(w); a=a if a.ndim==1 else a.mean(1)
    env=np.abs(a); thr=10**(-42/20)*max(1e-6,env.max())
    idx=np.where(env>thr)[0]
    s=max(0,idx[0]-int(0.15*sr)) if len(idx) else 0; e=min(len(a),idx[-1]+int(0.25*sr)) if len(idx) else len(a)
    t=w+".cut.wav"; sf.write(t,a[s:e],sr)
    subprocess.run(["ffmpeg","-v","quiet","-y","-i",t,"-af","afade=t=in:d=0.02,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=24000","-ac","1","-codec:a","libmp3lame","-b:a","48k",mp3],check=True)
    os.remove(t)
done=0; miss=[]
for k,v in rep.items():
    mp3=f"{OUT}/{k}.mp3"
    takes=sorted(glob.glob(f"{WORK}/{k}_*.wav"))
    if not takes or not os.path.exists(mp3): miss.append(k); continue
    if len(takes)==1: src=takes[0]
    else:
        md=dur(mp3); src=min(takes,key=lambda w: abs(old_dur(w)-md))
    v["src"]=os.path.basename(src)
    gentle(src,mp3); done+=1
json.dump(rep,open(f"{WORK}/report.json","w"),ensure_ascii=False)
print("refinalized",done,"missing",len(miss))
