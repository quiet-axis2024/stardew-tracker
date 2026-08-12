from pathlib import Path


def rep(text, old, new, label):
    if old not in text:
        raise RuntimeError(f"missing patch anchor: {label}")
    return text.replace(old, new, 1)

p = Path('app.jsx')
s = p.read_text(encoding='utf-8')

s = rep(s,
'''      const recognizeWithV58 = async (worker, canvas, whitelist = "") => {
        await worker.setParameters({
          tessedit_pageseg_mode: psm,
''',
'''      const recognizeWithV58 = async (worker, canvas, whitelist = "", mode = psm) => {
        await worker.setParameters({
          tessedit_pageseg_mode: mode,
''', 'recognizer psm override')

start = s.index('      // v58: the exact native 1920×1080 Switch profile line is sensitive to even a')
end_marker = '      const farmRaw = farmBest.text;\n'
end = s.index(end_marker, start) + len(end_marker)
new_block = '''      // v59: only auto-apply fields that are safe to verify from the fixed Switch UI.
      // Player/farm names remain manual: free-form text and symbols are too easy for OCR
      // to hallucinate, and bad guesses should never overwrite a correct name.
      const psmWordV59 = Tesseract.PSM?.SINGLE_WORD || 8;
      const hudMoneyColorV59 = makeCrop(img, 0.890, 0.205, 0.090, 0.050, 8, false);
      const hudMoneyMonoV59 = makeCrop(img, 0.890, 0.205, 0.090, 0.050, 8, 120);
      const panelMoneyV59 = makeCrop(img, 0.608, 0.638, 0.064, 0.060, 8, 110);
      const incomeColorV59 = makeCrop(img, 0.575, 0.695, 0.075, 0.060, 8, false);
      const incomeMonoV59 = makeCrop(img, 0.575, 0.695, 0.075, 0.060, 8, 110);
      const incomeWideV59 = makeCrop(img, 0.570, 0.695, 0.120, 0.060, 6, 110);
      const yearColorV59 = makeCrop(img, 0.533, 0.768, 0.019, 0.050, 8, false);
      const yearMonoV59 = makeCrop(img, 0.533, 0.768, 0.019, 0.050, 8, 110);
      const dayColorV59 = makeCrop(img, 0.615, 0.768, 0.033, 0.050, 8, false);
      const dayMonoV59 = makeCrop(img, 0.615, 0.768, 0.033, 0.050, 8, 110);
      // Exact crop around the two glyphs only (e.g. 夏季). The previous wide crop also
      // contained 年/day text and frequently returned no season, leaving the default 春.
      const seasonColorV59 = makeCrop(img, 0.575, 0.758, 0.035, 0.060, 10, false);
      const seasonMonoV59 = makeCrop(img, 0.575, 0.758, 0.035, 0.060, 10, 100);
      const clockCrop = makeCrop(img, 0.868, 0.139, 0.095, 0.055, 4, 90);

      const numberConsensusV59 = (...values) => {
        const nums = values.filter(v => Number.isFinite(v) && v >= 0);
        if (!nums.length) return null;
        const counts = new Map();
        nums.forEach(v => counts.set(v, (counts.get(v) || 0) + 1));
        const ranked = [...counts.entries()].sort((a,b) => b[1]-a[1]);
        return ranked[0][1] >= 2 ? ranked[0][0] : null;
      };
      const seasonCharV59 = raw => String(raw||"").match(/[春夏秋冬]/u)?.[0] || null;

      setProfileOcrStatus("第一次使用會下載辨識資料；之後會直接使用快取。");
      const engWorker = await makeWorkerV58('eng','數字辨識');
      const moneyHudColorRawV59 = await recognizeWithV58(engWorker, hudMoneyColorV59, "0123456789", psmWordV59);
      const moneyHudMonoRawV59 = await recognizeWithV58(engWorker, hudMoneyMonoV59, "0123456789", psmWordV59);
      const moneyPanelRawV59 = await recognizeWithV58(engWorker, panelMoneyV59, "0123456789,", psmWordV59);
      const incomeColorRawV59 = await recognizeWithV58(engWorker, incomeColorV59, "0123456789,", psmWordV59);
      const incomeMonoRawV59 = await recognizeWithV58(engWorker, incomeMonoV59, "0123456789,", psmWordV59);
      const incomeWideRawV59 = await recognizeWithV58(engWorker, incomeWideV59, "0123456789,", psmWordV59);
      const yearColorRawV59 = await recognizeWithV58(engWorker, yearColorV59, "0123456789", psmWordV59);
      const yearMonoRawV59 = await recognizeWithV58(engWorker, yearMonoV59, "0123456789", psmWordV59);
      const dayColorRawV59 = await recognizeWithV58(engWorker, dayColorV59, "0123456789", psmWordV59);
      const dayMonoRawV59 = await recognizeWithV58(engWorker, dayMonoV59, "0123456789", psmWordV59);
      const clockRaw = await recognizeWithV58(engWorker, clockCrop, "0123456789:：");
      await engWorker.terminate();

      const zhWorker = await makeWorkerV58('chi_sim','季節辨識');
      const seasonColorRawV59 = await recognizeWithV58(zhWorker, seasonColorV59, "", psmWordV59);
      const seasonMonoRawV59 = await recognizeWithV58(zhWorker, seasonMonoV59, "", psmWordV59);
      await zhWorker.terminate();

      const moneyRaw = [moneyHudColorRawV59,moneyHudMonoRawV59,moneyPanelRawV59].join(' | ');
      const incomeRaw = [incomeColorRawV59,incomeMonoRawV59,incomeWideRawV59].join(' | ');
      const yearRaw = [yearColorRawV59,yearMonoRawV59].join(' | ');
      const dayRaw = [dayColorRawV59,dayMonoRawV59].join(' | ');
      const seasonRaw = [seasonColorRawV59,seasonMonoRawV59].join(' | ');

      const moneyConsensusV59 = numberConsensusV59(
        digitsOnly(moneyHudColorRawV59),
        digitsOnly(moneyHudMonoRawV59),
        parseOcrNumberV58(moneyPanelRawV59)
      );
      const incomeConsensusV59 = numberConsensusV59(
        parseOcrNumberV58(incomeColorRawV59),
        parseOcrNumberV58(incomeMonoRawV59),
        parseOcrNumberV58(incomeWideRawV59)
      );
      const yearConsensusV59 = numberConsensusV59(digitsOnly(yearColorRawV59), digitsOnly(yearMonoRawV59));
      const dayConsensusV59 = numberConsensusV59(digitsOnly(dayColorRawV59), digitsOnly(dayMonoRawV59));
      const seasonA59 = seasonCharV59(seasonColorRawV59);
      const seasonB59 = seasonCharV59(seasonMonoRawV59);
      const seasonConsensusV59 = seasonA59 && seasonB59 ? (seasonA59 === seasonB59 ? seasonA59 : null) : (seasonA59 || seasonB59);

      const farmerRaw = "";
      const farmRaw = "";
'''
s = s[:start] + new_block + s[end:]

s = rep(s,
'''      const currentMoney = parseOcrNumberV58(moneyRaw);
      const totalIncome = parseOcrNumberV58(incomeRaw);
      let year = digitsOnly(yearRaw);
      let day = digitsOnly(dayRaw);
      const seasonMatch = String(seasonRaw||"").match(/[春夏秋冬]/u);
      let season = seasonMatch ? seasonMatch[0] : null;
''',
'''      const currentMoney = moneyConsensusV59;
      const totalIncome = incomeConsensusV59;
      let year = yearConsensusV59;
      let day = dayConsensusV59;
      let season = seasonConsensusV59;
''', 'safe consensus values')

s = rep(s,
'''      if (farmerName && farmerName.length >= 2) { patch.name = farmerName; updated.push("農夫名字"); }
      if (farmName && farmName.length >= 2) { patch.farm = farmName; updated.push("農場名"); }
''',
'''      // v59: screenshot upload no longer overwrites player/farm names.
''', 'do not overwrite names')

s = rep(s,
'''      setProfileOcrResult({
        farmerRaw, farmRaw, moneyRaw, incomeRaw, yearRaw, seasonRaw, dayRaw, clockRaw, applied:patch,
        farmerColor: farmerZhResult.text, farmerMono: farmerEngResult.text,
        farmColor: farmZhResult.text, farmMono: farmEngResult.text
      });
''',
'''      setProfileOcrResult({
        farmerRaw, farmRaw, moneyRaw, incomeRaw, yearRaw, seasonRaw, dayRaw, clockRaw, applied:patch,
        moneyHudColorRawV59, moneyHudMonoRawV59, moneyPanelRawV59,
        incomeColorRawV59, incomeMonoRawV59, incomeWideRawV59,
        seasonColorRawV59, seasonMonoRawV59
      });
''', 'debug payload')

s = rep(s,
'''      setProfileOcrStatus(updated.length ? `✓ 已從截圖更新：${updated.join("、")}` : "⚠ 已更新角色圖，但沒有可靠辨識到資料欄位");
''',
'''      const skippedV59 = [];
      if (currentMoney === null) skippedV59.push("目前金錢");
      if (totalIncome === null) skippedV59.push("累計收入");
      if (!year) skippedV59.push("年份");
      if (!season) skippedV59.push("季節");
      if (!day) skippedV59.push("日期");
      setProfileOcrStatus(updated.length
        ? `✓ 已更新：${updated.join("、")}${skippedV59.length ? `；未可靠辨識：${skippedV59.join("、")}（未覆蓋原值）` : ""}`
        : "⚠ 沒有欄位通過一致性檢查；只更新角色圖，原資料未覆蓋");
''', 'status detail')

s = rep(s,
'''{profileOcrStatus&&<div style={{fontSize:7.5,color:profileOcrStatus.startsWith("⚠")?C.red:C.green,fontWeight:850,lineHeight:1.25,marginTop:3}}>{profileOcrStatus.startsWith("✓")?"✓ 已更新資料":profileOcrStatus}</div>}
''',
'''{profileOcrStatus&&<div style={{fontSize:7.5,color:profileOcrStatus.startsWith("⚠")?C.red:C.green,fontWeight:850,lineHeight:1.25,marginTop:3}}>{profileOcrStatus}</div>}
''', 'show OCR status')

p.write_text(s, encoding='utf-8')

p = Path('index.html')
s = p.read_text(encoding='utf-8').replace('?v=58', '?v=59').replace('deploy-v58', 'deploy-v59')
p.write_text(s, encoding='utf-8')

p = Path('sw.js')
s = p.read_text(encoding='utf-8').replace('stardew-tracker-v58', 'stardew-tracker-v59')
p.write_text(s, encoding='utf-8')
