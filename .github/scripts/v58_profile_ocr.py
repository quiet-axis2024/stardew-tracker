from pathlib import Path


def rep(text, old, new, label):
    if old not in text:
        raise RuntimeError(f"missing patch anchor: {label}")
    return text.replace(old, new, 1)

p = Path('app.jsx')
s = p.read_text(encoding='utf-8')

s = rep(s,
'''  const digitsOnly = (text) => {
    const d = String(text||"").replace(/[^0-9]/g,"");
    return d ? Number(d) : null;
  };
''',
'''  const digitsOnly = (text) => {
    const d = String(text||"").replace(/[^0-9]/g,"");
    return d ? Number(d) : null;
  };
  const parseOcrNumberV58 = (text) => {
    const compact=String(text||"").replace(/\\s+/g,"");
    // If OCR sees the trailing 金 as an extra digit, keep the valid comma-grouped
    // number first (e.g. 83,7965 -> 83,796). Fall back to plain digits otherwise.
    const grouped=compact.match(/\\d{1,3}(?:,\\d{3})+/);
    return grouped ? Number(grouped[0].replace(/,/g,"")) : digitsOnly(compact);
  };
''', 'number parser')

old_worker='''      const Tesseract = await loadTesseract();
      setProfileOcrStatus("第一次會下載中文／英文辨識資料，請稍候…");
      const worker = await Tesseract.createWorker(['eng','chi_sim','chi_tra'], 1, {
        logger: m => {
          if (m?.status === 'recognizing text' && Number.isFinite(m.progress)) {
            setProfileOcrStatus(`辨識玩家資料… ${Math.round(m.progress*100)}%`);
          }
        }
      });

      const psm = Tesseract.PSM?.SINGLE_LINE || 7;
      const recognize = async (canvas, whitelist = "") => {
        await worker.setParameters({
          tessedit_pageseg_mode: psm,
          preserve_interword_spaces: '1',
          tessedit_char_whitelist: whitelist,
          user_defined_dpi: '300'
        });
        const result = await worker.recognize(canvas);
        return cleanOcrLine(result?.data?.text);
      };


      const recognizeDetailed = async (canvas, whitelist = "") => {
        await worker.setParameters({
          tessedit_pageseg_mode: psm,
          preserve_interword_spaces: '1',
          tessedit_char_whitelist: whitelist,
          user_defined_dpi: '300'
        });
        const result = await worker.recognize(canvas);
        return {
          text: cleanOcrLine(result?.data?.text),
          confidence: Number(result?.data?.confidence || 0)
        };
      };
'''
new_worker='''      const Tesseract = await loadTesseract();
      const ocrStageV58 = status => ({
        'loading tesseract core':'載入 OCR 核心',
        'initializing tesseract':'初始化 OCR',
        'loading language traineddata':'下載／讀取語言資料',
        'initializing api':'初始化語言模型',
        'recognizing text':'辨識文字'
      }[status]||status||'處理中');
      const makeWorkerV58 = async (langs,label) => Tesseract.createWorker(langs, 1, {
        logger: m => {
          const pct=Number.isFinite(m?.progress)?` ${Math.round(m.progress*100)}%`:'';
          if(m?.status)setProfileOcrStatus(`${label} · ${ocrStageV58(m.status)}${pct}`);
        }
      });
      const psm = Tesseract.PSM?.SINGLE_LINE || 7;
      const recognizeWithV58 = async (worker, canvas, whitelist = "") => {
        await worker.setParameters({
          tessedit_pageseg_mode: psm,
          preserve_interword_spaces: '1',
          tessedit_char_whitelist: whitelist,
          user_defined_dpi: '300'
        });
        const result = await worker.recognize(canvas);
        return cleanOcrLine(result?.data?.text);
      };
      const recognizeDetailedWithV58 = async (worker, canvas, whitelist = "") => {
        await worker.setParameters({
          tessedit_pageseg_mode: psm,
          preserve_interword_spaces: '1',
          tessedit_char_whitelist: whitelist,
          user_defined_dpi: '300'
        });
        const result = await worker.recognize(canvas);
        return {text:cleanOcrLine(result?.data?.text),confidence:Number(result?.data?.confidence||0)};
      };
'''
s = rep(s, old_worker, new_worker, 'split OCR workers')

s = rep(s,
'''      const normalizeSpecials = (text) => cleanOcrLine(text)
        .replace(/\\(\\s*[Rr]\\s*\\)|（\\s*[Rr]\\s*）|\\[\\s*[Rr]\\s*\\]/g, "®")
        .replace(/\\(\\s*[Cc]\\s*\\)|（\\s*[Cc]\\s*）|\\[\\s*[Cc]\\s*\\]/g, "©")
        .replace(/[•∙⋅]/g, "·");
''',
'''      const normalizeSpecials = (text) => cleanOcrLine(text)
        .replace(/\\(\\s*[Rr]\\s*\\)|（\\s*[Rr]\\s*）|\\[\\s*[Rr]\\s*\\]/g, "®")
        .replace(/\\(\\s*[Cc]\\s*\\)|（\\s*[Cc]\\s*）|\\[\\s*[Cc]\\s*\\]/g, "©")
        .replace(/[•∙⋅*]/g, "·");
''', 'middle dot normalization')

old_best='''      const bestFarmNameResultV57 = (...results) => results
        .map(r => ({...r, text: cleanNameCandidate(r.text)}))
        .filter(r => r.text)
        .sort((a,b) => {
          // The right side of this line contains the fixed 農場/农场 suffix. If one
          // OCR pass can actually see it, prefer that pass over an English-looking
          // hallucination with a superficially higher confidence score.
          const bonus = r => /(?:農場|农场)/u.test(r.text) ? 100 : 0;
          return (bonus(b)+nameScore(b)) - (bonus(a)+nameScore(a));
        })[0] || {text:"", confidence:0};

      // v57: recalibrated against a native 1920×1080 Switch profile screenshot.
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

      setProfileOcrStatus("辨識農夫與農場名稱…");
      // 遊戲像素字體的小型 ® / © / · 很容易在黑白化後消失，因此名稱各跑彩色與黑白兩次。
      const farmerColorResult = await recognizeDetailed(farmerCropColor, "");
      const farmerMonoResult = await recognizeDetailed(farmerCropMono, "");
      const farmColorResult = await recognizeDetailed(farmCropColor, "");
      const farmMonoResult = await recognizeDetailed(farmCropMono, "");
      const farmerBest = bestNameResult(farmerColorResult, farmerMonoResult);
      const farmBest = bestFarmNameResultV57(farmMonoResult, farmColorResult);
      const farmerRaw = farmerBest.text;
      const farmRaw = farmBest.text;
      setProfileOcrStatus("辨識金錢與日期…");
      const moneyRaw = await recognize(panelMoneyCrop, "0123456789,");
      const incomeRaw = await recognize(incomeCrop, "0123456789,");
      const yearRaw = await recognize(yearCrop, "0123456789");
      const seasonRaw = await recognize(seasonCrop, "春夏秋冬季");
      const dayRaw = await recognize(dayCrop, "0123456789");
      const clockRaw = await recognize(clockCrop, "0123456789:：");
      await worker.terminate();
'''
new_best='''      // v58: the exact native 1920×1080 Switch profile line is sensitive to even a
      // 1 px vertical shift. These crops were recalibrated from the actual screenshot.
      const farmerCropColor = makeCrop(img, 0.285, 0.780, 0.130, 0.060, 8, false);
      const farmerCropMono = makeCrop(img, 0.285, 0.780, 0.130, 0.060, 8, 90);
      // Keep the Latin/symbol farm-name portion only; including the fixed 農場/农场
      // suffix makes Tesseract hallucinate digits/letters into otherwise-correct names.
      const farmCropColor = makeCrop(img, 0.480, 0.565, 0.142, 0.060, 8, false);
      const farmCropMono = makeCrop(img, 0.480, 0.565, 0.142, 0.060, 8, 90);
      const farmCropWideV58 = makeCrop(img, 0.480, 0.565, 0.180, 0.060, 8, 90);
      // Start slightly farther left and stop before 金. This reads 83,796 rather than
      // 83,796 + a hallucinated trailing 5 from the 金 glyph.
      const panelMoneyCrop = makeCrop(img, 0.600, 0.638, 0.110, 0.060, 6, 110);
      const incomeCrop = makeCrop(img, 0.570, 0.695, 0.150, 0.060, 5, 110);
      const yearCrop = makeCrop(img, 0.533, 0.768, 0.019, 0.050, 6, 110);
      // Include the full two-glyph season word (e.g. 夏季), not only a narrow slice.
      const seasonCrop = makeCrop(img, 0.565, 0.760, 0.060, 0.065, 8, 100);
      const dayCrop = makeCrop(img, 0.615, 0.768, 0.033, 0.050, 6, 110);
      const clockCrop = makeCrop(img, 0.868, 0.139, 0.095, 0.055, 4, 90);

      setProfileOcrStatus("第一次使用會下載辨識資料；之後會直接使用快取。");
      const engWorker = await makeWorkerV58('eng','英文／數字辨識');
      const nameWhitelistV58 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789®©·・._@☆★♡♥♪♫~～*+- ";
      const farmerEngResult = await recognizeDetailedWithV58(engWorker, farmerCropMono, nameWhitelistV58);
      const farmEngResult = await recognizeDetailedWithV58(engWorker, farmCropMono, nameWhitelistV58);
      const moneyRaw = await recognizeWithV58(engWorker, panelMoneyCrop, "0123456789,");
      const incomeRaw = await recognizeWithV58(engWorker, incomeCrop, "0123456789,");
      const yearRaw = await recognizeWithV58(engWorker, yearCrop, "0123456789");
      const dayRaw = await recognizeWithV58(engWorker, dayCrop, "0123456789");
      const clockRaw = await recognizeWithV58(engWorker, clockCrop, "0123456789:：");
      await engWorker.terminate();

      // Chinese is only needed for the season and as a fallback for CJK player/farm names.
      // Keeping it out of the Latin-name pass prevents RaKi/JUta/4410-style hallucinations.
      const zhWorker = await makeWorkerV58(['chi_sim','chi_tra'],'中文辨識');
      const seasonRaw = await recognizeWithV58(zhWorker, seasonCrop, "春夏秋冬季");
      const farmerZhResult = await recognizeDetailedWithV58(zhWorker, farmerCropColor, "");
      const farmZhResult = await recognizeDetailedWithV58(zhWorker, farmCropWideV58, "");
      await zhWorker.terminate();

      const hasUsefulLatinV58 = r => (cleanNameCandidate(r?.text||"").match(/[A-Za-z]/g)||[]).length >= 2;
      const farmerBest = hasUsefulLatinV58(farmerEngResult) ? farmerEngResult : bestNameResult(farmerZhResult, farmerEngResult);
      const farmBest = hasUsefulLatinV58(farmEngResult) ? farmEngResult : bestNameResult(farmZhResult, farmEngResult);
      const farmerRaw = farmerBest.text;
      const farmRaw = farmBest.text;
'''
s = rep(s, old_best, new_best, 'recalibrated OCR fields')

s = rep(s,
'''      const currentMoney = digitsOnly(moneyRaw);
      const totalIncome = digitsOnly(incomeRaw);
''',
'''      const currentMoney = parseOcrNumberV58(moneyRaw);
      const totalIncome = parseOcrNumberV58(incomeRaw);
''', 'grouped number parsing')

# Slightly stricter cleanup for OCR-only farm punctuation while preserving legal symbols.
s = rep(s,
'''      farmName = farmName.replace(/\\s+\\+\\s+/g, " · ").replace(/\\s+/g, " ").trim();
''',
'''      farmName = farmName.replace(/\\s+\\+\\s+/g, " · ").replace(/\\s+/g, " ").replace(/[.。]+$/u, "").trim();
''', 'farm punctuation cleanup')

p.write_text(s, encoding='utf-8')

p = Path('index.html')
s = p.read_text(encoding='utf-8').replace('?v=57', '?v=58').replace('deploy-v57', 'deploy-v58')
p.write_text(s, encoding='utf-8')

p = Path('sw.js')
s = p.read_text(encoding='utf-8').replace('stardew-tracker-v57', 'stardew-tracker-v58')
p.write_text(s, encoding='utf-8')
