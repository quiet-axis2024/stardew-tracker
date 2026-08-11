from pathlib import Path

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

# ---------- Shared visual lookup data ----------
marker='/* ================= 預填進度（對話紀錄） ================= */'
if 'const PROF_ICON_FILES_V26' not in s:
    block=r'''const PROF_ICON_FILES_V26 = {
  "牧場主":"Rancher","農耕者":"Tiller","雞舍大師":"Coopmaster","牧羊人":"Shepherd","工匠":"Artisan","農業學家":"Agriculturist",
  "礦工":"Miner","地質學家":"Geologist","鐵匠":"Blacksmith Icon","探礦者":"Prospector","挖掘者":"Excavator","寶石學家":"Gemologist",
  "樵夫":"Forester","採集者":"Gatherer","伐木工":"Lumberjack","樹汁採集者":"Tapper Icon","植物學家":"Botanist","追蹤者":"Tracker",
  "漁夫":"Fisher","誘捕者":"Trapper","釣魚人":"Angler Icon","海盜":"Pirate","水手":"Mariner","誘餌大師":"Luremaster",
  "鬥士":"Fighter","偵察兵":"Scout","蠻力者":"Brute","防衛者":"Defender","雜技演員":"Acrobat","亡命之徒":"Desperado"
};

const BUNDLE_ICON_FILES_V26 = {
  spring_forage:"Spring Foraging Bundle",summer_forage:"Summer Foraging Bundle",fall_forage:"Fall Foraging Bundle",winter_forage:"Winter Foraging Bundle",construction:"Construction Bundle",exotic:"Exotic Foraging Bundle",
  spring_crops:"Spring Crops Bundle",summer_crops:"Summer Crops Bundle",fall_crops:"Fall Crops Bundle",quality_crops:"Quality Crops Bundle",animal:"Animal Bundle",artisan:"Artisan Bundle",
  river:"River Fish Bundle",lake:"Lake Fish Bundle",ocean:"Ocean Fish Bundle",night:"Night Fishing Bundle",crabpot:"Crab Pot Bundle",specialty:"Specialty Fish Bundle",
  blacksmith:"Blacksmith's Bundle",geologist:"Geologist's Bundle",adventurer:"Adventurer's Bundle",chef:"Chef's Bundle",dye:"Dye Bundle",field:"Field Research Bundle",fodder:"Fodder Bundle",enchanter:"Enchanter's Bundle",
  v2500:"2500 Bundle",v5000:"5000 Bundle",v10000:"10000 Bundle",v25000:"25000 Bundle"
};

const ITEM_FILE_ZH_V26 = {
  "野山葵":"Wild Horseradish","黃水仙":"Daffodil","黄水仙":"Daffodil","韭蔥":"Leek","韭葱":"Leek","蒲公英":"Dandelion","葡萄":"Grape","香味漿果":"Spice Berry","甜豌豆":"Sweet Pea",
  "普通蘑菇":"Common Mushroom","野梅":"Wild Plum","榛子":"Hazelnut","黑莓":"Blackberry","冬根":"Winter Root","水晶果":"Crystal Fruit","雪山藥":"Snow Yam","番紅花":"Crocus","番红花":"Crocus",
  "木材":"Wood","石頭":"Stone","硬木":"Hardwood","椰子":"Coconut","仙人掌果子":"Cactus Fruit","山洞蘿蔔":"Cave Carrot","山洞萝卜":"Cave Carrot","紅蘑菇":"Red Mushroom","红蘑菇":"Red Mushroom","紫蘑菇":"Purple Mushroom","枫糖浆":"Maple Syrup","楓糖漿":"Maple Syrup","橡樹樹脂":"Oak Resin","松焦油":"Pine Tar","羊肚菌":"Morel",
  "防風草":"Parsnip","防风草":"Parsnip","青豆":"Green Bean","花椰菜":"Cauliflower","土豆":"Potato","西紅柿":"Tomato","西红柿":"Tomato","辣椒":"Hot Pepper","藍莓":"Blueberry","蓝莓":"Blueberry","甜瓜":"Melon","玉米":"Corn","茄子":"Eggplant","南瓜":"Pumpkin","山藥":"Yam","山药":"Yam","紅葉卷心菜":"Red Cabbage",
  "大壺牛奶":"Large Milk","大雞蛋（棕）":"Large Brown Egg","大雞蛋（白）":"Large Egg","大瓶羊奶":"Large Goat Milk","動物毛":"Wool","动物毛":"Wool","鴨蛋":"Duck Egg","鸭蛋":"Duck Egg","鴨毛":"Duck Feather","鸭毛":"Duck Feather",
  "松露油":"Truffle Oil","布料":"Cloth","山羊奶酪":"Goat Cheese","奶酪":"Cheese","蜂蜜":"Honey","果醬":"Jelly","蘋果":"Apple","苹果":"Apple","杏子":"Apricot","橙子":"Orange","桃子":"Peach","石榴":"Pomegranate","櫻桃":"Cherry","樱桃":"Cherry",
  "河豚":"Pufferfish","鬼魚":"Ghostfish","鬼鱼":"Ghostfish","幽靈魚":"Spook Fish","幽灵鱼":"Spook Fish","沙魚":"Sandfish","沙鱼":"Sandfish","木躍魚":"Woodskip","木跃鱼":"Woodskip","鱘魚":"Sturgeon","鲟鱼":"Sturgeon","鰱魚":"Chub","鲢鱼":"Chub",
  "龍蝦":"Lobster","龙虾":"Lobster","小龍蝦":"Crayfish","小龙虾":"Crayfish","螃蟹":"Crab","鳥蛤":"Cockle","鸟蛤":"Cockle","蚌":"Mussel","蝦":"Shrimp","虾":"Shrimp","蝸牛":"Snail","蜗牛":"Snail","玉黍螺":"Periwinkle","牡蠣":"Oyster","牡蛎":"Oyster","蛤":"Clam",
  "銅錠":"Copper Bar","鐵錠":"Iron Bar","金錠":"Gold Bar","铱锭":"Iridium Bar","銥錠":"Iridium Bar","石英":"Quartz","地晶":"Earth Crystal","淚晶":"Frozen Tear","泪晶":"Frozen Tear","火水晶":"Fire Quartz","冰凍晶球":"Frozen Geode","冰冻晶球":"Frozen Geode",
  "史萊姆泥":"Slime","蝙蝠翅膀":"Bat Wing","太陽精華":"Solar Essence","虛空精華":"Void Essence","海膽":"Sea Urchin","海胆":"Sea Urchin","海藍寶石":"Aquamarine","海蓝宝石":"Aquamarine","紫水晶":"Amethyst","綠寶石":"Emerald","绿宝石":"Emerald","翡翠":"Jade","紅寶石":"Ruby","红宝石":"Ruby","黃玉":"Topaz","黄玉":"Topaz","鑽石":"Diamond","钻石":"Diamond","五彩碎片":"Prismatic Shard","黑曜石":"Obsidian","虎眼石":"Tigerseye","檸檬石":"Lemon Stone","柠檬石":"Lemon Stone","萬象晶洞":"Omni Geode","万象晶洞":"Omni Geode",
  "蕨菜":"Fiddlehead Fern","松露":"Truffle","虞美人花":"Poppy","向日葵":"Sunflower","鸚鵡螺":"Nautilus Shell","鹦鹉螺":"Nautilus Shell","小麥":"Wheat","小麦":"Wheat","乾草":"Hay","干草":"Hay","果酒":"Wine","兔子的腳":"Rabbit's Foot","兔子的脚":"Rabbit's Foot",
  "香蕉布丁":"Banana Pudding","黑莓脆皮饼":"Blackberry Cobbler","巧克力蛋糕":"Chocolate Cake","香辣鳗鱼":"Spicy Eel","救生汉堡":"Survival Burger","水果沙拉":"Fruit Salad","粉红蛋糕":"Pink Cake","粘土":"Clay",
  "虞美人籽松糕":"Poppyseed Muffin","沙拉":"Salad","蔬菜杂烩":"Vegetable Medley","面包":"Bread","电池组":"Battery Pack","乳酪花椰菜":"Cheese Cauliflower","矿工特供":"Miner's Treat","爆炒青椒":"Pepper Poppers","草莓":"Strawberry","红之盛宴":"Red Plate","块茎拼盘":"Roots Platter","椰汁汤":"Tom Kha Soup",
  "完美早餐":"Complete Breakfast","鲑鱼晚餐":"Salmon Dinner","蟹黄糕":"Crab Cakes","鱿鱼墨汁":"Squid Ink","鱿鱼":"Squid","苋菜":"Amaranth","咖啡":"Coffee","腌菜":"Pickles","仙人掌果子":"Cactus Fruit","枫糖棒":"Maple Bar","披萨":"Pizza","南瓜汤":"Pumpkin Soup","生鱼片":"Sashimi","虚空蛋":"Void Egg",
  "鱼肉卷":"Fish Taco","绿茶":"Green Tea","夏季亮片":"Summer Spangle","热带咖喱":"Tropical Curry","意式蕨菜炖饭":"Fiddlehead Risotto","豆类火锅":"Bean Hotpot","冰淇淋":"Ice Cream","大米布丁":"Rice Pudding","甜菜":"Beet","玫瑰仙子":"Fairy Rose","塞料面包":"Stuffing","郁金香":"Tulip","蒜":"Garlic","炒蘑菇":"Fried Mushroom","法式田螺":"Escargot","葡萄干布丁":"Plum Pudding","香酥鲈鱼":"Crispy Bass","帕尔玛奶酪茄子":"Eggplant Parmesan","炒鳗鱼":"Fried Eel","薄煎饼":"Pancakes","大黄派":"Rhubarb Pie","烤榛子":"Roasted Hazelnuts","秋日恩赐":"Autumn's Bounty","琉璃山药":"Glazed Yams","蓝莓千层酥":"Blueberry Tart","海之菜肴":"Dish O' The Sea","农夫午餐":"Farmer's Lunch","南瓜派":"Pumpkin Pie","牛奶":"Milk","蜜蜂酒":"Mead","淡啤酒":"Pale Ale","啤酒":"Beer","防风草汤":"Parsnip Soup","炸鱿鱼":"Fried Calamari","意大利面":"Spaghetti","蔓越莓糖果":"Cranberry Candy","姜汁汽水":"Ginger Ale","鲶鱼":"Catfish","海参":"Sea Cucumber","野山葵":"Wild Horseradish","芒果":"Mango","鸵鸟蛋":"Ostrich Egg","夏威夷芋泥":"Poi",
  "多数蔬菜":"Parsnip","水果":"Apple","花卉类":"Sunflower","矿石类":"Copper Ore","多数料理":"Fried Egg","采集品":"Common Mushroom","酒类":"Beer","鸡蛋类":"Egg","各种蛋":"Egg","野生采集物":"Wild Horseradish","各类宝石":"Amethyst","鱼类菜肴":"Fish Taco"
};

function itemFileZhV26(name){
  const raw=String(name||"").trim();
  const clean=raw.replace(/金星/g,"").replace(/\s*×\s*\d+.*/,"").trim();
  if(ITEM_FILE_ZH_V26[raw]||ITEM_FILE_ZH_V26[clean])return ITEM_FILE_ZH_V26[raw]||ITEM_FILE_ZH_V26[clean];
  const ci=(COOKING_INGREDIENTS_V3||[]).find(x=>x.name===raw||x.name===clean); if(ci)return ci.file;
  const cr=(COOKING_RECIPES_V3||[]).find(x=>x.name===raw||x.name===clean); if(cr)return cr.file;
  const fi=COLLECTIONS.fish.items.indexOf(raw)>=0?COLLECTIONS.fish.items.indexOf(raw):COLLECTIONS.fish.items.indexOf(clean); if(fi>=0)return FISH_ICON_FILES[fi];
  if(/^\d[\d,]*g/.test(raw))return "Gold";
  return "";
}

const STARDROP_SOURCES_V26 = [
  {id:"fair",name:"星露谷展覽會",desc:"用 2,000 星幣購買。"},
  {id:"mine100",name:"礦井 100 層",desc:"開啟第 100 層寶箱取得。"},
  {id:"spouse",name:"配偶／室友",desc:"關係達到 12.5 心後取得。"},
  {id:"krobus",name:"下水道・克羅巴斯",desc:"20,000g 購買。"},
  {id:"cannoli",name:"秘密森林・老坎諾利大師",desc:"給雕像一顆寶石甜莓後取得。"},
  {id:"angler",name:"垂釣大師",desc:"釣到所有魚後，隔天收到威利寄來的星之果實。"},
  {id:"museum",name:"博物館全收集",desc:"捐滿全部 95 件館藏後取得。"}
];

const FESTIVAL_GUIDE_V26 = {
  "彩蛋節":{desc:"鎮上舉行彩蛋狩獵；節日商店可以買草莓種子。",items:[["Strawberry Seeds","草莓種子"],["Straw Hat","草帽"]]},
  "沙漠節":{desc:"春 15–17 的三日沙漠活動，有每日挑戰、商店與各種臨時攤位。",items:[["Calico Egg","卡利科蛋"]]},
  "花舞節":{desc:"在煤礦森林舉行；和可交往角色達到 4 心後可以邀請對方跳舞。",items:[]},
  "夏威夷宴會":{desc:"把一樣食材放進公共湯鍋；州長的評價會影響與村民的友情。",items:[["Cauliflower","花椰菜"],["Super Cucumber","大海參"]]},
  "鱒魚大賽":{desc:"在煤礦森林釣虹鱒；拿到金色標籤後可在攤位換獎勵。",items:[["Rainbow Trout","虹鱒魚"],["Golden Tag","金色標籤"]]},
  "月光水母起舞":{desc:"晚上到海灘觀看月光水母遷徙，沒有競賽或需要準備的物品。",items:[]},
  "星露谷展覽會":{desc:"展示九樣物品並玩小遊戲賺星幣；2,000 星幣可換一顆星之果實。",items:[["Token","星幣"],["Stardrop","星之果實"]]},
  "萬靈節":{desc:"夜間進鎮走迷宮；迷宮終點可拿到黃金南瓜。",items:[["Golden Pumpkin","黃金南瓜"]]},
  "冰雪節":{desc:"冰釣比賽至少釣到 5 條魚才能獲勝；第一次獲勝會拿到釣具、磁鐵與水手帽，之後獲勝改給獎品券。",items:[["Barbed Hook","倒刺鉤"],["Dressed Spinner","精裝旋式魚餌"],["Magnet","磁鐵"],["Sailor's Cap","水手帽"],["Prize Ticket","獎品券"]]},
  "魷魚節":{desc:"冬 12–13 在海灘釣魷魚，依當日釣到的數量領不同階級獎勵。",items:[["Squid","魷魚"],["Mystery Box","謎之盒"]]},
  "夜市":{desc:"冬 15–17 晚上海灘開市；有商店、美人魚秀與深海潛水艇釣魚。",items:[["Pearl","珍珠"],["Blobfish","水滴魚"]]},
  "冬日星盛宴":{desc:"秘密送禮活動；到現場後把禮物送給指定村民，也會收到另一位村民的禮物。",items:[]}
};

'''
    if marker not in s: raise SystemExit('prefill marker missing')
    s=s.replace(marker,block+marker,1)

# ---------- State for secondary pages ----------
state='  const [farmSection, setFarmSection] = useState("animals");'
state_new='  const [farmSection, setFarmSection] = useState("animals");\n  const [skillSection, setSkillSection] = useState("skills");\n  const [bundleRoom, setBundleRoom] = useState("crafts");'
if state_new not in s:
    if state not in s: raise SystemExit('farm state missing')
    s=s.replace(state,state_new,1)

# ---------- Calendar metadata ----------
s=s.replace('if (currentCalendar.festivals[day]) out.push({type:"festival", text:currentCalendar.festivals[day]});','if (currentCalendar.festivals[day]) out.push({type:"festival", text:currentCalendar.festivals[day], key:currentCalendar.festivals[day]});',1)
s=s.replace('if (currentCalendar.birthdays[day] && !(data.base.season === "春" && day === 4 && data.base.year < 2)) out.push({type:"birthday", text:`${currentCalendar.birthdays[day]}生日`});','if (currentCalendar.birthdays[day] && !(data.base.season === "春" && day === 4 && data.base.year < 2)) out.push({type:"birthday", text:`${currentCalendar.birthdays[day]}生日`, npc:currentCalendar.birthdays[day]});',1)

# ---------- Farm profile: quick year chooser ----------
old='<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:7}}>{SEASONS.map(s=><Pill key={s} small active={data.base.season===s} onClick={()=>updateBase({season:s})}>{SEASON_ICON[s]} {s}</Pill>)}</div>'
new=r'''<div style={{display:"grid",gridTemplateColumns:"28px auto 28px",alignItems:"center",gap:5,marginTop:7,width:"fit-content"}}><button onClick={()=>updateBase({year:Math.max(1,Number(data.base.year||1)-1)})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:7,height:26,fontWeight:950,color:C.brown,padding:0}}>−</button><div style={{fontSize:11,fontWeight:950,color:C.darkBrown,textAlign:"center",minWidth:52}}>第 {data.base.year} 年</div><button onClick={()=>updateBase({year:Math.min(99,Number(data.base.year||1)+1)})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:7,height:26,fontWeight:950,color:C.brown,padding:0}}>＋</button></div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:5}}>{SEASONS.map(s=><Pill key={s} small active={data.base.season===s} onClick={()=>updateBase({season:s})}>{SEASON_ICON[s]} {s}</Pill>)}</div>'''
if old not in s: raise SystemExit('profile season row missing')
s=s.replace(old,new,1)

# ---------- Rich today card ----------
cal_marker='  const renderCalendar = () => {'
if 'const renderTodayCalendarItemV26' not in s:
    helper=r'''  const renderMiniItemV26 = (name, tone=C.cream) => {
    const file=itemFileZhV26(name);
    return <div key={name} style={{width:54,minWidth:54,border:`1px solid ${C.line}`,background:tone,borderRadius:8,padding:"4px 2px",textAlign:"center"}}>{file?<GameIcon file={file} size={26} alt={name}/>:<div style={{height:26,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>•</div>}<div style={{fontSize:7.2,fontWeight:900,color:C.ink,lineHeight:1.05,marginTop:2,overflow:"hidden",textOverflow:"ellipsis"}}>{name}</div></div>;
  };

  const renderTodayCalendarItemV26 = (it) => {
    if(it.type==="birthday"){
      const gift=NPC_GIFTS[it.npc];
      return <div key={it.text} style={{marginTop:7,padding:"8px 9px",borderRadius:9,background:"#FFF1CF",border:`1.5px solid ${C.line}`}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file={NPC_ICON_FILES[it.npc]} size={34}/><div><b style={{fontSize:12.5,color:C.brown}}>🎂 {it.npc}生日</b><div style={{fontSize:9,color:C.muted,marginTop:1}}>最愛禮物・直接照圖找</div></div></div>{gift?.love?.length>0&&<div style={{display:"flex",gap:4,overflowX:"auto",marginTop:6,paddingBottom:2}}>{gift.love.slice(0,8).map(x=>renderMiniItemV26(x,"#FFF8E3"))}</div>}</div>;
    }
    if(it.type==="festival"){
      const g=FESTIVAL_GUIDE_V26[it.key];
      return <div key={it.text} style={{marginTop:7,padding:"8px 9px",borderRadius:9,background:"#FFF1CF",border:`1.5px solid ${C.line}`}}><b style={{fontSize:12.5,color:C.brown}}>🎪 今日：{it.text}</b>{g?<><div style={{fontSize:10,color:C.ink,lineHeight:1.45,marginTop:3}}>{g.desc}</div>{g.items?.length>0&&<div style={{display:"flex",gap:4,overflowX:"auto",marginTop:6,paddingBottom:2}}>{g.items.map(([file,name])=><div key={name} style={{width:58,minWidth:58,border:`1px solid ${C.line}`,background:"#FFF8E3",borderRadius:8,padding:"4px 2px",textAlign:"center"}}><GameIcon file={file} size={27} alt={name}/><div style={{fontSize:7.2,fontWeight:900,color:C.ink,lineHeight:1.05,marginTop:2}}>{name}</div></div>)}</div>}</>:null}</div>;
    }
    return <div key={it.text} style={{marginTop:7,padding:"7px 9px",borderRadius:8,background:"#FFF1CF",fontSize:11,fontWeight:900,color:C.brown}}>{it.text}</div>;
  };

'''
    if cal_marker not in s: raise SystemExit('calendar marker missing')
    s=s.replace(cal_marker,helper+cal_marker,1)
old_today='{todayItems.length>0 && <div style={{marginTop:7,padding:"7px 9px",borderRadius:8,background:"#FFF1CF",fontSize:12,fontWeight:900,color:C.brown}}>今天：{todayItems.map(x=>x.text).join("、")}</div>}'
new_today='{todayItems.length>0 && <div>{todayItems.map(renderTodayCalendarItemV26)}</div>}'
if old_today not in s: raise SystemExit('today card missing')
s=s.replace(old_today,new_today,1)

# ---------- Skills: four secondary icon pages ----------
start=s.index('  const renderSkills = () => <div>')
end=s.index('  const renderBundles = () => <div>',start)
new_skills=r'''  const renderSkills = () => {
    const SkillTab=({id,label,file})=>{const active=skillSection===id;return <button onClick={()=>setSkillSection(id)} style={{border:`2px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:11,padding:"6px 3px 5px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={file} size={35}/><span style={{fontSize:9.5,fontWeight:950,color:active?C.darkBrown:C.muted}}>{label}</span></button>};
    const professionButton=(p,active,onClick)=><button key={p} onClick={onClick} style={{border:`1.5px solid ${active?C.green:C.line}`,background:active?"#EEF7DD":C.paper,borderRadius:9,padding:"5px 3px",display:"flex",alignItems:"center",gap:5,textAlign:"left",cursor:"pointer",minWidth:0}}><GameIcon file={PROF_ICON_FILES_V26[p]} size={29}/><span style={{fontSize:8.8,fontWeight:950,color:active?C.green:C.ink,lineHeight:1.1}}>{active?"✓ ":""}{p}</span></button>;
    const drops=data.stardropsV2||[];
    const autoDrop=id=>id==="mine100"?Number(data.mine?.normal||0)>=100:id==="angler"?(data.collections?.fish||[]).length>=FISH_ICON_FILES.length:id==="museum"?(data.achievementsV2||[]).includes("museum_all"):false;
    const toggleDrop=id=>{if(autoDrop(id))return;update({stardropsV2:drops.includes(id)?drops.filter(x=>x!==id):[...drops,id]})};
    return <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:8}}><SkillTab id="skills" label="技能" file="Skills Tab Icon"/><SkillTab id="mine" label="礦井" file="Mines Entrance"/><SkillTab id="mastery" label="精通" file="Stardrop"/><SkillTab id="stardrops" label="星之果實" file="Stardrop"/></div>
      {skillSection==="skills"&&<><SectionTitle icon="⭐">技能等級與專精</SectionTitle><div style={{display:"grid",gap:7}}>{SKILLS.map(sk=>{const lv=Number(data.skills?.[sk.id]||0),l5=sk.id+"5",l10=sk.id+"10",p5=data.prof?.[l5]||"";return <Card key={sk.id} style={{padding:8}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file={SKILL_ICON_FILES[sk.id]} size={31}/><b style={{fontSize:12,color:C.ink,flex:1}}>{sk.name}</b><NumInput value={lv} max={10} onChange={v=>updateNested("skills",{[sk.id]:v})} suffix="級"/></div><div style={{marginTop:5}}><ProgressBar value={lv} max={10}/></div>{lv>=5&&<div style={{marginTop:7}}><div style={{fontSize:9,color:C.muted,fontWeight:950,marginBottom:4}}>5 級專精</div><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:4}}>{PROF[sk.id].l5.map(p=>professionButton(p,p5===p,()=>updateNested("prof",{[l5]:p,[l10]:""})))}</div></div>}{lv>=10&&p5&&PROF[sk.id].l10[p5]&&<div style={{marginTop:7}}><div style={{fontSize:9,color:C.muted,fontWeight:950,marginBottom:4}}>10 級專精</div><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:4}}>{PROF[sk.id].l10[p5].map(p=>professionButton(p,data.prof?.[l10]===p,()=>updateNested("prof",{[l10]:p})))}</div></div>}</Card>})}</div></>}
      {skillSection==="mine"&&<><SectionTitle icon="⛏️">礦井樓層</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}><Card style={{padding:9,textAlign:"center"}}><GameIcon file="Mines Entrance" size={52}/><b style={{display:"block",fontSize:11,color:C.ink,marginTop:3}}>普通礦井</b><div style={{marginTop:6}}><NumInput value={data.mine.normal} max={120} onChange={v=>updateNested("mine",{normal:v})} suffix="層"/></div><div style={{marginTop:6}}><ProgressBar value={data.mine.normal} max={120} color={C.blue}/></div></Card><Card style={{padding:9,textAlign:"center"}}><GameIcon file="Skull Key" size={52}/><b style={{display:"block",fontSize:11,color:C.ink,marginTop:3}}>骷髏洞窟最佳</b><div style={{marginTop:6}}><NumInput value={data.mine.skullBest} max={999} onChange={v=>updateNested("mine",{skullBest:v})} suffix="層"/></div></Card></div></>}
      {skillSection==="mastery"&&<><SectionTitle icon="✨">精通</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:7}}>{MASTERY_POWERS_V2.map(m=>{const on=(data.mastery||[]).includes(m.id);return <button key={m.id} onClick={()=>update({mastery:on?data.mastery.filter(x=>x!==m.id):[...new Set([...(data.mastery||[]),m.id])]})} style={{border:`2px solid ${on?C.green:C.line}`,background:on?"#EEF7DD":C.paper,borderRadius:10,padding:8,textAlign:"left",cursor:"pointer"}}><div style={{display:"flex",alignItems:"center",gap:6}}><GameIcon file={m.file} size={34}/><b style={{fontSize:10,color:on?C.green:C.ink}}>{on?"✓ ":""}{m.name}</b></div><div style={{fontSize:8.5,color:C.muted,lineHeight:1.35,marginTop:4}}>{m.desc}</div></button>})}</div></>}
      {skillSection==="stardrops"&&<><SectionTitle icon="✨">7 顆星之果實</SectionTitle><div style={{display:"grid",gap:6}}>{STARDROP_SOURCES_V26.map(d=>{const auto=autoDrop(d.id),on=auto||drops.includes(d.id);return <Card key={d.id} style={{padding:8,background:on?"#EEF7DD":C.paper}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file="Stardrop" size={31}/><div style={{flex:1}}><b style={{fontSize:11,color:on?C.green:C.ink}}>{d.name}</b><div style={{fontSize:8.8,color:C.muted,lineHeight:1.35,marginTop:2}}>{d.desc}</div></div><button disabled={auto} onClick={()=>toggleDrop(d.id)} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?C.lightGreen:C.cream,borderRadius:7,padding:"4px 6px",fontWeight:950,color:on?C.green:C.muted,fontSize:10}}>{on?"✓":"○"}</button></div></Card>})}</div></>}
    </div>;
  };

'''
s=s[:start]+new_skills+s[end:]

# ---------- Community Center: room tabs + visual bundle items ----------
start=s.index('  const renderBundles = () => <div>')
end=s.index('  const renderFarm = () => {',start)
new_bundles=r'''  const renderBundles = () => {
    const room=BUNDLE_ROOMS.find(r=>r.id===bundleRoom)||BUNDLE_ROOMS[0], done=roomDone(room);
    const RoomTab=({r})=>{const rd=roomDone(r),active=room.id===r.id;return <button onClick={()=>setBundleRoom(r.id)} style={{border:`2px solid ${active?C.orange:rd?C.green:C.line}`,background:active?"#FFE2A8":rd?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 2px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={ROOM_ICON_FILES[r.id]} size={31}/><span style={{fontSize:8.5,fontWeight:950,color:active?C.darkBrown:rd?C.green:C.muted}}>{rd?"✓ ":""}{r.name}</span></button>};
    return <div><SectionTitle icon="📦">社區中心 <span style={{color:C.orange}}>{rp.done}/30</span></SectionTitle><Card style={{padding:8}}><ProgressBar value={rp.done} max={30} color={C.orange}/></Card><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6,marginTop:8}}>{BUNDLE_ROOMS.map(r=><RoomTab key={r.id} r={r}/>)}</div><div style={{display:"flex",alignItems:"center",gap:7,marginTop:10}}><GameIcon file={ROOM_ICON_FILES[room.id]} size={34}/><div style={{flex:1}}><b style={{fontSize:13,color:C.darkBrown}}>{room.name}</b><div style={{fontSize:9,color:C.muted}}>{room.bundles.length} 個收集包</div></div><button onClick={()=>toggleRoom(room.id,!done)} style={{border:`1.5px solid ${done?C.green:C.line}`,background:done?C.lightGreen:C.cream,borderRadius:8,padding:"5px 7px",fontWeight:950,color:done?C.green:C.brown,fontSize:9.5}}>{done?"✓ 整室完成":"整室完成"}</button></div><div style={{display:"grid",gap:7,marginTop:7}}>{room.bundles.map(b=>{const got=data.bundleItems[b.id]||[],need=b.need||b.items.length,bDone=done||got.length>=need;return <Card key={b.id} style={{padding:8,background:bDone?"#F0F8DF":C.paper,borderColor:bDone?C.green:C.line}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file={BUNDLE_ICON_FILES_V26[b.id]} size={38}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:11,color:bDone?C.green:C.brown}}>{b.name}</b><div style={{fontSize:8.5,color:C.muted,marginTop:1}}>完成 {Math.min(got.length,need)}/{need}{b.need?"（任選）":""}</div></div></div><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{b.items.map(it=>{const checked=done||got.includes(it),file=itemFileZhV26(it),gold=it.includes("金星");return <button key={it} disabled={done} onClick={()=>updateNested("bundleItems",{[b.id]:checked?got.filter(x=>x!==it):[...got,it]})} style={{position:"relative",border:`1.5px solid ${checked?C.green:C.line}`,background:checked?"#E5F3CF":C.paper,borderRadius:8,padding:"5px 2px",minHeight:68,cursor:done?"default":"pointer",opacity:done?.78:1}}><div style={{height:31,display:"flex",alignItems:"center",justifyContent:"center"}}>{file?<GameIcon file={file} size={29} alt={it}/>:<span style={{fontSize:12,color:C.muted}}>•</span>}{gold&&<span style={{position:"absolute",right:3,top:2,color:C.gold,fontSize:11}}>★</span>}</div><div style={{fontSize:7.1,fontWeight:900,color:checked?C.green:C.ink,lineHeight:1.05,marginTop:2}}>{it}</div></button>})}</div></Card>})}</div></div>;
  };

'''
s=s[:start]+new_bundles+s[end:]

# ---------- Farm buildings and machine outputs ----------
# richer machine definitions
mstart=s.index('    const machineDefs=[')
mend=s.index('    ];',mstart)+6
new_machine=r'''    const machineDefs=[
      ["keg","小桶","Keg",["Wine","Juice","Beer","Coffee"]],["jar","罐頭瓶","Preserves Jar",["Jelly","Pickles","Aged Roe"]],["cheese","起司壓製機","Cheese Press",["Cheese","Goat Cheese"]],["mayo","美乃滋機","Mayonnaise Machine",["Mayonnaise","Duck Mayonnaise","Void Mayonnaise","Dinosaur Mayonnaise"]],
      ["loom","織布機","Loom",["Cloth"]],["oil","產油機","Oil Maker",["Truffle Oil","Oil"]],["dehydrator","脫水機","Dehydrator",["Dried Fruit","Dried Mushrooms","Raisins"]],["smoker","燻魚機","Fish Smoker",["Tuna","Sturgeon"]],
      ["seed","種子生產器","Seed Maker",["Parsnip Seeds","Mixed Seeds"]],["furnace","熔爐","Furnace",["Copper Bar","Iron Bar","Gold Bar","Iridium Bar"]],["recycling","回收機","Recycling Machine",["Wood","Stone","Refined Quartz"]],["crystalarium","寶石複製機","Crystalarium",["Diamond","Ruby","Jade"]],
      ["bee","蜂房","Bee House",["Honey"]],["cask","木桶","Cask",["Wine","Cheese","Goat Cheese"]]
    ];'''
s=s[:mstart]+new_machine+s[mend:]

# building helper state
insert='    const buildingCount=key=>{'
if 'const buildingLevels=data.buildingLevels||{};' not in s:
    add='''    const buildingLevels=data.buildingLevels||{};\n    const setBuildingLevel=(key,value)=>update({buildingLevels:{...buildingLevels,[key]:value}});\n'''
    if insert not in s: raise SystemExit('buildingCount marker missing')
    s=s.replace(insert,add+insert,1)

# CountTile + MachineTile
ct_start=s.index('    const CountTile=({name,file,count,onMinus,onPlus,sub})=>')
ct_end=s.index('    return <div>',ct_start)
new_tiles=r'''    const CountTile=({name,file,count,onMinus,onPlus,sub,onImageClick,products=[]})=><div style={{border:`1.5px solid ${count>0?C.green:C.line}`,background:count>0?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 4px",textAlign:"center"}}>{onImageClick?<button onClick={onImageClick} style={{display:"block",width:"100%",border:0,background:"transparent",padding:0,cursor:"pointer"}}><BuildingImage file={file} active={count>0}/></button>:<BuildingImage file={file} active={count>0}/>}<div style={{fontSize:9,fontWeight:950,color:C.ink}}>{name}</div>{sub&&<div style={{fontSize:7.5,color:C.muted,fontWeight:850,minHeight:10}}>{sub}</div>}{products.length>0&&<div style={{display:"flex",justifyContent:"center",gap:2,flexWrap:"wrap",minHeight:21,marginTop:3}}>{products.slice(0,4).map(x=><GameIcon key={x} file={x} size={18}/>)}</div>}<div style={{display:"grid",gridTemplateColumns:"22px 1fr 22px",gap:2,alignItems:"center",marginTop:4}}><button onClick={onMinus} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>−</button><b style={{fontSize:10.5,color:count>0?C.green:C.muted}}>×{count}</b><button onClick={onPlus} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>＋</button></div></div>;
    const MachineTile=({id,name,file,products})=>{const n=Number(data.machines?.[id]||0);return <CountTile name={name} file={file} products={products} count={n} onMinus={()=>setMachineCount(id,n-1)} onPlus={()=>setMachineCount(id,n+1)}/>};
'''
s=s[:ct_start]+new_tiles+s[ct_end:]

# Buildings subpage
bstart=s.index('      {farmSection==="buildings"&&<>')
bend=s.index('      {farmSection==="tools"&&<>',bstart)
new_buildings=r'''      {farmSection==="buildings"&&<>
        <SectionTitle icon="🏗️">建築</SectionTitle>
        <Card style={{padding:7}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>
          <button onClick={()=>update({house:(Number(data.house||0)+1)%HOUSE_LEVELS.length})} style={{border:`1.5px solid ${C.green}`,background:"#EEF7DD",borderRadius:10,padding:"5px 4px",textAlign:"center",cursor:"pointer"}}><BuildingImage file={houseFiles[Number(data.house||0)]||"House (tier 1)"} active={true}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>農舍</div><div style={{fontSize:7.5,color:C.green,fontWeight:900,marginTop:2}}>{HOUSE_LEVELS[Number(data.house||0)]}</div><div style={{fontSize:6.8,color:C.muted,marginTop:2}}>點圖升級</div></button>
          <CountTile name="雞舍" file={coopFiles[Number(data.buildings?.coop||0)]||"Coop"} count={buildingCount("coop")} sub={COOP_LEVELS[Number(data.buildings?.coop||0)]} onImageClick={()=>buildingCount("coop")>0&&cycleLevel("coop",COOP_LEVELS)} onMinus={()=>setBuildingCount("coop",buildingCount("coop")-1)} onPlus={()=>setBuildingCount("coop",buildingCount("coop")+1)}/>
          <CountTile name="牲口棚" file={barnFiles[Number(data.buildings?.barn||0)]||"Barn"} count={buildingCount("barn")} sub={BARN_LEVELS[Number(data.buildings?.barn||0)]} onImageClick={()=>buildingCount("barn")>0&&cycleLevel("barn",BARN_LEVELS)} onMinus={()=>setBuildingCount("barn",buildingCount("barn")-1)} onPlus={()=>setBuildingCount("barn",buildingCount("barn")+1)}/>
          <CountTile name="小屋" file={Number(buildingLevels.shed||0)>0?"Big Shed":"Shed"} count={buildingCount("shed")} sub={Number(buildingLevels.shed||0)>0?"大型小屋":"小屋"} onImageClick={()=>buildingCount("shed")>0&&setBuildingLevel("shed",Number(buildingLevels.shed||0)>0?0:1)} onMinus={()=>setBuildingCount("shed",buildingCount("shed")-1)} onPlus={()=>setBuildingCount("shed",buildingCount("shed")+1)}/>
          <CountTile name="筒倉" file="Silo" count={buildingCount("silo")} onMinus={()=>setBuildingCount("silo",buildingCount("silo")-1)} onPlus={()=>setBuildingCount("silo",buildingCount("silo")+1)}/>
          <CountTile name="水井" file="Well" count={buildingCount("well")} onMinus={()=>setBuildingCount("well",buildingCount("well")-1)} onPlus={()=>setBuildingCount("well",buildingCount("well")+1)}/>
          <CountTile name="磨坊" file="Mill" count={buildingCount("mill")} onMinus={()=>setBuildingCount("mill",buildingCount("mill")-1)} onPlus={()=>setBuildingCount("mill",buildingCount("mill")+1)}/>
          <CountTile name="馬廄" file="Horse Stable" count={buildingCount("stable")} onMinus={()=>setBuildingCount("stable",buildingCount("stable")-1)} onPlus={()=>setBuildingCount("stable",buildingCount("stable")+1)}/>
          <CountTile name="史萊姆窩" file="Slime Hutch" count={buildingCount("slime")} onMinus={()=>setBuildingCount("slime",buildingCount("slime")-1)} onPlus={()=>setBuildingCount("slime",buildingCount("slime")+1)}/>
          <CountTile name="連線小屋" file="Log Cabin" count={buildingCount("cabin")} onMinus={()=>setBuildingCount("cabin",buildingCount("cabin")-1)} onPlus={()=>setBuildingCount("cabin",buildingCount("cabin")+1)}/>
          <CountTile name="祝尼魔小屋" file="Junimo Hut" count={buildingCount("junimo")} onMinus={()=>setBuildingCount("junimo",buildingCount("junimo")-1)} onPlus={()=>setBuildingCount("junimo",buildingCount("junimo")+1)}/>
          <button onClick={()=>setBuildingCount("greenhouse",buildingCount("greenhouse")?0:1)} style={{border:`1.5px solid ${buildingCount("greenhouse")?C.green:C.line}`,background:buildingCount("greenhouse")?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 4px",textAlign:"center",cursor:"pointer"}}><BuildingImage file="Greenhouse" active={buildingCount("greenhouse")>0}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>溫室</div><div style={{fontSize:8,color:buildingCount("greenhouse")?C.green:C.muted,fontWeight:950,marginTop:3}}>{buildingCount("greenhouse")?"✓ 已建造":"○ 未建造"}</div></button>
        </div><div style={{fontSize:8.5,color:C.muted,marginTop:6,lineHeight:1.4}}>農舍／雞舍／牲口棚／小屋：直接點建築圖循環升級；可蓋多座的建築保留數量 ±；溫室這類單一建築只記已建造／未建造。</div></Card>
      </>}

'''
s=s[:bstart]+new_buildings+s[bend:]

# machine render map gets output icons
s=s.replace('{machineDefs.map(([id,name,file])=><MachineTile key={id} id={id} name={name} file={file}/>)}','{machineDefs.map(([id,name,file,products])=><MachineTile key={id} id={id} name={name} file={file} products={products}/>)}',1)

# ---------- Social gifts: icon grids ----------
pstart=s.index('  const renderPeople = () => {')
pend=s.index('\n\n  const powersState',pstart)
new_people=r'''  const renderPeople = () => {
    const g=NPC_GROUPS.find(x=>x.id===socialGroup)||NPC_GROUPS[0];
    const GiftGrid=({title,items,tone})=><div style={{marginTop:6}}><div style={{fontSize:9,fontWeight:950,color:tone,marginBottom:4}}>{title}</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4}}>{(items||[]).map(item=>{const file=itemFileZhV26(item),unknown=item.includes("百科");return <div key={item} style={{border:`1px solid ${C.line}`,background:unknown?"#F2ECE0":C.paper,borderRadius:8,padding:"4px 2px",textAlign:"center",minHeight:55}}>{file?<GameIcon file={file} size={27} alt={item}/>:<div style={{height:27,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:C.muted}}>•</div>}<div style={{fontSize:7.1,fontWeight:900,color:C.ink,lineHeight:1.05,marginTop:2}}>{item}</div></div>})}</div></div>;
    return <div><SectionTitle icon="💛">社交</SectionTitle><div style={{display:"flex",gap:6,marginTop:7,flexWrap:"wrap"}}>{NPC_GROUPS.map(x=><Pill key={x.id} active={socialGroup===x.id} onClick={()=>{setSocialGroup(x.id);setExpandedNPC(null)}}>{x.id==="single"?"可交往對象":x.id==="town"?"村民":"特殊角色"}</Pill>)}</div><div style={{display:"grid",gap:7,marginTop:8}}>{g.list.map(n=>{const hearts=Number(data.friendship?.[n]||0),open=expandedNPC===n,gift=NPC_GIFTS[n];return <Card key={n} style={{padding:8}}><div onClick={()=>setExpandedNPC(open?null:n)} style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer"}}><GameIcon file={NPC_ICON_FILES[n]} size={38}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:12,color:C.ink}}>{n}</b>{gift?.love?.length>0&&<div style={{display:"flex",gap:2,marginTop:2}}>{gift.love.slice(0,4).map(x=>{const f=itemFileZhV26(x);return f?<GameIcon key={x} file={f} size={18} alt={x}/>:null})}</div>}</div><span style={{fontSize:11,color:C.red,fontWeight:950}}>♥ {hearts}/{g.max}</span><span style={{color:C.brown,fontWeight:950}}>{open?"▲":"▼"}</span></div><div style={{display:"flex",gap:2,flexWrap:"wrap",marginTop:5}}>{Array.from({length:g.max},(_,i)=><button key={i} onClick={()=>updateNested("friendship",{[n]:i+1===hearts?i:i+1})} style={{border:0,background:"transparent",padding:0,fontSize:15,color:i<hearts?C.red:"#D8CFC3",cursor:"pointer"}}>♥</button>)}</div>{open&&<div style={{marginTop:7,paddingTop:6,borderTop:`1px dashed ${C.line}`}}>{gift&&<><GiftGrid title="❤ 最愛" items={gift.love} tone={C.red}/><GiftGrid title="● 喜歡" items={gift.like} tone={C.green}/><GiftGrid title="× 不喜歡／討厭" items={gift.hate} tone={C.muted}/></>}<div style={{marginTop:7}}><WikiBtn name={NPC_WIKI[n]||n}/></div></div>}</Card>})}</div></div>;
  };
'''
s=s[:pstart]+new_people+s[pend:]

p.write_text(s,encoding='utf-8')
print('v26 visual data redesign applied')
