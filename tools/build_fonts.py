"""Tạo font emoji rút gọn (chỉ các emoji app dùng) + fonts.css"""
import glob, os, re, sys
from fontTools.ttLib import TTFont
from fontTools import subset

WWW = sys.argv[1]
SRC = sys.argv[2]  # thư mục files/ của @fontsource/noto-color-emoji
out_dir = os.path.join(WWW, "fonts")

text = ""
for f in glob.glob(os.path.join(WWW, "js", "*.js")) + glob.glob(os.path.join(WWW, "*.html")):
    text += open(f, encoding="utf-8").read()

def is_emoji_cp(cp):
    if 0x1EA0 <= cp <= 0x1EF9:  # chữ Việt
        return False
    return cp >= 0x2190 or cp in (0x200D, 0xFE0F, 0x20E3, 0xA9, 0xAE)

cps = sorted({ord(c) for c in text if is_emoji_cp(ord(c))})
used_text = "".join(chr(c) for c in cps)
print("emoji codepoints:", len(cps))

for f in glob.glob(os.path.join(out_dir, "emoji-*.woff2")):
    os.remove(f)

faces = []
for i, src in enumerate(sorted(glob.glob(os.path.join(SRC, "noto-color-emoji-*-400-normal.woff2")))):
    font = TTFont(src)
    cmap = font.getBestCmap()
    have = [c for c in cps if c in cmap and c not in (0x200D, 0xFE0F)]
    if not have:
        continue
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.notdef_outline = True
    opts.name_IDs = ["*"]
    s = subset.Subsetter(opts)
    want = set(have) | {0x200D, 0xFE0F, 0x20E3} & set(cmap)
    s.populate(unicodes=sorted(want))
    s.subset(font)
    name = f"emoji-{i}.woff2"
    font.flavor = "woff2"
    font.save(os.path.join(out_dir, name))
    rng = ",".join(f"U+{c:X}" for c in sorted(want))
    faces.append((name, rng))
    print(name, len(have), os.path.getsize(os.path.join(out_dir, name)))

css = []
for w in (600, 800):
    for sub, rng in [
        ("latin", "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"),
        ("latin-ext", "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"),
        ("vietnamese", "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB"),
    ]:
        wr = "100 700" if w == 600 else "800 900"
        css.append(f"@font-face{{font-family:'Baloo 2';font-style:normal;font-display:swap;font-weight:{wr};src:url(baloo-2-{sub}-{w}-normal.woff2) format('woff2');unicode-range:{rng}}}")
for name, rng in faces:
    css.append(f"@font-face{{font-family:'Noto Color Emoji';font-style:normal;font-display:swap;font-weight:100 900;src:url({name}) format('woff2');unicode-range:{rng}}}")
open(os.path.join(out_dir, "fonts.css"), "w").write("\n".join(css) + "\n")
print("faces:", len(faces))
