from pathlib import Path
import sys

path = Path(sys.argv[1] if len(sys.argv) > 1 else 'build/entry.jsx')
s = path.read_text(encoding='utf-8')

def repl(old, new, label):
    global s
    if old not in s:
        raise SystemExit(f'build_ocr_name_patch: marker not found: {label}')
    s = s.replace(old, new, 1)

# Expand name/farm crops and keep both a color and thresholded version.
old_crops = '''      const farmerCrop = makeCrop(img, 0.292, 0.785, 0.125, 0.060, 4, true);
      const farmCrop = makeCrop(img, 0.490, 0.560, 0.285, 0.070, 3.2, true);'''
new_crops = '''      const farmerCropColor = makeCrop(img, 0.282, 0.775, 0.155, 0.078, 5, false);
      const farmerCropMono = makeCrop(img, 0.282, 0.775, 0.155, 0.078, 5, true);
      const farmCropColor = makeCrop(img, 0.430, 0.548, 0.340, 0.085, 4, false);
      const farmCropMono = makeCrop(img, 0.430, 0.548, 0.340, 0.085, 4, true);'''
repl(old_crops, new_crops, 'name crops')

# Add helpers that preserve punctuation and score multiple OCR passes.
anchor = '''      const recognize = async (canvas, whitelist = "") => {
        await worker.setParameters({
          tessedit_pageseg_mode: psm,
          preserve_interword_spaces: '1',
          tessedit_char_whitelist: whitelist,
          user_defined_dpi: '300'
        });
        const result = await worker.recognize(canvas);
        return cleanOcrLine(result?.data?.text);
      };
'''
inject = r'''

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
      const normalizeSpecials = (text) => cleanOcrLine(text)
        .replace(/\(\s*[Rr]\s*\)|（\s*[Rr]\s*）|\[\s*[Rr]\s*\]/g, "®")
        .replace(/\(\s*[Cc]\s*\)|（\s*[Cc]\s*）|\[\s*[Cc]\s*\]/g, "©")
        .replace(/[•∙⋅]/g, "·");
      const cleanNameCandidate = (text) => normalizeSpecials(text)
        .replace(/^[\s|:：,，;；]+|[\s|:：,，;；]+$/g, "")
        .trim();
      const nameScore = (r) => {
        const t = cleanNameCandidate(r?.text || "");
        const letters = (t.match(/[\p{L}\p{N}]/gu) || []).length;
        const usefulSymbols = (t.match(/[®©·・._@☆★♡♥♪♫~～+-]/gu) || []).length;
        const junk = (t.match(/[{}<>\\/]/g) || []).length;
        return letters * 4 + usefulSymbols * 6 + Math.min(20, Number(r?.confidence || 0) / 5) - junk * 6;
      };
      const bestNameResult = (...results) => results
        .map(r => ({...r, text: cleanNameCandidate(r.text)}))
        .filter(r => r.text)
        .sort((a,b) => nameScore(b) - nameScore(a))[0] || {text:"", confidence:0};
'''
repl(anchor, anchor + inject, 'recognize helpers')

old_rec = '''      setProfileOcrStatus("辨識農夫與農場名稱…");
      const farmerRaw = await recognize(farmerCrop, "");
      const farmRaw = await recognize(farmCrop, "");'''
new_rec = '''      setProfileOcrStatus("辨識農夫與農場名稱…");
      // 遊戲像素字體的小型 ® / © / · 很容易在黑白化後消失，因此名稱各跑彩色與黑白兩次。
      const farmerColorResult = await recognizeDetailed(farmerCropColor, "");
      const farmerMonoResult = await recognizeDetailed(farmerCropMono, "");
      const farmColorResult = await recognizeDetailed(farmCropColor, "");
      const farmMonoResult = await recognizeDetailed(farmCropMono, "");
      const farmerBest = bestNameResult(farmerColorResult, farmerMonoResult);
      const farmBest = bestNameResult(farmColorResult, farmMonoResult);
      const farmerRaw = farmerBest.text;
      const farmRaw = farmBest.text;'''
repl(old_rec, new_rec, 'name recognition')

old_clean = '''      let farmerName = farmerRaw.replace(/^[^\\p{L}\\p{N}]+|[^\\p{L}\\p{N}®©・·._@-]+$/gu, "").trim();
      let farmName = farmRaw
        .replace(/(?:@|©)?\\s*(?:農場|农场)\\s*$/u, "")
        .replace(/^(?:農場|农场)\\s*/u, "")
        .replace(/\\s+/g, " ")
        .trim();'''
new_clean = '''      // 不再只保留英數／中文：玩家名稱可合法包含 ®、©、·、☆ 等符號。
      let farmerName = cleanNameCandidate(farmerRaw)
        .replace(/^[^\\p{L}\\p{N}®©·・._@☆★♡♥♪♫~～+\\-]+|[^\\p{L}\\p{N}®©·・._@☆★♡♥♪♫~～+\\-]+$/gu, "")
        .trim();
      let farmName = cleanNameCandidate(farmRaw)
        // 只移除 UI 固定的「農場／农场」字樣；© / ® / @ 若在它前面，視為農場名的一部分保留。
        .replace(/\\s*(?:農場|农场)\\s*$/u, "")
        .replace(/^(?:農場|农场)\\s*/u, "")
        .replace(/\\s+/g, " ")
        .trim();'''
repl(old_clean, new_clean, 'name cleanup')

# Show both OCR passes in the debug result so a user can see why a symbol was chosen.
old_result = '''      setProfileOcrResult({ farmerRaw, farmRaw, moneyRaw, incomeRaw, dateRaw, clockRaw, applied:patch });'''
new_result = '''      setProfileOcrResult({
        farmerRaw, farmRaw, moneyRaw, incomeRaw, dateRaw, clockRaw, applied:patch,
        farmerColor: farmerColorResult.text, farmerMono: farmerMonoResult.text,
        farmColor: farmColorResult.text, farmMono: farmMonoResult.text
      });'''
repl(old_result, new_result, 'OCR result')

# Add direct correction fields to the profile card. OCR is automatic, but unusual symbols can be fixed without re-uploading.
old_buttons = '''          <button onClick={()=>profileInputRef.current?.click()} style={{marginTop:8,border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"5px 8px",fontWeight:900,color:C.brown,fontSize:11}}>更換角色畫面</button>
          {data.profilePortrait && <button onClick={()=>update({profilePortrait:""})} style={{marginLeft:5,border:0,background:"transparent",color:C.red,fontSize:11,fontWeight:900}}>移除</button>}'''
new_buttons = '''          <button onClick={()=>profileInputRef.current?.click()} style={{marginTop:8,border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"5px 8px",fontWeight:900,color:C.brown,fontSize:11}}>更換角色畫面</button>
          {data.profilePortrait && <button onClick={()=>update({profilePortrait:""})} style={{marginLeft:5,border:0,background:"transparent",color:C.red,fontSize:11,fontWeight:900}}>移除</button>}
          <details style={{marginTop:7}}><summary style={{fontSize:10.5,color:C.muted,fontWeight:900,cursor:"pointer"}}>名稱辨識錯了？手動修正</summary>
            <div style={{display:"grid",gap:5,marginTop:5}}>
              <input value={data.base.name||""} onChange={e=>updateBase({name:e.target.value})} placeholder="農夫名字（保留特殊符號）" style={{border:`1.5px solid ${C.line}`,background:"#FFFCF0",borderRadius:7,padding:"6px 7px",fontSize:11,fontWeight:800,color:C.ink}}/>
              <input value={data.base.farm||""} onChange={e=>updateBase({farm:e.target.value})} placeholder="農場名稱（保留特殊符號）" style={{border:`1.5px solid ${C.line}`,background:"#FFFCF0",borderRadius:7,padding:"6px 7px",fontSize:11,fontWeight:800,color:C.ink}}/>
            </div>
          </details>'''
repl(old_buttons, new_buttons, 'manual correction')

path.write_text(s, encoding='utf-8')
print('build_ocr_name_patch: multi-pass name OCR and symbol preservation enabled')
