from pathlib import Path


def rep(text, old, new, label):
    if old not in text:
        raise RuntimeError(f"missing patch anchor: {label}")
    return text.replace(old, new, 1)

p = Path('app.jsx')
s = p.read_text(encoding='utf-8')

s = rep(s,
'''  const makeCrop = (img, x, y, w, h, scale = 3, threshold = true) => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.width * w * scale));
    canvas.height = Math.max(1, Math.round(img.height * h * scale));
    const ctx = canvas.getContext("2d", { willReadFrequently:true });
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, img.width*x, img.height*y, img.width*w, img.height*h, 0,0,canvas.width,canvas.height);
    if (threshold) {
      const im = ctx.getImageData(0,0,canvas.width,canvas.height);
      for (let i=0;i<im.data.length;i+=4) {
        const lum = im.data[i]*0.299 + im.data[i+1]*0.587 + im.data[i+2]*0.114;
        const v = lum < 165 ? 0 : 255;
        im.data[i]=im.data[i+1]=im.data[i+2]=v;
      }
      ctx.putImageData(im,0,0);
    }
    return canvas;
  };''',
'''  const makeCrop = (img, x, y, w, h, scale = 3, threshold = true) => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.width * w * scale));
    canvas.height = Math.max(1, Math.round(img.height * h * scale));
    const ctx = canvas.getContext("2d", { willReadFrequently:true });
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, img.width*x, img.height*y, img.width*w, img.height*h, 0,0,canvas.width,canvas.height);
    if (threshold) {
      // v57: the Switch profile screen uses several different brown/orange backgrounds.
      // A fixed 165 cutoff destroys the HUD and pixel-font strokes, so each crop can
      // now provide a calibrated luminance cutoff (boolean true keeps the old default).
      const cutoff = typeof threshold === "number" ? threshold : 165;
      const im = ctx.getImageData(0,0,canvas.width,canvas.height);
      for (let i=0;i<im.data.length;i+=4) {
        const lum = im.data[i]*0.299 + im.data[i+1]*0.587 + im.data[i+2]*0.114;
        const v = lum < cutoff ? 0 : 255;
        im.data[i]=im.data[i+1]=im.data[i+2]=v;
      }
      ctx.putImageData(im,0,0);
    }
    return canvas;
  };''', 'calibrated threshold')

s = rep(s,
'''      const bestNameResult = (...results) => results
        .map(r => ({...r, text: cleanNameCandidate(r.text)}))
        .filter(r => r.text)
        .sort((a,b) => nameScore(b) - nameScore(a))[0] || {text:"", confidence:0};
''',
'''      const bestNameResult = (...results) => results
        .map(r => ({...r, text: cleanNameCandidate(r.text)}))
        .filter(r => r.text)
        .sort((a,b) => nameScore(b) - nameScore(a))[0] || {text:"", confidence:0};
      const bestFarmNameResultV57 = (...results) => results
        .map(r => ({...r, text: cleanNameCandidate(r.text)}))
        .filter(r => r.text)
        .sort((a,b) => {
          // The right side of this line contains the fixed 農場/农场 suffix. If one
          // OCR pass can actually see it, prefer that pass over an English-looking
          // hallucination with a superficially higher confidence score.
          const bonus = r => /(?:農場|农场)/u.test(r.text) ? 100 : 0;
          return (bonus(b)+nameScore(b)) - (bonus(a)+nameScore(a));
        })[0] || {text:"", confidence:0};
''', 'farm result scoring')

s = rep(s,
'''      // Switch 16:9 玩家資料頁固定比例裁切。v48 改成窄欄位，避免標籤／邊框被 OCR 當成數字。
      const farmerCropColor = makeCrop(img, 0.285, 0.783, 0.130, 0.055, 6, false);
      const farmerCropMono = makeCrop(img, 0.285, 0.783, 0.130, 0.055, 6, true);
      const farmCropColor = makeCrop(img, 0.480, 0.568, 0.230, 0.055, 5, false);
      const farmCropMono = makeCrop(img, 0.480, 0.568, 0.230, 0.055, 5, true);
      // 目前金錢改讀右上 HUD 的純數字，避免「目前持有現金」字樣造成假數字。
      const hudMoneyCrop = makeCrop(img, 0.890, 0.198, 0.100, 0.070, 4, true);
      const incomeCrop = makeCrop(img, 0.582, 0.704, 0.090, 0.045, 5, true);
      const yearCrop = makeCrop(img, 0.533, 0.768, 0.019, 0.050, 6, true);
      const seasonCrop = makeCrop(img, 0.575, 0.768, 0.040, 0.050, 5, false);
      const dayCrop = makeCrop(img, 0.615, 0.768, 0.033, 0.050, 6, true);
      const clockCrop = makeCrop(img, 0.868, 0.139, 0.095, 0.055, 4, true);
''',
'''      // v57: recalibrated against a native 1920×1080 Switch profile screenshot.
      // 110 keeps the dark pixel-font strokes intact on the peach profile panel.
      const farmerCropColor = makeCrop(img, 0.285, 0.783, 0.130, 0.055, 6, false);
      const farmerCropMono = makeCrop(img, 0.285, 0.783, 0.130, 0.055, 6, 110);
      const farmCropColor = makeCrop(img, 0.480, 0.568, 0.230, 0.055, 6, false);
      const farmCropMono = makeCrop(img, 0.480, 0.568, 0.230, 0.055, 6, 110);
      // Read the value itself from the profile panel. The former HUD crop was fully
      // black after thresholding on this UI theme and could collapse 83,796 into 0.
      const panelMoneyCrop = makeCrop(img, 0.610, 0.638, 0.130, 0.060, 5, 110);
      // v48's income crop started too far right and literally cut off the leading 8
      // in 824,693. Keep the entire numeric value in frame.
      const incomeCrop = makeCrop(img, 0.570, 0.695, 0.150, 0.060, 5, 110);
      const yearCrop = makeCrop(img, 0.533, 0.768, 0.019, 0.050, 6, 110);
      const seasonCrop = makeCrop(img, 0.575, 0.768, 0.040, 0.050, 6, 100);
      const dayCrop = makeCrop(img, 0.615, 0.768, 0.033, 0.050, 6, 110);
      // The clock sits on a darker panel; a lower cutoff preserves 06:00.
      const clockCrop = makeCrop(img, 0.868, 0.139, 0.095, 0.055, 4, 90);
''', 'profile crop calibration')

s = rep(s,
'''      const farmBest = bestNameResult(farmColorResult, farmMonoResult);
''',
'''      const farmBest = bestFarmNameResultV57(farmMonoResult, farmColorResult);
''', 'farm best result')

s = rep(s,
'''      const moneyRaw = await recognize(hudMoneyCrop, "0123456789");
      const incomeRaw = await recognize(incomeCrop, "0123456789,");
      const yearRaw = await recognize(yearCrop, "0123456789");
      const seasonRaw = await recognize(seasonCrop, "");
      const dayRaw = await recognize(dayCrop, "0123456789");
''',
'''      const moneyRaw = await recognize(panelMoneyCrop, "0123456789,");
      const incomeRaw = await recognize(incomeCrop, "0123456789,");
      const yearRaw = await recognize(yearCrop, "0123456789");
      const seasonRaw = await recognize(seasonCrop, "春夏秋冬季");
      const dayRaw = await recognize(dayCrop, "0123456789");
''', 'numeric and season recognition')

p.write_text(s, encoding='utf-8')

# Bust both GitHub Pages and Cloudflare Pages caches.
p = Path('index.html')
s = p.read_text(encoding='utf-8').replace('?v=56', '?v=57').replace('deploy-v56', 'deploy-v57')
p.write_text(s, encoding='utf-8')

p = Path('sw.js')
s = p.read_text(encoding='utf-8').replace('stardew-tracker-v56', 'stardew-tracker-v57')
p.write_text(s, encoding='utf-8')
