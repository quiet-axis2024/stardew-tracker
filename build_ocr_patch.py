from pathlib import Path
import sys

path = Path(sys.argv[1] if len(sys.argv) > 1 else 'build/entry.jsx')
s = path.read_text(encoding='utf-8')

def repl(old, new, label):
    global s
    if old not in s:
        raise SystemExit(f'build_ocr_patch: marker not found: {label}')
    s = s.replace(old, new, 1)

state_old = '''  const [fishMissingOnly, setFishMissingOnly] = useState(false);
  const profileInputRef = useRef(null);
  const saveTimer = useRef(null);'''
state_new = '''  const [fishMissingOnly, setFishMissingOnly] = useState(false);
  const [profileOcrStatus, setProfileOcrStatus] = useState("");
  const [profileOcrResult, setProfileOcrResult] = useState(null);
  const profileInputRef = useRef(null);
  const saveTimer = useRef(null);'''
repl(state_old, state_new, 'OCR state')

start = s.index('  const handleProfileUpload = async (file) => {')
end = s.index('\n\n  const renderProfileCard = () => <>', start)
new_handler = r'''  const loadTesseract = async () => {
    if (window.Tesseract) return window.Tesseract;
    setProfileOcrStatus("載入文字辨識元件…");
    await new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-sdv-tesseract]');
      if (existing) {
        existing.addEventListener('load', resolve, { once:true });
        existing.addEventListener('error', reject, { once:true });
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
      script.dataset.sdvTesseract = "1";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    if (!window.Tesseract) throw new Error("OCR 元件載入失敗");
    return window.Tesseract;
  };

  const makeCrop = (img, x, y, w, h, scale = 3, threshold = true) => {
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
  };

  const cleanOcrLine = (text) => String(text||"").replace(/[\r\n]+/g," ").replace(/\s+/g," ").trim();
  const digitsOnly = (text) => {
    const d = String(text||"").replace(/[^0-9]/g,"");
    return d ? Number(d) : null;
  };

  const handleProfileUpload = async (file) => {
    if (!file) return;
    setProfileOcrResult(null);
    setProfileOcrStatus("讀取 Switch 玩家資料畫面…");
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
      const ratio = img.width / img.height;

      // 先保留角色肖像：Switch 16:9 的「＋ → 玩家／背包」頁面位置固定。
      const portraitCanvas = document.createElement("canvas");
      portraitCanvas.width = 180; portraitCanvas.height = 240;
      const pctx = portraitCanvas.getContext("2d");
      if (ratio > 1.6 && ratio < 1.9) {
        const sx = img.width * 0.298, sy = img.height * 0.548, sw = img.width * 0.092, sh = img.height * 0.218;
        pctx.drawImage(img, sx, sy, sw, sh, 0, 0, portraitCanvas.width, portraitCanvas.height);
      } else {
        const sideW = Math.min(img.width, img.height * 0.76), sideH = Math.min(img.height, img.width / 0.76);
        pctx.drawImage(img, (img.width-sideW)/2, (img.height-sideH)/2, sideW, sideH, 0, 0, portraitCanvas.width, portraitCanvas.height);
      }
      const portrait = portraitCanvas.toDataURL("image/jpeg", 0.84);

      if (!(ratio > 1.6 && ratio < 1.9)) {
        setData(d => ({...d, profilePortrait:portrait}));
        setProfileOcrStatus("✓ 已更新角色圖；這張圖片不是標準 16:9 玩家資料畫面，因此未自動改文字資料");
        return;
      }

      const Tesseract = await loadTesseract();
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

      // 依 Switch 16:9 玩家資料頁的固定比例裁切；只辨識真正需要的欄位。
      const farmerCrop = makeCrop(img, 0.292, 0.785, 0.125, 0.060, 4, true);
      const farmCrop = makeCrop(img, 0.490, 0.560, 0.285, 0.070, 3.2, true);
      const moneyCrop = makeCrop(img, 0.555, 0.638, 0.185, 0.060, 3.5, true);
      const incomeCrop = makeCrop(img, 0.555, 0.697, 0.185, 0.060, 3.5, true);
      const dateCrop = makeCrop(img, 0.505, 0.758, 0.230, 0.065, 3.5, true);
      const clockCrop = makeCrop(img, 0.868, 0.139, 0.095, 0.055, 4, true);

      setProfileOcrStatus("辨識農夫與農場名稱…");
      const farmerRaw = await recognize(farmerCrop, "");
      const farmRaw = await recognize(farmCrop, "");
      setProfileOcrStatus("辨識金錢與日期…");
      const moneyRaw = await recognize(moneyCrop, "0123456789,");
      const incomeRaw = await recognize(incomeCrop, "0123456789,");
      const dateRaw = await recognize(dateCrop, "");
      const clockRaw = await recognize(clockCrop, "0123456789:：");
      await worker.terminate();

      let farmerName = farmerRaw.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}®©・·._@-]+$/gu, "").trim();
      let farmName = farmRaw
        .replace(/(?:@|©)?\s*(?:農場|农场)\s*$/u, "")
        .replace(/^(?:農場|农场)\s*/u, "")
        .replace(/\s+/g, " ")
        .trim();
      // OCR 偶爾會把「目前持有現金」等標籤吃進來；這裡只保留較短的名稱片段。
      if (farmName.length > 28) farmName = farmName.slice(0,28).trim();
      if (farmerName.length > 24) farmerName = farmerName.slice(0,24).trim();

      const currentMoney = digitsOnly(moneyRaw);
      const totalIncome = digitsOnly(incomeRaw);

      const compactDate = dateRaw.replace(/\s+/g, "");
      let year = null, season = null, day = null;
      let dm = compactDate.match(/第?(\d+)年.*?([春夏秋冬]).*?(\d+)日/u);
      if (!dm) dm = compactDate.match(/(\d+).*?([春夏秋冬]).*?(\d+)/u);
      if (dm) {
        year = Number(dm[1]); season = dm[2]; day = Number(dm[3]);
      } else {
        const nums = compactDate.match(/\d+/g) || [];
        if (nums.length >= 2) { year = Number(nums[0]); day = Number(nums[nums.length-1]); }
      }

      let gameTime = clockRaw.replace(/\s+/g, "").replace("：", ":");
      const tm = gameTime.match(/([0-2]?\d):?([0-5]\d)/);
      gameTime = tm ? `${String(Number(tm[1])).padStart(2,'0')}:${tm[2]}` : "";

      const patch = {};
      const updated = [];
      if (farmerName && farmerName.length >= 2) { patch.name = farmerName; updated.push("農夫名字"); }
      if (farmName && farmName.length >= 2) { patch.farm = farmName; updated.push("農場名"); }
      if (year && year >= 1 && year <= 99) { patch.year = year; updated.push("年份"); }
      if (season) { patch.season = season; updated.push("季節"); }
      if (day && day >= 1 && day <= 28) { patch.day = day; updated.push("日期"); }
      if (currentMoney !== null) { patch.money = currentMoney; updated.push("目前金錢"); }
      if (totalIncome !== null) { patch.totalIncome = totalIncome; updated.push("總收入"); }
      if (gameTime) { patch.gameTime = gameTime; updated.push("遊戲內時間"); }

      setData(d => ({ ...d, profilePortrait:portrait, base:{...d.base, ...patch} }));
      setProfileOcrResult({ farmerRaw, farmRaw, moneyRaw, incomeRaw, dateRaw, clockRaw, applied:patch });
      setProfileOcrStatus(updated.length ? `✓ 已從截圖更新：${updated.join("、")}` : "⚠ 已更新角色圖，但沒有可靠辨識到資料欄位");
    } catch (e) {
      console.warn('profile OCR failed', e);
      setProfileOcrStatus(`⚠ 文字辨識失敗；角色圖仍可手動再試一次`);
    } finally {
      URL.revokeObjectURL(url);
    }
  };'''
s = s[:start] + new_handler + s[end:]

old_profile = '''          <div style={{fontSize:17,fontWeight:950,color:C.darkBrown}}>{data.base.farm}</div>
          <div style={{fontSize:11,color:C.muted,marginTop:2}}>{data.base.platform}</div>
          <div style={{fontSize:13,fontWeight:900,marginTop:8}}>第 {data.base.year} 年・{data.base.season} {data.base.day} 日</div>
          <div style={{fontSize:12,color:C.brown,marginTop:4}}>持有 {Number(data.base.money||0).toLocaleString()}g</div>
          <div style={{fontSize:12,color:C.brown}}>累計 {Number(data.base.totalIncome||0).toLocaleString()}g</div>'''
new_profile = '''          <div style={{fontSize:15,fontWeight:950,color:C.darkBrown}}>{data.base.name || "未記錄農夫名"}</div>
          <div style={{fontSize:17,fontWeight:950,color:C.darkBrown,marginTop:1}}>{data.base.farm}</div>
          <div style={{fontSize:11,color:C.muted,marginTop:2}}>{data.base.platform}</div>
          <div style={{fontSize:13,fontWeight:900,marginTop:7}}>第 {data.base.year} 年・{data.base.season} {data.base.day} 日{data.base.gameTime ? `・${data.base.gameTime}` : ""}</div>
          <div style={{fontSize:12,color:C.brown,marginTop:4}}>持有 {Number(data.base.money||0).toLocaleString()}g</div>
          <div style={{fontSize:12,color:C.brown}}>累計 {Number(data.base.totalIncome||0).toLocaleString()}g</div>'''
repl(old_profile, new_profile, 'profile values')

note_old = '''      <div style={{fontSize:10.5,color:C.muted,marginTop:7,lineHeight:1.45}}>會自動裁出 Switch「＋」玩家資料頁中的人物區域；農場、日期與金錢沿用手帳目前資料。裁出的角色圖會跟進度一起保存。</div>'''
note_new = '''      <div style={{fontSize:10.5,color:C.muted,marginTop:7,lineHeight:1.45}}>上傳 Switch「＋」玩家資料頁後，會自動裁角色圖並辨識農夫名字、農場名、年／季／日、目前金錢、總收入與右上角遊戲內時間。第一次文字辨識需下載 OCR 語言資料，之後瀏覽器會快取。</div>
      {profileOcrStatus && <div style={{marginTop:7,padding:"6px 8px",borderRadius:7,background:profileOcrStatus.startsWith("⚠")?"#FBE4DE":"#EAF4D8",color:profileOcrStatus.startsWith("⚠")?C.red:C.green,fontSize:10.5,fontWeight:900,lineHeight:1.4}}>{profileOcrStatus}</div>}
      {profileOcrResult && <details style={{marginTop:6,fontSize:9.5,color:C.muted}}><summary style={{cursor:"pointer",fontWeight:900}}>查看辨識原文</summary><div style={{marginTop:4,lineHeight:1.45}}>名字：{profileOcrResult.farmerRaw || "—"}<br/>農場：{profileOcrResult.farmRaw || "—"}<br/>金錢：{profileOcrResult.moneyRaw || "—"}<br/>總收入：{profileOcrResult.incomeRaw || "—"}<br/>日期：{profileOcrResult.dateRaw || "—"}<br/>時間：{profileOcrResult.clockRaw || "—"}</div></details>}'''
repl(note_old, note_new, 'profile OCR note')

path.write_text(s, encoding='utf-8')
print('build_ocr_patch: screenshot OCR auto-update enabled')
