from pathlib import Path


def rep(text, old, new, label):
    if old not in text:
        raise RuntimeError(f"missing patch anchor: {label}")
    return text.replace(old, new, 1)

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

s=rep(s,
'''      const dayColorV59 = makeCrop(img, 0.615, 0.768, 0.033, 0.050, 8, false);
      const dayMonoV59 = makeCrop(img, 0.615, 0.768, 0.033, 0.050, 8, 110);
''',
'''      const dayColorV59 = makeCrop(img, 0.615, 0.768, 0.033, 0.050, 8, false);
      const dayMonoV59 = makeCrop(img, 0.615, 0.768, 0.033, 0.050, 8, 110);
      // Cross-check the profile date against the large day number in the HUD.
      const hudDayColorV60 = makeCrop(img, 0.882, 0.018, 0.018, 0.050, 10, false);
      const hudDayMonoV60 = makeCrop(img, 0.882, 0.018, 0.018, 0.050, 10, 120);
''', 'hud day crops')

s=rep(s,
'''      const dayColorRawV59 = await recognizeWithV58(engWorker, dayColorV59, "0123456789", psmWordV59);
      const dayMonoRawV59 = await recognizeWithV58(engWorker, dayMonoV59, "0123456789", psmWordV59);
      const clockRaw = await recognizeWithV58(engWorker, clockCrop, "0123456789:：");
''',
'''      const dayColorRawV59 = await recognizeWithV58(engWorker, dayColorV59, "0123456789", psmWordV59);
      const dayMonoRawV59 = await recognizeWithV58(engWorker, dayMonoV59, "0123456789", psmWordV59);
      const hudDayColorRawV60 = await recognizeWithV58(engWorker, hudDayColorV60, "0123456789", psmWordV59);
      const hudDayMonoRawV60 = await recognizeWithV58(engWorker, hudDayMonoV60, "0123456789", psmWordV59);
      const clockRaw = await recognizeWithV58(engWorker, clockCrop, "0123456789:：");
''', 'hud day OCR')

s=rep(s,
'''      const dayRaw = [dayColorRawV59,dayMonoRawV59].join(' | ');
''',
'''      const dayRaw = [dayColorRawV59,dayMonoRawV59,hudDayColorRawV60,hudDayMonoRawV60].join(' | ');
''', 'day debug')

s=rep(s,
'''      const yearConsensusV59 = numberConsensusV59(digitsOnly(yearColorRawV59), digitsOnly(yearMonoRawV59));
      const dayConsensusV59 = numberConsensusV59(digitsOnly(dayColorRawV59), digitsOnly(dayMonoRawV59));
      const seasonA59 = seasonCharV59(seasonColorRawV59);
      const seasonB59 = seasonCharV59(seasonMonoRawV59);
      const seasonConsensusV59 = seasonA59 && seasonB59 ? (seasonA59 === seasonB59 ? seasonA59 : null) : (seasonA59 || seasonB59);
''',
'''      const yearConsensusV59 = numberConsensusV59(digitsOnly(yearColorRawV59), digitsOnly(yearMonoRawV59));
      const profileDayV60 = numberConsensusV59(digitsOnly(dayColorRawV59), digitsOnly(dayMonoRawV59));
      const hudDayV60 = numberConsensusV59(digitsOnly(hudDayColorRawV60), digitsOnly(hudDayMonoRawV60));
      const dayConsensusV59 = profileDayV60 !== null && hudDayV60 !== null && profileDayV60 === hudDayV60 ? profileDayV60 : null;
      const seasonA59 = seasonCharV59(seasonColorRawV59);
      const seasonB59 = seasonCharV59(seasonMonoRawV59);
      // Season is only written when both preprocessing passes independently agree.
      const seasonConsensusV59 = seasonA59 && seasonB59 && seasonA59 === seasonB59 ? seasonA59 : null;
''', 'strict date and season consensus')

s=rep(s,
'''        incomeColorRawV59, incomeMonoRawV59, incomeWideRawV59,
        seasonColorRawV59, seasonMonoRawV59
''',
'''        incomeColorRawV59, incomeMonoRawV59, incomeWideRawV59,
        seasonColorRawV59, seasonMonoRawV59,
        hudDayColorRawV60, hudDayMonoRawV60
''', 'debug payload day')

p.write_text(s,encoding='utf-8')

p=Path('index.html')
s=p.read_text(encoding='utf-8').replace('?v=59','?v=60').replace('deploy-v59','deploy-v60')
p.write_text(s,encoding='utf-8')

p=Path('sw.js')
s=p.read_text(encoding='utf-8').replace('stardew-tracker-v59','stardew-tracker-v60')
p.write_text(s,encoding='utf-8')
