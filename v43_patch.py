from pathlib import Path

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

old='''    (MINE_BANDS_V28||[]).forEach(group=>(group.items||[]).forEach(([file,name])=>ensure(name,file,"mine")));
    const all=[...index.values()].sort((a,b)=>a.name.localeCompare(b.name,"zh-Hant"));
    const q=itemUsageQueryV42.trim().toLowerCase();
    const quickNames=["五彩碎片","恐龍蛋","遠古種子","兔子的腳","電池組","硬木","鑽石","茶葉"];
    const results=(q?all.filter(it=>[it.name,it.file,...it.aliases].join(" ").toLowerCase().includes(q)):quickNames.map(name=>all.find(it=>it.aliases.has(name)||it.name===name)).filter(Boolean)).slice(0,30);
'''
new='''    (MINE_BANDS_V28||[]).forEach(group=>(group.items||[]).forEach(([file,name])=>ensure(name,file,"mine")));

    // v43：物品搜尋統一支援繁中／簡中／英文。
    // 同一個英文素材名在既有中英對照表中的所有繁簡名稱，都自動加入 alias。
    const aliasesByFileV43=new Map();
    Object.entries(ITEM_FILE_ZH_V26||{}).forEach(([alias,file])=>{
      const key=String(file||""); if(!key)return;
      if(!aliasesByFileV43.has(key))aliasesByFileV43.set(key,new Set());
      aliasesByFileV43.get(key).add(cleanName(alias));
    });
    index.forEach(it=>{(aliasesByFileV43.get(String(it.file||""))||[]).forEach(alias=>it.aliases.add(alias))});

    // 常見攻略／口語別名：不改顯示名稱，只增加搜尋命中。
    const ITEM_SEARCH_EXTRA_ALIASES_V43={
      "Topaz":["黃寶石","黄宝石"],
      "Prismatic Shard":["彩虹碎片"],
      "Ancient Seed":["古代種子","古代种子"],
      "Battery Pack":["電池","电池"]
    };
    Object.entries(ITEM_SEARCH_EXTRA_ALIASES_V43).forEach(([file,aliases])=>{const it=index.get(file);if(it)aliases.forEach(x=>it.aliases.add(x))});

    // 將常見繁體字正規化成簡體後再比對；英文統一小寫並忽略空白／分隔符。
    const SEARCH_T2S_PAIRS_V43=[
      "黃黄","藍蓝","綠绿","紅红","銀银","銅铜","鐵铁","銥铱","礦矿","寶宝","鑽钻","遠远","種种","樹树","葉叶","電电","爐炉","鍋锅","製制","煉炼","絲丝","繩绳","體体","馬马","雞鸡","鴨鸭","龍龙","豬猪","貓猫","魚鱼","蝦虾","蝸蜗","蠣蛎","鸚鹦","鵡鹉","鮭鲑","鱸鲈","鯉鲤","鯰鲶","鯛鲷","鱒鳟","鯡鲱","鰻鳗","魷鱿","鱘鲟","槍枪","蔥葱","蘿萝","蔔卜","蘋苹","櫻樱","醬酱","麥麦","乾干","薑姜","蘚藓","蕪芜","纖纤","維维","濃浓","鬆松","餅饼","麵面","湯汤","飯饭","餃饺","燴烩","燻熏","鹽盐","鋼钢","鎬镐","鋤锄","劍剑","環环","鏡镜","褲裤","飾饰","項项","鏈链","鈴铃","鑰钥","滾滚","輪轮","機机","殘残","頁页","筆笔","記记","書书","圖图","鑑鉴","場场","鎮镇","島岛","灣湾","澤泽","層层","區区","傳传","說说","獎奖","勵励","殺杀","敵敌","萬万","數数","據据","應应","該该","夠够","賣卖","買买","獲获","釣钓","採采","網网","燈灯","漿浆","鳳凤","鬱郁","蘭兰","楓枫","膠胶","鴕鸵","鳥鸟","殼壳","貝贝","塊块","錠锭","髮发","顏颜","齒齿","頭头","盔盔","樂乐","鐘钟","劉刘","亞亚","麗丽","羅罗","喬乔","爾尔","薩萨","蘇苏","魯鲁"
    ];
    const SEARCH_T2S_V43=Object.fromEntries(SEARCH_T2S_PAIRS_V43.map(x=>[x[0],x[1]]));
    const normalizeItemSearchV43=value=>String(value||"").normalize("NFKC").toLowerCase().replace(/[\\s·・_'’\\-]+/g,"").split("").map(ch=>SEARCH_T2S_V43[ch]||ch).join("");

    const all=[...index.values()].sort((a,b)=>a.name.localeCompare(b.name,"zh-Hant"));
    const q=normalizeItemSearchV43(itemUsageQueryV42);
    const quickNames=["五彩碎片","恐龍蛋","遠古種子","兔子的腳","電池組","硬木","鑽石","茶葉"];
    const results=(q?all.filter(it=>[it.name,it.file,...it.aliases].some(alias=>normalizeItemSearchV43(alias).includes(q))):quickNames.map(name=>all.find(it=>it.aliases.has(name)||it.name===name)).filter(Boolean)).slice(0,30);
'''
if old not in s:
    raise SystemExit('v43 target search block not found')
s=s.replace(old,new,1)
s=s.replace('placeholder="輸入物品名稱，例如：五彩碎片、鑽石、硬木…"','placeholder="可輸入繁中／簡中／English，例如：黃玉、黄玉、Topaz…"',1)
s=s.replace('目前本機資料沒有找到；可換同義名稱，或直接用 Wiki 查。','目前本機資料沒有找到；可改用繁中／簡中／英文名稱，或直接用 Wiki 查。',1)
p.write_text(s,encoding='utf-8')

p=Path('index.html');s=p.read_text(encoding='utf-8');s=s.replace('?v=42','?v=43').replace('deploy-v42','deploy-v43');p.write_text(s,encoding='utf-8')
p=Path('sw.js');s=p.read_text(encoding='utf-8').replace('stardew-tracker-v42','stardew-tracker-v43');p.write_text(s,encoding='utf-8')
