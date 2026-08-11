const { useState, useEffect, useRef } = React;

/* ================= 星露谷 1.6 資料 ================= */
const SEASONS = ["春", "夏", "秋", "冬"];
const SEASON_ICON = { 春: "🌸", 夏: "☀️", 秋: "🍁", 冬: "❄️" };

const SKILLS = [
  { id: "farming", name: "耕種", icon: "🌾" },
  { id: "mining", name: "採礦", icon: "⛏️" },
  { id: "foraging", name: "採集", icon: "🍂" },
  { id: "fishing", name: "釣魚", icon: "🎣" },
  { id: "combat", name: "戰鬥", icon: "⚔️" },
];

const PROF = {
  farming: { l5: ["牧場主", "農耕者"], l10: { 牧場主: ["雞舍大師", "牧羊人"], 農耕者: ["工匠", "農業學家"] } },
  mining: { l5: ["礦工", "地質學家"], l10: { 礦工: ["鐵匠", "探礦者"], 地質學家: ["挖掘者", "寶石學家"] } },
  foraging: { l5: ["樵夫", "採集者"], l10: { 樵夫: ["伐木工", "樹汁採集者"], 採集者: ["植物學家", "追蹤者"] } },
  fishing: { l5: ["漁夫", "誘捕者"], l10: { 漁夫: ["釣魚人", "海盜"], 誘捕者: ["水手", "誘餌大師"] } },
  combat: { l5: ["鬥士", "偵察兵"], l10: { 鬥士: ["蠻力者", "防衛者"], 偵察兵: ["雜技演員", "亡命之徒"] } },
};

/* need: null=全要, 數字=任 N 項 */
const BUNDLE_ROOMS = [
  {
    id: "crafts", name: "工藝室", icon: "🧺",
    bundles: [
      { id: "spring_forage", name: "春季覓食收集包", need: null, items: ["野山葵", "黃水仙", "韭蔥", "蒲公英"] },
      { id: "summer_forage", name: "夏季覓食收集包", need: null, items: ["葡萄", "香味漿果", "甜豌豆"] },
      { id: "fall_forage", name: "秋季覓食收集包", need: null, items: ["普通蘑菇", "野梅", "榛子", "黑莓"] },
      { id: "winter_forage", name: "冬季覓食收集包", need: null, items: ["冬根", "水晶果", "雪山藥", "番紅花"] },
      { id: "construction", name: "建築收集包", need: null, items: ["木材 ×99", "石頭 ×99", "硬木 ×10"] },
      { id: "exotic", name: "異國覓食收集包", need: 5, items: ["椰子", "仙人掌果子", "山洞蘿蔔", "紅蘑菇", "紫蘑菇", "楓糖漿", "橡樹樹脂", "松焦油", "羊肚菌"] },
    ],
  },
  {
    id: "pantry", name: "食品儲藏室", icon: "🥕",
    bundles: [
      { id: "spring_crops", name: "春季作物收集包", need: null, items: ["防風草", "青豆", "花椰菜", "土豆"] },
      { id: "summer_crops", name: "夏季作物收集包", need: null, items: ["西紅柿", "辣椒", "藍莓", "甜瓜"] },
      { id: "fall_crops", name: "秋季作物收集包", need: null, items: ["玉米", "茄子", "南瓜", "山藥"] },
      { id: "quality_crops", name: "品質作物收集包", need: 3, items: ["金星防風草 ×5", "金星甜瓜 ×5", "金星南瓜 ×5", "金星玉米 ×5"] },
      { id: "animal", name: "動物製品收集包", need: 5, items: ["大壺牛奶", "大雞蛋（棕）", "大雞蛋（白）", "大瓶羊奶", "動物毛", "鴨蛋"] },
      { id: "artisan", name: "工匠物品收集包", need: 6, items: ["松露油", "布料", "山羊奶酪", "奶酪", "蜂蜜", "果醬", "蘋果", "杏子", "橙子", "桃子", "石榴", "櫻桃"] },
    ],
  },
  {
    id: "fishtank", name: "魚缸", icon: "🐟",
    bundles: [
      { id: "river", name: "河魚收集包", need: null, items: ["太陽魚", "鯰魚", "西鯡", "虎紋鱒魚"] },
      { id: "lake", name: "湖魚收集包", need: null, items: ["大嘴鱸魚", "鯉魚", "大頭魚", "鱘魚"] },
      { id: "ocean", name: "海魚收集包", need: null, items: ["沙丁魚", "金槍魚", "紅鯛魚", "羅非魚"] },
      { id: "night", name: "夜間垂釣收集包", need: null, items: ["大眼魚", "鯛魚", "鰻魚"] },
      { id: "crabpot", name: "蟹籠收集包", need: 5, items: ["龍蝦", "小龍蝦", "螃蟹", "鳥蛤", "蚌", "蝦", "蝸牛", "玉黍螺", "牡蠣", "蛤"] },
      { id: "specialty", name: "特色魚類收集包", need: null, items: ["河豚", "鬼魚", "沙魚", "木躍魚"] },
    ],
  },
  {
    id: "boiler", name: "鍋爐房", icon: "⚒️",
    bundles: [
      { id: "blacksmith", name: "鐵匠收集包", need: null, items: ["銅錠", "鐵錠", "金錠"] },
      { id: "geologist", name: "地質學家收集包", need: null, items: ["石英", "地晶", "淚晶", "火水晶"] },
      { id: "adventurer", name: "冒險者收集包", need: 2, items: ["史萊姆泥 ×99", "蝙蝠翅膀 ×10", "太陽精華", "虛空精華"] },
    ],
  },
  {
    id: "bulletin", name: "布告欄", icon: "📌",
    bundles: [
      { id: "chef", name: "主廚收集包", need: null, items: ["楓糖漿", "蕨菜", "松露", "虞美人花", "生魚壽司", "煎雞蛋"] },
      { id: "dye", name: "染料收集包", need: null, items: ["紅蘑菇", "海膽", "向日葵", "鴨毛", "海藍寶石", "紅葉卷心菜"] },
      { id: "field", name: "田野研究收集包", need: null, items: ["紫蘑菇", "鸚鵡螺", "鰱魚", "冰凍晶球"] },
      { id: "fodder", name: "飼料收集包", need: null, items: ["小麥 ×10", "乾草 ×10", "蘋果 ×3"] },
      { id: "enchanter", name: "魔法師收集包", need: null, items: ["橡樹樹脂", "果酒", "兔子的腳", "石榴"] },
    ],
  },
  {
    id: "vault", name: "保險庫", icon: "💰",
    bundles: [
      { id: "v2500", name: "2,500g 收集包", need: null, items: ["2,500g"] },
      { id: "v5000", name: "5,000g 收集包", need: null, items: ["5,000g"] },
      { id: "v10000", name: "10,000g 收集包", need: null, items: ["10,000g"] },
      { id: "v25000", name: "25,000g 收集包", need: null, items: ["25,000g"] },
    ],
  },
];

const HOUSE_LEVELS = ["初始小屋", "升級一（廚房）", "升級二（二樓＋兒童房）", "升級三（地窖）"];
const COOP_LEVELS = ["未建造", "雞舍", "大雞舍", "豪華雞舍"];
const BARN_LEVELS = ["未建造", "牲口棚", "大牲口棚", "豪華牲口棚"];
const SIMPLE_BUILDINGS = ["筒倉", "水井", "磨坊", "馬廄", "史萊姆窩", "連線小屋", "溫室"];

const COOP_ANIMALS = [
  { name: "雞", icon: "🐔" }, { name: "藍雞", icon: "🐔" }, { name: "虛空雞", icon: "🐔" },
  { name: "金雞", icon: "🐔" }, { name: "鴨", icon: "🦆" }, { name: "兔子", icon: "🐰" }, { name: "恐龍", icon: "🦖" },
];
const BARN_ANIMALS = [
  { name: "牛", icon: "🐄" }, { name: "山羊", icon: "🐐" }, { name: "綿羊", icon: "🐑" },
  { name: "豬", icon: "🐖" }, { name: "鴕鳥", icon: "🦩" },
];

/* Switch「＋」選單 → 社交頁 */
const NPC_GROUPS = [
  { id: "single", name: "可交往對象", max: 14, list: ["阿比蓋爾", "艾蜜麗", "海莉", "莉亞", "瑪魯", "潘妮", "亞歷克斯", "艾利歐特", "哈維", "山姆", "塞巴斯蒂安", "謝恩"] },
  { id: "town", name: "村民", max: 10, list: ["卡洛琳", "克林特", "德米特里厄斯", "艾芙琳", "喬治", "格斯", "賈斯", "喬迪", "肯特", "劉易斯", "萊納斯", "瑪妮", "潘姆", "皮埃爾", "羅賓", "文森特", "威利", "法師"] },
  { id: "special", name: "特殊角色", max: 10, list: ["桑迪", "克羅巴斯", "矮人", "雷歐"] },
];

/* 百科條目名對照（人物頁連結用） */
const NPC_WIKI = {
  阿比蓋爾: "阿比盖尔", 艾蜜麗: "艾米丽", 海莉: "海莉", 莉亞: "莉亚", 瑪魯: "玛鲁", 潘妮: "潘妮",
  亞歷克斯: "亚历克斯", 艾利歐特: "艾利欧特", 哈維: "哈维", 山姆: "山姆", 塞巴斯蒂安: "塞巴斯蒂安", 謝恩: "谢恩",
  卡洛琳: "卡洛琳", 克林特: "克林特", 德米特里厄斯: "德米特里厄斯", 艾芙琳: "艾芙琳", 喬治: "乔治", 格斯: "格斯",
  賈斯: "贾斯", 喬迪: "乔迪", 肯特: "肯特", 劉易斯: "刘易斯", 萊納斯: "莱纳斯", 瑪妮: "玛妮",
  潘姆: "潘姆", 皮埃爾: "皮埃尔", 羅賓: "罗宾", 文森特: "文森特", 威利: "威利", 法師: "法师",
  桑迪: "桑迪", 克羅布斯: "科罗布斯", 克羅巴斯: "科罗布斯", 矮人: "矮人", 雷歐: "雷欧",
};

/* 送禮偏好簡記（Claude 整理）：最愛盡量完整；喜歡/討厭僅列代表項，完整以百科為準 */
const NPC_GIFTS = {
  阿比蓋爾: { love: ["紫水晶", "香蕉布丁", "黑莓脆皮饼", "巧克力蛋糕", "河豚", "南瓜", "香辣鳗鱼"], like: ["石英"], hate: ["冬青树"] },
  艾蜜麗: { love: ["紫水晶", "海蓝宝石", "布料", "绿宝石", "翡翠", "红宝石", "黄玉", "救生汉堡", "动物毛"], like: ["黄水仙"], hate: ["鱼类菜肴"] },
  海莉: { love: ["椰子", "水果沙拉", "粉红蛋糕", "向日葵"], like: ["黄水仙"], hate: ["粘土", "五彩碎片"] },
  莉亞: { love: ["山羊奶酪", "虞美人籽松糕", "沙拉", "松露", "蔬菜杂烩", "果酒"], like: ["野生采集物"], hate: ["面包"] },
  瑪魯: { love: ["电池组", "花椰菜", "乳酪花椰菜", "钻石", "金锭", "铱锭", "矿工特供", "爆炒青椒", "草莓"], like: ["石英", "各类宝石"], hate: ["蜂蜜"] },
  潘妮: { love: ["钻石", "绿宝石", "甜瓜", "虞美人花", "虞美人籽松糕", "红之盛宴", "块茎拼盘", "沙鱼", "椰汁汤"], like: ["蒲公英", "韭葱"], hate: ["啤酒等酒类", "兔子的脚"] },
  亞歷克斯: { love: ["完美早餐", "鲑鱼晚餐"], like: ["鸡蛋类"], hate: ["石英"] },
  艾利歐特: { love: ["蟹黄糕", "鸭毛", "龙虾", "石榴", "鱿鱼墨汁", "椰汁汤"], like: ["鱿鱼"], hate: ["苋菜"] },
  哈維: { love: ["咖啡", "腌菜", "松露油", "果酒"], like: ["多数蔬菜"], hate: ["（见百科）"] },
  山姆: { love: ["仙人掌果子", "枫糖棒", "披萨", "虎眼石"], like: ["鸡蛋类"], hate: ["（见百科）"] },
  塞巴斯蒂安: { love: ["泪晶", "黑曜石", "南瓜汤", "生鱼片", "虚空蛋"], like: ["石英"], hate: ["粘土"] },
  謝恩: { love: ["啤酒", "辣椒", "爆炒青椒", "披萨"], like: ["各种蛋"], hate: ["腌菜"] },
  卡洛琳: { love: ["鱼肉卷", "绿茶", "夏季亮片", "热带咖喱"], like: ["黄水仙"], hate: ["（见百科）"] },
  克林特: { love: ["紫水晶", "海蓝宝石", "绿宝石", "翡翠", "红宝石", "黄玉", "金锭", "铱锭", "万象晶洞", "意式蕨菜炖饭"], like: ["矿石类"], hate: ["（见百科）"] },
  德米特里厄斯: { love: ["豆类火锅", "冰淇淋", "大米布丁", "草莓"], like: ["鸡蛋", "水果"], hate: ["（见百科）"] },
  艾芙琳: { love: ["甜菜", "巧克力蛋糕", "钻石", "玫瑰仙子", "塞料面包", "郁金香"], like: ["花卉类"], hate: ["蒜"] },
  喬治: { love: ["韭葱", "炒蘑菇"], like: ["（见百科）"], hate: ["蒲公英"] },
  格斯: { love: ["钻石", "法式田螺", "鱼肉卷", "橙子", "热带咖喱"], like: ["多数料理"], hate: ["（见百科）"] },
  賈斯: { love: ["玫瑰仙子", "粉红蛋糕", "葡萄干布丁"], like: ["椰子"], hate: ["（见百科）"] },
  喬迪: { love: ["巧克力蛋糕", "香酥鲈鱼", "帕尔玛奶酪茄子", "炒鳗鱼", "薄煎饼", "大黄派", "蔬菜杂烩"], like: ["水果"], hate: ["（见百科）"] },
  肯特: { love: ["意式蕨菜炖饭", "烤榛子"], like: ["（见百科）"], hate: ["（见百科）"] },
  劉易斯: { love: ["秋日恩赐", "琉璃山药", "绿茶", "辣椒", "蔬菜杂烩"], like: ["多数蔬菜"], hate: ["（见百科）"] },
  萊納斯: { love: ["蓝莓千层酥", "仙人掌果子", "椰子", "海之菜肴", "山药"], like: ["采集品"], hate: ["（见百科）"] },
  瑪妮: { love: ["钻石", "农夫午餐", "粉红蛋糕", "南瓜派"], like: ["鸡蛋", "牛奶"], hate: ["（见百科）"] },
  潘姆: { love: ["啤酒", "仙人掌果子", "琉璃山药", "蜜蜂酒", "淡啤酒", "防风草", "防风草汤"], like: ["酒类"], hate: ["（见百科）"] },
  皮埃爾: { love: ["炸鱿鱼"], like: ["多数蔬菜"], hate: ["玉米"] },
  羅賓: { love: ["山羊奶酪", "桃子", "意大利面"], like: ["水果"], hate: ["（见百科）"] },
  文森特: { love: ["蔓越莓糖果", "姜汁汽水", "葡萄", "粉红蛋糕", "蜗牛"], like: ["甜食"], hate: ["（见百科）"] },
  威利: { love: ["鲶鱼", "钻石", "铱锭", "蜜蜂酒", "章鱼", "南瓜", "海参", "鲟鱼"], like: ["多数鱼类"], hate: ["（见百科）"] },
  法師: { love: ["紫蘑菇", "太阳精华", "大海参", "虚空精华"], like: ["（见百科）"], hate: ["（见百科）"] },
  桑迪: { love: ["番红花", "黄水仙", "甜豌豆", "芒果糯米饭"], like: ["花卉类"], hate: ["（见百科）"] },
  克羅巴斯: { love: ["钻石", "铱锭", "南瓜", "虚空蛋", "虚空蛋黄酱", "野山葵"], like: ["（见百科）"], hate: ["（见百科）"] },
  矮人: { love: ["紫水晶", "海蓝宝石", "绿宝石", "翡翠", "红宝石", "黄玉", "柠檬石", "万象晶洞"], like: ["矿石类"], hate: ["（见百科）"] },
  雷歐: { love: ["鸭毛", "芒果", "鸵鸟蛋", "夏威夷芋泥"], like: ["水果"], hate: ["（见百科）"] },
};

/* Switch「＋」選單 → 特殊物品與能力（Powers），附取得方式簡記 */
const WALLET_ITEMS = [
  { name: "放大鏡", desc: "冬季神秘事件（跟蹤影子人）後取得，開啟秘密紙條系統" },
  { name: "矮人語聖典", desc: "捐贈 4 件矮人文物給博物館" },
  { name: "銹鑰匙（下水道）", desc: "博物館累計捐贈 60 件" },
  { name: "骷髏鑰匙", desc: "礦井 120 層寶箱" },
  { name: "俱樂部卡", desc: "完成「神秘的齊」任務後解鎖沙漠賭場" },
  { name: "特殊護符", desc: "秘密紙條 #20 任務：送卡車司機兔子的腳" },
  { name: "魔法墨水", desc: "把黑暗護符交給女巫小屋的法師之後" },
  { name: "黑暗護符", desc: "法師任務：於下水道向克羅巴斯取得" },
  { name: "鎮上鑰匙", desc: "1.6：完成劉易斯的協助鎮民系列委託" },
];
const ABILITIES = [
  { name: "森林魔法", desc: "社區中心事件後由法師授予，可讀懂祝尼魔卷軸" },
  { name: "熊的知識", desc: "秘密紙條 #23 事件，漿果類售價大幅提升" },
  { name: "春洋蔥精通", desc: "賈斯與文森特事件後，大蔥售價 ×5" },
];

const MASTERY = [
  { id: "farming", name: "耕種精通", desc: "祝福雕像" },
  { id: "mining", name: "採礦精通", desc: "矮人王雕像" },
  { id: "foraging", name: "採集精通", desc: "神秘樹種" },
  { id: "fishing", name: "釣魚精通", desc: "進階銥金魚竿" },
  { id: "combat", name: "戰鬥精通", desc: "鐵砧＋飾品" },
];

const MILESTONES = [
  { id: "bus", name: "公車修復（沙漠）", desc: "完成保險庫收集包（共 42,500g）" },
  { id: "minecart", name: "礦車修復", desc: "完成鍋爐房收集包" },
  { id: "bridge", name: "採石場橋修復", desc: "完成工藝室收集包" },
  { id: "panning", name: "淘金解鎖", desc: "完成魚缸收集包，威利贈送淘盤" },
  { id: "cc", name: "社區中心完成", desc: "全部 30 個收集包達成" },
  { id: "island", name: "薑島解鎖", desc: "社區中心完成後，幫威利修好船" },
  { id: "forge", name: "熔爐（火山）", desc: "薑島火山口，可鍛造與附魔武器" },
  { id: "qi", name: "齊先生房間", desc: "抵達骷髏洞窟 100 層" },
];

/* 圖鑑清單：排列順序與遊戲收藏頁一致（1.6），名稱採遊戲內原文以便對照與百科查詢 */
const WIKI_BASE = "https://wiki.biligame.com/stardewvalley/";

/* 圖鑑使用 Stardew Valley Wiki 的遊戲原始 48×48 圖示。
   Special:Redirect/file 會由 Wiki 自動導向目前版本的原圖，不必手動維護圖片雜湊路徑。 */
const WIKI_FILE = (name) => `https://wiki.stardewvalley.net/Special:Redirect/file/${encodeURIComponent(name + ".png")}`;
const iconMap = (names) => Object.fromEntries(names.map((name, i) => [i, WIKI_FILE(name)]));

const FISH_ICON_FILES = [
  "Pufferfish", "Anchovy", "Tuna", "Sardine", "Bream", "Largemouth Bass", "Smallmouth Bass", "Rainbow Trout", "Salmon", "Walleye",
  "Perch", "Carp", "Catfish", "Pike", "Sunfish", "Red Mullet", "Herring", "Eel", "Octopus", "Red Snapper",
  "Squid", "Seaweed", "Green Algae", "Sea Cucumber", "Super Cucumber", "Ghostfish", "White Algae", "Stonefish", "Crimsonfish", "Angler",
  "Ice Pip", "Lava Eel", "Legend", "Sandfish", "Scorpion Carp", "Flounder", "Midnight Carp", "Clam", "Mutant Carp", "Sturgeon",
  "Tiger Trout", "Bullhead", "Tilapia", "Chub", "Dorado", "Albacore", "Shad", "Lingcod", "Halibut", "Lobster",
  "Crayfish", "Crab", "Cockle", "Mussel", "Shrimp", "Snail", "Periwinkle", "Oyster", "Woodskip", "Glacierfish",
  "Void Salmon", "Slimejack", "Midnight Squid", "Spook Fish", "Blobfish", "Stingray", "Lionfish", "Blue Discus", "River Jelly", "Cave Jelly",
  "Sea Jelly", "Goby",
];
const ARTIFACT_ICON_FILES = [
  "Dwarf Scroll I", "Dwarf Scroll II", "Dwarf Scroll III", "Dwarf Scroll IV", "Chipped Amphora", "Arrowhead", "Ancient Doll", "Elvish Jewelry", "Chewing Stick", "Ornamental Fan",
  "Dinosaur Egg", "Rare Disc", "Ancient Sword", "Rusty Spoon", "Rusty Spur", "Rusty Cog", "Chicken Statue", "Ancient Seed", "Prehistoric Tool", "Dried Starfish",
  "Anchor", "Glass Shards", "Bone Flute", "Prehistoric Handaxe", "Dwarvish Helm", "Dwarf Gadget", "Ancient Drum", "Golden Mask", "Golden Relic", "Strange Doll (green)",
  "Strange Doll (yellow)", "Prehistoric Scapula", "Prehistoric Tibia", "Prehistoric Skull", "Skeletal Hand", "Prehistoric Rib", "Prehistoric Vertebra", "Skeletal Tail", "Nautilus Fossil", "Amphibian Fossil",
  "Palm Fossil", "Trilobite",
];
const MINERAL_ICON_FILES = [
  "Emerald", "Aquamarine", "Ruby", "Amethyst", "Topaz", "Jade", "Diamond", "Prismatic Shard", "Quartz", "Fire Quartz",
  "Frozen Tear", "Earth Crystal", "Alamite", "Bixite", "Baryte", "Aerinite", "Calcite", "Dolomite", "Esperite", "Fluorapatite",
  "Geminite", "Helvite", "Jamborite", "Jagoite", "Kyanite", "Lunarite", "Malachite", "Neptunite", "Lemon Stone", "Nekoite",
  "Orpiment", "Petrified Slime", "Thunder Egg", "Pyrite", "Ocean Stone", "Ghost Crystal", "Tigerseye", "Jasper", "Opal", "Fire Opal",
  "Celestine", "Marble", "Sandstone", "Granite", "Basalt", "Limestone", "Soapstone", "Hematite", "Mudstone", "Obsidian",
  "Slate", "Fairy Stone", "Star Shards",
];
const ICON_URLS = {
  fish: iconMap(FISH_ICON_FILES),
  artifact: iconMap(ARTIFACT_ICON_FILES),
  mineral: iconMap(MINERAL_ICON_FILES),
};

/* 取得方式簡記（Claude 整理，可能有誤，點說明卡內的百科鈕可核對） */
const FISH_INFO = [
  "夏·海·晴 12-16點", "春秋·海", "夏冬·海", "春秋冬·海", "全季·河·傍晚起",
  "全季·山間湖", "春秋·鎮河/森林池", "夏·河湖·晴", "秋·河", "秋冬·淡水·雨",
  "冬·淡水", "全季·湖/下水道", "春秋·河·雨", "夏冬·河/森林池", "春夏·河·晴",
  "夏冬·海", "春冬·海", "春秋·海·雨·傍晚起", "夏·海·早上", "夏秋·海·雨",
  "冬·海·夜", "各水域釣獲", "淡水釣獲", "秋冬·海", "夏秋·海·晚間",
  "礦井20/60層水域", "礦井/下水道/沼澤", "礦井20層水域", "傳說魚·夏·海(東碼頭)", "傳說魚·秋·鎮北木橋",
  "礦井60層水域", "礦井100層/火山口", "傳說魚·春·山湖·雨", "沙漠·全天", "沙漠(釣魚4級)",
  "春夏·海", "秋冬·山湖/森林池·夜", "海灘採集/蟹籠", "傳說魚·下水道", "夏冬·山間湖",
  "秋冬·鎮河", "全季·山間湖", "夏秋·海", "全季·山湖/森林河", "夏·森林河",
  "秋冬·海·早晚", "春夏秋·河·雨", "冬·河湖", "春夏冬·海", "蟹籠·海",
  "蟹籠·淡水", "蟹籠·海", "蟹籠/海灘採集", "蟹籠·海", "蟹籠·海",
  "蟹籠·淡水", "蟹籠·淡水", "蟹籠/海灘採集", "秘密森林池塘", "傳說魚·冬·森林河南小島",
  "女巫沼澤", "突變蟲穴", "夜市深海潛艇(冬15-17)", "夜市深海潛艇", "夜市深海潛艇",
  "薑島海盜灣", "薑島海洋", "薑島河流", "河釣獲(1.6)", "礦井水域釣獲(1.6)",
  "海釣獲(1.6)", "瀑布水域(1.6)",
];
const ARTIFACT_INFO = [
  "礦井1-40鋤地/怪物", "礦井1-40鋤地/怪物", "礦井41+鋤地/蝙蝠", "礦井80+鋤地/怪物", "鎮上鋤地",
  "山區/森林鋤地", "山區/巴士站鋤地", "多區域鋤地", "鎮/森林/山鋤地", "鎮/海灘鋤地",
  "山區鋤地/骷髏洞窟", "鋤地/怪物掉落", "森林/山區鋤地", "鎮上鋤地", "農場/牧場鋤地",
  "山區鋤地", "農場鋤地", "森林/山區鋤地/蟲掉落", "山/森林/巴士站鋤地", "海灘鋤地",
  "海灘鋤地/釣魚寶箱", "海灘鋤地", "山/森林/鎮鋤地", "山/森林/巴士站鋤地", "礦井淺層寶箱",
  "礦井21-60寶箱", "礦井/鎮上鋤地", "沙漠鋤地", "沙漠鋤地", "多區域鋤地/釣魚寶箱",
  "多區域鋤地/釣魚寶箱", "鋤地/骷髏洞窟挖掘", "鋤地/骷髏洞窟挖掘", "鋤地/骷髏洞窟挖掘", "鋤地/骷髏洞窟挖掘",
  "鋤地/骷髏洞窟挖掘", "鋤地/骷髏洞窟挖掘", "鋤地/骷髏洞窟挖掘", "海灘鋤地", "森林/山區鋤地",
  "沙漠/海灘/森林鋤地", "山/森林/海灘鋤地",
];
const MINERAL_INFO = [
  "晶球/採礦", "晶球/採礦", "晶球/採礦", "晶球/採礦", "晶球/採礦", "晶球/採礦", "晶球/採礦", "萬象晶球/銥礦/寶箱",
  "礦井/晶球", "礦井80+", "礦井40-79", "礦井1-39", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球",
  "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球",
  "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球", "晶球",
];

const COLLECTIONS = {
  fish: {
    name: "魚類圖鑑", icon: "🐟",
    items: [
      "河豚", "鳳尾魚", "金槍魚", "沙丁魚", "鯛魚", "大嘴鱸魚", "小嘴鱸魚", "虹鱒魚", "鮭魚", "大眼魚",
      "鱸魚", "鯉魚", "鯰魚", "梭子魚", "太陽魚", "紅鯔魚", "鯡魚", "鰻魚", "章魚", "紅鯛魚",
      "魷魚", "海草", "綠藻", "海參", "大海參", "幽靈魚", "白藻", "石魚", "緋紅魚", "安康魚",
      "冰柱魚", "熔岩鰻魚", "傳說之魚", "沙魚", "蠍鯉魚", "比目魚", "午夜鯉魚", "蛤", "突變鯉魚", "鱘魚",
      "虎紋鱒魚", "大頭魚", "羅非魚", "鰱魚", "麻哈脂鯉", "長鰭金槍魚", "西鯡", "蛇齒單線魚", "大比目魚", "龍蝦",
      "小龍蝦", "螃蟹", "鳥蛤", "蚌", "蝦", "蝸牛", "玉黍螺", "牡蠣", "木躍魚", "冰川魚",
      "虛空鮭魚", "史萊姆魚", "午夜魷魚", "幽靈魚", "水滴魚", "黃貂魚", "獅子魚", "藍鐵餅魚", "河凝膠", "洞穴凝膠",
      "海凝膠", "鰕虎魚",
    ],
    info: FISH_INFO,
  },
  artifact: {
    name: "古物圖鑑", icon: "🏺",
    items: [
      "矮人卷軸 I", "矮人卷軸 II", "矮人卷軸 III", "矮人卷軸 IV", "缺口陶罐", "箭頭", "古代玩偶", "精靈珠寶", "咀嚼棒", "裝飾扇",
      "恐龍蛋", "稀有圓盤", "古劍", "銹湯匙", "銹馬刺", "銹齒輪", "雞雕像", "遠古種子", "史前工具", "乾海星",
      "錨", "玻璃碎片", "骨笛", "史前手斧", "矮人頭盔", "矮人小工具", "古代鼓", "黃金面具", "黃金遺物", "奇怪玩偶（綠）",
      "奇怪玩偶（黃）", "史前肩胛骨", "史前脛骨", "史前頭骨", "骨骼手", "史前肋骨", "史前脊椎骨", "骨骼尾巴", "鸚鵡螺化石", "兩棲動物化石",
      "棕櫚化石", "三葉蟲",
    ],
    info: ARTIFACT_INFO,
  },
  mineral: {
    name: "礦物圖鑑", icon: "💎",
    items: [
      "綠寶石", "海藍寶石", "紅寶石", "紫水晶", "黃玉", "翡翠", "鑽石", "五彩碎片", "石英", "火水晶",
      "淚晶", "地晶", "透閃石", "黑方石", "重晶石", "藍晶石", "方解石", "白雲石", "透輝石", "磷灰石",
      "雙晶石", "異極礦", "氯銅礦", "硅孔雀石", "藍晶石", "月亮石", "孔雀石", "海王石", "檸檬石", "貓眼石",
      "雌黃", "石化史萊姆", "雷公蛋", "黃鐵礦", "海洋石", "幽靈水晶", "虎眼石", "碧玉", "蛋白石", "火蛋白石",
      "天青石", "大理石", "砂岩", "花崗岩", "玄武岩", "石灰岩", "皂石", "赤鐵礦", "泥岩", "黑曜石",
      "板岩", "精靈石", "星星碎片",
    ],
    info: MINERAL_INFO,
  },
};

/* ================= 預填進度（對話紀錄） ================= */
const PREFILL = {
  base: { year: 2, season: "夏", day: 14, money: 89929, totalIncome: 744005, backpack: 36, farm: "四角農場", platform: "Switch 2 / 1.6" },
  skills: { farming: 10, mining: 8, foraging: 10, fishing: 9, combat: 7 },
  prof: { farming5: "農耕者", farming10: "工匠", mining5: "", mining10: "", foraging5: "樵夫", foraging10: "伐木工", fishing5: "", fishing10: "", combat5: "", combat10: "" },
  mine: { normal: 120, skullBest: 0 },
  tools: { watering: "金", pickaxe: "金", axe: "金", hoe: "金", trash: "銅" },
  house: 1,
  buildings: { coop: 3, barn: 3, silos: 2, fishPonds: 4, sheds: 0, other: ["溫室", "馬廄", "連線小屋"] },
  animals: { 雞: 3, 鴨: 4, 恐龍: 1, 兔子: 2, 牛: 2, 山羊: 3, 綿羊: 2, 豬: 2 },
  ponds: [
    { fish: "大海參", count: 6, cap: 7, need: "尚未觸發下一次擴容需求" },
    { fish: "幽靈魚", count: 3, cap: 3, need: "尚待下一次擴容需求" },
    { fish: "鱘魚", count: 5, cap: 5, need: "萬象晶球 ×3" },
    { fish: "水滴魚", count: 3, cap: 3, need: "" },
  ],
  milestones: ["bus", "minecart", "bridge", "panning", "cc"],
  wallet: ["放大鏡", "矮人語聖典", "銹鑰匙（下水道）", "骷髏鑰匙", "俱樂部卡", "特殊護符", "魔法墨水", "黑暗護符"],
  abilities: ["森林魔法", "熊的知識", "春洋蔥精通"],
  bundleDone: ["crafts", "pantry", "fishtank", "boiler", "vault"],
  bundleItems: {},
  friendship: {},
  collections: { fish: [], artifact: [], mineral: [] },
  mastery: [],
  notes: "第2年夏14。明日（夏15）預告綠雨。\n豪華雞舍：雞3、鴨4、恐龍1、兔2。\n豪華牛棚：牛2、山羊3、綿羊2、豬2。\n自動收集器已裝。\n夜間結算收入通常約10,000g。\n工具除垃圾桶外皆金；垃圾桶銅。\n銥礦不足，尚未升銥工具。\n魚塘：大海參6/7、幽靈魚3/3、鱘魚5/5（需萬象晶球×3）、水滴魚3/3。\n溫室已開；曾種滿草莓；上古種子×2、稀有種子×3。\n豪華牛棚已有豬×2。",
  extras: {
    starfruit: 2,
    buildingNote: "筒倉×2；溫室春12解鎖；連線小屋×1（朋友）",
  },
};

const STORAGE_KEY = "sdv2-progress-v3";
const PUB_KEY = "sdv2-progress-pub"; /* 本機進度存檔 */

/* GitHub Pages 版本：進度儲存在目前瀏覽器的 localStorage。 */
async function storageGet(key, shared = false) {
  try {
    const value = window.localStorage.getItem(key);
    return value == null ? null : { value };
  } catch (e) { return null; }
}
async function storageSet(key, value, shared = false) {
  try { window.localStorage.setItem(key, value); } catch (e) {}
  return null;
}
async function storageDelete(key, shared = false) {
  try { window.localStorage.removeItem(key); } catch (e) {}
  return null;
}

const C = {
  bg: "#F3E4BA", paper: "#FFF8E3", brown: "#6B3E1E", darkBrown: "#3D220F", gold: "#D8A22A",
  orange: "#D96F2B", green: "#4E7C3A", lightGreen: "#D8EDB8", red: "#B4432F", blue: "#3A78A8",
  ink: "#3B2C20", muted: "#806B55", line: "#D7B978", cream: "#FFF3CF", shadow: "rgba(65,40,20,.17)",
};

const TOOL_LEVELS = ["初始", "銅", "鋼", "金", "銥"];
const TOOL_NAMES = [
  ["watering", "水壺", "💧"], ["pickaxe", "十字鎬", "⛏️"], ["axe", "斧頭", "🪓"], ["hoe", "鋤頭", "🌱"], ["trash", "垃圾桶", "🗑️"],
];

const TABS = [
  { id: "overview", name: "總覽", icon: "🏡" },
  { id: "skills", name: "技能", icon: "⭐" },
  { id: "bundles", name: "社區", icon: "📦" },
  { id: "farm", name: "農場", icon: "🐄" },
  { id: "people", name: "社交", icon: "💛" },
  { id: "collection", name: "圖鑑", icon: "📖" },
  { id: "notes", name: "備註", icon: "📝" },
];

/* ================= 小元件 ================= */
function SectionTitle({ icon, children, right }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "20px 0 8px" }}>
    <span style={{ fontSize: 20 }}>{icon}</span>
    <span style={{ fontSize: 17, fontWeight: 900, color: C.darkBrown }}>{children}</span>
    {right && <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 800, color: C.muted }}>{right}</span>}
  </div>;
}
function Card({ children, style }) {
  return <div style={{ background: C.paper, border: `2px solid ${C.line}`, borderRadius: 12, padding: 13, boxShadow: `0 3px 8px ${C.shadow}`, ...style }}>{children}</div>;
}
function Pill({ children, active, onClick, small }) {
  return <button onClick={onClick} style={{
    border: `2px solid ${active ? C.green : C.line}`, background: active ? C.lightGreen : C.cream,
    color: active ? C.green : C.ink, borderRadius: 18, padding: small ? "4px 9px" : "6px 12px",
    fontSize: small ? 12 : 13, fontWeight: 800, cursor: "pointer",
  }}>{children}</button>;
}
function NumInput({ value, onChange, min = 0, max = 999, suffix = "" }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
    <input type="number" min={min} max={max} value={value} onChange={e => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
      style={{ width: 64, border: `2px solid ${C.line}`, background: "#FFFCF0", borderRadius: 7, padding: "5px 6px", color: C.ink, fontWeight: 800, fontSize: 14 }} />
    {suffix && <span style={{ color: C.muted, fontSize: 12, fontWeight: 700 }}>{suffix}</span>}
  </span>;
}
function ProgressBar({ value, max, color = C.green }) {
  const pct = Math.min(100, max ? (value / max) * 100 : 0);
  return <div style={{ height: 9, background: "#E5D3A8", borderRadius: 10, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 10, transition: ".2s" }} /></div>;
}
function CheckRow({ checked, onChange, children, sub }) {
  return <label style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "6px 0", cursor: "pointer", opacity: checked ? .7 : 1 }}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: 18, height: 18, accentColor: C.green, marginTop: 1 }} />
    <span style={{ flex: 1, color: C.ink, fontSize: 14, fontWeight: checked ? 600 : 800, textDecoration: checked ? "line-through" : "none" }}>{children}{sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 2, fontWeight: 600 }}>{sub}</div>}</span>
  </label>;
}
function WikiBtn({ name }) {
  return <a href={`${WIKI_BASE}${encodeURIComponent(name)}`} target="_blank" rel="noopener noreferrer"
    style={{ textDecoration: "none", fontSize: 11, fontWeight: 900, color: C.blue, border: `1.5px solid ${C.blue}`, borderRadius: 7, padding: "4px 7px", whiteSpace: "nowrap" }}>百科 ↗</a>;
}

/* ================= 主程式 ================= */
function StardewTracker() {
  const [data, setData] = useState(PREFILL);
  const [tab, setTab] = useState("overview");
  const [loaded, setLoaded] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState("fish");
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedNPC, setExpandedNPC] = useState(null);
  const saveTimer = useRef(null);

  /* 載入：讀取目前瀏覽器的本機進度，無則使用預填資料 */
  useEffect(() => {
    (async () => {
      const pub = await storageGet(PUB_KEY, true);
      const local = await storageGet(STORAGE_KEY, false);
      let raw = pub?.value || local?.value;
      if (raw) {
        try { setData({ ...PREFILL, ...JSON.parse(raw) }); }
        catch (e) { console.warn("progress parse failed", e); }
      }
      setLoaded(true);
    })();
  }, []);

  /* 自動儲存（防抖）：保存到目前瀏覽器 */
  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const raw = JSON.stringify(data);
      await storageSet(PUB_KEY, raw, true);
      await storageSet(STORAGE_KEY, raw, false);
    }, 250);
    return () => clearTimeout(saveTimer.current);
  }, [data, loaded]);

  const update = (patch) => setData(d => ({ ...d, ...patch }));
  const updateBase = (patch) => update({ base: { ...data.base, ...patch } });
  const updateNested = (key, patch) => update({ [key]: { ...data[key], ...patch } });

  const roomDone = (room) => data.bundleDone.includes(room.id);
  const toggleRoom = (id, done) => update({ bundleDone: done ? [...new Set([...data.bundleDone, id])] : data.bundleDone.filter(x => x !== id) });
  const roomProgress = () => {
    const done = BUNDLE_ROOMS.reduce((s, r) => s + (roomDone(r) ? r.bundles.length : r.bundles.filter(b => {
      const got = (data.bundleItems[b.id] || []).length;
      return got >= (b.need || b.items.length);
    }).length), 0);
    const total = BUNDLE_ROOMS.reduce((s, r) => s + r.bundles.length, 0);
    return { done, total };
  };

  const totalAnimals = Object.values(data.animals || {}).reduce((a, b) => a + (Number(b) || 0), 0);
  const skillTotal = Object.values(data.skills || {}).reduce((a, b) => a + (Number(b) || 0), 0);
  const rp = roomProgress();

  const renderHeader = () => <>
    <div style={{ background: C.darkBrown, color: "white", padding: "calc(10px + env(safe-area-inset-top)) 14px 10px", position: "sticky", top: 0, zIndex: 30, boxShadow: "0 2px 8px rgba(0,0,0,.25)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 29 }}>🌱</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 950, letterSpacing: .5 }}>星露谷進度手帳</div>
          <div style={{ fontSize: 11, color: "#E8C88F", marginTop: 1 }}>{data.base.platform} · {data.base.farm}</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontWeight: 950, fontSize: 14 }}>{SEASON_ICON[data.base.season]} 第 {data.base.year} 年 {data.base.season} {data.base.day} 日</div>
          <div style={{ fontSize: 11, color: "#E8C88F" }}>{Number(data.base.money || 0).toLocaleString()}g</div>
        </div>
      </div>
    </div>
  </>;

  const renderOverview = () => <div>
    <SectionTitle icon="📅">日期與資金</SectionTitle>
    <Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}>
        <label style={{ fontSize: 12, fontWeight: 800, color: C.muted }}>年份<br/><NumInput value={data.base.year} min={1} max={99} onChange={v => updateBase({ year: v })} /></label>
        <label style={{ fontSize: 12, fontWeight: 800, color: C.muted }}>日期<br/><NumInput value={data.base.day} min={1} max={28} onChange={v => updateBase({ day: v })} suffix="日" /></label>
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 7, flexWrap: "wrap" }}>{SEASONS.map(s => <Pill key={s} active={data.base.season === s} onClick={() => updateBase({ season: s })}>{SEASON_ICON[s]} {s}</Pill>)}</div>
      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}>
        <label style={{ fontSize: 12, fontWeight: 800, color: C.muted }}>目前金錢<br/><NumInput value={data.base.money} max={999999999} onChange={v => updateBase({ money: v })} suffix="g" /></label>
        <label style={{ fontSize: 12, fontWeight: 800, color: C.muted }}>累計收入<br/><NumInput value={data.base.totalIncome} max={999999999} onChange={v => updateBase({ totalIncome: v })} suffix="g" /></label>
      </div>
    </Card>

    <SectionTitle icon="📊">進度速覽</SectionTitle>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}>
      <Card style={{ padding: 11 }}><div style={{ fontSize: 11, color: C.muted, fontWeight: 800 }}>技能總等級</div><div style={{ fontSize: 24, fontWeight: 950, color: C.green }}>{skillTotal}<span style={{ fontSize: 12, color: C.muted }}>/50</span></div><ProgressBar value={skillTotal} max={50}/></Card>
      <Card style={{ padding: 11 }}><div style={{ fontSize: 11, color: C.muted, fontWeight: 800 }}>社區收集包</div><div style={{ fontSize: 24, fontWeight: 950, color: C.orange }}>{rp.done}<span style={{ fontSize: 12, color: C.muted }}>/30</span></div><ProgressBar value={rp.done} max={30} color={C.orange}/></Card>
      <Card style={{ padding: 11 }}><div style={{ fontSize: 11, color: C.muted, fontWeight: 800 }}>礦井最深</div><div style={{ fontSize: 24, fontWeight: 950, color: C.blue }}>{data.mine.normal}<span style={{ fontSize: 12, color: C.muted }}>/120</span></div><ProgressBar value={data.mine.normal} max={120} color={C.blue}/></Card>
      <Card style={{ padding: 11 }}><div style={{ fontSize: 11, color: C.muted, fontWeight: 800 }}>動物總數</div><div style={{ fontSize: 24, fontWeight: 950, color: C.brown }}>{totalAnimals}</div><div style={{ fontSize: 11, color: C.muted }}>雞舍＋牛棚</div></Card>
    </div>

    <SectionTitle icon="🏆">重要里程碑</SectionTitle>
    <Card>{MILESTONES.map(m => <CheckRow key={m.id} checked={data.milestones.includes(m.id)} onChange={v => update({ milestones: v ? [...new Set([...data.milestones, m.id])] : data.milestones.filter(x => x !== m.id) })} sub={m.desc}>{m.name}</CheckRow>)}</Card>

    <SectionTitle icon="🎒">特殊物品與能力</SectionTitle>
    <Card>
      <div style={{ fontSize: 12, fontWeight: 900, color: C.brown, marginBottom: 4 }}>錢包</div>
      {WALLET_ITEMS.map(w => <CheckRow key={w.name} checked={data.wallet.includes(w.name)} onChange={v => update({ wallet: v ? [...new Set([...data.wallet, w.name])] : data.wallet.filter(x => x !== w.name) })} sub={w.desc}>{w.name}</CheckRow>)}
      <div style={{ fontSize: 12, fontWeight: 900, color: C.brown, margin: "10px 0 4px" }}>能力</div>
      {ABILITIES.map(a => <CheckRow key={a.name} checked={data.abilities.includes(a.name)} onChange={v => update({ abilities: v ? [...new Set([...data.abilities, a.name])] : data.abilities.filter(x => x !== a.name) })} sub={a.desc}>{a.name}</CheckRow>)}
    </Card>
  </div>;

  const renderSkills = () => <div>
    <SectionTitle icon="⭐">技能等級</SectionTitle>
    <Card>
      {SKILLS.map(s => {
        const lv = data.skills[s.id] || 0;
        const l5key = s.id + "5", l10key = s.id + "10";
        const p5 = data.prof[l5key] || "";
        return <div key={s.id} style={{ padding: "9px 0", borderBottom: `1px dashed ${C.line}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ fontSize: 20 }}>{s.icon}</span><b style={{ flex: 1, color: C.ink }}>{s.name}</b>
            <NumInput value={lv} max={10} onChange={v => updateNested("skills", { [s.id]: v })} suffix="級" />
          </div>
          <div style={{ marginTop: 6 }}><ProgressBar value={lv} max={10}/></div>
          {lv >= 5 && <div style={{ marginTop: 7 }}><div style={{ fontSize: 11, color: C.muted, fontWeight: 800 }}>5 級專精</div><div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>{PROF[s.id].l5.map(p => <Pill key={p} small active={p5 === p} onClick={() => updateNested("prof", { [l5key]: p, [l10key]: "" })}>{p}</Pill>)}</div></div>}
          {lv >= 10 && p5 && PROF[s.id].l10[p5] && <div style={{ marginTop: 7 }}><div style={{ fontSize: 11, color: C.muted, fontWeight: 800 }}>10 級專精</div><div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>{PROF[s.id].l10[p5].map(p => <Pill key={p} small active={data.prof[l10key] === p} onClick={() => updateNested("prof", { [l10key]: p })}>{p}</Pill>)}</div></div>}
        </div>;
      })}
    </Card>

    <SectionTitle icon="⛏️">礦井</SectionTitle>
    <Card><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><span style={{ fontWeight: 900 }}>普通礦井</span><NumInput value={data.mine.normal} max={120} onChange={v => updateNested("mine", { normal: v })} suffix="層" /></div><ProgressBar value={data.mine.normal} max={120} color={C.blue}/><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}><span style={{ fontWeight: 900 }}>骷髏洞窟最佳</span><NumInput value={data.mine.skullBest} max={999} onChange={v => updateNested("mine", { skullBest: v })} suffix="層" /></div></Card>

    <SectionTitle icon="✨">精通</SectionTitle>
    <Card>{MASTERY.map(m => <CheckRow key={m.id} checked={data.mastery.includes(m.id)} onChange={v => update({ mastery: v ? [...new Set([...data.mastery, m.id])] : data.mastery.filter(x => x !== m.id) })} sub={m.desc}>{m.name}</CheckRow>)}</Card>
  </div>;

  const renderBundles = () => <div>
    <SectionTitle icon="📦">社區中心 <span style={{ color: C.orange }}>{rp.done}/30</span></SectionTitle>
    <Card style={{ padding: 10 }}><ProgressBar value={rp.done} max={30} color={C.orange}/></Card>
    <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
      {BUNDLE_ROOMS.map(r => {
        const done = roomDone(r);
        const count = done ? r.bundles.length : r.bundles.filter(b => (data.bundleItems[b.id] || []).length >= (b.need || b.items.length)).length;
        return <Card key={r.id} style={{ padding: 11, borderColor: done ? C.green : C.line, background: done ? "#F0F8DF" : C.paper }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ fontSize: 22 }}>{r.icon}</span><div style={{ flex: 1 }}><b style={{ color: C.ink }}>{r.name}</b><div style={{ fontSize: 11, color: C.muted }}>{count}/{r.bundles.length} 收集包</div></div>
            <button onClick={() => toggleRoom(r.id, !done)} style={{ border: `2px solid ${done ? C.green : C.line}`, background: done ? C.lightGreen : C.cream, borderRadius: 8, padding: "5px 8px", fontWeight: 900, color: done ? C.green : C.muted }}>{done ? "✓ 完成" : "整室完成"}</button>
            <button onClick={() => setSelectedRoom(selectedRoom === r.id ? null : r.id)} style={{ border: 0, background: "transparent", color: C.brown, fontWeight: 900, fontSize: 16 }}>{selectedRoom === r.id ? "▲" : "▼"}</button>
          </div>
          {selectedRoom === r.id && !done && <div style={{ marginTop: 8, paddingTop: 7, borderTop: `1px dashed ${C.line}` }}>{r.bundles.map(b => {
            const got = data.bundleItems[b.id] || [];
            const need = b.need || b.items.length;
            return <div key={b.id} style={{ margin: "8px 0 12px" }}><div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><b style={{ fontSize: 13, color: C.brown }}>{b.name}</b><span style={{ fontSize: 11, color: got.length >= need ? C.green : C.muted, fontWeight: 900 }}>{got.length}/{need}</span></div><div style={{ marginTop: 4 }}>{b.items.map(it => <CheckRow key={it} checked={got.includes(it)} onChange={v => updateNested("bundleItems", { [b.id]: v ? [...got, it] : got.filter(x => x !== it) })}>{it}</CheckRow>)}</div></div>;
          })}</div>}
        </Card>;
      })}
    </div>
  </div>;

  const renderFarm = () => <div>
    <SectionTitle icon="🏠">農舍</SectionTitle>
    <Card><div style={{ display: "grid", gap: 7 }}>{HOUSE_LEVELS.map((h, i) => <Pill key={h} active={data.house === i} onClick={() => update({ house: i })}>{i === data.house ? "✓ " : ""}{h}</Pill>)}</div></Card>

    <SectionTitle icon="🔧">工具</SectionTitle>
    <Card>{TOOL_NAMES.map(([id, name, icon]) => <div key={id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: `1px dashed ${C.line}` }}><span style={{ fontSize: 19 }}>{icon}</span><b style={{ width: 58 }}>{name}</b><select value={data.tools[id]} onChange={e => updateNested("tools", { [id]: e.target.value })} style={{ flex: 1, border: `2px solid ${C.line}`, background: C.cream, borderRadius: 7, padding: 6, color: C.ink, fontWeight: 800 }}>{TOOL_LEVELS.map(x => <option key={x}>{x}</option>)}</select></div>)}</Card>

    <SectionTitle icon="🏗️">建築</SectionTitle>
    <Card>
      <div style={{ display: "grid", gap: 8 }}>
        <label style={{ fontSize: 12, color: C.muted, fontWeight: 800 }}>雞舍<select value={data.buildings.coop} onChange={e => updateNested("buildings", { coop: Number(e.target.value) })} style={{ width: "100%", marginTop: 4, padding: 7, border: `2px solid ${C.line}`, borderRadius: 7, background: C.cream, fontWeight: 800 }}>{COOP_LEVELS.map((x,i)=><option key={x} value={i}>{x}</option>)}</select></label>
        <label style={{ fontSize: 12, color: C.muted, fontWeight: 800 }}>牲口棚<select value={data.buildings.barn} onChange={e => updateNested("buildings", { barn: Number(e.target.value) })} style={{ width: "100%", marginTop: 4, padding: 7, border: `2px solid ${C.line}`, borderRadius: 7, background: C.cream, fontWeight: 800 }}>{BARN_LEVELS.map((x,i)=><option key={x} value={i}>{x}</option>)}</select></label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }}><label style={{ fontSize: 11, fontWeight: 800, color: C.muted }}>筒倉<NumInput value={data.buildings.silos} max={20} onChange={v => updateNested("buildings", { silos: v })}/></label><label style={{ fontSize: 11, fontWeight: 800, color: C.muted }}>魚塘<NumInput value={data.buildings.fishPonds} max={20} onChange={v => updateNested("buildings", { fishPonds: v })}/></label><label style={{ fontSize: 11, fontWeight: 800, color: C.muted }}>小屋<NumInput value={data.buildings.sheds} max={20} onChange={v => updateNested("buildings", { sheds: v })}/></label></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{SIMPLE_BUILDINGS.map(x => <Pill key={x} small active={data.buildings.other.includes(x)} onClick={() => updateNested("buildings", { other: data.buildings.other.includes(x) ? data.buildings.other.filter(y => y !== x) : [...data.buildings.other, x] })}>{x}</Pill>)}</div>
      </div>
    </Card>

    <SectionTitle icon="🐔">雞舍動物</SectionTitle>
    <Card><div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 9 }}>{COOP_ANIMALS.map(a => <label key={a.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 900 }}>{a.icon} {a.name}<span style={{ marginLeft: "auto" }}><NumInput value={data.animals[a.name] || 0} max={99} onChange={v => updateNested("animals", { [a.name]: v })}/></span></label>)}</div></Card>

    <SectionTitle icon="🐄">牲口棚動物</SectionTitle>
    <Card><div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 9 }}>{BARN_ANIMALS.map(a => <label key={a.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 900 }}>{a.icon} {a.name}<span style={{ marginLeft: "auto" }}><NumInput value={data.animals[a.name] || 0} max={99} onChange={v => updateNested("animals", { [a.name]: v })}/></span></label>)}</div></Card>

    <SectionTitle icon="🐟">魚塘</SectionTitle>
    <div style={{ display: "grid", gap: 8 }}>{data.ponds.map((p,i) => <Card key={i} style={{ padding: 10 }}><div style={{ display: "grid", gridTemplateColumns: "1.3fr .6fr .6fr", gap: 6 }}><input value={p.fish} onChange={e => { const ponds=[...data.ponds]; ponds[i]={...p,fish:e.target.value}; update({ponds}); }} placeholder="魚種" style={{ border:`2px solid ${C.line}`,borderRadius:7,padding:6,fontWeight:800,minWidth:0 }}/><NumInput value={p.count} max={10} onChange={v=>{const ponds=[...data.ponds];ponds[i]={...p,count:v};update({ponds});}}/><NumInput value={p.cap} max={10} onChange={v=>{const ponds=[...data.ponds];ponds[i]={...p,cap:v};update({ponds});}}/></div><input value={p.need} onChange={e=>{const ponds=[...data.ponds];ponds[i]={...p,need:e.target.value};update({ponds});}} placeholder="擴容需求／備註" style={{ width:"100%",marginTop:6,border:`1.5px solid ${C.line}`,borderRadius:7,padding:6,fontSize:12 }}/><button onClick={()=>update({ponds:data.ponds.filter((_,j)=>j!==i)})} style={{marginTop:5,border:0,background:"transparent",color:C.red,fontSize:11,fontWeight:900}}>刪除此魚塘</button></Card>)}</div>
    <button onClick={()=>update({ponds:[...data.ponds,{fish:"",count:0,cap:3,need:""}]})} style={{marginTop:8,width:"100%",border:`2px dashed ${C.line}`,background:C.cream,borderRadius:9,padding:9,fontWeight:900,color:C.brown}}>＋ 新增魚塘</button>
  </div>;

  const renderPeople = () => <div>
    <SectionTitle icon="💛">社交</SectionTitle>
    <Card style={{ background: "#FFF9E8" }}><div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>Switch 遊戲內「＋」→ 社交頁可對照愛心數。點人物可展開送禮速查；完整偏好仍建議開百科核對。</div></Card>
    {NPC_GROUPS.map(g => <div key={g.id}>
      <SectionTitle icon={g.id === "single" ? "💘" : g.id === "town" ? "🏘️" : "✨"}>{g.name}</SectionTitle>
      <div style={{ display: "grid", gap: 7 }}>{g.list.map(n => {
        const hearts = data.friendship[n] || 0;
        const open = expandedNPC === n;
        const gift = NPC_GIFTS[n];
        return <Card key={n} style={{ padding: 9 }}>
          <div onClick={()=>setExpandedNPC(open?null:n)} style={{ display:"flex",alignItems:"center",gap:7,cursor:"pointer" }}><b style={{flex:1,color:C.ink}}>{n}</b><span style={{fontSize:12,color:C.red,fontWeight:900}}>♥ {hearts}/{g.max}</span><span style={{color:C.brown,fontWeight:900}}>{open?"▲":"▼"}</span></div>
          <div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:6}}>{Array.from({length:g.max},(_,i)=><button key={i} onClick={()=>updateNested("friendship",{[n]:i+1===hearts?i:i+1})} style={{border:0,background:"transparent",padding:0,fontSize:16,color:i<hearts?C.red:"#D8CFC3",cursor:"pointer"}}>♥</button>)}</div>
          {open && <div style={{marginTop:8,paddingTop:7,borderTop:`1px dashed ${C.line}`,fontSize:12,lineHeight:1.55}}>
            {gift && <><div><b style={{color:C.red}}>最愛：</b>{gift.love.join("、")}</div><div><b style={{color:C.green}}>喜歡：</b>{gift.like.join("、")}</div><div><b style={{color:C.muted}}>討厭：</b>{gift.hate.join("、")}</div></>}
            <div style={{marginTop:6}}><WikiBtn name={NPC_WIKI[n] || n}/></div>
          </div>}
        </Card>;
      })}</div>
    </div>)}
  </div>;

  const renderCollection = () => {
    const c = COLLECTIONS[selectedCollection];
    const got = data.collections[selectedCollection] || [];
    return <div>
      <SectionTitle icon="📖">圖鑑</SectionTitle>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{Object.entries(COLLECTIONS).map(([k,v])=><Pill key={k} active={selectedCollection===k} onClick={()=>{setSelectedCollection(k);setSelectedItem(null)}}>{v.icon} {v.name}</Pill>)}</div>
      <Card style={{marginTop:10,padding:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:900,color:C.muted,marginBottom:5}}><span>{c.name}</span><span>{got.length}/{c.items.length}</span></div><ProgressBar value={got.length} max={c.items.length}/></Card>
      {selectedItem != null && <Card style={{marginTop:10,background:"#FFF9E8"}}><div style={{display:"flex",gap:10,alignItems:"center"}}>{ICON_URLS[selectedCollection]?.[selectedItem] && <img src={ICON_URLS[selectedCollection][selectedItem]} alt="" style={{width:48,height:48,imageRendering:"pixelated",objectFit:"contain"}}/>}<div style={{flex:1}}><b style={{fontSize:16,color:C.darkBrown}}>{c.items[selectedItem]}</b><div style={{fontSize:12,color:C.muted,marginTop:3}}>{c.info?.[selectedItem] || ""}</div></div><WikiBtn name={c.items[selectedItem]}/></div></Card>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:6,marginTop:10}}>{c.items.map((it,i)=>{
        const checked=got.includes(i);
        return <button key={i} onClick={()=>setSelectedItem(i)} onDoubleClick={()=>updateNested("collections",{[selectedCollection]:checked?got.filter(x=>x!==i):[...got,i]})} style={{position:"relative",border:`2px solid ${selectedItem===i?C.orange:checked?C.green:C.line}`,background:checked?"#E5F3CF":C.paper,borderRadius:9,padding:"6px 3px",minHeight:78,cursor:"pointer",boxShadow:`0 2px 5px ${C.shadow}`}}>
          <div style={{height:38,display:"flex",alignItems:"center",justifyContent:"center"}}>{ICON_URLS[selectedCollection]?.[i]?<img src={ICON_URLS[selectedCollection][i]} alt={it} loading="lazy" style={{width:36,height:36,imageRendering:"pixelated",objectFit:"contain"}}/>:<span style={{fontSize:13,color:C.muted,fontWeight:900}}>{i+1}</span>}</div>
          <div style={{fontSize:9.5,fontWeight:900,color:C.ink,lineHeight:1.15,marginTop:2}}>{it}</div>
          <button onClick={e=>{e.stopPropagation();updateNested("collections",{[selectedCollection]:checked?got.filter(x=>x!==i):[...got,i]})}} style={{position:"absolute",right:2,top:2,border:0,background:"transparent",fontSize:13,color:checked?C.green:"#C9B99A",fontWeight:950}}>{checked?"✓":"○"}</button>
        </button>})}</div>
    </div>;
  };

  const buildSummary = () => {
    const animals = Object.entries(data.animals || {}).filter(([,v])=>v>0).map(([k,v])=>`${k}×${v}`).join("、") || "無";
    const ponds = (data.ponds || []).map(p=>`${p.fish||"未填"}${p.count}/${p.cap}${p.need?`（${p.need}）`:""}`).join("；") || "無";
    const completedRooms = BUNDLE_ROOMS.filter(roomDone).map(r=>r.name).join("、") || "無";
    const collectionText = Object.entries(COLLECTIONS).map(([k,v])=>`${v.name}${(data.collections[k]||[]).length}/${v.items.length}`).join("、");
    return `《星露谷物語》目前進度\n日期：第${data.base.year}年${data.base.season}${data.base.day}日\n金錢：${Number(data.base.money||0).toLocaleString()}g；累計收入：${Number(data.base.totalIncome||0).toLocaleString()}g\n農場：${data.base.farm}；平台：${data.base.platform}\n技能：耕種${data.skills.farming}／採礦${data.skills.mining}／採集${data.skills.foraging}／釣魚${data.skills.fishing}／戰鬥${data.skills.combat}\n礦井：${data.mine.normal}層；骷髏洞最佳${data.mine.skullBest}層\n工具：水壺${data.tools.watering}、十字鎬${data.tools.pickaxe}、斧頭${data.tools.axe}、鋤頭${data.tools.hoe}、垃圾桶${data.tools.trash}\n農舍：${HOUSE_LEVELS[data.house]}\n社區中心：${rp.done}/30；已完成房間：${completedRooms}\n動物：${animals}\n魚塘：${ponds}\n圖鑑：${collectionText}\n\n備註：\n${data.notes||"無"}`;
  };
  const copySummary = async () => {
    const text=buildSummary();
    try { await navigator.clipboard.writeText(text); alert("進度摘要已複製"); }
    catch { prompt("請複製以下內容",text); }
  };
  const shareSummary = async () => {
    const text=buildSummary();
    if(navigator.share){try{await navigator.share({title:"星露谷進度",text});return}catch(e){if(e?.name==="AbortError")return}}
    await copySummary();
  };
  const exportBackup = () => {
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=`stardew-progress-Y${data.base.year}-${data.base.season}${data.base.day}.json`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),500);
  };
  const importRef=useRef(null);
  const importBackup = async (file) => {
    if(!file)return;
    try{const parsed=JSON.parse(await file.text());setData({...PREFILL,...parsed});alert("備份已匯入");}catch(e){alert("無法讀取這份備份檔")}
    if(importRef.current)importRef.current.value="";
  };

  const renderNotes = () => <div>
    <SectionTitle icon="📝">備註</SectionTitle>
    <Card><textarea value={data.notes} onChange={e=>update({notes:e.target.value})} placeholder="目前想記住的事、下一步、想討論的問題……" style={{width:"100%",minHeight:220,border:0,outline:0,resize:"vertical",background:"transparent",fontSize:14,lineHeight:1.6,color:C.ink,fontFamily:"inherit"}}/></Card>
    <SectionTitle icon="📤">分享進度</SectionTitle>
    <Card>
      <div style={{fontSize:12,color:C.muted,lineHeight:1.55,marginBottom:10}}>產生純文字進度摘要，可複製或分享給朋友、AI 助手一起討論遊戲安排；iPhone 也可叫出分享選單傳到其他 App。</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><button onClick={copySummary} style={{border:`2px solid ${C.green}`,background:C.lightGreen,color:C.green,borderRadius:9,padding:10,fontWeight:950}}>複製摘要</button><button onClick={shareSummary} style={{border:`2px solid ${C.orange}`,background:"#FFE4C5",color:C.brown,borderRadius:9,padding:10,fontWeight:950}}>分享…</button></div>
    </Card>
    <SectionTitle icon="💾">完整備份</SectionTitle>
    <Card>
      <div style={{fontSize:12,color:C.muted,lineHeight:1.55,marginBottom:10}}>平常會自動儲存在目前裝置的瀏覽器中。換裝置、清除瀏覽器資料前，建議匯出一份 JSON 備份；這份檔案也可以分享給朋友或 AI 助手討論。</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><button onClick={exportBackup} style={{border:`2px solid ${C.blue}`,background:"#E3F1FB",color:C.blue,borderRadius:9,padding:10,fontWeight:950}}>匯出 JSON</button><button onClick={()=>importRef.current?.click()} style={{border:`2px solid ${C.line}`,background:C.cream,color:C.brown,borderRadius:9,padding:10,fontWeight:950}}>匯入備份</button></div>
      <input ref={importRef} type="file" accept="application/json,.json" style={{display:"none"}} onChange={e=>importBackup(e.target.files?.[0])}/>
    </Card>
    <SectionTitle icon="🔗">分享給朋友</SectionTitle>
    <Card><div style={{fontSize:12,color:C.muted,lineHeight:1.6}}>把網站連結分享給朋友即可使用。每個人的進度都只儲存在自己的瀏覽器／裝置，不會看到或改到其他人的記錄。</div></Card>
    <SectionTitle icon="📱">手機使用</SectionTitle>
    <Card><div style={{fontSize:12,color:C.muted,lineHeight:1.6}}>建議把頁面加入 iPhone 主畫面，玩 Switch 時像 App 一樣直接打開。進度存在目前裝置；若要換裝置請先匯出 JSON 備份再匯入。圖鑑圖片來自 Stardew Valley Wiki。</div></Card>
    <SectionTitle icon="⚠️">資料管理</SectionTitle>
    <button onClick={async()=>{if(confirm("確定要清除全部進度並恢復預填資料嗎？")){await storageDelete(PUB_KEY,true);await storageDelete(STORAGE_KEY,false);setData(PREFILL)}}} style={{width:"100%",border:`2px solid ${C.red}`,background:"#FBE4DE",color:C.red,borderRadius:9,padding:10,fontWeight:950}}>重設全部進度</button>
  </div>;

  if(!loaded)return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui",color:C.darkBrown,fontWeight:900}}>載入星露谷手帳…</div>;
  const content={overview:renderOverview,skills:renderSkills,bundles:renderBundles,farm:renderFarm,people:renderPeople,collection:renderCollection,notes:renderNotes}[tab];
  return <div style={{minHeight:"100vh",background:C.bg,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang TC','Noto Sans TC',sans-serif",color:C.ink,paddingBottom:82}}>
    {renderHeader()}
    <main style={{maxWidth:680,margin:"0 auto",padding:"8px 12px 24px"}}>{content()}</main>
    <div style={{position:"fixed",left:0,right:0,bottom:0,zIndex:50,background:C.darkBrown,borderTop:`4px solid ${C.gold}`,display:"flex",justifyContent:"space-around",padding:"6px 2px calc(6px + env(safe-area-inset-bottom))"}}>
      {TABS.map(t=><button key={t.id} onClick={()=>{setTab(t.id);window.scrollTo(0,0)}} style={{background:tab===t.id?C.gold:"transparent",border:"none",borderRadius:10,padding:"6px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:48}}><span style={{fontSize:19}}>{t.icon}</span><span style={{fontSize:10.5,fontWeight:900,color:tab===t.id?C.darkBrown:"#E8C88F"}}>{t.name}</span></button>)}
    </div>
  </div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<StardewTracker />);
