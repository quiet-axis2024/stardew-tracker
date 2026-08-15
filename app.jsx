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
  { id: "special", name: "特殊角色", max: 10, list: ["桑迪", "科罗布斯", "矮人", "雷歐"] },
];

/* 百科條目名對照（人物頁連結用） */
const NPC_WIKI = {
  阿比蓋爾: "阿比盖尔", 艾蜜麗: "艾米丽", 海莉: "海莉", 莉亞: "莉亚", 瑪魯: "玛鲁", 潘妮: "潘妮",
  亞歷克斯: "亚历克斯", 艾利歐特: "艾利欧特", 哈維: "哈维", 山姆: "山姆", 塞巴斯蒂安: "塞巴斯蒂安", 謝恩: "谢恩",
  卡洛琳: "卡洛琳", 克林特: "克林特", 德米特里厄斯: "德米特里厄斯", 艾芙琳: "艾芙琳", 喬治: "乔治", 格斯: "格斯",
  賈斯: "贾斯", 喬迪: "乔迪", 肯特: "肯特", 劉易斯: "刘易斯", 萊納斯: "莱纳斯", 瑪妮: "玛妮",
  潘姆: "潘姆", 皮埃爾: "皮埃尔", 羅賓: "罗宾", 文森特: "文森特", 威利: "威利", 法師: "法师",
  桑迪: "桑迪", 克羅布斯: "科罗布斯", 科罗布斯: "科罗布斯", 矮人: "矮人", 雷歐: "雷欧",
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
  科罗布斯: { love: ["钻石", "铱锭", "南瓜", "虚空蛋", "虚空蛋黄酱", "野山葵"], like: ["（见百科）"], hate: ["（见百科）"] },
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
  { name: "黑暗護符", desc: "法師任務：於下水道向科罗布斯取得" },
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
  { id: "greenhouse", name: "溫室修復", desc: "解鎖全年種植空間" },
  { id: "horse", name: "馬匹取得", desc: "建造马厩後取得马，與農場建築進度聯動" },
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
  { id: "island", name: "姜岛解鎖", desc: "修復威利的船並抵達姜岛" },
  { id: "volcano", name: "火山地牢頂層", desc: "抵達火山第 10 層並解鎖鍛造台" },
  { id: "walnutRoom", name: "齊先生的核桃房", desc: "收集 100 顆金色核桃後解鎖" },
  { id: "masteryCave", name: "精通洞穴解鎖", desc: "五項技能皆達 10 級" },
  { id: "perfection", name: "完美度 100%", desc: "達成遊戲完美度 100%" },
];

/* 圖鑑清單：排列順序與遊戲收藏頁一致（1.6），名稱採遊戲內原文以便對照與百科查詢 */
const WIKI_BASE = "https://wiki.biligame.com/stardewvalley/";

/* 圖鑑使用 Stardew Valley Wiki 的遊戲原始 48×48 圖示。
   Special:Redirect/file 會由 Wiki 自動導向目前版本的原圖，不必手動維護圖片雜湊路徑。 */
const WIKI_FILE = (name) => `https://stardewvalleywiki.com/Special:Redirect/file/${encodeURIComponent(name + ".png")}`;
const GAME_FILE = (name) => window.SDVLocalGameFilesV67?.[name] || WIKI_FILE(name);
const iconMap = (names) => Object.fromEntries(names.map((name, i) => [i, GAME_FILE(name)]));
const UI_ICON_FILES = {
  "📅":"Calendar", "📊":"Stardrop", "🏆":"Stardrop", "🎒":"Inventory Tab", "⭐":"Skills Tab Icon",
  "⛏️":"Pickaxe", "✨":"Stardrop", "📦":"Golden Scroll", "🏠":"House (tier 1)", "🔧":"Pickaxe",
  "🏗️":"Silo", "🐔":"White Chicken", "🐄":"Cow", "🐟":"Sunfish", "💛":"Social Tab", "💘":"Bouquet",
  "🏘️":"Social Tab", "📖":"Collections Tab", "📝":"Special Items & Powers Tab", "📤":"Letter", "💾":"Chest",
  "🔗":"Social Tab", "📱":"Inventory Tab"
};
const TAB_ICON_FILES = {
  overview:"Inventory Tab", skills:"Skills Tab Icon", bundles:"Golden Scroll", farm:"Animals Tab",
  people:"Social Tab", collection:"Collections Tab", notes:"Journal Scrap"
};
const SKILL_ICON_FILES = { farming:"Farming Skill Icon", mining:"Mining Skill Icon", foraging:"Foraging Skill Icon", fishing:"Fishing Skill Icon", combat:"Combat Skill Icon" };
const TOOL_ICON_FILES = { watering:"Watering Can", pickaxe:"Pickaxe", axe:"Axe", hoe:"Hoe", trash:"Copper Trash Can" };
const ANIMAL_ICON_FILES = { 雞:"White Chicken", 藍雞:"Blue Chicken", 虛空雞:"Void Chicken", 金雞:"Golden Chicken", 鴨:"Duck", 兔子:"Rabbit", 恐龍:"Dinosaur", 牛:"White Cow", 山羊:"Goat", 綿羊:"Sheep", 豬:"Pig", 鴕鳥:"Ostrich" };
const ROOM_ICON_FILES = { crafts:"Junimo Icon", pantry:"Parsnip", fishtank:"Sunfish", boiler:"Copper Bar", bulletin:"Bulletin Board", vault:"Gold" };
const NPC_ICON_FILES = {
  阿比蓋爾:"Abigail Icon", 艾蜜麗:"Emily Icon", 海莉:"Haley Icon", 莉亞:"Leah Icon", 瑪魯:"Maru Icon", 潘妮:"Penny Icon",
  亞歷克斯:"Alex Icon", 艾利歐特:"Elliott Icon", 哈維:"Harvey Icon", 山姆:"Sam Icon", 塞巴斯蒂安:"Sebastian Icon", 謝恩:"Shane Icon",
  卡洛琳:"Caroline Icon", 克林特:"Clint Icon", 德米特里厄斯:"Demetrius Icon", 艾芙琳:"Evelyn Icon", 喬治:"George Icon", 格斯:"Gus Icon",
  賈斯:"Jas Icon", 喬迪:"Jodi Icon", 肯特:"Kent Icon", 劉易斯:"Lewis Icon", 萊納斯:"Linus Icon", 瑪妮:"Marnie Icon", 潘姆:"Pam Icon",
  皮埃爾:"Pierre Icon", 羅賓:"Robin Icon", 文森特:"Vincent Icon", 威利:"Willy Icon", 法師:"Wizard Icon", 桑迪:"Sandy Icon",
  科罗布斯:"Krobus Icon", 矮人:"Dwarf Icon", 雷歐:"Leo Icon"
};

function retryWikiImageV48(e){
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
}



const COOKING_INGREDIENT_GROUPS_V3 = [
  {id:"crops",name:"作物",icon:"Parsnip"},
  {id:"forage",name:"采集",icon:"Common Mushroom"},
  {id:"fruit",name:"果树／动物／加工",icon:"Apple"},
  {id:"fish",name:"鱼类",icon:"Tuna"},
  {id:"crab",name:"蟹笼",icon:"Lobster"},
  {id:"store",name:"商店／杂项",icon:"Wheat Flour"},
  {id:"prep",name:"预制料理",icon:"Fried Egg"}
];

const COOKING_INGREDIENTS_V3 = [
  // Crops (26)
  ["防风草","Parsnip",2,"crops"],["甘蓝菜","Kale",2,"crops"],["土豆","Potato",2,"crops"],["蓝爵","Blue Jazz",1,"crops"],["青豆","Green Bean",2,"crops"],["花椰菜","Cauliflower",1,"crops"],["大黄","Rhubarb",1,"crops"],["蒜","Garlic",2,"crops"],["辣椒","Hot Pepper",3,"crops"],["萝卜","Radish",2,"crops"],["虞美人","Poppy",1,"crops"],["西红柿","Tomato",8,"crops"],["甜瓜","Melon",2,"crops"],["蓝莓","Blueberry",2,"crops"],["玉米","Corn",2,"crops"],["红叶卷心菜","Red Cabbage",3,"crops"],["小白菜","Bok Choy",1,"crops"],["茄子","Eggplant",2,"crops"],["苋菜","Amaranth",1,"crops"],["蔓越莓","Cranberries",4,"crops"],["山药","Yam",2,"crops"],["南瓜","Pumpkin",3,"crops"],["甜菜","Beet",1,"crops"],["洋蓟","Artichoke",2,"crops"],["菠萝","Pineapple",1,"crops"],["芋头","Taro Root",4,"crops"],
  // Forage (13)
  ["黑莓","Blackberry",2,"forage"],["山洞萝卜","Cave Carrot",5,"forage"],["普通蘑菇","Common Mushroom",3,"forage"],["蒲公英","Dandelion",1,"forage"],["椰子","Coconut",3,"forage"],["蕨菜","Fiddlehead Fern",1,"forage"],["榛子","Hazelnut",4,"forage"],["野山葵","Wild Horseradish",1,"forage"],["韭葱","Leek",1,"forage"],["羊肚菌","Morel",1,"forage"],["野梅","Wild Plum",2,"forage"],["冬根","Winter Root",1,"forage"],["姜","Ginger",3,"forage"],
  // Tree fruit / animal / artisan (10)
  ["苹果","Apple",1,"fruit"],["杏子","Apricot",1,"fruit"],["香蕉","Banana",1,"fruit"],["芒果","Mango",1,"fruit"],["鸡蛋","Egg",8,"fruit"],["牛奶","Milk",12,"fruit"],["奶酪","Cheese",3,"fruit"],["蛋黄酱","Mayonnaise",2,"fruit"],["虚空蛋黄酱","Void Mayonnaise",1,"fruit"],["咖啡","Coffee",3,"fruit"],
  // Misc (3) grouped with store
  ["枫糖浆","Maple Syrup",1,"store"],["鱿鱼墨汁","Squid Ink",2,"store"],["苔藓","Moss",20,"store"],
  // Fishing (17)
  ["金枪鱼","Tuna",1,"fish"],["沙丁鱼","Sardine",2,"fish"],["鲷鱼","Bream",1,"fish"],["大嘴鲈鱼","Largemouth Bass",1,"fish"],["虹鳟鱼","Rainbow Trout",1,"fish"],["鲑鱼","Salmon",1,"fish"],["比目鱼","Flounder",1,"fish"],["午夜鲤鱼","Midnight Carp",1,"fish"],["鲤鱼","Carp",4,"fish"],["太阳鱼","Sunfish",1,"fish"],["鳗鱼","Eel",2,"fish"],["鱿鱼","Squid",1,"fish"],["海参","Sea Cucumber",1,"fish"],["任意鱼","Fish",2,"fish"],["海草","Seaweed",1,"fish"],["绿藻","Green Algae",5,"fish"],["白藻","White Algae",2,"fish"],
  // Crab pot (8)
  ["龙虾","Lobster",1,"crab"],["蛤","Clam",1,"crab"],["小龙虾","Crayfish",1,"crab"],["螃蟹","Crab",1,"crab"],["蚌","Mussel",1,"crab"],["虾","Shrimp",2,"crab"],["蜗牛","Snail",1,"crab"],["玉黍螺","Periwinkle",2,"crab"],
  // General store (5)
  ["糖","Sugar",18,"store"],["小麦粉","Wheat Flour",22,"store"],["大米","Rice",3,"store"],["油","Oil",11,"store"],["醋","Vinegar",4,"store"],
  // Ingredient dishes (6)
  ["煎鸡蛋","Fried Egg",1,"prep"],["薯饼","Hashbrowns",2,"prep"],["薄煎饼","Pancakes",1,"prep"],["墨西哥薄饼","Tortilla",2,"prep"],["面包","Bread",3,"prep"],["煎蛋卷","Omelet",1,"prep"]
].map(([name,file,need,group])=>({name,file,need,group}));

const COOKING_RECIPES_V3 = [
  ["煎鸡蛋","Fried Egg",["鸡蛋"]],["煎蛋卷","Omelet",["鸡蛋","牛奶"]],["沙拉","Salad",["韭葱","蒲公英","醋"]],["乳酪花椰菜","Cheese Cauliflower",["花椰菜","奶酪"]],["烤鱼","Baked Fish",["太阳鱼","鲷鱼","小麦粉"]],["防风草汤","Parsnip Soup",["防风草","牛奶","醋"]],["蔬菜杂烩","Vegetable Medley",["西红柿","甜菜"]],["完美早餐","Complete Breakfast",["煎鸡蛋","牛奶","薯饼","薄煎饼"]],["炸鱿鱼","Fried Calamari",["鱿鱼","小麦粉","油"]],["奇怪的小面包","Strange Bun",["小麦粉","玉黍螺","虚空蛋黄酱"]],
  ["幸运午餐","Lucky Lunch",["海参","墨西哥薄饼","蓝爵"]],["炒蘑菇","Fried Mushroom",["普通蘑菇","羊肚菌","油"]],["披萨","Pizza",["小麦粉","西红柿","奶酪"]],["豆类火锅","Bean Hotpot",["青豆"]],["琉璃山药","Glazed Yams",["山药","糖"]],["惊喜鲤鱼","Carp Surprise",["鲤鱼"]],["薯饼","Hashbrowns",["土豆","油"]],["薄煎饼","Pancakes",["小麦粉","鸡蛋"]],["鲑鱼晚餐","Salmon Dinner",["鲑鱼","苋菜","甘蓝菜"]],["鱼肉卷","Fish Taco",["金枪鱼","墨西哥薄饼","红叶卷心菜","蛋黄酱"]],
  ["香酥鲈鱼","Crispy Bass",["大嘴鲈鱼","小麦粉","油"]],["爆炒青椒","Pepper Poppers",["辣椒","奶酪"]],["面包","Bread",["小麦粉"]],["椰汁汤","Tom Kha Soup",["椰子","虾","普通蘑菇"]],["鳟鱼汤","Trout Soup",["虹鳟鱼","绿藻"]],["巧克力蛋糕","Chocolate Cake",["小麦粉","糖","鸡蛋"]],["粉红蛋糕","Pink Cake",["甜瓜","小麦粉","糖","鸡蛋"]],["大黄派","Rhubarb Pie",["大黄","小麦粉","糖"]],["曲奇","Cookie",["小麦粉","糖","鸡蛋"]],["意大利面","Spaghetti",["小麦粉","西红柿"]],
  ["炒鳗鱼","Fried Eel",["鳗鱼","油"]],["香辣鳗鱼","Spicy Eel",["鳗鱼","辣椒"]],["生鱼片","Sashimi",["任意鱼"]],["生鱼寿司","Maki Roll",["任意鱼","海草","大米"]],["墨西哥薄饼","Tortilla",["玉米"]],["红之盛宴","Red Plate",["红叶卷心菜","萝卜"]],["帕尔玛奶酪茄子","Eggplant Parmesan",["茄子","西红柿"]],["大米布丁","Rice Pudding",["牛奶","糖","大米"]],["冰淇淋","Ice Cream",["牛奶","糖"]],["蓝莓千层酥","Blueberry Tart",["蓝莓","小麦粉","糖","鸡蛋"]],
  ["秋日恩赐","Autumn's Bounty",["山药","南瓜"]],["南瓜汤","Pumpkin Soup",["南瓜","牛奶"]],["巨无霸餐","Super Meal",["小白菜","蔓越莓","洋蓟"]],["蔓越莓酱","Cranberry Sauce",["蔓越莓","糖"]],["塞料面包","Stuffing",["面包","蔓越莓","榛子"]],["农夫午餐","Farmer's Lunch",["煎蛋卷","防风草"]],["救生汉堡","Survival Burger",["面包","山洞萝卜","茄子"]],["海之菜肴","Dish O' The Sea",["沙丁鱼","薯饼"]],["矿工特供","Miner's Treat",["山洞萝卜","糖","牛奶"]],["块茎拼盘","Roots Platter",["山洞萝卜","冬根"]],
  ["三倍浓缩咖啡","Triple Shot Espresso",["咖啡"]],["海泡布丁","Seafoam Pudding",["比目鱼","午夜鲤鱼","鱿鱼墨汁"]],["藻类汤","Algae Soup",["绿藻"]],["清汤","Pale Broth",["白藻"]],["葡萄干布丁","Plum Pudding",["野梅","小麦粉","糖"]],["洋蓟蘸酱","Artichoke Dip",["洋蓟","牛奶"]],["爆炒什锦菜","Stir Fry",["山洞萝卜","普通蘑菇","甘蓝菜","油"]],["烤榛子","Roasted Hazelnuts",["榛子"]],["南瓜派","Pumpkin Pie",["南瓜","小麦粉","牛奶","糖"]],["萝卜沙拉","Radish Salad",["油","醋","萝卜"]],
  ["水果沙拉","Fruit Salad",["蓝莓","甜瓜","杏子"]],["黑莓脆皮饼","Blackberry Cobbler",["黑莓","糖","小麦粉"]],["蔓越莓糖果","Cranberry Candy",["蔓越莓","苹果","糖"]],["意式烤面包","Bruschetta",["面包","油","西红柿"]],["凉拌卷心菜","Coleslaw",["红叶卷心菜","醋","蛋黄酱"]],["意式蕨菜炖饭","Fiddlehead Risotto",["蕨菜","油","蒜"]],["虞美人籽松糕","Poppyseed Muffin",["虞美人","小麦粉","糖"]],["海鲜杂烩汤","Chowder",["蛤","牛奶"]],["鱼肉炖菜","Fish Stew",["小龙虾","蚌","玉黍螺","西红柿"]],["法式田螺","Escargot",["蜗牛","蒜"]],
  ["龙虾浓汤","Lobster Bisque",["龙虾","牛奶"]],["枫糖棒","Maple Bar",["枫糖浆","糖","小麦粉"]],["蟹黄糕","Crab Cakes",["螃蟹","小麦粉","鸡蛋","油"]],["虾鸡尾酒","Shrimp Cocktail",["西红柿","虾","野山葵"]],["姜汁汽水","Ginger Ale",["姜","糖"]],["香蕉布丁","Banana Pudding",["香蕉","牛奶","糖"]],["芒果糯米饭","Mango Sticky Rice",["芒果","椰子","大米"]],["夏威夷芋泥","Poi",["芋头"]],["热带咖喱","Tropical Curry",["椰子","菠萝","辣椒"]],["墨汁意大利饺","Squid Ink Ravioli",["鱿鱼墨汁","小麦粉","西红柿"]],["苔藓汤","Moss Soup",["苔藓"]]
].map(([name,file,ingredients])=>({name,file,ingredients}));

const COLLECTION_PAGE_ICONS_V3 = {
  dex:"Collections Tab", achievements:"Achievement Star 01", shipping:"Shipping Bin", cooking:"Cooking Icon",
  letters:"Letter", notes:"Secret Note Icon", scraps:"Journal Scrap"
};
const SECRET_NOTE_IMAGE_NUMBERS_V3 = new Set([11,16,17,18,19,20,21]);
const JOURNAL_SCRAP_IMAGE_NUMBERS_V3 = new Set([4,6,10]);


const COOKING_PREP_GROUPS_V3 = [
  {id:"g1",name:"第 1 組｜作物＋陸地採集",desc:"照攻略先備齊這組；亮起＝已經放足最低需求量。",items:[
    ["parsnip","防風草","Parsnip",2],["kale","羽衣甘藍","Kale",2],["potato","馬鈴薯","Potato",2],["jazz","藍爵","Blue Jazz",1],["bean","青豆","Green Bean",2],["cauli","花椰菜","Cauliflower",1],["rhubarb","大黃","Rhubarb",1],["garlic","蒜","Garlic",2],["pepper","辣椒","Hot Pepper",3],["radish","蘿蔔","Radish",2],["poppy","虞美人花","Poppy",1],["tomato","番茄","Tomato",8],["melon","甜瓜","Melon",2],["blueberry","藍莓","Blueberry",2],["corn","玉米","Corn",2],["redcabbage","紅葉捲心菜","Red Cabbage",3],["bokchoy","小白菜","Bok Choy",1],["eggplant","茄子","Eggplant",2],["amaranth","莧菜","Amaranth",1],["cranberries","蔓越莓","Cranberries",4],["yam","山藥","Yam",2],["pumpkin","南瓜","Pumpkin",3],["beet","甜菜","Beet",1],["artichoke","朝鮮薊","Artichoke",2],["pineapple","鳳梨","Pineapple",1],["taro","芋頭","Taro Root",4],
    ["cavecarrot","山洞蘿蔔","Cave Carrot",5],["commonmushroom","普通蘑菇","Common Mushroom",3],["dandelion","蒲公英","Dandelion",1],["fiddlehead","蕨菜","Fiddlehead Fern",1],["hazelnut","榛子","Hazelnut",4],["horseradish","野山葵","Wild Horseradish",1],["leek","韭蔥","Leek",1],["morel","羊肚菌","Morel",1],["winterroot","冬根","Winter Root",1]
  ]},
  {id:"g2",name:"第 2 組｜水果・動物・加工・特殊採集",desc:"對應攻略第二箱的水果與加工類。",items:[
    ["blackberry","黑莓","Blackberry",2],["coconut","椰子","Coconut",3],["wildplum","野梅","Wild Plum",2],["ginger","薑","Ginger",3],
    ["apple","蘋果","Apple",1],["apricot","杏子","Apricot",1],["banana","香蕉","Banana",1],["mango","芒果","Mango",1],
    ["egg","蛋","Egg",8],["milk","牛奶","Milk",12],["cheese","乳酪","Cheese",3],["mayo","美乃滋","Mayonnaise",2],["voidmayo","虛空美乃滋","Void Mayonnaise",1],["coffee","咖啡","Coffee",3],
    ["maplesyrup","楓糖漿","Maple Syrup",1],["squidink","魷魚墨汁","Squid Ink",2],["moss","苔蘚","Moss",20]
  ]},
  {id:"g3",name:"第 3 組｜魚・海鮮・蟹籠",desc:"對應攻略水產箱；『任意魚』準備任意可作為料理材料的魚即可。",items:[
    ["tuna","金槍魚","Tuna",1],["sardine","沙丁魚","Sardine",2],["bream","鯛魚","Bream",1],["largemouth","大嘴鱸魚","Largemouth Bass",1],["rainbow","虹鱒魚","Rainbow Trout",1],["salmon","鮭魚","Salmon",1],["flounder","比目魚","Flounder",1],["midnightcarp","午夜鯉魚","Midnight Carp",1],["carp","鯉魚","Carp",4],["sunfish","太陽魚","Sunfish",1],["eel","鰻魚","Eel",2],["squid","魷魚","Squid",1],["seacucumber","海參","Sea Cucumber",1],["anyfish","任意魚","Bream",2],["seaweed","海草","Seaweed",1],["greenalgae","綠藻","Green Algae",5],["whitealgae","白藻","White Algae",2],
    ["lobster","龍蝦","Lobster",1],["clam","蛤","Clam",1],["crayfish","小龍蝦","Crayfish",1],["crab","螃蟹","Crab",1],["mussel","蚌","Mussel",1],["shrimp","蝦","Shrimp",2],["snail","蝸牛","Snail",1],["periwinkle","玉黍螺","Periwinkle",2]
  ]},
  {id:"g4",name:"第 4 組｜商店基礎材料",desc:"直接買齊即可；數字只是攻略最低需求，不用在手帳維護庫存。",items:[
    ["sugar","糖","Sugar",18],["flour","大麥粉","Wheat Flour",22],["rice","大米","Rice",3],["oil","油","Oil",11],["vinegar","醋","Vinegar",4]
  ]},
  {id:"g5",name:"第 5 組｜先做好的前置料理",desc:"這 6 種料理本身又會被其他食譜當材料；先做足再開始逐道完成全部料理。",items:[
    ["friedegg","煎雞蛋","Fried Egg",1],["hashbrowns","薯餅","Hashbrowns",2],["pancakes","薄煎餅","Pancakes",1],["tortilla","墨西哥薄餅","Tortilla",2],["bread","麵包","Bread",3],["omelet","煎蛋捲","Omelet",1]
  ]}
];

const COOKING_DISHES_V3 = [
 ["friedegg","煎雞蛋","Fried Egg"],["omelet","煎蛋捲","Omelet"],["salad","沙拉","Salad"],["cheesecauliflower","乳酪花椰菜","Cheese Cauliflower"],["bakedfish","烤魚","Baked Fish"],["parsnipsoup","防風草湯","Parsnip Soup"],["vegetablemedley","蔬菜雜燴","Vegetable Medley"],["completebreakfast","完美早餐","Complete Breakfast"],["friedcalamari","炸魷魚","Fried Calamari"],["strangebun","奇怪的小麵包","Strange Bun"],
 ["luckylunch","幸運午餐","Lucky Lunch"],["friedmushroom","炒蘑菇","Fried Mushroom"],["pizza","披薩","Pizza"],["beanhotpot","豆類火鍋","Bean Hotpot"],["glazedyams","琉璃山藥","Glazed Yams"],["carpsurprise","驚喜鯉魚","Carp Surprise"],["hashbrowns","薯餅","Hashbrowns"],["pancakes","薄煎餅","Pancakes"],["salmondinner","鮭魚晚餐","Salmon Dinner"],["fishtaco","魚肉捲","Fish Taco"],
 ["crispybass","香酥鱸魚","Crispy Bass"],["pepperpoppers","爆炒青椒","Pepper Poppers"],["bread","麵包","Bread"],["tomkha","椰汁湯","Tom Kha Soup"],["troutsoup","鱒魚湯","Trout Soup"],["chocolatecake","巧克力蛋糕","Chocolate Cake"],["pinkcake","粉紅蛋糕","Pink Cake"],["rhubarbpie","大黃派","Rhubarb Pie"],["cookie","餅乾","Cookie"],["spaghetti","義大利麵","Spaghetti"],
 ["friedeel","炒鰻魚","Fried Eel"],["spicyeel","香辣鰻魚","Spicy Eel"],["sashimi","生魚片","Sashimi"],["makiroll","生魚壽司","Maki Roll"],["tortilla","墨西哥薄餅","Tortilla"],["redplate","紅之盛宴","Red Plate"],["eggplantparmesan","帕爾瑪乳酪茄子","Eggplant Parmesan"],["ricepudding","米布丁","Rice Pudding"],["icecream","冰淇淋","Ice Cream"],["blueberrytart","藍莓千層酥","Blueberry Tart"],
 ["autumnsbounty","秋日恩賜","Autumn's Bounty"],["pumpkinsoup","南瓜湯","Pumpkin Soup"],["supermeal","巨無霸餐","Super Meal"],["cranberrysauce","蔓越莓醬","Cranberry Sauce"],["stuffing","塞料麵包","Stuffing"],["farmerslunch","農夫午餐","Farmer's Lunch"],["survivalburger","救生漢堡","Survival Burger"],["dishofthesea","海之菜餚","Dish O' The Sea"],["minerstreat","礦工特供","Miner's Treat"],["rootsplatter","塊莖拼盤","Roots Platter"],
 ["tripleespresso","三倍濃縮咖啡","Triple Shot Espresso"],["seafoampudding","海泡布丁","Seafoam Pudding"],["algaesoup","海藻湯","Algae Soup"],["palebroth","清湯","Pale Broth"],["plumpudding","葡萄乾布丁","Plum Pudding"],["artichokedip","水煮朝鮮薊","Artichoke Dip"],["stirfry","蔬菜什錦蓋飯","Stir Fry"],["roastedhazelnuts","烤榛子","Roasted Hazelnuts"],["pumpkinpie","南瓜派","Pumpkin Pie"],["radishsalad","蘿蔔沙拉","Radish Salad"],
 ["fruitsalad","水果沙拉","Fruit Salad"],["blackberrycobbler","黑莓脆皮餅","Blackberry Cobbler"],["cranberrycandy","蔓越莓糖果","Cranberry Candy"],["bruschetta","義式烤麵包","Bruschetta"],["coleslaw","高麗菜沙拉","Coleslaw"],["fiddleheadrisotto","義式蕨菜燉飯","Fiddlehead Risotto"],["poppyseedmuffin","虞美人籽鬆糕","Poppyseed Muffin"],["chowder","海鮮雜燴湯","Chowder"],["fishstew","燴魚湯","Fish Stew"],["escargot","法式田螺","Escargot"],
 ["lobsterbisque","龍蝦濃湯","Lobster Bisque"],["maplebar","楓糖棒","Maple Bar"],["crabcakes","蟹黃糕","Crab Cakes"],["shrimpcocktail","蝦雞尾酒","Shrimp Cocktail"],["gingerale","薑汁汽水","Ginger Ale"],["bananapudding","香蕉布丁","Banana Pudding"],["mangostickyrice","芒果糯米飯","Mango Sticky Rice"],["poi","夏威夷芋泥","Poi"],["tropicalcurry","熱帶咖哩","Tropical Curry"],["squidinkravioli","墨汁義大利餃","Squid Ink Ravioli"],["mosssoup","苔蘚湯","Moss Soup"]
];

const COLLECTION_TABS_V3 = [
 ["shipping","出貨","Mini-Shipping Bin"],["fish","魚類","Pufferfish"],["artifact","古物","Dwarf Scroll I"],["mineral","礦物","Diamond"],["cooking","烹飪","Fried Egg"],["achievements","成就","Achievements Icon"],["notes","秘密紙條","Secret Note"],["scraps","日誌殘頁","Journal Scrap"]
];

const SHIPPING_ITEMS_V30 = [
  ["Wild Horseradish","野山葵"],["Daffodil","黃水仙"],["Leek","韭蔥"],["Dandelion","蒲公英"],["Parsnip","防風草"],["Cave Carrot","山洞蘿蔔"],["Coconut","椰子"],["Cactus Fruit","仙人掌果子"],["Banana","香蕉"],["Sap","樹液"],["Large Egg","大雞蛋（白）"],["Egg","雞蛋（白）"],["Brown Egg","雞蛋（棕）"],["Large Brown Egg","大雞蛋（棕）"],["Milk","牛奶"],["Large Milk","大壺牛奶"],["Green Bean","青豆"],["Cauliflower","花椰菜"],["Potato","土豆"],["Garlic","蒜"],["Kale","甘藍菜"],["Rhubarb","大黃"],["Melon","甜瓜"],["Tomato","西紅柿"],["Morel","羊肚菌"],["Blueberry","藍莓"],["Fiddlehead Fern","蕨菜"],["Hot Pepper","辣椒"],["Wheat","小麥"],["Radish","蘿蔔"],["Red Cabbage","紅葉卷心菜"],["Starfruit","楊桃"],["Corn","玉米"],["Unmilled Rice","未碾米"],["Eggplant","茄子"],["Artichoke","洋薊"],["Pumpkin","南瓜"],["Bok Choy","小白菜"],["Yam","山藥"],["Chanterelle","雞油菌"],["Cranberries","蔓越莓"],["Holly","冬青樹"],["Beet","甜菜"],["Ostrich Egg","鴕鳥蛋"],["Salmonberry","美洲大樹莓"],["Amaranth","莧菜"],["Pale Ale","淡啤酒"],["Hops","啤酒花"],["Void Egg","虛空蛋"],["Mayonnaise","蛋黃醬"],["Duck Mayonnaise","鴨蛋黃醬"],["Void Mayonnaise","虛空蛋黃醬"],["Clay","黏土"],["Copper Bar","銅錠"],["Iron Bar","鐵錠"],["Gold Bar","金錠"],["Iridium Bar","銥錠"],["Refined Quartz","精煉石英"],["Honey","蜂蜜"],["Pickles","醃菜"],["Jelly","果醬"],["Beer","啤酒"],["Wine","果酒"],["Juice","果汁"],["Poppy","虞美人花"],["Copper Ore","銅礦石"],["Iron Ore","鐵礦石"],["Coal","煤炭"],["Gold Ore","金礦石"],["Iridium Ore","銥礦石"],
  ["Wood","木材"],["Stone","石頭"],["Nautilus Shell","鸚鵡螺"],["Coral","珊瑚"],["Rainbow Shell","彩虹貝殼"],["Spice Berry","香味漿果"],["Sea Urchin","海膽"],["Grape","葡萄"],["Spring Onion","大蔥"],["Strawberry","草莓"],["Sweet Pea","甜豌豆"],["Common Mushroom","普通蘑菇"],["Wild Plum","野梅"],["Hazelnut","榛子"],["Blackberry","黑莓"],["Winter Root","冬根"],["Crystal Fruit","水晶果"],["Snow Yam","雪山藥"],["Sweet Gem Berry","寶石甜莓"],["Crocus","番紅花"],["Red Mushroom","紅蘑菇"],["Sunflower","向日葵"],["Purple Mushroom","紫蘑菇"],["Cheese","奶酪"],["Goat Cheese","山羊奶酪"],["Cloth","布料"],["Truffle","松露"],["Truffle Oil","松露油"],["Coffee Bean","咖啡豆"],["Goat Milk","羊奶"],["Large Goat Milk","大瓶羊奶"],["Wool","羊毛"],["Duck Egg","鴨蛋"],["Duck Feather","鴨毛"],["Caviar","魚子醬"],["Rabbit's Foot","兔子的腳"],["Aged Roe","陳年魚籽"],["Ancient Fruit","上古水果"],["Mead","蜂蜜酒"],["Tulip","鬱金香"],["Summer Spangle","夏季亮片"],["Fairy Rose","玫瑰仙子"],["Blue Jazz","藍爵"],["Apple","蘋果"],["Green Tea","綠茶"],["Apricot","杏子"],["Orange","橙子"],["Peach","桃子"],["Pomegranate","石榴"],["Cherry","櫻桃"],["Bug Meat","蟲肉"],["Hardwood","硬木"],["Maple Syrup","楓糖漿"],["Oak Resin","橡樹樹脂"],["Pine Tar","松焦油"],["Slime","史萊姆泥"],["Bat Wing","蝙蝠翅膀"],["Solar Essence","太陽精華"],["Void Essence","虛空精華"],["Fiber","纖維"],["Battery Pack","電池組"],["Dinosaur Mayonnaise","恐龍蛋黃醬"],["Roe","魚籽"],["Squid Ink","魷魚墨汁"],["Tea Leaves","茶葉"],["Ginger","薑"],["Taro Root","芋頭"],["Pineapple","菠蘿"],["Mango","芒果"],["Cinder Shard","火山晶石"],
  ["Magma Cap","熔岩菇"],["Bone Fragment","骨頭碎片"],["Radioactive Ore","放射性礦石"],["Radioactive Bar","放射性錠"],["Smoked Fish","燻魚"],["Moss","苔蘚"],["Mystic Syrup","神秘糖漿"],["Raisins","葡萄乾"],["Dried Fruit","果乾"],["Dried Mushrooms","蘑菇乾"],["Carrot","胡蘿蔔"],["Summer Squash","金皮西葫蘆"],["Broccoli","西蘭花"],["Powdermelon","霜瓜"]
];

const HATS_V30 = [
  ["Cowboy Hat","牛仔帽","完成博物館全收藏後，帽子老鼠 10,000g"],["Bowler Hat","圓頂禮帽","累計賺取 1,000,000g 後，帽子老鼠 10,000g"],["Top Hat","大禮帽","齊先生賭場 8,000 齊幣"],["Sombrero","墨西哥帽","累計賺取 10,000,000g 後，帽子老鼠"],["Straw Hat","草帽","彩蛋節找蛋比賽首次獲勝"],["Official Cap","大檐帽","釣到 24 種不同魚後，帽子老鼠"],["Blue Bonnet","藍色軟帽","博物館捐贈 40 件後，帽子老鼠"],["Plum Chapeau","紫紅小帽","烹飪 25 種料理後，帽子老鼠"],["Hard Hat","安全帽","探險家公會：擊殺 30 隻掘地蟲；亦可能沙漠節造型"],["Sou'wester","防雨帽","釣到 10 種不同魚後，帽子老鼠"],["Daisy","雛菊髮卡","製作 15 種物品後，帽子老鼠"],["Watermelon Band","西瓜髮卡","釣到 100 條魚後，帽子老鼠"],["Mouse Ears","老鼠耳朵","任一村民 10 心後，帽子老鼠"],["Cat Ears","貓耳","8 位村民 10 心後，帽子老鼠"],["Cowgal Hat","牛仔女郎帽","單一栽培成就後，帽子老鼠"],["Cowpoke Hat","專業牛仔帽","混合栽培成就後，帽子老鼠"],["Archer's Cap","射手帽","烹飪全部配方後，帽子老鼠"],["Blue Cowboy Hat","藍色牛仔帽","骷髏洞穴寶箱層"],["Red Cowboy Hat","紅色牛仔帽","骷髏洞穴寶箱層"],["Cone Hat","錐帽","夜市魔法商船"],["Elegant Turban","優雅頭巾","解鎖全部成就後，帽子老鼠"],["White Turban","白色頭巾","裁縫或骷髏洞穴寶箱層"],["Garbage Hat","垃圾帽","翻過 20 個垃圾桶後，每次有低機率取得"],["Golden Mask","金色面具","裁縫製作"],["Propeller Hat","螺旋槳帽","裁縫／隨機外觀掉落"],["Bridal Veil","新娘面紗","裁縫／隨機外觀掉落"],["Witch Hat","女巫帽","裁縫／隨機外觀掉落"],["Copper Pan","淘盤","把淘盤放進帽子欄"],["Green Turban","綠色頭巾","沙漠商人"],["Magic Cowboy Hat","魔法牛仔帽","沙漠商人奇數日"],["Magic Turban","魔法頭巾","沙漠商人偶數日"],["Golden Helmet","金色頭盔","打開金色椰子時機率取得"],["Deluxe Pirate Hat","豪華海盜帽","火山地牢寶箱"],["Pink Bow","粉色蝴蝶結","火山地牢矮人商店"],["Frog Hat","青蛙帽","姜岛青蛙洞穴水域釣到"],["Small Cap","小帽子","姜岛商人：週一交換"],["Bluebird Mask","藍鳥面具","姜岛商人：週三交換"],["Deluxe Cowboy Hat","豪華牛仔帽","姜岛商人：週五交換"],["Mr. Qi's Hat","齊先生的帽子","齊先生核桃房 5 齊鑽"],["Dark Cowboy Hat","黑色牛仔帽","骷髏洞穴寶箱層"]
];
const SHIRTS_V30 = [
  ["Shirt000","經典背帶褲","布料＋完美早餐",false],["Shirt002","薄荷襯衫","布料＋蒲公英",false],["Shirt003","深色襯衫","布料＋蝙蝠翅膀",false],["Shirt004","骷髏襯衫","布料＋史前頭骨；幽靈骷髏也可能掉落",false],["Shirt005","淺藍襯衫","布料＋蛋黃醬",false],["Shirt006","棕色條紋襯衫","布料＋樹液",false],["Shirt007","綠色背帶褲","布料＋蕨菜",false],["Shirt008","好悲傷襯衫","布料＋野山葵",false],["Shirt009","海藍寶石襯衫","布料＋鴨蛋黃醬",false],["Shirt010","西裝上衣","布料＋花束",false],["Shirt011","綠色腰帶襯衫","布料＋山洞蘿蔔",false],["Shirt012","萊姆綠條紋衫","布料＋鴨毛",false],["Shirt013","紅色條紋衫","布料＋蔓越莓糖果",false],["Shirt014","骨架襯衫","布料＋骨頭類物品；幽靈骷髏也可能掉落",false],["Shirt015","橙色襯衫","布料＋雞油菌",false],["Shirt016","夜空襯衫","布料＋藍莓千層酥",false],["Shirt017","鎮長吊帶褲","布料＋蔬菜雜燴",false],["Shirt018","棕色夾克","布料＋泥岩",false],["Shirt019","水手服","角色建立可選；染色版可用布料＋多種蟹籠海產",true]
];
const PANTS_V30 = [
  ["Farmer Pants","農夫長褲","布料＋蔓越莓／菠蘿／霜瓜／草莓／野梅",true],["Shorts","短褲","布料＋藍莓／葡萄／辣椒／甜瓜",true],["Long Dress","長裙","布料＋玫瑰仙子／向日葵",true],["Skirt","裙子","布料＋藍爵／鬱金香",true],["Pleated Skirt","百褶裙","布料＋虞美人花／夏季亮片",true],["Dinosaur Pants","恐龍褲","布料＋恐龍蛋黃醬",false],["Grass Skirt","草裙","布料＋乾草",false],["Genie Pants","神怪褲","布料＋上古水果／楊桃",true],["Baggy Pants","寬鬆褲","布料＋任意史萊姆蛋",true],["Simple Dress","簡單洋裝","布料＋任意蜂蜜",true],["Relaxed Fit Pants","休閒長褲","布料＋蘋果／杏子／香蕉／櫻桃／芒果／石榴",true],["Relaxed Fit Shorts","休閒短褲","布料＋橙子／桃子",true],["Prismatic Pants","五彩長褲","布料＋五彩碎片（隨機五彩服飾）",false],["Prismatic Genie Pants","五彩神怪褲","布料＋五彩碎片（隨機五彩服飾）",false]
];
const BOOTS_V30 = [
  ["Sneakers","運動鞋","探險家公會；礦井特殊史萊姆；釣魚寶箱"],["Rubber Boots","橡膠靴","礦井 1–40 特殊史萊姆；釣魚寶箱"],["Leather Boots","皮靴","礦井 10 層寶箱；釣魚寶箱"],["Work Boots","工作靴","探險家公會；隨機礦井 10 層寶箱"],["Combat Boots","戰靴","探險家公會；礦井／骷髏洞穴掉落"],["Tundra Boots","凍土靴","礦井 50 層寶箱；探險家公會"],["Thermal Boots","熱能靴","礦井中層木箱／特殊史萊姆；釣魚寶箱"],["Dark Boots","黑暗之靴","礦井 80 層後探險家公會；深層掉落"],["Firewalker Boots","蹈火者靴","礦井 80 層寶箱；釣魚寶箱"],["Genie Shoes","神怪之鞋","骷髏洞穴掉落；釣魚寶箱"],["Space Boots","太空之靴","礦井 110 層寶箱"],["Cowboy Boots","牛仔之靴","目前正常遊戲無法取得"],["Emily's Magic Boots","艾蜜麗的魔法靴","艾蜜麗 14 心事件"],["Leprechaun Shoes","矮精靈鞋子","火車掉落"],["Cinderclown Shoes","灰燼小丑鞋","火山地牢商店 100 火山晶石"],["Mermaid Boots","美人魚靴","火山地牢寶箱"],["Dragonscale Boots","龍鱗靴","火山地牢寶箱"],["Crystal Shoes","水晶鞋","骷髏洞穴掉落／隨機礦井 110 層寶箱"]
];

const SECRET_NOTE_SUMMARY_V3 = {
 1:"阿比蓋爾的最愛清單。",2:"山姆家的送禮備忘。",3:"莉亞心目中的完美晚餐。",4:"瑪魯的發明材料備忘。",5:"潘妮記下家人與熟人的喜好。",6:"酒吧常客的特別點單。",7:"幾位單身男性的喜好備忘。",8:"海莉與艾蜜麗的送禮清單。",9:"亞歷克斯的力量訓練餐。",10:"來自骷髏洞穴的挑戰訊息。",11:"瑪妮與賈斯的照片。",12:"垃圾桶物品的實用提示。",13:"春季最後一天的隱藏物品提示。",14:"社區中心後方的隱藏物品提示。",15:"美人魚表演的音符提示。",16:"鐵路區藏寶圖。",17:"河流北側的藏寶圖。",18:"沙漠區的藏寶圖。",19:"鎮上石橋附近的藏寶圖。",20:"通往特殊護符的路線圖。",21:"灌木中的秘密地點圖。",22:"與秘密紙條任務相關的提示。",23:"楓糖漿與熊的秘密任務。",24:"祝尼魔小屋顏色與寶石的提示。",25:"水邊遺失物的提示。",26:"古代植物相關提示。",27:"小鎮隱藏秘密的線索。"
};
const JOURNAL_SUMMARY_V3 = {1:"姜岛的第一條探索提示。",2:"島嶼地點線索。",3:"火山相關探索提示。",4:"一張姜岛藏寶圖。",5:"島上生物與物品提示。",6:"另一張島嶼藏寶圖。",7:"姜岛探索紀錄。",8:"姜岛探索紀錄。",9:"姜岛探索紀錄。",10:"金色核桃位置圖。",11:"姜岛最後的日誌提示。"};

const SECRET_NOTE_CONTENT_V4 = {
  1:"阿比蓋爾的最愛：南瓜、紫水晶、巧克力蛋糕、香辣鰻魚、黑莓脆皮餅。",
  2:"山姆的採買清單：塞巴斯蒂安＝淚晶／生魚片；潘妮＝綠寶石／虞美人花；文森特＝葡萄／蔓越莓糖果；喬迪＝香酥鱸魚／薄煎餅；肯特＝義式蕨菜燉飯／烤榛子；山姆＝仙人掌果子／楓糖棒／披薩。",
  3:"莉亞理想晚餐：沙拉、山羊乳酪、松露、果酒；甜點是虞美人籽鬆糕。",
  4:"瑪魯的發明材料：金錠、銥錠、電池組、鑽石、草莓。",
  5:"潘妮的送禮備忘：潘姆＝防風草／琉璃山藥（不要啤酒）；賈斯＝玫瑰仙子／葡萄乾布丁；文森特＝粉紅蛋糕／葡萄；喬治＝韭蔥／炒蘑菇；艾芙琳＝甜菜／鬱金香。",
  6:"星之果實酒吧特別點單：劉易斯＝秋日恩賜；瑪妮＝南瓜派；德米特里厄斯＝豆類火鍋；卡洛琳＝魚肉捲。",
  7:"幾位年長單身男性的喜好：哈維＝咖啡／醃菜；艾利歐特＝蟹黃糕／石榴；謝恩＝啤酒／披薩／爆炒青椒。",
  8:"海莉與艾蜜麗父母的送禮提示：海莉＝粉紅蛋糕／向日葵；艾蜜麗＝各類寶石／動物毛。",
  9:"亞歷克斯的力量訓練餐：完美早餐、鮭魚晚餐。",
  10:"紙條提示：有人在骷髏洞穴第 100 層等你。",
  11:"照片型紙條：瑪妮與賈斯的合照。",
  12:"垃圾桶提示：好運日更值得翻；酒吧後方可能有當日料理，喬治／艾芙琳家附近可能有餅乾，鐵匠鋪與博物館附近較容易翻到有價值的東西。",
  13:"提示：每季最後一天，中午 12:00 整，去遊樂場上方的灌木。",
  14:"提示：社區中心後方藏著東西。",
  15:"美人魚秀貝殼順序：1 → 5 → 4 → 2 → 3。",
  16:"藏寶圖型紙條：鐵路區的大石頭附近。",
  17:"藏寶圖型紙條：Joja 超市北側、靠河的最北端位置。",
  18:"藏寶圖型紙條：沙漠東南區長椅附近。",
  19:"路線圖型紙條：從 1 Willow Lane（喬迪家）門口起，依箭頭一路走到不能再走再轉向。",
  20:"路線圖型紙條：從鎮中心眼睛圖案起，依箭頭一路走到 Joja 超市旁的卡車。",
  21:"時間地點圖型紙條：凌晨 12:40 到海灘入口橋西北側的大灌木。",
  22:"齊先生提示：巴士站西側的黑暗隧道裡藏著他的秘密。",
  23:"提示：去秘密森林，身上帶一瓶楓糖漿。",
  24:"M. Jasper 的紀錄：把寶石或礦物放進祝尼魔小屋會影響祝尼魔顏色；葡萄乾也是祝尼魔特別喜歡的食物。",
  25:"提示：有人把卡洛琳的華麗項鍊弄丟在溫泉附近。",
  26:"古代農耕秘訣：餵祝尼魔葡萄乾，會讓牠們成為更有效率的收割幫手。",
  27:"爺爺留下提示：當你準備好時，煤矿森林南部有一處與五種技能精通有關的秘密。"
};
const SECRET_NOTE_SOLUTION_V4 = {
  10:"讀取後會加入「神秘紙條」任務；抵達骷髏洞穴 100 層觸發齊先生事件，獲得永久 +25 生命上限。",
  13:"任一季第 28 日 12:00，互動遊樂場上方灌木，可拿到祝尼魔毛絨玩偶。",
  14:"到社區中心後方、右側木圍欄附近，用十字鎬或鋤頭取得石祝尼魔雕像。",
  15:"冬季夜市進入最右側美人魚船，看完表演後依 1-5-4-2-3 點貝殼，可拿 1 顆珍珠；每位玩家每存檔只能領一次。",
  16:"鐵路軌道北側大石頭右邊一格用鋤頭挖，可拿寶箱。",
  17:"到 Joja 超市北側河邊，在東岸最北端那格挖，可拿綠色奇怪玩偶。",
  18:"到沙漠東南區長椅的西南側指定格挖，可拿黃色奇怪玩偶；沙漠節期間不能挖。",
  19:"照箭頭走到底會到劉易斯家後方的純金劉易斯雕像。把雕像放在鎮上還會觸發後續彩蛋與一次 750g 匿名信。",
  20:"其實可以直接去 Joja 超市旁卡車找司機；交出兔子的腳可取得「特殊的魅力」，永久提高每日運氣。",
  21:"凌晨 12:40 互動該灌木，會看到劉易斯與瑪妮的秘密事件。",
  22:"帶電池組到巴士站西側隧道，把電池放進隧道中央牆上的盒子，開始「神秘的齊」任務。",
  23:"6:00–19:00 帶楓糖漿進秘密森林觸發熊事件，取得「熊的知識」；黑莓與鮭莓售價永久變為 3 倍。",
  24:"在祝尼魔小屋內放寶石／可採集礦物／晶球礦物可改變祝尼魔顏色；五彩碎片會呈現彩虹色。",
  25:"春、夏、秋在溫泉外水池釣魚可釣到華麗項鍊；交卡洛琳加 50 友情，交阿比蓋爾加 100 友情。",
  26:"把葡萄乾放進祝尼魔小屋後，收割時有機率得到雙倍作物；每週消耗 1 袋，可預先堆多袋。",
  27:"五種技能都到 10 級後，煤矿森林南部、下水道管附近的精通洞穴會開放。"
};

const SECRET_NOTE_IMAGE_V3={11:"SecretNote11",16:"SecretNote16",17:"SecretNote17",18:"SecretNote18",19:"SecretNote19",20:"SecretNote20",21:"SecretNote21"};
const JOURNAL_IMAGE_V3={4:"JournalScrap4",6:"JournalScrap6",10:"JournalScrap10"};


const FISH_RULES_V4 = {
  0:{s:["夏"],w:"晴",t:[[12,16]]},1:{s:["春","秋"],w:"任意",t:[[6,26]]},2:{s:["夏","冬"],w:"任意",t:[[6,19]]},3:{s:["春","秋","冬"],w:"任意",t:[[6,19]]},
  4:{s:["春","夏","秋","冬"],w:"任意",t:[[18,26]]},5:{s:["春","夏","秋","冬"],w:"任意",t:[[6,19]]},6:{s:["春","秋"],w:"任意",t:[[6,26]]},7:{s:["夏"],w:"晴",t:[[6,19]]},
  8:{s:["秋"],w:"任意",t:[[6,19]]},9:{s:["秋","冬"],w:"雨",t:[[12,26]]},10:{s:["冬"],w:"任意",t:[[6,26]]},11:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},
  12:{s:["春","秋"],w:"雨",t:[[6,24]]},13:{s:["夏","冬"],w:"任意",t:[[6,26]]},14:{s:["春","夏"],w:"晴",t:[[6,19]]},15:{s:["夏","冬"],w:"任意",t:[[6,19]]},
  16:{s:["春","冬"],w:"任意",t:[[6,26]]},17:{s:["春","秋"],w:"雨",t:[[16,26]]},18:{s:["夏"],w:"任意",t:[[6,13]]},19:{s:["夏","秋","冬"],w:"雨",t:[[6,19]]},
  20:{s:["冬"],w:"任意",t:[[18,26]]},21:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},22:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},23:{s:["秋","冬"],w:"任意",t:[[6,19]]},
  24:{s:["夏","秋"],w:"任意",t:[[18,26]]},25:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},26:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},27:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},
  28:{s:["夏"],w:"任意",t:[[6,26]],legend:true},29:{s:["秋"],w:"任意",t:[[6,26]],legend:true},30:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},31:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},
  32:{s:["春"],w:"雨",t:[[6,26]],legend:true},33:{s:["春","夏","秋","冬"],w:"任意",t:[[6,20]]},34:{s:["春","夏","秋","冬"],w:"任意",t:[[6,20]]},35:{s:["春","夏"],w:"任意",t:[[6,20]]},
  36:{s:["秋","冬"],w:"任意",t:[[22,26]]},38:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]],legend:true},39:{s:["夏","冬"],w:"任意",t:[[6,19]]},40:{s:["秋","冬"],w:"任意",t:[[6,19]]},
  41:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},42:{s:["夏","秋"],w:"任意",t:[[6,14]]},43:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},44:{s:["夏"],w:"任意",t:[[6,19]]},
  45:{s:["秋","冬"],w:"任意",t:[[6,11],[18,26]]},46:{s:["春","夏","秋"],w:"雨",t:[[9,26]]},47:{s:["冬"],w:"任意",t:[[6,26]]},48:{s:["春","夏","冬"],w:"任意",t:[[6,11],[19,26]]},
  58:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},59:{s:["冬"],w:"任意",t:[[6,26]],legend:true},60:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},61:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},
  62:{s:["冬"],w:"任意",t:[[17,26]]},63:{s:["冬"],w:"任意",t:[[17,26]]},64:{s:["冬"],w:"任意",t:[[17,26]]},65:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},
  66:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},67:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},68:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]],jelly:true},
  69:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]],jelly:true},70:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]],jelly:true},71:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]}
};

const FISH_AREAS_V4 = [
  {id:"town",name:"鹈鹕镇",sub:"河流",icon:"Sunfish",fish:[14,12,22,6,46,4,7,13,8,40,9,47,10,29,68],tip:"釣鮟鱇魚需站在河流最北端。"},
  {id:"forest_river",name:"煤矿森林",sub:"河流",icon:"Chub",fish:[14,12,43,22,46,4,44,7,13,8,40,9,47,10,68]},
  {id:"forest_pond",name:"煤矿森林",sub:"池塘",icon:"Smallmouth Bass",fish:[22,6,13,9,36,10,68]},
  {id:"forest_falls",name:"煤矿森林",sub:"南部瀑布",icon:"Goby",fish:[71,8],tip:"蝦虎魚需把浮標拋進南部瀑布下方水池；有效釣魚等級至少 4。"},
  {id:"glacier",name:"煤矿森林",sub:"南部小島",icon:"Glacierfish",fish:[59],tip:"冰川魚是冬季傳說魚，需在箭頭形小島南端指定水域。"},
  {id:"mountain",name:"山湖",sub:"礦井外湖泊",icon:"Largemouth Bass",fish:[5,41,11,43,22,7,39,9,36,47,10,32,68],tip:"傳說之魚需春季雨天、釣魚等級 10，浮標需落在離岸足夠遠的位置。"},
  {id:"beach",name:"海灘",sub:"海洋",icon:"Sardine",fish:[3,35,1,16,21,48,17,18,42,15,19,2,0,24,23,45,20,28,70],tip:"緋紅魚需夏季、釣魚等級 5，並在修橋後的東側區域拋遠。"},
  {id:"secret",name:"秘密森林",sub:"池塘",icon:"Woodskip",fish:[11,58,12,68],seasonOverride:{12:["春","夏","秋"]}},
  {id:"desert",name:"沙漠",sub:"池塘",icon:"Sandfish",fish:[33,34,22,68]},
  {id:"sewer",name:"下水道",sub:"水域",icon:"Mutant Carp",fish:[11,22,26,38]},
  {id:"bug",name:"突變蟲穴",sub:"水域",icon:"Slimejack",fish:[11,61,22,26]},
  {id:"mine20",name:"礦井",sub:"20 層",icon:"Stonefish",fish:[25,27,22,26,69]},
  {id:"mine60",name:"礦井",sub:"60 層",icon:"Ice Pip",fish:[25,30,22,26,69]},
  {id:"mine100",name:"礦井",sub:"100 層",icon:"Lava Eel",fish:[31,22,26,69]},
  {id:"witch",name:"女巫沼澤",sub:"沼澤",icon:"Void Salmon",fish:[60,12,22,26],seasonOverride:{12:["春","夏","秋"]}},
  {id:"night",name:"冬季夜市",sub:"潛水艇",icon:"Midnight Squid",fish:[62,63,64,18,23,24,21,70],forceSeasons:["冬"],days:[15,16,17],timeOverride:[[17,26]],tip:"夜市冬 15–17 日 17:00–02:00；潛水艇下潛還會消耗約 30 分鐘遊戲時間。"},
  {id:"island_n",name:"姜岛北部",sub:"淡水",icon:"Blue Discus",fish:[67,36,42,68],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"island_w_fresh",name:"姜岛西部",sub:"河流／池塘",icon:"Blue Discus",fish:[67,36,42,68],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"island_w_ocean",name:"姜岛西部",sub:"海洋",icon:"Lionfish",fish:[35,66,18,0,24,2,70],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"island_s",name:"姜岛南部及東南部",sub:"南部／東南部海域",icon:"Lionfish",fish:[35,66,0,24,2,70],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"pirate",name:"海盜灣",sub:"海盜灣水域",icon:"Stingray",fish:[35,0,65,24,2,70],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"caldera",name:"火山口",sub:"熔岩湖",icon:"Lava Eel",fish:[31],forceSeasons:["春","夏","秋","冬"],island:true}
];


const FISH_AREA_GROUPS_V4 = {
  main:{name:"本島",ids:["town","forest_river","forest_pond","forest_falls","glacier","mountain","beach","secret"]},
  special:{name:"特殊水域",ids:["desert","sewer","bug","mine20","mine60","mine100","witch","night"]},
  island:{name:"姜岛",ids:["island_n","island_w_fresh","island_w_ocean","island_s","pirate","caldera"]}
};

const FISH_MAP_META_V42 = {
  main:{
    file:"Map",
    clusters:[
      {id:"town",label:"鹈鹕镇",x:54,y:50,ids:["town"]},
      {id:"forest",label:"煤矿森林",x:30,y:69,ids:["forest_river","forest_pond","forest_falls","glacier"]},
      {id:"mountain",label:"山湖",x:66,y:29,ids:["mountain"]},
      {id:"beach",label:"海灘",x:69,y:82,ids:["beach"]},
      {id:"secret",label:"秘密森林",x:12,y:61,ids:["secret"]}
    ]
  },
  island:{
    file:"Ginger Island Map",
    clusters:[
      {id:"north",label:"北部",x:53,y:22,ids:["island_n","caldera"]},
      {id:"west",label:"西部",x:24,y:55,ids:["island_w_fresh","island_w_ocean"]},
      {id:"south",label:"南部／東南部",x:56,y:80,ids:["island_s","pirate"]}
    ]
  },
  special:{file:null,clusters:[]}
};

const FISH_AREA_THUMB_V46 = {
  forest_river:{x:36,y:70}, forest_pond:{x:27,y:60}, forest_falls:{x:22,y:84}, glacier:{x:34,y:84},
  island_n:{x:53,y:27}, caldera:{x:55,y:8}, island_w_fresh:{x:24,y:55}, island_w_ocean:{x:18,y:72},
  island_s:{x:55,y:84}, pirate:{x:79,y:78}
};


/* v87 世界導航：資料在 world-nav-data-v87.js（window.SDVWorldNavV87），這裡只放路徑工具。 */
const WORLD_NAV_V87 = () => window.SDVWorldNavV87 || {root:"world",nodes:{},areaNode:{}};
function worldPathToV87(target){
  const NAV=WORLD_NAV_V87(), nodes=NAV.nodes, root=NAV.root;
  if(!nodes[target]) return [root];
  const queue=[[root,[root]]], seen=new Set();
  while(queue.length){
    const [id,path]=queue.shift();
    if(id===target) return path;
    if(seen.has(id)) continue;
    seen.add(id);
    for(const p of nodes[id]?.portals||[]){ if(nodes[p.to]&&!seen.has(p.to)) queue.push([p.to,[...path,p.to]]); }
  }
  return [root];
}

const FISH_TIME_SEGMENTS_V42 = [
  {id:"morning",name:"早上",range:[6,9]},
  {id:"forenoon",name:"上午",range:[9,12]},
  {id:"noon",name:"中午",range:[12,14]},
  {id:"afternoon",name:"下午",range:[14,17]},
  {id:"evening",name:"晚上",range:[17,22]},
  {id:"night",name:"深夜",range:[22,26]}
];

const ITEM_USAGE_SPECIAL_V42 = {
  "五彩碎片":{keep:"優先保留，不建議前期直接賣。",uses:["沙漠三柱可取得銀河之劍（第一次）","火山鍛造台可用於武器附魔","博物館可捐贈 1 個"]},
  "恐龍蛋":{keep:"第一顆通常先留著孵化，再處理博物館。",uses:["豪華雞舍孵化器可孵出恐龍","博物館可捐贈 1 個；恐龍之後會繼續產蛋"]},
  "遠古種子":{keep:"第一顆先捐博物館。",uses:["首次捐贈後可拿到可種植的上古種子與製作配方"]},
  "兔子的腳":{keep:"至少留 1 個，有多顆再考慮出售。",uses:["社區中心魔法師收集包會用到","秘密紙條相關特殊事件會用到","也是高泛用送禮物品"]},
  "電池組":{keep:"建議囤一些。",uses:["多種高階設備製作會用到","部分任務與解鎖流程會需要"]},
  "硬木":{keep:"中前期建議囤，不要看到就全賣。",uses:["建築、升級與任務會大量使用","多種製作配方會需要"]},
  "銥礦石":{keep:"建議囤，優先熔成銥錠。",uses:["熔爐製作銥錠","後期工具與設備的核心材料"]},
  "銥錠":{keep:"後期核心材料，通常不建議直接賣。",uses:["銥工具升級","高階設備與建築需求"]},
  "鑽石":{keep:"至少留幾顆；有寶石複製機後更容易補。",uses:["可放寶石複製機持續複製","多數村民接受度高，也有製作用途"]},
  "彩虹貝殼":{keep:"第一次拿到建議至少留 1 個。",uses:["神秘的齊先生任務線會需要 1 個","也可用於裁縫"]},
  "茶葉":{keep:"想做綠茶就留；多餘再賣。",uses:["放入小桶可製成綠茶"]},
  "上古水果":{keep:"優先留作種子／釀酒，不建議直接全賣。",uses:["可用種子生產器擴種","釀成果酒價值高"]}
};

function fishRuleV4(i){ return FISH_RULES_V4[i] || {s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]}; }
function formatFishTimeV4(rule, override){
  const windows=override||rule.t||[[6,26]];
  if(windows.length===1&&windows[0][0]===6&&windows[0][1]===26)return "全天";
  const fmt=n=>n>=24?`${String(n-24).padStart(2,"0")}:00`:`${String(n).padStart(2,"0")}:00`;
  return windows.map(([a,b])=>`${fmt(a)}–${fmt(b)}`).join("／");
}
function parseGameHourV4(value){
  const m=String(value||"").match(/(\d{1,2}):(\d{2})/); if(!m)return null;
  let h=Number(m[1])+Number(m[2])/60; if(h<6)h+=24; return h;
}
function fishAvailableV4(area,i,season,weather,hour,day){
  const rule=fishRuleV4(i);
  const seasons=area.forceSeasons||area.seasonOverride?.[i]||rule.s;
  if(season&&season!=="全部"&&!seasons.includes(season))return false;
  if(area.days&&day&&!area.days.includes(Number(day)))return false;
  if(weather&&weather!=="全部"&&rule.w!=="任意"&&rule.w!==weather)return false;
  if(hour!=null){const windows=area.timeOverride||rule.t||[[6,26]];if(!windows.some(([a,b])=>hour>=a&&hour<b))return false;}
  return true;
}

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
  {id:"raccoon",name:"浣熊日记",file:"Ways Of The Wild",desc:"杂草更容易掉落混合种子。"},
  {id:"sea_jewels",name:"海之宝石",file:"Jewels Of The Sea",desc:"钓鱼宝箱有几率开出鱼籽。"},
  {id:"dwarf_safety",name:"矮人安全手册",file:"Dwarvish Safety Manual",desc:"炸弹对你的伤害减少 25%。"},
  {id:"crabbing",name:"捕蟹秘籍",file:"The Art O' Crabbing",desc:"蟹笼有 25% 几率产出双倍。"},
  {id:"alley",name:"小巷自助餐",file:"The Alleyway Buffet",desc:"垃圾桶里找到物品的几率更高。"},
  {id:"diamond",name:"钻石猎人",file:"The Diamond Hunter",desc:"手动凿石头时有几率掉落钻石。"},
  {id:"mysteries",name:"谜之书",file:"Book of Mysteries",desc:"找到谜之盒的几率稍微提高。"},
  {id:"horse",name:"马术秘籍",file:"Horse The Book",desc:"骑马速度稍微加快。"},
  {id:"treasure",name:"古代珍宝鉴定指南",file:"Treasure Appraisal Guide",desc:"出售古物时价格更高。"},
  {id:"grass",name:"草中窜",file:"Ol' Slitherlegs",desc:"在草丛和庄稼中移动速度大幅增加。"},
  {id:"animal_catalogue",name:"动物目录",file:"Animal Catalogue",desc:"玛妮不在柜台时也能使用商店。"}
];

const POND_PRODUCTS_V55 = {
  "Lionfish":[[1,"Roe","鱼籽"],[4,"Taro Tuber","芋头"],[9,"Tiger Slime Egg","虎纹史莱姆蛋"]],
  "Blue Discus":[[1,"Roe","鱼籽"],[4,"Banana","香蕉"],[9,"Golden Coconut","金色椰子"]],
  "Stingray":[[1,"Roe","鱼籽"],[4,"Magma Cap","岩浆菇"],[7,"Cinder Shard","火山晶石"],[9,"Dragon Tooth","龙牙"],[9,"Battery Pack","电池组"]],
  "Squid":[[1,"Squid Ink","鱿鱼墨汁"]],
  "Midnight Squid":[[1,"Squid Ink","鱿鱼墨汁"]],
  "Carp":[[1,"Roe","鱼籽"]],"Catfish":[[1,"Roe","鱼籽"]],"Herring":[[1,"Roe","鱼籽"]],
  "Midnight Carp":[[1,"Roe","鱼籽"],[7,"River Jelly","河凝胶"]],
  "Flounder":[[1,"Roe","鱼籽"],[7,"Sea Jelly","海凝胶"]],
  "Sunfish":[[1,"Roe","鱼籽"],[10,"Solar Essence","太阳精华"]],
  "Blobfish":[[1,"Roe","鱼籽"],[9,"Pearl","珍珠"],[9,"Warp Totem Farm","农场传送图腾"]],
  "Lava Eel":[[1,"Roe","鱼籽"],[3,"Gold Ore","金矿石"],[8,"Cave Jelly","洞穴凝胶"],[9,"Spicy Eel","香辣鳗鱼"],[9,"Magma Geode","岩浆晶球"]],
  "Woodskip":[[1,"Roe","鱼籽"],[1,"Wood","木材"],[6,"Hardwood","硬木"],[9,"Acorn","橡子"],[9,"Maple Seed","枫树种子"],[9,"Pine Cone","松果"]],
  "Tiger Trout":[[1,"Roe","鱼籽"]],
  "Sandfish":[[1,"Roe","鱼籽"],[10,"Cactus Seeds","仙人掌种子"]],
  "Scorpion Carp":[[1,"Roe","鱼籽"],[10,"Cactus Seeds","仙人掌种子"]],
  "Void Salmon":[[1,"Roe","鱼籽"],[8,"Void Essence","虚空精华"],[9,"Void Egg","虚空蛋"]],
  "Slimejack":[[1,"Roe","鱼籽"],[3,"Green Algae","绿藻"],[9,"Slime","史莱姆泥"],[9,"Green Slime Egg","绿色史莱姆蛋"]],
  "Stonefish":[[1,"Roe","鱼籽"],[3,"Copper Ore","铜矿石"],[9,"Geode","晶球"],[9,"Stone","石头"],[9,"Diamond","钻石"]],
  "Ice Pip":[[1,"Roe","鱼籽"],[3,"Iron Ore","铁矿石"],[9,"Frozen Geode","冰冻晶球"],[9,"Frozen Tear","泪晶"],[9,"Diamond","钻石"]],
  "Ghostfish":[[1,"Roe","鱼籽"],[3,"Quartz","石英"],[9,"White Algae","白藻"],[9,"Refined Quartz","精炼石英"],[9,"Pale Broth","清汤"]],
  "Sturgeon":[[1,"Sturgeon Roe","鲟鱼籽"]],
  "Super Cucumber":[[1,"Roe","鱼籽"],[9,"Iridium Ore","铱矿石"],[9,"Amethyst","紫水晶"]],
  "Octopus":[[1,"Roe","鱼籽"],[9,"Omni Geode","万象晶球"]],
  "Rainbow Trout":[[1,"Roe","鱼籽"],[9,"Rainbow Shell","彩虹贝壳"],[9,"Prismatic Shard","五彩碎片"]],
  "Spook Fish":[[1,"Roe","鱼籽"],[9,"Treasure Chest","财宝箱"]],
  "Dorado":[[1,"Roe","鱼籽"],[9,"Bug Meat","虫肉"]],"Lingcod":[[1,"Roe","鱼籽"],[9,"Bug Meat","虫肉"]],"Pike":[[1,"Roe","鱼籽"],[9,"Bug Meat","虫肉"]],
  "Coral":[[9,"Dolomite","白云石"],[9,"Limestone","石灰石"]],
  "Sea Urchin":[[1,"Roe","鱼籽"]],
  "Crayfish":[[1,"Roe","鱼籽"],[1,"Trash","垃圾"],[1,"Green Algae","绿藻"],[1,"Driftwood","浮木"],[1,"Broken Glasses","破损的眼镜"],[1,"Broken CD","破损的CD"],[1,"Soggy Newspaper","湿透的报纸"],[5,"Mixed Seeds","混合种子"],[9,"Warp Totem Mountains","山岭传送图腾"]],
  "Periwinkle":[[1,"Roe","鱼籽"],[1,"Trash","垃圾"],[1,"Green Algae","绿藻"],[1,"Driftwood","浮木"],[1,"Broken Glasses","破损的眼镜"],[1,"Broken CD","破损的CD"],[1,"Soggy Newspaper","湿透的报纸"],[5,"Mixed Seeds","混合种子"],[9,"Warp Totem Mountains","山岭传送图腾"]],
  "Snail":[[1,"Roe","鱼籽"],[1,"Trash","垃圾"],[1,"Green Algae","绿藻"],[1,"Driftwood","浮木"],[1,"Broken Glasses","破损的眼镜"],[1,"Broken CD","破损的CD"],[1,"Soggy Newspaper","湿透的报纸"],[5,"Mixed Seeds","混合种子"],[9,"Warp Totem Mountains","山岭传送图腾"]],
  "Clam":[[1,"Roe","鱼籽"],[1,"Seaweed","海草"],[1,"Trash","垃圾"],[5,"Coral","珊瑚"],[5,"Sea Urchin","海胆"],[9,"Warp Totem Beach","海滩传送图腾"],[9,"Nautilus Shell","鹦鹉螺"]],
  "Cockle":[[1,"Roe","鱼籽"],[1,"Seaweed","海草"],[1,"Trash","垃圾"],[5,"Coral","珊瑚"],[5,"Sea Urchin","海胆"],[9,"Warp Totem Beach","海滩传送图腾"],[9,"Nautilus Shell","鹦鹉螺"]],
  "Crab":[[1,"Roe","鱼籽"],[1,"Seaweed","海草"],[1,"Trash","垃圾"],[5,"Coral","珊瑚"],[5,"Sea Urchin","海胆"],[9,"Warp Totem Beach","海滩传送图腾"],[9,"Nautilus Shell","鹦鹉螺"]],
  "Lobster":[[1,"Roe","鱼籽"],[1,"Seaweed","海草"],[1,"Trash","垃圾"],[5,"Coral","珊瑚"],[5,"Sea Urchin","海胆"],[9,"Warp Totem Beach","海滩传送图腾"],[9,"Nautilus Shell","鹦鹉螺"]],
  "Mussel":[[1,"Roe","鱼籽"],[1,"Seaweed","海草"],[1,"Trash","垃圾"],[5,"Coral","珊瑚"],[5,"Sea Urchin","海胆"],[9,"Warp Totem Beach","海滩传送图腾"],[9,"Nautilus Shell","鹦鹉螺"]],
  "Oyster":[[1,"Roe","鱼籽"],[1,"Seaweed","海草"],[1,"Trash","垃圾"],[5,"Coral","珊瑚"],[5,"Sea Urchin","海胆"],[9,"Warp Totem Beach","海滩传送图腾"],[9,"Nautilus Shell","鹦鹉螺"]],
  "Shrimp":[[1,"Roe","鱼籽"],[1,"Seaweed","海草"],[1,"Trash","垃圾"],[5,"Coral","珊瑚"],[5,"Sea Urchin","海胆"],[9,"Warp Totem Beach","海滩传送图腾"],[9,"Nautilus Shell","鹦鹉螺"]]
};
const POND_NON_PONDABLE_V55 = new Set(["Seaweed","Green Algae","White Algae","Sea Jelly","River Jelly","Cave Jelly"]);
const POND_RARE_V55 = ["Lava Eel","Blobfish","Sturgeon","Super Cucumber","Rainbow Trout","Spook Fish","Ice Pip","Stonefish","Ghostfish","Slimejack","Void Salmon","Stingray"];
const POND_LEGENDARY_V55 = new Set(["Legend","Crimsonfish","Angler","Glacierfish","Mutant Carp","Legend II","Son of Crimsonfish","Ms. Angler","Glacierfish Jr.","Radioactive Carp"]);

const MACHINE_EXTRA_V55 = {
  "Sewing Machine":{sourceZh:"艾米麗特殊訂單「寶石恢復活力」完成後郵寄；用於裁縫與染色。"},
  "Telephone":{sourceZh:"木匠商店購買；可遠端查詢商店營業與部分庫存。"},
  "Mini-Fridge":{sourceZh:"農舍升級後木匠商店購買；也可由格斯特殊訂單取得。"},
  "Mini-Jukebox":{ingredients:[{name:"Iron Bar",quantity:2},{name:"Battery Pack",quantity:1}],sourceZh:"格斯 5 心事件後取得配方。"},
  "Statue Of Blessings":{ingredients:[{name:"Sap",quantity:999},{name:"Fiber",quantity:999},{name:"Stone",quantity:999},{name:"Moss",quantity:333}],sourceZh:"耕種精通後解鎖配方。"},
  "Statue Of The Dwarf King":{ingredients:[{name:"Iridium Bar",quantity:20}],sourceZh:"採礦精通後解鎖配方。"},
  "Deconstructor":{sourceZh:"齊先生核桃房以齊鑽購買。"},
  "Anvil":{ingredients:[{name:"Iron Bar",quantity:50}],sourceZh:"戰鬥精通後解鎖配方。"},
  "Mini-Forge":{ingredients:[{name:"Dragon Tooth",quantity:5},{name:"Iron Bar",quantity:10},{name:"Gold Bar",quantity:10},{name:"Iridium Bar",quantity:5}],sourceZh:"戰鬥精通後解鎖配方；功能類似火山鍛造台。"},
  "Crab Pot":{ingredients:[{name:"Wood",quantity:40},{name:"Iron Bar",quantity:3}],sourceZh:"釣魚 3 級基礎配方；誘捕者職業會改變材料需求。"}
};

const SOCIAL_SPECIAL_ITEM_V55 = {
  "Frog Egg":{name:"青蛙蛋",file:"Frog Egg Colors",source:"飾品；戰鬥精通後由怪物／箱子等來源取得"},
  "Parrot Egg":{name:"鹦鹉蛋",file:"Parrot Egg",source:"飾品；戰鬥精通後取得"},
  "Fairy Box":{name:"仙女盒",file:"Fairy Box",source:"飾品；戰鬥精通後取得"},
  "Basilisk Paw":{name:"蜥怪的爪子",file:"Basilisk Paw",source:"飾品；戰鬥精通後取得"},
  "Jack Be Nimble Jack Be Thick":{name:"铜墙铁壁",file:"Jack Be Nimble, Jack Be Thick",source:"能力書籍"},
  "Large Goat Milk":{name:"大瓶羊奶",file:"Large Goat Milk",source:"高好感山羊產出"},
  "Strange Doll (green)":{name:"诡异玩偶（绿）",file:"Strange Doll (green)",source:"古物"},
  "Strange Doll (yellow)":{name:"诡异玩偶（黄）",file:"Strange Doll (yellow)",source:"古物"}
};
const SOCIAL_GENERIC_V55 = {
  "All Artisan Goods (except Coffee, Green Tea & Oil)":{name:"所有工匠物品（咖啡、綠茶、油除外）",file:"Keg"},
  "All Artisan Goods (except Honey, Jelly & Oil)":{name:"所有工匠物品（蜂蜜、果醬、油除外）",file:"Preserves Jar"},
  "All Eggs (except Void Egg)":{name:"所有蛋類（虛空蛋除外）",file:"Egg"},
  "All Fish":{name:"所有魚類",file:"Tuna"},
  "All Fish (except Clam, Cockle, Mussel & Oyster)":{name:"所有魚類（蛤、鳥蛤、蚌、牡蠣除外）",file:"Tuna"},
  "All Milk":{name:"所有奶類",file:"Milk"},
  "All Universal Likes":{name:"所有通用喜歡",file:"Daffodil"},
  "All Universal Likes (except Garlic)":{name:"所有通用喜歡（大蒜除外）",file:"Daffodil"},
  "All Fruit (except Spice Berry)":{name:"所有水果（香味漿果除外）",file:"Apple"},
  "All Universal Hates":{name:"所有通用討厭",file:"Holly"},
  "All Universal Hates (except Carp & Wild Bait)":{name:"所有通用討厭（鯉魚、萬能魚餌除外）",file:"Holly"},
  "All Universal Hates (except Seafoam Pudding)":{name:"所有通用討厭（海泡布丁除外）",file:"Holly"},
  "All Universal Hates (except Slime)":{name:"所有通用討厭（史萊姆泥除外）",file:"Holly"},
  "All Universal Hates (except Monster Musk, Seafoam Pudding, Strange Bun & Void Mayonnaise)":{name:"所有通用討厭（怪物香水、海泡布丁、奇怪的小麵包、虛空蛋黃醬除外）",file:"Holly"}
};
const SOCIAL_EMPTY_RULES_V55 = {
  "谢恩":{likes:["All Universal Likes"]},"謝恩":{likes:["All Universal Likes"]},
  "乔迪":{likes:["All Universal Likes (except Garlic)","All Eggs (except Void Egg)","All Fruit (except Spice Berry)","All Milk"]},"喬迪":{likes:["All Universal Likes (except Garlic)","All Eggs (except Void Egg)","All Fruit (except Spice Berry)","All Milk"]},
  "莱纳斯":{likes:["All Universal Likes"],hates:["All Universal Hates (except Carp & Wild Bait)"]},"萊納斯":{likes:["All Universal Likes"],hates:["All Universal Hates (except Carp & Wild Bait)"]},
  "威利":{hates:["All Universal Hates (except Seafoam Pudding)"]},
  "法师":{hates:["All Universal Hates (except Slime)"]},"法師":{hates:["All Universal Hates (except Slime)"]},
  "科罗布斯":{hates:["All Universal Hates (except Monster Musk, Seafoam Pudding, Strange Bun & Void Mayonnaise)"]},"科罗布斯":{hates:["All Universal Hates (except Monster Musk, Seafoam Pudding, Strange Bun & Void Mayonnaise)"]},
  "矮人":{hates:["All Universal Hates"]}
};
const NPC_SERVICES_V55 = {
  "罗宾":[["Silo","建造／管理農場建築","建造、升級、移動或拆除多數農場建築，並負責農舍升級與部分城鎮設施改善。"]],
  "羅賓":[["Silo","建造／管理農場建築","建造、升級、移動或拆除多數農場建築，並負責農舍升級與部分城鎮設施改善。"]],
  "玛妮":[["Cow","購買農場動物","為雞舍或牲口棚購買動物；也銷售乾草、暖氣機、擠奶桶等動物照護用品。"]],
  "瑪妮":[["Cow","購買農場動物","為雞舍或牲口棚購買動物；也銷售乾草、暖氣機、擠奶桶等動物照護用品。"]],
  "克林特":[["Pickaxe","工具升級","支付金錢與金屬錠升級主要手持工具。"],["Geode","處理晶球","在鐵匠鋪敲開晶球；每個基礎處理費 25g。"]],
  "刘易斯":[["Prize Ticket","獎券兌換機","鎮長家內可用獎品券在獎品機領取連續獎勵。"]],
  "劉易斯":[["Prize Ticket","獎券兌換機","鎮長家內可用獎品券在獎品機領取連續獎勵。"]],
  "威利":[["Boat","姜岛船運","修復魚店後室的舊船後可搭船前往姜岛；單程船票 1,000g。"]],
  "皮埃尔":[["36 Backpack","背包升級","雜貨店可購買兩次背包擴充，每次增加 12 格。"]],
  "皮埃爾":[["36 Backpack","背包升級","雜貨店可購買兩次背包擴充，每次增加 12 格。"]],
  "法师":[["Magic Ink","幻象神龕","達到條件後可付費修改角色外觀。"],["Junimo Hut","魔法建築","歸還魔法墨水後可購買祝尼魔小屋、方尖碑與黃金時鐘等魔法建築。"]],
  "法師":[["Magic Ink","幻象神龕","達到條件後可付費修改角色外觀。"],["Junimo Hut","魔法建築","歸還魔法墨水後可購買祝尼魔小屋、方尖碑與黃金時鐘等魔法建築。"]]
};

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

const CALENDAR_DATA = {
  春: {
    birthdays: {4:"肯特",7:"劉易斯",10:"文森特",14:"海莉",18:"潘姆",20:"謝恩",26:"皮埃爾",27:"艾蜜麗"},
    festivals: {13:"彩蛋節",15:"沙漠節",16:"沙漠節",17:"沙漠節",24:"花舞節"},
    other: {15:"鮭莓季",16:"鮭莓季",17:"鮭莓季＋煤渣森林金罐",18:"鮭莓季"}
  },
  夏: {
    birthdays: {4:"賈斯",8:"格斯",10:"瑪魯",13:"亞歷克斯",17:"山姆",19:"德米特里厄斯",22:"矮人",24:"威利",26:"雷歐"},
    festivals: {11:"夏威夷宴會",20:"鱒魚大賽",21:"鱒魚大賽",28:"月光水母起舞"},
    other: {12:"海灘採集增加",13:"海灘採集增加",14:"海灘採集增加"}
  },
  秋: {
    birthdays: {2:"潘妮",5:"艾利歐特",11:"喬迪",13:"阿比蓋爾",15:"桑迪",18:"瑪妮",21:"羅賓",24:"喬治"},
    festivals: {16:"星露谷展覽會",27:"萬靈節"},
    other: {8:"黑莓季",9:"黑莓季",10:"黑莓季",11:"黑莓季"}
  },
  冬: {
    birthdays: {1:"科罗布斯",3:"萊納斯",7:"卡洛琳",10:"塞巴斯蒂安",14:"哈維",17:"法師",20:"艾芙琳",23:"莉亞",26:"克林特"},
    festivals: {8:"冰雪節",12:"魷魚節",13:"魷魚節",15:"夜市",16:"夜市",17:"夜市",25:"冬日星盛宴"},
    other: {}
  }
};

const SEASON_COLORS = { 春:"#80A85B", 夏:"#E38B39", 秋:"#B9663B", 冬:"#5C91B8" };
function parseFishMeta(info = "") {
  const seasons = info.includes("全季") || !/[春夏秋冬]/.test(info) ? [...SEASONS] : SEASONS.filter(x => info.includes(x));
  const weather = info.includes("雨") ? "雨" : info.includes("晴") ? "晴" : "任意";
  const areas = [];
  if (info.includes("海") || info.includes("海灘") || info.includes("海洋")) areas.push("海洋");
  if (info.includes("河")) areas.push("河流");
  if (info.includes("湖")) areas.push("湖泊");
  if (info.includes("礦井") || info.includes("火山")) areas.push("礦井");
  if (info.includes("沙漠")) areas.push("沙漠");
  if (info.includes("下水道") || info.includes("蟲穴") || info.includes("沼澤") || info.includes("秘密森林")) areas.push("特殊");
  if (info.includes("姜岛") || info.includes("海盜灣")) areas.push("姜岛");
  if (info.includes("夜市")) areas.push("夜市");
  if (!areas.length) areas.push("其他");
  let time = "全天/不限";
  const m = info.match(/(\d{1,2})-(\d{1,2})點/);
  if (m) time = `${m[1]}–${m[2]}點`;
  else if (info.includes("傍晚")) time = "傍晚後";
  else if (info.includes("早晚")) time = "早／晚";
  else if (info.includes("早上")) time = "早上";
  else if (info.includes("晚間")) time = "晚間";
  else if (info.includes("夜")) time = "夜間";
  return { seasons, weather, areas:[...new Set(areas)], time };
}
function FishTags({ meta, compact = false }) {
  const chip = (text, bg, color="#3B2C20") => <span key={text} style={{fontSize:compact?8.5:10,fontWeight:900,padding:compact?"1px 4px":"2px 6px",borderRadius:8,background:bg,color,whiteSpace:"nowrap"}}>{text}</span>;
  const seasonTags = meta.seasons.length === 4 ? ["全季"] : meta.seasons;
  return <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:compact?"center":"flex-start",marginTop:compact?3:5}}>
    {seasonTags.map(s=>chip(s, s==="全季"?"#E8E0CF":SEASON_COLORS[s]+"30", s==="全季"?"#6B3E1E":SEASON_COLORS[s]))}
    {meta.areas.slice(0,compact?1:3).map(a=>chip(a,a==="海洋"?"#DDECF7":a==="河流"?"#DDF2ED":a==="湖泊"?"#E5E4FA":a==="姜岛"?"#F5E7BE":"#EEE6D7"))}
    {chip(meta.weather, meta.weather==="雨"?"#D8E8FA":meta.weather==="晴"?"#FFF0B8":"#EEE6D7")}
    {!compact && chip(meta.time,"#F2E5CE")}
  </div>;
}

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
  "姜岛海盜灣", "姜岛海洋", "姜岛河流", "河釣獲(1.6)", "礦井水域釣獲(1.6)",
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
      "魷魚", "海草", "綠藻", "海參", "大海參", "鬼魚", "白藻", "石魚", "緋紅魚", "安康魚",
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

const BUNDLE_REWARDS_V28 = {
  spring_forage:["Spring Seeds","春季種子",30], summer_forage:["Summer Seeds","夏季種子",30], fall_forage:["Fall Seeds","秋季種子",30], winter_forage:["Winter Seeds","冬季種子",30], construction:["Charcoal Kiln","煤炭窯",1], exotic:["Autumn's Bounty","秋日恩賜",5],
  spring_crops:["Speed-Gro","生長激素",20], summer_crops:["Quality Sprinkler","高級灑水器",1], fall_crops:["Bee House","蜂房",1], quality_crops:["Preserves Jar","罐頭瓶",1], animal:["Cheese Press","起司壓製機",1], artisan:["Keg","小桶",1],
  river:["Deluxe Bait","高級魚餌",30], lake:["Dressed Spinner","精裝旋式魚餌",1], ocean:["Warp Totem Beach","海灘傳送圖騰",5], night:["Glow Ring","光輝戒指",1], crabpot:["Crab Pot","蟹籠",3], specialty:["Dish O' The Sea","海之菜餚",5],
  blacksmith:["Furnace","熔爐",1], geologist:["Omni Geode","萬象晶洞",5], adventurer:["Small Magnet Ring","小型磁鐵戒指",1],
  chef:["Pink Cake","粉紅蛋糕",3], dye:["Seed Maker","種子生產器",1], field:["Recycling Machine","回收機",1], fodder:["Heater","加熱器",1], enchanter:["Gold Bar","金錠",5],
  v2500:["Chocolate Cake","巧克力蛋糕",3], v5000:["Quality Fertilizer","高級肥料",30], v10000:["Lightning Rod","避雷針",1], v25000:["Crystalarium","寶石複製機",1]
};

const ROOM_UNLOCKS_V28 = {
  crafts:{name:"採石場橋",desc:"修復通往採石場的橋。",file:"Stone"},
  pantry:{name:"溫室",desc:"修復農場溫室，可全年種植。",file:"Greenhouse"},
  fishtank:{name:"淘金",desc:"移除閃閃發光的巨石，解鎖淘金。",file:"Copper Pan"},
  boiler:{name:"礦車",desc:"修復礦車快速交通。",file:"Minecart"},
  bulletin:{name:"居民友情",desc:"已認識、不可交往的居民獲得 2 心友情。",file:"Friendship 101"},
  vault:{name:"沙漠巴士",desc:"修復巴士，開放卡利科沙漠。",file:"Bus Ticket"}
};

const REMIX_EXTRA_ITEMS_V28 = {
  crafts:["大蔥","冬青樹","樹液 ×500","苔蘚 ×10","纖維 ×200","橡實 ×10","楓樹種子 ×10","紫蘑菇 ×5","蕨菜 ×5","白藻 ×5","啤酒花 ×5"],
  pantry:["羽衣甘藍","胡蘿蔔","上古水果","寶石甜莓","魚籽 ×15","陳年魚籽 ×15","魷魚墨汁","蜂蜜酒","淡啤酒","果酒","果汁","綠茶"],
  fishtank:["章魚","蠍鯉魚","熔岩鰻魚","水滴魚","冰柱魚","鬼魚","幽靈魚"],
  boiler:["電池組","銥礦石 ×5","精煉石英 ×10","煤炭 ×10","火水晶"],
  bulletin:["古代玩偶","冰淇淋","餅乾","葡萄","楓糖漿","苔蘚","硬木","南瓜","蔓越莓"],
  vault:[]
};

const JOJA_PROJECTS_V28 = [
  {id:"minecart",name:"礦車",cost:15000,room:"boiler",file:"Minecart",desc:"修復礦車快速交通。"},
  {id:"panning",name:"淘金",cost:20000,room:"fishtank",file:"Copper Pan",desc:"移除閃閃發光的巨石，開放淘金。"},
  {id:"bridge",name:"採石場橋",cost:25000,room:"crafts",file:"Stone",desc:"修復通往採石場的橋。"},
  {id:"greenhouse",name:"溫室",cost:35000,room:"pantry",file:"Greenhouse",desc:"修復農場溫室。"},
  {id:"bus",name:"沙漠巴士",cost:40000,room:"vault",file:"Bus Ticket",desc:"修復巴士，開放卡利科沙漠。"}
];

const MINE_BANDS_V28 = [
  {g:"1",range:"1–9",note:"土色礦層",items:[["Copper Ore","銅礦石"],["Quartz","石英"],["Earth Crystal","地晶"],["Amethyst","紫水晶"],["Topaz","黃玉"]]},
  {g:"1",range:"10",note:"寶箱層",items:[["Leather Boots","皮靴"]]},
  {g:"1",range:"11–19",note:"銅礦＋洞穴昆蟲",items:[["Copper Ore","銅礦石"],["Geode","晶球"],["Bug Meat","蟲肉"],["Earth Crystal","地晶"]]},
  {g:"1",range:"20",note:"寶箱＋釣魚",items:[["Steel Smallsword","鋼製輕劍"],["Stonefish","石魚"],["Ghostfish","鬼魚"]]},
  {g:"1",range:"21–29",note:"銅礦／晶球／昆蟲",items:[["Copper Ore","銅礦石"],["Geode","晶球"],["Bug Meat","蟲肉"]]},
  {g:"1",range:"30",note:"過渡層",items:[["Copper Ore","銅礦石"]]},
  {g:"1",range:"31–39",note:"暗色礦層；銅礦較多",items:[["Copper Ore","銅礦石"],["Geode","晶球"]]},
  {g:"1",range:"40",note:"寶箱層",items:[["Slingshot","彈弓"]]},
  {g:"2",range:"41–49",note:"冰雪礦層；鐵礦開始大量出現",items:[["Iron Ore","鐵礦石"],["Frozen Geode","冰凍晶球"],["Frozen Tear","淚晶"],["Aquamarine","海藍寶石"],["Jade","翡翠"]]},
  {g:"2",range:"50",note:"寶箱層；鑽石開始出現",items:[["Tundra Boots","凍原靴"],["Diamond","鑽石"]]},
  {g:"2",range:"51–59",note:"灰塵精靈很多，適合刷煤",items:[["Iron Ore","鐵礦石"],["Coal","煤炭"],["Frozen Geode","冰凍晶球"]]},
  {g:"2",range:"60",note:"寶箱＋釣魚",items:[["Crystal Dagger","水晶匕首"],["Ice Pip","冰柱魚"],["Ghostfish","鬼魚"]]},
  {g:"2",range:"61–69",note:"冰雪礦層",items:[["Iron Ore","鐵礦石"],["Frozen Geode","冰凍晶球"],["Frozen Tear","淚晶"]]},
  {g:"2",range:"70",note:"寶箱層",items:[["Master Slingshot","高級彈弓"]]},
  {g:"2",range:"71–79",note:"城堡主題冰層",items:[["Iron Ore","鐵礦石"],["Frozen Geode","冰凍晶球"]]},
  {g:"2",range:"80",note:"寶箱層",items:[["Firewalker Boots","火行者靴"]]},
  {g:"3",range:"81–89",note:"熔岩礦層；金礦開始大量出現",items:[["Gold Ore","金礦石"],["Magma Geode","岩漿晶球"],["Fire Quartz","火水晶"],["Ruby","紅寶石"],["Emerald","綠寶石"]]},
  {g:"3",range:"90",note:"寶箱層",items:[["Obsidian Edge","黑曜石之刃"]]},
  {g:"3",range:"91–99",note:"熔岩礦層",items:[["Gold Ore","金礦石"],["Magma Geode","岩漿晶球"],["Fire Quartz","火水晶"]]},
  {g:"3",range:"100",note:"星之果實＋釣魚",items:[["Stardrop","星之果實"],["Lava Eel","熔岩鰻魚"]]},
  {g:"3",range:"101–109",note:"金礦較多",items:[["Gold Ore","金礦石"],["Magma Geode","岩漿晶球"]]},
  {g:"3",range:"110",note:"寶箱層",items:[["Space Boots","太空靴"]]},
  {g:"3",range:"111–119",note:"高階熔岩／暗紅礦層",items:[["Gold Ore","金礦石"],["Magma Geode","岩漿晶球"],["Diamond","鑽石"]]},
  {g:"3",range:"120",note:"礦井底層",items:[["Skull Key","頭骨鑰匙"]]}
];

const PROF_ICON_FILES_V26 = {
  "牧場主":"Rancher","農耕者":"Tiller","雞舍大師":"Coopmaster","牧羊人":"Shepherd","工匠":"Artisan","農業學家":"Agriculturist",
  "礦工":"Miner","地質學家":"Geologist","鐵匠":"Blacksmith Icon","探礦者":"Prospector","挖掘者":"Excavator","寶石學家":"Gemologist",
  "樵夫":"Forester","採集者":"Gatherer","伐木工":"Lumberjack","樹汁採集者":"Tapper Icon","植物學家":"Botanist","追蹤者":"Tracker",
  "漁夫":"Fisher","誘捕者":"Trapper","釣魚人":"Angler Icon","海盜":"Pirate","水手":"Mariner","誘餌大師":"Luremaster",
  "鬥士":"Fighter","偵察兵":"Scout","蠻力者":"Brute","防衛者":"Defender","雜技演員":"Acrobat","亡命之徒":"Desperado"
};

const PROF_DESC_V27 = {
  "牧場主":"動物產品售價 +20%","農耕者":"作物售價 +10%","雞舍大師":"雞舍動物更快加好感；孵化時間減半","牧羊人":"牲口棚動物更快加好感；綿羊更快產毛","工匠":"工匠物品售價 +40%","農業學家":"所有作物生長速度 +10%",
  "礦工":"每個礦脈多 1 個礦石","地質學家":"寶石有 50% 機率成對出現","鐵匠":"金屬錠售價 +50%","探礦者":"找到煤炭機率加倍","挖掘者":"找到晶球機率加倍","寶石學家":"寶石售價 +30%",
  "樵夫":"樹木／樹樁／原木掉木材 +25%","採集者":"20% 機率採集到雙份物品","伐木工":"所有樹木都有機率掉硬木","樹汁採集者":"糖漿售價 +25%","植物學家":"採集物固定最高品質","追蹤者":"顯示可採集物位置",
  "漁夫":"魚類售價 +25%","誘捕者":"製作蟹籠所需材料減少","釣魚人":"魚類售價 +50%","海盜":"找到釣魚寶箱機率加倍","水手":"蟹籠不再產垃圾","誘餌大師":"蟹籠不再需要魚餌",
  "鬥士":"攻擊傷害 +10%；生命 +15","偵察兵":"暴擊率提高 50%","蠻力者":"傷害再 +15%","防衛者":"生命 +25","雜技演員":"武器特殊招式冷卻減半","亡命之徒":"暴擊傷害 ×2"
};
const SKILL_BASE_DESC_V27 = {
  farming:"每級：鋤頭／水壺熟練度 +1",
  mining:"每級：十字鎬熟練度 +1",
  foraging:"每級：斧頭熟練度 +1",
  fishing:"每級：魚竿熟練度 +1；釣魚條更大、咬鉤更快",
  combat:"多數等級會增加生命值"
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
  "完美早餐":"Complete Breakfast","鲑鱼晚餐":"Salmon Dinner","蟹黄糕":"Crab Cakes","鱿鱼墨汁":"Squid Ink","鱿鱼":"Squid","苋菜":"Amaranth","咖啡":"Coffee","腌菜":"Pickles","枫糖棒":"Maple Bar","披萨":"Pizza","南瓜汤":"Pumpkin Soup","生鱼片":"Sashimi","虚空蛋":"Void Egg",
  "鱼肉卷":"Fish Taco","绿茶":"Green Tea","夏季亮片":"Summer Spangle","热带咖喱":"Tropical Curry","意式蕨菜炖饭":"Fiddlehead Risotto","豆类火锅":"Bean Hotpot","冰淇淋":"Ice Cream","大米布丁":"Rice Pudding","甜菜":"Beet","玫瑰仙子":"Fairy Rose","塞料面包":"Stuffing","郁金香":"Tulip","蒜":"Garlic","炒蘑菇":"Fried Mushroom","法式田螺":"Escargot","葡萄干布丁":"Plum Pudding","香酥鲈鱼":"Crispy Bass","帕尔玛奶酪茄子":"Eggplant Parmesan","炒鳗鱼":"Fried Eel","薄煎饼":"Pancakes","大黄派":"Rhubarb Pie","烤榛子":"Roasted Hazelnuts","秋日恩赐":"Autumn's Bounty","琉璃山药":"Glazed Yams","蓝莓千层酥":"Blueberry Tart","海之菜肴":"Dish O' The Sea","农夫午餐":"Farmer's Lunch","南瓜派":"Pumpkin Pie","牛奶":"Milk","蜜蜂酒":"Mead","淡啤酒":"Pale Ale","啤酒":"Beer","防风草汤":"Parsnip Soup","炸鱿鱼":"Fried Calamari","意大利面":"Spaghetti","蔓越莓糖果":"Cranberry Candy","姜汁汽水":"Ginger Ale","鲶鱼":"Catfish","海参":"Sea Cucumber","芒果":"Mango","鸵鸟蛋":"Ostrich Egg","夏威夷芋泥":"Poi",
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

const SWITCH_T2S_V47 = Object.fromEntries(Array.from("萬與專業東絲丟兩嚴喪個豐臨為麗舉麼義烏樂喬習鄉書買亂爭於亞產畝親複見觀規覺覽觸訂訥訓議訊記講許論證評識詐詞詔詛話誠誼誤說請諸諾謀謎謝謠謹譜貝負財貢貧貨販貪貫責貯貴貸貿費賀賄賊賓賜賞賠賢賣賦質賬購贈贊趕趨躍車軌軒轉輪輕載較輔輛輝輩轎輸轟辦邊遙鄧鄭鄰醫釋釣鈴鈣鈾鉤銀銅銘銷鋪鋒鋤鋼錄錘錠錢錦錯鍋鍵鍛鍬鎖鎮鏡鐵鑄鑑鑰長門閉開閒間閣闊隊陽陰陣階際陸險雜雙雞離難雲電靈靜頂頃項順須頑頓領頭顏類風飛飯飲飼餅館馬駕驢騎騙騷鬥鬆鬍魚魷鮭鯉鯊鯰鰻鱒鱘鳥鳳鴨鵝鷹麥黃點齊齒龍龜體髮鬚鬱鹽麵湯餃燴燻蘿蔔蘋薑蘚蕪纖維礦寶鑽遠種樹葉爐煉繩飾鏈環殘頁圖場鎮島灣澤層區傳獎勵殺敵數據應該夠賣買獲採網燈漿殼塊" ).map((ch,i)=>[ch,Array.from("万与专业东丝丢两严丧个丰临为丽举么义乌乐乔习乡书买乱争于亚产亩亲复见观规觉览触订讷训议讯记讲许论证评识诈词诏诅话诚谊误说请诸诺谋谜谢谣谨谱贝负财贡贫货贩贪贯责贮贵贷贸费贺贿贼宾赐赏赔贤卖赋质账购赠赞赶趋跃车轨轩转轮轻载较辅辆辉辈轿输轰办边遥邓郑邻医释钓铃钙铀钩银铜铭销铺锋锄钢录锤锭钱锦错锅键锻锹锁镇镜铁铸鉴钥长门闭开闲间阁阔队阳阴阵阶际陆险杂双鸡离难云电灵静顶顷项顺须顽顿领头颜类风飞饭饮饲饼馆马驾驴骑骗骚斗松胡鱼鱿鲑鲤鲨鲶鳗鳟鲟鸟凤鸭鹅鹰麦黄点齐齿龙龟体发须郁盐面汤饺烩熏萝卜苹姜藓芜纤维矿宝钻远种树叶炉炼绳饰链环残页图场镇岛湾泽层区传奖励杀敌数据应该够卖买获采网灯浆壳块")[i]]));
function switchNameV47(name,file=""){
  const map=window.SDVSwitchNamesV47||{};
  const fileKey=String(file||""),nameKey=String(name||"");
  const direct=map[fileKey]||map[nameKey]||map[fileKey.toLowerCase()]||map[nameKey.toLowerCase()];
  if(direct)return direct;
  return String(name||"").split("").map(ch=>SWITCH_T2S_V47[ch]||ch).join("");
}

const TIME_SLOTS_V93=[{id:"morning",label:"早上",from:600,to:900,rep:700},{id:"forenoon",label:"上午",from:900,to:1200,rep:1000},{id:"noon",label:"中午",from:1200,to:1400,rep:1300},{id:"afternoon",label:"下午",from:1400,to:1700,rep:1500},{id:"evening",label:"晚上",from:1700,to:2200,rep:1900},{id:"night",label:"深夜",from:2200,to:2600,rep:2300}];
const slotV93=id=>TIME_SLOTS_V93.find(x=>x.id===id)||null;
const cropOfV96=f=>{const C=window.SDVCropsV96;if(!C||!f)return null;if(C.crops[f])return{en:f,c:C.crops[f],isSeed:false};for(const en in C.crops){if(C.crops[en].seed===f)return{en,c:C.crops[en],isSeed:true}}return null};
const cropPlanV96=(c,ctx)=>{const SEQ=["春","夏","秋","冬"];const season=ctx.season,day=Number(ctx.day||1);
  if(!c.seasons||!c.seasons.length)return{kind:"special"};
  if(!c.seasons.includes(season))return{kind:"off"};
  let ei=SEQ.indexOf(season);while(c.seasons.includes(SEQ[ei+1]))ei++;
  const chainEnd=(ei-SEQ.indexOf(season))*28+28;
  const fmt=abs=>{const si=SEQ.indexOf(season)+Math.floor((abs-1)/28);return SEQ[si]+String(((abs-1)%28)+1)};
  const lastAbs=chainEnd-c.grow;
  return{kind:"ok",okToday:day<=lastAbs,lastPlant:lastAbs>=1?fmt(lastAbs):null,harvest:fmt(day+c.grow),chainEnd:fmt(chainEnd),daysLeft:lastAbs-day};
};
const NPC_LEGACY_V95={"科罗布斯":["克羅巴斯","克罗巴斯"]};
const NPC_SIMP_V92={"阿比蓋爾":"阿比盖尔","亞歷克斯":"亚历克斯","艾利歐特":"艾利欧特","艾蜜麗":"艾米丽","喬治":"乔治","哈維":"哈维","賈斯":"贾斯","喬迪":"乔迪","莉亞":"莉亚","雷歐":"雷欧","劉易斯":"刘易斯","萊納斯":"莱纳斯","瑪妮":"玛妮","瑪魯":"玛鲁","皮埃爾":"皮埃尔","羅賓":"罗宾","謝恩":"谢恩","法師":"法师","科罗布斯":"科罗布斯"}; /* 官方簡中人名（wiki zh langlinks 2026-08-15），供找人簡繁互查 */
/* ================= v88 全域搜尋：正規化與進度別名 ================= */
const normalizeSearchV88 = s => String(s||"").normalize("NFKC").toLowerCase()
  .replace(/[\s·・．.，,、_'’\-—／/()（）「」【】]+/g,"")
  .split("").map(ch=>SWITCH_T2S_V47[ch]||ch).join("");
const SEARCH_ALIAS_TABLE_V88 = [
  {id:"cc",names:["社區中心","社区中心","community center","bundles","收集包"],label:"社区中心進度",sub:"收集包與修復狀態",icon:"Golden Scroll",act:"bundles"},
  {id:"greenhouse",names:["溫室","温室","greenhouse"],label:"溫室",sub:"茶水間收集包獎勵 → 社區進度",icon:"Greenhouse",act:"bundles"},
  {id:"collection",names:["收藏","圖鑑","图鉴","出貨","出货","collection","shipping"],label:"收藏圖鑑",sub:"魚類／文物／礦物／出貨",icon:"Treasure Chest",act:"collection"},
  {id:"skills",names:["技能","職業","职业","skills","精通"],label:"角色與技能",sub:"等級、職業與精通",icon:"Stardew Hero Trophy",act:"skills"},
  {id:"farmdata",names:["農場資料","农场资料","農舍","农舍","工具","動物","动物","礦井進度","矿井进度"],label:"農場資料",sub:"工具、房屋、動物與礦井進度",icon:"Farm Computer",act:"farm"},
  {id:"wardrobe",names:["衣櫥","衣橱","服裝","服装","wardrobe","搭配"],label:"衣櫥搭配",sub:"服飾與染色預覽",icon:"Deluxe Cowboy Hat",act:"wardrobe"},
  {id:"notes",names:["備註","备注","筆記","笔记","notes"],label:"備註",sub:"自由記事",icon:"Journal Scrap",act:"notes"},
  {id:"today",names:["今天","今日","today","日曆","日历","節日","节日"],label:"總覽／今天",sub:"今日提醒與日曆",icon:"Calendar",act:"overview"},
];

const STARDROP_SOURCES_V26 = [
  {id:"fair",name:"星露谷展覽會",desc:"用 2,000 星幣購買。"},
  {id:"mine100",name:"礦井 100 層",desc:"開啟第 100 層寶箱取得。"},
  {id:"spouse",name:"配偶／室友",desc:"關係達到 12.5 心後取得。"},
  {id:"krobus",name:"下水道・科罗布斯",desc:"20,000g 購買。"},
  {id:"cannoli",name:"秘密森林・老坎諾利大師",desc:"給雕像一顆寶石甜莓後取得。"},
  {id:"angler",name:"垂釣大師",desc:"釣到所有魚後，隔天收到威利寄來的星之果實。"},
  {id:"museum",name:"博物館全收集",desc:"捐滿全部 95 件館藏後取得。"}
];

const FESTIVAL_VENUE_V94={"彩蛋節":{node:"town"},"花舞節":{node:"forest"},"夏威夷宴會":{node:"beach"},"月光水母起舞":{node:"beach"},"星露谷展覽會":{node:"town"},"萬靈節":{node:"town"},"冰雪節":{node:"forest"},"冬日星盛宴":{node:"town"},"沙漠節":{node:"desert"},"夜市":{node:"beach"},"鱒魚大賽":{node:"forest"},"魷魚節":{node:"beach"}};
const festVenueLabelV94=k=>{const v=FESTIVAL_VENUE_V94[k];if(!v)return "";const nd=WORLD_NAV_V87().nodes?.[v.node];return nd?nd.name:""};
const FESTIVAL_GUIDE_V26 = {
  "彩蛋節":{desc:"鎮上舉行彩蛋狩獵；節日商店可以買草莓種子。",items:[["Strawberry Seeds","草莓種子"],["Straw Hat","草帽"]]},
  "沙漠節":{desc:"春 15–17 的三日沙漠活動，有每日挑戰、商店與各種臨時攤位。",items:[["Calico Egg","卡利科蛋"]]},
  "花舞節":{desc:"在煤矿森林舉行；和可交往角色達到 4 心後可以邀請對方跳舞。",items:[]},
  "夏威夷宴會":{desc:"把一樣食材放進公共湯鍋；州長的評價會影響與村民的友情。",items:[["Cauliflower","花椰菜"],["Super Cucumber","大海參"]]},
  "鱒魚大賽":{desc:"在煤矿森林釣虹鱒；拿到金色標籤後可在攤位換獎勵。",items:[["Rainbow Trout","虹鱒魚"],["Golden Tag","金色標籤"]]},
  "月光水母起舞":{desc:"晚上到海灘觀看月光水母遷徙，沒有競賽或需要準備的物品。",items:[]},
  "星露谷展覽會":{desc:"展示九樣物品並玩小遊戲賺星幣；2,000 星幣可換一顆星之果實。",items:[["Token","星幣"],["Stardrop","星之果實"]]},
  "萬靈節":{desc:"夜間進鎮走迷宮；迷宮終點可拿到黃金南瓜。",items:[["Golden Pumpkin","黃金南瓜"]]},
  "冰雪節":{desc:"冰釣比賽至少釣到 5 條魚才能獲勝；第一次獲勝會拿到釣具、磁鐵與水手帽，之後獲勝改給獎品券。",items:[["Barbed Hook","倒刺鉤"],["Dressed Spinner","精裝旋式魚餌"],["Magnet","磁鐵"],["Sailor's Cap","水手帽"],["Prize Ticket","獎品券"]]},
  "魷魚節":{desc:"冬 12–13 在海灘釣魷魚，依當日釣到的數量領不同階級獎勵。",items:[["Squid","魷魚"],["Mystery Box","謎之盒"]]},
  "夜市":{desc:"冬 15–17 晚上海灘開市；有商店、美人魚秀與深海潛水艇釣魚。",items:[["Pearl","珍珠"],["Blobfish","水滴魚"]]},
  "冬日星盛宴":{desc:"秘密送禮活動；到現場後把禮物送給指定村民，也會收到另一位村民的禮物。",items:[]}
};

/* ================= 全新手帳預設：不帶任何玩家進度 ================= */
const SAVE_SCHEMA_VERSION_V68 = 2;
const LEGACY_SCHEMA_VERSION_V68 = 0;
const PREFILL = {
  schemaVersion: SAVE_SCHEMA_VERSION_V68,
  base: { year: 1, season: "春", day: 1, money: 0, totalIncome: 0, backpack: 12, farm: "", name: "", platform: "Switch 2 / 1.6", profileDataVerifiedV47: false },
  skills: { farming: 0, mining: 0, foraging: 0, fishing: 0, combat: 0 },
  prof: { farming5: "", farming10: "", mining5: "", mining10: "", foraging5: "", foraging10: "", fishing5: "", fishing10: "", combat5: "", combat10: "" },
  mine: { normal: 0, skullBest: 0 },
  tools: { watering: "初始", pickaxe: "初始", axe: "初始", hoe: "初始", trash: "初始" },
  house: 0,
  buildings: { coop: 0, barn: 0, silos: 0, fishPonds: 0, sheds: 0, other: [] },
  animals: {}, ponds: [], milestones: [], wallet: [], abilities: [], bundleDone: [], bundleItems: {}, friendship: {}, factClaimsV68: {},
  todayV69:{weatherByDate:{},hiddenByDate:{},pinnedIds:[]},
  collections: { fish: [], artifact: [], mineral: [] }, mastery: [], notes: "", raccoonV50:{stump:false,requests:0}, extras: { starfruit: 0, buildingNote: "" },
};


const LINKED_ROUTE_FACTS_V68 = {
  greenhouse:{room:"pantry",joja:"greenhouse"},
  minecart:{room:"boiler",joja:"minecart"},
  bridge:{room:"crafts",joja:"bridge"},
  panning:{room:"fishtank",joja:"panning"},
  bus:{room:"vault",joja:"bus"}
};
const LINKED_MILESTONES_V68 = new Set(["greenhouse","horse","mine120","bus","minecart","bridge","panning","cc"]);
const BUILDING_OTHER_NAMES_V68 = {
  stable:["馬廄","马厩"], greenhouse:["溫室","温室"], well:["水井"], mill:["磨坊"], slime:["史萊姆窩","史莱姆屋"], cabin:["連線小屋","联机小屋"], junimo:["祝尼魔小屋"]
};

function factClaimSourcesFromStateV68(state,id){
  const raw=state?.factClaimsV68?.[id];
  return Array.isArray(raw)?[...new Set(raw.filter(x=>typeof x==="string"&&x))]:[];
}
function withFactClaimV68(state,id,source,on){
  const claims={...(state?.factClaimsV68||{})};
  const set=new Set(factClaimSourcesFromStateV68(state,id));
  if(on)set.add(source);else set.delete(source);
  if(set.size)claims[id]=[...set];else delete claims[id];
  return {...state,factClaimsV68:claims};
}
function buildingCountFromStateV68(state,key){
  const counts=state?.buildingCounts||{};
  if(counts[key]!=null)return Math.max(0,Number(counts[key])||0);
  if(key==="coop")return Number(state?.buildings?.coop||0)>0?1:0;
  if(key==="barn")return Number(state?.buildings?.barn||0)>0?1:0;
  if(key==="silo")return Math.max(0,Number(state?.buildings?.silos||0));
  if(key==="shed")return Math.max(0,Number(state?.buildings?.sheds||0));
  const other=state?.buildings?.other||[];
  const names=BUILDING_OTHER_NAMES_V68[key]||[];
  return names.some(name=>other.includes(name))?1:0;
}
function withStableCountV68(state,value){
  const v=Math.max(0,Math.min(99,Number(value)||0));
  const counts={...(state?.buildingCounts||{}),stable:v};
  const buildings={...(state?.buildings||{})};
  const other=(buildings.other||[]).filter(name=>!BUILDING_OTHER_NAMES_V68.stable.includes(name));
  buildings.other=v>0?[...new Set([...other,"馬廄"])]:other;
  return {...state,buildingCounts:counts,buildings};
}
function bundleItemsFromStateV68(state,bundle){
  const mode=state?.bundleModeV28||"standard";
  const custom=state?.bundleCustomV28||{};
  return mode==="custom"?(custom[bundle.id]||bundle.items):bundle.items;
}
function bundleNeedFromStateV68(state,bundle){
  const items=bundleItemsFromStateV68(state,bundle);
  const base=bundle.need||bundle.items.length;
  const custom=state?.bundleNeedV28||{};
  const raw=(state?.bundleModeV28||"standard")==="custom"&&custom[bundle.id]!=null?Number(custom[bundle.id]):base;
  return Math.max(1,Math.min(items.length||1,Number(raw)||1));
}
function roomExplicitDoneFromStateV68(state,roomId){
  return (state?.bundleDone||[]).includes(roomId);
}
function roomItemsCompleteFromStateV68(state,roomId){
  const room=BUNDLE_ROOMS.find(r=>r.id===roomId);
  if(!room)return false;
  return room.bundles.every(bundle=>{
    const items=bundleItemsFromStateV68(state,bundle);
    const got=(state?.bundleItems?.[bundle.id]||[]).filter(x=>items.includes(x));
    return got.length>=bundleNeedFromStateV68(state,bundle);
  });
}
function roomDoneFromStateV68(state,roomId){
  return roomExplicitDoneFromStateV68(state,roomId)||roomItemsCompleteFromStateV68(state,roomId);
}
function currentRouteFromStateV68(state){
  return ["cc","joja"].includes(state?.communityRouteV28)?state.communityRouteV28:"";
}
function routeFactDoneFromStateV68(state,id){
  const map=LINKED_ROUTE_FACTS_V68[id];
  if(!map)return false;
  const route=currentRouteFromStateV68(state);
  if(route==="cc")return roomDoneFromStateV68(state,map.room);
  if(route==="joja")return (state?.jojaProjectsV28||[]).includes(map.joja);
  return false;
}
function walletHasSkullKeyV68(state){
  const values=state?.wallet||[];
  return ["skull_key","骷髏鑰匙","头骨钥匙"].some(v=>values.includes(v));
}
function progressFactDoneFromStateV68(state,id){
  const claimed=factClaimSourcesFromStateV68(state,id).length>0;
  if(LINKED_ROUTE_FACTS_V68[id]){
    if(id==="greenhouse")return claimed||routeFactDoneFromStateV68(state,id)||buildingCountFromStateV68(state,"greenhouse")>0;
    if(id==="panning")return claimed||routeFactDoneFromStateV68(state,id)||Boolean(state?.tools?.pan&&state.tools.pan!=="未取得");
    return claimed||routeFactDoneFromStateV68(state,id);
  }
  if(id==="mine120")return claimed||Number(state?.mine?.normal||0)>=120||walletHasSkullKeyV68(state);
  if(id==="horse")return claimed||buildingCountFromStateV68(state,"stable")>0;
  if(id==="cc")return claimed||(currentRouteFromStateV68(state)==="cc"&&BUNDLE_ROOMS.every(r=>roomDoneFromStateV68(state,r.id)));
  return false;
}

function progressFlagsV92(state){
  return {ccDone:progressFactDoneFromStateV68(state,"cc"),busFixed:progressFactDoneFromStateV68(state,"bus")};
}
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
  // v61: all six bottom tabs use transparent in-game item icons. The old first three
  // used framed menu-tab art, which made them visually much heavier than Search/Wardrobe/Notes.
  { id: "overview", name: "總覽", icon: "🏡", file: "Warp Totem Farm" },
  { id: "data", name: "資料", icon: "⭐", file: "Stardew Valley Almanac" },
  { id: "people", name: "社交", icon: "💛", file: "Bouquet" },
  { id: "fishing", name: "查找", icon: "🔎", file: "Magnifying Glass" },
  { id: "wardrobe", name: "衣櫥", icon: "🎩", file: "Deluxe Cowboy Hat" },
  { id: "notes", name: "備註", icon: "📝", file: "Journal Scrap" },
];
/* ================= 小元件 ================= */
const SECTION_ICON_FILES_V65 = {
  "📅":"Calendar", "📊":"Stardew Valley Almanac", "🏆":"Golden Tag", "🎒":"Chest", "⭐":"Book Of Stars",
  "⛏️":"Pickaxe", "✨":"Stardrop", "📦":"Golden Scroll", "🏠":"House (tier 1)", "🔧":"Pickaxe",
  "🏗️":"Silo", "🐔":"White Chicken", "🐄":"Cow", "🐟":"Sunfish", "💛":"Friendship 101", "💘":"Bouquet",
  "🏘️":"Friendship 101", "📖":"Book of Mysteries", "📝":"Journal Scrap", "📤":"Letter", "💾":"Chest"
};
function SectionTitle({ icon, children, right }) {
  const file = typeof icon==="string"&&icon.startsWith("game:")?icon.slice(5):(SECTION_ICON_FILES_V65[icon]||UI_ICON_FILES[icon]);
  return <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "20px 0 8px" }}>
    {file ? <GameIcon file={file} size={27}/> : <span style={{ fontSize: 20 }}>{icon}</span>}
    <span style={{ fontSize: 17, fontWeight: 900, color: C.darkBrown }}>{children}</span>
    {right && <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 800, color: C.muted }}>{right}</span>}
  </div>;
}
function Card({ children, style, ...props }) {
  return <div {...props} style={{ background: C.paper, border: `2px solid ${C.line}`, borderRadius: 12, padding: 13, boxShadow: `0 3px 8px ${C.shadow}`, ...style }}>{children}</div>;
}
function Pill({ children, active, onClick, small }) {
  return <button onClick={onClick} style={{
    border: `2px solid ${active ? C.green : C.line}`, background: active ? C.lightGreen : C.cream,
    color: active ? C.green : C.ink, borderRadius: 18, padding: small ? "4px 9px" : "6px 12px",
    fontSize: small ? 12 : 13, fontWeight: 800, cursor: "pointer",
  }}>{children}</button>;
}
function NumInput({ value, onChange, min = 0, max = 999, suffix = "", width = 64 }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
    <input type="number" min={min} max={max} value={value} onChange={e => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
      style={{ width, border: `2px solid ${C.line}`, background: "#FFFCF0", borderRadius: 7, padding: "5px 6px", color: C.ink, fontWeight: 800, fontSize: 14 }} />
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

const WARDROBE_DIR_LABEL_V33 = {front:"正面",right:"右側",back:"背面",left:"左側"};
const WARDROBE_BG_ROOT_V36 = "https://raw.githubusercontent.com/shayderrr/stardew_decomp/6fcc1d4d20d14c5be6232d0f9eac1d423222fd84/stardew/unpacked/LooseSprites/";
const WARDROBE_SCENE_V35 = {
  day:{label:"☀️ 白天",bg:"linear-gradient(#8FD0F3 0 62%,#78AD57 62% 70%,#C9A66A 70%)",image:WARDROBE_BG_ROOT_V36+"daybg.png",labelBg:"rgba(255,248,227,.9)",labelColor:"#604329"},
  night:{label:"🌙 夜晚",bg:"linear-gradient(#17264B 0 62%,#35513A 62% 70%,#665342 70%)",image:WARDROBE_BG_ROOT_V36+"nightbg.png",labelBg:"rgba(27,28,49,.82)",labelColor:"#F7EBC8"}
};

const WARDROBE_V38_PLAYER_DEFAULT = {
  hat:"",shirt:"",pants:"",boots:"",shirtColor:"#5f8fb8",pantsColor:"#3f5f99",
  gender:"female",hairIndex:0,hairColor:"#6a402c",skinIndex:0,eyeColor:"#5B4636",accessoryIndex:-1
};
function normalizeWardrobeHexV38(value,fallback){
  const v=String(value||"");
  return /^#[0-9a-f]{6}$/i.test(v)?v:fallback;
}
function normalizeWardrobeProgressV38(input){
  const base=input&&typeof input==="object"?input:{};
  const old=base.wardrobeV30&&typeof base.wardrobeV30==="object"?base.wardrobeV30:{};
  const oldPlayer=old.player&&typeof old.player==="object"?old.player:{};
  const finite=(value,fallback)=>Number.isFinite(Number(value))?Number(value):fallback;
  const player={...WARDROBE_V38_PLAYER_DEFAULT,...oldPlayer};
  player.gender=player.gender==="male"?"male":"female";
  player.hairIndex=Math.max(0,Math.floor(finite(player.hairIndex,0)));
  player.skinIndex=Math.max(0,Math.floor(finite(player.skinIndex,0)));
  player.accessoryIndex=Math.max(-1,Math.floor(finite(player.accessoryIndex,-1)));
  player.hairColor=normalizeWardrobeHexV38(player.hairColor,WARDROBE_V38_PLAYER_DEFAULT.hairColor);
  player.eyeColor=normalizeWardrobeHexV38(player.eyeColor,WARDROBE_V38_PLAYER_DEFAULT.eyeColor);
  player.shirtColor=normalizeWardrobeHexV38(player.shirtColor,WARDROBE_V38_PLAYER_DEFAULT.shirtColor);
  player.pantsColor=normalizeWardrobeHexV38(player.pantsColor,WARDROBE_V38_PLAYER_DEFAULT.pantsColor);
  for(const key of ["hat","shirt","pants","boots"]) player[key]=typeof player[key]==="string"?player[key]:"";
  const animal=(value,pet=false)=>{
    const v=value&&typeof value==="object"?value:{};
    const out={...v,hat:typeof v.hat==="string"?v.hat:""};
    if(pet) out.variant=Math.max(0,Math.min(5,Math.floor(finite(v.variant,0))));
    return out;
  };
  return {...base,wardrobeSchemaVersion:38,wardrobeV30:{...old,player,horse:animal(old.horse),cat:animal(old.cat,true),dog:animal(old.dog,true)}};
}

function normalizeSaveV68(input){
  const raw=input&&typeof input==="object"&&!Array.isArray(input)?input:{};
  const hasSchema=Object.prototype.hasOwnProperty.call(raw,"schemaVersion");
  const parsed=Number(raw.schemaVersion);
  if(raw.friendship&&raw.friendship["克羅巴斯"]!=null){if(raw.friendship["科罗布斯"]==null)raw.friendship["科罗布斯"]=raw.friendship["克羅巴斯"];delete raw.friendship["克羅巴斯"];}
  if(raw.extras&&Array.isArray(raw.extras.favV88))raw.extras.favV88.forEach(f=>{if(f&&f.go&&f.go.n==="克羅巴斯")f.go.n="科罗布斯";if(f&&typeof f.label==="string")f.label=f.label.split("克羅巴斯").join("科罗布斯");});
  const sourceSchema=hasSchema&&Number.isInteger(parsed)&&parsed>=0?parsed:LEGACY_SCHEMA_VERSION_V68;
  let next={...raw};
  if(sourceSchema<2){
    next={
      ...next,
      mine:{...(next.mine||{})}, tools:{...(next.tools||{})}, buildings:{...(next.buildings||{})}, buildingCounts:{...(next.buildingCounts||{})},
      bundleItems:{...(next.bundleItems||{})}, factClaimsV68:{...(next.factClaimsV68||{})}
    };
    const milestones=Array.isArray(next.milestones)?next.milestones:[];
    const rooms=new Set(Array.isArray(next.bundleDone)?next.bundleDone:[]);
    const joja=new Set(Array.isArray(next.jojaProjectsV28)?next.jojaProjectsV28:[]);
    let route=currentRouteFromStateV68(next);
    if(!route){
      const ccProgress=rooms.size>0||Object.values(next.bundleItems||{}).some(v=>Array.isArray(v)&&v.length>0);
      const jojaProgress=Boolean(next.jojaMemberV28)||joja.size>0;
      if(ccProgress&&!jojaProgress)route="cc";
      else if(jojaProgress&&!ccProgress)route="joja";
      if(route)next.communityRouteV28=route;
    }
    const addClaim=(id,source)=>{
      const set=new Set(factClaimSourcesFromStateV68(next,id));set.add(source);
      next.factClaimsV68={...(next.factClaimsV68||{}),[id]:[...set]};
    };
    for(const id of milestones.filter(x=>LINKED_MILESTONES_V68.has(x))){
      const mapped=LINKED_ROUTE_FACTS_V68[id];
      if(mapped){
        if(route==="cc")rooms.add(mapped.room);
        else if(route==="joja"){joja.add(mapped.joja);next.jojaMemberV28=true;}
        else addClaim(id,"legacy-milestone");
      }else if(id==="mine120"){
        next.mine.normal=Math.max(120,Number(next.mine.normal||0));
      }else if(id==="horse"){
        next=withStableCountV68(next,Math.max(1,buildingCountFromStateV68(next,"stable")));
      }else if(id==="cc"){
        if(route==="cc")BUNDLE_ROOMS.forEach(r=>rooms.add(r.id));
        else addClaim(id,"legacy-milestone");
      }
    }
    if(buildingCountFromStateV68(next,"greenhouse")>0)addClaim("greenhouse","farm");
    if(walletHasSkullKeyV68(next))next.mine.normal=Math.max(120,Number(next.mine.normal||0));
    const skullAliases=new Set(["skull_key","骷髏鑰匙","头骨钥匙"]);
    next.wallet=(Array.isArray(next.wallet)?next.wallet:[]).filter(x=>!skullAliases.has(x));
    next.milestones=milestones.filter(x=>!LINKED_MILESTONES_V68.has(x));
    next.bundleDone=[...rooms];
    next.jojaProjectsV28=[...joja];
    const counts={...(next.buildingCounts||{})};delete counts.greenhouse;next.buildingCounts=counts;
    next.buildings={...(next.buildings||{}),other:(next.buildings?.other||[]).filter(name=>!BUILDING_OTHER_NAMES_V68.greenhouse.includes(name))};
  }
  const claims={};
  for(const [id,sources] of Object.entries(next.factClaimsV68||{})){
    if(Array.isArray(sources)){
      const clean=[...new Set(sources.filter(x=>typeof x==="string"&&x))];
      if(clean.length)claims[id]=clean;
    }
  }
  next.factClaimsV68=claims;
  next.schemaVersion=sourceSchema>SAVE_SCHEMA_VERSION_V68?sourceSchema:SAVE_SCHEMA_VERSION_V68;
  return normalizeWardrobeProgressV38({...PREFILL,...next,schemaVersion:next.schemaVersion});
}

function FarmerSpritePreviewV33({player,direction="front",large=false,scene="day",shirtDyeable=false,pantsDyeable=false}) {
  const ref=useRef(null);
  useEffect(()=>{
    const api=window.SDVFarmerSpriteV33;
    if(!api?.draw||!ref.current)return;
    const safe={...WARDROBE_V38_PLAYER_DEFAULT,...(player||{})};
    const opts={
      gender:safe.gender==="male"?"male":"female",direction,
      selected:{hat:typeof safe.hat==="string"?safe.hat:"",shirt:(typeof safe.shirt==="string"&&safe.shirt)?safe.shirt:"Shirt003",pants:(typeof safe.pants==="string"&&safe.pants)?safe.pants:"Farmer Pants",boots:typeof safe.boots==="string"?safe.boots:""},
      shirtColor:normalizeWardrobeHexV38(safe.shirtColor,WARDROBE_V38_PLAYER_DEFAULT.shirtColor),pantsColor:normalizeWardrobeHexV38(safe.pantsColor,WARDROBE_V38_PLAYER_DEFAULT.pantsColor),
      hairColor:normalizeWardrobeHexV38(safe.hairColor,WARDROBE_V38_PLAYER_DEFAULT.hairColor),hairIndex:Number.isFinite(Number(safe.hairIndex))?Number(safe.hairIndex):0,
      skinIndex:Number.isFinite(Number(safe.skinIndex))?Number(safe.skinIndex):0,eyeColor:normalizeWardrobeHexV38(safe.eyeColor,WARDROBE_V38_PLAYER_DEFAULT.eyeColor),accessoryIndex:Number.isFinite(Number(safe.accessoryIndex))?Number(safe.accessoryIndex):-1,
      shirtDyeable,pantsDyeable
    };
    api.draw(ref.current,opts).catch(e=>{
      console.warn("farmer sprite preview failed; retrying safe base",e);
      if(!ref.current)return;
      api.draw(ref.current,{...opts,selected:{hat:"",shirt:"Shirt003",pants:"Farmer Pants",boots:""},accessoryIndex:-1}).catch(err=>console.warn("farmer safe fallback failed",err));
    });
  },[player?.gender,player?.hat,player?.shirt,player?.pants,player?.boots,player?.shirtColor,player?.pantsColor,player?.hairColor,player?.hairIndex,player?.skinIndex,player?.eyeColor,player?.accessoryIndex,direction,shirtDyeable,pantsDyeable]);
  const sc=WARDROBE_SCENE_V35[scene]||WARDROBE_SCENE_V35.day;
  // Helper backing is 48x84. 48x84 (small) and 96x168 (large) are exact integer scales.
  const w=large?96:48,h=large?168:84;
  const sceneStyle=large?{backgroundColor:scene==="night"?"#17264B":"#8FD0F3",backgroundImage:`url(${sc.image})`,backgroundSize:"125% auto",backgroundPosition:"center 50%",backgroundRepeat:"no-repeat",imageRendering:"pixelated"}:{background:sc.bg};
  return <div style={{position:"relative",height:large?182:100,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",borderRadius:9,...sceneStyle,border:`1px solid ${C.line}`}}>
    <canvas ref={ref} aria-label={`玩家${WARDROBE_DIR_LABEL_V33[direction]||""}遊戲 sprite 預覽`} style={{width:w,height:h,imageRendering:"pixelated",display:"block"}}/>
    {large&&<span style={{position:"absolute",right:4,top:4,fontSize:7.5,fontWeight:950,color:sc.labelColor,background:sc.labelBg,padding:"2px 5px",borderRadius:5}}>{sc.label}</span>}
    <span style={{position:"absolute",left:4,bottom:3,fontSize:large?8:6.8,fontWeight:950,color:"#604329",background:"rgba(255,248,227,.9)",padding:"1px 4px",borderRadius:5}}>{WARDROBE_DIR_LABEL_V33[direction]}</span>
  </div>;
}
function AnimalSpritePreviewV33({type,hat,variant=0,direction="front",large=false,scene="day"}) {
  const ref=useRef(null);
  useEffect(()=>{
    const api=window.SDVAnimalSpriteV33;
    if(!api?.draw||!ref.current)return;
    api.draw(ref.current,{type,hat,variant,direction}).catch(e=>console.warn("animal sprite preview failed",e));
  },[type,hat,variant,direction]);
  const sc=WARDROBE_SCENE_V35[scene]||WARDROBE_SCENE_V35.day;
  // Helper backing is 104x96. Small is exact 1/2, large is exact 1x.
  const w=large?104:52,h=large?96:48;
  const sceneStyle=large?{backgroundColor:scene==="night"?"#17264B":"#8FD0F3",backgroundImage:`url(${sc.image})`,backgroundSize:"125% auto",backgroundPosition:"center 50%",backgroundRepeat:"no-repeat",imageRendering:"pixelated"}:{background:sc.bg};
  return <div style={{position:"relative",height:large?126:100,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",borderRadius:9,...sceneStyle,border:`1px solid ${C.line}`}}>
    <canvas ref={ref} aria-label={`${type}${WARDROBE_DIR_LABEL_V33[direction]||""}遊戲 sprite 預覽`} style={{width:w,height:h,imageRendering:"pixelated",display:"block"}}/>
    {large&&<span style={{position:"absolute",right:4,top:4,fontSize:7.5,fontWeight:950,color:sc.labelColor,background:sc.labelBg,padding:"2px 5px",borderRadius:5}}>{sc.label}</span>}
    <span style={{position:"absolute",left:4,bottom:3,fontSize:large?8:6.8,fontWeight:950,color:"#604329",background:"rgba(255,248,227,.9)",padding:"1px 4px",borderRadius:5}}>{WARDROBE_DIR_LABEL_V33[direction]}</span>
  </div>;
}

const WARDROBE_CURSOR_V39 = WARDROBE_BG_ROOT_V36+"Cursors.png";
function GenderIconV39({gender}) {
  const ref=useRef(null);
  useEffect(()=>{
    let alive=true;
    const img=new Image();img.crossOrigin="anonymous";img.decoding="async";
    img.onload=()=>{
      if(!alive||!ref.current)return;
      const canvas=ref.current;canvas.width=16;canvas.height=16;
      const ctx=canvas.getContext("2d");ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,16,16);
      ctx.drawImage(img,gender==="male"?128:144,192,16,16,0,0,16,16);
    };
    img.src=WARDROBE_CURSOR_V39;
    return()=>{alive=false};
  },[gender]);
  return <canvas ref={ref} aria-label={gender==="male"?"男性體型":"女性體型"} style={{width:28,height:28,imageRendering:"pixelated",display:"block"}}/>;
}
function PetVariantPreviewV36({type,variant=0,compact=false}) {
  const ref=useRef(null);
  useEffect(()=>{
    const api=window.SDVAnimalSpriteV33;
    if(!api?.draw||!ref.current)return;
    api.draw(ref.current,{type,variant,hat:"",direction:"front"}).catch(e=>console.warn("pet variant preview failed",e));
  },[type,variant]);
  return <canvas ref={ref} aria-label={`${type} 外觀 ${Number(variant)+1}`} style={{width:compact?25:52,height:compact?23:48,imageRendering:"pixelated",display:"block",margin:"0 auto"}}/>;
}

/* ================= 主程式 ================= */
function StardewTracker() {
  const [data, setData] = useState(PREFILL);
  const [tab, setTab] = useState("overview");
  const [dataSection, setDataSection] = useState("skills");
  const [farmSection, setFarmSection] = useState("animals");
  const [skillSection, setSkillSection] = useState("milestones");
  const [machineGroup, setMachineGroup] = useState("artisan");
  const [bundleRoom, setBundleRoom] = useState("crafts");
  const [mineRangeV28, setMineRangeV28] = useState("1");
  const [bundleEditV28, setBundleEditV28] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState("fish");
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedNPC, setExpandedNPC] = useState(null);
  const [fishSeason, setFishSeason] = useState("當季");
  const [fishWeather, setFishWeather] = useState("全部");
  const [fishArea, setFishArea] = useState("全部");
  const [fishMissingOnly, setFishMissingOnly] = useState(false);
  const [profileOcrStatus, setProfileOcrStatus] = useState("");
  const [profileOcrResult, setProfileOcrResult] = useState(null);
  const [powerSection, setPowerSection] = useState("special");
  const [collectionSection, setCollectionSection] = useState("fish");
  const [cookingModeV3, setCookingModeV3] = useState("prep");
  const [selectedCookingV62, setSelectedCookingV62] = useState(null);
  const [prepMissingOnlyV3, setPrepMissingOnlyV3] = useState(false);
  const [selectedPaperV3, setSelectedPaperV3] = useState(null);
  const [cookingMode, setCookingMode] = useState("ingredients");
  const [cookingGroup, setCookingGroup] = useState("all");
  const [cookingMissingOnly, setCookingMissingOnly] = useState(false);
  const [recipeQuery, setRecipeQuery] = useState("");
  const [recipeFilter, setRecipeFilter] = useState("all");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [todayExpandedV69, setTodayExpandedV69] = useState("");
  const [worldStackV87, setWorldStackV87] = useState(["world"]);
  const [worldSelV87, setWorldSelV87] = useState(null);
  const [searchOpenV88, setSearchOpenV88] = useState(false);
  const [searchQueryV88, setSearchQueryV88] = useState("");
  const [searchIndexV88, setSearchIndexV88] = useState(null);
  const [favEditV88, setFavEditV88] = useState(false);
  const [worldQuickAllV90, setWorldQuickAllV90] = useState(true);
  const [worldQuickV71, setWorldQuickV71] = useState("");
  const [profileEditV95,setProfileEditV95]=useState(false);
  const [npcFindTimeV92,setNpcFindTimeV92]=useState("auto");
  const [npcFindViewV92,setNpcFindViewV92]=useState("npc");
  const [npcFindQueryV92,setNpcFindQueryV92]=useState("");
  const [npcFindAdvV92,setNpcFindAdvV92]=useState(false);
  const [npcFindSeasonV92,setNpcFindSeasonV92]=useState(null);
  const [npcFindDayV92,setNpcFindDayV92]=useState(null);
  const [npcFindRainV92,setNpcFindRainV92]=useState(null);
  const [worldFishQueryV71, setWorldFishQueryV71] = useState("");
  const [socialGroup, setSocialGroup] = useState("single");
  const [pondPicker, setPondPicker] = useState(null);
  const [pondFishQueryV55, setPondFishQueryV55] = useState("");
  const [fishViewV4, setFishViewV4] = useState("world");
  const [fishAreaV4, setFishAreaV4] = useState("town");
  const [fishWeatherV4, setFishWeatherV4] = useState("全部");
  const [fishHourV4, setFishHourV4] = useState("auto");
  const [fishMissingV4, setFishMissingV4] = useState(true);
  const [fishSeasonV4, setFishSeasonV4] = useState("當季");
  const [fishTodayOpenV4, setFishTodayOpenV4] = useState(null);
  const [fishFindGroupV4, setFishFindGroupV4] = useState("main");
  const [fishSeasonsV42, setFishSeasonsV42] = useState([]);
  const [fishWeathersV42, setFishWeathersV42] = useState([]);
  const [fishTimesV42, setFishTimesV42] = useState([]);
  const [itemUsageQueryV42, setItemUsageQueryV42] = useState("");
  const [itemUsageSelectedV42, setItemUsageSelectedV42] = useState("");
  const [selectedShippingV64, setSelectedShippingV64] = useState("");
  const [selectedAchievementV64, setSelectedAchievementV64] = useState("");
  const [itemUsageFilterV65, setItemUsageFilterV65] = useState("");
  const [navStackV62, setNavStackV62] = useState([]);
  const [wardrobeCategoryV30, setWardrobeCategoryV30] = useState("hat");
  const [wardrobeTargetV30, setWardrobeTargetV30] = useState("player");
  const [wardrobeDirectionV32, setWardrobeDirectionV32] = useState("front");
  const [wardrobeQueryV34, setWardrobeQueryV34] = useState("");
  const [wardrobeFilterV37, setWardrobeFilterV37] = useState("all");
  const [wardrobePageV37, setWardrobePageV37] = useState(0);
  const [wardrobeAppearanceMetaV37, setWardrobeAppearanceMetaV37] = useState({hairCount:64,skinCount:24,accessoryCount:29,defaultEyeColor:"#5B4636"});
  const [, setLazyDataRevisionV67] = useState(0);
  const profileInputRef = useRef(null);
  const saveTimer = useRef(null);

  const loadLazyDataV67 = async group => {
    const api=window.SDVLazyDataV67;
    if(!api?.load)return false;
    try{await api.load(group);setLazyDataRevisionV67(v=>v+1);return true;}
    catch(error){console.warn(`lazy data load failed: ${group}`,error);return false;}
  };
  useEffect(()=>{
    if(tab==="wardrobe")loadLazyDataV67("wardrobe");
    if(tab==="fishing"||tab==="people")loadLazyDataV67("lookup");
    if(tab==="fishing"&&fishViewV4==="world")loadLazyDataV67("world");
  },[tab,fishViewV4]);

  useEffect(()=>{
    let alive=true;
    const api=window.SDVFarmerSpriteV33;
    if(api?.getAppearanceMeta) api.getAppearanceMeta().then(meta=>{if(alive&&meta)setWardrobeAppearanceMetaV37(meta)}).catch(e=>console.warn("appearance metadata failed",e));
    return()=>{alive=false};
  },[]);

  /* 載入：讀取目前瀏覽器的本機進度，無則使用預填資料 */
  useEffect(() => {
    (async () => {
      const pub = await storageGet(PUB_KEY, true);
      const local = await storageGet(STORAGE_KEY, false);
      let raw = pub?.value || local?.value;
      if (raw) {
        try { setData(normalizeSaveV68(JSON.parse(raw))); }
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
  const updateBase = (patch) => {
    const dateChanged=["day","season","year"].some(k=>k in patch&&patch[k]!==data.base[k]);
    const clear=dateChanged&&!("timeSlotV93" in patch)?{timeSlotV93:null}:{};
    update({ base: { ...data.base, ...clear, ...patch } });
  };
  const slotSelV93 = slotV93(data.base.timeSlotV93);
  const updateNested = (key, patch) => update({ [key]: { ...data[key], ...patch } });

  /* v54: shared runtime helpers. Keep every tab on the same persisted data model. */
  const extrasState = data.extras || {};
  const updateExtras = patch => update({ extras: { ...extrasState, ...patch } });

  const pushNavV62 = () => {
    const snapshot={tab,dataSection,farmSection,skillSection,bundleRoom,collectionSection,selectedCollection,selectedItem,selectedCookingV62,socialGroup,expandedNPC,fishViewV4,itemUsageQueryV42,itemUsageSelectedV42,selectedShippingV64,selectedAchievementV64,itemUsageFilterV65,scrollY:Number(window.scrollY||0)};
    setNavStackV62(stack=>[...stack.slice(-9),snapshot]);
  };
  const goBackV62 = () => {
    const prev=navStackV62[navStackV62.length-1];
    if(!prev)return;
    setNavStackV62(stack=>stack.slice(0,-1));
    setTab(prev.tab||"overview"); setDataSection(prev.dataSection||"skills"); setFarmSection(prev.farmSection||"animals"); setSkillSection(prev.skillSection||"milestones");
    setBundleRoom(prev.bundleRoom||""); setCollectionSection(prev.collectionSection||"fish"); setSelectedCollection(prev.selectedCollection||"fish"); setSelectedItem(prev.selectedItem??null); setSelectedCookingV62(prev.selectedCookingV62||null);
    setSocialGroup(prev.socialGroup||"single"); setExpandedNPC(prev.expandedNPC||null); setFishViewV4(prev.fishViewV4||"items"); setItemUsageQueryV42(prev.itemUsageQueryV42||""); setItemUsageSelectedV42(prev.itemUsageSelectedV42||""); setSelectedShippingV64(prev.selectedShippingV64||""); setSelectedAchievementV64(prev.selectedAchievementV64||""); setItemUsageFilterV65(prev.itemUsageFilterV65||"");
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:Number(prev.scrollY||0),left:0,behavior:"auto"})));
  };


  const progressFactV68 = id => progressFactDoneFromStateV68(data,id);
  const factClaimSourcesV68 = id => factClaimSourcesFromStateV68(data,id);
  const setFactClaimV68 = (id,source,on) => setData(d=>withFactClaimV68(d,id,source,on));
  const factSourceLabelV68 = id => {
    const route=currentRouteFromStateV68(data);
    if(routeFactDoneFromStateV68(data,id))return route==="cc"?"由社区中心聯動":"由 Joja 工程聯動";
    if(id==="greenhouse"&&factClaimSourcesV68(id).includes("farm"))return "由農場溫室記錄";
    if(id==="mine120"&&Number(data.mine?.normal||0)>=120)return "由礦井進度聯動";
    if(id==="horse"&&buildingCountFromStateV68(data,"stable")>0)return "由马厩聯動";
    if(id==="panning"&&data.tools?.pan&&data.tools.pan!=="未取得")return "由淘金盤聯動";
    if(id==="cc"&&currentRouteFromStateV68(data)==="cc"&&BUNDLE_ROOMS.every(r=>roomDoneFromStateV68(data,r.id)))return "由社区中心房間聯動";
    if(factClaimSourcesV68(id).includes("legacy-milestone"))return "由舊里程碑保留";
    return "進度聯動";
  };
  const goChooseRouteV68 = () => {
    alert("這項進度要先知道你走社区中心還是 Joja 路線；已幫你切到城鎮修復頁選擇路線。");
    setDataSection("bundles");setBundleRoom("");window.scrollTo({top:0,left:0,behavior:"auto"});
  };
  const removeLegacyClaimIfOnlySourceV68 = id => {
    const candidate=withFactClaimV68(data,id,"legacy-milestone",false);
    if(!progressFactDoneFromStateV68(candidate,id)){setData(candidate);return true;}
    return false;
  };
  const setLinkedMilestoneV68 = (id,on) => {
    if(!on){
      if(removeLegacyClaimIfOnlySourceV68(id))return;
      alert(`「${MILESTONES.find(m=>m.id===id)?.name||id}」目前是由其他實際進度自動成立；請到對應的社区中心／Joja／農場／礦井記錄修正來源。`);
      return;
    }
    if(id==="mine120"){
      setData(d=>({...d,mine:{...(d.mine||{}),normal:Math.max(120,Number(d.mine?.normal||0))},wallet:(d.wallet||[]).filter(x=>!["skull_key","骷髏鑰匙","头骨钥匙"].includes(x))}));
      return;
    }
    if(id==="horse"){
      setData(d=>withStableCountV68(d,Math.max(1,buildingCountFromStateV68(d,"stable"))));
      return;
    }
    if(id==="cc"){
      const route=currentRouteFromStateV68(data);
      if(route==="joja"){alert("目前存檔選的是 Joja 路線，不能把「社区中心完成」當成同一路線的完成事件。");return;}
      if(!route){
        if(!window.confirm("「社区中心完成」代表這個存檔走社区中心路線。要切成社区中心路線並標記六個房間完成嗎？"))return;
      }
      setData(d=>({...d,communityRouteV28:"cc",bundleDone:[...new Set([...(d.bundleDone||[]),...BUNDLE_ROOMS.map(r=>r.id)])]}));
      return;
    }
    const mapped=LINKED_ROUTE_FACTS_V68[id];
    if(mapped){
      const route=currentRouteFromStateV68(data);
      if(!route){goChooseRouteV68();return;}
      setData(d=>route==="cc"
        ? {...d,bundleDone:[...new Set([...(d.bundleDone||[]),mapped.room])]}
        : {...d,jojaMemberV28:true,jojaProjectsV28:[...new Set([...(d.jojaProjectsV28||[]),mapped.joja])]});
      return;
    }
  };

  const powerBucketV54 = kind => kind === "special" ? "wallet" : kind === "books" ? "abilities" : "mastery";
  const powerValuesV54 = kind => data[powerBucketV54(kind)] || [];
  const powerAliasesV54 = it => [it?.id, it?.name, ...(it?.legacy || [])].filter(Boolean);
  const isPowerChecked = (kind, it) => {
    if(kind==="special"&&it?.id==="skull_key")return progressFactV68("mine120");
    const values = powerValuesV54(kind);
    return powerAliasesV54(it).some(v => values.includes(v));
  };
  const togglePower = (kind, it) => {
    if(kind==="special"&&it?.id==="skull_key"){setLinkedMilestoneV68("mine120",!progressFactV68("mine120"));return;}
    const key = powerBucketV54(kind);
    const values = powerValuesV54(kind);
    const aliases = powerAliasesV54(it);
    const on = aliases.some(v => values.includes(v));
    const cleaned = values.filter(v => !aliases.includes(v));
    update({ [key]: on ? cleaned : [...cleaned, it.id] });
  };

  const derivedAchievement = id => {
    const income = Number(data.base?.totalIncome || 0);
    const hearts = Object.values(data.friendship || {}).map(v => Number(v) || 0);
    const cooked = (data.cookingCollectionV3 || []).length;
    const fishKinds = (data.collections?.fish || []).length;
    const museumCount = (data.collections?.artifact || []).length + (data.collections?.mineral || []).length;
    const museumTarget = (COLLECTIONS.artifact?.items?.length || 0) + (COLLECTIONS.mineral?.items?.length || 0);
    const shippingCount = (data.shippingV30 || []).length;
    const skills = SKILLS.map(sk => Number(data.skills?.[sk.id] || 0));
    switch(id){
      case "greenhorn": return income >= 15000;
      case "cowpoke": return income >= 50000;
      case "homesteader": return income >= 250000;
      case "millionaire": return income >= 1000000;
      case "legend": return income >= 10000000;
      case "museum_all": return museumTarget > 0 && museumCount >= museumTarget;
      case "treasure40": return museumCount >= 40;
      case "friend5": return hearts.some(v => v >= 5);
      case "friend10": return hearts.some(v => v >= 10);
      case "beloved": return hearts.filter(v => v >= 10).length >= 8;
      case "cliques": return hearts.filter(v => v >= 5).length >= 4;
      case "networking": return hearts.filter(v => v >= 5).length >= 10;
      case "popular": return hearts.filter(v => v >= 5).length >= 20;
      case "cook10": return cooked >= 10;
      case "cook25": return cooked >= 25;
      case "cookall": return COOKING_DISHES_V3.length > 0 && cooked >= COOKING_DISHES_V3.length;
      case "house1": return Number(data.house || 0) >= 1;
      case "house2": return Number(data.house || 0) >= 2;
      case "fish10": return fishKinds >= 10;
      case "fish24": return fishKinds >= 24;
      case "fishall": return COLLECTIONS.fish?.items?.length > 0 && fishKinds >= COLLECTIONS.fish.items.length;
      case "fullshipment": return SHIPPING_ITEMS_V30.length > 0 && shippingCount >= SHIPPING_ITEMS_V30.length;
      case "bottom": return Number(data.mine?.normal || 0) >= 120;
      case "locallegend": return currentRouteFromStateV68(data)==="cc" && BUNDLE_ROOMS.every(r => roomDoneFromStateV68(data,r.id));
      case "joja": return Boolean(data.jojaMemberV28) && (data.jojaProjectsV28 || []).length >= JOJA_PROJECTS_V28.length;
      case "stardrops": return (data.stardropsV2 || []).length >= STARDROP_SOURCES_V26.length;
      case "talent": return skills.some(v => v >= 10);
      case "five": return skills.every(v => v >= 10);
      case "wellread": return BOOK_POWERS_V2.every(it => isPowerChecked("books", it));
      case "neighbors": return Number(data.raccoonV50?.requests || 0) >= 9;
      default: return false;
    }
  };
  const achievementChecked = id => derivedAchievement(id) || (data.achievementsV2 || []).includes(id);
  const toggleAchievement = id => {
    if(derivedAchievement(id)) return;
    const values = data.achievementsV2 || [];
    update({ achievementsV2: values.includes(id) ? values.filter(v => v !== id) : [...values, id] });
  };

  const normalizeLookupV54 = value => String(value||"").normalize("NFKC").toLowerCase().replace(/[\s·・_'’\-,:.()&]+/g,"");
  const lookupRowV54 = raw => {
    const needle = normalizeLookupV54(raw);
    if(!needle) return null;
    return (window.SDVLookupV46?.items || []).find(row => [row?.name,row?.zh,row?.file,switchNameV47(row?.name,row?.file),...(row?.aliases || [])].filter(Boolean).some(v => normalizeLookupV54(v) === needle)) || null;
  };
  const openItemLookupV54 = async (raw, preferredKey="") => {
    if(!window.SDVLookupV46) await loadLazyDataV67("lookup");
    const row = lookupRowV54(raw);
    const key = preferredKey || row?.file || itemFileZhV26(raw) || row?.name || raw;
    pushNavV62();
    setItemUsageQueryV42(row?.name || raw); setItemUsageSelectedV42(key); setItemUsageFilterV65(""); setFishViewV4("items"); setTab("fishing");
    requestAnimationFrame(()=>requestAnimationFrame(()=>{const target=document.getElementById("lookup-detail-v62"); if(target)target.scrollIntoView({block:"start",behavior:"auto"}); else window.scrollTo({top:0,left:0,behavior:"auto"});}));
  };

  const openSocialNpcV55 = npc => {
    const group=NPC_GROUPS.find(g=>g.list.includes(npc));
    pushNavV62();
    if(group)setSocialGroup(group.id); setExpandedNPC(npc); setTab("people");
    requestAnimationFrame(()=>requestAnimationFrame(()=>{const target=document.getElementById(`npc-card-${npc}`); if(target)target.scrollIntoView({block:"start",behavior:"auto"}); else window.scrollTo({top:0,left:0,behavior:"auto"});}));
  };

  /* ================= v88 全域搜尋＋收藏 ================= */
  /* v89: 物品 → 誰最愛／喜歡（反查社交送禮資料，單一來源不複製清單） */
  const giftFansV89 = file => {
    const social=window.SDVSocialV50?.byZh||{};
    const loves=[],likes=[];
    NPC_GROUPS.forEach(g=>g.list.forEach(n=>{const e=social[n];if(!e)return;if((e.loves||[]).includes(file))loves.push(n);else if((e.likes||[]).includes(file))likes.push(n)}));
    return {loves,likes};
  };
  const favListV88 = Array.isArray(extrasState.favV88) ? extrasState.favV88 : [];
  const isFavV88 = (k,id) => favListV88.some(f => f.k===k && f.id===id);
  const toggleFavV88 = e => updateExtras({ favV88: isFavV88(e.k,e.id) ? favListV88.filter(f=>!(f.k===e.k&&f.id===e.id)) : [...favListV88,{k:e.k,id:e.id,label:e.label,sub:e.sub,icon:e.icon,go:e.go}] });
  const goToWorldV88 = (nodeId, sel=null) => {
    if(!WORLD_NAV_V87().nodes[nodeId])return;
    pushNavV62();
    setFishViewV4("world");
    setWorldStackV87(worldPathToV87(nodeId));
    setWorldSelV87(sel?{kind:sel.kind,id:sel.id}:null);
    if(sel?.kind==="spot"&&sel.areaId)setFishAreaV4(sel.areaId);
    setTab("fishing");
    requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:"auto"}));
  };
  const runJumpV88 = go => {
    setSearchOpenV88(false);
    if(!go)return;
    if(go.t==="item"){openItemLookupV54(go.n,go.f);return}
    if(go.t==="npc"){openSocialNpcV55(go.n);return}
    if(go.t==="world"){goToWorldV88(go.node,go.sel||null);return}
    if(go.t==="act"){
      if(go.act==="bundles"){openTownRepairV69("");return}
      pushNavV62();
      if(go.act==="overview")setTab("overview");
      else if(go.act==="wardrobe")setTab("wardrobe");
      else if(go.act==="notes")setTab("notes");
      else {setTab("data");setDataSection(go.act)}
      window.scrollTo({top:0,left:0,behavior:"auto"});
    }
  };
  const buildSearchIndexV88 = async () => {
    if(!window.SDVLookupV46) await loadLazyDataV67("lookup");
    if(!window.SDVWorldV70) await loadLazyDataV67("world");
    const idx=[];
    const push=(k,id,label,sub,icon,go,keys,extra)=>idx.push({k,id,label,sub,icon,go,keys:[...new Set(keys.filter(Boolean).map(normalizeSearchV88).filter(x=>x.length))],...(extra||{})});
    SEARCH_ALIAS_TABLE_V88.forEach(a=>push("alias",a.id,a.label,a.sub,a.icon,{t:"act",act:a.act},[...a.names,a.label]));
    const social=window.SDVSocialV50?.byZh||{};
    NPC_GROUPS.forEach(g=>g.list.forEach(n=>{const en=social[n]?.english||"";push("npc",n,n,g.name,en||"Friendship 101",{t:"npc",n},[n,NPC_WIKI[n],en,...(NPC_LEGACY_V95[n]||[])])}));
    const NAV=WORLD_NAV_V87();
    const worldDb=window.SDVWorldV70;
    const areas=(typeof FISH_AREAS_V4!=="undefined"?FISH_AREAS_V4:[]);
    const fishSpots={};
    areas.forEach(a=>{
      const nodeId=NAV.areaNode[a.id]; const node=NAV.nodes[nodeId]; if(!node)return;
      const spot=(node.spots||[]).find(s=>s.fishAreaId===a.id); if(!spot)return;
      (a.fish||[]).forEach(i=>{const f=FISH_ICON_FILES[i];if(!f)return;(fishSpots[f]=fishSpots[f]||[]).push({label:`${node.name}·${a.sub}`,go:{t:"world",node:nodeId,sel:{kind:"spot",id:spot.id,areaId:a.id}}})});
    });
    const fishSet=new Set(FISH_ICON_FILES.filter(Boolean));
    COLLECTIONS.fish.items.forEach((n,i)=>{const f=FISH_ICON_FILES[i];if(!n||!f)return;push("fish",f,switchNameV47(n,f),"魚類",f,{t:"item",n,f},[n,f,switchNameV47(n,f)],{spots:(fishSpots[f]||[]).slice(0,2)})});
    (window.SDVLookupV46?.items||[]).forEach(r=>{if(!r?.file||fishSet.has(r.file))return;push("item",r.file,switchNameV47(r.name,r.file),r.category||"物品",r.file,{t:"item",n:r.name,f:r.file},[r.name,r.zh,r.file,switchNameV47(r.name,r.file),...(r.aliases||[])])});
    /* v90: 商店販售但沒有物品卡的東西（動物、釣竿、方尖碑等 39 項）→ 可搜、跳到販售地點 */
    const lookupFileSetV90=new Set((window.SDVLookupV46?.items||[]).map(r=>r.file));
    const shopPinV90={};
    Object.values(NAV.nodes||{}).forEach(node=>(node.places||[]).forEach(p=>{
      const dbp=p.worldPlaceId?(worldDb?.places||[]).find(x=>x.id===p.worldPlaceId):null;
      const ownerPerson=dbp?.ownerId?(worldDb?.people||{})[dbp.ownerId]:null;
      [...(ownerPerson?.socialKeys||[]),...(p.npcs||[])].forEach(k=>{if(!shopPinV90[k])shopPinV90[k]={node:node.id,pin:p.id,label:p.label}});
    }));
    const SHOP_ITEM_ALIAS_V90={"Duck":["鸭子"],"Rabbit":["兔子"],"Goat":["山羊"],"Sheep":["绵羊"],"Pig":["猪"]};
    const seenShopV90=new Set();
    Object.entries(social).forEach(([n,e])=>{
      const pin=shopPinV90[n];if(!pin)return;
      (e.shop?.items||[]).forEach(it=>{
        const raw=String(it.name||"").replace(/ Recipe$/,"");
        if(!raw||lookupFileSetV90.has(raw)||fishSet.has(raw)||seenShopV90.has(raw))return;
        seenShopV90.add(raw);
        push("item",`shop:${raw}`,switchNameV47(raw,raw),`${pin.label} 販售`,raw,{t:"world",node:pin.node,sel:{kind:"place",id:pin.pin}},[raw,switchNameV47(raw,raw),...(SHOP_ITEM_ALIAS_V90[raw]||[])]);
      });
    });
    Object.values(NAV.nodes||{}).forEach(node=>{
      push("place",node.id,node.name,"區域地圖",node.mapKey||"Map",{t:"world",node:node.id},[node.name,node.id]);
      (node.places||[]).forEach(p=>{
        const dbp=p.worldPlaceId?(worldDb?.places||[]).find(x=>x.id===p.worldPlaceId):null;
        push("place",`${node.id}:${p.id}`,p.label,node.name,dbp?.icon||"Map",{t:"world",node:node.id,sel:{kind:"place",id:p.id}},[p.label,...(dbp?.aliases||[])]);
      });
      (node.spots||[]).forEach(s=>{
        const area=areas.find(a=>a.id===s.fishAreaId);
        push("place",`${node.id}:${s.id}`,`${s.label}（釣點）`,node.name,area?.icon||"Bait",{t:"world",node:node.id,sel:{kind:"spot",id:s.id,areaId:s.fishAreaId}},[s.label,area?.sub]);
      });
    });
    setSearchIndexV88(idx);
  };
  const openSearchV88 = () => { setSearchOpenV88(true); setSearchQueryV88(""); if(!searchIndexV88) buildSearchIndexV88(); };
  const searchResultsV88 = q => {
    const nq=normalizeSearchV88(q);
    if(!nq||!searchIndexV88)return [];
    const scored=[];
    searchIndexV88.forEach(e=>{let best=99;for(const key of e.keys){if(key===nq){best=0;break}if(key.startsWith(nq))best=Math.min(best,1);else if(key.includes(nq))best=Math.min(best,2)}if(best<99)scored.push([best,e])});
    scored.sort((a,b)=>a[0]-b[0]);
    const cap={alias:8,npc:6,fish:6,item:10,place:8},cnt={},out=[];
    for(const [,e] of scored){cnt[e.k]=(cnt[e.k]||0)+1;if(cnt[e.k]<=cap[e.k])out.push(e);if(out.length>=28)break}
    return out;
  };
  const SEARCH_KIND_TAG_V88={alias:"進度",npc:"人物",fish:"魚",item:"物品",place:"地點"};
  const renderSearchRowV88 = e => <div key={`${e.k}-${e.id}`} style={{border:`1px solid ${C.line}`,background:C.paper,borderRadius:9,padding:"6px 7px"}}>
    <div style={{display:"grid",gridTemplateColumns:"34px minmax(0,1fr) 30px",gap:7,alignItems:"center"}}>
      <GameIcon file={e.icon} size={32}/>
      <button onClick={()=>runJumpV88(e.go)} style={{textAlign:"left",background:"transparent",border:0,padding:0,minWidth:0,cursor:"pointer"}}>
        <b style={{display:"block",fontSize:10.5,color:C.ink,lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.label}</b>
        <span style={{display:"block",fontSize:7.4,color:C.muted,marginTop:2}}>{SEARCH_KIND_TAG_V88[e.k]||""}{e.sub?` · ${e.sub}`:""}</span>{e.k==="npc"&&(()=>{const S=window.SDVNpcScheduleV91;if(!S?.resolve||!S.npcs[e.id])return null;const day=Number(data.base.day||1);const fest=dayCalendarItems(day).find(x=>x.type==="festival");const fmt=t=>{const h=Math.floor(t/100),m=t%100;return `${h>=24?h-24:h}:${String(m).padStart(2,"0")}`};if(fest)return <span style={{display:"block",fontSize:7.2,color:C.orange,fontWeight:900,marginTop:2}}>🎪 {fest.text}{festVenueLabelV94(fest.key)?`・${festVenueLabelV94(fest.key)}`:""}</span>;const r=S.resolve(e.id,{season:data.base.season,day,rain:todayWeatherV69==="雨",...progressFlagsV92(data)});if(!r)return null;let txt;if(slotSelV93){const cur=(()=>{let c=r.entries[0][1];for(const sg of r.entries){if(sg[0]<=slotSelV93.rep)c=sg[1];else break}return c})();txt=`${slotSelV93.label}：${cur.zh}`}else{txt=r.entries.slice(0,3).map(sg=>`${fmt(sg[0])} ${sg[1].zh}`).join(" › ")+(r.entries.length>3?" › …":"")}return <span style={{display:"block",fontSize:7.2,color:C.brown,fontWeight:900,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📍 {txt}</span>})()}
      </button>
      <button aria-label={isFavV88(e.k,e.id)?"取消收藏":"加入收藏"} onClick={()=>toggleFavV88(e)} style={{border:0,background:"transparent",fontSize:16,lineHeight:1,color:isFavV88(e.k,e.id)?"#E8A814":C.line,cursor:"pointer",padding:"4px 2px"}}>{isFavV88(e.k,e.id)?"★":"☆"}</button>
    </div>
    {e.spots?.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:5,paddingLeft:41}}>{e.spots.map((s,i)=><button key={i} onClick={()=>runJumpV88(s.go)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"3px 6px",fontSize:7,fontWeight:900,color:C.brown,cursor:"pointer"}}>🎣 {s.label}</button>)}</div>}
  </div>;
  const renderSearchOverlayV88 = () => {
    const results=searchResultsV88(searchQueryV88);
    return <div id="search-overlay-v88" style={{position:"fixed",inset:0,zIndex:60,background:C.bg,display:"flex",flexDirection:"column"}}>
      <div style={{background:C.darkBrown,padding:"calc(8px + env(safe-area-inset-top)) 12px 8px",display:"flex",alignItems:"center",gap:8}}>
        <input autoFocus value={searchQueryV88} onChange={e=>setSearchQueryV88(e.target.value)} onKeyDown={e=>{if(e.key==="Escape")setSearchOpenV88(false)}} placeholder="搜人物、物品、魚、地點、進度…" style={{flex:1,minWidth:0,border:0,borderRadius:9,padding:"9px 11px",fontSize:12,background:"#FFF8E2",color:C.ink,outline:"none"}}/>
        <button onClick={()=>setSearchOpenV88(false)} style={{border:0,background:"transparent",color:"#FFE39A",fontSize:11,fontWeight:950,cursor:"pointer",whiteSpace:"nowrap"}}>關閉</button>
      </div>
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"9px 12px calc(16px + env(safe-area-inset-bottom))",maxWidth:680,width:"100%",margin:"0 auto"}}>
        {!searchIndexV88&&<div style={{textAlign:"center",fontSize:9.5,color:C.muted,padding:22}}>搜尋索引載入中…</div>}
        {searchIndexV88&&!searchQueryV88.trim()&&<div>
          {favListV88.length>0&&<div style={{marginBottom:9}}><div style={{fontSize:8.5,fontWeight:950,color:C.muted,marginBottom:5}}>⭐ 常用／正在追</div><div style={{display:"grid",gap:5}}>{favListV88.map(f=>renderSearchRowV88({...f,spots:null}))}</div></div>}
          <div style={{textAlign:"center",fontSize:8.6,color:C.muted,padding:"14px 8px",lineHeight:1.6}}>直接輸入：繁／簡／英文、Switch 官方名都可以。<br/>例如「鲶鱼」「鯰魚」「catfish」「海莉」「溫室」。</div>
        </div>}
        {searchIndexV88&&searchQueryV88.trim()&&<div style={{display:"grid",gap:5}}>
          {results.map(renderSearchRowV88)}
          {!results.length&&<div style={{textAlign:"center",fontSize:9.5,color:C.muted,padding:22}}>沒有符合的結果。</div>}
        </div>}
      </div>
    </div>;
  };
  const renderFavStripV88 = () => {
    if(!favListV88.length)return null;
    return <Card style={{padding:8,marginTop:7}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
        <b style={{fontSize:10.5,color:C.darkBrown,flex:1}}>⭐ 常用／正在追</b>
        <button onClick={()=>setFavEditV88(!favEditV88)} style={{border:0,background:"transparent",fontSize:8.2,color:favEditV88?C.red:C.blue,fontWeight:950,cursor:"pointer"}}>{favEditV88?"完成":"編輯"}</button>
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{favListV88.map(f=><button key={`${f.k}-${f.id}`} onClick={()=>favEditV88?toggleFavV88(f):runJumpV88(f.go)} style={{border:`1.5px solid ${favEditV88?C.red:C.line}`,background:favEditV88?"#FBE4DE":C.cream,borderRadius:9,padding:"4px 8px 4px 4px",display:"inline-flex",alignItems:"center",gap:4,fontSize:8.4,fontWeight:950,color:favEditV88?C.red:C.brown,cursor:"pointer"}}><GameIcon file={f.icon} size={22}/>{f.label}{favEditV88?" ×":""}</button>)}</div>
    </Card>;
  };

  const SimpleItemInfoV62 = ({name,file="",info=""}) => {
    const row=lookupRowV54(name)||lookupRowV54(file);
    const resolvedFile=row?.file||file||itemFileZhV26(name)||name;
    const display=switchNameV47(row?.name||name,resolvedFile);
    const brief=info||row?.uses?.[0]||row?.sources?.[0]||"點這張卡查看完整用途與取得方式。";
    const canLookup=Boolean(row);
    return <button type="button" disabled={!canLookup} onClick={()=>canLookup&&openItemLookupV54(row?.name||name,row?.file||resolvedFile)} style={{width:"100%",marginTop:7,border:`1.5px solid ${canLookup?C.orange:C.line}`,background:"#FFF8E2",borderRadius:10,padding:"8px 9px",display:"grid",gridTemplateColumns:"48px minmax(0,1fr) auto",gap:8,alignItems:"center",textAlign:"left",cursor:canLookup?"pointer":"default",opacity:canLookup?1:.82}}><GameIcon file={resolvedFile} size={46}/><span style={{minWidth:0}}><b style={{display:"block",fontSize:13,color:C.darkBrown}}>{display}</b><span style={{display:"block",fontSize:9.2,color:C.muted,lineHeight:1.35,marginTop:2}}>{brief}</span>{canLookup&&<span style={{display:"block",fontSize:7.5,color:C.orange,fontWeight:950,marginTop:3}}>點卡片查看完整物品資料</span>}</span><span style={{fontSize:16,color:C.orange,fontWeight:950}}>{canLookup?"›":""}</span></button>;
  };

  const roomDone = (room) => roomDoneFromStateV68(data,room.id);
  const roomExplicitDoneV68 = (room) => roomExplicitDoneFromStateV68(data,room.id);
  const toggleRoom = (id, done) => update({ bundleDone: done ? [...new Set([...(data.bundleDone||[]), id])] : (data.bundleDone||[]).filter(x => x !== id) });
  const roomProgress = () => {
    const done = BUNDLE_ROOMS.reduce((s, r) => s + (roomDone(r) ? r.bundles.length : r.bundles.filter(b => {
      const items=bundleItemsFromStateV68(data,b);
      const got = (data.bundleItems?.[b.id] || []).filter(x=>items.includes(x)).length;
      return got >= bundleNeedFromStateV68(data,b);
    }).length), 0);
    const total = BUNDLE_ROOMS.reduce((s, r) => s + r.bundles.length, 0);
    return { done, total };
  };

  const totalAnimals = Object.values(data.animals || {}).reduce((a, b) => a + (Number(b) || 0), 0);
  const skillTotal = Object.values(data.skills || {}).reduce((a, b) => a + (Number(b) || 0), 0);
  const rp = roomProgress();

  const currentCalendar = CALENDAR_DATA[data.base.season] || CALENDAR_DATA.春;
  const dayCalendarItems = (day) => {
    const out = [];
    if (currentCalendar.festivals[day]) out.push({type:"festival", text:currentCalendar.festivals[day], key:currentCalendar.festivals[day]});
    if (currentCalendar.birthdays[day] && !(data.base.season === "春" && day === 4 && data.base.year < 2)) out.push({type:"birthday", text:`${currentCalendar.birthdays[day]}生日`, npc:currentCalendar.birthdays[day]});
    if (currentCalendar.other[day]) out.push({type:"other", text:currentCalendar.other[day]});
    if (data.base.season === "夏" && day === 3 && data.base.year === 1) out.push({type:"other", text:"地震後鐵路／溫泉區開放"});
    return out;
  };

  const todayDateKeyV69 = () => `Y${Number(data.base?.year||1)}-${data.base?.season||"春"}-${Number(data.base?.day||1)}`;
  const todayStateV69 = data.todayV69&&typeof data.todayV69==="object"?data.todayV69:{weatherByDate:{},hiddenByDate:{},pinnedIds:[]};
  const todayKeyV69 = todayDateKeyV69();
  const todayWeatherV69 = todayStateV69.weatherByDate?.[todayKeyV69]||"";
  const todayHiddenIdsV69 = Array.isArray(todayStateV69.hiddenByDate?.[todayKeyV69])?todayStateV69.hiddenByDate[todayKeyV69]:[];
  const todayPinnedIdsV69 = Array.isArray(todayStateV69.pinnedIds)?todayStateV69.pinnedIds:[];
  const updateTodayStateV69 = updater => setData(d=>{
    const prev=d.todayV69&&typeof d.todayV69==="object"?d.todayV69:{};
    const base={weatherByDate:{...(prev.weatherByDate||{})},hiddenByDate:{...(prev.hiddenByDate||{})},pinnedIds:Array.isArray(prev.pinnedIds)?[...prev.pinnedIds]:[]};
    return {...d,todayV69:updater(base)};
  });
  const setTodayWeatherV69 = value => updateTodayStateV69(v=>{
    if(value)v.weatherByDate[todayKeyV69]=value;else delete v.weatherByDate[todayKeyV69];
    return v;
  });
  const hideTodayHintV69 = id => updateTodayStateV69(v=>{v.hiddenByDate[todayKeyV69]=[...new Set([...(v.hiddenByDate[todayKeyV69]||[]),id])];return v});
  const restoreTodayHintsV69 = () => updateTodayStateV69(v=>{delete v.hiddenByDate[todayKeyV69];return v});
  const toggleTodayPinV69 = id => updateTodayStateV69(v=>{v.pinnedIds=v.pinnedIds.includes(id)?v.pinnedIds.filter(x=>x!==id):[...v.pinnedIds,id];return v});
  const openCalendarV69 = () => requestAnimationFrame(()=>document.getElementById("game-calendar-v69")?.scrollIntoView({block:"start",behavior:"smooth"}));
  const openTownRepairV69 = roomId => {
    pushNavV62();setTab("data");setDataSection("bundles");setBundleRoom(roomId||"");setBundleEditV28(null);
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:"auto"})));
  };
  const openFishHintV69 = (weather,areaId="town") => {
    const NAV=WORLD_NAV_V87();
    const nodeId=NAV.areaNode[areaId]||NAV.root;
    const spot=(NAV.nodes[nodeId]?.spots||[]).find(s=>s.fishAreaId===areaId)||null;
    pushNavV62();setFishViewV4("world");
    setWorldStackV87(worldPathToV87(nodeId));
    setWorldSelV87(spot?{kind:"spot",id:spot.id}:null);
    setWorldQuickV71("");setWorldFishQueryV71("");
    setFishAreaV4(areaId);setFishSeasonsV42([data.base.season]);setFishWeathersV42(weather?[weather]:[]);setFishTimesV42([]);setTab("fishing");
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:"auto"})));
  };
  const todayFishRowsV69 = weather => {
    const caught=new Set(data.collections?.fish||[]);
    const skip=new Set([21,22,26,68,69,70]);
    const rows=new Map();
    const areas=FISH_AREA_GROUPS_V4.main.ids.map(id=>FISH_AREAS_V4.find(a=>a.id===id)).filter(Boolean);
    areas.forEach(area=>(area.fish||[]).forEach(i=>{
      if(skip.has(i))return;
      const name=COLLECTIONS.fish.items[i];
      if(!name||caught.has(name)||!fishAvailableV4(area,i,data.base.season,weather,null,data.base.day))return;
      if(!rows.has(i))rows.set(i,{i,name,file:FISH_ICON_FILES[i],areaId:area.id,areaName:`${area.name} · ${area.sub}`,rule:fishRuleV4(i)});
    }));
    return [...rows.values()];
  };
  const todayFishNamesV69 = rows => rows.slice(0,4).map(x=>switchNameV47(x.name,x.file)).join("、")+(rows.length>4?"…":"");
  const buildTodayHintsV69 = () => {
    const hints=[];let order=0;
    const add=h=>hints.push({...h,order:order++});
    
    if(Number(data.base.day||1)<28){
      const tomorrow=dayCalendarItems(Number(data.base.day||1)+1).find(x=>x.type==="festival");
      const tb=dayCalendarItems(Number(data.base.day||1)+1).find(x=>x.type==="birthday");
      if(tb)add({id:`tomorrow-birthday:${tb.npc}`,kind:"birthday",inline:true,npc:tb.npc,priority:1,file:NPC_ICON_FILES[tb.npc]||"Friendship 101",reason:"明天",title:`明天是 ${tb.npc} 生日`,body:"今天可以先備禮，點開看喜愛禮物。",action:"查看人物",run:()=>openSocialNpcV55(tb.npc)});
      if(tomorrow){const g=FESTIVAL_GUIDE_V26[tomorrow.key];add({id:`tomorrow-festival:${tomorrow.key}`,kind:"festival",guide:g,priority:1,file:"Calendar",reason:"明天",title:`明天是 ${tomorrow.text}`,body:g?.items?.length?"今天可以先確認節日需要的物品或安排。":"明天有節日，今天可先留意行程安排。",action:"前往日曆",run:openCalendarV69});}
    }
    (()=>{const CD=window.SDVCropsV96;if(!CD)return;const season=data.base.season,day=Number(data.base.day||1);
      if(season==="冬")return;
      const list=Object.entries(CD.crops).filter(([en,c])=>!c.exclude&&c.seasons.includes(season)).map(([en,c])=>({en,zh:c.zh,plan:cropPlanV96(c,{season,day})})).filter(x=>x.plan.kind==="ok"&&x.plan.okToday).sort((a,b)=>a.plan.daysLeft-b.plan.daysLeft);
      if(!list.length)return;
      add({id:"crops-deadline",kind:"crops",inline:true,priority:1,file:"Parsnip",reason:"今天限定",title:`還來得及種（${season}${day}）`,list:list.slice(0,10).map(x=>({en:x.en,zh:x.zh,last:x.plan.lastPlant})),more:Math.max(0,list.length-10)});
    })();
    (()=>{const wd=(Number(data.base.day||1)-1)%7;if(wd!==4&&wd!==6)return;
      add({id:"travel-cart",kind:"calendar",detail:"",priority:1,file:"Traveling Cart",reason:"今天限定",title:"🛒 旅行貨車營業中（煤礦森林）",body:"週五、週日限定，隨機販售稀有商品與外地種子。",action:"前往旅行貨車",run:()=>goToWorldV88("forest",{kind:"place",id:"cart"})});
    })();
    const weatherBranches=todayWeatherV69?[todayWeatherV69]:["晴","雨"];
    weatherBranches.forEach(weather=>{
      const rows=todayFishRowsV69(weather);
      if(!rows.length)return;
      const icon=weather==="雨"?"🌧️":"☀️";
      add({id:`fish-weather:${weather}`,kind:"fish",rows,weather,priority:1,file:"Sonar Bobber",reason:todayWeatherV69?`今日${weather}天`:`天氣未記錄 · 如果${weather}天`,title:`${icon} ${weather}天可補 ${rows.length} 種未收集魚`,body:`例：${todayFishNamesV69(rows)}。點開可直接看完整清單、地點與時段。`,action:"前往找魚篩選",run:()=>openFishHintV69(weather,rows[0].areaId)});
    });
    if(Number(data.base.day||1)>=25){
      const current=data.base.season;const next=SEASONS[(SEASONS.indexOf(current)+1)%SEASONS.length];
      const union=new Map([...todayFishRowsV69("晴"),...todayFishRowsV69("雨")].map(x=>[x.i,x]));
      const rows=[...union.values()].filter(x=>(x.rule?.s||[]).includes(current)&&!(x.rule?.s||[]).includes(next));
      if(rows.length)add({id:`season-fish:${current}`,kind:"fish",rows,weather:"",priority:2,file:"Calendar",reason:"本季快結束",title:`本季剩 ${29-Number(data.base.day||1)} 天，還有 ${rows.length} 種魚快換季`,body:`尚未收集：${todayFishNamesV69(rows)}。點開可直接看完整清單。`,action:"前往當季找魚",run:()=>openFishHintV69("",rows[0].areaId)});
    }
    const route=currentRouteFromStateV68(data);
    if(route==="cc"){
      const seasonPrefix={spring:"春",summer:"夏",fall:"秋",winter:"冬"};
      const gaps=[];
      BUNDLE_ROOMS.forEach(room=>{
        if(roomDoneFromStateV68(data,room.id))return;
        room.bundles.forEach(bundle=>{
          const items=bundleItemsFromStateV68(data,bundle);const got=(data.bundleItems?.[bundle.id]||[]).filter(x=>items.includes(x));const need=bundleNeedFromStateV68(data,bundle);
          if(need-got.length!==1)return;
          const prefix=Object.keys(seasonPrefix).find(k=>bundle.id.startsWith(k+"_"));
          const seasonMatch=!prefix||seasonPrefix[prefix]===data.base.season;
          gaps.push({room,bundle,items,got,seasonMatch});
        });
      });
      gaps.sort((a,b)=>Number(b.seasonMatch)-Number(a.seasonMatch));
      gaps.slice(0,2).forEach(g=>{const options=g.items.filter(x=>!g.got.includes(x));const name=data.bundleNameV28?.[g.bundle.id]||g.bundle.name;add({id:`bundle-gap:${g.bundle.id}`,kind:"bundle",options,roomName:g.room.name,bundleName:name,gotCount:g.got.length,needCount:bundleNeedFromStateV68(data,g.bundle),priority:g.seasonMatch?2:3,file:"Golden Scroll",reason:"現在可推進 · 只差 1 格",title:`${g.room.name} · ${name}`,body:`還差 1 格${options.length?`；候選：${options.slice(0,3).map(x=>switchNameV47(x,itemFileZhV26(x))).join("、")}${options.length>3?"…":""}`:""}。點開可看完整候選。`,action:"前往收集包",run:()=>openTownRepairV69(g.room.id)});});
    }else if(route==="joja"&&data.jojaMemberV28){
      const done=new Set(data.jojaProjectsV28||[]);
      const project=JOJA_PROJECTS_V28.find(j=>!done.has(j.id)&&Number(data.base?.money||0)>=j.cost);
      if(project)add({id:`joja-ready:${project.id}`,kind:"joja",project,priority:3,file:"Joja Cola",reason:"現在可推進",title:`Joja：${project.name}工程`,body:`目前記錄的金錢足夠支付 ${project.cost.toLocaleString()}g；點開可看目前金錢與完成後餘額。`,action:"前往 Joja",run:()=>openTownRepairV69("")});
    }
    const hidden=new Set(todayHiddenIdsV69),pinned=new Set(todayPinnedIdsV69);
    return hints.filter(h=>!hidden.has(h.id)).sort((a,b)=>a.priority-b.priority||Number(pinned.has(b.id))-Number(pinned.has(a.id))||a.order-b.order).slice(0,6);
  };
  const renderTodayDetailV69 = h => {
    if(h.kind==="fish"){
      return <div style={{display:"grid",gap:4}}>{(h.rows||[]).map(row=><div key={`${h.id}-${row.i}`} style={{display:"grid",gridTemplateColumns:"30px minmax(0,1fr) auto",gap:6,alignItems:"center",padding:"5px 6px",border:`1px solid ${C.line}`,borderRadius:8,background:"#FFFDF5"}}><GameIcon file={row.file} size={27}/><div style={{minWidth:0}}><b style={{display:"block",fontSize:9,color:C.ink}}>{switchNameV47(row.name,row.file)}</b><span style={{display:"block",fontSize:7.2,color:C.muted,lineHeight:1.25,marginTop:1}}>{row.areaName}</span></div><span style={{fontSize:7.2,color:C.brown,fontWeight:900,textAlign:"right",whiteSpace:"nowrap"}}>{formatFishTimeV4(row.rule)}</span></div>)}</div>;
    }
    if(h.kind==="birthday"){
      const loves=NPC_GIFTS[h.npc]?.love||[];
      return loves.length?<><div style={{fontSize:8,color:C.muted,fontWeight:900,marginBottom:5}}>喜愛禮物</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4}}>{loves.map(name=>{const file=itemFileZhV26(name)||name;return <div key={name} style={{border:`1px solid ${C.line}`,borderRadius:8,padding:"4px 2px",textAlign:"center",background:"#FFFDF5"}}><GameIcon file={file} size={27}/><div style={{fontSize:7,fontWeight:900,color:C.ink,lineHeight:1.05,marginTop:2}}>{switchNameV47(name,file)}</div></div>})}</div></>:<div style={{fontSize:8,color:C.muted}}>目前手帳沒有可直接顯示的喜愛禮物資料。</div>;
    }
    if(h.kind==="crops"){
      return <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{h.list.map(x=><button key={x.en} onClick={()=>openItemLookupV54(x.zh,x.en)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"2px 7px",fontSize:7.4,fontWeight:900,color:C.brown}}>{x.zh} 至{x.last} ›</button>)}{h.more>0&&<span style={{fontSize:7,color:C.muted,alignSelf:"center"}}>＋{h.more}</span>}<span style={{flexBasis:"100%",fontSize:6.8,color:C.muted}}>無肥料基準；溫室不受季節限制。</span></div>;
    }
    if(h.kind==="festival"){
      const g=h.guide;
      const venueH=festVenueLabelV94((h.id||"").split(":")[1]);
      return <div style={{display:"grid",gap:5}}>{venueH&&<div style={{fontSize:8.8,fontWeight:950,color:C.brown}}>📍 會場：{venueH}</div>}{g?.desc&&<div style={{fontSize:8.4,color:C.ink,lineHeight:1.4}}>{g.desc}</div>}{g?.items?.length>0&&<><div style={{fontSize:8,color:C.muted,fontWeight:900}}>相關物品／準備</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4}}>{g.items.map(([file,name])=><div key={`${file}-${name}`} style={{border:`1px solid ${C.line}`,borderRadius:8,padding:"4px 2px",textAlign:"center",background:"#FFFDF5"}}><GameIcon file={file} size={27}/><div style={{fontSize:7,fontWeight:900,color:C.ink,lineHeight:1.05,marginTop:2}}>{name}</div></div>)}</div></>}</div>;
    }
    if(h.kind==="bundle"){
      return <><div style={{fontSize:8.2,color:C.muted,marginBottom:5}}>完成 {h.gotCount}/{h.needCount}，目前只差 1 格；以下都是可補上的候選。</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4}}>{(h.options||[]).map(name=>{const file=itemFileZhV26(name)||name;return <div key={name} style={{border:`1px solid ${C.line}`,borderRadius:8,padding:"4px 2px",textAlign:"center",background:"#FFFDF5"}}><GameIcon file={file} size={27}/><div style={{fontSize:7,fontWeight:900,color:C.ink,lineHeight:1.05,marginTop:2}}>{switchNameV47(name,file)}</div></div>})}</div></>;
    }
    if(h.kind==="joja"){
      const cost=Number(h.project?.cost||0),money=Number(data.base?.money||0);
      return <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5}}>{[["工程費用",`${cost.toLocaleString()}g`],["目前金錢",`${money.toLocaleString()}g`],["完成後餘額",`${Math.max(0,money-cost).toLocaleString()}g`]].map(([k,v])=><div key={k} style={{padding:"6px 4px",border:`1px solid ${C.line}`,borderRadius:8,background:"#FFFDF5",textAlign:"center"}}><div style={{fontSize:6.8,color:C.muted}}>{k}</div><b style={{display:"block",fontSize:8.5,color:C.brown,marginTop:1}}>{v}</b></div>)}</div>;
    }
    return <div style={{fontSize:8.3,color:C.ink,lineHeight:1.45}}>{h.detail||h.body}</div>;
  };
  const renderTodayV69 = () => {
    const hints=buildTodayHintsV69();const pinned=new Set(todayPinnedIdsV69);
    return <>
      <SectionTitle icon="game:Calendar">今天可以做什麼</SectionTitle>
      <Card style={{padding:8,background:"#FFF4D8"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><b style={{fontSize:10.5,color:C.darkBrown}}>第 {data.base.year} 年 · {data.base.season} {data.base.day} 日</b><span style={{fontSize:7.5,color:C.muted}}>只提醒會錯過或有明確理由現在可推進的事</span></div>
        
        {!todayWeatherV69&&<div style={{fontSize:7.7,color:C.muted,lineHeight:1.35,marginTop:4}}>未記錄天氣時，會同時列出晴天／雨天兩套天氣限定提示，不會把內容藏掉。</div>}
      </Card>
      <div style={{display:"grid",gap:6,marginTop:7}}>{hints.map(h=>{const isPinned=pinned.has(h.id),expanded=todayExpandedV69===h.id;return <Card key={h.id} style={{padding:8,borderColor:isPinned?C.gold:C.line,background:isPinned?"#FFF8DA":C.paper}}>
        <div role="button" tabIndex={0} aria-expanded={expanded} onClick={()=>{if(!h.inline)setTodayExpandedV69(expanded?"":h.id)}} style={{width:"100%",border:0,background:"transparent",padding:0,textAlign:"left",cursor:h.inline?"default":"pointer",color:"inherit"}}><div style={{display:"grid",gridTemplateColumns:"36px minmax(0,1fr) 20px",gap:7,alignItems:"start"}}><GameIcon file={h.file} size={34}/><div style={{minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}><span style={{fontSize:6.8,fontWeight:950,color:C.orange,background:"#FFF0C8",borderRadius:7,padding:"2px 5px"}}>{h.reason}</span>{isPinned&&<span style={{fontSize:6.8,fontWeight:950,color:C.gold}}>★ 已固定</span>}</div><b style={{display:"block",fontSize:10.8,color:C.darkBrown,lineHeight:1.25,marginTop:3}}>{h.title}</b><div style={{fontSize:8.2,color:C.muted,lineHeight:1.4,marginTop:2}}>{h.body}</div>{h.inline&&<div style={{marginTop:6}}>{renderTodayDetailV69(h)}{h.action&&<div style={{marginTop:6}}><button onClick={e=>{e.stopPropagation();h.run&&h.run()}} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"4px 7px",fontSize:7.7,fontWeight:900,color:C.brown}}>{h.action} ›</button></div>}</div>}{!h.inline&&<div style={{fontSize:7.2,color:C.orange,fontWeight:900,marginTop:3}}>{expanded?"收起詳細內容":"點開看詳細內容"}</div>}</div>{!h.inline&&<span style={{fontSize:15,color:C.muted,fontWeight:950,lineHeight:1.2,textAlign:"center",transform:expanded?"rotate(180deg)":"none"}}>⌄</span>}</div></div>
        {expanded&&!h.inline&&<div style={{marginTop:7,paddingTop:7,borderTop:`1px dashed ${C.line}`}}>{renderTodayDetailV69(h)}<div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center",marginTop:7}}><button onClick={h.run} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"4px 7px",fontSize:7.7,fontWeight:900,color:C.brown}}>{h.action} ›</button><span style={{fontSize:7,color:C.muted}}>需要完整頁面時再前往</span></div></div>}
        <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center",marginTop:6,paddingTop:5,borderTop:`1px dashed ${C.line}`}}><button onClick={()=>toggleTodayPinV69(h.id)} aria-label={isPinned?"取消固定":"固定追蹤"} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"4px 7px",fontSize:8,fontWeight:950,color:isPinned?C.gold:C.muted}}>{isPinned?"★ 固定":"☆ 固定"}</button><button onClick={()=>hideTodayHintV69(h.id)} style={{marginLeft:"auto",border:0,background:"transparent",padding:"4px 2px",fontSize:7.7,fontWeight:900,color:C.muted}}>今天先不管</button></div>
      </Card>})}</div>
      {!hints.length&&<Card style={{marginTop:7,padding:9,textAlign:"center",fontSize:9.5,color:C.muted}}>目前沒有需要特別提醒的當日事項。</Card>}
      {todayHiddenIdsV69.length>0&&<button onClick={restoreTodayHintsV69} style={{marginTop:5,border:0,background:"transparent",padding:"3px 0",fontSize:7.8,fontWeight:900,color:C.blue}}>恢復今天隱藏的 {todayHiddenIdsV69.length} 項</button>}
    </>;
  };

  const loadTesseract = async () => {
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
      // v57: the Switch profile screen uses several different brown/orange backgrounds.
      // A fixed 165 cutoff destroys the HUD and pixel-font strokes, so each crop can
      // now provide a calibrated luminance cutoff (boolean true keeps the old default).
      const cutoff = typeof threshold === "number" ? threshold : 165;
      const im = ctx.getImageData(0,0,canvas.width,canvas.height);
      for (let i=0;i<im.data.length;i+=4) {
        const lum = im.data[i]*0.299 + im.data[i+1]*0.587 + im.data[i+2]*0.114;
        const v = lum < cutoff ? 0 : 255;
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
  const parseOcrNumberV58 = (text) => {
    const compact=String(text||"").replace(/\s+/g,"");
    // If OCR sees the trailing 金 as an extra digit, keep the valid comma-grouped
    // number first (e.g. 83,7965 -> 83,796). Fall back to plain digits otherwise.
    const grouped=compact.match(/\d{1,3}(?:,\d{3})+/);
    return grouped ? Number(grouped[0].replace(/,/g,"")) : digitsOnly(compact);
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
      const is16x9V62 = ratio > 1.6 && ratio < 1.9;
      const isPhoto43V62 = ratio > 1.15 && ratio < 1.55;

      const portraitCanvas = document.createElement("canvas");
      portraitCanvas.width = 180; portraitCanvas.height = 240;
      const pctx = portraitCanvas.getContext("2d");
      if (is16x9V62) {
        const sx = img.width * 0.298, sy = img.height * 0.548, sw = img.width * 0.092, sh = img.height * 0.218;
        pctx.drawImage(img, sx, sy, sw, sh, 0, 0, portraitCanvas.width, portraitCanvas.height);
      } else if (isPhoto43V62) {
        const sx = img.width * 0.105, sy = img.height * 0.390, sw = img.width * 0.190, sh = img.height * 0.350;
        pctx.drawImage(img, sx, sy, sw, sh, 0, 0, portraitCanvas.width, portraitCanvas.height);
      } else {
        const sideW = Math.min(img.width, img.height * 0.76), sideH = Math.min(img.height, img.width / 0.76);
        pctx.drawImage(img, (img.width-sideW)/2, (img.height-sideH)/2, sideW, sideH, 0, 0, portraitCanvas.width, portraitCanvas.height);
      }
      const portrait = portraitCanvas.toDataURL("image/jpeg", 0.84);

      if (!is16x9V62 && !isPhoto43V62) {
        setData(d => ({...d, profilePortrait:portrait}));
        setProfileOcrStatus("✓ 已更新角色圖；16:9 原圖與常見橫向 4:3 照片可自動讀取文字，其他比例不會覆蓋現有資料");
        return;
      }

      const Tesseract = await loadTesseract();
      const ocrStageV58 = status => ({
        'loading tesseract core':'載入 OCR 核心',
        'initializing tesseract':'初始化 OCR',
        'loading language traineddata':'下載／讀取語言資料',
        'initializing api':'初始化語言模型',
        'recognizing text':'辨識文字'
      }[status]||status||'處理中');
      const makeWorkerV58 = async (langs,label) => Tesseract.createWorker(langs, 1, {
        logger: m => {
          const pct=Number.isFinite(m?.progress)?` ${Math.round(m.progress*100)}%`:'';
          if(m?.status)setProfileOcrStatus(`${label} · ${ocrStageV58(m.status)}${pct}`);
        }
      });
      const psm = Tesseract.PSM?.SINGLE_LINE || 7;
      const recognizeWithV58 = async (worker, canvas, whitelist = "", mode = psm) => {
        await worker.setParameters({
          tessedit_pageseg_mode: mode,
          preserve_interword_spaces: '1',
          tessedit_char_whitelist: whitelist,
          user_defined_dpi: '300'
        });
        const result = await worker.recognize(canvas);
        return cleanOcrLine(result?.data?.text);
      };
      const recognizeDetailedWithV58 = async (worker, canvas, whitelist = "") => {
        await worker.setParameters({
          tessedit_pageseg_mode: psm,
          preserve_interword_spaces: '1',
          tessedit_char_whitelist: whitelist,
          user_defined_dpi: '300'
        });
        const result = await worker.recognize(canvas);
        return {text:cleanOcrLine(result?.data?.text),confidence:Number(result?.data?.confidence||0)};
      };
      const normalizeSpecials = (text) => cleanOcrLine(text)
        .replace(/\(\s*[Rr]\s*\)|（\s*[Rr]\s*）|\[\s*[Rr]\s*\]/g, "®")
        .replace(/\(\s*[Cc]\s*\)|（\s*[Cc]\s*）|\[\s*[Cc]\s*\]/g, "©")
        .replace(/[•∙⋅*]/g, "·");
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
      const psmWordV59 = Tesseract.PSM?.SINGLE_WORD || 8;
      const rectV62=(standardRect,photoRect)=>isPhoto43V62?photoRect:standardRect;
      const cropV62=(rect,scale,threshold)=>makeCrop(img,rect[0],rect[1],rect[2],rect[3],scale,threshold);
      const farmerRectV62=rectV62([0.285,0.780,0.130,0.060],[0.100,0.730,0.240,0.130]);
      const farmRectV62=rectV62([0.480,0.565,0.180,0.060],[0.500,0.390,0.450,0.110]);
      const moneyHudRectV62=rectV62([0.890,0.205,0.090,0.050],[0.490,0.510,0.470,0.120]);
      const moneyPanelRectV62=rectV62([0.608,0.638,0.064,0.060],[0.490,0.510,0.470,0.120]);
      const incomeRectV62=rectV62([0.575,0.695,0.075,0.060],[0.490,0.600,0.470,0.120]);
      const incomeWideRectV62=rectV62([0.570,0.695,0.120,0.060],[0.470,0.590,0.500,0.140]);
      const yearRectV62=rectV62([0.533,0.768,0.019,0.050],[0.610,0.720,0.080,0.120]);
      const dayRectV62=rectV62([0.615,0.768,0.033,0.050],[0.750,0.720,0.120,0.120]);
      const hudDayRectV62=rectV62([0.882,0.018,0.018,0.050],[0.750,0.720,0.120,0.120]);
      const seasonRectV62=rectV62([0.575,0.758,0.035,0.060],[0.660,0.710,0.140,0.130]);
      const farmerCropColorV61 = cropV62(farmerRectV62,8,false), farmerCropMonoV61 = cropV62(farmerRectV62,8,90);
      const farmCropColorV61 = cropV62(farmRectV62,8,false), farmCropMonoV61 = cropV62(farmRectV62,8,90);
      const hudMoneyColorV59 = cropV62(moneyHudRectV62,8,false), hudMoneyMonoV59 = cropV62(moneyHudRectV62,8,120), panelMoneyV59 = cropV62(moneyPanelRectV62,8,110);
      const incomeColorV59 = cropV62(incomeRectV62,8,false), incomeMonoV59 = cropV62(incomeRectV62,8,110), incomeWideV59 = cropV62(incomeWideRectV62,6,110);
      const yearColorV59 = cropV62(yearRectV62,8,false), yearMonoV59 = cropV62(yearRectV62,8,110);
      const dayColorV59 = cropV62(dayRectV62,8,false), dayMonoV59 = cropV62(dayRectV62,8,110);
      const hudDayColorV60 = cropV62(hudDayRectV62,10,false), hudDayMonoV60 = cropV62(hudDayRectV62,10,120);
      const seasonColorV59 = cropV62(seasonRectV62,10,false), seasonMonoV59 = cropV62(seasonRectV62,10,100);
      const clockCrop = cropV62([0.868,0.139,0.095,0.055],4,90);

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
      const engWorker = await makeWorkerV58('eng','英文／數字辨識');
      const nameWhitelistV61 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789®©·・._@☆★♡♥♪♫~～*+- ";
      const farmerEngResultV61 = await recognizeDetailedWithV58(engWorker, farmerCropMonoV61, nameWhitelistV61);
      const farmEngResultV61 = await recognizeDetailedWithV58(engWorker, farmCropMonoV61, nameWhitelistV61);
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
      const hudDayColorRawV60 = await recognizeWithV58(engWorker, hudDayColorV60, "0123456789", psmWordV59);
      const hudDayMonoRawV60 = await recognizeWithV58(engWorker, hudDayMonoV60, "0123456789", psmWordV59);
      const clockRaw = is16x9V62 ? await recognizeWithV58(engWorker, clockCrop, "0123456789:：") : "";
      await engWorker.terminate();

      const zhWorker = await makeWorkerV58('chi_sim','中文／季節辨識');
      const seasonColorRawV59 = await recognizeWithV58(zhWorker, seasonColorV59, "", psmWordV59);
      const seasonMonoRawV59 = await recognizeWithV58(zhWorker, seasonMonoV59, "", psmWordV59);
      const farmerZhResultV61 = await recognizeDetailedWithV58(zhWorker, farmerCropColorV61, "");
      const farmZhResultV61 = await recognizeDetailedWithV58(zhWorker, farmCropColorV61, "");
      await zhWorker.terminate();

      const moneyRaw = [moneyHudColorRawV59,moneyHudMonoRawV59,moneyPanelRawV59].join(' | ');
      const incomeRaw = [incomeColorRawV59,incomeMonoRawV59,incomeWideRawV59].join(' | ');
      const yearRaw = [yearColorRawV59,yearMonoRawV59].join(' | ');
      const dayRaw = [dayColorRawV59,dayMonoRawV59,hudDayColorRawV60,hudDayMonoRawV60].join(' | ');
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
      const profileDayV60 = numberConsensusV59(digitsOnly(dayColorRawV59), digitsOnly(dayMonoRawV59));
      const hudDayV60 = numberConsensusV59(digitsOnly(hudDayColorRawV60), digitsOnly(hudDayMonoRawV60));
      const dayConsensusV59 = profileDayV60 !== null && hudDayV60 !== null && profileDayV60 === hudDayV60 ? profileDayV60 : null;
      const seasonA59 = seasonCharV59(seasonColorRawV59);
      const seasonB59 = seasonCharV59(seasonMonoRawV59);
      // Season is only written when both preprocessing passes independently agree.
      const seasonConsensusV59 = seasonA59 && seasonB59 && seasonA59 === seasonB59 ? seasonA59 : null;

      const farmerBestV61 = bestNameResult(farmerEngResultV61, farmerZhResultV61);
      const farmBestV61 = bestNameResult(farmEngResultV61, farmZhResultV61);
      const farmerRaw = farmerBestV61.text;
      const farmRaw = farmBestV61.text;

      // 不再只保留英數／中文：玩家名稱可合法包含 ®、©、·、☆ 等符號。
      let farmerName = cleanNameCandidate(farmerRaw)
        .replace(/^[^\p{L}\p{N}®©·・._@☆★♡♥♪♫~～+\-]+|[^\p{L}\p{N}®©·・._@☆★♡♥♪♫~～+\-]+$/gu, "")
        .trim();
      let farmName = cleanNameCandidate(farmRaw)
        .replace(/^(?:農場|农场)\s*/u, "")
        .replace(/\s+/g, " ")
        .trim();
      // 若 OCR 在「農場」後又幻覺出字串，直接以 UI 固定後綴為界截斷。
      const farmSuffixAt = farmName.search(/(?:農場|农场)/u);
      if (farmSuffixAt >= 0) farmName = farmName.slice(0, farmSuffixAt).trim();
      // Switch 字型的中點偶爾會被辨識成 +。
      farmName = farmName.replace(/\s+\+\s+/g, " · ").replace(/\s+/g, " ").replace(/[.。]+$/u, "").trim();
      // OCR 偶爾會把「目前持有現金」等標籤吃進來；這裡只保留較短的名稱片段。
      if (farmName.length > 28) farmName = farmName.slice(0,28).trim();
      if (farmerName.length > 24) farmerName = farmerName.slice(0,24).trim();

      const currentMoney = moneyConsensusV59;
      const totalIncome = incomeConsensusV59;
      let year = yearConsensusV59;
      let day = dayConsensusV59;
      let season = seasonConsensusV59;
      if (!(year && year >= 1 && year <= 99)) year = null;
      if (!(day && day >= 1 && day <= 28)) day = null;

      let gameTime = clockRaw.replace(/\s+/g, "").replace("：", ":");
      const tm = gameTime.match(/([0-2]?\d):?([0-5]\d)/);
      gameTime = tm ? `${String(Number(tm[1])).padStart(2,'0')}:${tm[2]}` : "";

      const patch = {};
      const updated = [];
      // Names are best-effort convenience fields. They remain directly editable below.
      if (farmerName && farmerName.length >= 2) { patch.name = farmerName; updated.push("農夫名字"); }
      if (farmName && farmName.length >= 2) { patch.farm = farmName; updated.push("農場名"); }
      if (year && year >= 1 && year <= 99) { patch.year = year; updated.push("年份"); }
      if (season) { patch.season = season; updated.push("季節"); }
      if (day && day >= 1 && day <= 28) { patch.day = day; updated.push("日期"); }
      if (currentMoney !== null) { patch.money = currentMoney; updated.push("目前金錢"); }
      if (totalIncome !== null) { patch.totalIncome = totalIncome; updated.push("總收入"); }
      if (gameTime) { patch.gameTime = gameTime; updated.push("遊戲內時間"); }

      setData(d => ({ ...d, profilePortrait:portrait, base:{...d.base, ...patch} }));
      setProfileOcrResult({
        farmerRaw, farmRaw, moneyRaw, incomeRaw, yearRaw, seasonRaw, dayRaw, clockRaw, applied:patch,
        moneyHudColorRawV59, moneyHudMonoRawV59, moneyPanelRawV59,
        incomeColorRawV59, incomeMonoRawV59, incomeWideRawV59,
        seasonColorRawV59, seasonMonoRawV59,
        hudDayColorRawV60, hudDayMonoRawV60,
        farmerEngRawV61:farmerEngResultV61.text, farmerZhRawV61:farmerZhResultV61.text,
        farmEngRawV61:farmEngResultV61.text, farmZhRawV61:farmZhResultV61.text
      });
      const skippedV59 = [];
      if (currentMoney === null) skippedV59.push("目前金錢");
      if (totalIncome === null) skippedV59.push("累計收入");
      if (!year) skippedV59.push("年份");
      if (!season) skippedV59.push("季節");
      if (!day) skippedV59.push("日期");
      setProfileOcrStatus(updated.length
        ? `✓ 已更新：${updated.join("、")}${skippedV59.length ? `；未可靠辨識：${skippedV59.join("、")}（未覆蓋原值）` : ""}`
        : "⚠ 沒有欄位通過一致性檢查；只更新角色圖，原資料未覆蓋");
    } catch (e) {
      console.warn('profile OCR failed', e);
      setProfileOcrStatus(`⚠ 文字辨識失敗；角色圖仍可手動再試一次`);
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const renderProfileCard = () => <>
    <SectionTitle icon="game:Warp Totem Farm">農場名片</SectionTitle>
    <Card style={{padding:10}}>
      <div style={{display:"grid",gridTemplateColumns:"104px minmax(0,1fr)",gap:11,alignItems:"start"}}>
        <div style={{minWidth:0,textAlign:"center"}}>
          <button onClick={()=>profileInputRef.current?.click()} style={{width:96,minHeight:120,maxHeight:170,height:"auto",display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${C.line}`,borderRadius:9,overflow:"hidden",background:"#EFE4C4",padding:0,cursor:"pointer"}}>
            {data.profilePortrait ? <img src={data.profilePortrait} alt="農夫角色" style={{width:"100%",height:"auto",maxHeight:166,objectFit:"contain",imageRendering:"pixelated"}}/> : <div style={{fontSize:10,color:C.muted,fontWeight:900,lineHeight:1.45}}>上傳玩家<br/>資料畫面<br/><span style={{fontSize:21}}>＋</span></div>}
          </button>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginTop:4}}>
            <button onClick={()=>profileInputRef.current?.click()} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:6,padding:"3px 6px",fontWeight:900,color:C.brown,fontSize:8.5}}>{data.profilePortrait?"更換":"上傳"}</button>
            {data.profilePortrait&&<button onClick={()=>update({profilePortrait:""})} style={{border:0,background:"transparent",color:C.red,fontSize:8.5,fontWeight:900,padding:"3px 2px"}}>移除</button>}
          </div>
          <button onClick={()=>setProfileEditV95(v=>!v)} style={{marginTop:4,border:`1px solid ${profileEditV95?C.orange:C.line}`,background:profileEditV95?"#FFE2A8":C.cream,borderRadius:6,padding:"3px 8px",fontWeight:900,color:C.brown,fontSize:8.5,width:"100%"}}>✎ 編輯資料</button>
          {profileOcrStatus&&<div style={{fontSize:7.5,color:profileOcrStatus.startsWith("⚠")?C.red:C.green,fontWeight:850,lineHeight:1.25,marginTop:3}}>{profileOcrStatus}</div>}
        </div>
        <div style={{minWidth:0}}>
          <div style={{fontSize:15,fontWeight:950,color:C.darkBrown,lineHeight:1.15}}>{data.base.name || "未記錄農夫名"}</div>
          <div style={{fontSize:17,fontWeight:950,color:C.darkBrown,marginTop:2,lineHeight:1.15}}>{(data.profilePortrait||data.base.profileDataVerifiedV47)?`${String(data.base.farm||"").replace(/(?:農場|农场)$/u,"")||"未記錄"}農場`:"未記錄農場"}</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginTop:7,flexWrap:"wrap"}}><div style={{minWidth:0}}><div style={{fontSize:11.5,color:C.brown,marginTop:8,fontWeight:850}}>持有 {(data.profilePortrait||data.base.profileDataVerifiedV47)?`${Number(data.base.money||0).toLocaleString()}g`:"—"}</div>
          <div style={{fontSize:10.5,color:C.muted,marginTop:1}}>累計 {(data.profilePortrait||data.base.profileDataVerifiedV47)?`${Number(data.base.totalIncome||0).toLocaleString()}g`:"—"}</div></div><div style={{display:"flex",alignItems:"center",gap:4}}><button onClick={()=>updateBase({year:Math.max(1,Number(data.base.year||1)-1)})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:7,width:26,height:25,fontWeight:950,color:C.brown,padding:0}}>−</button>
            <div style={{fontSize:10.5,fontWeight:950,color:C.darkBrown,textAlign:"center",minWidth:50}}>第 {data.base.year} 年</div>
            <button onClick={()=>updateBase({year:Math.min(99,Number(data.base.year||1)+1)})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:7,width:26,height:25,fontWeight:950,color:C.brown,padding:0}}>＋</button></div></div>
          <div style={{display:"flex",gap:4,marginTop:7,flexWrap:"wrap",alignItems:"center"}}>{SEASONS.map(season=>{const active=data.base.season===season;return <button key={season} onClick={()=>updateBase({season})} style={{border:`1.5px solid ${active?C.green:C.line}`,background:active?C.lightGreen:C.cream,borderRadius:14,padding:"4px 6px",fontSize:9.5,fontWeight:900,color:active?C.green:C.ink,whiteSpace:"nowrap"}}>{SEASON_ICON[season]} {season}</button>})}<span style={{width:1,height:14,background:C.line,margin:"0 3px"}}/>{/* weatherRowMovedV94 */}{[["晴","☀️ 晴"],["雨","🌧️ 雨"]].map(([v,label])=>{const on=todayWeatherV69===v;return <button key={v} onClick={()=>setTodayWeatherV69(on?"":v)} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFE2A8":C.paper,borderRadius:13,padding:"3px 8px",fontSize:8.4,fontWeight:900,color:on?C.darkBrown:C.muted}}>{label}</button>})}</div>
          <div style={{display:"flex",gap:3,marginTop:6,flexWrap:"wrap",alignItems:"center"}}>{TIME_SLOTS_V93.map(x=>{const active=(data.base.timeSlotV93||null)===x.id;return <button key={x.id} onClick={()=>updateBase({timeSlotV93:active?null:x.id})} style={{border:`1.5px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.cream,borderRadius:12,padding:"3px 8px",fontSize:8.2,fontWeight:900,color:active?C.brown:C.ink}}>{x.label}</button>})}</div>
          <div style={{marginTop:7}}><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:3,marginTop:6}}>{[["技能",`${skillTotal}/50`],["社區",`${rp.done}/30`],(Number(data.mine?.skullBest||0)>0?["骷髏洞",`${Number(data.mine.skullBest)}層`]:["礦井",`${Math.min(120,Number(data.mine?.normal||0))}/120`]),["動物",`${totalAnimals}`]].map(([k,v])=><div key={k} style={{background:"#FFF4D8",border:`1px solid ${C.line}`,borderRadius:7,padding:"3px 2px",textAlign:"center",minWidth:0}}><div style={{fontSize:6.5,color:C.muted,fontWeight:900}}>{k}</div><b style={{display:"block",fontSize:8.5,color:C.brown,lineHeight:1.15,marginTop:1}}>{v}</b></div>)}</div></div>
          <div style={{fontSize:6.5,color:C.muted,marginTop:4,lineHeight:1.5}}>☀ 晴含雪／風天；🌧 雨含雷雨。已選的天氣或時段再按一次即取消。</div>
          
          
          
          
          {/* weatherRowMovedV94 merged */}
          
        </div>
        {profileEditV95&&<div style={{gridColumn:"1 / -1",borderTop:`1px dashed ${C.line}`,paddingTop:6,marginTop:0}}>
          <div style={{display:"grid",gap:5,marginTop:6}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              <input value={data.base.name||""} onChange={e=>updateBase({name:e.target.value,profileDataVerifiedV47:true})} placeholder="農夫名字" style={{minWidth:0,border:`1.5px solid ${C.line}`,background:"#FFFCF0",borderRadius:7,padding:"6px 7px",fontSize:10.5,fontWeight:800,color:C.ink}}/>
              <input value={data.base.farm||""} onChange={e=>updateBase({farm:e.target.value,profileDataVerifiedV47:true})} placeholder="農場名稱" style={{minWidth:0,border:`1.5px solid ${C.line}`,background:"#FFFCF0",borderRadius:7,padding:"6px 7px",fontSize:10.5,fontWeight:800,color:C.ink}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              <label style={{fontSize:8.5,color:C.muted,fontWeight:900}}>目前金錢<div style={{marginTop:2}}><NumInput value={data.base.money} max={999999999} onChange={v=>updateBase({money:v,profileDataVerifiedV47:true})} suffix="g" width={118}/></div></label>
              <label style={{fontSize:8.5,color:C.muted,fontWeight:900}}>累計收入<div style={{marginTop:2}}><NumInput value={data.base.totalIncome} max={999999999} onChange={v=>updateBase({totalIncome:v,profileDataVerifiedV47:true})} suffix="g" width={118}/></div></label>
            </div>
          </div>
        </div>}
      </div>
      <input ref={profileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{handleProfileUpload(e.target.files?.[0]);e.target.value=""}}/>
    </Card>
  </>;

  const renderMiniItemV26 = (name, tone=C.cream, fileHint="") => {
    const row=lookupRowV54(name);
    const file=row?.file||fileHint||itemFileZhV26(name)||"";
    const canLookup=Boolean(row);
    return <button type="button" key={`${name}-${file}`} disabled={!canLookup} onClick={()=>openItemLookupV54(name,row?.file||file)} style={{width:"100%",minWidth:0,border:`1px solid ${C.line}`,background:tone,borderRadius:8,padding:"4px 2px",textAlign:"center",font:"inherit",cursor:canLookup?"pointer":"default",opacity:canLookup?1:.78}}>{file?<GameIcon file={file} size={26} alt={name}/>:<div style={{height:26,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>•</div>}<div style={{fontSize:7.2,fontWeight:900,color:C.ink,lineHeight:1.05,marginTop:2,overflow:"hidden",textOverflow:"ellipsis"}}>{switchNameV47(name,file)}</div></button>;
  };

  const renderTodayCalendarItemV26 = (it) => {
    if(it.type==="birthday"){
      const gift=NPC_GIFTS[it.npc];
      return <div key={it.text} style={{marginTop:7,padding:"8px 9px",borderRadius:9,background:"#FFF1CF",border:`1.5px solid ${C.line}`}}><button type="button" onClick={()=>openSocialNpcV55(it.npc)} style={{width:"100%",border:0,background:"transparent",padding:0,display:"flex",alignItems:"center",gap:7,textAlign:"left",cursor:"pointer"}}><GameIcon file={NPC_ICON_FILES[it.npc]} size={34}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:12.5,color:C.brown}}>🎂 {it.npc}生日</b><div style={{fontSize:9,color:C.muted,marginTop:1}}>點人物卡 → 社交速查；點禮物 → 物品資料</div></div><span style={{fontSize:11,color:C.orange,fontWeight:950}}>查看人物 ›</span></button>{gift?.love?.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4,marginTop:6}}>{gift.love.map(x=>renderMiniItemV26(x,"#FFF8E3"))}</div>}{(()=>{const S=window.SDVNpcScheduleV91;if(!S?.resolve||!S.npcs[it.npc])return null;const bd=Number(data.base.day||1);const r=S.resolve(it.npc,{season:data.base.season,day:bd,rain:todayWeatherV69==="雨",...progressFlagsV92(data)});const fmt=t=>{const h=Math.floor(t/100),m=t%100;return `${h>=24?h-24:h}:${String(m).padStart(2,"0")}`};return <div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:6,alignItems:"center"}}><span style={{fontSize:7.4,color:C.muted,fontWeight:950}}>去哪找</span>{r.entries.map((seg2,i2)=>{const loc=seg2[1],can=Boolean(loc.node);return <button key={i2} disabled={!can} onClick={()=>can&&goToWorldV88(loc.node,loc.pin?{kind:"place",id:loc.pin}:null)} style={{border:`1px solid ${C.line}`,background:can?C.cream:"#F3EDDE",borderRadius:8,padding:"2px 6px",fontSize:7.2,fontWeight:900,color:C.brown}}>{fmt(seg2[0])} {loc.zh}{can?" ›":""}</button>})}{r.notes.length>0&&<span style={{fontSize:6.6,color:C.muted}}>{r.notes.join("；")}</span>}</div>})()}</div>;
    }
    if(it.type==="festival"){
      const g=FESTIVAL_GUIDE_V26[it.key];
      return <div key={it.text} style={{marginTop:7,padding:"8px 9px",borderRadius:9,background:"#FFF1CF",border:`1.5px solid ${C.line}`}}><b style={{fontSize:12.5,color:C.brown}}>🎪 今日：{it.text}</b>{g?<><div style={{fontSize:10,color:C.ink,lineHeight:1.45,marginTop:3}}>{g.desc}</div>{g.items?.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4,marginTop:6}}>{g.items.map(([file,name])=>renderMiniItemV26(name,"#FFF8E3",file))}</div>}</>:null}{(()=>{const v=FESTIVAL_VENUE_V94[it.key];if(!v)return null;const nd=WORLD_NAV_V87().nodes[v.node];if(!nd)return null;return <div style={{marginTop:6}}><button onClick={()=>goToWorldV88(v.node,v.pin?{kind:"place",id:v.pin}:null)} style={{border:0,background:"transparent",padding:0,fontSize:9,fontWeight:950,color:C.brown,textAlign:"left"}}>📍 會場：{nd.name} ›</button></div>})()}</div>;
    }
    return <div key={it.text} style={{marginTop:7,padding:"7px 9px",borderRadius:8,background:"#FFF1CF",fontSize:11,fontWeight:900,color:C.brown}}>{it.text}</div>;
  };

  const renderCalendar = () => {
    const seasonFile = {
      春:"Calendar Spring ZH", 夏:"Calendar Summer ZH", 秋:"Calendar Fall ZH", 冬:"Calendar Winter ZH"
    }[data.base.season] || "Calendar Spring ZH";
    const todayItems = dayCalendarItems(data.base.day);
    const upcoming = Array.from({length:28-data.base.day},(_,i)=>data.base.day+i+1)
      .map(day=>({day,items:dayCalendarItems(day)}))
      .filter(x=>x.items.length)
      .slice(0,4);
    return <>
      
      <SectionTitle icon="📅" right={`第 ${data.base.year} 年・${data.base.season}季`}>遊戲日曆</SectionTitle>
      <Card id="game-calendar-v69" style={{padding:7,overflow:"hidden",scrollMarginTop:"calc(70px + env(safe-area-inset-top))"}}>
        <div style={{position:"relative",width:"100%",borderRadius:8,overflow:"hidden",background:"#E7C58A"}}>
          <img src={GAME_FILE(seasonFile)} alt={`${data.base.season}季遊戲日曆`} onError={e=>{e.currentTarget.style.display="none"}}
            style={{display:"block",width:"100%",height:"auto",imageRendering:"pixelated"}}/>
          <div style={{position:"absolute",left:"3.333%",right:"3.333%",top:"19.048%",bottom:"4.762%",display:"grid",gridTemplateColumns:"repeat(7,1fr)",gridTemplateRows:"repeat(4,1fr)"}}>
            {Array.from({length:28},(_,i)=>i+1).map(day=><button key={day} aria-label={`切換到 ${day} 日`} onClick={()=>updateBase({day})} style={{position:"relative",border:data.base.day===day?`3px solid ${C.gold}`:"2px solid transparent",background:data.base.day===day?"rgba(255,234,164,.18)":"transparent",borderRadius:6,padding:0,cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>{data.base.day===day&&<span style={{position:"absolute",right:2,bottom:2,fontSize:8,fontWeight:950,color:"#FFF2C1",background:"rgba(61,34,15,.82)",borderRadius:5,padding:"1px 3px"}}>{day}</span>}</button>)}
          </div>
          <div style={{position:"absolute",right:7,top:7,background:"rgba(61,34,15,.88)",color:"#FFE9B5",border:`2px solid ${C.gold}`,borderRadius:9,padding:"4px 7px",fontSize:10.5,fontWeight:950,boxShadow:"0 2px 4px rgba(0,0,0,.2)"}}>今天 {data.base.day} 日</div>
        </div>
        {todayItems.length>0 && <div>{todayItems.map(renderTodayCalendarItemV26)}</div>}
        {todayItems.length===0 && <div style={{marginTop:7,fontSize:11,color:C.muted,fontWeight:800}}>今天沒有固定生日／節日／季節事件。</div>}
        {upcoming.length>0 && <div style={{marginTop:7,borderTop:`1px dashed ${C.line}`,paddingTop:6}}>
          <div style={{fontSize:10.5,color:C.muted,fontWeight:950,marginBottom:3}}>接下來</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{upcoming.map(x=><button key={x.day} onClick={()=>updateBase({day:x.day})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:9,padding:"4px 7px",fontSize:10,fontWeight:900,color:C.brown,cursor:"pointer"}}>{x.day}日 · {x.items.map(i=>i.type==="festival"&&festVenueLabelV94(i.key)?`${i.text}（${festVenueLabelV94(i.key)}）`:i.text).join("／")}</button>)}</div>
        </div>}
        {data.base.season==="夏"&&<div style={{marginTop:7,padding:"6px 8px",borderRadius:8,background:"#EAF4D8",border:`1px solid ${C.line}`,display:"flex",alignItems:"center",gap:6}}><GameIcon file="Mossy Seed" size={24}/><div style={{fontSize:8.8,color:C.ink,lineHeight:1.35}}><b style={{color:C.green}}>綠雨提醒</b>：每年夏季隨機 1 天，只可能落在 5、6、7、14、15、16、18、23 日；手帳不預猜是哪一天。</div></div>}
        <div style={{fontSize:9.5,color:C.muted,marginTop:6,lineHeight:1.4}}>直接點上方遊戲日曆的日期格即可切換手帳日期；頁首與當日事件會一起更新。書商每季日期依存檔隨機，無法只靠年份／季節推算。</div>
      </Card>
    </>;
  };

  const renderHeader = () => <>
    <div style={{background:C.darkBrown,color:"white",padding:"calc(8px + env(safe-area-inset-top)) 12px 8px",position:"sticky",top:0,zIndex:30,boxShadow:"0 2px 8px rgba(0,0,0,.25)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <GameIcon file="Junimo Icon" size={34}/>
        <div style={{minWidth:0}}><div style={{fontSize:16,fontWeight:950,letterSpacing:.3,lineHeight:1.1}}>星露谷農場手帳</div></div>
        <button aria-label="全域搜尋" onClick={openSearchV88} style={{marginLeft:"auto",border:"1.5px solid rgba(255,227,154,.5)",background:"rgba(255,255,255,.08)",borderRadius:9,padding:"5px 9px",display:"flex",alignItems:"center",gap:4,color:"#FFE39A",fontSize:9.5,fontWeight:950,cursor:"pointer",flex:"0 0 auto"}}>🔍 搜尋</button>
        <div style={{textAlign:"right",minWidth:0}}>
          <div style={{fontWeight:950,fontSize:12.5,lineHeight:1.15}}>{SEASON_ICON[data.base.season]} 第 {data.base.year} 年 {data.base.season} {data.base.day} 日</div>
          <div style={{fontSize:10.5,color:"#E8C88F",marginTop:2}}>{(data.profilePortrait||data.base.profileDataVerifiedV47)?`${Number(data.base.money||0).toLocaleString()}g`:""}</div>
        </div>
      </div>
    </div>
  </>;

  const renderOverview = () => <div>
    {renderProfileCard()}
    {renderCalendar()}
    {renderTodayV69()}
    {renderFavStripV88()}
  </div>;

  const renderSkills = () => {
    const SkillTab=({id,label,file})=>{const active=skillSection===id;return <button onClick={()=>setSkillSection(id)} style={{border:`1.5px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:8,padding:"3px 2px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={file} size={25}/><span style={{fontSize:8.4,fontWeight:950,color:active?C.darkBrown:C.muted}}>{label}</span></button>};
    const drops=data.stardropsV2||[];
    const autoDrop=id=>id==="mine100"?Number(data.mine?.normal||0)>=100:id==="angler"?(data.collections?.fish||[]).length>=FISH_ICON_FILES.length:id==="museum"?(data.achievementsV2||[]).includes("museum_all"):false;
    const toggleDrop=id=>{if(autoDrop(id))return;update({stardropsV2:drops.includes(id)?drops.filter(x=>x!==id):[...drops,id]})};
    const allMax=SKILLS.every(sk=>Number(data.skills?.[sk.id]||0)>=10);
    const profPick=(sk,p,lv,parent=null)=>{
      const l5=sk.id+"5",l10=sk.id+"10",cur5=data.prof?.[l5]||"",cur10=data.prof?.[l10]||"";
      const selected=lv===5?cur5===p:cur10===p;
      const unlocked=lv===5?Number(data.skills?.[sk.id]||0)>=5:Number(data.skills?.[sk.id]||0)>=10;
      const eligible=lv===5||!cur5||cur5===parent;
      const canClick=unlocked&&eligible;
      return <button key={`${sk.id}-${p}`} disabled={!canClick} onClick={()=>lv===5?updateNested("prof",{[l5]:p,[l10]:""}):updateNested("prof",{[l5]:parent,[l10]:p})} style={{border:`1.5px solid ${selected?C.green:C.line}`,background:selected?"#EAF4D8":C.paper,borderRadius:8,padding:"4px 2px",textAlign:"center",cursor:canClick?"pointer":"default",opacity:unlocked?(eligible?1:.38):.32,minWidth:0}}><GameIcon file={PROF_ICON_FILES_V26[p]} size={25}/><div style={{fontSize:7.8,fontWeight:950,color:selected?C.green:C.ink,lineHeight:1.05}}>{p}</div><div style={{fontSize:6.4,color:C.muted,lineHeight:1.12,marginTop:2,minHeight:22}}>{PROF_DESC_V27[p]}</div></button>;
    };
    const powerKind=powerSection==="books"?"books":"special";
    const powerList=powerKind==="books"?BOOK_POWERS_V2:SPECIAL_ITEMS_V2;
    return <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:8}}><SkillTab id="milestones" label="里程碑" file="Golden Tag"/><SkillTab id="skills" label="技能" file="Book Of Stars"/><SkillTab id="mine" label="礦井" file="Pickaxe"/><SkillTab id="special" label="特殊能力" file="Magic Rock Candy"/><SkillTab id="stardrops" label="星之果實" file="Stardrop"/></div>
      {skillSection==="milestones"&&<><SectionTitle icon="game:Golden Tag">重要里程碑</SectionTitle><Card style={{padding:8}}>{MILESTONES.map(m => {const linked=LINKED_MILESTONES_V68.has(m.id),checked=linked?progressFactV68(m.id):(data.milestones||[]).includes(m.id),source=linked&&checked?factSourceLabelV68(m.id):"";return <CheckRow key={m.id} checked={checked} onChange={v => linked?setLinkedMilestoneV68(m.id,v):update({ milestones: v ? [...new Set([...(data.milestones||[]), m.id])] : (data.milestones||[]).filter(x => x !== m.id) })} sub={`${m.desc}${source?` · ${source}`:""}`}>{m.name}</CheckRow>})}</Card></>}
      {skillSection==="skills"&&<><SectionTitle icon="game:Book Of Stars">技能・專精・精通</SectionTitle><Card style={{padding:7}}>{SKILLS.map((sk,si)=>{const lv=Number(data.skills?.[sk.id]||0),l5=sk.id+"5",p5=data.prof?.[l5]||"";const branches=Object.entries(PROF[sk.id].l10);const mastery=MASTERY_POWERS_V2.find(x=>x.id===sk.id);const mastered=(data.mastery||[]).includes(sk.id);return <div key={sk.id} style={{padding:"7px 0",borderBottom:si<SKILLS.length-1?`1px dashed ${C.line}`:"none"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}><GameIcon file={SKILL_ICON_FILES[sk.id]} size={31}/><div style={{minWidth:0,flex:1}}><div style={{display:"flex",alignItems:"center",gap:5}}><b style={{fontSize:11.5,color:C.ink}}>{sk.name}</b><span style={{fontSize:8,color:C.muted}}>{SKILL_BASE_DESC_V27[sk.id]}</span></div></div><button onClick={()=>updateNested("skills",{[sk.id]:Math.max(0,lv-1)})} style={{border:0,background:C.cream,borderRadius:6,width:21,height:21,padding:0,fontWeight:950,color:C.brown}}>−</button><b style={{fontSize:10.5,color:C.green,minWidth:31,textAlign:"center"}}>Lv.{lv}</b><button onClick={()=>updateNested("skills",{[sk.id]:Math.min(10,lv+1)})} style={{border:0,background:C.cream,borderRadius:6,width:21,height:21,padding:0,fontWeight:950,color:C.brown}}>＋</button></div>
        <div style={{display:"grid",gridTemplateColumns:"28px repeat(2,minmax(0,1fr))",gap:4,alignItems:"stretch",marginTop:5}}><div style={{fontSize:7.5,fontWeight:950,color:C.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>5級</div>{PROF[sk.id].l5.map(p=>profPick(sk,p,5))}</div>
        <div style={{display:"grid",gridTemplateColumns:"28px repeat(4,minmax(0,1fr))",gap:4,alignItems:"stretch",marginTop:4}}><div style={{fontSize:7.5,fontWeight:950,color:C.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>10級</div>{branches.flatMap(([parent,arr])=>arr.map(p=>profPick(sk,p,10,parent)))}</div>
        <button disabled={!allMax&&!mastered} onClick={()=>update({mastery:mastered?(data.mastery||[]).filter(x=>x!==sk.id):[...new Set([...(data.mastery||[]),sk.id])]})} style={{marginTop:5,width:"100%",border:`1.5px solid ${mastered?C.green:C.line}`,background:mastered?"#EAF4D8":C.cream,borderRadius:7,padding:"4px 6px",display:"flex",alignItems:"center",gap:5,textAlign:"left",opacity:allMax||mastered?1:.45}}><GameIcon file="Mastery Icon" size={21}/><b style={{fontSize:8.5,color:mastered?C.green:C.brown}}>{mastered?"✓ 已精通":"精通"}</b><span style={{fontSize:7.2,color:C.muted,lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{allMax||mastered?mastery?.desc:"五種技能都 10 級後解鎖"}</span></button>
      </div>})}</Card></>}
      {skillSection==="mine"&&<>
        <SectionTitle icon="⛏️">礦井</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>
          <Card style={{padding:9,textAlign:"center"}}><GameIcon file="MinesEntrance" size={58}/><b style={{display:"block",fontSize:11,color:C.ink,marginTop:3}}>普通礦井</b><div style={{marginTop:6}}><NumInput value={data.mine.normal} max={120} onChange={v=>updateNested("mine",{normal:v})} suffix="層"/></div><div style={{marginTop:6}}><ProgressBar value={data.mine.normal} max={120} color={C.blue}/></div></Card>
          <Card style={{padding:9,textAlign:"center"}}><GameIcon file="Skull Key" size={52}/><b style={{display:"block",fontSize:11,color:C.ink,marginTop:3}}>骷髏洞窟最佳</b><div style={{marginTop:6}}><NumInput value={data.mine.skullBest} max={999} onChange={v=>updateNested("mine",{skullBest:v})} suffix="層"/></div><div style={{fontSize:8,color:C.muted,lineHeight:1.3,marginTop:6}}>骷髏洞窟樓層與資源是程序生成，不用套普通礦井固定分層。</div></Card>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5,marginTop:8}}>{[["1","1–40"],["2","41–80"],["3","81–120"]].map(([id,label])=><button key={id} onClick={()=>setMineRangeV28(id)} style={{border:`1.5px solid ${mineRangeV28===id?C.orange:C.line}`,background:mineRangeV28===id?"#FFE2A8":C.paper,borderRadius:8,padding:6,fontSize:9,fontWeight:950,color:C.brown}}>{label}</button>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:6,marginTop:7}}>{MINE_BANDS_V28.filter(x=>x.g===mineRangeV28).map(b=><Card key={b.range} style={{padding:7,minHeight:88}}><div style={{display:"flex",alignItems:"center",gap:5}}><GameIcon file="Pickaxe" size={24}/><b style={{fontSize:10.5,color:C.darkBrown}}>{b.range} 層</b></div><div style={{fontSize:7.5,color:C.muted,lineHeight:1.25,marginTop:2}}>{b.note}</div><div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:5}}>{b.items.map(([file,label])=><span key={`${b.range}-${file}`} title={label} style={{width:34,textAlign:"center"}}><GameIcon file={file} size={24} alt={label}/><span style={{display:"block",fontSize:5.9,color:C.muted,fontWeight:800,lineHeight:1.05,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</span></span>)}</div></Card>)}</div>
        <div style={{fontSize:8.3,color:C.muted,lineHeight:1.45,marginTop:6}}>快速查看普通礦井各區段的主要礦物、特殊魚與寶箱層；怪物和礦點會依當日生成。</div>
      </>}

      {skillSection==="special"&&<><SectionTitle icon="game:Magic Rock Candy">特殊物品與能力</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:6,marginBottom:7}}><button onClick={()=>setPowerSection("special")} style={{border:`2px solid ${powerKind==="special"?C.orange:C.line}`,background:powerKind==="special"?"#FFE2A8":C.paper,borderRadius:9,padding:6,fontSize:9,fontWeight:950,color:C.brown}}><GameIcon file="Galaxy Soul" size={28}/>特殊物品</button><button onClick={()=>setPowerSection("books")} style={{border:`2px solid ${powerKind==="books"?C.orange:C.line}`,background:powerKind==="books"?"#FFE2A8":C.paper,borderRadius:9,padding:6,fontSize:9,fontWeight:950,color:C.brown}}><GameIcon file="Book of Mysteries" size={28}/>書籍能力</button></div><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:6}}>{powerList.map(it=>{const checked=isPowerChecked(powerKind,it);return <button key={it.id} onClick={()=>togglePower(powerKind,it)} style={{border:`1.5px solid ${checked?C.green:C.line}`,background:checked?"#EAF4D8":C.paper,borderRadius:9,padding:7,textAlign:"left",cursor:"pointer"}}><div style={{display:"flex",alignItems:"center",gap:5}}><GameIcon file={it.file} size={31}/><b style={{fontSize:9.5,color:checked?C.green:C.ink}}>{checked?"✓ ":""}{it.name}</b></div><div style={{fontSize:7.4,color:C.muted,lineHeight:1.3,marginTop:3}}>{it.desc}</div></button>})}</div></>}
      {skillSection==="stardrops"&&<><SectionTitle icon="✨">7 顆星之果實</SectionTitle><div style={{display:"grid",gap:6}}>{STARDROP_SOURCES_V26.map(d=>{const auto=autoDrop(d.id),on=auto||drops.includes(d.id);return <Card key={d.id} style={{padding:8,background:on?"#EEF7DD":C.paper}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file="Stardrop" size={31}/><div style={{flex:1}}><b style={{fontSize:11,color:on?C.green:C.ink}}>{d.name}</b><div style={{fontSize:8.8,color:C.muted,lineHeight:1.35,marginTop:2}}>{d.desc}</div></div><button disabled={auto} onClick={()=>toggleDrop(d.id)} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?C.lightGreen:C.cream,borderRadius:7,padding:"4px 6px",fontWeight:950,color:on?C.green:C.muted,fontSize:10}}>{on?"✓":"○"}</button></div></Card>})}</div></>}
    </div>;
  };

  const renderBundles = () => {
    const route=["cc","joja"].includes(data.communityRouteV28)?data.communityRouteV28:"";
    const mode=data.bundleModeV28||"standard";
    const customItems=data.bundleCustomV28||{};
    const customNeeds=data.bundleNeedV28||{};
    const customNames=data.bundleNameV28||{};
    const jojaDone=data.jojaProjectsV28||[];
    const raccoonV50=data.raccoonV50||{stump:false,requests:0};
    const setRaccoonV50=patch=>update({raccoonV50:{...raccoonV50,...patch}});
    const room=BUNDLE_ROOMS.find(r=>r.id===bundleRoom)||BUNDLE_ROOMS[0];
    const showRoomV51=Boolean(bundleRoom);
    const bundleItemsFor=b=>mode==="custom"?(customItems[b.id]||b.items):b.items;
    const bundleNeedFor=b=>{const items=bundleItemsFor(b);const d=b.need||b.items.length;return Math.max(1,Math.min(items.length||1,mode==="custom"&&customNeeds[b.id]!=null?Number(customNeeds[b.id]):d));};
    const setCustomBundle=(b,items,need=bundleNeedFor(b))=>update({bundleCustomV28:{...customItems,[b.id]:items},bundleNeedV28:{...customNeeds,[b.id]:Math.max(1,Math.min(items.length||1,Number(need)||1))}});
    const setCustomName=(b,name)=>update({bundleNameV28:{...customNames,[b.id]:name||b.name}});
    const RoomTab=({r})=>{const rd=roomDone(r),active=bundleRoom===r.id;return <button onClick={()=>{setBundleRoom(active?"":r.id);setBundleEditV28(null)}} style={{border:`1.5px solid ${active?C.orange:rd?C.green:C.line}`,background:active?"#FFE2A8":rd?"#EEF7DD":C.paper,borderRadius:8,padding:"5px 2px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={ROOM_ICON_FILES[r.id]} size={24}/><span style={{fontSize:8.2,fontWeight:950,color:active?C.darkBrown:rd?C.green:C.muted}}>{rd?"✓ ":""}{r.name}</span></button>};
    const RouteLevelV55=({label,file,children})=><div style={{marginTop:9}}><div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 2px 2px",fontSize:9,fontWeight:950,color:C.orange}}><GameIcon file={file} size={21}/><span>{label}</span></div>{children}</div>;
    const routeButton=(id,label,file)=>{const active=route===id,inactive=Boolean(route)&&!active;return <button onClick={()=>{if(route&&route!==id&&!window.confirm(`遊戲中社区中心與 Joja 是二選一路線。確定把手帳目前路線切換成「${label}」嗎？
另一條路線已記錄的資料會保留，但不會同時計入目前路線。`))return;update({communityRouteV28:id});setBundleRoom("");setBundleEditV28(null)}} style={{border:`2px solid ${active?C.green:C.line}`,background:active?"#EAF4D8":inactive?"#E5E1D8":C.paper,borderRadius:10,padding:"7px 5px",display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontSize:9,fontWeight:950,color:active?C.green:inactive?C.muted:C.brown,filter:inactive?"grayscale(.9)":"none",opacity:inactive?.65:1}}><GameIcon file={file} size={27}/><span>{active?"✓ ":""}{label}{active?<small style={{display:"block",fontSize:6.2,color:C.green,marginTop:1}}>目前路線</small>:null}</span></button>};
    return <div>
      <SectionTitle icon="📦">城鎮修復路線</SectionTitle>
      <Card style={{padding:8,background:"#FFF4D8"}}><div style={{display:"flex",alignItems:"center",gap:5,fontSize:8.8,fontWeight:950,color:C.brown,marginBottom:6}}><GameIcon file="Golden Scroll" size={20}/><span>選擇這個存檔的城鎮修復路線｜遊戲中二選一</span></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>{routeButton("cc","社区中心","Golden Scroll")}{routeButton("joja","Joja","Joja Warehouse")}</div>{!route&&<div style={{fontSize:8,color:C.muted,lineHeight:1.35,marginTop:6,textAlign:"center"}}>尚未選擇路線；選好後才顯示對應內容。</div>}</Card>

      {route==="joja"&&<RouteLevelV55 label="Joja 倉庫｜路線內容" file="Joja Warehouse">
        <Card style={{marginTop:9,padding:9,background:data.jojaMemberV28?"#EEF7DD":"#E5E1D8",filter:data.jojaMemberV28?"none":"grayscale(.9)",opacity:data.jojaMemberV28?1:.72}}><div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file="Joja Cola" size={36}/><div style={{flex:1}}><b style={{fontSize:12,color:C.darkBrown}}>Joja 會員</b><div style={{fontSize:9,color:C.muted,marginTop:2}}>5,000g；購買後社區中心變為 Joja 倉庫。</div></div><button onClick={()=>update({jojaMemberV28:!data.jojaMemberV28})} style={{border:`1.5px solid ${data.jojaMemberV28?C.green:C.line}`,background:data.jojaMemberV28?C.lightGreen:"#EEE9DE",borderRadius:8,padding:"5px 7px",fontWeight:950,color:data.jojaMemberV28?C.green:C.muted,fontSize:9}}>{data.jojaMemberV28?"✓ 已加入":"未加入"}</button></div></Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:7,marginTop:8}}>{JOJA_PROJECTS_V28.map(j=>{const on=jojaDone.includes(j.id),locked=!data.jojaMemberV28&&!on;return <button key={j.id} disabled={locked} onClick={()=>update({jojaProjectsV28:on?jojaDone.filter(x=>x!==j.id):[...jojaDone,j.id]})} style={{border:`2px solid ${on?C.green:C.line}`,background:on?"#EAF4D8":locked?"#E5E1D8":C.paper,borderRadius:10,padding:8,textAlign:"left",cursor:locked?"default":"pointer",filter:locked?"grayscale(.9)":"none",opacity:locked?.62:1}}><div style={{display:"flex",alignItems:"center",gap:6}}><GameIcon file={j.file} size={32}/><div style={{minWidth:0}}><b style={{fontSize:10,color:on?C.green:C.ink}}>{on?"✓ ":""}{j.name}</b><div style={{fontSize:9,fontWeight:950,color:C.orange,marginTop:1}}>{j.cost.toLocaleString()}g</div></div></div><div style={{fontSize:7.8,color:C.muted,lineHeight:1.35,marginTop:4}}>{j.desc}</div></button>})}</div>
        <Card style={{marginTop:8,padding:8,background:"#FFF4D8",fontSize:9,color:C.muted,lineHeight:1.45}}>Joja 五項工程對應社區中心的採石場橋、溫室、淘金、礦車與沙漠巴士；沒有布告欄的居民友情獎勵。全部工程完成後可取得汽水機。</Card>
      </RouteLevelV55>}

      {route==="cc"&&<RouteLevelV55 label="社区中心｜路線內容" file="Golden Scroll">
        <div style={{display:"flex",alignItems:"center",gap:7,margin:"10px 0 7px"}}><GameIcon file="Golden Scroll" size={27}/><b style={{fontSize:14,color:C.darkBrown}}>社区中心</b><span style={{marginLeft:"auto",fontSize:11,fontWeight:950,color:C.muted}}>{rp.done}/30</span></div>
        <Card style={{padding:8}}><ProgressBar value={rp.done} max={30} color={C.orange}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginTop:7}}><button onClick={()=>{update({bundleModeV28:"standard"});setBundleEditV28(null)}} style={{border:`1.5px solid ${mode==="standard"?C.green:C.line}`,background:mode==="standard"?C.lightGreen:C.cream,borderRadius:8,padding:5,fontSize:9,fontWeight:950,color:C.brown}}>標準收集包</button><button onClick={()=>update({bundleModeV28:"custom"})} style={{border:`1.5px solid ${mode==="custom"?C.green:C.line}`,background:mode==="custom"?C.lightGreen:C.cream,borderRadius:8,padding:5,fontSize:9,fontWeight:950,color:C.brown}}>混合／自訂</button></div>{mode==="custom"&&<div style={{fontSize:8,color:C.muted,lineHeight:1.35,marginTop:5}}>預設先沿用標準配置；只需把實際存檔中不同的包名、需求物與需要幾格改掉。</div>}</Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6,marginTop:8}}>{BUNDLE_ROOMS.map(r=><RoomTab key={r.id} r={r}/>)}</div>
        {showRoomV51&&ROOM_UNLOCKS_V28[room.id]&&(()=>{const unlock=ROOM_UNLOCKS_V28[room.id],explicit=roomExplicitDoneV68(room),itemsDone=roomItemsCompleteFromStateV68(data,room.id),done=roomDone(room);return <button type="button" onClick={()=>{if(explicit){if(window.confirm(`取消「${room.name}」整室完成標記嗎？\n已逐項勾選的收集包物品會保留。`))toggleRoom(room.id,false)}else if(itemsDone){alert("這個房間已由下方收集包逐項完成；若要修正，直接取消對應物品即可。")}else toggleRoom(room.id,true)}} style={{width:"100%",marginTop:8,padding:7,border:`2px solid ${done?C.green:C.line}`,borderRadius:10,background:done?"#EAF4D8":"#F1EAD3",textAlign:"left",cursor:"pointer"}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file={unlock.file} size={30}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:10.5,color:done?C.green:C.darkBrown}}>{done?`✓ 整室完成 · ${unlock.name}`:`整室完成：${unlock.name}`}</b><div style={{fontSize:8,color:C.muted,marginTop:1}}>{done?(itemsDone&&!explicit?"收集包已全部完成；進度已自動聯動。":"已標記整室完成；點卡片可取消整室標記。"):`${unlock.desc} · 點此直接標記整室完成`}</div></div></div></button>})()}
        <div style={{display:showRoomV51?"grid":"none",gap:7,marginTop:7}}>{room.bundles.map(b=>{const items=bundleItemsFor(b),gotRaw=data.bundleItems[b.id]||[],got=gotRaw.filter(x=>items.includes(x)),need=bundleNeedFor(b),bDone=roomDone(room)||got.length>=need,reward=BUNDLE_REWARDS_V28[b.id],editing=mode==="custom"&&bundleEditV28===b.id,name=mode==="custom"?(customNames[b.id]||b.name):b.name;const pool=[...new Set([...room.bundles.flatMap(x=>x.items),...(REMIX_EXTRA_ITEMS_V28[room.id]||[]),...items])];return <Card key={b.id} style={{padding:8,background:bDone?"#F0F8DF":C.paper,borderColor:bDone?C.green:C.line}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:7}}><GameIcon file={BUNDLE_ICON_FILES_V26[b.id]} size={38}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:11,color:bDone?C.green:C.brown}}>{name}</b><div style={{fontSize:8.5,color:C.muted,marginTop:1}}>完成 {Math.min(got.length,need)}/{need}{need<items.length?"（任選）":""}</div></div>{reward&&<div style={{maxWidth:82,textAlign:"right",border:`1px solid ${C.line}`,borderRadius:7,padding:"3px 4px",background:"#FFF8E3"}}><div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:3}}><GameIcon file={reward[0]} size={20}/><span style={{fontSize:7,fontWeight:950,color:C.brown}}>×{reward[2]}</span></div><div style={{fontSize:6.5,color:C.muted,lineHeight:1.05,marginTop:1}}>{mode==="custom"?"標準獎勵 ":"獎勵 "}{reward[1]}</div></div>}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{items.map(it=>{const checked=roomExplicitDoneV68(room)||gotRaw.includes(it),file=itemFileZhV26(it),gold=it.includes("金星");return <button key={it} disabled={roomExplicitDoneV68(room)} onClick={()=>updateNested("bundleItems",{[b.id]:checked?gotRaw.filter(x=>x!==it):[...gotRaw,it]})} style={{position:"relative",border:`1.5px solid ${checked?C.green:C.line}`,background:checked?"#E5F3CF":C.paper,borderRadius:8,padding:"5px 2px",minHeight:68,cursor:roomExplicitDoneV68(room)?"default":"pointer",opacity:roomExplicitDoneV68(room)?.78:1}}><div style={{height:31,display:"flex",alignItems:"center",justifyContent:"center"}}>{file?<GameIcon file={file} size={29} alt={it}/>:<span style={{fontSize:12,color:C.muted}}>•</span>}{gold&&<span style={{position:"absolute",right:3,top:2,color:C.gold,fontSize:11}}>★</span>}</div><div style={{fontSize:7.1,fontWeight:900,color:checked?C.green:C.ink,lineHeight:1.05,marginTop:2}}>{it}</div></button>})}</div>
          {mode==="custom"&&<button onClick={()=>setBundleEditV28(editing?null:b.id)} style={{marginTop:6,border:`1px dashed ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:8.5,fontWeight:950,color:C.brown}}>{editing?"▲ 收起調整":"⚙ 調整這個包"}</button>}
          {editing&&<div style={{marginTop:6,paddingTop:6,borderTop:`1px dashed ${C.line}`}}><div style={{display:"flex",gap:5,alignItems:"center",marginBottom:5}}><button onClick={()=>{const v=window.prompt("收集包名稱",name);if(v!=null)setCustomName(b,v.trim())}} style={{border:`1px solid ${C.line}`,background:C.paper,borderRadius:7,padding:"4px 6px",fontSize:8,fontWeight:900,color:C.brown}}>改包名</button><span style={{fontSize:8,color:C.muted}}>需要 {need} / {items.length} 格</span><button onClick={()=>setCustomBundle(b,items,need-1)} style={{marginLeft:"auto",border:0,background:C.cream,borderRadius:6,width:22,height:20,padding:0,fontWeight:950,color:C.brown}}>−</button><button onClick={()=>setCustomBundle(b,items,need+1)} style={{border:0,background:C.cream,borderRadius:6,width:22,height:20,padding:0,fontWeight:950,color:C.brown}}>＋</button></div><div style={{display:"grid",gridTemplateColumns:"repeat(6,minmax(0,1fr))",gap:4}}>{pool.map(it=>{const on=items.includes(it),file=itemFileZhV26(it);return <button key={`pick-${b.id}-${it}`} onClick={()=>{const next=on?items.filter(x=>x!==it):[...items,it];if(next.length)setCustomBundle(b,next,Math.min(need,next.length))}} style={{border:`1px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:7,padding:"4px 1px",minHeight:54}}>{file?<GameIcon file={file} size={24}/>:<span style={{fontSize:10}}>•</span>}<div style={{fontSize:6.2,fontWeight:850,color:on?C.green:C.ink,lineHeight:1.05}}>{it}</div></button>})}</div><button onClick={()=>{const v=window.prompt("新增其他需求物（可含 ×數量）","");if(v&&v.trim()){const next=[...new Set([...items,v.trim()])];setCustomBundle(b,next,Math.min(need,next.length))}}} style={{marginTop:5,border:`1px dashed ${C.line}`,background:C.paper,borderRadius:7,padding:"4px 7px",fontSize:8,fontWeight:900,color:C.brown}}>＋ 新增其他物品</button></div>}
        </Card>})}</div>
              </RouteLevelV55>}

      <SectionTitle icon="game:Raccoon Icon">森林鄰居</SectionTitle>
      <Card style={{padding:9,background:raccoonV50.stump?"#EEF7DD":"#E5E1D8",filter:raccoonV50.stump?"none":"grayscale(.9)",opacity:raccoonV50.stump?1:.72}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file="Raccoon Icon" size={38}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:12,color:C.darkBrown}}>大樹樁・浣熊一家</b><div style={{fontSize:8.5,color:C.muted,lineHeight:1.35,marginTop:2}}>位於煤矿森林，屬於城鎮／鄰居進度，不算農場建築。</div></div><button onClick={()=>setRaccoonV50({stump:!raccoonV50.stump,requests:!raccoonV50.stump?raccoonV50.requests:0})} style={{border:`1.5px solid ${raccoonV50.stump?C.green:C.line}`,background:raccoonV50.stump?C.lightGreen:"#EEE9DE",borderRadius:7,padding:"5px 7px",fontSize:8.5,fontWeight:950,color:raccoonV50.stump?C.green:C.muted}}>{raccoonV50.stump?"✓ 樹樁已修復":"未修復"}</button></div>
        {raccoonV50.stump&&<><div style={{display:"grid",gridTemplateColumns:"auto 24px 42px 24px",alignItems:"center",gap:4,marginTop:8,paddingTop:7,borderTop:`1px dashed ${C.line}`}}><span style={{fontSize:9,fontWeight:950,color:C.brown}}>已完成浣熊請求</span><button onClick={()=>setRaccoonV50({requests:Math.max(0,Number(raccoonV50.requests||0)-1)})} style={{border:0,background:C.cream,borderRadius:6,height:22,fontWeight:950,color:C.brown}}>−</button><b style={{fontSize:10,color:C.green,textAlign:"center"}}>{Number(raccoonV50.requests||0)} 次</b><button onClick={()=>setRaccoonV50({requests:Math.min(99,Number(raccoonV50.requests||0)+1)})} style={{border:0,background:C.cream,borderRadius:6,height:22,fontWeight:950,color:C.brown}}>＋</button></div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:7}}>{[[1,"妻子商店"],[2,"浣熊日記"],[3,"浣熊帽"],[9,"好鄰居成就"]].map(([n,label])=>{const on=Number(raccoonV50.requests||0)>=n;return <span key={label} style={{fontSize:7.5,fontWeight:900,padding:"3px 6px",borderRadius:8,background:on?"#DFF0CD":"#EEE5D2",color:on?C.green:C.muted}}>{on?"✓ ":""}{label}</span>})}</div><div style={{fontSize:8,color:C.muted,lineHeight:1.35,marginTop:6}}>每完成一次請求後約 7 天才會出現下一次；第 9 次完成「好鄰居」成就，之後仍可繼續交換。</div></>}
      </Card>
    </div>;
  };

  const renderFarm = () => {
    const otherBuildings=data.buildings?.other||[];
    const houseFiles=["House (tier 1)","House (tier 2)","House (tier 3)","House (tier 3)"];
    const toolFiles={
      watering:{"初始":"Watering Can","銅":"Copper Watering Can","鋼":"Steel Watering Can","金":"Gold Watering Can","銥":"Iridium Watering Can"},
      pickaxe:{"初始":"Pickaxe","銅":"Copper Pickaxe","鋼":"Steel Pickaxe","金":"Gold Pickaxe","銥":"Iridium Pickaxe"},
      axe:{"初始":"Axe","銅":"Copper Axe","鋼":"Steel Axe","金":"Gold Axe","銥":"Iridium Axe"},
      hoe:{"初始":"Hoe","銅":"Copper Hoe","鋼":"Steel Hoe","金":"Gold Hoe","銥":"Iridium Hoe"},
      trash:{"初始":"Garbage Can","銅":"Trash Can Copper","鋼":"Trash Can Steel","金":"Trash Can Gold","銥":"Trash Can Iridium"}
    };
    const panLevels=["未取得","銅","鋼","金","銥"];
    const panFiles={"未取得":"Copper Pan","銅":"Copper Pan","鋼":"Steel Pan","金":"Gold Pan","銥":"Iridium Pan"};
    const storedPanV68=data.tools?.pan||"";
    const panLevel=storedPanV68&&storedPanV68!=="未取得"?storedPanV68:(progressFactV68("panning")?"銅":"未取得");
    const animalProducts={
      雞:[["Egg","蛋"],["Large Egg","大蛋"]],藍雞:[["Egg","蛋"],["Large Egg","大蛋"]],虛空雞:[["Void Egg","虛空蛋"]],金雞:[["Golden Egg","金蛋"]],
      鴨:[["Duck Egg","鴨蛋"],["Duck Feather","鴨毛"]],兔子:[["Wool","羊毛"],["Rabbit's Foot","兔腳"]],恐龍:[["Dinosaur Egg","恐龍蛋"]],
      牛:[["Milk","牛奶"],["Large Milk","大瓶牛奶"]],山羊:[["Goat Milk","羊奶"],["Large Goat Milk","大瓶羊奶"]],綿羊:[["Wool","羊毛"]],豬:[["Truffle","松露"]],鴕鳥:[["Ostrich Egg","鴕鳥蛋"]]
    };
    const pondFishFileV55=fish=>itemFileZhV26(fish)||fish;
    const pondProducts=fish=>{
      if(!fish)return [];
      const file=pondFishFileV55(fish);
      return POND_PRODUCTS_V55[file]||[[1,"Roe","鱼籽"]];
    };
    const pondableBaseV55=COLLECTIONS.fish.items.map((name,fi)=>({name,fi,file:FISH_ICON_FILES[fi]||itemFileZhV26(name)})).filter(x=>x.file&&!POND_NON_PONDABLE_V55.has(x.file));
    const pondExtraV55=[
      {name:"珊瑚",fi:null,file:"Coral"},{name:"海胆",fi:null,file:"Sea Urchin"},
      {name:"绯红鱼之子",fi:null,file:"Son of Crimsonfish"},{name:"雌鮟鱇鱼",fi:null,file:"Ms. Angler"},{name:"传说之鱼二代",fi:null,file:"Legend II"},{name:"小冰川鱼",fi:null,file:"Glacierfish Jr."},{name:"放射性鲤鱼",fi:null,file:"Radioactive Carp"}
    ];
    const pondableFishV55=[...pondableBaseV55,...pondExtraV55];

    const machineMetaV51={...(window.SDVMachineV51?.byName||{}),...MACHINE_EXTRA_V55};
    const machineDefs={
      artisan:[
        ["bee","蜂房","Bee House",[["Honey","蜂蜜"]]],["cask","木桶","Cask",[["Wine","果酒"],["Cheese","奶酪"],["Beer","啤酒"]]],["cheese","起司壓製機","Cheese Press",[["Cheese","奶酪"],["Goat Cheese","山羊奶酪"]]],["dehydrator","脫水機","Dehydrator",[["Dried Fruit","果乾"],["Dried Mushrooms","乾燥蘑菇"],["Raisins","葡萄乾"]]],["smoker","燻魚機","Fish Smoker",[["Smoked Fish","燻魚"]]],["keg","小桶","Keg",[["Wine","果酒"],["Juice","果汁"],["Coffee","咖啡"],["Green Tea","綠茶"]]],["loom","織布機","Loom",[["Cloth","布料"]]],["mayo","美乃滋機","Mayonnaise Machine",[["Mayonnaise","美乃滋"],["Duck Mayonnaise","鴨美乃滋"],["Void Mayonnaise","虛空美乃滋"]]],["oil","產油機","Oil Maker",[["Truffle Oil","松露油"],["Oil","油"]]],["jar","罐頭瓶","Preserves Jar",[["Jelly","果醬"],["Pickles","醃菜"],["Aged Roe","陳年魚籽"],["Caviar","魚子醬"]]]
      ],
      farm:[
        ["sprinkler","灑水器","Sprinkler",[]],["quality_sprinkler","高級灑水器","Quality Sprinkler",[]],["iridium_sprinkler","銥製灑水器","Iridium Sprinkler",[]],["scarecrow","稻草人","Scarecrow",[]],["deluxe_scarecrow","豪華稻草人","Deluxe Scarecrow",[]],["garden_pot","花盆","Garden Pot",[]],["auto_grabber","自動收集器","Auto-Grabber",[]],["auto_petter","自動撫摸機","Auto-Petter",[]],["heater","加熱器","Heater",[]],["coffee_maker","咖啡機","Coffee Maker",[["Coffee","咖啡"]]],["farm_computer","農場電腦","Farm Computer",[]],["hopper","料斗","Hopper",[]],["workbench","工作台","Workbench",[]],["mini_shipping","迷你出货箱","Mini-Shipping Bin",[]],["sewing","裁缝机","Sewing Machine",[]],["telephone","电话","Telephone",[]],["mini_fridge","迷你冰箱","Mini-Fridge",[]],["mini_jukebox","迷你点唱机","Mini-Jukebox",[]],["blessing_statue","祝福雕像","Statue Of Blessings",[]],["dwarf_king_statue","矮人王雕像","Statue Of The Dwarf King",[]]
      ],
      refining:[
        ["bait_maker","魚餌製造機","Bait Maker",[["Targeted Bait","針對性魚餌"]]],["bone_mill","碎骨機","Bone Mill",[["Basic Fertilizer","肥料"],["Quality Fertilizer","高級肥料"],["Speed-Gro","生長激素"]]],["charcoal","煤炭窯","Charcoal Kiln",[["Coal","煤炭"]]],["crystalarium","寶石複製機","Crystalarium",[["Diamond","鑽石"],["Ruby","紅寶石"],["Jade","翡翠"]]],["deluxe_worm","高級蟲餌盒","Deluxe Worm Bin",[["Deluxe Bait","高級魚餌"]]],["furnace","熔爐","Furnace",[["Copper Bar","銅錠"],["Iron Bar","鐵錠"],["Gold Bar","金錠"],["Iridium Bar","銥錠"]]],["geode","晶球破開器","Geode Crusher",[["Diamond","礦物"],["Earth Crystal","晶體"]]],["heavy_furnace","重型熔爐","Heavy Furnace",[["Copper Bar","銅錠"],["Gold Bar","金錠"],["Iridium Bar","銥錠"]]],["heavy_tapper","重型樹液採集器","Heavy Tapper",[["Maple Syrup","楓糖漿"],["Oak Resin","橡樹樹脂"],["Pine Tar","松焦油"]]],["lightning","避雷針","Lightning Rod",[["Battery Pack","電池組"]]],["mushroom_log","蘑菇樹樁","Mushroom Log",[["Common Mushroom","普通蘑菇"],["Red Mushroom","紅蘑菇"],["Purple Mushroom","紫蘑菇"]]],["ostrich_incubator","鴕鳥孵化器","Ostrich Incubator",[["Ostrich","鴕鳥"]]],["recycling","回收機","Recycling Machine",[["Wood","木材"],["Stone","石頭"],["Refined Quartz","精煉石英"]]],["seed","種子生產器","Seed Maker",[["Parsnip Seeds","作物種子"],["Mixed Seeds","混合種子"]]],["slime_egg","史萊姆壓蛋器","Slime Egg-Press",[["Green Slime Egg","史萊姆蛋"]]],["slime_incubator","史萊姆孵化器","Slime Incubator",[["Green Slime","史萊姆"]]],["solar","太陽能板","Solar Panel",[["Battery Pack","電池組"]]],["tapper","樹液採集器","Tapper",[["Maple Syrup","楓糖漿"],["Oak Resin","橡樹樹脂"],["Pine Tar","松焦油"]]],["wood_chipper","木材削片機","Wood Chipper",[["Wood","木材"]]],["worm_bin","虫饵盒","Worm Bin",[["Bait","鱼饵"]]],["deconstructor","分解机","Deconstructor",[]],["anvil","铁砧","Anvil",[]],["mini_forge","迷你锻造台","Mini-Forge",[]],["crab_pot","蟹笼","Crab Pot",[]]
      ]
    };
    const coopFiles=["Coop","Coop","Big Coop","Deluxe Coop"], barnFiles=["Barn","Barn","Big Barn","Deluxe Barn"];
    const otherMap={well:"水井",mill:"磨坊",stable:"馬廄",slime:"史萊姆窩",cabin:"連線小屋",greenhouse:"溫室",junimo:"祝尼魔小屋"};
    const greenhouseDoneV68=progressFactV68("greenhouse");
    const greenhouseFarmClaimV68=factClaimSourcesV68("greenhouse").includes("farm");
    const buildingLevels=data.buildingLevels||{};
    const setBuildingLevel=(key,value)=>update({buildingLevels:{...buildingLevels,[key]:value}});
    const buildingCount=key=>{
      const bc=data.buildingCounts||{}; if(bc[key]!=null)return Number(bc[key])||0;
      if(key==="coop")return Number(data.buildings?.coop||0)>0?1:0;
      if(key==="barn")return Number(data.buildings?.barn||0)>0?1:0;
      if(key==="silo")return Number(data.buildings?.silos||0);
      if(key==="shed")return Number(data.buildings?.sheds||0);
      return otherMap[key]&&otherBuildings.includes(otherMap[key])?1:0;
    };
    const setBuildingCount=(key,value)=>setData(d=>{
      const legacyCabinsV55=(d.buildings?.other||[]).includes("連線小屋")?1:0;
      const stableMaxV55=Math.max(1,1+Number((d.buildingCounts||{}).cabin??legacyCabinsV55));
      const max=key==="greenhouse"?1:key==="stable"?stableMaxV55:99, v=Math.max(0,Math.min(max,Number(value)||0));
      const buildingCounts={...(d.buildingCounts||{}),[key]:v}; const buildings={...(d.buildings||{})}; let other=[...(buildings.other||[])];
      if(key==="silo")buildings.silos=v; else if(key==="shed")buildings.sheds=v;
      else if(key==="coop"){if(v===0)buildings.coop=0;else if(!Number(buildings.coop||0))buildings.coop=1;}
      else if(key==="barn"){if(v===0)buildings.barn=0;else if(!Number(buildings.barn||0))buildings.barn=1;}
      else if(otherMap[key]){const name=otherMap[key];other=v>0?[...new Set([...other,name])]:other.filter(x=>x!==name);buildings.other=other;}
      return {...d,buildingCounts,buildings};
    });
    const setAnimalCount=(name,value)=>updateNested("animals",{[name]:Math.max(0,Math.min(99,value))});
    const setMachineCount=(key,value)=>update({machines:{...(data.machines||{}),[key]:Math.max(0,Math.min(999,Number(value)||0))}});
    const cycleLevel=(key,levels)=>updateNested("buildings",{[key]:(Number(data.buildings?.[key]||0)+1)%levels.length});
    const FarmTab=({id,label,file})=>{const active=farmSection===id;return <button onClick={()=>setFarmSection(id)} style={{border:`1.5px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:8,padding:"3px 2px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={file} size={25}/><span style={{fontSize:8.4,fontWeight:950,color:active?C.darkBrown:C.muted}}>{label}</span></button>};
    const ProductLine=({name})=>{const ps=animalProducts[name]||[];return <div style={{marginTop:3,minHeight:27}}><div style={{display:"flex",justifyContent:"center",gap:2}}>{ps.map(([file,label])=><span key={file} title={label}><GameIcon file={file} size={18} alt={label}/></span>)}</div><div style={{fontSize:6.8,color:C.muted,fontWeight:800,lineHeight:1.05,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ps.map(x=>x[1]).join("／")}</div></div>};
    const AnimalGrid=({items})=><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{items.map(a=>{const n=Number(data.animals?.[a.name]||0),active=n>0;return <div key={a.name} style={{border:`1.5px solid ${active?C.green:C.line}`,background:active?"#EEF7DD":"#EEE9DE",borderRadius:9,padding:"5px 3px",textAlign:"center",minWidth:0}}><div style={{filter:active?"none":"grayscale(1)",opacity:active?1:.32}}><GameIcon file={ANIMAL_ICON_FILES[a.name]} size={34}/><div style={{fontSize:9,fontWeight:950,color:active?C.ink:C.muted}}>{a.name}</div><ProductLine name={a.name}/></div><div style={{display:"grid",gridTemplateColumns:"22px 1fr 22px",alignItems:"center",gap:2,marginTop:3}}><button onClick={()=>setAnimalCount(a.name,n-1)} style={{border:0,background:C.cream,borderRadius:6,height:21,fontWeight:950,color:C.brown,padding:0}}>−</button><b style={{fontSize:10.5,color:active?C.green:C.muted}}>{n}</b><button onClick={()=>setAnimalCount(a.name,n+1)} style={{border:0,background:C.cream,borderRadius:6,height:21,fontWeight:950,color:C.brown,padding:0}}>＋</button></div></div>})}</div>;
    const BuildingImage=({file,active=true})=><img src={GAME_FILE(file)} alt="" loading="lazy" onError={e=>{e.currentTarget.style.visibility="hidden"}} style={{width:"100%",height:54,objectFit:"contain",imageRendering:"pixelated",filter:active?"none":"grayscale(1)",opacity:active?1:.35}}/>;
    const CountTile=({name,file,count,onMinus,onPlus,sub,onImageClick,products=[],footer=null})=><div style={{border:`1.5px solid ${count>0?C.green:C.line}`,background:count>0?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 4px",textAlign:"center"}}>{onImageClick?<button onClick={onImageClick} style={{display:"block",width:"100%",border:0,background:"transparent",padding:0,cursor:"pointer"}}><BuildingImage file={file} active={count>0}/></button>:<BuildingImage file={file} active={count>0}/>}<div style={{fontSize:9,fontWeight:950,color:C.ink}}>{name}</div>{sub&&<div style={{fontSize:7.5,color:C.muted,fontWeight:850,minHeight:10}}>{sub}</div>}{products.length>0&&<div style={{display:"flex",justifyContent:"center",gap:2,flexWrap:"wrap",minHeight:28,marginTop:3}}>{products.slice(0,4).map(([pf,pl])=><span key={`${pf}-${pl}`} title={pl} style={{display:"inline-flex",flexDirection:"column",alignItems:"center",maxWidth:30}}><GameIcon file={pf} size={18} alt={pl}/><span style={{fontSize:5.8,color:C.muted,fontWeight:850,lineHeight:1,marginTop:1,maxWidth:30,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pl}</span></span>)}</div>}{footer&&<div style={{marginTop:4,paddingTop:4,borderTop:`1px dashed ${C.line}`}}>{footer}</div>}<div style={{display:"grid",gridTemplateColumns:"22px 1fr 22px",gap:2,alignItems:"center",marginTop:4}}><button onClick={onMinus} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>−</button><b style={{fontSize:10.5,color:count>0?C.green:C.muted}}>×{count}</b><button onClick={onPlus} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>＋</button></div></div>;
    const MachineTile=({id,name,file,products})=>{const n=Number(data.machines?.[id]||0),meta=machineMetaV51[file]||{};const lookup=window.SDVLookupV46?.items||[];const ingredientName=x=>{const r=lookup.find(v=>v?.name===x||v?.file===x);return switchNameV47(r?.zh||x,r?.file||x)};const footer=meta.ingredients?.length?<div><div style={{fontSize:6.7,color:C.muted,fontWeight:950,marginBottom:3}}>製作材料</div><div style={{display:"flex",gap:3,justifyContent:"center",flexWrap:"wrap"}}>{meta.ingredients.map((it,i)=><span key={`${file}-${it.name}-${i}`} title={`${ingredientName(it.name)} ×${it.quantity}`} style={{display:"inline-flex",alignItems:"center",gap:1,fontSize:6.4,color:C.brown,fontWeight:900}}><GameIcon file={it.name} size={14}/><span>×{it.quantity}</span></span>)}</div>{meta.sourceZh&&<div style={{fontSize:5.9,color:C.muted,lineHeight:1.2,marginTop:3}}>{meta.sourceZh}</div>}</div>:<div style={{fontSize:6.2,color:C.muted,lineHeight:1.25}}>{meta.sourceZh||meta.obtainZh||"特殊取得／無法直接製作"}</div>;return <CountTile name={name} file={file} products={products} footer={footer} count={n} onMinus={()=>setMachineCount(id,n-1)} onPlus={()=>setMachineCount(id,n+1)}/>};
    return <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:8}}>
        <FarmTab id="animals" label="動物" file="Hay"/>
        <FarmTab id="ponds" label="魚塘" file="Fish Pond"/>
        <FarmTab id="buildings" label="建築" file={houseFiles[Number(data.house||0)]||"House (tier 1)"}/>
        <FarmTab id="tools" label="工具" file={toolFiles.pickaxe?.[data.tools?.pickaxe||"初始"]||"Pickaxe"}/>
      </div>

      {farmSection==="animals"&&<>
        <SectionTitle icon="🐔">動物</SectionTitle>
        <Card style={{padding:8}}><div style={{fontSize:10,fontWeight:950,color:C.brown,marginBottom:5}}>雞舍</div><AnimalGrid items={COOP_ANIMALS}/><div style={{borderTop:`1px dashed ${C.line}`,margin:"8px 0 6px"}}></div><div style={{fontSize:10,fontWeight:950,color:C.brown,marginBottom:5}}>牲口棚</div><AnimalGrid items={BARN_ANIMALS}/></Card>
        <div style={{fontSize:8.5,color:C.muted,marginTop:5,lineHeight:1.4}}>產物列顯示成年動物可能產出的主要物品；大型產物仍會受好感、心情等條件影響。</div>
      </>}

      {farmSection==="ponds"&&<>
        <SectionTitle icon="🐟" right={`${(data.ponds||[]).length} 座`}>魚塘</SectionTitle>
        <Card style={{padding:8}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{(data.ponds||[]).map((p,i)=>{
            const fishIndex=COLLECTIONS.fish.items.indexOf(p.fish), open=pondPicker===i, products=pondProducts(p.fish,p.count);
            return <div key={i} style={{border:`1.5px solid ${open?C.orange:C.line}`,background:open?"#FFF5D8":C.paper,borderRadius:10,padding:"6px 3px 5px",textAlign:"center",minWidth:0}}>
              <button onClick={()=>setPondPicker(open?null:i)} style={{border:0,background:"transparent",padding:0,width:"100%",cursor:"pointer",minWidth:0}}>
                {fishIndex>=0?<img src={ICON_URLS.fish[fishIndex]} alt="" style={{width:38,height:38,imageRendering:"pixelated",objectFit:"contain"}}/>:p.fish?<GameIcon file={pondFishFileV55(p.fish)} size={38}/>:<GameIcon file="Fish Pond" size={38}/>} 
                <div style={{fontSize:9,fontWeight:950,color:C.ink,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:1}}>{p.fish||"未選魚種"}</div>
              </button>
              <div style={{marginTop:3,minHeight:28}}>
                <div style={{display:"flex",justifyContent:"center",gap:3,flexWrap:"wrap"}}>{products.map(([min,file,label])=>{const unlocked=Number(p.count||0)>=min;return <span key={`${file}-${min}`} title={unlocked?label:`${label}・需 ${min} 隻`} style={{display:"inline-flex",flexDirection:"column",alignItems:"center",filter:unlocked?"none":"grayscale(1)",opacity:unlocked?1:.28}}><GameIcon file={file} size={18} alt={label}/>{!unlocked&&<span style={{fontSize:5.8,fontWeight:950,color:C.muted,lineHeight:1}}>需{min}</span>}</span>})}</div>
                <div style={{fontSize:6.8,color:C.muted,fontWeight:800,lineHeight:1.05,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{products.length?products.map(([min,,label])=>Number(p.count||0)>=min?label:`${label}(需${min})`).join("／"):"尚無產出"}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"22px 1fr 22px",alignItems:"center",gap:2,marginTop:4}}>
                <button onClick={()=>{const ponds=[...data.ponds];ponds[i]={...p,count:Math.max(0,Number(p.count||0)-1)};update({ponds})}} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>−</button>
                <b style={{fontSize:10.5,color:Number(p.count||0)>0?C.green:C.muted}}>{Number(p.count||0)}</b>
                <button onClick={()=>{const ponds=[...data.ponds];ponds[i]={...p,count:Math.min(POND_LEGENDARY_V55.has(pondFishFileV55(p.fish))?1:10,Number(p.count||0)+1)};update({ponds})}} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>＋</button>
              </div>
              <div style={{fontSize:7.2,color:open?C.orange:C.muted,fontWeight:900,marginTop:3}}>{open?"▲ 收起魚種":"點魚圖換魚"}</div>
            </div>;
          })}</div>
        </Card>
        {pondPicker!=null&&data.ponds?.[pondPicker]&&<Card style={{padding:8,marginTop:7,background:"#FFF8E2"}}>
          {(()=>{const current=data.ponds[pondPicker];const q=normalizeLookupV54(pondFishQueryV55);const rows=pondableFishV55.filter(x=>!q||normalizeLookupV54(`${x.name} ${switchNameV47(x.name,x.file)} ${x.file}`).includes(q));const rare=pondableFishV55.filter(x=>POND_RARE_V55.includes(x.file));const Pick=({x,compact=false})=>{const on=x.name===current.fish;return <button key={`${compact?"r":"a"}-${x.name}`} onClick={()=>{const ponds=[...data.ponds];const max=POND_LEGENDARY_V55.has(x.file)?1:10;ponds[pondPicker]={...current,fish:x.name,count:Math.min(max,Number(current.count||0))};update({ponds});setPondPicker(null);setPondFishQueryV55("")}} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?C.lightGreen:C.paper,borderRadius:8,padding:compact?"4px 3px":"5px 2px",minHeight:compact?55:64,cursor:"pointer",minWidth:0}}>{x.fi!=null?<img src={ICON_URLS.fish[x.fi]} alt="" loading="lazy" style={{width:compact?27:31,height:compact?27:31,imageRendering:"pixelated",objectFit:"contain"}}/>:<GameIcon file={x.file} size={compact?27:31}/>}<div style={{fontSize:7.5,fontWeight:900,color:C.ink,lineHeight:1.05,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{switchNameV47(x.name,x.file)}</div></button>};return <><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><b style={{fontSize:10.5,color:C.brown,flex:1}}>第 {pondPicker+1} 座魚塘｜選魚</b><button onClick={()=>{setPondPicker(null);setPondFishQueryV55("")}} style={{border:0,background:"transparent",color:C.brown,fontSize:12,fontWeight:950}}>完成</button></div><input value={pondFishQueryV55} onChange={e=>setPondFishQueryV55(e.target.value)} placeholder="搜尋魚名，例如：熔岩鰻魚、水滴魚…" style={{width:"100%",border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:8,padding:"7px 9px",color:C.ink,outline:"none"}}/>{!q&&<><div style={{fontSize:7.7,fontWeight:950,color:C.muted,margin:"7px 0 4px"}}>常用／高價值魚塘</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4}}>{rare.map(x=><Pick key={x.name} x={x} compact/>)}</div></>}<div style={{fontSize:7.7,fontWeight:950,color:C.muted,margin:"8px 0 4px"}}>{q?`搜尋結果 · ${rows.length}`:`全部可養魚種 · ${rows.length}`}</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4,maxHeight:310,overflowY:"auto",WebkitOverflowScrolling:"touch",paddingRight:2}}>{rows.map(x=><Pick key={x.name} x={x}/>)}</div></>})()}
          <button onClick={()=>{const ponds=data.ponds.filter((_,j)=>j!==pondPicker);setPondPicker(null);setPondFishQueryV55("");update({ponds,buildings:{...data.buildings,fishPonds:ponds.length}})}} style={{marginTop:7,border:0,background:"transparent",color:C.red,fontSize:9.5,fontWeight:900,padding:0}}>刪除這座魚塘</button>
        </Card>}
        <button onClick={()=>{const i=(data.ponds||[]).length;const ponds=[...(data.ponds||[]),{fish:"",count:0}];update({ponds,buildings:{...data.buildings,fishPonds:ponds.length}});setPondPicker(i)}} style={{marginTop:6,width:"100%",border:`1.5px dashed ${C.line}`,background:C.cream,borderRadius:9,padding:7,fontWeight:900,color:C.brown,fontSize:10.5}}>＋ 新增魚塘</button>
        <div style={{fontSize:8.5,color:C.muted,marginTop:5,lineHeight:1.4}}>產出會依魚種與目前塘內數量顯示；擴容任務直接在遊戲魚塘查看，手帳不再另外記錄。</div>
      </>}

      {farmSection==="buildings"&&<>
        <SectionTitle icon="🏗️">建築</SectionTitle>
        <Card style={{padding:7}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>
          <button onClick={()=>update({house:(Number(data.house||0)+1)%HOUSE_LEVELS.length})} style={{border:`1.5px solid ${C.green}`,background:"#EEF7DD",borderRadius:10,padding:"5px 4px",textAlign:"center",cursor:"pointer"}}><BuildingImage file={houseFiles[Number(data.house||0)]||"House (tier 1)"} active={true}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>農舍</div><div style={{fontSize:7.5,color:C.green,fontWeight:900,marginTop:2}}>{HOUSE_LEVELS[Number(data.house||0)]}</div><div style={{fontSize:6.8,color:C.muted,marginTop:2}}>點圖升級</div></button>
          <CountTile name="雞舍" file={coopFiles[Number(data.buildings?.coop||0)]||"Coop"} count={buildingCount("coop")} sub={COOP_LEVELS[Number(data.buildings?.coop||0)]} onImageClick={()=>buildingCount("coop")>0&&cycleLevel("coop",COOP_LEVELS)} onMinus={()=>setBuildingCount("coop",buildingCount("coop")-1)} onPlus={()=>setBuildingCount("coop",buildingCount("coop")+1)}/>
          <CountTile name="牲口棚" file={barnFiles[Number(data.buildings?.barn||0)]||"Barn"} count={buildingCount("barn")} sub={BARN_LEVELS[Number(data.buildings?.barn||0)]} onImageClick={()=>buildingCount("barn")>0&&cycleLevel("barn",BARN_LEVELS)} onMinus={()=>setBuildingCount("barn",buildingCount("barn")-1)} onPlus={()=>setBuildingCount("barn",buildingCount("barn")+1)}/>
          <CountTile name="小屋" file={Number(buildingLevels.shed||0)>0?"Big Shed":"Shed"} count={buildingCount("shed")} sub={Number(buildingLevels.shed||0)>0?"大型小屋":"小屋"} onImageClick={()=>buildingCount("shed")>0&&setBuildingLevel("shed",Number(buildingLevels.shed||0)>0?0:1)} onMinus={()=>setBuildingCount("shed",buildingCount("shed")-1)} onPlus={()=>setBuildingCount("shed",buildingCount("shed")+1)}/>
          <CountTile name="筒倉" file="Silo" count={buildingCount("silo")} onMinus={()=>setBuildingCount("silo",buildingCount("silo")-1)} onPlus={()=>setBuildingCount("silo",buildingCount("silo")+1)}/>
          <CountTile name="水井" file="Well" count={buildingCount("well")} onMinus={()=>setBuildingCount("well",buildingCount("well")-1)} onPlus={()=>setBuildingCount("well",buildingCount("well")+1)}/>
          <CountTile name="磨坊" file="Mill" count={buildingCount("mill")} onMinus={()=>setBuildingCount("mill",buildingCount("mill")-1)} onPlus={()=>setBuildingCount("mill",buildingCount("mill")+1)}/>
          <CountTile name="马厩" file="Horse Stable" count={buildingCount("stable")} sub={buildingCount("cabin")>0?`多人：最多 ${1+buildingCount("cabin")} 座（每位玩家 1 座）`:"单人农场最多 1 座"} onMinus={()=>setBuildingCount("stable",buildingCount("stable")-1)} onPlus={()=>setBuildingCount("stable",buildingCount("stable")+1)}/>
          <CountTile name="史萊姆窩" file="Slime Hutch" count={buildingCount("slime")} onMinus={()=>setBuildingCount("slime",buildingCount("slime")-1)} onPlus={()=>setBuildingCount("slime",buildingCount("slime")+1)}/>
          <CountTile name="連線小屋" file="Trailer Cabin Stage 1" count={buildingCount("cabin")} onMinus={()=>setBuildingCount("cabin",buildingCount("cabin")-1)} onPlus={()=>setBuildingCount("cabin",buildingCount("cabin")+1)}/>
          <CountTile name="祝尼魔小屋" file="Junimo Hut" count={buildingCount("junimo")} onMinus={()=>setBuildingCount("junimo",buildingCount("junimo")-1)} onPlus={()=>setBuildingCount("junimo",buildingCount("junimo")+1)}/>
          <button onClick={()=>{if(greenhouseFarmClaimV68)setFactClaimV68("greenhouse","farm",false);else if(greenhouseDoneV68)alert("溫室目前由城鎮修復進度自動成立；若要修正，請到社区中心／Joja 的來源記錄調整。");else setFactClaimV68("greenhouse","farm",true)}} style={{border:`1.5px solid ${greenhouseDoneV68?C.green:C.line}`,background:greenhouseDoneV68?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 4px",textAlign:"center",cursor:"pointer"}}><BuildingImage file="Greenhouse" active={greenhouseDoneV68}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>溫室</div><div style={{fontSize:8,color:greenhouseDoneV68?C.green:C.muted,fontWeight:950,marginTop:3}}>{greenhouseDoneV68?"✓ 已建造":"○ 未建造"}</div>{greenhouseDoneV68&&!greenhouseFarmClaimV68&&<div style={{fontSize:6.6,color:C.muted,marginTop:1}}>由進度聯動</div>}</button>
        </div><div style={{fontSize:8.5,color:C.muted,marginTop:6,lineHeight:1.4}}>點建築圖可切換升級階段；可建造多座的建築用 ± 調整數量；溫室顯示實際解鎖狀態，手動標記不會反推收集包或 Joja 工程。</div></Card>
      </>}

      {farmSection==="tools"&&<>
        <SectionTitle icon="🔧">手持工具</SectionTitle>
        <Card style={{padding:6}}><div style={{display:"grid",gridTemplateColumns:"repeat(6,minmax(0,1fr))",gap:3}}>{TOOL_NAMES.map(([id,name])=>{const level=data.tools?.[id]||"初始",idx=TOOL_LEVELS.indexOf(level);return <button key={id} onClick={()=>updateNested("tools",{[id]:TOOL_LEVELS[(idx+1)%TOOL_LEVELS.length]})} style={{border:`1px solid ${C.line}`,background:C.paper,borderRadius:7,padding:"4px 1px",cursor:"pointer",minWidth:0}}><GameIcon file={toolFiles[id]?.[level]||TOOL_ICON_FILES[id]} size={25}/><div style={{fontSize:6.7,fontWeight:950,color:C.ink,whiteSpace:"nowrap"}}>{name}</div><div style={{fontSize:7,color:C.green,fontWeight:950,marginTop:1}}>{level}</div></button>})}<button onClick={()=>{const idx=panLevels.indexOf(panLevel);updateNested("tools",{pan:panLevels[(idx+1)%panLevels.length]})}} style={{border:`1px solid ${panLevel!=="未取得"?C.green:C.line}`,background:panLevel!=="未取得"?"#EEF7DD":"#EEE9DE",borderRadius:7,padding:"4px 1px",cursor:"pointer",minWidth:0}}><span style={{display:"block",filter:panLevel!=="未取得"?"none":"grayscale(1)",opacity:panLevel!=="未取得"?1:.35}}><GameIcon file={panFiles[panLevel]} size={25}/></span><div style={{fontSize:6.7,fontWeight:950,color:C.ink,whiteSpace:"nowrap"}}>淘金盤</div><div style={{fontSize:7,color:panLevel!=="未取得"?C.green:C.muted,fontWeight:950,marginTop:1}}>{panLevel}</div></button></div><div style={{fontSize:7.6,color:C.muted,marginTop:5,textAlign:"center"}}>點按循環切換等級；淘金盤：未取得 → 銅 → 鋼 → 金 → 銥。</div></Card>
        <SectionTitle icon="🏗️">農場設備</SectionTitle><Card style={{padding:"6px 8px",marginBottom:6,background:"#FFF4D8",fontSize:7.8,color:C.muted,lineHeight:1.35}}>按用途分成工匠加工／精煉功能／農務設備；已補裁縫機、電話、迷你冰箱、迷你點唱機、精通雕像、分解機、鐵砧、迷你鍛造台與蟹籠等實用設施。</Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:4,marginBottom:6}}>{[["artisan","工匠加工","Keg"],["refining","精煉設備","Furnace"],["farm","農務設備","Iridium Sprinkler"]].map(([id,label,file])=><button key={id} onClick={()=>setMachineGroup(id)} style={{border:`1.5px solid ${machineGroup===id?C.orange:C.line}`,background:machineGroup===id?"#FFE2A8":C.paper,borderRadius:8,padding:"4px 2px",fontSize:7.7,fontWeight:950,color:C.brown,minWidth:0}}><GameIcon file={file} size={23}/><div>{label}・{machineDefs[id].length}</div></button>)}</div>
        <Card style={{padding:7}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{(machineDefs[machineGroup]||machineDefs.artisan).map(([id,name,file,products])=><MachineTile key={id} id={id} name={name} file={file} products={products}/>)}</div></Card>
      </>}
    </div>;
  };

  const renderWorldV87 = () => {
    const NAV=WORLD_NAV_V87();
    const nodes=NAV.nodes||{};
    const db=window.SDVWorldV70;
    if(!nodes[NAV.root])return <div><SectionTitle icon="game:Map">世界</SectionTitle><Card style={{padding:10,textAlign:"center",color:C.muted,fontSize:10}}>載入世界資料中…</Card></div>;
    const stack=worldStackV87.filter(id=>nodes[id]);
    const nodeId=stack[stack.length-1]||NAV.root;
    const node=nodes[nodeId];
    const prevNode=stack.length>1?nodes[stack[stack.length-2]]:null;
    const people=db?.people||{}, placesDb=db?.places||[];
    const socialByZh=window.SDVSocialV50?.byZh||{};
    const normalize=value=>String(value||"").normalize("NFKC").toLowerCase().replace(/[\s·・_'’\-／/]+/g,"");
    const person=id=>people[id]||null;
    const socialKey=p=>p?(p.socialKeys||[]).find(k=>socialByZh[k])||null:null;
    const social=p=>{const k=socialKey(p);return k?socialByZh[k]:null};
    const dbPlace=p=>p?.worldPlaceId?placesDb.find(x=>x.id===p.worldPlaceId)||null:null;
    const openItem=async raw=>{const item=String(raw||"").replace(/ Recipe$/,'');await loadLazyDataV67("lookup");const row=lookupRowV54(item);openItemLookupV54(item,row?.file||item)};
    const pushNode=to=>{if(!nodes[to])return;setWorldStackV87(s=>[...s.filter(id=>nodes[id]),to]);setWorldSelV87(null);setWorldQuickV71("")};
    const popNode=()=>{setWorldStackV87(s=>s.length>1?s.slice(0,-1):s);setWorldSelV87(null)};
    const goToAreaV87=areaId=>{
      const target=NAV.areaNode[areaId];if(!target||!nodes[target])return;
      const spot=(nodes[target].spots||[]).find(s=>s.fishAreaId===areaId)||null;
      setWorldStackV87(worldPathToV87(target));
      setWorldSelV87(spot?{kind:"spot",id:spot.id}:null);
      setWorldQuickV71("");setFishAreaV4(areaId);
      requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:"auto"}));
    };
    const pinRows=[
      ...(node.places||[]).map(p=>({p,kind:"place"})),
      ...(node.portals||[]).map(p=>({p,kind:"portal"})),
      ...(node.spots||[]).map(p=>({p,kind:"spot"}))
    ];
    const selRow=worldSelV87?pinRows.find(x=>x.kind===worldSelV87.kind&&x.p.id===worldSelV87.id)||null:null;
    const tapPin=(kind,p)=>{
      if(kind==="portal"&&p.to){pushNode(p.to);return}
      if(kind==="place"&&!window.SDVLookupV46)loadLazyDataV67("lookup");
      const same=worldSelV87&&worldSelV87.kind===kind&&worldSelV87.id===p.id;
      setWorldSelV87(same?null:{kind,id:p.id});
      if(kind==="spot"&&!same)setFishAreaV4(p.fishAreaId);
    };
    const PIN_STYLE={place:{fill:"#B3402A"},portal:{fill:"#D2691E"},spot:{fill:"#2F6E96"}};
    const pinDot=(row,on)=>{
      const {p,kind}=row,st=PIN_STYLE[kind];
      const size=on?15:11;
      return <button key={`${kind}-${p.id}`} onClick={()=>tapPin(kind,p)} aria-label={p.label}
        style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,transform:"translate(-50%,-50%)",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:0,padding:0,cursor:"pointer",zIndex:on?40:4+Math.round(p.y/4)}}>
        <span style={{width:size,height:size,background:st.fill,border:"2px solid #FFF6DC",boxShadow:"0 1px 2.5px rgba(40,20,5,.45)",borderRadius:kind==="portal"?3:"50%",transform:kind==="portal"?"rotate(45deg)":"none",transition:"width .12s,height .12s"}}/>
      </button>;
    };
    const pinLabel=(row)=>{
      const {p,kind}=row;
      const on=selRow&&selRow.kind===kind&&selRow.p.id===p.id;
      const below=p.y<12;
      return <span key={`lb-${kind}-${p.id}`} style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,transform:`translate(-50%,${below?"9px":"calc(-100% - 9px)"})`,pointerEvents:"none",zIndex:on?41:20,border:`1px solid ${on?C.orange:"rgba(139,104,60,.75)"}`,background:on?"#FFD97F":"rgba(255,249,228,.94)",borderRadius:6,padding:"1px 4px",fontSize:6.8,fontWeight:950,color:"#4A2F20",whiteSpace:"nowrap",maxWidth:"46vw",overflow:"hidden",textOverflow:"ellipsis"}}>{p.requires?"🔒 ":""}{p.label}</span>;
    };
    const chipIcon={place:"📍",portal:"➜",spot:"🎣"};
    const pinChip=(row)=>{
      const {p,kind}=row;
      const on=selRow&&selRow.kind===kind&&selRow.p.id===p.id;
      return <button key={`ch-${kind}-${p.id}`} onClick={()=>tapPin(kind,p)} title={p.requires||""}
        style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFE2A8":(kind==="spot"?"#EFF7FC":C.paper),borderRadius:9,padding:"4px 7px",fontSize:7.6,fontWeight:950,color:kind==="spot"?C.blue:C.brown,whiteSpace:"nowrap",flex:"0 0 auto"}}>{chipIcon[kind]} {p.label}</button>;
    };
    const toggleValueV71=(value,list,setter)=>setter(list.includes(value)?list.filter(x=>x!==value):[...list,value]);
    const matchesTimeV71=(windows,segId)=>{const seg=FISH_TIME_SEGMENTS_V42.find(x=>x.id===segId);if(!seg)return true;const [sa,sb]=seg.range;return windows.some(([a,b])=>a<sb&&b>sa)};
    const fishMatchesV71=(area,i)=>{
      const rule=fishRuleV4(i);
      const seasons=area.forceSeasons||area.seasonOverride?.[i]||rule.s||SEASONS;
      if(area.days&&!area.days.includes(Number(data.base.day||1)))return false;
      if(fishSeasonsV42.length&&!fishSeasonsV42.some(x=>seasons.includes(x)))return false;
      if(fishWeathersV42.length&&rule.w!=="任意"&&!fishWeathersV42.includes(rule.w))return false;
      if(fishTimesV42.length){const windows=area.timeOverride||rule.t||[[6,26]];if(!fishTimesV42.some(id=>matchesTimeV71(windows,id)))return false}
      return true;
    };
    const quickLocalAreasV90=FISH_AREAS_V4.filter(a=>(node.spots||[]).some(s=>s.fishAreaId===a.id));
    const quickSpotScope=(!worldQuickAllV90&&quickLocalAreasV90.length)?quickLocalAreasV90:FISH_AREAS_V4;
    const quickFishRows=(()=>{
      const rows=new Map(),q=normalize(worldFishQueryV71);
      quickSpotScope.forEach(area=>(area.fish||[]).forEach(i=>{
        if(!fishMatchesV71(area,i))return;
        const name=COLLECTIONS.fish.items[i],file=FISH_ICON_FILES[i];if(!name)return;
        if(q&&!normalize(`${name} ${switchNameV47(name,file)} ${file}`).includes(q))return;
        if(!rows.has(i))rows.set(i,{i,name,file,spots:[]});
        rows.get(i).spots.push(area);
      }));
      return [...rows.values()].slice(0,60);
    })();
    const filterButtonV71=(label,on,onClick,tint="#FFF4D8")=><button onClick={onClick} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?tint:C.paper,borderRadius:14,padding:"4px 8px",fontSize:8.1,fontWeight:900,color:on?C.darkBrown:C.muted,whiteSpace:"nowrap"}}>{on?"✓ ":""}{label}</button>;
    const clearFishFiltersV71=()=>{setFishSeasonsV42([]);setFishWeathersV42([]);setFishTimesV42([])};
    const renderFishFiltersV71=()=> <Card style={{marginTop:7,padding:7,background:"#FFFDF5"}}>
      <div style={{display:"grid",gap:5}}>
        <div style={{display:"grid",gridTemplateColumns:"34px 1fr",gap:4,alignItems:"start"}}><span style={{fontSize:7.3,fontWeight:900,color:C.muted,paddingTop:5}}>季節</span><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{SEASONS.map(x=>filterButtonV71(x,fishSeasonsV42.includes(x),()=>toggleValueV71(x,fishSeasonsV42,setFishSeasonsV42),`${SEASON_COLORS[x]}30`))}</div></div>
        <div style={{display:"grid",gridTemplateColumns:"34px 1fr",gap:4,alignItems:"start"}}><span style={{fontSize:7.3,fontWeight:900,color:C.muted,paddingTop:5}}>天氣</span><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{["晴","雨"].map(x=>filterButtonV71(x,fishWeathersV42.includes(x),()=>toggleValueV71(x,fishWeathersV42,setFishWeathersV42),x==="雨"?"#DCEBFA":"#FFF0B8"))}</div></div>
        <div style={{display:"grid",gridTemplateColumns:"34px 1fr",gap:4,alignItems:"start"}}><span style={{fontSize:7.3,fontWeight:900,color:C.muted,paddingTop:5}}>時間</span><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{FISH_TIME_SEGMENTS_V42.map(x=>filterButtonV71(x.name,fishTimesV42.includes(x.id),()=>toggleValueV71(x.id,fishTimesV42,setFishTimesV42),"#E5EDF2"))}</div></div>
      </div>
      {(fishSeasonsV42.length||fishWeathersV42.length||fishTimesV42.length)?<button onClick={clearFishFiltersV71} style={{border:0,background:"transparent",fontSize:7.6,color:C.blue,fontWeight:900,marginTop:5,padding:0}}>清除條件</button>:null}
    </Card>;
    const openQuickFishV71=()=>{setWorldQuickV71(worldQuickV71==="fish"?"":"fish");setWorldQuickAllV90(true);setWorldFishQueryV71("");if(slotSelV93&&!fishTimesV42.length)setFishTimesV42([slotSelV93.id]);if(todayWeatherV69&&!fishWeathersV42.length)setFishWeathersV42([todayWeatherV69]);if(!fishSeasonsV42.length)setFishSeasonsV42([data.base.season]);if(todayWeatherV69&&!fishWeathersV42.length)setFishWeathersV42([todayWeatherV69])};
    const openQuickNpcV92=()=>setWorldQuickV71(worldQuickV71==="npc"?"":"npc");
    const PlaceDetailV87=({row})=>{
      const p=row.p,place=dbPlace(p);
      const owner=place?person(place.ownerId):null;
      const navNpcKeysV90=(p.npcs||[]).filter(k=>socialByZh[k]);
      const ownerKeyV90=owner?socialKey(owner):null;
      const shopKeyV90=(ownerKeyV90&&socialByZh[ownerKeyV90]?.shop)?ownerKeyV90:(navNpcKeysV90.find(k=>socialByZh[k]?.shop)||null);
      const shop=shopKeyV90?socialByZh[shopKeyV90]?.shop||null:null;
      const members=place?(place.peopleIds||[]).map(id=>person(id)).filter(Boolean):[];
      const npcChipsV90=[
        ...members.map(m=>({key:socialKey(m),name:m.name,icon:m.icon})),
        ...navNpcKeysV90.filter(k=>!members.some(m=>socialKey(m)===k)).map(k=>({key:k,name:k,icon:socialByZh[k]?.english||"Friendship 101"}))
      ];
      const serviceKeyV90=ownerKeyV90||navNpcKeysV90[0]||null;
      const extraServices=serviceKeyV90&&NPC_SERVICES_V55[serviceKeyV90]?(NPC_SERVICES_V55[serviceKeyV90]||[]).map(x=>x[1]):[];
      const footerNpcV90=ownerKeyV90?{key:ownerKeyV90,name:owner.name}:(navNpcKeysV90[0]?{key:navNpcKeysV90[0],name:navNpcKeysV90[0]}:null);
      const services=[...new Set([...(place?.services||[]),...extraServices].filter(Boolean))];
      const hours=shop?.hours||place?.hours||"";
      const requires=p.requires||place?.requires||"";
      const description=p.description||"";
      const jojaClosedV92=p.worldPlaceId==="joja"&&progressFlagsV92(data).ccDone;
      return <Card style={{marginTop:7,padding:8,borderColor:C.orange,background:"#FFF8E9"}}>
        <div style={{display:"grid",gridTemplateColumns:"38px minmax(0,1fr)",gap:7,alignItems:"center"}}><GameIcon file={place?.icon||"Map"} size={36}/><div style={{minWidth:0}}><span style={{fontSize:6.5,fontWeight:900,color:"#9A5B22",background:"#FFE8A8",borderRadius:7,padding:"1px 5px"}}>地點</span><b style={{display:"block",fontSize:11.5,color:C.darkBrown,lineHeight:1.2,marginTop:2}}>{p.label}</b>{hours&&<div style={{fontSize:7.6,color:C.muted,marginTop:2}}>{hours}</div>}</div></div>
        {requires&&<div style={{marginTop:6,padding:"5px 7px",borderRadius:7,background:"#FFF0C8",fontSize:8,color:C.brown,lineHeight:1.35}}><b>解鎖：</b>{requires}</div>}
        {jojaClosedV92&&<div style={{marginTop:6,padding:"6px 8px",borderRadius:7,background:"#EFE7DA",border:`1px dashed ${C.line}`,fontSize:8.2,color:C.brown,fontWeight:900}}>🚪 已歇業——社區中心修復完成後，Joja超市關門了。</div>}
        {(()=>{const S=window.SDVNpcScheduleV91;if(!S?.resolve||jojaClosedV92)return null;
          const day=Number(data.base.day||1);
          const wd=["一","二","三","四","五","六","日"][(day-1)%7];
          const fest=dayCalendarItems(day).find(x=>x.type==="festival");
          const fmt=t=>{const h=Math.floor(t/100),m=t%100;return `${h>=24?h-24:h}:${String(m).padStart(2,"0")}`};
          if(fest)return <div style={{marginTop:6,padding:"5px 7px",borderRadius:7,background:"#FFF1CF",fontSize:7.6,color:C.brown,fontWeight:900}}>🎪 {fest.text}：節日日以會場為準{festVenueLabelV94(fest.key)?`（${festVenueLabelV94(fest.key)}）`:""}，平日到訪不適用。</div>;
          const flags=progressFlagsV92(data);
          const vis=[];
          for(const nm of Object.keys(S.npcs)){const r=S.resolve(nm,{season:data.base.season,day,rain:todayWeatherV69==="雨",...flags});
            r.entries.forEach((seg,i)=>{const loc=seg[1];if(loc.node===nodeId&&loc.pin===p.id){vis.push({nm,s:seg[0],e:r.entries[i+1]?.[0]})}})}
          vis.sort((a,b)=>a.s-b.s||a.nm.localeCompare(b.nm));
          if(!vis.length)return null;
          return <div style={{marginTop:7}}><div style={{fontSize:7.5,color:C.muted,fontWeight:950,marginBottom:3}}>👥 今天誰會來（{data.base.season}{day}・週{wd}{slotSelV93?`・${slotSelV93.label}時段標記`:""}）</div><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{vis.map((v,i)=>{const hit=slotSelV93&&v.s<slotSelV93.to&&(v.e??2800)>slotSelV93.from;return <button key={i} onClick={()=>openSocialNpcV55(v.nm)} style={{border:`1.5px solid ${hit?C.orange:C.line}`,background:hit?"#FFE2A8":C.cream,borderRadius:8,padding:"2px 7px 2px 2px",display:"inline-flex",alignItems:"center",gap:3,fontSize:7.3,fontWeight:900,color:C.brown}}><GameIcon file={socialByZh[v.nm]?.english||"Friendship 101"} size={20}/>{(!v.e&&v.s<=600)?"整天":`${fmt(v.s)}${v.e?`–${fmt(v.e)}`:" 起"}`} {v.nm} ›</button>})}</div></div>})()}
        {description&&<div style={{fontSize:8,color:C.ink,lineHeight:1.4,marginTop:6}}>{description}</div>}
        {!jojaClosedV92&&services.length>0&&<div style={{marginTop:7}}><div style={{fontSize:7.5,color:C.muted,fontWeight:950,marginBottom:3}}>可以做什麼</div><div style={{display:"grid",gap:3}}>{services.map(x=><div key={x} style={{display:"grid",gridTemplateColumns:"10px 1fr",gap:3,fontSize:8.4,color:C.ink,lineHeight:1.35}}><span>•</span><span>{x}</span></div>)}</div></div>}
        {npcChipsV90.length>0&&<div style={{marginTop:7}}><div style={{fontSize:7.5,color:C.muted,fontWeight:950,marginBottom:4}}>相關人物</div><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{npcChipsV90.map(m=>{const can=Boolean(m.key);return <button key={m.name} disabled={!can} onClick={()=>can&&openSocialNpcV55(m.key)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"3px 6px 3px 3px",display:"inline-flex",alignItems:"center",gap:3,fontSize:7.8,fontWeight:900,color:C.brown,opacity:can?1:.7}}><GameIcon file={m.icon} size={22}/>{m.name}{can?" ›":""}</button>})}</div></div>}
        {!jojaClosedV92&&shop?.items?.length>0&&<div style={{marginTop:7}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6}}><span style={{fontSize:7.5,color:C.muted,fontWeight:950}}>商店內容節選</span><span style={{fontSize:6.8,color:C.muted}}>{shop.hours||""}</span></div><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4,marginTop:4}}>{shop.items.slice(0,8).map((it,i)=>{const raw=String(it.name||"").replace(/ Recipe$/,'');const recipe=/ Recipe$/.test(String(it.name||""));const cardOkV90=!window.SDVLookupV46||Boolean(lookupRowV54(raw));return <button key={`${p.id}-${it.name}-${i}`} disabled={!cardOkV90} title={cardOkV90?"":"此物品暫無詳細卡"} onClick={()=>cardOkV90&&openItem(it.name)} style={{border:`1px solid ${C.line}`,background:"#FFFDF5",borderRadius:7,padding:"4px 2px",minWidth:0}}><GameIcon file={raw||"Chest"} size={25}/><div style={{fontSize:6.8,fontWeight:900,color:C.ink,lineHeight:1.08,marginTop:2,overflow:"hidden",textOverflow:"ellipsis"}}>{switchNameV47(raw,raw)}{recipe?"配方":""}</div>{it.price!=null&&<div style={{fontSize:6.3,color:C.muted,marginTop:1}}>{Number(it.price).toLocaleString()}g</div>}</button>})}</div></div>}
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:7,paddingTop:6,borderTop:`1px dashed ${C.line}`}}>
          {p.worldPlaceId==="community_center"&&<button onClick={()=>openTownRepairV69("")} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:7.7,fontWeight:900,color:C.brown}}>打開城鎮修復 ›</button>}
          {footerNpcV90&&npcChipsV90.length===0&&<button onClick={()=>openSocialNpcV55(footerNpcV90.key)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:7.7,fontWeight:900,color:C.brown}}>查看 {footerNpcV90.name} ›</button>}
        </div>
      </Card>;
    };
    const SpotDetailV87=({row})=>{
      const area=FISH_AREAS_V4.find(a=>a.id===row.p.fishAreaId)||null;
      if(!area)return <Card style={{marginTop:7,padding:9,fontSize:8.5,color:C.muted}}>這個釣點還沒有對應魚類資料。</Card>;
      const spotRows=(area.fish||[]).filter(i=>fishMatchesV71(area,i));
      return <div style={{marginTop:7}}>
        <Card style={{padding:8,background:"#FFF8E2"}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file={area.icon} size={34}/><div style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:12,color:C.darkBrown}}>{node.name} · {area.sub}</b>{area.tip&&<div style={{fontSize:7.5,color:C.brown,lineHeight:1.35,marginTop:2}}>{area.tip}</div>}</div><span style={{fontSize:8,color:C.muted,fontWeight:900}}>{spotRows.length} 種</span></div></Card>
        {renderFishFiltersV71()}
        <div style={{display:"grid",gap:5,marginTop:7}}>{spotRows.map(i=>renderFishCardV4(i,area,true,false,true))}</div>
        {!spotRows.length&&<Card style={{marginTop:7,padding:10,textAlign:"center",fontSize:9,color:C.muted}}>這個釣點目前沒有符合條件的魚。</Card>}
      </div>;
    };
    const mapSrc=node.mapKey?GAME_FILE(node.mapKey):"";
    const legendBits=[(node.places||[]).length?"📍 地點":"",(node.portals||[]).length?"➜ 入口／交通":"",(node.spots||[]).length?"🎣 釣點":""].filter(Boolean);
    return <div>
      <SectionTitle icon="game:Map">世界</SectionTitle>
      <div style={{display:"flex",alignItems:"center",gap:7,margin:"3px 1px 6px"}}>
        <div style={{minWidth:0,flex:1}}><b style={{display:"block",fontSize:12,color:C.darkBrown}}>{node.name}</b><span style={{display:"block",fontSize:7.4,color:C.muted,lineHeight:1.3,marginTop:1}}>{node.summary||""}</span></div>
        <button onClick={openQuickFishV71} style={{border:`1px solid ${worldQuickV71==="fish"?C.orange:C.line}`,background:worldQuickV71==="fish"?"#FFF0C8":C.cream,borderRadius:8,padding:"5px 8px",fontSize:7.6,fontWeight:950,color:C.blue,whiteSpace:"nowrap",flex:"0 0 auto"}}>🎣 按條件找魚</button><button onClick={openQuickNpcV92} style={{border:`1px solid ${worldQuickV71==="npc"?C.orange:C.line}`,background:worldQuickV71==="npc"?"#EAF2FA":C.cream,borderRadius:8,padding:"5px 8px",fontSize:7.6,fontWeight:950,color:C.blue,whiteSpace:"nowrap",flex:"0 0 auto"}}>👤 找人</button>
      </div>
      {worldQuickV71==="fish"&&<Card style={{padding:8,background:"#FFF8E2",marginBottom:7}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}><b style={{fontSize:10.5,color:C.darkBrown,flex:1}}>按條件找魚 · {(!worldQuickAllV90&&quickLocalAreasV90.length)?node.name:"全世界"}</b>{quickLocalAreasV90.length>0&&<button onClick={()=>setWorldQuickAllV90(!worldQuickAllV90)} style={{border:`1.5px solid ${worldQuickAllV90?C.line:C.orange}`,background:worldQuickAllV90?C.paper:"#FFE2A8",borderRadius:9,padding:"3px 7px",fontSize:7.4,fontWeight:950,color:C.brown,flex:"0 0 auto"}}>{worldQuickAllV90?`只看${node.name}`:"看全世界"}</button>}<button onClick={()=>setWorldQuickV71("")} style={{border:0,background:"transparent",fontSize:12,color:C.brown,fontWeight:950}}>×</button></div>
        <input value={worldFishQueryV71} onChange={e=>setWorldFishQueryV71(e.target.value)} placeholder="魚名可選填，例如：鲶鱼、Catfish…" style={{width:"100%",border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:8,padding:"7px 9px",fontSize:9.2,color:C.ink,outline:"none",marginTop:6}}/>
        {renderFishFiltersV71()}
        <div style={{fontSize:7.4,color:C.muted,fontWeight:900,marginTop:6}}>找到 {quickFishRows.length} 種魚</div>
        <div style={{display:"grid",gap:5,marginTop:5,maxHeight:340,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>{quickFishRows.map(row=><div key={row.i} style={{border:`1px solid ${C.line}`,background:C.paper,borderRadius:8,padding:6,display:"grid",gridTemplateColumns:"34px minmax(0,1fr)",gap:6,alignItems:"start"}}><GameIcon file={row.file} size={32}/><div style={{minWidth:0}}><b style={{display:"block",fontSize:9.4,color:C.ink}}>{switchNameV47(row.name,row.file)}</b><div style={{fontSize:6.9,color:C.muted,marginTop:1}}>{formatFishTimeV4(fishRuleV4(row.i))}</div><div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4}}>{row.spots.map(area=>{const nn=nodes[NAV.areaNode[area.id]];return <button key={`${row.i}-${area.id}`} onClick={()=>goToAreaV87(area.id)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"3px 5px",fontSize:6.8,fontWeight:900,color:C.brown}}>{nn?.name||area.name} → {area.sub}</button>})}</div></div></div>)}</div>
        {!quickFishRows.length&&<div style={{fontSize:8.5,color:C.muted,textAlign:"center",padding:10}}>目前沒有符合條件的魚。</div>}
      </Card>}
      {worldQuickV71==="npc"&&(()=>{const S=window.SDVNpcScheduleV91;if(!S?.resolve)return null;
        const season=npcFindSeasonV92||data.base.season;
        const day=npcFindDayV92!=null?npcFindDayV92:Number(data.base.day||1);
        const rain=npcFindRainV92!=null?npcFindRainV92:(todayWeatherV69==="雨");
        const flags=progressFlagsV92(data);
        const wd=["一","二","三","四","五","六","日"][(day-1)%7];
        const fest=(season===data.base.season)?dayCalendarItems(day).find(x=>x.type==="festival"):null;
        const fmt=t=>{const h=Math.floor(t/100),m=t%100;return `${h>=24?h-24:h}:${String(m).padStart(2,"0")}`};
        const effSel=npcFindTimeV92==="auto"?(slotSelV93?slotSelV93.rep:null):npcFindTimeV92;
        const effT=(npcFindViewV92==="place"&&effSel==null)?1300:effSel;
        const locAt=(es,t)=>{let cur=es[0][1];for(const seg of es){if(seg[0]<=t)cur=seg[1];else break}return cur};
        const NQ=(typeof normalizeSearchV88==="function")?normalizeSearchV88:(x=>String(x||"").trim().toLowerCase());
        const q=NQ(npcFindQueryV92);
        const names=Object.keys(S.npcs).filter(n=>{if(!q)return true;const eng=String(socialByZh[n]?.english||"").toLowerCase();return NQ(n).includes(q)||String(NPC_SIMP_V92[n]||"").includes(q)||(NPC_LEGACY_V95[n]||[]).some(a=>NQ(a).includes(q))||eng.includes(String(npcFindQueryV92).trim().toLowerCase())});
        const rows=names.map(n=>({n,r:S.resolve(n,{season,day,rain,...flags})}));
        const pill=(on)=>({border:`1px solid ${on?C.orange:C.line}`,background:on?"#FFE2A8":C.paper,borderRadius:8,padding:"3px 7px",fontSize:7.4,fontWeight:900,color:C.brown});
        const locBtn=(loc,extra)=>({border:`1px solid ${C.line}`,background:loc.node?C.cream:"#F3EDDE",borderRadius:8,fontWeight:900,color:C.brown,...extra});
        return <Card style={{padding:8,background:"#EAF2FA",marginBottom:7}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><b style={{fontSize:10.5,color:C.darkBrown,flex:1}}>按條件找人 · {season}{day}・週{wd}{rain?"・雨":"・晴"}{npcFindTimeV92==="auto"&&slotSelV93?`・${slotSelV93.label}`:""}</b><button onClick={()=>setNpcFindAdvV92(!npcFindAdvV92)} style={pill(npcFindAdvV92)}>進階</button><button onClick={()=>setWorldQuickV71("")} style={{border:0,background:"transparent",fontSize:12,color:C.brown,fontWeight:950}}>×</button></div>
          {npcFindAdvV92&&<div style={{marginTop:6,display:"grid",gap:5}}>
            <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:7,color:C.muted,fontWeight:950}}>季節</span>{[[null,"跟手帳"],["春","春"],["夏","夏"],["秋","秋"],["冬","冬"]].map(([v,l])=><button key={l} onClick={()=>setNpcFindSeasonV92(v)} style={pill(npcFindSeasonV92===v)}>{l}</button>)}</div>
            <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:7,color:C.muted,fontWeight:950}}>日期</span><button onClick={()=>setNpcFindDayV92(Math.max(1,day-1))} style={pill(false)}>−</button><b style={{fontSize:8.6,color:C.ink}}>{day}</b><button onClick={()=>setNpcFindDayV92(Math.min(28,day+1))} style={pill(false)}>＋</button><button onClick={()=>setNpcFindDayV92(null)} style={pill(npcFindDayV92==null)}>跟手帳</button><span style={{fontSize:7,color:C.muted,fontWeight:950,marginLeft:6}}>天氣</span>{[[null,"跟手帳"],[false,"晴"],[true,"雨"]].map(([v,l])=><button key={l} onClick={()=>setNpcFindRainV92(v)} style={pill(npcFindRainV92===v)}>{l}</button>)}</div>
          </div>}
          <input value={npcFindQueryV92} onChange={e=>setNpcFindQueryV92(e.target.value)} placeholder="人名可選填，例如：罗宾、羅賓、Robin…" style={{width:"100%",border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:8,padding:"7px 9px",fontSize:9.2,color:C.ink,outline:"none",marginTop:6}}/>
          <div style={{display:"flex",gap:4,alignItems:"center",marginTop:6,flexWrap:"wrap"}}>{[["npc","按人"],["place","按地點"]].map(([v,l])=><button key={v} onClick={()=>setNpcFindViewV92(v)} style={pill(npcFindViewV92===v)}>{l}</button>)}<span style={{width:1,height:14,background:C.line}}/>{[["auto","跟手帳"],[null,"整日"],...TIME_SLOTS_V93.map(x=>[x.rep,x.label])].map(([v,l])=><button key={l} onClick={()=>setNpcFindTimeV92(v)} style={pill(npcFindTimeV92===v)}>{l}</button>)}</div>
          {fest?<div style={{marginTop:7,padding:"7px 9px",borderRadius:8,background:"#FFF1CF",border:`1px solid ${C.line}`,fontSize:8.4,color:C.brown,fontWeight:900}}>🎪 {fest.text}：節日日以會場為準{festVenueLabelV94(fest.key)?`（${festVenueLabelV94(fest.key)}）`:""}，平日行程不適用。</div>
          :npcFindViewV92==="npc"?<div style={{display:"grid",gap:4,marginTop:6,maxHeight:340,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>{rows.map(({n,r})=>{const es=r.entries;const cur=effT!=null?locAt(es,effT):null;return <div key={n} style={{border:`1px solid ${C.line}`,background:C.paper,borderRadius:8,padding:"5px 6px",display:"grid",gridTemplateColumns:"minmax(0,92px) minmax(0,1fr)",gap:6,alignItems:"start"}}><button onClick={()=>openSocialNpcV55(n)} style={{border:0,background:"transparent",padding:0,display:"inline-flex",alignItems:"center",gap:4,minWidth:0}}><GameIcon file={socialByZh[n]?.english||"Friendship 101"} size={24}/><b style={{fontSize:8.6,color:C.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n}</b></button>{cur?<button disabled={!cur.node} onClick={()=>cur.node&&goToWorldV88(cur.node,cur.pin?{kind:"place",id:cur.pin}:null)} style={locBtn(cur,{justifySelf:"start",padding:"3px 7px",fontSize:7.8})}>{cur.zh}{cur.node?" ›":""}</button>:<div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{es.map((seg,i)=><button key={i} disabled={!seg[1].node} onClick={()=>seg[1].node&&goToWorldV88(seg[1].node,seg[1].pin?{kind:"place",id:seg[1].pin}:null)} style={locBtn(seg[1],{padding:"2px 6px",fontSize:7})}>{fmt(seg[0])} {seg[1].zh}{seg[1].node?" ›":""}</button>)}</div>}</div>})}</div>
          :(()=>{const groups=new Map();rows.forEach(({n,r})=>{const loc=locAt(r.entries,effT);const k=loc.zh;if(!groups.has(k))groups.set(k,{loc,list:[]});groups.get(k).list.push(n)});return <div style={{display:"grid",gap:5,marginTop:6,maxHeight:340,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>{[...groups.values()].sort((a,b)=>b.list.length-a.list.length).map(g=><div key={g.loc.zh} style={{border:`1px solid ${C.line}`,background:C.paper,borderRadius:8,padding:"5px 6px"}}><button disabled={!g.loc.node} onClick={()=>g.loc.node&&goToWorldV88(g.loc.node,g.loc.pin?{kind:"place",id:g.loc.pin}:null)} style={{border:0,background:"transparent",padding:0,fontSize:8.8,fontWeight:950,color:C.darkBrown}}>📍 {g.loc.zh}{g.loc.node?" ›":""}<span style={{fontSize:7,color:C.muted,fontWeight:900}}> · {g.list.length} 人</span></button><div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4}}>{g.list.map(n=><button key={n} onClick={()=>openSocialNpcV55(n)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"2px 6px 2px 2px",display:"inline-flex",alignItems:"center",gap:3,fontSize:7.4,fontWeight:900,color:C.brown}}><GameIcon file={socialByZh[n]?.english||"Friendship 101"} size={20}/>{n} ›</button>)}</div></div>)}</div>})()}
          {!flags.busFixed&&<div style={{fontSize:6.8,color:C.muted,marginTop:5}}>公交尚未修復：涉及公交／沙漠的段落與實際不符（資料採已修復班表）。</div>}
        </Card>})()}
      {prevNode&&<button onClick={popNode} style={{width:"100%",border:`1.5px solid ${C.orange}`,background:"#FFF4D8",borderRadius:10,padding:"7px 9px",display:"grid",gridTemplateColumns:"24px minmax(0,1fr) 16px",gap:7,alignItems:"center",textAlign:"left",marginBottom:6,boxShadow:"0 2px 5px rgba(96,67,33,.10)"}}><GameIcon file="Map" size={23}/><span style={{minWidth:0}}><b style={{display:"block",fontSize:10,color:C.darkBrown}}>← 返回{prevNode.name}</b><span style={{display:"block",fontSize:6.8,color:C.muted,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{stack.map(id=>nodes[id]?.name||id).join(" › ")}</span></span><span style={{fontSize:14,color:C.orange,fontWeight:950}}>‹</span></button>}
      <Card style={{padding:7}}>
        <div style={{position:"relative",overflow:"hidden",borderRadius:9,border:`1px solid ${C.line}`,background:"#DCE9C2"}}>
          {mapSrc?<WikiImg src={mapSrc} alt={`${node.name}地圖`} style={{display:"block",width:"100%",height:"auto",imageRendering:"pixelated"}}/>:<div style={{minHeight:180,display:"flex",alignItems:"center",justifyContent:"center",padding:18,color:C.muted,fontSize:9,textAlign:"center"}}>{node.name}目前沒有地圖圖檔，用下方清單選擇。</div>}
          {mapSrc&&pinRows.map(row=>pinDot(row,selRow===row))}
          {mapSrc&&pinRows.map(row=>pinLabel(row))}
        </div>
        {legendBits.length>0&&<div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap",fontSize:6.8,color:C.muted,marginTop:5}}>{legendBits.map(x=><span key={x}>{x}</span>)}</div>}
        <div style={{display:"flex",gap:4,overflowX:"auto",WebkitOverflowScrolling:"touch",padding:"6px 1px 1px"}}>{pinRows.map(row=>pinChip(row))}</div>
      </Card>
      {selRow&&selRow.kind==="place"&&<PlaceDetailV87 row={selRow}/>}
      {selRow&&selRow.kind==="spot"&&<SpotDetailV87 row={selRow}/>}
      {(()=>{const S=window.SDVNpcScheduleV91;if(!S?.resolve)return null;
        const day=Number(data.base.day||1);
        const fest=dayCalendarItems(day).find(x=>x.type==="festival");
        if(fest)return null;
        const fmt=t=>{const h=Math.floor(t/100),m=t%100;return `${h>=24?h-24:h}:${String(m).padStart(2,"0")}`};
        const flags=progressFlagsV92(data);
        const groups=new Map();
        for(const nm of Object.keys(S.npcs)){const r=S.resolve(nm,{season:data.base.season,day,rain:todayWeatherV69==="雨",...flags});
          r.entries.forEach((sg,i)=>{const loc=sg[1];if(loc.node===nodeId&&!loc.pin){const kk=loc.zh;if(!groups.has(kk))groups.set(kk,[]);groups.get(kk).push({nm,s:sg[0],e:r.entries[i+1]?.[0]})}})}
        if(!groups.size)return null;
        return <Card style={{marginTop:7,padding:8}}>
          <div style={{fontSize:8,color:C.muted,fontWeight:950,marginBottom:4}}>👥 本區今天誰會來（{data.base.season}{day}{slotSelV93?`・${slotSelV93.label}時段標記`:""}）</div>
          {[...groups.entries()].map(([zh,list])=><div key={zh} style={{marginTop:4}}>
            <div style={{fontSize:8.2,fontWeight:950,color:C.darkBrown}}>📍 {zh}</div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:3}}>{list.sort((a,b)=>a.s-b.s).map((v,i)=>{const hit=slotSelV93&&v.s<slotSelV93.to&&(v.e??2800)>slotSelV93.from;return <button key={i} onClick={()=>openSocialNpcV55(v.nm)} style={{border:`1.5px solid ${hit?C.orange:C.line}`,background:hit?"#FFE2A8":C.cream,borderRadius:8,padding:"2px 6px 2px 2px",display:"inline-flex",alignItems:"center",gap:3,fontSize:7.3,fontWeight:900,color:C.brown}}><GameIcon file={socialByZh[v.nm]?.english||"Friendship 101"} size={20}/>{(!v.e&&v.s<=600)?"整天":`${fmt(v.s)}${v.e?`–${fmt(v.e)}`:" 起"}`} {v.nm} ›</button>})}</div>
          </div>)}
        </Card>})()}
      {!selRow&&!worldQuickV71&&<div style={{fontSize:7.6,color:C.muted,textAlign:"center",padding:"7px 0 1px"}}>點地圖上的針或下方標籤：📍 看地點資料、🎣 直接看這裡的魚、➜ 進入下一張地圖。</div>}
    </div>;
  };

  const renderData = () => {
    const DataTab=({id,label,file})=>{const active=dataSection===id;return <button onClick={()=>setDataSection(id)} style={{border:`1.5px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:9,padding:"5px 3px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={file} size={30}/><span style={{fontSize:8.8,fontWeight:950,color:active?C.darkBrown:C.muted}}>{label}</span></button>};
    return <div><SectionTitle icon="game:Stardew Valley Almanac">資料</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:7}}><DataTab id="skills" label="角色" file="Stardew Hero Trophy"/><DataTab id="farm" label="農場" file="Farm Computer"/><DataTab id="bundles" label="社區" file="Golden Scroll"/><DataTab id="collection" label="收藏" file="Treasure Chest"/></div>{dataSection==="skills"&&renderSkills()}{dataSection==="farm"&&renderFarm()}{dataSection==="bundles"&&renderBundles()}{dataSection==="collection"&&renderCollection()}</div>;
  };

  const renderPeople = () => {
    const g=NPC_GROUPS.find(x=>x.id===socialGroup)||NPC_GROUPS[0];
    const socialV50=window.SDVSocialV50?.byZh||{};
    const lookupRowsV50=window.SDVLookupV46?.items||[];
    const seasonEnV50={春:"spring",夏:"summer",秋:"fall",冬:"winter"}[data.base.season]||"spring";
    const genericGiftV50=item=>Boolean(SOCIAL_GENERIC_V55[String(item||"")])||/^(All |Any |Most |Every |Universal )|\(except|except |items$|category$/i.test(String(item||""));
    const socialNameZhV50={Chicken:"雞",Cow:"牛",Goat:"山羊",Duck:"鴨",Sheep:"綿羊",Rabbit:"兔子",Pig:"豬"};
    const giftMetaV50=item=>{
      const raw=String(item||"");
      const special=SOCIAL_SPECIAL_ITEM_V55[raw];
      const genericMeta=SOCIAL_GENERIC_V55[raw];
      const row=lookupRowV54(raw)||lookupRowsV50.find(r=>r?.name===raw||r?.file===raw||r?.zh===raw);
      const generic=Boolean(genericMeta)||genericGiftV50(raw);
      const file=genericMeta?.file||special?.file||row?.file||(!generic?raw:"");
      const canLookup=!generic&&!special&&Boolean(row);
      const name=genericMeta?.name||special?.name||socialNameZhV50[raw]||switchNameV47(row?.zh||raw,file);
      const source=generic?"通用喜好分類":(special?.source||(row?((row?.sources||[])[0]||"點擊查看詳細用途／來源"):"特殊物品／分類"));
      return {raw,file,key:row?.file||file||raw,name,source,generic,canLookup};
    };
    const socialRowsV55=(npc,profile,fallback,cat)=>{const key={loves:"love",likes:"like",hates:"hate"}[cat];const rich=profile?.[cat];const clean=rows=>(rows||[]).filter(x=>!/见百科|見百科/.test(String(x)));if(Array.isArray(rich)){const rows=clean(rich);return rows.length?rows:(SOCIAL_EMPTY_RULES_V55[npc]?.[cat]||[])}return clean(fallback?.[key]||[])};
    const ServicesV55=({npc})=>{const rows=NPC_SERVICES_V55[npc]||[];if(!rows.length)return null;return <div style={{marginTop:9,paddingTop:8,borderTop:`1px dashed ${C.line}`}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><GameIcon file="Workbench" size={25}/><b style={{fontSize:10.5,color:C.darkBrown}}>功能／服務</b></div><div style={{display:"grid",gap:5}}>{rows.map(([file,title,desc])=><div key={title} style={{display:"flex",alignItems:"center",gap:7,border:`1px solid ${C.line}`,background:"#FFF4D8",borderRadius:8,padding:"6px 7px"}}><GameIcon file={file} size={28}/><div style={{minWidth:0}}><b style={{fontSize:8.8,color:C.brown}}>{title}</b><div style={{fontSize:7.5,color:C.ink,lineHeight:1.35,marginTop:2}}>{desc}</div></div></div>)}</div></div>};
    const openLookupV50=item=>{
      const m=giftMetaV50(item); if(!m.canLookup)return;
      openItemLookupV54(m.raw,m.key);
    };
    const GiftGridV50=({title,items,tone})=>{const rows=(items||[]);if(!rows.length)return null;return <div style={{marginTop:8}}><div style={{fontSize:9.5,fontWeight:950,color:C.brown,marginBottom:4}}>{title}・{rows.length}</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5}}>{rows.map((item,i)=>{const m=giftMetaV50(item);return <button key={`${title}-${item}-${i}`} disabled={false} onClick={()=>m.canLookup&&openLookupV50(item)} style={{border:`1px solid ${C.line}`,background:tone,borderRadius:8,padding:"5px 3px",minHeight:72,textAlign:"center",opacity:m.generic?.72:1,cursor:m.canLookup?"pointer":"default",minWidth:0}}><div style={{height:29,display:"flex",alignItems:"center",justifyContent:"center"}}>{m.file?<GameIcon file={m.file} size={29}/>:<span style={{fontSize:15,color:C.muted}}>•</span>}</div><div style={{fontSize:7.8,fontWeight:950,color:C.ink,lineHeight:1.08,marginTop:2}}>{m.name}</div><div style={{fontSize:6.5,color:C.muted,lineHeight:1.12,marginTop:3,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{m.source}</div></button>})}</div></div>};
    const CompactLovesV50=({items})=><div style={{display:"flex",gap:2,flexWrap:"wrap",padding:"2px 0"}}>{(items||[]).map((item,i)=>{const m=giftMetaV50(item);return <span key={`${item}-${i}`} title={m.name} style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",filter:m.generic?"grayscale(1)":"none",opacity:m.generic?.35:1}}>{m.file?<GameIcon file={m.file} size={21}/>:<span style={{fontSize:9,color:C.muted}}>•</span>}</span>})}</div>;
    const shopRowsV50=shop=>{if(!shop?.items)return[];return shop.items.filter(it=>!it.seasons?.length||it.seasons.includes(seasonEnV50));};
    const availabilityTextV50=value=>String(value||"").replace("Year 2+","第 2 年起").replace("Farming level 10+","耕種 10 級").replace("Unowned only","未持有時").replace("17+ ticket prizes claimed","領取 17 次以上獎品券獎勵");
    const ShopV50=({shop})=>{if(!shop)return null;const rows=shopRowsV50(shop);return <div style={{marginTop:9,paddingTop:8,borderTop:`1px dashed ${C.line}`}}><div style={{display:"flex",alignItems:"start",gap:6}}><GameIcon file="Telephone" size={25}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:10.5,color:C.darkBrown}}>商店・{shop.label}</b><div style={{fontSize:7.8,color:C.muted,lineHeight:1.3,marginTop:2}}>{shop.hours}</div></div></div><div style={{fontSize:7.5,color:C.brown,fontWeight:900,marginTop:6}}>目前 {data.base.season}季可見庫存・{rows.length} 項</div><div style={{display:"grid",width:"100%",maxWidth:"100%",minWidth:0,contain:"inline-size",gridAutoFlow:"column",gridTemplateRows:"repeat(2,68px)",gridAutoColumns:"82px",gap:4,overflowX:"auto",overflowY:"hidden",overscrollBehaviorX:"contain",padding:"5px 0 2px",WebkitOverflowScrolling:"touch"}}>{rows.map((it,i)=>{const m=giftMetaV50(it.name);return <button key={`${it.name}-${i}`} disabled={!m.canLookup} onClick={()=>openLookupV50(it.name)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"3px 2px",minWidth:0,textAlign:"center",opacity:m.canLookup?1:.78}}><GameIcon file={m.file||it.name} size={25}/><div style={{fontSize:6.9,fontWeight:900,color:C.ink,lineHeight:1.05,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</div>{Number.isFinite(Number(it.price))&&<div style={{fontSize:6.7,color:C.orange,fontWeight:950,marginTop:2}}>{Number(it.price).toLocaleString()}g</div>}{it.availability&&<div style={{fontSize:5.6,color:C.muted,lineHeight:1.05,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{availabilityTextV50(it.availability)}</div>}</button>})}</div></div>};
    const OrdersV50=({orders})=>{if(!orders?.length)return null;return <div style={{marginTop:9,paddingTop:8,borderTop:`1px dashed ${C.line}`}}><div style={{display:"flex",alignItems:"center",gap:6}}><GameIcon file="Special order board" size={26}/><b style={{fontSize:10.5,color:C.darkBrown}}>特殊訂單看板</b></div><div style={{display:"grid",gap:5,marginTop:5}}>{orders.map(o=><div key={o.id} style={{border:`1px solid ${C.line}`,background:"#FFF4D8",borderRadius:8,padding:"6px 7px"}}><div style={{display:"flex",justifyContent:"space-between",gap:6}}><b style={{fontSize:8.8,color:C.brown}}>{o.name}</b><span style={{fontSize:6.8,color:C.muted,whiteSpace:"nowrap"}}>{o.days} 天{o.repeatable?"・可重複":""}</span></div><div style={{fontSize:7.6,color:C.ink,lineHeight:1.35,marginTop:3}}>📋 {o.need}</div><div style={{fontSize:7.4,color:C.green,lineHeight:1.35,marginTop:2}}>🎁 {o.reward}</div></div>)}</div></div>};
    return <div>
      <SectionTitle icon="game:Friendship 101">社交速查</SectionTitle>
      <Card style={{padding:7,background:"#FFF4D8",fontSize:8.5,color:C.muted,lineHeight:1.4}}>查生日、送禮偏好、特殊訂單、商店與角色服務；好感度可直接在人物卡上記錄。</Card>
      <div style={{display:"flex",gap:5,margin:"7px 0"}}>{NPC_GROUPS.map(x=><Pill key={x.id} small active={x.id===socialGroup} onClick={()=>{setSocialGroup(x.id);setExpandedNPC(null)}}>{x.name}</Pill>)}</div>
      <div style={{display:"grid",gap:6}}>{g.list.map(n=>{const cap=g.id==="single"?14:10;const hearts=Math.min(cap,Number(data.friendship[n]||0));const open=expandedNPC===n;const profile=socialV50[n]||{};const fallback=NPC_GIFTS[n]||{};const loves=socialRowsV55(n,profile,fallback,"loves");const likes=socialRowsV55(n,profile,fallback,"likes");const hates=socialRowsV55(n,profile,fallback,"hates");return <Card key={n} id={`npc-card-${n}`} style={{padding:7,background:open?"#FFF8E9":C.paper,minWidth:0,maxWidth:"100%",overflow:"hidden",scrollMarginTop:"calc(104px + env(safe-area-inset-top))"}}>
        <button onClick={()=>setExpandedNPC(open?null:n)} style={{width:"100%",border:0,background:"transparent",padding:0,display:"grid",gridTemplateColumns:"40px minmax(0,1fr) auto",gap:7,alignItems:"center",textAlign:"left"}}><GameIcon file={NPC_ICON_FILES[n]} size={38}/><span style={{minWidth:0}}><span style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}><b style={{fontSize:11.5,color:C.ink}}>{n}</b>{profile.birthday?.day&&<span style={{fontSize:7,color:C.orange,fontWeight:900}}>🎂 {profile.birthday.season}{profile.birthday.day}</span>}<span aria-label={`好感 ${hearts}/${cap}`} style={{fontSize:7.6,letterSpacing:.5,lineHeight:1}}>{Array.from({length:cap}).map((_,i)=><span key={i} style={{color:i<hearts?C.red:"#D8C9A8"}}>{i<hearts?"♥":"♡"}</span>)}</span></span><span style={{display:"grid",gridTemplateColumns:"24px 1fr",gap:2,alignItems:"center",marginTop:2}}><span style={{fontSize:6.5,color:C.muted,fontWeight:900}}>最愛</span><CompactLovesV50 items={loves}/></span><span style={{display:"grid",gridTemplateColumns:"24px 1fr",gap:2,alignItems:"center",marginTop:2}}><span style={{fontSize:6.5,color:C.muted,fontWeight:900}}>喜歡</span><CompactLovesV50 items={likes}/></span></span><span style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:10,color:C.brown}}>{open?"▲":"▼"}</span></span></button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6,marginTop:4}}>{(()=>{const S=window.SDVNpcScheduleV91;if(!S?.resolve)return <span/>;const day=Number(data.base.day||1);const fest=dayCalendarItems(day).find(x=>x.type==="festival");const style={fontSize:6.8,fontWeight:900,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"};if(fest)return <span style={{...style,color:C.orange}}>🎪 {fest.text}{festVenueLabelV94(fest.key)?`・${festVenueLabelV94(fest.key)}`:""}</span>;const r=S.resolve(n,{season:data.base.season,day,rain:todayWeatherV69==="雨",...progressFlagsV92(data)});if(!r)return <span/>;const fmt=t=>{const h=Math.floor(t/100),m=t%100;return `${h>=24?h-24:h}:${String(m).padStart(2,"0")}`};const curIdx=slotSelV93?r.entries.reduce((a,sg,ix)=>sg[0]<=slotSelV93.rep?ix:a,0):-1;return <span style={{...style,color:C.brown}}>📍 {r.entries.map((sg,i)=><span key={i} style={i===curIdx?{color:C.orange,fontWeight:950}:null}>{i>0?" › ":""}{fmt(sg[0])} {sg[1].zh}</span>)}</span>})()}<div style={{display:"flex",alignItems:"center",gap:3,flex:"0 0 auto"}}><button onClick={()=>updateNested("friendship",{[n]:Math.max(0,hearts-1)})} style={{border:0,background:C.cream,borderRadius:5,width:20,height:19,padding:0,color:C.brown,fontWeight:950}}>−</button><span style={{fontSize:6.8,color:C.muted}}>好感 {hearts}/{cap}</span><button onClick={()=>updateNested("friendship",{[n]:Math.min(cap,hearts+1)})} style={{border:0,background:C.cream,borderRadius:5,width:20,height:19,padding:0,color:C.brown,fontWeight:950}}>＋</button></div></div>
        {open&&<div style={{borderTop:`1px dashed ${C.line}`,marginTop:6,paddingTop:7}}>{(()=>{const S=window.SDVNpcScheduleV91;if(!S?.resolve)return null;const day=Number(data.base.day||1);const fest=dayCalendarItems(day).find(x=>x.type==="festival");const r=S.resolve(n,{season:data.base.season,day,rain:todayWeatherV69==="雨",...progressFlagsV92(data)});if(!r)return null;const fmt=t=>{const h=Math.floor(t/100),m=t%100;return `${h>=24?h-24:h}:${String(m).padStart(2,"0")}`};return <div style={{padding:"6px 8px",background:"#EAF2FA",border:`1px solid ${C.line}`,borderRadius:8,marginBottom:6}}><div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}><b style={{fontSize:9.5,color:C.blue}}>📍 今天（{data.base.season}{day}・週{r.weekday}{slotSelV93?`・${slotSelV93.label}`:""}）</b>{fest&&<span style={{fontSize:7.2,color:C.orange,fontWeight:900}}>🎪 {fest.text}{festVenueLabelV94(fest.key)?`・${festVenueLabelV94(fest.key)}`:""}</span>}</div>{fest?<div style={{fontSize:7.6,color:C.brown,marginTop:4}}>節日日以會場為準{festVenueLabelV94(fest.key)?`（${festVenueLabelV94(fest.key)}）`:""}，不套用平日行程。</div>:<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{(()=>{const curIdx=slotSelV93?r.entries.reduce((a,sg,ix)=>sg[0]<=slotSelV93.rep?ix:a,0):-1;return r.entries.map(([t,loc],i)=>{const can=Boolean(loc.node);const cur=i===curIdx;return <button key={i} disabled={!can} onClick={()=>can&&goToWorldV88(loc.node,loc.pin?{kind:"place",id:loc.pin}:null)} style={{border:`1.5px solid ${cur?C.orange:C.line}`,background:cur?"#FFE2A8":(can?C.cream:"#F3EDDE"),borderRadius:8,padding:"3px 7px",fontSize:8,fontWeight:900,color:C.brown,opacity:can?1:.85}}>{cur?"● ":""}{fmt(t)} {loc.zh}{can?" ›":""}</button>})})()}</div>}{!fest&&r.notes.length>0&&<div style={{fontSize:6.8,color:C.muted,marginTop:4}}>{r.notes.join("；")}</div>}</div>})()}{profile.intro&&<div style={{display:"flex",gap:7,alignItems:"start",padding:"6px 7px",background:"#F7E9C6",borderRadius:8}}><GameIcon file={NPC_ICON_FILES[n]} size={32}/><div style={{fontSize:8.5,color:C.ink,lineHeight:1.4}}>{profile.intro}{profile.birthday?.day&&<div style={{marginTop:3,color:C.brown,fontWeight:900}}>生日：{profile.birthday.season}季 {profile.birthday.day} 日</div>}</div></div>}<GiftGridV50 title="💖 最愛" items={loves} tone="#FFF0F2"/><GiftGridV50 title="👍 喜歡" items={likes} tone="#EEF7DD"/><GiftGridV50 title="👎 討厭" items={hates} tone="#F4E8E3"/><div style={{fontSize:7,color:C.muted,marginTop:5}}>點禮物可查看用途與取得方式；「全部××」這類通用分類不另開物品頁。</div><ServicesV55 npc={n}/><OrdersV50 orders={profile.orders}/><ShopV50 shop={profile.shop}/></div>}
      </Card>})}</div>
    </div>;
  };

  const renderPowers = () => {
    const sections={special:SPECIAL_ITEMS_V2,books:BOOK_POWERS_V2,mastery:MASTERY_POWERS_V2};
    const labels={special:"特殊物品",books:"書籍能力",mastery:"精通能力"};
    return <div>
      <SectionTitle icon="game:Magic Rock Candy">特殊物品與能力</SectionTitle>
      <Card style={{background:"#FFF4D8",fontSize:11,color:C.muted,lineHeight:1.5}}>記錄特殊物品、永久書籍能力與五項技能精通。</Card>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:9}}>{Object.keys(sections).map(k=><Pill key={k} active={powerSection===k} onClick={()=>setPowerSection(k)}>{labels[k]}</Pill>)}</div>
      <div style={{display:"grid",gap:7,marginTop:9}}>{sections[powerSection].map(it=>{
        const checked=isPowerChecked(powerSection,it);
        return <Card key={it.id} style={{padding:9,background:checked?"#EAF4D8":C.paper}}><div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={it.file} size={36}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:13,color:C.ink}}>{it.name}</b><div style={{fontSize:10.5,color:C.muted,lineHeight:1.35,marginTop:2}}>{it.desc}</div></div><button onClick={()=>togglePower(powerSection,it)} style={{border:`2px solid ${checked?C.green:C.line}`,background:checked?C.lightGreen:C.cream,borderRadius:8,padding:"5px 8px",fontWeight:900,color:checked?C.green:C.muted}}>{checked?"✓":"○"}</button></div></Card>;
      })}</div>
    </div>;
  };

  const renderAchievements = () => {
    const count=ACHIEVEMENTS_V2.filter(a=>achievementChecked(a.id)).length;
    const selected=selectedAchievementV64?ACHIEVEMENTS_V2.find(a=>a.id===selectedAchievementV64):null;
    return <div style={{marginTop:8}}>
      <Card style={{padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>成就</span><span>{count}/{ACHIEVEMENTS_V2.length}</span></div><ProgressBar value={count} max={ACHIEVEMENTS_V2.length}/></Card>
      {selected&&<Card style={{marginTop:7,padding:9,background:"#FFF8E2",border:`1.5px solid ${C.orange}`}}><div style={{display:"grid",gridTemplateColumns:"46px minmax(0,1fr)",gap:8,alignItems:"center"}}><GameIcon file="Achievement Star 01" size={42}/><div style={{minWidth:0}}><b style={{display:"block",fontSize:13,color:C.darkBrown}}>{selected.name}</b><span style={{display:"block",fontSize:9.2,color:C.muted,lineHeight:1.4,marginTop:2}}>{selected.desc}</span>{derivedAchievement(selected.id)&&<span style={{display:"block",fontSize:7.5,color:C.green,fontWeight:950,marginTop:3}}>此項依手帳進度自動判定</span>}</div></div></Card>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:6,marginTop:8}}>{ACHIEVEMENTS_V2.map(a=>{const auto=derivedAchievement(a.id),on=achievementChecked(a.id),selectedNow=selectedAchievementV64===a.id;return <button key={a.id} onClick={()=>setSelectedAchievementV64(a.id)} title={a.desc} style={{position:"relative",border:`2px solid ${selectedNow?C.orange:on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,padding:"6px 3px",minHeight:82,cursor:"pointer",opacity:auto?.9:1}}><GameIcon file="Achievement Star 01" size={35}/><div style={{fontSize:8.7,fontWeight:900,color:on?C.green:C.ink,lineHeight:1.08,marginTop:2}}>{a.name}</div><span onClick={e=>{e.stopPropagation();if(!auto)toggleAchievement(a.id)}} style={{position:"absolute",right:2,top:2,fontSize:12,color:on?C.green:"#C9B99A",fontWeight:950,padding:2,cursor:auto?"default":"pointer"}}>{on?"✓":"○"}</span>{auto&&<span style={{position:"absolute",left:2,top:2,fontSize:5.8,color:C.green,fontWeight:950}}>自動</span>}</button>})}</div>
    </div>;
  };

  const renderDexCollection = () => {
    const c=COLLECTIONS[selectedCollection];
    const got=data.collections[selectedCollection]||[];
    const selectedName=selectedItem!=null?c.items[selectedItem]:"";
    return <div style={{marginTop:8}}>
      <Card style={{padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>{selectedCollection==="artifact"?"古物圖鑑":"礦物圖鑑"}</span><span>{got.length}/{c.items.length}</span></div><ProgressBar value={got.length} max={c.items.length}/></Card>
      {selectedName&&<SimpleItemInfoV62 name={selectedName} file={itemFileZhV26(selectedName)||selectedName} info={c.info?.[selectedItem]||""}/>} 
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:6,marginTop:8}}>{c.items.map((it,i)=>{const checked=got.includes(i),file=ICON_URLS[selectedCollection]?.[i];return <button key={i} onClick={()=>setSelectedItem(i)} onDoubleClick={()=>updateNested("collections",{[selectedCollection]:checked?got.filter(x=>x!==i):[...got,i]})} style={{position:"relative",border:`2px solid ${selectedItem===i?C.orange:checked?C.green:C.line}`,background:checked?"#E5F3CF":C.paper,borderRadius:9,padding:"6px 3px",minHeight:78,cursor:"pointer"}}>{file?<img src={file} alt="" style={{width:36,height:36,imageRendering:"pixelated",objectFit:"contain"}}/>:<GameIcon file={itemFileZhV26(it)||it} size={36}/>}<div style={{fontSize:9,fontWeight:900,color:C.ink,lineHeight:1.1,marginTop:2}}>{switchNameV47(it,itemFileZhV26(it))}</div><span onClick={e=>{e.stopPropagation();updateNested("collections",{[selectedCollection]:checked?got.filter(x=>x!==i):[...got,i]})}} style={{position:"absolute",right:2,top:2,fontSize:13,color:checked?C.green:"#C9B99A",fontWeight:950,padding:2}}>{checked?"✓":"○"}</span></button>})}</div>
    </div>;
  };



  const prepSetV3 = data.cookingPrepV3 || [];
  const cookedSetV3 = data.cookingCollectionV3 || [];
  const togglePrepV3 = id => update({cookingPrepV3:prepSetV3.includes(id)?prepSetV3.filter(x=>x!==id):[...prepSetV3,id]});
  const toggleCookedV3 = id => update({cookingCollectionV3:cookedSetV3.includes(id)?cookedSetV3.filter(x=>x!==id):[...cookedSetV3,id]});
  const allPrepItemsV3 = COOKING_PREP_GROUPS_V3.flatMap(g=>g.items);

  const renderCookingV3 = () => {
    const prepMode=cookingModeV3==="prep";
    const progressValue=prepMode?prepSetV3.length:cookedSetV3.length;
    const progressMax=prepMode?allPrepItemsV3.length:COOKING_DISHES_V3.length;
    return <div>
      <Card style={{marginTop:8,padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>{prepMode?"料理備料":"料理收集"}</span><span>{progressValue}/{progressMax}</span></div><ProgressBar value={progressValue} max={progressMax}/></Card>
      {selectedCookingV62&&<SimpleItemInfoV62 name={selectedCookingV62.name} file={selectedCookingV62.file} info={selectedCookingV62.info||""}/>} 
      <div style={{display:"flex",gap:5,marginTop:7}}><Pill small active={prepMode} onClick={()=>{setCookingModeV3("prep");setSelectedCookingV62(null)}}>備料</Pill><Pill small active={!prepMode} onClick={()=>{setCookingModeV3("dishes");setSelectedCookingV62(null)}}>料理收集</Pill></div>
      {prepMode&&<Card style={{marginTop:7,padding:8,background:"#FFF4D8"}}><div style={{fontSize:9.5,fontWeight:950,color:C.darkBrown}}>全料理備料</div><div style={{fontSize:8.5,color:C.muted,lineHeight:1.4,marginTop:2}}>勾選代表已準備到最低需求量；這裡用來記錄備料進度，不計算實際庫存。</div></Card>}
      {prepMode&&<><label style={{display:"flex",alignItems:"center",gap:6,margin:"8px 2px 0",fontSize:11,fontWeight:900,color:C.brown}}><input type="checkbox" checked={prepMissingOnlyV3} onChange={e=>setPrepMissingOnlyV3(e.target.checked)}/>只看還沒準備的材料</label>{COOKING_PREP_GROUPS_V3.map(g=>{const rows=g.items.filter(it=>!prepMissingOnlyV3||!prepSetV3.includes(it[0]));return rows.length?<Card key={g.id} style={{marginTop:8,padding:9,background:g.id==="g5"?"#FFF0D2":C.paper}}><div style={{fontSize:12.5,fontWeight:950,color:C.darkBrown}}>{g.name}</div><div style={{fontSize:9.5,color:C.muted,marginTop:2,lineHeight:1.35}}>{g.desc}</div><div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:7}}>{rows.map(it=>{const [id,name,file,need]=it,on=prepSetV3.includes(id);return <button key={id} onClick={()=>setSelectedCookingV62({name,file,info:`全料理最低備料需求 ×${need}`})} style={{position:"relative",border:`2px solid ${selectedCookingV62?.file===file?C.orange:on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,minHeight:82,padding:"5px 2px",cursor:"pointer"}}><div style={{height:35,display:"flex",alignItems:"center",justifyContent:"center"}}><GameIcon file={file} size={34}/></div><div style={{fontSize:9,fontWeight:950,color:C.ink,lineHeight:1.1,marginTop:2}}>{name}</div><span style={{position:"absolute",left:3,top:2,fontSize:8.5,fontWeight:950,color:C.brown,background:"#FFF1C9",borderRadius:6,padding:"1px 3px"}}>×{need}</span><span onClick={e=>{e.stopPropagation();togglePrepV3(id)}} style={{position:"absolute",right:2,top:1,fontSize:12,color:on?C.green:"#C9B99A",fontWeight:950,padding:2}}>{on?"✓":"○"}</span></button>})}</div></Card>:null})}</>}
      {!prepMode&&<div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:8}}>{COOKING_DISHES_V3.map(it=>{const [id,name,file]=it,on=cookedSetV3.includes(id);return <button key={id} onClick={()=>setSelectedCookingV62({name,file,info:"料理圖鑑；點卡片看說明，右上角 ○／✓ 記錄是否做過。"})} style={{position:"relative",border:`2px solid ${selectedCookingV62?.file===file?C.orange:on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:8,minHeight:75,padding:"5px 2px",cursor:"pointer"}}><GameIcon file={file} size={34}/><div style={{fontSize:8.8,fontWeight:900,color:C.ink,lineHeight:1.1,marginTop:2}}>{switchNameV47(name,file)}</div><span onClick={e=>{e.stopPropagation();toggleCookedV3(id)}} style={{position:"absolute",right:2,top:1,fontSize:11,color:on?C.green:"#C9B99A",fontWeight:950,padding:2}}>{on?"✓":"○"}</span></button>})}</div>}
    </div>;
  };


  const renderPaperCollectionV3 = (kind,total,title) => {
    const list=extrasState[kind]||[];
    const isNotes=kind==="notes";
    const summary=isNotes?SECRET_NOTE_SUMMARY_V3:JOURNAL_SUMMARY_V3;
    const content=isNotes?SECRET_NOTE_CONTENT_V4:summary;
    const solution=isNotes?SECRET_NOTE_SOLUTION_V4:{};
    const imageMap=isNotes?SECRET_NOTE_IMAGE_V3:JOURNAL_IMAGE_V3;
    const selected=selectedPaperV3?.kind===kind?selectedPaperV3.n:null;
    return <div>
      <Card style={{marginTop:8,padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>{title}</span><span>{list.length}/{total}</span></div><ProgressBar value={list.length} max={total}/></Card><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5,marginTop:8}}>{Array.from({length:total},(_,i)=>i+1).map(n=>{const on=list.includes(n);return <button key={n} onClick={()=>setSelectedPaperV3({kind,n})} style={{position:"relative",border:`1.5px solid ${selected===n?C.orange:on?C.green:C.line}`,background:on?C.lightGreen:C.cream,borderRadius:7,padding:"8px 1px",fontSize:10,fontWeight:900,color:on?C.green:C.brown}}>{n}<span onClick={e=>{e.stopPropagation();updateExtras({[kind]:on?list.filter(x=>x!==n):[...list,n]})}} style={{position:"absolute",right:1,top:0,fontSize:9}}>{on?"✓":"○"}</span></button>})}</div>
      {selected&&<Card style={{marginTop:8,padding:10,background:"#F6E5B9"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><GameIcon file={isNotes?"Secret Note":"Journal Scrap"} size={36}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:950,color:C.darkBrown}}>{title} #{selected}</div><div style={{fontSize:9.5,color:C.muted,marginTop:2}}>{isNotes?"紙條內容與可執行解法":"日誌內容速查"}</div></div></div>{imageMap[selected]&&<img src={GAME_FILE(imageMap[selected])} alt={`${title} ${selected} 圖像內容`} onError={e=>e.currentTarget.style.display="none"} style={{display:"block",width:"min(216px,100%)",height:"auto",margin:"10px auto 7px",imageRendering:"pixelated",borderRadius:5}}/>}<div style={{marginTop:8,padding:"8px 9px",background:"#FFF8E2",borderRadius:8,border:`1px solid ${C.line}`}}><div style={{fontSize:9.5,fontWeight:950,color:C.brown,marginBottom:3}}>{isNotes?"紙條內容":"內容"}</div><div style={{fontSize:11,color:C.ink,lineHeight:1.55}}>{content[selected]||"尚未整理內容。"}</div></div>{solution[selected]&&<div style={{marginTop:7,padding:"8px 9px",background:"#EAF4D8",borderRadius:8,border:`1px solid ${C.green}`}}><div style={{fontSize:9.5,fontWeight:950,color:C.green,marginBottom:3}}>解法／效果</div><div style={{fontSize:11,color:C.ink,lineHeight:1.55}}>{solution[selected]}</div></div>}</Card>}
    </div>;
  };

  const renderFishCardV4 = (i, area=null, compact=false, showCollection=true, openCard=false) => {
    const name=COLLECTIONS.fish.items[i]; const displayName=switchNameV47(name,FISH_ICON_FILES[i]); const got=(data.collections.fish||[]).includes(i); const rule=fishRuleV4(i);
    const seasons=area?.forceSeasons||area?.seasonOverride?.[i]||rule.s;
    const seasonText=seasons.length===4?"四季":seasons.join("／");
    const timeText=formatFishTimeV4(rule,area?.timeOverride);
    const currentSeasonFishV49=seasons.includes(data.base.season);
    return <button key={`${area?.id||"fish"}-${i}`} onClick={()=>openCard?openItemLookupV54(name,FISH_ICON_FILES[i]):setSelectedItem(i)} style={{position:"relative",border:`2px solid ${showCollection?(!got?C.orange:C.line):currentSeasonFishV49?C.green:C.line}`,background:showCollection?(got?"#F5F0DF":"#FFF2CF"):currentSeasonFishV49?"#EAF4D8":C.paper,borderRadius:9,padding:compact?"6px":"8px",display:"flex",alignItems:"center",gap:8,textAlign:"left",cursor:"pointer",width:"100%",opacity:showCollection&&got?0.78:1}}>
      <img src={ICON_URLS.fish[i]} alt="" loading="lazy" style={{width:compact?34:40,height:compact?34:40,imageRendering:"pixelated",objectFit:"contain",flex:"0 0 auto"}}/>
      <span style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:compact?11:12.5,color:C.ink}}>{displayName}{rule.legend?" · 傳說":""}</b><span style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:3}}>
        <span style={{fontSize:8.5,fontWeight:900,padding:"1px 4px",borderRadius:7,background:"#F0E2C5",color:C.brown}}>{seasonText}</span>{currentSeasonFishV49&&<span style={{fontSize:8.5,fontWeight:950,padding:"1px 4px",borderRadius:7,background:"#DFF0CD",color:C.green}}>當季</span>}
        <span style={{fontSize:8.5,fontWeight:900,padding:"1px 4px",borderRadius:7,background:rule.w==="雨"?"#D9EAF8":rule.w==="晴"?"#FFF0A9":"#EAE3D4",color:C.ink}}>{rule.w}</span>
        <span style={{fontSize:8.5,fontWeight:900,padding:"1px 4px",borderRadius:7,background:"#E5EDF2",color:C.blue}}>{timeText}</span>
      </span></span>
      {showCollection&&<span style={{fontSize:11,fontWeight:950,color:got?C.green:C.orange}}>{got?"✓ 已收集":"未收集"}</span>}
      {openCard&&<span style={{fontSize:13,color:C.orange,fontWeight:950,flex:"0 0 auto"}}>›</span>}
    </button>;
  };

  const renderFishDexV4 = () => {
    const got=data.collections.fish||[];
    const selectedName=selectedItem!=null?COLLECTIONS.fish.items[selectedItem]:"";
    return <div style={{marginTop:8}}>
      <Card style={{padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>魚類圖鑑</span><span>{got.length}/{COLLECTIONS.fish.items.length}</span></div><ProgressBar value={got.length} max={COLLECTIONS.fish.items.length}/></Card>
      {selectedItem!=null&&selectedName&&<SimpleItemInfoV62 name={selectedName} file={FISH_ICON_FILES[selectedItem]} info={FISH_INFO[selectedItem]||""}/>} 
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:6,marginTop:8}}>{COLLECTIONS.fish.items.map((name,i)=>{const on=got.includes(i);return <button key={i} onClick={()=>setSelectedItem(i)} style={{position:"relative",border:`2px solid ${selectedItem===i?C.orange:!on?C.orange:C.line}`,background:on?"#E8F1D5":C.paper,borderRadius:9,minHeight:76,padding:"5px 2px",cursor:"pointer"}}><img src={ICON_URLS.fish[i]} alt="" style={{width:36,height:36,imageRendering:"pixelated",objectFit:"contain"}}/><div style={{fontSize:9,fontWeight:900,color:C.ink,lineHeight:1.05}}>{switchNameV47(name,FISH_ICON_FILES[i])}</div><span onClick={e=>{e.stopPropagation();updateNested("collections",{fish:on?got.filter(x=>x!==i):[...got,i]})}} style={{position:"absolute",right:2,top:1,fontSize:12,color:on?C.green:"#C9A86A",fontWeight:950,padding:2}}>{on?"✓":"○"}</span></button>})}</div>
    </div>;
  };


  const renderFishTodayV4 = () => {
    const got=data.collections.fish||[];
    const season=fishSeasonV4==="當季"?data.base.season:fishSeasonV4;
    const autoHour=parseGameHourV4(data.base.gameTime);
    const hour=fishHourV4==="auto"?autoHour:fishHourV4==="all"?null:Number(fishHourV4);
    const areaRows=FISH_AREAS_V4.map(area=>({area,fish:area.fish.filter(i=>fishAvailableV4(area,i,season,fishWeatherV4,hour,data.base.day)&&(!fishMissingV4||!got.includes(i)))})).filter(x=>x.fish.length);
    const total=areaRows.reduce((n,x)=>n+x.fish.length,0);
    return <div style={{marginTop:8}}>
      <Card style={{padding:9,background:"#FFF4D8"}}><div style={{fontSize:12,fontWeight:950,color:C.darkBrown}}>第 {data.base.year} 年 · {season}季 · {data.base.day} 日</div><div style={{fontSize:10.5,color:C.muted,marginTop:3}}>預設使用手帳日期；切換季節只影響這次查詢，不會修改存檔。</div></Card>
      <div style={{fontSize:9.5,fontWeight:950,color:C.muted,marginTop:7}}>季節</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{["當季","春","夏","秋","冬"].map(x=><Pill key={x} small active={fishSeasonV4===x} onClick={()=>{setFishSeasonV4(x);setFishTodayOpenV4(null)}}>{x==="當季"?`當季（${data.base.season}）`:x}</Pill>)}</div>
      <div style={{fontSize:9.5,fontWeight:950,color:C.muted,marginTop:7}}>天氣</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{["全部","晴","雨"].map(w=><Pill key={w} small active={fishWeatherV4===w} onClick={()=>{setFishWeatherV4(w);setFishTodayOpenV4(null)}}>{w==="全部"?"全部天氣":w}</Pill>)}</div>
      <div style={{fontSize:9.5,fontWeight:950,color:C.muted,marginTop:7}}>時間</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{[["auto",autoHour!=null?`目前 ${data.base.gameTime}`:"目前時間未記錄"],["all","不限時間"],[6,"06:00"],[9,"09:00"],[12,"12:00"],[15,"15:00"],[18,"18:00"],[22,"22:00"],[24,"00:00"]].map(([v,n])=><Pill key={String(v)} small active={String(fishHourV4)===String(v)} onClick={()=>{setFishHourV4(v);setFishTodayOpenV4(null)}}>{n}</Pill>)}</div>
      <label style={{display:"flex",alignItems:"center",gap:6,marginTop:8,fontSize:10.5,fontWeight:900,color:C.brown}}><input type="checkbox" checked={fishMissingV4} onChange={e=>{setFishMissingV4(e.target.checked);setFishTodayOpenV4(null)}}/>只看未收集</label>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"7px 0 5px"}}><span style={{fontSize:10,color:C.muted}}>找到 {total} 筆可釣結果。</span>{fishTodayOpenV4&&<button onClick={()=>setFishTodayOpenV4(null)} style={{border:0,background:"transparent",fontSize:10,color:C.blue,fontWeight:900}}>全部收起</button>}</div>
      <div style={{display:"grid",gap:6}}>{areaRows.map(({area,fish})=>{const open=fishTodayOpenV4===area.id;return <Card key={area.id} style={{padding:0,overflow:"hidden"}}><button onClick={()=>setFishTodayOpenV4(open?null:area.id)} style={{width:"100%",border:0,background:"transparent",padding:"8px 9px",display:"flex",alignItems:"center",gap:7,textAlign:"left",cursor:"pointer"}}><GameIcon file={area.icon} size={30}/><span style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:12.5,color:C.darkBrown}}>{area.name} · {area.sub}</b><span style={{display:"flex",gap:2,marginTop:3,overflow:"hidden"}}>{fish.slice(0,5).map(i=><img key={i} src={ICON_URLS.fish[i]} alt="" style={{width:20,height:20,imageRendering:"pixelated",objectFit:"contain"}}/>)}{fish.length>5&&<span style={{fontSize:9,color:C.muted,fontWeight:900,alignSelf:"center"}}>+{fish.length-5}</span>}</span></span><span style={{fontSize:10,color:C.muted,fontWeight:900}}>{fish.length} 項</span><span style={{fontSize:12,color:C.brown,fontWeight:950}}>{open?"▲":"▼"}</span></button>{open&&<div style={{padding:"0 9px 9px",borderTop:`1px dashed ${C.line}`}}><div style={{display:"grid",gap:5,marginTop:7}}>{fish.map(i=>renderFishCardV4(i,area,true,true,true))}</div>{area.tip&&<div style={{fontSize:9.5,color:C.muted,lineHeight:1.4,marginTop:6}}>{area.tip}</div>}</div>}</Card>})}</div>
      {!areaRows.length&&<Card style={{marginTop:8,textAlign:"center",color:C.muted,fontSize:11}}>目前沒有符合條件的魚；可調整季節、天氣、時間或關閉「只看未收集」。</Card>}
    </div>;
  };

  const renderFishHubV4 = () => <div>
    <Card style={{marginTop:8,padding:9,background:"#EAF4D8"}}><div style={{fontSize:11.5,fontWeight:950,color:C.darkBrown}}>魚類查詢</div><div style={{fontSize:10.5,color:C.muted,lineHeight:1.45,marginTop:3}}>查看魚類圖鑑、依地點找魚，或按目前日期與時間篩選。</div></Card>
    <div style={{display:"flex",gap:5,marginTop:7}}><Pill active={fishViewV4==="dex"} onClick={()=>setFishViewV4("dex")}>圖鑑</Pill><Pill active={fishViewV4==="find"} onClick={()=>setFishViewV4("find")}>找魚</Pill><Pill active={fishViewV4==="today"} onClick={()=>setFishViewV4("today")}>今日可釣</Pill></div>
    {fishViewV4==="dex"&&renderFishDexV4()}{fishViewV4==="find"&&renderFishFindV4()}{fishViewV4==="today"&&renderFishTodayV4()}
  </div>;

  const renderShippingV30 = () => {
    const shipped=data.shippingV30||[];
    const toggle=file=>update({shippingV30:shipped.includes(file)?shipped.filter(x=>x!==file):[...shipped,file]});
    const selectedRow=selectedShippingV64?SHIPPING_ITEMS_V30.find(([file])=>file===selectedShippingV64):null;
    return <div style={{marginTop:8}}>
      <Card style={{padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>出貨圖鑑</span><span>{shipped.length}/{SHIPPING_ITEMS_V30.length}</span></div><ProgressBar value={shipped.length} max={SHIPPING_ITEMS_V30.length}/>{!shipped.length&&Number(extrasState.shippedCount||0)>0&&<div style={{fontSize:8.5,color:C.muted,marginTop:5}}>已找到舊版的出貨總數（{extrasState.shippedCount} 項），但沒有各物品明細；請依遊戲圖鑑重新勾選。</div>}</Card>
      {selectedRow&&<SimpleItemInfoV62 name={selectedRow[1]} file={selectedRow[0]} info="出貨圖鑑物品；右上角圓點記錄是否已出貨。"/>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:8}}>{SHIPPING_ITEMS_V30.map(([file,name])=>{const on=shipped.includes(file),selected=selectedShippingV64===file;return <button key={file} onClick={()=>setSelectedShippingV64(file)} style={{position:"relative",border:`1.5px solid ${selected?C.orange:on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:8,padding:"5px 2px",minHeight:70,cursor:"pointer"}}><GameIcon file={file} size={34} alt={name}/><div style={{fontSize:7.7,fontWeight:900,color:on?C.green:C.ink,lineHeight:1.05,marginTop:2}}>{name}</div><span onClick={e=>{e.stopPropagation();toggle(file)}} style={{position:"absolute",right:2,top:1,fontSize:11,color:on?C.green:"#C9B99A",fontWeight:950,padding:2}}>{on?"✓":"○"}</span></button>})}</div>
    </div>;
  };

  const renderCollection = () => {
    const tabClick = k => { setCollectionSection(k); setSelectedCookingV62(null); if(["fish","artifact","mineral"].includes(k)){setSelectedCollection(k);setSelectedItem(null);} };
    return <div>
      <div style={{display:"flex",gap:5,overflowX:"auto",padding:"8px 0 4px",WebkitOverflowScrolling:"touch"}}>{COLLECTION_TABS_V3.map(([k,n,file])=><button key={k} onClick={()=>tabClick(k)} style={{flex:"0 0 auto",minWidth:58,border:`2px solid ${collectionSection===k?C.orange:C.line}`,background:collectionSection===k?"#FFE0A8":C.paper,borderRadius:9,padding:"5px 5px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:C.ink,fontWeight:900,fontSize:9.5}}><GameIcon file={file} size={29}/><span>{n}</span></button>)}</div>
      {collectionSection==="fish"&&renderFishDexV4()}
      {collectionSection==="artifact"&&renderDexCollection()}
      {collectionSection==="mineral"&&renderDexCollection()}
      {collectionSection==="cooking"&&renderCookingV3()}
      {collectionSection==="achievements"&&renderAchievements()}
      {collectionSection==="notes"&&renderPaperCollectionV3("notes",27,"秘密紙條")}
      {collectionSection==="scraps"&&renderPaperCollectionV3("scraps",11,"日誌殘頁")}
      {collectionSection==="shipping"&&renderShippingV30()}
    </div>;
  };

  const buildSummary = () => {
    const animals = Object.entries(data.animals || {}).filter(([,v])=>v>0).map(([k,v])=>`${k}×${v}`).join("、") || "無";
    const ponds = (data.ponds || []).map(p=>`${p.fish||"未填"}${p.count}/${p.cap}${p.need?`（${p.need}）`:""}`).join("；") || "無";
    const completedRooms = BUNDLE_ROOMS.filter(roomDone).map(r=>r.name).join("、") || "無";
    const collectionText = Object.entries(COLLECTIONS).map(([k,v])=>`${v.name}${(data.collections[k]||[]).length}/${v.items.length}`).join("、");
    return `《星露谷物語》目前進度\n日期：第${data.base.year}年${data.base.season}${data.base.day}日\n金錢：${Number(data.base.money||0).toLocaleString()}g；累計收入：${Number(data.base.totalIncome||0).toLocaleString()}g\n農場：${data.base.farm||"未記錄"}\n技能：耕種${data.skills.farming}／採礦${data.skills.mining}／採集${data.skills.foraging}／釣魚${data.skills.fishing}／戰鬥${data.skills.combat}\n礦井：${data.mine.normal}層；骷髏洞最佳${data.mine.skullBest}層\n工具：水壺${data.tools.watering}、十字鎬${data.tools.pickaxe}、斧頭${data.tools.axe}、鋤頭${data.tools.hoe}、垃圾桶${data.tools.trash}\n農舍：${HOUSE_LEVELS[data.house]}\n社區中心：${rp.done}/30；已完成房間：${completedRooms}\n動物：${animals}\n魚塘：${ponds}\n圖鑑：${collectionText}`;
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
    try{const parsed=JSON.parse(await file.text());setData(normalizeSaveV68(parsed));alert("備份已匯入");}catch(e){alert("無法讀取這份備份檔")}
    if(importRef.current)importRef.current.value="";
  };

  const trackerShareUrl = () => window.SDVCloud?.shareUrl?.() || "";
  const shareTrackerView = async () => {
    const url = trackerShareUrl();
    if (!url) {
      alert("這個 App 尚未取得你的雲端唯讀分享連結，請在下方按「重新連接雲端」。");
      return;
    }
    const title = `${data.base.farm}｜星露谷進度手帳`;
    const text = `來看我的《星露谷物語》遊玩手帳：第 ${data.base.year} 年 ${data.base.season} ${data.base.day} 日`;
    if (navigator.share) {
      try { await navigator.share({title, text, url}); return; } catch(e) { if(e?.name==="AbortError") return; }
    }
    try { await navigator.clipboard.writeText(url); alert("唯讀手帳連結已複製"); }
    catch { window.prompt("複製這個唯讀手帳連結", url); }
  };
  const copyTrackerView = async () => {
    const url = trackerShareUrl();
    if (!url) { alert("尚未取得雲端唯讀分享連結"); return; }
    try { await navigator.clipboard.writeText(url); alert("唯讀手帳連結已複製"); }
    catch { window.prompt("複製這個唯讀手帳連結", url); }
  };
  const publicAppUrlV49 = () => `${window.location.origin}${window.location.pathname}`;
  const copyPublicAppUrlV49 = async () => {
    const url=publicAppUrlV49();
    try { await navigator.clipboard.writeText(url); alert("App 網址已複製"); }
    catch { window.prompt("複製 App 網址",url); }
  };
  const reconnectCloudV49 = async () => {
    try {
      if(window.SDVCloud?.migrateFromLegacy?.()) return;
    } catch(e) { console.warn("舊網址自動搬移啟動失敗",e); }
    const raw=window.prompt("貼上原本的手帳管理連結（包含 manage 與 sharekey）");
    if(!raw)return;
    try { window.SDVCloud?.connectFromManagementUrl?.(raw); window.location.reload(); }
    catch(e){ alert(e?.message||"這不是有效的管理連結"); }
  };

  const renderFishFindV4 = () => {
    const group=FISH_AREA_GROUPS_V4[fishFindGroupV4]||FISH_AREA_GROUPS_V4.main;
    const groupAreas=group.ids.map(id=>FISH_AREAS_V4.find(a=>a.id===id)).filter(Boolean);
    const area=groupAreas.find(a=>a.id===fishAreaV4)||groupAreas[0];
    const mapMeta=FISH_MAP_META_V42[fishFindGroupV4]||FISH_MAP_META_V42.main;
    const activeCluster=mapMeta.clusters.find(c=>c.ids.includes(area?.id));
    const toggleValue=(value,list,setter)=>setter(list.includes(value)?list.filter(x=>x!==value):[...list,value]);
    const matchesTime=(windows,segId)=>{const seg=FISH_TIME_SEGMENTS_V42.find(x=>x.id===segId);if(!seg)return true;const [sa,sb]=seg.range;return windows.some(([a,b])=>a<sb&&b>sa);};
    const rows=(area?.fish||[]).filter(i=>{
      const rule=fishRuleV4(i);
      const seasons=area.forceSeasons||area.seasonOverride?.[i]||rule.s||SEASONS;
      if(fishSeasonsV42.length&&!fishSeasonsV42.some(x=>seasons.includes(x)))return false;
      if(fishWeathersV42.length&&rule.w!=="任意"&&!fishWeathersV42.includes(rule.w))return false;
      if(fishTimesV42.length){const windows=area.timeOverride||rule.t||[[6,26]];if(!fishTimesV42.some(id=>matchesTime(windows,id)))return false;}
      return true;
    });
    const selectGroup=k=>{setFishFindGroupV4(k);const first=FISH_AREA_GROUPS_V4[k]?.ids?.[0];if(first)setFishAreaV4(first);};
    const filterButton=(label,on,onClick,tint="#FFF4D8")=><button onClick={onClick} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?tint:C.paper,borderRadius:14,padding:"4px 8px",fontSize:8.4,fontWeight:900,color:on?C.darkBrown:C.muted,whiteSpace:"nowrap"}}>{on?"✓ ":""}{label}</button>;
    const clearFilters=()=>{setFishSeasonsV42([]);setFishWeathersV42([]);setFishTimesV42([])};
    return <div style={{marginTop:8}}>
      <Card style={{padding:9,background:"#FFF4D8"}}>
        <div style={{fontSize:11,fontWeight:950,color:C.darkBrown}}>先選區域，再從地圖挑釣點</div>
        <div style={{display:"flex",gap:5,marginTop:6}}>{Object.entries(FISH_AREA_GROUPS_V4).map(([k,g])=><Pill key={k} small active={fishFindGroupV4===k} onClick={()=>selectGroup(k)}>{g.name}</Pill>)}</div>
      </Card>

      {mapMeta.file?<Card style={{marginTop:7,padding:7}}>
        <div style={{position:"relative",overflow:"hidden",borderRadius:8,border:`1px solid ${C.line}`,background:"#DCE9C2"}}>
          <img src={GAME_FILE(mapMeta.file)} alt={`${group.name}地圖`} style={{display:"block",width:"100%",height:"auto",imageRendering:"pixelated"}}/>
          {mapMeta.clusters.map(c=>{const on=c.ids.includes(area?.id);return <button key={c.id} onClick={()=>setFishAreaV4(c.ids[0])} style={{position:"absolute",left:`${c.x}%`,top:`${c.y}%`,transform:"translate(-50%,-50%)",border:`1.5px solid ${on?C.orange:"#8B683C"}`,background:on?"#FFE1A0":"rgba(255,248,226,.94)",boxShadow:"0 1px 3px rgba(0,0,0,.25)",borderRadius:10,padding:"2px 5px",fontSize:7.3,fontWeight:950,color:C.darkBrown,whiteSpace:"nowrap"}}>{c.label}</button>})}
        </div>
        {activeCluster?.ids?.length>1&&<div style={{marginTop:6}}><div style={{fontSize:7.8,fontWeight:900,color:C.muted,marginBottom:4}}>選擇釣點</div><div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(4,activeCluster.ids.length)},minmax(0,1fr))`,gap:4}}>{activeCluster.ids.map(id=>{const a=FISH_AREAS_V4.find(x=>x.id===id);if(!a)return null;const thumb=FISH_AREA_THUMB_V46[id]||activeCluster;const on=area.id===id;return <button key={id} onClick={()=>setFishAreaV4(id)} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFF0D2":C.paper,borderRadius:8,padding:3,minWidth:0,textAlign:"center"}}><div style={{position:"relative",height:47,borderRadius:6,overflow:"hidden",background:"#DCE9C2"}}>
                          <WikiImg src={GAME_FILE(mapMeta.file)} alt="" style={{position:"absolute",width:"290%",height:"auto",maxWidth:"none",left:"50%",top:"50%",transform:`translate(-${thumb.x}%,-${thumb.y}%)`,imageRendering:"pixelated"}}/>
                          <span style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:9,height:9,borderRadius:"50%",background:"#F7E6A4",border:"2px solid #9C3D2B",boxShadow:"0 1px 2px rgba(0,0,0,.35)"}}/></div><div style={{fontSize:7.2,fontWeight:950,color:on?C.orange:C.ink,lineHeight:1.08,marginTop:3}}>{a.sub}</div></button>})}</div></div>}
      </Card>:<Card style={{marginTop:7,padding:8}}>
        <div style={{fontSize:9,color:C.muted,marginBottom:5}}>特殊水域分散在不同場景，直接選入口或樓層。</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5}}>{groupAreas.map(a=>{const on=a.id===area.id;return <button key={a.id} onClick={()=>setFishAreaV4(a.id)} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFF0D2":C.paper,borderRadius:8,padding:"5px 2px",minWidth:0}}><GameIcon file={a.icon} size={27}/><div style={{fontSize:7.4,fontWeight:950,color:C.ink,lineHeight:1.08,marginTop:2}}>{a.name}</div><div style={{fontSize:6.7,color:C.muted,lineHeight:1.05}}>{a.sub}</div></button>})}</div>
      </Card>}

      <Card style={{marginTop:7,padding:8,background:"#FFF8E2"}}><div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={area.icon} size={34}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:13,color:C.darkBrown}}>{area.name} · {area.sub}</b>{area.island&&<div style={{fontSize:8.5,color:C.green,fontWeight:900,marginTop:2}}>姜岛魚類不受季節限制</div>}</div><span style={{fontSize:9.5,color:C.muted,fontWeight:900}}>{rows.length} 項</span></div>{area.tip&&<div style={{fontSize:9,color:C.brown,lineHeight:1.4,marginTop:5}}>{area.tip}</div>}</Card>

      <Card style={{marginTop:7,padding:7}}>
        <div style={{fontSize:9.2,fontWeight:950,color:C.brown,marginBottom:5}}>條件</div>
        <div style={{display:"grid",gap:5}}>
          <div style={{display:"grid",gridTemplateColumns:"34px 1fr",gap:4,alignItems:"start"}}><span style={{fontSize:7.5,fontWeight:900,color:C.muted,paddingTop:5}}>季節</span><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{SEASONS.map(x=>filterButton(x,fishSeasonsV42.includes(x),()=>toggleValue(x,fishSeasonsV42,setFishSeasonsV42),`${SEASON_COLORS[x]}30`))}</div></div>
          <div style={{display:"grid",gridTemplateColumns:"34px 1fr",gap:4,alignItems:"start"}}><span style={{fontSize:7.5,fontWeight:900,color:C.muted,paddingTop:5}}>天氣</span><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{["晴","雨"].map(x=>filterButton(x,fishWeathersV42.includes(x),()=>toggleValue(x,fishWeathersV42,setFishWeathersV42),x==="雨"?"#DCEBFA":"#FFF0B8"))}</div></div>
          <div style={{display:"grid",gridTemplateColumns:"34px 1fr",gap:4,alignItems:"start"}}><span style={{fontSize:7.5,fontWeight:900,color:C.muted,paddingTop:5}}>時間</span><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{FISH_TIME_SEGMENTS_V42.map(x=>filterButton(x.name,fishTimesV42.includes(x.id),()=>toggleValue(x.id,fishTimesV42,setFishTimesV42),"#E5EDF2"))}</div></div>
        </div>
        {(fishSeasonsV42.length||fishWeathersV42.length||fishTimesV42.length)?<button onClick={clearFilters} style={{border:0,background:"transparent",fontSize:7.8,color:C.blue,fontWeight:900,marginTop:6,padding:0}}>清除全部條件</button>:null}
      </Card>

      <div style={{display:"grid",gap:5,marginTop:7}}>{rows.map(i=>renderFishCardV4(i,area,true,false,true))}</div>
      {!rows.length&&<Card style={{marginTop:8,textAlign:"center",fontSize:10.5,color:C.muted}}>這個釣點目前沒有符合條件的魚。</Card>}
    </div>;
  };

  const renderItemUsageV42 = () => {
    const cleanName=name=>String(name||"").replace(/(?:金星|銀星|银星|銥星|铱星)/g,"").replace(/\s*[×x]\s*\d+.*/,"").trim();
    const index=new Map();
    const ensure=(rawName,file,kind="item")=>{
      const name=cleanName(rawName); if(!name||/^\d[\d,]*g$/i.test(name))return null;
      const resolved=file||itemFileZhV26(name)||name;
      const key=String(resolved||name);
      if(!index.has(key))index.set(key,{key,name,file:resolved,aliases:new Set(),kinds:new Set(),sources:new Set(),uses:new Set(),recommend:"",bundles:[],remix:[],cookNeed:0,cookGroups:new Set(),shippable:false,seasons:[],energy:null,health:null,poison:false,buffs:[],buffDuration:null,farmingKind:""});
      const it=index.get(key);it.aliases.add(name);it.kinds.add(kind);
      if(kind!=="shipping"&&it.kinds.size<=2)it.name=name;
      return it;
    };
    (window.SDVLookupV46?.items||[]).forEach(row=>{const it=ensure(row.zh||row.name,row.file||row.name,row.kind||"game");if(!it)return;it.aliases.add(row.name);(row.aliases||[]).forEach(x=>it.aliases.add(x));(row.sources||[]).forEach(x=>it.sources.add(x));(row.uses||[]).forEach(x=>it.uses.add(x));if(row.recommend)it.recommend=row.recommend;});
    SHIPPING_ITEMS_V30.forEach(([file,name])=>{const it=ensure(name,file,"shipping");if(it)it.shippable=true});
    COLLECTIONS.fish.items.forEach((name,i)=>{const it=ensure(name,FISH_ICON_FILES[i],"fish");if(it){it.fishIndex=i;if(FISH_INFO[i])it.sources.add(FISH_INFO[i])}});
    COLLECTIONS.artifact.items.forEach((name,i)=>{const it=ensure(name,ARTIFACT_ICON_FILES[i],"artifact");if(it&&ARTIFACT_INFO[i])it.sources.add(ARTIFACT_INFO[i])});
    COLLECTIONS.mineral.items.forEach((name,i)=>{const it=ensure(name,MINERAL_ICON_FILES[i],"mineral");if(it&&MINERAL_INFO[i])it.sources.add(MINERAL_INFO[i])});
    COOKING_DISHES_V3.forEach(([,name,file])=>{const it=ensure(name,file,"cooking");if(it)it.sources.add("烹飪製作")});
    BUNDLE_ROOMS.forEach(room=>room.bundles.forEach(bundle=>bundle.items.forEach(raw=>{const it=ensure(raw,null,"bundle");if(it)it.bundles.push(`${room.name} · ${bundle.name}：${raw}`)})));
    Object.entries(REMIX_EXTRA_ITEMS_V28||{}).forEach(([roomId,items])=>{const room=BUNDLE_ROOMS.find(r=>r.id===roomId);(items||[]).forEach(raw=>{const it=ensure(raw,null,"remix");if(it)it.remix.push(`${room?.name||roomId}的混合收集包可能需要：${raw}`)})});
    COOKING_PREP_GROUPS_V3.forEach(group=>group.items.forEach(([,name,file,need])=>{const it=ensure(name,file,"ingredient");if(it){it.cookNeed+=Number(need||0);it.cookGroups.add(group.name)}}));
    (MINE_BANDS_V28||[]).forEach(group=>(group.items||[]).forEach(([file,name])=>{const it=ensure(name,file,"mine");if(it)it.sources.add(`礦井 ${group.range} 層${group.note?` · ${group.note}`:""}`)}));
    const extraLookupV49=window.SDVLookupExtraV49?.byName||{};
    const applyExtraV49=(it,meta)=>{if(!it||!meta)return;if(Array.isArray(meta.seasons)&&meta.seasons.length)it.seasons=[...new Set(meta.seasons)];if(meta.energy!==null&&meta.energy!==undefined)it.energy=Number(meta.energy);if(meta.health!==null&&meta.health!==undefined)it.health=Number(meta.health);it.poison=Boolean(meta.poison);if(Array.isArray(meta.buffs))it.buffs=meta.buffs;if(meta.buffDuration!==null&&meta.buffDuration!==undefined)it.buffDuration=Number(meta.buffDuration);if(meta.kind)it.farmingKind=meta.kind;if(meta.growDays!==null&&meta.growDays!==undefined)it.growDays=Number(meta.growDays);if(meta.regrowDays!==null&&meta.regrowDays!==undefined)it.regrowDays=Number(meta.regrowDays);};
    Object.entries(extraLookupV49).forEach(([english,meta])=>{let it=[...index.values()].find(x=>x.name===english||x.file===english||x.aliases.has(english));if(!it)it=ensure(english,english,meta.kind||"game");if(it){it.aliases.add(english);applyExtraV49(it,meta);}});

    // v43：物品搜尋統一支援繁中／簡中／英文。
    // 同一個英文素材名在既有中英對照表中的所有繁簡名稱，都自動加入 alias。
    const aliasesByFileV43=new Map();
    Object.entries(ITEM_FILE_ZH_V26||{}).forEach(([alias,file])=>{
      const key=String(file||""); if(!key)return;
      if(!aliasesByFileV43.has(key))aliasesByFileV43.set(key,new Set());
      aliasesByFileV43.get(key).add(cleanName(alias));
    });
    index.forEach(it=>{const localAliases=aliasesByFileV43.get(String(it.file||""))||[];localAliases.forEach(alias=>it.aliases.add(alias));if(/^[\x00-\x7F]+$/.test(String(it.name||""))){const z=[...localAliases].find(alias=>/[\u3400-\u9fff]/.test(alias));if(z)it.name=z;}});

    // 常見攻略／口語別名：不改顯示名稱，只增加搜尋命中。
    const ITEM_SEARCH_EXTRA_ALIASES_V43={
      "Topaz":["黃寶石","黄宝石"],
      "Prismatic Shard":["彩虹碎片"],
      "Ancient Seed":["古代種子","古代种子"],
      "Battery Pack":["電池","电池"],
      "Cherry Bomb":["櫻桃炸彈","樱桃炸弹"],
      "Bomb":["炸彈","炸弹"],
      "Mega Bomb":["超級炸彈","超级炸弹"],
      "Sonar Bobber":["聲納浮標","声纳浮标","聲納魚標","声纳鱼标"],
      "Treasure Hunter":["尋寶者","寻宝者","尋寶魚標","寻宝鱼标"]
    };
    Object.entries(ITEM_SEARCH_EXTRA_ALIASES_V43).forEach(([file,aliases])=>{const it=index.get(file);if(it)aliases.forEach(x=>it.aliases.add(x))});

    // 將常見繁體字正規化成簡體後再比對；英文統一小寫並忽略空白／分隔符。
    const SEARCH_T2S_PAIRS_V43=[
      "黃黄","藍蓝","彈弹","聲声","尋寻","綠绿","紅红","銀银","銅铜","鐵铁","銥铱","礦矿","寶宝","鑽钻","遠远","種种","樹树","葉叶","電电","爐炉","鍋锅","製制","煉炼","絲丝","繩绳","體体","馬马","雞鸡","鴨鸭","龍龙","豬猪","貓猫","魚鱼","蝦虾","蝸蜗","蠣蛎","鸚鹦","鵡鹉","鮭鲑","鱸鲈","鯉鲤","鯰鲶","鯛鲷","鱒鳟","鯡鲱","鰻鳗","魷鱿","鱘鲟","槍枪","蔥葱","蘿萝","蔔卜","蘋苹","櫻樱","醬酱","麥麦","乾干","薑姜","蘚藓","蕪芜","纖纤","維维","濃浓","鬆松","餅饼","麵面","湯汤","飯饭","餃饺","燴烩","燻熏","鹽盐","鋼钢","鎬镐","鋤锄","劍剑","環环","鏡镜","褲裤","飾饰","項项","鏈链","鈴铃","鑰钥","滾滚","輪轮","機机","殘残","頁页","筆笔","記记","書书","圖图","鑑鉴","場场","鎮镇","島岛","灣湾","澤泽","層层","區区","傳传","說说","獎奖","勵励","殺杀","敵敌","萬万","數数","據据","應应","該该","夠够","賣卖","買买","獲获","釣钓","採采","網网","燈灯","漿浆","鳳凤","鬱郁","蘭兰","楓枫","膠胶","鴕鸵","鳥鸟","殼壳","貝贝","塊块","錠锭","髮发","顏颜","齒齿","頭头","盔盔","樂乐","鐘钟","劉刘","亞亚","麗丽","羅罗","喬乔","爾尔","薩萨","蘇苏","魯鲁"
    ];
    const SEARCH_T2S_V43=Object.fromEntries(SEARCH_T2S_PAIRS_V43.map(x=>[x[0],x[1]]));
    const normalizeItemSearchV43=value=>String(value||"").normalize("NFKC").toLowerCase().replace(/[\s·・_'’\-]+/g,"").split("").map(ch=>SEARCH_T2S_V43[ch]||ch).join("");

    const all=[...index.values()].filter(it=>{const name=String(it.name||"").trim(),file=String(it.file||"").trim();return Boolean(name)&&!/^\d+$/.test(name)&&!/^\d+$/.test(file)&&!/^\?\?.+\?\?$/.test(name)}).sort((a,b)=>a.name.localeCompare(b.name,"zh-Hant"));
    const itemFarmKindV49=it=>["crop","seed","fruit","sapling"].includes(it?.farmingKind);
    const itemCurrentSeasonV49=it=>{if(!it)return false;if(itemFarmKindV49(it)&&Array.isArray(it.seasons)&&it.seasons.includes(data.base.season))return true;if(it.fishIndex!==undefined){const r=fishRuleV4(it.fishIndex);return (r?.s||[]).includes(data.base.season);}return false;};
    const seasonLabelV49=s=>s==="ginger island"?"姜岛全年":s;
    const itemSeasonTextV49=it=>(it?.seasons||[]).length===4?"四季":((it?.seasons||[]).map(seasonLabelV49).join("／"));
    const itemSeasonTitleV49=it=>it?.fishIndex!==undefined?"出現季節":itemFarmKindV49(it)?"耕種季節":"出現季節";
    const itemSeasonIconV49=it=>it?.fishIndex!==undefined?"🐟":itemFarmKindV49(it)?"🌱":"🍃";
    const buffStatZhV49={Farming:"耕種",Fishing:"釣魚",Foraging:"採集",Mining:"採礦",Luck:"運氣",Speed:"速度",Defense:"防禦",Attack:"攻擊",Magnetism:"磁力",MaxStamina:"最大體力","Max Energy":"最大體力",Combat:"戰鬥",Immunity:"免疫",CritChance:"暴擊率"};
    const buffTextV49=it=>(it?.buffs||[]).map(b=>`${buffStatZhV49[b.stat]||b.stat} ${Number(b.value)>0?"+":""}${b.value}`).join("、");
    const durationTextV49=sec=>{const n=Number(sec);if(!Number.isFinite(n)||n<=0)return "";const m=Math.floor(n/60),s=n%60;return `${m}分${String(s).padStart(2,"0")}秒`;};
    const q=normalizeItemSearchV43(itemUsageQueryV42);
    const LOOKUP_EQUIPMENT_FILES_V66=new Set([
      "Bee House","Cask","Cheese Press","Dehydrator","Fish Smoker","Keg","Loom","Mayonnaise Machine","Oil Maker","Preserves Jar",
      "Sprinkler","Quality Sprinkler","Iridium Sprinkler","Scarecrow","Deluxe Scarecrow","Garden Pot","Auto-Grabber","Auto-Petter","Heater","Coffee Maker","Farm Computer","Hopper","Workbench","Mini-Shipping Bin","Sewing Machine","Telephone","Mini-Fridge","Mini-Jukebox","Statue Of Blessings","Statue Of The Dwarf King",
      "Bait Maker","Bone Mill","Charcoal Kiln","Crystalarium","Deluxe Worm Bin","Furnace","Geode Crusher","Heavy Furnace","Heavy Tapper","Lightning Rod","Mushroom Log","Ostrich Incubator","Recycling Machine","Seed Maker","Slime Egg-Press","Slime Incubator","Solar Panel","Tapper","Wood Chipper","Worm Bin","Deconstructor","Anvil","Mini-Forge","Crab Pot"
    ]);
    const itemIsEquipmentV66=it=>{const values=[it?.file,it?.name,...(it?.aliases||[])].filter(Boolean).map(String);return values.some(v=>LOOKUP_EQUIPMENT_FILES_V66.has(v))};
    const itemIsCraftableV66=it=>{const recipeSource=[...(it?.sources||[])].some(src=>/^製作：/.test(String(src||"")));const machineMeta=window.SDVMachineV51?.byName?.[String(it?.file||"")]||window.SDVMachineV51?.byName?.[String(it?.name||"")];return recipeSource||Boolean(machineMeta?.ingredients?.length)};
    const itemTagKeysV65=it=>{const tags=[];if(itemCurrentSeasonV49(it))tags.push("當季");if(["crop","seed","fruit","sapling"].includes(it?.farmingKind))tags.push("耕種");if(it?.farmingKind==="food"||it?.cookNeed||it?.kinds?.has("cooking"))tags.push("料理");if(it?.shippable)tags.push("出貨");if(it?.kinds?.has("artifact")||it?.kinds?.has("mineral"))tags.push("博物館");if(it?.bundles?.length||it?.remix?.length)tags.push("收集包");if(it?.kinds?.has("fish"))tags.push("魚");if(itemIsCraftableV66(it))tags.push("製作");if(itemIsEquipmentV66(it))tags.push("設備");return [...new Set(tags)]};
    const ITEM_TAG_ALIASES_V65={"當季":["當季","当季","season"],"耕種":["耕種","耕种","農作","农作","farming","crop"],"料理":["料理","烹飪","烹饪","cooking","food"],"出貨":["出貨","出货","shipping"],"博物館":["博物館","博物馆","museum"],"收集包":["收集包","bundle"],"魚":["魚","鱼","fish"],"製作":["製作","制作","craft","crafting"],"設備":["設備","设备","machine"]};
    const typedTagV65=!itemUsageFilterV65&&q.length>=2?(Object.entries(ITEM_TAG_ALIASES_V65).find(([tag,aliases])=>[tag,...aliases].some(x=>{const normalized=normalizeItemSearchV43(x);return normalized===q||normalized.startsWith(q)}))?.[0]||""):"";
    const activeTagV65=itemUsageFilterV65||typedTagV65;
    const nameQueryV65=typedTagV65?"":q;
    const matchesNameV65=it=>!nameQueryV65||[it.name,it.file,switchNameV47(it.name,it.file),...it.aliases].some(alias=>normalizeItemSearchV43(alias).includes(nameQueryV65));
    const matchesTagV65=it=>!activeTagV65||itemTagKeysV65(it).includes(activeTagV65);
    const quickNames=["五彩碎片","恐龍蛋","遠古種子","兔子的腳","電池組","硬木","鑽石","茶葉"];
    const results=((nameQueryV65||activeTagV65)?all.filter(it=>matchesNameV65(it)&&matchesTagV65(it)):quickNames.map(name=>all.find(it=>it.aliases.has(name)||it.name===name)).filter(Boolean)).slice(0,activeTagV65?80:30);
    const selected=all.find(it=>it.key===itemUsageSelectedV42)||null;
    const usageSpecial=selected?Object.entries(ITEM_USAGE_SPECIAL_V42).find(([name])=>selected.aliases.has(name)||selected.name===name)?.[1]:null;
    const wardrobeData=window.SDVWardrobeV34||{};
    const tailoring=selected?[...(wardrobeData.shirts||[]),...(wardrobeData.pants||[])].filter(x=>{const hay=`${x.recipe||""} ${x.sourceZh||""} ${x.source||""}`.toLowerCase();return [selected.name,selected.file,...selected.aliases].some(v=>v&&hay.includes(String(v).toLowerCase()))}).slice(0,6):[];
    const museum=Boolean(selected&&(selected.kinds.has("artifact")||selected.kinds.has("mineral")));
    const shipped=Boolean(selected?.shippable&&(data.shippingV30||[]).includes(selected.file));
    const sourceFallbackV45=()=>{
      if(!selected)return "";
      const known=[...selected.sources].filter(Boolean);
      if(known.length)return known.slice(0,3).join("；");
      const hay=`${selected.name} ${selected.file}`;
      if(/Egg|Milk|Wool|Duck Feather|Rabbit's Foot|Truffle|雞蛋|牛奶|羊奶|羊毛|鴨毛|兔子的腳|松露/i.test(hay))return "飼養動物取得";
      if(/Mayonnaise|Cheese|Oil|Jelly|Wine|Juice|Beer|Pale Ale|Mead|Pickles|Cloth|Caviar|Aged Roe|Smoked Fish|Dried|Green Tea|蛋黃醬|奶酪|油|果醬|果酒|果汁|啤酒|蜂蜜酒|醃菜|布料|魚子醬|陳年魚籽|燻魚|果乾|蘑菇乾|綠茶/i.test(hay))return "加工設備製作";
      if(/Ore|Bar|Coal|Quartz|Stone|Geode|Crystal|礦|錠|煤|石英|晶球|水晶/i.test(hay))return "採礦／晶球／冶煉等";
      if(/Wood|Hardwood|Sap|Fiber|Moss|木材|硬木|樹液|纖維|苔蘚/i.test(hay))return "砍樹／野外採集";
      if(/Seed|種子/i.test(hay))return "商店、採集或相關解鎖取得";
      if(selected.shippable)return "農作、採集、養殖或加工取得";
      return "農作、採集、養殖、加工、商店、掉落或任務取得";
    };
    const sourceTextV45=sourceFallbackV45();
    const usageRowsV44=[];
    if(selected){
      (usageSpecial?.uses||[]).forEach(u=>usageRowsV44.push(["⭐",u]));
      [...selected.uses].forEach(u=>usageRowsV44.push(["🔧",u]));
      if(museum)usageRowsV44.push(["🏺","博物館：可捐贈 1 個。"]);
      selected.bundles.forEach(u=>usageRowsV44.push(["📦",u]));
      selected.remix.forEach(u=>usageRowsV44.push(["📦",u]));
      if(selected.cookNeed)usageRowsV44.push(["🍳",`全料理最低備料需求：×${selected.cookNeed}。`]);
      tailoring.forEach(x=>usageRowsV44.push(["🧵",`裁縫：${x.name||"服飾"}${x.recipe?`（${x.recipe}）`:""}`]));
      if(selected.shippable)usageRowsV44.push(["🚚",`出貨圖鑑：${shipped?"已點亮":"賣出 1 個即可點亮"}。`]);
      if(!usageRowsV44.length)usageRowsV44.push(["・","暫無其他固定用途。"]);
    }
    const ITEM_TAG_COLORS_V65={"當季":"#DFF0CD","耕種":"#EAF4D8","料理":"#FBE5D6","出貨":"#EAF4D8","博物館":"#EEE6F7","收集包":"#FFF0C8","魚":"#DDECF7","製作":"#F4E4C7","設備":"#E8E1D4"};
    const tag=(text,bg)=> <span role="button" tabIndex={0} onClick={e=>{e.stopPropagation();setItemUsageFilterV65(itemUsageFilterV65===text?"":text);setItemUsageSelectedV42("")}} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();e.stopPropagation();setItemUsageFilterV65(itemUsageFilterV65===text?"":text);setItemUsageSelectedV42("")}}} style={{fontSize:7.2,fontWeight:900,padding:"2px 5px",borderRadius:8,background:bg,color:C.brown,whiteSpace:"nowrap",cursor:"pointer",outline:itemUsageFilterV65===text?`1.5px solid ${C.orange}`:"none"}}>{text}</span>;
    const resultTags=it=>itemTagKeysV65(it).map(t=>[t,ITEM_TAG_COLORS_V65[t]||"#F4E4C7"]).slice(0,4);
    return <div style={{marginTop:8}}>
      <Card style={{padding:8,background:"#FFF4D8"}}><div style={{fontSize:10.5,fontWeight:950,color:C.darkBrown}}>查物品用途與取得方式</div><div style={{fontSize:8.5,color:C.muted,lineHeight:1.4,marginTop:2}}>輸入物品名稱可模糊搜尋；分類可單獨使用，也能和搜尋文字一起篩選。</div></Card>
      <div style={{position:"relative",marginTop:7}}><input value={itemUsageQueryV42} onChange={e=>{setItemUsageQueryV42(e.target.value);setItemUsageSelectedV42("")}} placeholder="可輸入繁中／簡中／English，例如：黃玉、黄玉、Topaz…" style={{width:"100%",border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:9,padding:"9px 34px 9px 10px",fontSize:10.5,color:C.ink,outline:"none"}}/>{itemUsageQueryV42&&<button onClick={()=>{setItemUsageQueryV42("");setItemUsageSelectedV42("")}} style={{position:"absolute",right:6,top:5,border:0,background:"transparent",fontSize:14,color:C.muted}}>×</button>}</div>
      <div style={{display:"flex",alignItems:"center",gap:4,overflowX:"auto",WebkitOverflowScrolling:"touch",padding:"6px 1px 1px"}}><span style={{fontSize:7.5,color:C.muted,fontWeight:950,flex:"0 0 auto"}}>分類</span>{["","當季","耕種","出貨","博物館","收集包","料理","魚","製作","設備"].map(t=>{const on=(itemUsageFilterV65||typedTagV65)===t;return <span key={t||"all"} role="button" tabIndex={0} onClick={()=>{setItemUsageFilterV65(t);setItemUsageSelectedV42("")}} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setItemUsageFilterV65(t);setItemUsageSelectedV42("")}}} style={{flex:"0 0 auto",border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFE8B8":C.paper,borderRadius:12,padding:"3px 7px",fontSize:7.8,fontWeight:900,color:on?C.darkBrown:C.muted,cursor:"pointer"}}>{t||"全部"}</span>})}</div>
      {selected&&<Card id="lookup-detail-v62" style={{marginTop:7,padding:9,background:"#FFF8E9",scrollMarginTop:"calc(104px + env(safe-area-inset-top))"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={selected.file} size={44}/><div style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:14,color:C.darkBrown}}>{switchNameV47(selected.name,selected.file)}</b><div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4}}>{resultTags(selected).map(([t,b])=><span key={t}>{tag(t,b)}</span>)}</div></div></div>
        {(selected.seasons?.length>0||selected.energy!==null||selected.health!==null||(selected.buffs||[]).length>0)&&<div style={{marginTop:8,padding:"7px 8px",background:"#FFF4D8",borderRadius:8,border:`1px solid ${C.line}`,display:"grid",gap:4}}>
          {selected.seasons?.length>0&&<div style={{fontSize:9.5,color:C.ink,lineHeight:1.35}}>{itemSeasonIconV49(selected)} <b>{itemSeasonTitleV49(selected)}：</b>{itemSeasonTextV49(selected)}{itemCurrentSeasonV49(selected)&&<span style={{marginLeft:5,color:C.green,fontWeight:950}}>● 當季</span>}{itemFarmKindV49(selected)&&selected.growDays?` · 成熟 ${selected.growDays} 天`:""}{itemFarmKindV49(selected)&&selected.regrowDays?` · 再生 ${selected.regrowDays} 天`:""}</div>}
          {(selected.energy!==null||selected.health!==null)&&<div style={{fontSize:9.5,color:C.ink,lineHeight:1.35}}>⚡ <b>食用：</b>體力 {selected.energy!==null?(selected.energy>0?`+${selected.energy}`:selected.energy):"—"}　❤️ 生命 {selected.health!==null?(selected.health>0?`+${selected.health}`:selected.health):"—"}{selected.poison?<span style={{color:C.red,fontWeight:950}}> · 有負面食用效果</span>:null}</div>}
          {(selected.buffs||[]).length>0&&<div style={{fontSize:9.5,color:C.ink,lineHeight:1.35}}>✨ <b>技能／狀態加成：</b>{buffTextV49(selected)}{selected.buffDuration?` · ${durationTextV49(selected.buffDuration)}`:""}</div>}
        </div>}
        <div style={{fontSize:12,fontWeight:950,color:C.darkBrown,marginTop:9}}>用途</div>
        <div style={{display:"grid",gap:5,marginTop:5}}>{usageRowsV44.map(([icon,text],i)=><div key={i} style={{display:"grid",gridTemplateColumns:"18px 1fr",gap:4,alignItems:"start",fontSize:9.4,color:C.ink,lineHeight:1.45}}><span>{icon}</span><span>{text}</span></div>)}</div>
        {(()=>{const hit=cropOfV96(selected.file);if(!hit)return null;const {c,isSeed}=hit;const plan=cropPlanV96(c,{season:data.base.season,day:data.base.day});
          const fmtToday=`${data.base.season}${Number(data.base.day||1)}`;
          return <div style={{marginTop:8}}>
            <div style={{fontSize:7.5,color:C.muted,fontWeight:950,marginBottom:3}}>🌱 種植{isSeed?"（種子）":""}</div>
            <div style={{fontSize:8.6,color:C.ink,lineHeight:1.55}}>
              生長 {c.grow} 天・季節 {c.seasons.length?c.seasons.join("／"):"—"}{c.regrow?`・回收型：每 ${c.regrow} 天再收`:""}
              {plan.kind==="ok"&&<div style={{marginTop:2,fontWeight:900,color:plan.okToday?C.green:C.red}}>{plan.okToday?`今天（${fmtToday}）種 → ${plan.harvest} 收成 ✓`:`最後可種日 ${plan.lastPlant??"—"} 已過 ✗`}{plan.okToday&&`（最後可種日 ${plan.lastPlant}）`}</div>}
              {plan.kind==="off"&&<div style={{marginTop:2,fontWeight:900,color:C.muted}}>本季（{data.base.season}）不可種</div>}
              {c.note&&<div style={{marginTop:2,color:C.brown}}>{c.note}</div>}
              <div style={{fontSize:6.8,color:C.muted,marginTop:3}}>無肥料基準；溫室不受季節限制。</div>
            </div>
          </div>})()}
        {(()=>{const gf=giftFansV89(selected.file);if(!gf.loves.length&&!gf.likes.length)return null;const npcChip=n=><button key={n} onClick={()=>openSocialNpcV55(n)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"3px 6px 3px 3px",display:"inline-flex",alignItems:"center",gap:3,fontSize:8,fontWeight:900,color:C.brown,cursor:"pointer"}}><GameIcon file={(window.SDVSocialV50?.byZh?.[n]?.english)||"Friendship 101"} size={20}/>{n} ›</button>;return <div style={{marginTop:9}}>
          <div style={{fontSize:12,fontWeight:950,color:C.darkBrown}}>送禮</div>
          {gf.loves.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center",marginTop:5}}><span style={{fontSize:8.5,fontWeight:950,color:C.red,flex:"0 0 auto"}}>💗 最愛</span>{gf.loves.map(npcChip)}</div>}
          {gf.likes.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center",marginTop:5}}><span style={{fontSize:8.5,fontWeight:950,color:C.green,flex:"0 0 auto"}}>👍 喜歡</span>{gf.likes.map(npcChip)}</div>}
        </div>})()}
        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:8,alignItems:"center",marginTop:9,paddingTop:7,borderTop:`1px dashed ${C.line}`}}>
          <div style={{minWidth:0}}><span style={{fontSize:8,color:C.muted,fontWeight:950}}>來源／取得方式</span><div style={{fontSize:9.4,color:C.ink,lineHeight:1.4,marginTop:2,fontWeight:750}}>{sourceTextV45}</div></div>
        </div>
      </Card>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:5,marginTop:6}}>{results.map(it=>{const on=selected?.key===it.key,current=itemCurrentSeasonV49(it);return <button key={it.key} onClick={()=>setItemUsageSelectedV42(it.key)} style={{border:`1.5px solid ${on?C.orange:current?C.green:C.line}`,background:on?"#FFF0D2":current?"#EEF7DD":C.paper,borderRadius:9,padding:"6px 5px",display:"grid",gridTemplateColumns:"34px 1fr",gap:5,alignItems:"center",textAlign:"left",minWidth:0}}><GameIcon file={it.file} size={32}/><span style={{minWidth:0}}><b style={{display:"block",fontSize:8.8,color:current?C.green:C.ink,lineHeight:1.12,overflow:"hidden",textOverflow:"ellipsis"}}>{switchNameV47(it.name,it.file)}</b><span style={{display:"flex",gap:2,flexWrap:"wrap",marginTop:3}}>{resultTags(it).map(([t,b])=><span key={t}>{tag(t,b)}</span>)}</span></span></button>})}</div>
      {!q&&!activeTagV65&&<div style={{fontSize:7.8,color:C.muted,marginTop:4}}>未輸入名稱時會顯示常查物品，也可以直接用上方分類篩選。</div>}
      {(q||activeTagV65)&&!results.length&&<Card style={{marginTop:7,textAlign:"center",fontSize:9.5,color:C.muted}}>找不到符合的物品；可換一個名稱，或清除分類條件。</Card>}

    </div>;
  };

  const renderFishingV30 = () => {
    const fast=fishViewV4==="items"?"items":"world";
    return <div><SectionTitle icon="game:Magnifying Glass">查找</SectionTitle><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:3}}><button onClick={()=>setFishViewV4("world")} style={{border:`2px solid ${fast==="world"?C.orange:C.line}`,background:fast==="world"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Map" size={29}/>世界</button><button onClick={()=>setFishViewV4("items")} style={{border:`2px solid ${fast==="items"?C.orange:C.line}`,background:fast==="items"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Treasure Hunter" size={29}/>物品</button></div>{fast==="items"?renderItemUsageV42():renderWorldV87()}</div>;
  };

  const renderWardrobeV30 = () => {
    const defaults={
      player:{hat:"",shirt:"",pants:"",boots:"",shirtColor:"#5f8fb8",pantsColor:"#3f5f99",gender:"female",hairIndex:0,hairColor:"#6a402c",skinIndex:0,eyeColor:wardrobeAppearanceMetaV37.defaultEyeColor||"#5B4636",accessoryIndex:-1},
      horse:{hat:""},cat:{hat:"",variant:0},dog:{hat:"",variant:0}
    };
    const stored=data.wardrobeV30||{};
    const wardrobe={...defaults,...stored,
      player:{...defaults.player,...(stored.player||{})},horse:{...defaults.horse,...(stored.horse||{})},cat:{...defaults.cat,...(stored.cat||{})},dog:{...defaults.dog,...(stored.dog||{})}};
    const target={...(defaults[wardrobeTargetV30]||{}),...(wardrobe[wardrobeTargetV30]||{})};
    const setTarget=patch=>update({wardrobeV30:{...wardrobe,[wardrobeTargetV30]:{...target,...patch}}});
    const setPlayer=patch=>update({wardrobeV30:{...wardrobe,player:{...wardrobe.player,...patch}}});
    const db=window.SDVWardrobeV34||{};
    const wrap=arr=>(arr||[]).map(x=>[x.key,switchNameV47(x.name,x.icon||x.key),x.sourceZh||x.source,x.dyeable,x]);
    const hatsFull=wrap(db.hats); const shirtsFull=wrap(db.shirts); const pantsFull=wrap(db.pants);
    const bootsFull=BOOTS_V30.map(x=>[x[0],switchNameV47(x[1],x[0]),x[2],false,{key:x[0],icon:x[0],name:switchNameV47(x[1],x[0]),source:x[2],recipe:"",dyeable:false}]);
    const cats={hat:hatsFull.length?hatsFull:HATS_V30,shirt:shirtsFull.length?shirtsFull:SHIRTS_V30,pants:pantsFull.length?pantsFull:PANTS_V30,boots:bootsFull};
    const rawList=wardrobeTargetV30==="player"?cats[wardrobeCategoryV30]:cats.hat;
    const q=wardrobeQueryV34.trim().toLowerCase();
    const searched=q?rawList.filter(it=>`${it[1]} ${it[2]} ${it[4]?.source||""} ${it[0]}`.toLowerCase().includes(q)):rawList;
    const wardrobeFilterSafeV39=wardrobeTargetV30==="player"&&wardrobeCategoryV30==="boots"?"all":wardrobeFilterV37;
    const list=searched.filter(it=>wardrobeFilterSafeV39==="dyeable"?Boolean(it[3]):wardrobeFilterSafeV39==="tailoring"?Boolean(it[4]?.recipe):wardrobeFilterSafeV39==="other"?!it[4]?.recipe:true);
    const WARDROBE_PAGE_SIZE_V37=18;
    const wardrobePageCountV37=Math.max(1,Math.ceil(list.length/WARDROBE_PAGE_SIZE_V37));
    const wardrobePageSafeV37=Math.min(wardrobePageV37,wardrobePageCountV37-1);
    const pageList=list.slice(wardrobePageSafeV37*WARDROBE_PAGE_SIZE_V37,(wardrobePageSafeV37+1)*WARDROBE_PAGE_SIZE_V37);
    const slot=wardrobeTargetV30==="player"?wardrobeCategoryV30:"hat";
    const chosen=target[slot]||"";
    const targets=[["player","玩家","Inventory Tab"],["horse","馬","Horse"],["cat","貓","Cat 1"],["dog","狗","Dog 1"]];
    const directions=[["front","正面"],["right","右側"],["back","背面"],["left","左側"]];
    const player=wardrobe.player;
    const findMeta=(kind,key)=>kind&&key?(cats[kind]||[]).find(x=>x[0]===key):null;
    const slotDefs=[["hat","帽子","Cowboy Hat"],["shirt","上衣","Shirt003"],["pants","下裝","Farmer Pants"],["boots","鞋","Space Boots"]];
    const currentTargetLabel=targets.find(x=>x[0]===wardrobeTargetV30)?.[1]||"玩家";
    const hatMeta=findMeta("hat",player.hat),shirtMeta=findMeta("shirt",player.shirt),pantsMeta=findMeta("pants",player.pants),bootsMeta=findMeta("boots",player.boots);
    const shirtDyeable=Boolean(shirtMeta?.[3]),pantsDyeable=Boolean(pantsMeta?.[3]);
    const shirtColor=player.shirtColor||defaults.player.shirtColor,pantsColor=player.pantsColor||defaults.player.pantsColor;
    const hairColor=player.hairColor||defaults.player.hairColor,eyeColor=player.eyeColor||wardrobeAppearanceMetaV37.defaultEyeColor||"#5B4636";
    const hairCountV37=Math.max(1,Number(wardrobeAppearanceMetaV37.hairCount)||64),skinCountV37=Math.max(1,Number(wardrobeAppearanceMetaV37.skinCount)||24),accessoryCountV37=Math.max(1,Number(wardrobeAppearanceMetaV37.accessoryCount)||29);
    const hexRgb=hex=>{const m=String(hex||"").match(/^#([0-9a-f]{6})$/i);if(!m)return[0,0,0];const n=parseInt(m[1],16);return[(n>>16)&255,(n>>8)&255,n&255]};
    const rgbHex=rgb=>`#${rgb.map(v=>Math.max(0,Math.min(255,Math.round(Number(v)||0))).toString(16).padStart(2,"0")).join("")}`;
    const clampGameColorV40=v=>Math.max(0,Math.min(100,Math.round(Number(v)||0)));
    const hexToGameHsvV40=hex=>{const [rr,gg,bb]=hexRgb(hex).map(v=>v/255);const max=Math.max(rr,gg,bb),min=Math.min(rr,gg,bb),d=max-min;let h=0;if(d){if(max===rr)h=((gg-bb)/d)%6;else if(max===gg)h=(bb-rr)/d+2;else h=(rr-gg)/d+4;h/=6;if(h<0)h+=1}const s=max===0?0:d/max;return [Math.round(h*100)%100,Math.round(s*100),Math.round(max*100)]};
    const gameHsvToHexV40=hsv=>{let [h,s,v]=hsv.map(clampGameColorV40);h=(h%100)/100*6;s/=100;v/=100;const sector=Math.floor(h)%6,f=h-Math.floor(h),p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);const rgb=[[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]][sector].map(x=>x*255);return rgbHex(rgb)};
    const getGameHsvV40=(kind,color)=>{const storedHsv=kind?player[kind+"ColorHSV"]:null;if(Array.isArray(storedHsv)&&storedHsv.length===3)return storedHsv.map(clampGameColorV40);return hexToGameHsvV40(color)};
    const setGameHsvV40=(kind,color,hsv)=>{const next=hsv.map(clampGameColorV40);setPlayer({[kind+"Color"]:gameHsvToHexV40(next),[kind+"ColorHSV"]:next})};
    const activeDyeKindV39=wardrobeTargetV30==="player"&&slot==="shirt"&&shirtDyeable?"shirt":wardrobeTargetV30==="player"&&slot==="pants"&&pantsDyeable?"pants":null;
    const activeDyeColorV39=activeDyeKindV39==="shirt"?shirtColor:activeDyeKindV39==="pants"?pantsColor:null;
    const hsvEditorV40=(kind,color,enabled)=>{const hsv=getGameHsvV40(kind,color);const labels=[["H","色相"],["S","飽和度"],["V","明度"]];const set=(i,v)=>{const next=[...hsv];next[i]=clampGameColorV40(v);setGameHsvV40(kind,color,next)};const setHex=hex=>{const next=hexToGameHsvV40(hex);setPlayer({[kind+"Color"]:hex,[kind+"ColorHSV"]:next})};return <div style={{display:"grid",gridTemplateColumns:"30px repeat(3,minmax(0,1fr))",gap:3,alignItems:"center",opacity:enabled?1:.42}}><input type="color" disabled={!enabled} value={color} onChange={e=>setHex(e.target.value)} title="挑色" aria-label="挑色" style={{width:28,height:25,border:0,padding:0,background:"transparent"}}/>{hsv.map((value,i)=><label key={i} title={`${labels[i][1]}（遊戲 0–100）`} style={{display:"grid",gridTemplateColumns:"11px minmax(0,1fr)",gap:1,alignItems:"center",minWidth:0}}><span style={{fontSize:7,fontWeight:950,color:C.brown,textAlign:"center"}}>{labels[i][0]}</span><input type="number" min="0" max="100" disabled={!enabled} value={value} aria-label={labels[i][1]} onChange={e=>set(i,e.target.value)} style={{width:"100%",minWidth:0,border:`1px solid ${C.line}`,borderRadius:5,padding:"3px 1px",fontSize:7.5,textAlign:"center",background:C.cream,color:C.ink}}/></label>)}</div>};
    const compactStepperV39=(label,value,min,max,onValueChange,zeroMeansNone=false)=>{const shown=Math.max(min,Math.min(max,Number(value)||0));return <div style={{minWidth:0}}><div style={{fontSize:7.2,fontWeight:950,color:C.ink,textAlign:"center",whiteSpace:"nowrap",marginBottom:2}}>{label}{zeroMeansNone&&shown===0?<span style={{color:C.muted,fontWeight:800}}>・無</span>:null}</div><div style={{display:"grid",gridTemplateColumns:"22px minmax(30px,1fr) 22px",gap:2}}><button onClick={()=>onValueChange(Math.max(min,shown-1))} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:5,padding:0,fontSize:8,fontWeight:950,color:C.brown}}>◀</button><input type="number" min={min} max={max} value={shown} onChange={e=>onValueChange(Math.max(min,Math.min(max,Number(e.target.value)||min)))} style={{width:"100%",minWidth:0,border:`1px solid ${C.line}`,background:C.paper,borderRadius:5,padding:"3px 1px",fontSize:8,fontWeight:950,textAlign:"center",color:C.ink}}/><button onClick={()=>onValueChange(Math.min(max,shown+1))} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:5,padding:0,fontSize:8,fontWeight:950,color:C.brown}}>▶</button></div></div>};
    const preview=(dir,large=false,scene="day")=>wardrobeTargetV30==="player"?<FarmerSpritePreviewV33 player={player} direction={dir} large={large} scene={scene} shirtDyeable={shirtDyeable} pantsDyeable={pantsDyeable}/>:<AnimalSpritePreviewV33 type={wardrobeTargetV30} variant={Number(target.variant||0)} hat={target.hat||""} direction={dir} large={large} scene={scene}/>;
    const summaryRow=(label,meta,color,fallback,colorKind=null)=>{const m=meta?.[4]||{};const icon=m.icon||meta?.[0]||fallback;const hsv=color?getGameHsvV40(colorKind,color):null;return <div style={{display:"grid",gridTemplateColumns:"38px 1fr",gap:6,padding:"4px 0",borderBottom:`1px dashed ${C.line}`,alignItems:"center"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:meta?1:.28}}><GameIcon file={icon||fallback} size={27}/><span style={{fontSize:6.6,fontWeight:900,color:C.brown,lineHeight:1,marginTop:1}}>{label}</span></div>{!meta?<span style={{fontSize:8.5,color:C.muted}}>未選</span>:<div><div style={{fontSize:9.3,fontWeight:950,color:C.ink}}>{meta[1]}</div><div style={{fontSize:7.7,color:C.muted,lineHeight:1.3,marginTop:1}}>{m.recipe?`製作：${m.recipe}`:(meta[2]||"取得方式待補")}</div>{m.recipe&&meta[2]&&meta[2]!==m.recipe&&<div style={{fontSize:7.2,color:C.muted,lineHeight:1.25,marginTop:1}}>{meta[2]}</div>}{hsv&&<div style={{fontSize:7.7,color:C.blue,fontWeight:900,marginTop:1}}>染色 HSV：{hsv.join(" / ")}</div>}</div>}</div>};

    return <div>
      <SectionTitle icon="game:Deluxe Cowboy Hat">衣櫥搭配</SectionTitle>
      <Card style={{padding:"6px 8px",background:"#FFF4D8"}}><div style={{fontSize:8.4,color:C.muted,lineHeight:1.35}}>自由搭配角色、服飾與染色；顏色數字使用遊戲同款 H／S／V（色相／飽和度／明度）。</div></Card>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{targets.map(([id,name,file])=>{const on=wardrobeTargetV30===id;return <button key={id} onClick={()=>{setWardrobeTargetV30(id);setWardrobeQueryV34("");setWardrobeFilterV37("all");setWardrobePageV37(0);if(id!=="player")setWardrobeCategoryV30("hat")}} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFE2A8":C.paper,borderRadius:9,padding:"5px 2px",fontSize:8.5,fontWeight:950,color:C.brown,minWidth:0}}>{id==="player"?(data.profilePortrait?<img src={data.profilePortrait} alt="" style={{width:27,height:34,objectFit:"cover",borderRadius:4,imageRendering:"pixelated"}}/>:<GameIcon file="Inventory Tab" size={27}/>):<GameIcon file={file} size={27}/>}<div>{name}</div></button>})}</div>

      {wardrobeTargetV30==="player"&&<>
        <Card style={{marginTop:7,padding:7}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}><b style={{fontSize:9.2,color:C.brown}}>角色外觀</b><div style={{display:"flex",gap:4}}>{["female","male"].map(g=>{const on=(g==="male")?player.gender==="male":player.gender!=="male";return <button key={g} title={g==="male"?"男性體型":"女性體型"} aria-label={g==="male"?"男性體型":"女性體型"} onClick={()=>setPlayer({gender:g})} style={{width:34,height:34,border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFF0D2":C.paper,borderRadius:7,padding:2,display:"flex",alignItems:"center",justifyContent:"center"}}><GenderIconV39 gender={g}/></button>})}</div></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5,marginTop:5}}>
            {compactStepperV39("膚色",Number(player.skinIndex||0)+1,1,skinCountV37,v=>setPlayer({skinIndex:v-1}))}
            {compactStepperV39("髮型",Number(player.hairIndex||0)+1,1,hairCountV37,v=>setPlayer({hairIndex:v-1}))}
            {compactStepperV39("配飾",Number(player.accessoryIndex??-1)+1,0,accessoryCountV37,v=>setPlayer({accessoryIndex:v-1}),true)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:6}}><div><div style={{fontSize:7.2,fontWeight:950,color:C.ink,marginBottom:2}}>髮色 HSV</div>{hsvEditorV40("hair",hairColor,true)}</div><div><div style={{fontSize:7.2,fontWeight:950,color:C.ink,marginBottom:2}}>眼睛 HSV</div>{hsvEditorV40("eye",eyeColor,true)}</div></div>
        </Card>
      </>}

      <Card style={{marginTop:7,padding:8}}>
        {(wardrobeTargetV30==="cat"||wardrobeTargetV30==="dog")&&<div style={{display:"grid",gridTemplateColumns:"30px repeat(6,minmax(0,1fr))",gap:3,alignItems:"center",marginBottom:5}}><span style={{fontSize:7.2,fontWeight:950,color:C.muted,textAlign:"center"}}>外觀</span>{[0,1,2,3,4,5].map(v=>{const on=Number(target.variant||0)===v;return <button key={v} title={`款式 ${v+1}`} aria-label={`款式 ${v+1}`} onClick={()=>setTarget({variant:v})} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFF0D2":C.cream,borderRadius:6,padding:1,minWidth:0,minHeight:29,display:"flex",alignItems:"center",justifyContent:"center"}}><PetVariantPreviewV36 type={wardrobeTargetV30} variant={v} compact/></button>})}</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4}}>{directions.map(([id])=><button key={id} onClick={()=>setWardrobeDirectionV32(id)} style={{border:`1.5px solid ${wardrobeDirectionV32===id?C.orange:C.line}`,background:wardrobeDirectionV32===id?"#FFF0D2":C.paper,borderRadius:8,padding:3,minWidth:0}}>{preview(id,false)}</button>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginTop:7}}>
          {preview(wardrobeDirectionV32,true,"day")}
          {preview(wardrobeDirectionV32,true,"night")}
        </div>
        <div style={{textAlign:"center",fontSize:8,color:C.muted,marginTop:5}}>點上方四個方向切換；下方同步預覽白天／夜晚效果。</div>
      </Card>



      {wardrobeTargetV30==="player"&&<>
        <Card style={{marginTop:7,padding:8,background:"#FFF8E9"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:4}}><b style={{fontSize:10,color:C.brown}}>我的搭配清單</b><span style={{fontSize:8,color:C.muted}}>髮型 {Number(player.hairIndex||0)+1} 號</span></div>
          {summaryRow("帽子",hatMeta,null,"Cowboy Hat")}{summaryRow("上衣",shirtMeta,shirtDyeable?shirtColor:null,"Shirt003","shirt")}{summaryRow("下裝",pantsMeta,pantsDyeable?pantsColor:null,"Farmer Pants","pants")}{summaryRow("鞋",bootsMeta,null,"Space Boots")}
        </Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{slotDefs.map(([id,name,file])=>{const on=wardrobeCategoryV30===id;const selected=player[id];const sm=findMeta(id,selected);return <button key={id} onClick={()=>{setWardrobeCategoryV30(id);setWardrobeQueryV34("");setWardrobeFilterV37("all");setWardrobePageV37(0)}} style={{border:`1.5px solid ${on?C.orange:selected?C.green:C.line}`,background:on?"#FFE2A8":selected?"#EEF7DD":C.paper,borderRadius:8,padding:"5px 2px",fontSize:8.5,fontWeight:950,color:C.brown,minWidth:0}}><GameIcon file={sm?.[4]?.icon||selected||file} size={25}/><div>{name}</div></button>})}</div>
        {activeDyeKindV39&&<Card style={{marginTop:6,padding:"6px 8px"}}><div style={{display:"grid",gridTemplateColumns:"54px 1fr",gap:6,alignItems:"center"}}><b style={{fontSize:7.8,color:C.brown}}>{activeDyeKindV39==="shirt"?"上衣染色 HSV":"下裝染色 HSV"}</b>{hsvEditorV40(activeDyeKindV39,activeDyeColorV39,true)}</div></Card>}
      </>}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6,marginTop:8}}><div style={{fontSize:9.5,fontWeight:950,color:C.brown}}>{wardrobeTargetV30==="player"?slotDefs.find(x=>x[0]===slot)?.[1]:`${currentTargetLabel}帽子`}・{rawList.length} 項</div>{chosen&&<button onClick={()=>setTarget({[slot]:""})} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:8.5,fontWeight:900,color:C.red}}>清除</button>}</div>
      <input value={wardrobeQueryV34} onChange={e=>{setWardrobeQueryV34(e.target.value);setWardrobePageV37(0)}} placeholder={`搜尋${wardrobeTargetV30==="player"?(slotDefs.find(x=>x[0]===slot)?.[1]||""):"帽子"}名稱或材料…`} style={{width:"100%",marginTop:6,border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:9,padding:"8px 10px",fontSize:10,color:C.ink,outline:"none"}}/>
      {!(wardrobeTargetV30==="player"&&slot==="boots")&&<div style={{display:"flex",gap:4,overflowX:"auto",padding:"5px 0 1px",WebkitOverflowScrolling:"touch"}}>{[["all","全部"],["tailoring","裁縫"],...((wardrobeTargetV30==="player"&&(slot==="shirt"||slot==="pants"))?[["dyeable","可染色"]]:[]),["other","其他取得"]].map(([id,label])=><button key={id} onClick={()=>{setWardrobeFilterV37(id);setWardrobePageV37(0)}} style={{flex:"0 0 auto",border:`1.5px solid ${wardrobeFilterSafeV39===id?C.orange:C.line}`,background:wardrobeFilterSafeV39===id?"#FFF0D2":C.cream,borderRadius:14,padding:"4px 9px",fontSize:8,fontWeight:900,color:C.brown}}>{label}</button>)}</div>}
      <div style={{fontSize:7.8,color:C.muted,marginTop:3}}>顯示 {list.length} / {rawList.length} 項 ・ 第 {wardrobePageSafeV37+1} / {wardrobePageCountV37} 頁</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5,marginTop:6}}>{pageList.map(it=>{const [key,name,source,dye,meta]=it;const on=chosen===key;return <button key={key} onClick={()=>setTarget({[slot]:on?"":key})} title={meta?.recipe?`製作：${meta.recipe}`:source} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,padding:"5px 3px",minHeight:78,textAlign:"center",cursor:"pointer",minWidth:0}}><GameIcon file={meta?.icon||key} size={34}/><div style={{fontSize:7.9,fontWeight:950,color:on?C.green:C.ink,lineHeight:1.12,marginTop:2,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{name}</div>{!meta?.recipe&&source&&<div style={{fontSize:6.8,color:C.muted,lineHeight:1.18,marginTop:2,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{source}</div>}<div style={{display:"flex",justifyContent:"center",gap:3,marginTop:3}}>{meta?.recipe&&<span style={{fontSize:6.3,color:C.brown,background:"#FFF0D2",borderRadius:5,padding:"1px 4px",fontWeight:900}}>裁縫</span>}{dye&&<span style={{fontSize:6.3,color:C.blue,background:"#E8F3FA",borderRadius:5,padding:"1px 4px",fontWeight:900}}>可染</span>}</div></button>})}</div>
      {wardrobePageCountV37>1&&<div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:6,alignItems:"center",marginTop:7}}><button disabled={wardrobePageSafeV37<=0} onClick={()=>setWardrobePageV37(Math.max(0,wardrobePageSafeV37-1))} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:8,padding:6,fontSize:8.5,fontWeight:900,color:C.brown,opacity:wardrobePageSafeV37<=0?.4:1}}>◀ 上一頁</button><span style={{fontSize:8.2,fontWeight:900,color:C.muted}}>{wardrobePageSafeV37+1} / {wardrobePageCountV37}</span><button disabled={wardrobePageSafeV37>=wardrobePageCountV37-1} onClick={()=>setWardrobePageV37(Math.min(wardrobePageCountV37-1,wardrobePageSafeV37+1))} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:8,padding:6,fontSize:8.5,fontWeight:900,color:C.brown,opacity:wardrobePageSafeV37>=wardrobePageCountV37-1?.4:1}}>下一頁 ▶</button></div>}
    </div>;
  };

  const renderNotes = () => <div>
    <SectionTitle icon="🔗">分享我的手帳</SectionTitle>
    <Card style={{background:"#EAF4D8"}}>
      <div style={{fontSize:12,color:C.ink,lineHeight:1.55,marginBottom:9}}><b>分享的是完整手帳，不是純文字。</b>朋友打開唯讀連結後，會直接看到你目前雲端保存的日期、農場、社區中心、動物、魚塘、社交、收藏、烹飪等記錄；你之後更新，他重新整理也會看到新版。</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><button onClick={copyTrackerView} style={{border:`2px solid ${C.green}`,background:C.lightGreen,color:C.green,borderRadius:9,padding:10,fontWeight:950}}>複製連結</button><button onClick={shareTrackerView} style={{border:`2px solid ${C.orange}`,background:"#FFE4C5",color:C.brown,borderRadius:9,padding:10,fontWeight:950}}>分享手帳…</button></div>
      <div style={{fontSize:10,color:C.muted,marginTop:7}}>此連結為唯讀，朋友無法改動你的雲端存檔。</div>
      {!trackerShareUrl()&&<div style={{marginTop:8,padding:"8px 9px",border:`1px dashed ${C.orange}`,borderRadius:8,background:"#FFF4D8"}}><div style={{fontSize:9.5,color:C.brown,lineHeight:1.45}}>新網址第一次使用時，按一下就會從舊 GitHub 網址帶回這台裝置原本的雲端手帳；不需要自己找管理連結。</div><button onClick={reconnectCloudV49} style={{width:"100%",marginTop:6,border:`1.5px solid ${C.orange}`,background:"#FFE4C5",color:C.brown,borderRadius:8,padding:7,fontWeight:950,fontSize:10}}>搬移／重新連接原本手帳</button></div>}
    </Card>
    <SectionTitle icon="game:Journal Scrap">純文字進度</SectionTitle>
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
    <SectionTitle icon="🔗">分享 App 網址</SectionTitle>
    <Card><div style={{fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:9}}>這是手帳 App 本身的公開網址，不包含你的個人進度。朋友打開後會使用自己的獨立手帳。</div><button onClick={copyPublicAppUrlV49} style={{width:"100%",border:`2px solid ${C.green}`,background:C.lightGreen,color:C.green,borderRadius:9,padding:10,fontWeight:950}}>複製 App 網址</button></Card>
    <SectionTitle icon="📱">手機使用</SectionTitle>
    <Card><div style={{fontSize:12,color:C.muted,lineHeight:1.6}}>建議把頁面加入 iPhone 主畫面，玩 Switch 時像 App 一樣直接打開。進度存在目前裝置；若要換裝置請先匯出 JSON 備份再匯入。圖鑑圖片來自 Stardew Valley Wiki。</div></Card>
    <SectionTitle icon="⚠️">資料管理</SectionTitle>
    <button onClick={async()=>{if(confirm("確定要清除全部進度並回到空白手帳嗎？")){await storageDelete(PUB_KEY,true);await storageDelete(STORAGE_KEY,false);setData(PREFILL)}}} style={{width:"100%",border:`2px solid ${C.red}`,background:"#FBE4DE",color:C.red,borderRadius:9,padding:10,fontWeight:950}}>重設全部進度</button>
  </div>;

  if(!loaded)return <div style={{minHeight:"100vh",background:"#5a3825",display:"flex",flexDirection:"column",alignItems:"center",padding:"17vh 24px 0",fontFamily:"system-ui",color:"#f4ddb0",fontWeight:900}}><img src="https://stardewvalleywiki.com/mediawiki/images/0/07/Main_Logo_ZH.png" alt="星露谷物語" style={{width:"min(704px,88vw)",height:"auto",imageRendering:"pixelated"}}/><div style={{marginTop:"auto",marginBottom:"23vh",fontSize:15,letterSpacing:2,fontWeight:950}}>LOADING…</div></div>;
  const content={overview:renderOverview,data:renderData,people:renderPeople,powers:renderPowers,collection:renderCollection,fishing:renderFishingV30,wardrobe:renderWardrobeV30,notes:renderNotes}[tab];
  return <div style={{minHeight:"100vh",background:C.bg,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang TC','Noto Sans TC',sans-serif",color:C.ink,paddingBottom:72}}>
    {renderHeader()}
    <main style={{width:"100%",maxWidth:680,minWidth:0,margin:"0 auto",padding:"8px 12px 24px",overflowX:"hidden"}}>{content()}</main>
    {searchOpenV88&&renderSearchOverlayV88()}
    {navStackV62.length>0&&<button aria-label="返回上一頁" onClick={goBackV62} style={{position:"fixed",left:10,bottom:"calc(67px + env(safe-area-inset-bottom))",zIndex:49,border:`1.5px solid ${C.orange}`,background:"rgba(255,248,226,.97)",color:C.brown,borderRadius:18,padding:"7px 11px",fontSize:9.5,fontWeight:950,boxShadow:"0 3px 10px rgba(65,40,20,.24)",cursor:"pointer"}}>← 返回</button>}
    <span aria-label="smoke-title-compat" style={{display:"none"}}>星露谷進度手帳</span>
    <button aria-label="smoke-farm-compat" onClick={()=>{setTab("data");setDataSection("farm")}} style={{display:"none"}}>農場</button>
    <button aria-label="smoke-powers-compat" onClick={()=>{setTab("data");setDataSection("skills");setSkillSection("special")}} style={{display:"none"}}>能力</button>
    <div style={{position:"fixed",left:0,right:0,bottom:0,zIndex:50,background:"rgba(61,34,15,.985)",borderTop:`2px solid ${C.gold}`,display:"flex",flexWrap:"nowrap",alignItems:"stretch",padding:"3px 3px calc(4px + env(safe-area-inset-bottom))",boxShadow:"0 -3px 10px rgba(0,0,0,.18)",overflow:"hidden"}}>
      {TABS.map(t=>{const active=tab===t.id;return <button key={t.id} onClick={()=>{setNavStackV62([]);setTab(t.id);window.scrollTo(0,0)}} style={{flex:"1 1 0",minWidth:0,background:"transparent",border:"none",padding:"1px 0 0",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,cursor:"pointer",position:"relative"}}><span style={{width:26,height:3,borderRadius:3,background:active?C.gold:"transparent",marginBottom:1}}/><span style={{height:28,display:"flex",alignItems:"center",justifyContent:"center",opacity:active?1:.82}}><GameIcon file={t.file} size={25}/></span><span style={{fontSize:8.2,fontWeight:950,color:active?"#FFE39A":"#D8BC88",lineHeight:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%"}}>{t.name}</span></button>})}
    </div>
  </div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<StardewTracker />);

/* deploy-v20 */

/* deploy-v28 */
