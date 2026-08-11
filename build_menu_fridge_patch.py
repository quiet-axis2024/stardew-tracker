from pathlib import Path
import sys

path = Path(sys.argv[1] if len(sys.argv) > 1 else 'build/entry.jsx')
s = path.read_text(encoding='utf-8')

def repl(old, new, label):
    global s
    if old not in s:
        raise SystemExit(f'build_menu_fridge_patch: marker not found: {label}')
    s = s.replace(old, new, 1)

# ----- Data definitions: exact 1.6 Special Items & Powers structure, in-game achievements, refrigerator tracker -----
anchor = 'const CALENDAR_DATA = {'
defs = r'''
const SPECIAL_ITEMS_V2 = [
  {id:"forest_magic",name:"森林魔法",file:"Forest Magic",desc:"可以阅读社区中心内的魔法卷轴。",legacy:["森林魔法"]},
  {id:"dwarf_guide",name:"矮人语教程",file:"Dwarvish Translation Guide",desc:"可以与矿井和火山地牢的矮人交流。",legacy:["矮人語聖典","矮人语教程"]},
  {id:"rusty_key",name:"生锈的钥匙",file:"Rusty Key",desc:"用来进入下水道。",legacy:["銹鑰匙（下水道）","生锈的钥匙"]},
  {id:"club_card",name:"会员卡",file:"Club Card",desc:"用来进入赌场。",legacy:["俱樂部卡","会员卡"]},
  {id:"special_charm",name:"特殊的魅力",file:"Special Charm",desc:"永久提升每天的运气。",legacy:["特殊護符","特殊的魅力"]},
  {id:"skull_key",name:"头骨钥匙",file:"Skull Key",desc:"进入骷髅洞穴，并解锁祝尼魔赛车。",legacy:["骷髏鑰匙","头骨钥匙"]},
  {id:"magnifying_glass",name:"放大镜",file:"Magnifying Glass",desc:"获得找到秘密纸条的能力。",legacy:["放大鏡","放大镜"]},
  {id:"dark_talisman",name:"黑暗护身符",file:"Dark Talisman",desc:"任务物品，开放女巫小屋相关内容。",legacy:["黑暗護符","黑暗护身符"]},
  {id:"magic_ink",name:"魔法墨水",file:"Magic Ink",desc:"任务物品，开放魔法建筑。",legacy:["魔法墨水"]},
  {id:"bear_knowledge",name:"熊的知识",file:"Bear's Knowledge",desc:"美洲大树莓及黑莓售价变为 3 倍。",legacy:["熊的知識","熊的知识"]},
  {id:"spring_onion",name:"青葱技术",file:"Spring Onion Mastery",desc:"大葱售价变为 5 倍。",legacy:["春洋蔥精通","青葱技术"]},
  {id:"town_key",name:"小镇钥匙",file:"Key To The Town",desc:"绝大多数时间可无视建筑营业时间进入。",legacy:["鎮上鑰匙","小鎮鑰匙","小镇钥匙"]}
];

const BOOK_POWERS_V2 = [
  {id:"price",name:"价格目录",file:"Price Catalogue",desc:"可以看到物品价值。"},
  {id:"cave",name:"洞穴地图绘制法",file:"Mapping Cave Systems",desc:"马龙取回物品费用打五折。"},
  {id:"wind1",name:"风之道 第一部分",file:"Way Of The Wind pt. 1",desc:"跑步速度稍微加快。"},
  {id:"wind2",name:"风之道 第二部分",file:"Way Of The Wind pt. 2",desc:"跑步速度再次稍微加快。"},
  {id:"monster",name:"怪物图鉴",file:"Monster Compendium",desc:"怪物有小概率掉落双倍战利品。"},
  {id:"friendship",name:"交友导论",file:"Friendship 101",desc:"与人增进友谊更快。"},
  {id:"defense",name:"铜墙铁壁",file:"Jack Be Nimble, Jack Be Thick",desc:"获得 +1 防御。"},
  {id:"wood",name:"伐木秘事",file:"Woody's Secret",desc:"树木有 5% 几率掉落双倍木头。"},
  {id:"raccoon",name:"浣熊日记",file:"Raccoon Journal",desc:"杂草更容易掉落混合种子。"},
  {id:"sea_jewels",name:"海之宝石",file:"Jewels Of The Sea",desc:"钓鱼宝箱有几率开出鱼籽。"},
  {id:"dwarf_safety",name:"矮人安全手册",file:"Dwarvish Safety Manual",desc:"炸弹对你的伤害减少 25%。"},
  {id:"crabbing",name:"捕蟹秘籍",file:"The Art O' Crabbing",desc:"蟹笼有 25% 几率产出双倍。"},
  {id:"alley",name:"小巷自助餐",file:"The Alleyway Buffet",desc:"垃圾桶里找到物品的几率更高。"},
  {id:"diamond",name:"钻石猎人",file:"The Diamond Hunter",desc:"手动凿石头时有几率掉落钻石。"},
  {id:"mysteries",name:"谜之书",file:"Book of Mysteries",desc:"找到谜之盒的几率稍微提高。"},
  {id:"horse",name:"马术秘籍",file:"Horse: The Book",desc:"骑马速度稍微加快。"},
  {id:"treasure",name:"古代珍宝鉴定指南",file:"Treasure Appraisal Guide",desc:"出售古物时价格更高。"},
  {id:"grass",name:"草中窜",file:"Ol' Slitherlegs",desc:"在草丛和庄稼中移动速度大幅增加。"},
  {id:"animal_catalogue",name:"动物目录",file:"Animal Catalogue",desc:"玛妮不在柜台时也能使用商店。"}
];

const MASTERY_POWERS_V2 = [
  {id:"farming",name:"耕种精通",file:"Farming Skill Icon",desc:"可找到金色动物饼干，使非猪动物产量永久翻倍。"},
  {id:"mining",name:"采矿精通",file:"Mining Skill Icon",desc:"宝石矿产出双倍宝石。"},
  {id:"foraging",name:"采集精通",file:"Foraging Skill Icon",desc:"可以找到金色谜之盒。"},
  {id:"fishing",name:"钓鱼精通",file:"Fishing Skill Icon",desc:"可以遇到金色钓鱼宝箱。"},
  {id:"combat",name:"战斗精通",file:"Combat Skill Icon",desc:"解锁饰品装备栏。"}
];

const ACHIEVEMENTS_V2 = [
  {id:"greenhorn",name:"新手",desc:"赚取 15,000g"},{id:"cowpoke",name:"牛仔",desc:"赚取 50,000g"},{id:"homesteader",name:"农场主",desc:"赚取 250,000g"},{id:"millionaire",name:"百万富翁",desc:"赚取 1,000,000g"},{id:"legend",name:"千万富翁",desc:"赚取 10,000,000g（隐藏）"},
  {id:"museum_all",name:"全套收集",desc:"完成博物馆收集"},{id:"friend5",name:"新朋友",desc:"与某人达到 5 心"},{id:"friend10",name:"最好的朋友",desc:"与某人达到 10 心"},{id:"beloved",name:"深受喜爱的农夫",desc:"与 8 人达到 10 心"},{id:"cliques",name:"拉帮结派",desc:"与 4 人达到 5 心"},{id:"networking",name:"网络交友",desc:"与 10 人达到 5 心"},{id:"popular",name:"万人迷",desc:"与 20 人达到 5 心"},
  {id:"cook10",name:"厨子",desc:"烹饪 10 道不同料理"},{id:"cook25",name:"副主厨师",desc:"烹饪 25 道不同料理"},{id:"cookall",name:"美食大厨",desc:"烹饪每种配方"},{id:"house1",name:"节节高升",desc:"升级房屋"},{id:"house2",name:"富裕生活",desc:"将房屋升级到最大号（不含地窖）"},
  {id:"craft15",name:"自己动手",desc:"制作 15 种不同物品"},{id:"craft30",name:"工匠",desc:"制作 30 种不同物品"},{id:"craftall",name:"制造大师",desc:"制作每种物品"},
  {id:"fish10",name:"渔夫",desc:"抓住 10 种不同鱼"},{id:"fish24",name:"老海员",desc:"抓住 24 种不同鱼"},{id:"fishall",name:"垂钓大师",desc:"抓住每一种不同鱼"},{id:"fish100",name:"捕鱼大师",desc:"抓住 100 条鱼"},
  {id:"treasure40",name:"无主宝藏",desc:"向博物馆捐赠 40 种不同物品"},{id:"gofer",name:"听差",desc:"完成 10 个“需要帮助”任务"},{id:"bighelp",name:"帮了大忙",desc:"完成 40 个“需要帮助”任务"},{id:"polyculture",name:"混合栽培",desc:"运送 15 份每种指定农作物"},{id:"monoculture",name:"单一栽培",desc:"运送 300 份一种农作物"},{id:"fullshipment",name:"全部货物",desc:"运送每一种收集品物品"},
  {id:"prairie",name:"草原之王",desc:"通关草原王者大冒险"},{id:"bottom",name:"底部",desc:"到达矿井最底层"},{id:"locallegend",name:"当地传奇",desc:"重建社区中心"},{id:"joja",name:"Joja公司年度会员",desc:"购买全部 Joja 社区发展项目"},{id:"stardrops",name:"星之果实的神秘",desc:"找到所有星之果实"},{id:"fullhouse",name:"浪漫满屋",desc:"结婚并养育 2 个孩子"},{id:"talent",name:"非凡天赋",desc:"任意一种技能达到 10 级"},{id:"five",name:"5种技能大师",desc:"五种技能都达到 10 级"},{id:"protector",name:"城镇守护者",desc:"完成探险家公会全部猎杀目标"},{id:"fector",name:"因子挑战",desc:"一命通关草原王者大冒险（隐藏）"},
  {id:"island",name:"遥远的海岸",desc:"到达姜岛"},{id:"wellread",name:"博览群书",desc:"阅读每一本能力书"},{id:"movie",name:"意犹未尽",desc:"看一场电影"},{id:"ribbon",name:"冠军",desc:"星露谷展览会获得第一名"},{id:"soup",name:"难忘的汤",desc:"夏威夷宴会让州长非常满意"},{id:"neighbors",name:"热心邻居",desc:"帮助森林邻居组建家庭"},{id:"danger",name:"深处的危险",desc:"到达危险矿井最底部"},{id:"infinite",name:"无限力量",desc:"获得无限之刃"},{id:"perfection",name:"完美",desc:"到达顶峰"}
];

const DEFAULT_FRIDGES_V2 = [
  {id:"main",name:"主冰箱",order:0,note:"灶台自带冰箱；烹饪时在迷你冰箱之前消耗。",items:[]},
  {id:"mini1",name:"迷你冰箱 1",order:1,note:"第一个放置的迷你冰箱。",items:[]},
  {id:"mini2",name:"迷你冰箱 2",order:2,note:"第二个放置的迷你冰箱。",items:[]},
  {id:"mini3",name:"迷你冰箱 3",order:3,note:"可按攻略重命名分类。",items:[]}
];
'''
repl(anchor, defs + '\n' + anchor, 'data definitions')

# ----- states -----
state_anchor = '''  const [profileOcrResult, setProfileOcrResult] = useState(null);
  const profileInputRef = useRef(null);'''
state_new = '''  const [profileOcrResult, setProfileOcrResult] = useState(null);
  const [powerSection, setPowerSection] = useState("special");
  const [collectionSection, setCollectionSection] = useState("dex");
  const profileInputRef = useRef(null);'''
repl(state_anchor, state_new, 'states')

# ----- helpers and pages inserted before collection -----
collection_start = s.index('  const renderCollection = () => {')
s = s[:collection_start] + s[collection_start:].replace('  const renderCollection = () => {', '  const renderDexCollection = () => {', 1)
insert_at = s.index('  const renderDexCollection = () => {')
helpers = r'''
  const powersState = data.powersV2 || {special:[],books:[],mastery:[],off:[]};
  const isPowerChecked = (kind, item) => {
    const offKey = `${kind}:${item.id}`;
    if ((powersState.off||[]).includes(offKey)) return false;
    if ((powersState[kind]||[]).includes(item.id)) return true;
    if (kind === "special" && (item.legacy||[]).some(x => (data.wallet||[]).includes(x) || (data.abilities||[]).includes(x))) return true;
    if (kind === "mastery" && (data.mastery||[]).includes(item.id)) return true;
    return false;
  };
  const togglePower = (kind, item) => {
    const checked = isPowerChecked(kind,item);
    const next = {special:[...(powersState.special||[])],books:[...(powersState.books||[])],mastery:[...(powersState.mastery||[])],off:[...(powersState.off||[])]};
    const offKey = `${kind}:${item.id}`;
    if (checked) {
      next[kind] = next[kind].filter(x=>x!==item.id);
      if (!next.off.includes(offKey)) next.off.push(offKey);
    } else {
      next.off = next.off.filter(x=>x!==offKey);
      if (!next[kind].includes(item.id)) next[kind].push(item.id);
    }
    update({powersV2:next});
  };

  const derivedAchievement = (id) => {
    const income=Number(data.base.totalIncome||0), fishGot=(data.collections?.fish||[]).length;
    const hearts=Object.values(data.friendship||{}).map(Number);
    if(id==="greenhorn")return income>=15000;if(id==="cowpoke")return income>=50000;if(id==="homesteader")return income>=250000;if(id==="millionaire")return income>=1000000;if(id==="legend")return income>=10000000;
    if(id==="friend5")return hearts.some(x=>x>=5);if(id==="friend10")return hearts.some(x=>x>=10);if(id==="beloved")return hearts.filter(x=>x>=10).length>=8;if(id==="cliques")return hearts.filter(x=>x>=5).length>=4;if(id==="networking")return hearts.filter(x=>x>=5).length>=10;if(id==="popular")return hearts.filter(x=>x>=5).length>=20;
    if(id==="house1")return Number(data.house||0)>=1;if(id==="house2")return Number(data.house||0)>=2;
    if(id==="fish10")return fishGot>=10;if(id==="fish24")return fishGot>=24;if(id==="fishall")return fishGot>=FISH_ICON_FILES.length;
    if(id==="bottom")return Number(data.mine?.normal||0)>=120;if(id==="locallegend")return rp.done>=rp.total;
    if(id==="talent")return Object.values(data.skills||{}).some(x=>Number(x)>=10);if(id==="five")return Object.values(data.skills||{}).length>=5&&Object.values(data.skills||{}).every(x=>Number(x)>=10);
    if(id==="island")return (data.milestones||[]).includes("island");
    return false;
  };
  const achievementChecked = id => (data.achievementsV2||[]).includes(id) || derivedAchievement(id);
  const toggleAchievement = id => {
    if (derivedAchievement(id)) return;
    const cur=data.achievementsV2||[];
    update({achievementsV2:cur.includes(id)?cur.filter(x=>x!==id):[...cur,id]});
  };

  const extrasState = data.collectionExtrasV2 || {notes:[],scraps:[],shippedCount:0,cookedCount:0,lettersNote:""};
  const updateExtras = patch => update({collectionExtrasV2:{...extrasState,...patch}});

  const fridgeState = data.fridgesV2 || DEFAULT_FRIDGES_V2;
  const setFridges = next => update({fridgesV2:next});
  const updateFridge = (fi, patch) => setFridges(fridgeState.map((f,i)=>i===fi?{...f,...patch}:f));
  const addFridgeItem = fi => {
    const name=window.prompt("食材名称"); if(!name)return;
    const next=fridgeState.map((f,i)=>i===fi?{...f,items:[...(f.items||[]),{id:`i${Date.now()}${Math.random()}`,name,count:0,target:0,used:0,note:""}]}:f); setFridges(next);
  };
  const changeFridgeItem = (fi, ii, patch) => setFridges(fridgeState.map((f,i)=>i===fi?{...f,items:(f.items||[]).map((it,j)=>j===ii?{...it,...patch}:it)}:f));
  const deleteFridgeItem = (fi,ii) => setFridges(fridgeState.map((f,i)=>i===fi?{...f,items:(f.items||[]).filter((_,j)=>j!==ii)}:f));
  const useFridgeItem = (fi,ii) => {
    const it=fridgeState[fi].items[ii]; if(Number(it.count||0)<=0)return;
    changeFridgeItem(fi,ii,{count:Number(it.count||0)-1,used:Number(it.used||0)+1});
  };
  const addMiniFridge = () => setFridges([...fridgeState,{id:`mini${Date.now()}`,name:`迷你冰箱 ${fridgeState.length}`,order:fridgeState.length,note:"",items:[]}]);

  const renderPowers = () => {
    const sections={special:SPECIAL_ITEMS_V2,books:BOOK_POWERS_V2,mastery:MASTERY_POWERS_V2};
    const labels={special:"特殊物品",books:"书籍能力",mastery:"精通能力"};
    return <div>
      <SectionTitle icon="🎒">特殊物品与能力</SectionTitle>
      <Card style={{background:"#FFF4D8",fontSize:11,color:C.muted,lineHeight:1.5}}>对应 1.6 游戏「+ → 特殊物品与能力」页面：特殊物品、书籍能力、精通能力分开记录。</Card>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:9}}>{Object.keys(sections).map(k=><Pill key={k} active={powerSection===k} onClick={()=>setPowerSection(k)}>{labels[k]}</Pill>)}</div>
      <div style={{display:"grid",gap:7,marginTop:9}}>{sections[powerSection].map(it=>{
        const checked=isPowerChecked(powerSection,it);
        return <Card key={it.id} style={{padding:9,background:checked?"#EAF4D8":C.paper}}><div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={powerSection==="mastery"?"Mastery Icon":it.file} size={36}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:13,color:C.ink}}>{it.name}</b><div style={{fontSize:10.5,color:C.muted,lineHeight:1.35,marginTop:2}}>{it.desc}</div></div><button onClick={()=>togglePower(powerSection,it)} style={{border:`2px solid ${checked?C.green:C.line}`,background:checked?C.lightGreen:C.cream,borderRadius:8,padding:"5px 8px",fontWeight:900,color:checked?C.green:C.muted}}>{checked?"✓":"○"}</button></div></Card>;
      })}</div>
    </div>;
  };

  const renderAchievements = () => <div>
    <Card style={{padding:9,background:"#FFF4D8",fontSize:10.5,color:C.muted,lineHeight:1.45}}>对应游戏「+ → 收集品 → 成就」。能从当前手帐可靠推断的成就会标成“自动”，其余可手动勾选。</Card>
    <div style={{display:"grid",gap:6,marginTop:8}}>{ACHIEVEMENTS_V2.map(a=>{
      const auto=derivedAchievement(a.id), checked=achievementChecked(a.id);
      return <Card key={a.id} style={{padding:8,background:checked?"#EAF4D8":C.paper}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file="Achievement Star 01" size={28}/><div style={{flex:1}}><b style={{fontSize:12.5,color:C.ink}}>{a.name}</b>{auto&&<span style={{fontSize:9,color:C.green,fontWeight:900,marginLeft:5}}>自动</span>}<div style={{fontSize:10,color:C.muted,marginTop:1}}>{a.desc}</div></div><button disabled={auto} onClick={()=>toggleAchievement(a.id)} style={{border:`2px solid ${checked?C.green:C.line}`,background:checked?C.lightGreen:C.cream,borderRadius:8,padding:"4px 7px",fontWeight:900,color:checked?C.green:C.muted,opacity:auto?.75:1}}>{checked?"✓":"○"}</button></div></Card>;
    })}</div>
  </div>;

  const renderNumberCollection = (kind,total,title) => {
    const list=extrasState[kind]||[];
    return <Card style={{marginTop:8}}><div style={{fontSize:12,fontWeight:900,color:C.brown,marginBottom:7}}>{title} {list.length}/{total}</div><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>{Array.from({length:total},(_,i)=>i+1).map(n=>{const on=list.includes(n);return <button key={n} onClick={()=>updateExtras({[kind]:on?list.filter(x=>x!==n):[...list,n]})} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?C.lightGreen:C.cream,borderRadius:7,padding:"6px 1px",fontSize:10,fontWeight:900,color:on?C.green:C.brown}}>{n}</button>})}</div></Card>;
  };

  const renderFridge = () => {
    const restock=[]; fridgeState.forEach(f=>(f.items||[]).forEach(it=>{if(Number(it.target||0)>Number(it.count||0))restock.push(`${it.name} +${Number(it.target||0)-Number(it.count||0)}`)}));
    return <div>
      <SectionTitle icon="💾">冰箱与厨房</SectionTitle>
      <Card style={{background:"#E7F1F7",fontSize:11,color:C.ink,lineHeight:1.55}}><b>游戏实际取料顺序：</b>背包 → 主冰箱 → 迷你冰箱（按最初放置先后）。每个储存空间内部会从右下往左上搜索。这里的“顺序”就是为了让你按游戏真实优先级整理。</Card>
      {restock.length>0&&<Card style={{marginTop:8,padding:9,background:"#FFF0D8"}}><div style={{fontSize:11,fontWeight:950,color:C.orange}}>补货清单</div><div style={{fontSize:10.5,color:C.brown,marginTop:3,lineHeight:1.5}}>{restock.join("、")}</div></Card>}
      <div style={{display:"grid",gap:9,marginTop:9}}>{fridgeState.map((f,fi)=><Card key={f.id} style={{padding:9}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={fi===0?"Fridge":"Mini-Fridge"} size={34}/><div style={{flex:1}}><input value={f.name} onChange={e=>updateFridge(fi,{name:e.target.value})} style={{width:"100%",border:0,background:"transparent",fontWeight:950,color:C.darkBrown,fontSize:14,outline:0}}/><div style={{fontSize:9.5,color:C.muted}}>消耗优先级 {fi===0?"主冰箱":`迷你 ${fi}`} · {(f.items||[]).length}/36 种记录</div></div></div>
        <input value={f.note||""} onChange={e=>updateFridge(fi,{note:e.target.value})} placeholder="分类备注（例如：鱼类／作物／商店材料）" style={{width:"100%",marginTop:5,border:`1px solid ${C.line}`,background:"#FFFDF4",borderRadius:7,padding:"5px 6px",fontSize:10.5,color:C.ink}}/>
        <div style={{display:"grid",gap:5,marginTop:7}}>{(f.items||[]).map((it,ii)=><div key={it.id} style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 48px 48px",gap:4,alignItems:"center",borderTop:`1px dashed ${C.line}`,paddingTop:5}}>
          <div style={{minWidth:0}}><input value={it.name} onChange={e=>changeFridgeItem(fi,ii,{name:e.target.value})} style={{width:"100%",border:0,background:"transparent",fontSize:11.5,fontWeight:900,color:C.ink,outline:0}}/><div style={{fontSize:9,color:C.muted}}>当前 {Number(it.count||0)} · 目标 {Number(it.target||0)} · 已用 {Number(it.used||0)}</div></div>
          <button onClick={()=>changeFridgeItem(fi,ii,{count:Number(it.count||0)+1})} style={{border:`1.5px solid ${C.green}`,background:C.lightGreen,borderRadius:7,padding:5,fontSize:10,fontWeight:900,color:C.green}}>补 +1</button>
          <button onClick={()=>useFridgeItem(fi,ii)} style={{border:`1.5px solid ${C.orange}`,background:"#FFE4C5",borderRadius:7,padding:5,fontSize:10,fontWeight:900,color:C.brown}}>用 -1</button>
          <div style={{gridColumn:"1 / -1",display:"flex",gap:5,alignItems:"center"}}><label style={{fontSize:9.5,color:C.muted}}>目标</label><input type="number" min="0" value={Number(it.target||0)} onChange={e=>changeFridgeItem(fi,ii,{target:Math.max(0,Number(e.target.value)||0)})} style={{width:55,border:`1px solid ${C.line}`,borderRadius:6,padding:3,fontSize:10}}/><input value={it.note||""} onChange={e=>changeFridgeItem(fi,ii,{note:e.target.value})} placeholder="用途／保留给哪道菜" style={{flex:1,minWidth:0,border:`1px solid ${C.line}`,borderRadius:6,padding:3,fontSize:10}}/><button onClick={()=>deleteFridgeItem(fi,ii)} style={{border:0,background:"transparent",color:C.red,fontWeight:900}}>×</button></div>
        </div>)}</div>
        <div style={{display:"flex",gap:6,marginTop:7}}><button onClick={()=>addFridgeItem(fi)} style={{flex:1,border:`1.5px dashed ${C.line}`,background:C.cream,borderRadius:7,padding:6,fontSize:10.5,fontWeight:900,color:C.brown}}>＋ 食材</button><button onClick={()=>updateFridge(fi,{items:(f.items||[]).map(it=>({...it,used:0}))})} style={{border:`1px solid ${C.line}`,background:"transparent",borderRadius:7,padding:6,fontSize:9.5,color:C.muted}}>清已用</button></div>
      </Card>)}</div>
      <button onClick={addMiniFridge} style={{marginTop:8,width:"100%",border:`2px dashed ${C.line}`,background:C.cream,borderRadius:9,padding:9,fontWeight:900,color:C.brown}}>＋ 新增迷你冰箱</button>
      <Card style={{marginTop:8,padding:9,fontSize:10,color:C.muted,lineHeight:1.5}}>小红书短链目前无法从这里直接读取原帖，所以这版先做成可自由重命名、按顺序排列的通用冰箱。把原帖截图发进来后，可以直接把作者那套分类做成预设，不需要你重新录结构。</Card>
    </div>;
  };

'''
s = s[:insert_at] + helpers + s[insert_at:]

# ----- Collection wrapper: mirror in-game Collections subpages -----
build_marker = '\n  const buildSummary = () => {'
idx = s.index(build_marker)
wrapper = r'''
  const renderCollection = () => <div>
    <SectionTitle icon="📖">收集品</SectionTitle>
    <Card style={{padding:8,background:"#FFF4D8",fontSize:10.5,color:C.muted,lineHeight:1.4}}>对应游戏「+ → 收集品」：出货、鱼类、古物、矿物、烹饪、成就、信件、秘密纸条、日志残页。</Card>
    <div style={{display:"flex",gap:4,overflowX:"auto",padding:"7px 0 3px",WebkitOverflowScrolling:"touch"}}>{[
      ["dex","图鉴"],["achievements","成就"],["shipping","出货"],["cooking","烹饪"],["letters","信件"],["notes","秘密纸条"],["scraps","日志残页"]
    ].map(([k,n])=><Pill key={k} small active={collectionSection===k} onClick={()=>setCollectionSection(k)}>{n}</Pill>)}</div>
    {collectionSection==="dex"&&renderDexCollection()}
    {collectionSection==="achievements"&&renderAchievements()}
    {collectionSection==="notes"&&renderNumberCollection("notes",27,"秘密纸条")}
    {collectionSection==="scraps"&&renderNumberCollection("scraps",11,"日志残页")}
    {collectionSection==="shipping"&&<Card style={{marginTop:8}}><div style={{fontSize:12,fontWeight:900,color:C.brown}}>出货收集进度</div><div style={{fontSize:10.5,color:C.muted,margin:"5px 0"}}>游戏这一页按具体物品逐项点亮。这里先记录已点亮数量；之后可继续补成完整图鉴。</div><NumInput value={Number(extrasState.shippedCount||0)} max={999} onChange={v=>updateExtras({shippedCount:v})} suffix="项"/></Card>}
    {collectionSection==="cooking"&&<Card style={{marginTop:8}}><div style={{fontSize:12,fontWeight:900,color:C.brown}}>烹饪收集</div><div style={{fontSize:10.5,color:C.muted,margin:"5px 0"}}>只有亲自在农舍厨房或野炊工具烹饪过，才会在游戏收集品里点亮。</div><NumInput value={Number(extrasState.cookedCount||0)} max={80} onChange={v=>updateExtras({cookedCount:v})} suffix="/80"/><div style={{fontSize:10,color:C.muted,marginTop:6}}>冰箱页负责记录食材库存和“已用”数量，两边分开，避免料理图鉴和库存混在一起。</div></Card>}
    {collectionSection==="letters"&&<Card style={{marginTop:8}}><div style={{fontSize:12,fontWeight:900,color:C.brown}}>信件</div><textarea value={extrasState.lettersNote||""} onChange={e=>updateExtras({lettersNote:e.target.value})} placeholder="记录还想核对的信件、配方信件、奖励信件……" style={{width:"100%",minHeight:120,marginTop:6,border:`1.5px solid ${C.line}`,borderRadius:7,padding:7,background:"#FFFCF0",fontSize:11,color:C.ink}}/></Card>}
  </div>;
'''
s = s[:idx] + wrapper + s[idx:]

# ----- Bottom tabs: add proper Powers + Fridge; rename 图鉴 to 收藏; allow horizontal swipe -----
old_tabs = '''const TABS = [
  { id: "overview", name: "總覽", icon: "🏡", file: TAB_ICON_FILES.overview },
  { id: "skills", name: "技能", icon: "⭐", file: TAB_ICON_FILES.skills },
  { id: "bundles", name: "社區", icon: "📦", file: TAB_ICON_FILES.bundles },
  { id: "farm", name: "農場", icon: "🐄", file: TAB_ICON_FILES.farm },
  { id: "people", name: "社交", icon: "💛", file: TAB_ICON_FILES.people },
  { id: "collection", name: "圖鑑", icon: "📖", file: TAB_ICON_FILES.collection },
  { id: "notes", name: "備註", icon: "📝", file: TAB_ICON_FILES.notes },
];'''
new_tabs = '''const TABS = [
  { id: "overview", name: "總覽", icon: "🏡", file: TAB_ICON_FILES.overview },
  { id: "skills", name: "技能", icon: "⭐", file: TAB_ICON_FILES.skills },
  { id: "bundles", name: "社區", icon: "📦", file: TAB_ICON_FILES.bundles },
  { id: "farm", name: "農場", icon: "🐄", file: TAB_ICON_FILES.farm },
  { id: "people", name: "社交", icon: "💛", file: TAB_ICON_FILES.people },
  { id: "powers", name: "能力", icon: "🎒", file: "Special Items & Powers Tab" },
  { id: "collection", name: "收藏", icon: "📖", file: TAB_ICON_FILES.collection },
  { id: "fridge", name: "冰箱", icon: "🧊", file: "Mini-Fridge" },
  { id: "notes", name: "備註", icon: "📝", file: TAB_ICON_FILES.notes },
];'''
repl(old_tabs,new_tabs,'bottom tabs')

old_content = 'const content={overview:renderOverview,skills:renderSkills,bundles:renderBundles,farm:renderFarm,people:renderPeople,collection:renderCollection,notes:renderNotes}[tab];'
new_content = 'const content={overview:renderOverview,skills:renderSkills,bundles:renderBundles,farm:renderFarm,people:renderPeople,powers:renderPowers,collection:renderCollection,fridge:renderFridge,notes:renderNotes}[tab];'
repl(old_content,new_content,'content map')

old_bar = 'display:"flex",justifyContent:"space-around",padding:"6px 2px calc(6px + env(safe-area-inset-bottom))"'
new_bar = 'display:"flex",justifyContent:"flex-start",overflowX:"auto",WebkitOverflowScrolling:"touch",padding:"6px 2px calc(6px + env(safe-area-inset-bottom))"'
repl(old_bar,new_bar,'bottom bar')

path.write_text(s,encoding='utf-8')
print('build_menu_fridge_patch: player menu alignment, achievements, powers, and fridge tracker applied')
