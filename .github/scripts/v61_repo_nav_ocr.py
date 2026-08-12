from pathlib import Path


def rep(text, old, new, label):
    if old not in text:
        raise RuntimeError(f"missing patch anchor: {label}")
    return text.replace(old, new, 1)

p = Path('app.jsx')
s = p.read_text(encoding='utf-8')

s = rep(s,
'''const TABS = [
  { id: "overview", name: "總覽", icon: "🏡", file: TAB_ICON_FILES.overview },
  { id: "data", name: "資料", icon: "⭐", file: TAB_ICON_FILES.skills },
  { id: "people", name: "社交", icon: "💛", file: TAB_ICON_FILES.people },
  { id: "fishing", name: "查找", icon: "🔎", file: "Magnifying Glass" },
  { id: "wardrobe", name: "衣櫥", icon: "🎩", file: "Deluxe Cowboy Hat" },
  { id: "notes", name: "備註", icon: "📝", file: "Journal Scrap" },
];''',
'''const TABS = [
  // v61: all six bottom tabs use transparent in-game item icons. The old first three
  // used framed menu-tab art, which made them visually much heavier than Search/Wardrobe/Notes.
  { id: "overview", name: "總覽", icon: "🏡", file: "Stardrop" },
  { id: "data", name: "資料", icon: "⭐", file: "Book Of Stars" },
  { id: "people", name: "社交", icon: "💛", file: "Bouquet" },
  { id: "fishing", name: "查找", icon: "🔎", file: "Magnifying Glass" },
  { id: "wardrobe", name: "衣櫥", icon: "🎩", file: "Deluxe Cowboy Hat" },
  { id: "notes", name: "備註", icon: "📝", file: "Journal Scrap" },
];''', 'bottom nav icons')

s = rep(s,
'''      const psmWordV59 = Tesseract.PSM?.SINGLE_WORD || 8;
      const hudMoneyColorV59 = makeCrop(img, 0.890, 0.205, 0.090, 0.050, 8, false);''',
'''      const psmWordV59 = Tesseract.PSM?.SINGLE_WORD || 8;
      // Names are convenient to prefill even when imperfect, so v61 restores them as
      // editable OCR suggestions. Numeric/date fields keep the conservative v60 rules.
      const farmerCropColorV61 = makeCrop(img, 0.285, 0.780, 0.130, 0.060, 8, false);
      const farmerCropMonoV61 = makeCrop(img, 0.285, 0.780, 0.130, 0.060, 8, 90);
      const farmCropColorV61 = makeCrop(img, 0.480, 0.565, 0.180, 0.060, 8, false);
      const farmCropMonoV61 = makeCrop(img, 0.480, 0.565, 0.180, 0.060, 8, 90);
      const hudMoneyColorV59 = makeCrop(img, 0.890, 0.205, 0.090, 0.050, 8, false);''', 'name crops')

s = rep(s,
'''      const engWorker = await makeWorkerV58('eng','數字辨識');
      const moneyHudColorRawV59 = await recognizeWithV58(engWorker, hudMoneyColorV59, "0123456789", psmWordV59);''',
'''      const engWorker = await makeWorkerV58('eng','英文／數字辨識');
      const nameWhitelistV61 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789®©·・._@☆★♡♥♪♫~～*+- ";
      const farmerEngResultV61 = await recognizeDetailedWithV58(engWorker, farmerCropMonoV61, nameWhitelistV61);
      const farmEngResultV61 = await recognizeDetailedWithV58(engWorker, farmCropMonoV61, nameWhitelistV61);
      const moneyHudColorRawV59 = await recognizeWithV58(engWorker, hudMoneyColorV59, "0123456789", psmWordV59);''', 'English name OCR')

s = rep(s,
'''      const zhWorker = await makeWorkerV58('chi_sim','季節辨識');
      const seasonColorRawV59 = await recognizeWithV58(zhWorker, seasonColorV59, "", psmWordV59);
      const seasonMonoRawV59 = await recognizeWithV58(zhWorker, seasonMonoV59, "", psmWordV59);
      await zhWorker.terminate();''',
'''      const zhWorker = await makeWorkerV58('chi_sim','中文／季節辨識');
      const seasonColorRawV59 = await recognizeWithV58(zhWorker, seasonColorV59, "", psmWordV59);
      const seasonMonoRawV59 = await recognizeWithV58(zhWorker, seasonMonoV59, "", psmWordV59);
      const farmerZhResultV61 = await recognizeDetailedWithV58(zhWorker, farmerCropColorV61, "");
      const farmZhResultV61 = await recognizeDetailedWithV58(zhWorker, farmCropColorV61, "");
      await zhWorker.terminate();''', 'Chinese name OCR')

s = rep(s,
'''      const farmerRaw = "";
      const farmRaw = "";
''',
'''      const farmerBestV61 = bestNameResult(farmerEngResultV61, farmerZhResultV61);
      const farmBestV61 = bestNameResult(farmEngResultV61, farmZhResultV61);
      const farmerRaw = farmerBestV61.text;
      const farmRaw = farmBestV61.text;
''', 'name result selection')

s = rep(s,
'''      const patch = {};
      const updated = [];
      // v59: screenshot upload no longer overwrites player/farm names.
      if (year && year >= 1 && year <= 99) { patch.year = year; updated.push("年份"); }''',
'''      const patch = {};
      const updated = [];
      // Names are best-effort convenience fields. They remain directly editable below.
      if (farmerName && farmerName.length >= 2) { patch.name = farmerName; updated.push("農夫名字"); }
      if (farmName && farmName.length >= 2) { patch.farm = farmName; updated.push("農場名"); }
      if (year && year >= 1 && year <= 99) { patch.year = year; updated.push("年份"); }''', 'restore name writes')

s = rep(s,
'''        seasonColorRawV59, seasonMonoRawV59,
        hudDayColorRawV60, hudDayMonoRawV60
      });''',
'''        seasonColorRawV59, seasonMonoRawV59,
        hudDayColorRawV60, hudDayMonoRawV60,
        farmerEngRawV61:farmerEngResultV61.text, farmerZhRawV61:farmerZhResultV61.text,
        farmEngRawV61:farmEngResultV61.text, farmZhRawV61:farmZhResultV61.text
      });''', 'name debug payload')

p.write_text(s, encoding='utf-8')

p = Path('index.html')
s = p.read_text(encoding='utf-8').replace('?v=60', '?v=61').replace('deploy-v60', 'deploy-v61')
p.write_text(s, encoding='utf-8')

p = Path('sw.js')
s = p.read_text(encoding='utf-8').replace('stardew-tracker-v60', 'stardew-tracker-v61')
p.write_text(s, encoding='utf-8')
