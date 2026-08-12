from pathlib import Path
import re

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

def sub1(pattern,repl,label,flags=0):
    global s
    s2,n=re.subn(pattern,lambda m: repl,s,count=1,flags=flags)
    if n!=1:
        raise SystemExit(f'{label}: expected 1 replacement, got {n}')
    s=s2

def rep1(old,new,label):
    global s
    n=s.count(old)
    if n!=1:
        raise SystemExit(f'{label}: expected 1 occurrence, got {n}')
    s=s.replace(old,new,1)

# 1/2: brand-new installs are structurally blank, and overview mine tile switches to Skull Cavern once used.
sub1(r'/\* ================= 預填進度（對話紀錄） ================= \*/\nconst PREFILL = \{.*?\n\};\n\nconst STORAGE_KEY', '''/* ================= 全新手帳預設：不帶任何玩家進度 ================= */
const PREFILL = {
  base: { year: 1, season: "春", day: 1, money: 0, totalIncome: 0, backpack: 12, farm: "", name: "", platform: "Switch 2 / 1.6", profileDataVerifiedV47: false },
  skills: { farming: 0, mining: 0, foraging: 0, fishing: 0, combat: 0 },
  prof: { farming5: "", farming10: "", mining5: "", mining10: "", foraging5: "", foraging10: "", fishing5: "", fishing10: "", combat5: "", combat10: "" },
  mine: { normal: 0, skullBest: 0 },
  tools: { watering: "初始", pickaxe: "初始", axe: "初始", hoe: "初始", trash: "初始" },
  house: 0,
  buildings: { coop: 0, barn: 0, silos: 0, fishPonds: 0, sheds: 0, other: [] },
  animals: {}, ponds: [], milestones: [], wallet: [], abilities: [], bundleDone: [], bundleItems: {}, friendship: {},
  collections: { fish: [], artifact: [], mineral: [] }, mastery: [], notes: "", extras: { starfruit: 0, buildingNote: "" },
};

const STORAGE_KEY''', 'blank PREFILL', re.S)

s=s.replace('確定要清除全部進度並恢復預填資料嗎？','確定要清除全部進度並回到空白手帳嗎？')
rep1('["礦井",`${data.mine.normal}/120`]', '(Number(data.mine?.skullBest||0)>0?["骷髏洞",`${Number(data.mine.skullBest)}層`]:["礦井",`${Math.min(120,Number(data.mine?.normal||0))}/120`])', 'overview mine tile')

# 3: calibrate OCR to the attached 1920x1080 Switch profile screen. Keep labels/borders out of numeric crops.
sub1(r'      // 依 Switch 16:9 玩家資料頁的固定比例裁切；只辨識真正需要的欄位。\n      const farmerCropColor = makeCrop\(img,.*?\n      const clockCrop = makeCrop\(img,.*?\);', '''      // Switch 16:9 玩家資料頁固定比例裁切。v48 改成窄欄位，避免標籤／邊框被 OCR 當成數字。
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
      const clockCrop = makeCrop(img, 0.868, 0.139, 0.095, 0.055, 4, true);''', 'OCR crops', re.S)

sub1(r'      setProfileOcrStatus\("辨識金錢與日期…"\);\n      const moneyRaw = await recognize\(moneyCrop, "0123456789,"\);\n      const incomeRaw = await recognize\(incomeCrop, "0123456789,"\);\n      const dateRaw = await recognize\(dateCrop, ""\);\n      const clockRaw = await recognize\(clockCrop, "0123456789:："\);', '''      setProfileOcrStatus("辨識金錢與日期…");
      const moneyRaw = await recognize(hudMoneyCrop, "0123456789");
      const incomeRaw = await recognize(incomeCrop, "0123456789,");
      const yearRaw = await recognize(yearCrop, "0123456789");
      const seasonRaw = await recognize(seasonCrop, "");
      const dayRaw = await recognize(dayCrop, "0123456789");
      const clockRaw = await recognize(clockCrop, "0123456789:：");''', 'OCR recognition')

sub1(r'      let farmName = cleanNameCandidate\(farmRaw\)\n        // 只移除 UI 固定的「農場／农场」字樣；© / ® / @ 若在它前面，視為農場名的一部分保留。\n        \.replace\(/\\s\*\(\?:農場\|农场\)\\s\*\$/u, ""\)\n        \.replace\(/\^\(\?:農場\|农场\)\\s\*/u, ""\)\n        \.replace\(/\\s\+/g, " "\)\n        \.trim\(\);', '''      let farmName = cleanNameCandidate(farmRaw)
        .replace(/^(?:農場|农场)\\s*/u, "")
        .replace(/\\s+/g, " ")
        .trim();
      // 若 OCR 在「農場」後又幻覺出字串，直接以 UI 固定後綴為界截斷。
      const farmSuffixAt = farmName.search(/(?:農場|农场)/u);
      if (farmSuffixAt >= 0) farmName = farmName.slice(0, farmSuffixAt).trim();
      // Switch 字型的中點偶爾會被辨識成 +。
      farmName = farmName.replace(/\\s+\\+\\s+/g, " · ").replace(/\\s+/g, " ").trim();''', 'farm OCR cleanup')

sub1(r'      const currentMoney = digitsOnly\(moneyRaw\);\n      const totalIncome = digitsOnly\(incomeRaw\);\n\n      const compactDate = dateRaw\.replace\(/\\s\+/g, ""\);\n      let year = null, season = null, day = null;\n      let dm = compactDate\.match\(/第\?\(\\d\+\)年\.\*\?\(\[春夏秋冬\]\)\.\*\?\(\\d\+\)日/u\);\n      if \(!dm\) dm = compactDate\.match\(/\(\\d\+\)\.\*\?\(\[春夏秋冬\]\)\.\*\?\(\\d\+\)/u\);.*?      if \(dm\) \{.*?\n      \}', '''      const currentMoney = digitsOnly(moneyRaw);
      const totalIncome = digitsOnly(incomeRaw);
      let year = digitsOnly(yearRaw);
      let day = digitsOnly(dayRaw);
      const seasonMatch = String(seasonRaw||"").match(/[春夏秋冬]/u);
      let season = seasonMatch ? seasonMatch[0] : null;
      if (!(year && year >= 1 && year <= 99)) year = null;
      if (!(day && day >= 1 && day <= 28)) day = null;''', 'OCR date parsing', re.S)

# Remove any stale dateRaw debug reference if present; expose the new narrow-field raws instead.
s=s.replace('dateRaw, clockRaw', 'yearRaw, seasonRaw, dayRaw, clockRaw')
s=s.replace('moneyRaw, incomeRaw, dateRaw, clockRaw', 'moneyRaw, incomeRaw, yearRaw, seasonRaw, dayRaw, clockRaw')

# 4: second-level nav is visibly subordinate to the first-level cards.
for ident in ('SkillTab','FarmTab','RoomTab'):
    m=re.search(rf'^    const {ident}=.*$',s,re.M)
    if not m: raise SystemExit(f'{ident}: not found')
    line=m.group(0)
    line=line.replace('border:`2px solid','border:`1.5px solid').replace('borderRadius:11','borderRadius:8').replace('borderRadius:10','borderRadius:8')
    line=line.replace('padding:"6px 3px 5px"','padding:"3px 2px"').replace('padding:"6px 3px"','padding:"3px 2px"')
    line=line.replace('size={35}','size={25}').replace('size={31}','size={24}')
    line=line.replace('fontSize:9.5','fontSize:8.4').replace('fontSize:8.5','fontSize:8.2')
    s=s[:m.start()]+line+s[m.end():]

# Community route buttons are also second-level.
m=re.search(r'^    const routeButton=.*$',s,re.M)
if m:
    line=m.group(0).replace('border:`2px solid','border:`1.5px solid').replace('borderRadius:10','borderRadius:8').replace('padding:7','padding:4').replace('size={32}','size={25}').replace('fontSize:10','fontSize:8.5')
    s=s[:m.start()]+line+s[m.end():]

# Collection second-level tabs: smaller than DataTab.
s=s.replace('minWidth:58,border:`2px solid ${active?C.orange:C.line}`,borderRadius:9,padding:"5px 5px 4px"', 'minWidth:48,border:`1.5px solid ${active?C.orange:C.line}`,borderRadius:8,padding:"3px 4px"')
s=s.replace('<GameIcon file={file} size={29}/><span style={{fontSize:9.5', '<GameIcon file={file} size={24}/><span style={{fontSize:8.4')

# 5: expand permanent progression milestones and correct the old Qi-room conflation.
sub1(r'const MILESTONES = \[.*?\n\];', '''const MILESTONES = [
  { id: "greenhouse", name: "溫室修復", desc: "解鎖全年種植空間" },
  { id: "mine120", name: "普通礦井 120 層", desc: "抵達礦井底層並取得骷髏鑰匙" },
  { id: "bus", name: "公車修復（沙漠）", desc: "解鎖沙漠與骷髏洞窟路線" },
  { id: "minecart", name: "礦車修復", desc: "解鎖主要區域快速移動" },
  { id: "bridge", name: "採石場橋修復", desc: "解鎖採石場" },
  { id: "panning", name: "淘金解鎖", desc: "解鎖淘盤" },
  { id: "sewer", name: "下水道解鎖", desc: "取得生鏽的鑰匙" },
  { id: "casino", name: "賭場解鎖", desc: "完成神秘的齊先生任務線並取得俱樂部卡" },
  { id: "skull100", name: "骷髏洞窟 100 層", desc: "抵達骷髏洞窟第 100 層" },
  { id: "cc", name: "社區中心完成", desc: "完成社區中心修復" },
  { id: "movie", name: "電影院解鎖", desc: "完成後期城鎮設施解鎖" },
  { id: "island", name: "薑島解鎖", desc: "修復威利的船並抵達薑島" },
  { id: "volcano", name: "火山地牢頂層", desc: "抵達火山第 10 層並解鎖鍛造台" },
  { id: "walnutRoom", name: "齊先生的核桃房", desc: "收集 100 顆金色核桃後解鎖" },
  { id: "masteryCave", name: "精通洞穴解鎖", desc: "五項技能皆達 10 級" },
  { id: "perfection", name: "完美度 100%", desc: "達成遊戲完美度 100%" },
];''', 'milestones', re.S)

# 6/7: letters are not useful here; notes/scraps stay fully in-app with no Wiki jump.
rep1('  ["letters","信件","Mail"],\n','', 'remove letters collection tab')
s=s.replace('  letters:"Letter",\n','')
sub1(r'\n\s*\{collectionSection==="letters"&&<Card title="✉ 信件備忘">.*?</Card>\}', '', 'remove letters panel', re.S)
sub1(r'\n\s*<a href=\{isNotes\?"https://stardewvalleywiki\.com/Secret_Notes":"https://stardewvalleywiki\.com/Journal_Scraps"\} target="_blank" rel="noreferrer".*?</a>', '', 'remove paper wiki link', re.S)

# 8: wiki art previously vanished forever after one transient error. Retry centrally.
sub1(r'function GameIcon\(\{ file, size = 28, alt = "" \}\) \{\n  if \(!file\) return null;\n  return <img src=\{GAME_FILE\(file\)\} alt=\{alt\} loading="lazy"\n    onError=\{e => \{ e\.currentTarget\.style\.display = "none"; \}\}\n    style=\{\{ width:size, height:size, objectFit:"contain", imageRendering:"pixelated", flex:"0 0 auto" \}\} />;\n\}', '''function retryWikiImageV48(e){
  const img=e.currentTarget;
  const tries=Number(img.dataset.sdvRetry||0);
  const original=img.dataset.sdvSrc||img.getAttribute("src")||"";
  if(!original)return;
  if(tries>=2){img.style.visibility="hidden";return;}
  img.dataset.sdvRetry=String(tries+1);
  img.style.opacity=".35";
  window.setTimeout(()=>{
    const join=original.includes("?")?"&":"?";
    img.src=`${original}${join}sdvRetry=${Date.now()}-${tries+1}`;
  },tries===0?450:1400);
}
function imageLoadedV48(e){
  const img=e.currentTarget; img.dataset.sdvRetry="0"; img.style.opacity="1"; img.style.visibility="visible";
}
function WikiImg({src,alt="",loading="lazy",style}){
  if(!src)return null;
  return <img src={src} data-sdv-src={src} alt={alt} loading={loading} onError={retryWikiImageV48} onLoad={imageLoadedV48} style={style}/>;
}
function GameIcon({ file, size = 28, alt = "" }) {
  if (!file) return null;
  return <WikiImg src={GAME_FILE(file)} alt={alt} style={{ width:size, height:size, objectFit:"contain", imageRendering:"pixelated", flex:"0 0 auto" }} />;
}''', 'GameIcon retry')

# 9: second-level fish map thumbnail positioning used CSS background-position incorrectly.
sub1(r'<div style=\{\{position:"relative",height:47,borderRadius:6,overflow:"hidden",backgroundImage:`url\(\$\{GAME_FILE\(mapMeta\.file\)\}\)`,backgroundSize:"290% auto",backgroundPosition:`\$\{thumb\.x\}% \$\{thumb\.y\}%`,backgroundRepeat:"no-repeat",imageRendering:"pixelated"\}\}>\s*<span', '''<div style={{position:"relative",height:47,borderRadius:6,overflow:"hidden",background:"#DCE9C2"}}>
                          <WikiImg src={GAME_FILE(mapMeta.file)} alt="" style={{position:"absolute",width:"290%",height:"auto",maxWidth:"none",left:"50%",top:"50%",transform:`translate(-${thumb.x}%,-${thumb.y}%)`,imageRendering:"pixelated"}}/>
                          <span''', 'fish map thumbnail', re.S)

p.write_text(s,encoding='utf-8')

# Bump HTML asset query/version labels.
ip=Path('index.html')
i=ip.read_text(encoding='utf-8')
i=i.replace('?v=47','?v=48').replace('v47','v48')
ip.write_text(i,encoding='utf-8')

# v48 SW: also cache successful cross-origin images, so cold restarts do not depend on every wiki redirect succeeding again.
sp=Path('sw.js')
sw=sp.read_text(encoding='utf-8').replace("stardew-tracker-v47","stardew-tracker-v48")
sw=sw.replace("  if(url.origin!==self.location.origin){event.respondWith(fetch(event.request));return;}",'''  if(url.origin!==self.location.origin){
    if(event.request.destination==='image'){
      event.respondWith((async()=>{
        const cache=await caches.open(CACHE);
        const cached=await cache.match(event.request);
        if(cached){
          fetch(event.request).then(r=>cache.put(event.request,r.clone())).catch(()=>{});
          return cached;
        }
        const response=await fetch(event.request);
        cache.put(event.request,response.clone()).catch(()=>{});
        return response;
      })());
    }else event.respondWith(fetch(event.request));
    return;
  }''')
sp.write_text(sw,encoding='utf-8')
print('v48 patch applied')