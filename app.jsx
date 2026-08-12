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
const WIKI_FILE = (name) => `https://stardewvalleywiki.com/Special:Redirect/file/${encodeURIComponent(name + ".png")}`;
const iconMap = (names) => Object.fromEntries(names.map((name, i) => [i, WIKI_FILE(name)]));


const GAME_FILE = WIKI_FILE;
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
  克羅巴斯:"Krobus Icon", 矮人:"Dwarf Icon", 雷歐:"Leo Icon"
};

function GameIcon({ file, size = 28, alt = "" }) {
  if (!file) return null;
  return <img src={GAME_FILE(file)} alt={alt} loading="lazy" onError={e => { e.currentTarget.style.display = "none"; }}
    style={{ width:size, height:size, objectFit:"contain", imageRendering:"pixelated", flex:"0 0 auto" }} />;
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
 ["shipping","出貨","Mini-Shipping Bin"],["fish","魚類","Pufferfish"],["artifact","古物","Dwarf Scroll I"],["mineral","礦物","Diamond"],["cooking","烹飪","Cooking Icon"],["achievements","成就","Achievements Icon"],["letters","信件","Mail"],["notes","秘密紙條","Secret Note Icon"],["scraps","日誌殘頁","Journal Scrap"]
];

const SHIPPING_ITEMS_V30 = [
  ["Wild Horseradish","野山葵"],["Daffodil","黃水仙"],["Leek","韭蔥"],["Dandelion","蒲公英"],["Parsnip","防風草"],["Cave Carrot","山洞蘿蔔"],["Coconut","椰子"],["Cactus Fruit","仙人掌果子"],["Banana","香蕉"],["Sap","樹液"],["Large Egg","大雞蛋（白）"],["Egg","雞蛋（白）"],["Brown Egg","雞蛋（棕）"],["Large Brown Egg","大雞蛋（棕）"],["Milk","牛奶"],["Large Milk","大壺牛奶"],["Green Bean","青豆"],["Cauliflower","花椰菜"],["Potato","土豆"],["Garlic","蒜"],["Kale","甘藍菜"],["Rhubarb","大黃"],["Melon","甜瓜"],["Tomato","西紅柿"],["Morel","羊肚菌"],["Blueberry","藍莓"],["Fiddlehead Fern","蕨菜"],["Hot Pepper","辣椒"],["Wheat","小麥"],["Radish","蘿蔔"],["Red Cabbage","紅葉卷心菜"],["Starfruit","楊桃"],["Corn","玉米"],["Unmilled Rice","未碾米"],["Eggplant","茄子"],["Artichoke","洋薊"],["Pumpkin","南瓜"],["Bok Choy","小白菜"],["Yam","山藥"],["Chanterelle","雞油菌"],["Cranberries","蔓越莓"],["Holly","冬青樹"],["Beet","甜菜"],["Ostrich Egg","鴕鳥蛋"],["Salmonberry","美洲大樹莓"],["Amaranth","莧菜"],["Pale Ale","淡啤酒"],["Hops","啤酒花"],["Void Egg","虛空蛋"],["Mayonnaise","蛋黃醬"],["Duck Mayonnaise","鴨蛋黃醬"],["Void Mayonnaise","虛空蛋黃醬"],["Clay","黏土"],["Copper Bar","銅錠"],["Iron Bar","鐵錠"],["Gold Bar","金錠"],["Iridium Bar","銥錠"],["Refined Quartz","精煉石英"],["Honey","蜂蜜"],["Pickles","醃菜"],["Jelly","果醬"],["Beer","啤酒"],["Wine","果酒"],["Juice","果汁"],["Poppy","虞美人花"],["Copper Ore","銅礦石"],["Iron Ore","鐵礦石"],["Coal","煤炭"],["Gold Ore","金礦石"],["Iridium Ore","銥礦石"],
  ["Wood","木材"],["Stone","石頭"],["Nautilus Shell","鸚鵡螺"],["Coral","珊瑚"],["Rainbow Shell","彩虹貝殼"],["Spice Berry","香味漿果"],["Sea Urchin","海膽"],["Grape","葡萄"],["Spring Onion","大蔥"],["Strawberry","草莓"],["Sweet Pea","甜豌豆"],["Common Mushroom","普通蘑菇"],["Wild Plum","野梅"],["Hazelnut","榛子"],["Blackberry","黑莓"],["Winter Root","冬根"],["Crystal Fruit","水晶果"],["Snow Yam","雪山藥"],["Sweet Gem Berry","寶石甜莓"],["Crocus","番紅花"],["Red Mushroom","紅蘑菇"],["Sunflower","向日葵"],["Purple Mushroom","紫蘑菇"],["Cheese","奶酪"],["Goat Cheese","山羊奶酪"],["Cloth","布料"],["Truffle","松露"],["Truffle Oil","松露油"],["Coffee Bean","咖啡豆"],["Goat Milk","羊奶"],["Large Goat Milk","大瓶羊奶"],["Wool","羊毛"],["Duck Egg","鴨蛋"],["Duck Feather","鴨毛"],["Caviar","魚子醬"],["Rabbit's Foot","兔子的腳"],["Aged Roe","陳年魚籽"],["Ancient Fruit","上古水果"],["Mead","蜂蜜酒"],["Tulip","鬱金香"],["Summer Spangle","夏季亮片"],["Fairy Rose","玫瑰仙子"],["Blue Jazz","藍爵"],["Apple","蘋果"],["Green Tea","綠茶"],["Apricot","杏子"],["Orange","橙子"],["Peach","桃子"],["Pomegranate","石榴"],["Cherry","櫻桃"],["Bug Meat","蟲肉"],["Hardwood","硬木"],["Maple Syrup","楓糖漿"],["Oak Resin","橡樹樹脂"],["Pine Tar","松焦油"],["Slime","史萊姆泥"],["Bat Wing","蝙蝠翅膀"],["Solar Essence","太陽精華"],["Void Essence","虛空精華"],["Fiber","纖維"],["Battery Pack","電池組"],["Dinosaur Mayonnaise","恐龍蛋黃醬"],["Roe","魚籽"],["Squid Ink","魷魚墨汁"],["Tea Leaves","茶葉"],["Ginger","薑"],["Taro Root","芋頭"],["Pineapple","菠蘿"],["Mango","芒果"],["Cinder Shard","火山晶石"],
  ["Magma Cap","熔岩菇"],["Bone Fragment","骨頭碎片"],["Radioactive Ore","放射性礦石"],["Radioactive Bar","放射性錠"],["Smoked Fish","燻魚"],["Moss","苔蘚"],["Mystic Syrup","神秘糖漿"],["Raisins","葡萄乾"],["Dried Fruit","果乾"],["Dried Mushrooms","蘑菇乾"],["Carrot","胡蘿蔔"],["Summer Squash","金皮西葫蘆"],["Broccoli","西蘭花"],["Powdermelon","霜瓜"]
];

const HATS_V30 = [
  ["Cowboy Hat","牛仔帽","完成博物館全收藏後，帽子老鼠 10,000g"],["Bowler Hat","圓頂禮帽","累計賺取 1,000,000g 後，帽子老鼠 10,000g"],["Top Hat","大禮帽","齊先生賭場 8,000 齊幣"],["Sombrero","墨西哥帽","累計賺取 10,000,000g 後，帽子老鼠"],["Straw Hat","草帽","彩蛋節找蛋比賽首次獲勝"],["Official Cap","大檐帽","釣到 24 種不同魚後，帽子老鼠"],["Blue Bonnet","藍色軟帽","博物館捐贈 40 件後，帽子老鼠"],["Plum Chapeau","紫紅小帽","烹飪 25 種料理後，帽子老鼠"],["Hard Hat","安全帽","探險家公會：擊殺 30 隻掘地蟲；亦可能沙漠節造型"],["Sou'wester","防雨帽","釣到 10 種不同魚後，帽子老鼠"],["Daisy","雛菊髮卡","製作 15 種物品後，帽子老鼠"],["Watermelon Band","西瓜髮卡","釣到 100 條魚後，帽子老鼠"],["Mouse Ears","老鼠耳朵","任一村民 10 心後，帽子老鼠"],["Cat Ears","貓耳","8 位村民 10 心後，帽子老鼠"],["Cowgal Hat","牛仔女郎帽","單一栽培成就後，帽子老鼠"],["Cowpoke Hat","專業牛仔帽","混合栽培成就後，帽子老鼠"],["Archer's Cap","射手帽","烹飪全部配方後，帽子老鼠"],["Blue Cowboy Hat","藍色牛仔帽","骷髏洞穴寶箱層"],["Red Cowboy Hat","紅色牛仔帽","骷髏洞穴寶箱層"],["Cone Hat","錐帽","夜市魔法商船"],["Elegant Turban","優雅頭巾","解鎖全部成就後，帽子老鼠"],["White Turban","白色頭巾","裁縫或骷髏洞穴寶箱層"],["Garbage Hat","垃圾帽","翻過 20 個垃圾桶後，每次有低機率取得"],["Golden Mask","金色面具","裁縫製作"],["Propeller Hat","螺旋槳帽","裁縫／隨機外觀掉落"],["Bridal Veil","新娘面紗","裁縫／隨機外觀掉落"],["Witch Hat","女巫帽","裁縫／隨機外觀掉落"],["Copper Pan","淘盤","把淘盤放進帽子欄"],["Green Turban","綠色頭巾","沙漠商人"],["Magic Cowboy Hat","魔法牛仔帽","沙漠商人奇數日"],["Magic Turban","魔法頭巾","沙漠商人偶數日"],["Golden Helmet","金色頭盔","打開金色椰子時機率取得"],["Deluxe Pirate Hat","豪華海盜帽","火山地牢寶箱"],["Pink Bow","粉色蝴蝶結","火山地牢矮人商店"],["Frog Hat","青蛙帽","薑島青蛙洞穴水域釣到"],["Small Cap","小帽子","薑島商人：週一交換"],["Bluebird Mask","藍鳥面具","薑島商人：週三交換"],["Deluxe Cowboy Hat","豪華牛仔帽","薑島商人：週五交換"],["Mr. Qi's Hat","齊先生的帽子","齊先生核桃房 5 齊鑽"],["Dark Cowboy Hat","黑色牛仔帽","骷髏洞穴寶箱層"]
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
const JOURNAL_SUMMARY_V3 = {1:"薑島的第一條探索提示。",2:"島嶼地點線索。",3:"火山相關探索提示。",4:"一張薑島藏寶圖。",5:"島上生物與物品提示。",6:"另一張島嶼藏寶圖。",7:"薑島探索紀錄。",8:"薑島探索紀錄。",9:"薑島探索紀錄。",10:"金色核桃位置圖。",11:"薑島最後的日誌提示。"};

const SECRET_NOTE_CONTENT_V4 = {
  1:"阿比蓋爾的最愛：南瓜、紫水晶、巧克力蛋糕、香辣鰻魚、黑莓脆皮餅。",
  2:"山姆的採買清單：塞巴斯蒂安＝淚晶／生魚片；潘妮＝綠寶石／虞美人花；文森特＝葡萄／蔓越莓糖果；喬迪＝香酥鱸魚／薄煎餅；肯特＝義式蕨菜燉飯／烤榛子；山姆＝仙人掌果子／楓糖棒／披薩。",
  3:"莉亞理想晚餐：沙拉、山羊乳酪、松露、果酒；甜點是虞美人籽鬆糕。",
  4:"瑪魯的發明材料：金錠、銥錠、電池組、鑽石、草莓。",
  5:"潘妮的送禮備忘：潘姆＝防風草／琉璃山藥（不要啤酒）；賈斯＝玫瑰仙子／葡萄乾布丁；文森特＝粉紅蛋糕／葡萄；喬治＝韭蔥／炒蘑菇；艾芙琳＝甜菜／鬱金香。",
  6:"星之果實餐吧特別點單：劉易斯＝秋日恩賜；瑪妮＝南瓜派；德米特里厄斯＝豆類火鍋；卡洛琳＝魚肉捲。",
  7:"幾位年長單身男性的喜好：哈維＝咖啡／醃菜；艾利歐特＝蟹黃糕／石榴；謝恩＝啤酒／披薩／爆炒青椒。",
  8:"海莉與艾蜜麗父母的送禮提示：海莉＝粉紅蛋糕／向日葵；艾蜜麗＝各類寶石／動物毛。",
  9:"亞歷克斯的力量訓練餐：完美早餐、鮭魚晚餐。",
  10:"紙條提示：有人在骷髏洞穴第 100 層等你。",
  11:"照片型紙條：瑪妮與賈斯的合照。",
  12:"垃圾桶提示：好運日更值得翻；餐吧後方可能有當日料理，喬治／艾芙琳家附近可能有餅乾，鐵匠鋪與博物館附近較容易翻到有價值的東西。",
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
  27:"爺爺留下提示：當你準備好時，煤礦森林南部有一處與五種技能精通有關的秘密。"
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
  27:"五種技能都到 10 級後，煤礦森林南部、下水道管附近的精通洞穴會開放。"
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
  {id:"town",name:"鵜鶘鎮",sub:"河流",icon:"Sunfish",fish:[14,12,22,6,46,4,7,13,8,40,9,47,10,29,68],tip:"釣鮟鱇魚需站在河流最北端。"},
  {id:"forest_river",name:"煤礦森林",sub:"河流",icon:"Chub",fish:[14,12,43,22,46,4,44,7,13,8,40,9,47,10,68]},
  {id:"forest_pond",name:"煤礦森林",sub:"池塘",icon:"Smallmouth Bass",fish:[22,6,13,9,36,10,68]},
  {id:"forest_falls",name:"煤礦森林",sub:"南部瀑布",icon:"Goby",fish:[71,8],tip:"蝦虎魚需把浮標拋進南部瀑布下方水池；有效釣魚等級至少 4。"},
  {id:"glacier",name:"煤礦森林",sub:"南部小島",icon:"Glacierfish",fish:[59],tip:"冰川魚是冬季傳說魚，需在箭頭形小島南端指定水域。"},
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
  {id:"island_n",name:"薑島北部",sub:"淡水",icon:"Blue Discus",fish:[67,36,42,68],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"island_w_fresh",name:"薑島西部",sub:"河流／池塘",icon:"Blue Discus",fish:[67,36,42,68],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"island_w_ocean",name:"薑島西部",sub:"海洋",icon:"Lionfish",fish:[35,66,18,0,24,2,70],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"island_s",name:"薑島南部及東南部",sub:"海洋",icon:"Lionfish",fish:[35,66,0,24,2,70],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"pirate",name:"海盜灣",sub:"海洋",icon:"Stingray",fish:[35,0,65,24,2,70],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"caldera",name:"火山口",sub:"熔岩湖",icon:"Lava Eel",fish:[31],forceSeasons:["春","夏","秋","冬"],island:true}
];


const FISH_AREA_GROUPS_V4 = {
  main:{name:"本島",ids:["town","forest_river","forest_pond","forest_falls","glacier","mountain","beach","secret"]},
  special:{name:"特殊水域",ids:["desert","sewer","bug","mine20","mine60","mine100","witch","night"]},
  island:{name:"薑島",ids:["island_n","island_w_fresh","island_w_ocean","island_s","pirate","caldera"]}
};

const FISH_MAP_META_V42 = {
  main:{
    file:"Map",
    clusters:[
      {id:"town",label:"鵜鶘鎮",x:54,y:50,ids:["town"]},
      {id:"forest",label:"煤礦森林",x:30,y:69,ids:["forest_river","forest_pond","forest_falls","glacier"]},
      {id:"mountain",label:"山區",x:57,y:23,ids:["mountain"]},
      {id:"beach",label:"海灘",x:69,y:82,ids:["beach"]},
      {id:"secret",label:"秘密森林",x:12,y:61,ids:["secret"]}
    ]
  },
  island:{
    file:"Ginger Island Map",
    clusters:[
      {id:"north",label:"北部",x:53,y:22,ids:["island_n","caldera"]},
      {id:"west",label:"西部",x:24,y:55,ids:["island_w_fresh","island_w_ocean"]},
      {id:"south",label:"南部",x:56,y:80,ids:["island_s","pirate"]}
    ]
  },
  special:{file:null,clusters:[]}
};

const FISH_TIME_SEGMENTS_V42 = [
  {id:"morning",name:"早上",range:[6,12]},
  {id:"afternoon",name:"下午",range:[12,17]},
  {id:"evening",name:"晚上",range:[17,22]},
  {id:"late",name:"深夜",range:[22,26]}
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
    birthdays: {1:"克羅巴斯",3:"萊納斯",7:"卡洛琳",10:"塞巴斯蒂安",14:"哈維",17:"法師",20:"艾芙琳",23:"莉亞",26:"克林特"},
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
  if (info.includes("薑島") || info.includes("海盜灣")) areas.push("薑島");
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
    {meta.areas.slice(0,compact?1:3).map(a=>chip(a,a==="海洋"?"#DDECF7":a==="河流"?"#DDF2ED":a==="湖泊"?"#E5E4FA":a==="薑島"?"#F5E7BE":"#EEE6D7"))}
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
  { id: "overview", name: "總覽", icon: "🏡", file: TAB_ICON_FILES.overview },
  { id: "data", name: "資料", icon: "⭐", file: TAB_ICON_FILES.skills },
  { id: "people", name: "社交", icon: "💛", file: TAB_ICON_FILES.people },
  { id: "fishing", name: "查找", icon: "🔎", file: "Magnifying Glass" },
  { id: "wardrobe", name: "衣櫥", icon: "🎩", file: "Deluxe Cowboy Hat" },
  { id: "notes", name: "備註", icon: "📝", file: "Journal Scrap" },
];
/* ================= 小元件 ================= */
function SectionTitle({ icon, children, right }) {
  const file = UI_ICON_FILES[icon];
  return <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "20px 0 8px" }}>
    {file ? <GameIcon file={file} size={27}/> : <span style={{ fontSize: 20 }}>{icon}</span>}
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

function FarmerSpritePreviewV33({player,direction="front",large=false,scene="day",shirtDyeable=false,pantsDyeable=false}) {
  const ref=useRef(null);
  useEffect(()=>{
    const api=window.SDVFarmerSpriteV33;
    if(!api?.draw||!ref.current)return;
    const safe={...WARDROBE_V38_PLAYER_DEFAULT,...(player||{})};
    const opts={
      gender:safe.gender==="male"?"male":"female",direction,
      selected:{hat:typeof safe.hat==="string"?safe.hat:"",shirt:typeof safe.shirt==="string"?safe.shirt:"",pants:typeof safe.pants==="string"?safe.pants:"",boots:typeof safe.boots==="string"?safe.boots:""},
      shirtColor:normalizeWardrobeHexV38(safe.shirtColor,WARDROBE_V38_PLAYER_DEFAULT.shirtColor),pantsColor:normalizeWardrobeHexV38(safe.pantsColor,WARDROBE_V38_PLAYER_DEFAULT.pantsColor),
      hairColor:normalizeWardrobeHexV38(safe.hairColor,WARDROBE_V38_PLAYER_DEFAULT.hairColor),hairIndex:Number.isFinite(Number(safe.hairIndex))?Number(safe.hairIndex):0,
      skinIndex:Number.isFinite(Number(safe.skinIndex))?Number(safe.skinIndex):0,eyeColor:normalizeWardrobeHexV38(safe.eyeColor,WARDROBE_V38_PLAYER_DEFAULT.eyeColor),accessoryIndex:Number.isFinite(Number(safe.accessoryIndex))?Number(safe.accessoryIndex):-1,
      shirtDyeable,pantsDyeable
    };
    api.draw(ref.current,opts).catch(e=>{
      console.warn("farmer sprite preview failed; retrying safe base",e);
      if(!ref.current)return;
      api.draw(ref.current,{...opts,selected:{hat:"",shirt:"",pants:"",boots:""},accessoryIndex:-1}).catch(err=>console.warn("farmer safe fallback failed",err));
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
  const [dataSection, setDataSection] = useState("farm");
  const [farmSection, setFarmSection] = useState("animals");
  const [skillSection, setSkillSection] = useState("skills");
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
  const [prepMissingOnlyV3, setPrepMissingOnlyV3] = useState(false);
  const [selectedPaperV3, setSelectedPaperV3] = useState(null);
  const [cookingMode, setCookingMode] = useState("ingredients");
  const [cookingGroup, setCookingGroup] = useState("all");
  const [cookingMissingOnly, setCookingMissingOnly] = useState(false);
  const [recipeQuery, setRecipeQuery] = useState("");
  const [recipeFilter, setRecipeFilter] = useState("all");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [socialGroup, setSocialGroup] = useState("single");
  const [pondPicker, setPondPicker] = useState(null);
  const [fishViewV4, setFishViewV4] = useState("items");
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
  const [wardrobeCategoryV30, setWardrobeCategoryV30] = useState("hat");
  const [wardrobeTargetV30, setWardrobeTargetV30] = useState("player");
  const [wardrobeDirectionV32, setWardrobeDirectionV32] = useState("front");
  const [wardrobeQueryV34, setWardrobeQueryV34] = useState("");
  const [wardrobeFilterV37, setWardrobeFilterV37] = useState("all");
  const [wardrobePageV37, setWardrobePageV37] = useState(0);
  const [wardrobeAppearanceMetaV37, setWardrobeAppearanceMetaV37] = useState({hairCount:64,skinCount:24,accessoryCount:29,defaultEyeColor:"#5B4636"});
  const profileInputRef = useRef(null);
  const saveTimer = useRef(null);

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
        try { setData(normalizeWardrobeProgressV38({ ...PREFILL, ...JSON.parse(raw) })); }
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

  const currentCalendar = CALENDAR_DATA[data.base.season] || CALENDAR_DATA.春;
  const dayCalendarItems = (day) => {
    const out = [];
    if (currentCalendar.festivals[day]) out.push({type:"festival", text:currentCalendar.festivals[day], key:currentCalendar.festivals[day]});
    if (currentCalendar.birthdays[day] && !(data.base.season === "春" && day === 4 && data.base.year < 2)) out.push({type:"birthday", text:`${currentCalendar.birthdays[day]}生日`, npc:currentCalendar.birthdays[day]});
    if (currentCalendar.other[day]) out.push({type:"other", text:currentCalendar.other[day]});
    if (data.base.season === "夏" && day === 3 && data.base.year === 1) out.push({type:"other", text:"地震後鐵路／溫泉區開放"});
    return out;
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

      // 依 Switch 16:9 玩家資料頁的固定比例裁切；只辨識真正需要的欄位。
      const farmerCropColor = makeCrop(img, 0.282, 0.775, 0.155, 0.078, 5, false);
      const farmerCropMono = makeCrop(img, 0.282, 0.775, 0.155, 0.078, 5, true);
      const farmCropColor = makeCrop(img, 0.430, 0.548, 0.340, 0.085, 4, false);
      const farmCropMono = makeCrop(img, 0.430, 0.548, 0.340, 0.085, 4, true);
      const moneyCrop = makeCrop(img, 0.555, 0.638, 0.185, 0.060, 3.5, true);
      const incomeCrop = makeCrop(img, 0.555, 0.697, 0.185, 0.060, 3.5, true);
      const dateCrop = makeCrop(img, 0.505, 0.758, 0.230, 0.065, 3.5, true);
      const clockCrop = makeCrop(img, 0.868, 0.139, 0.095, 0.055, 4, true);

      setProfileOcrStatus("辨識農夫與農場名稱…");
      // 遊戲像素字體的小型 ® / © / · 很容易在黑白化後消失，因此名稱各跑彩色與黑白兩次。
      const farmerColorResult = await recognizeDetailed(farmerCropColor, "");
      const farmerMonoResult = await recognizeDetailed(farmerCropMono, "");
      const farmColorResult = await recognizeDetailed(farmCropColor, "");
      const farmMonoResult = await recognizeDetailed(farmCropMono, "");
      const farmerBest = bestNameResult(farmerColorResult, farmerMonoResult);
      const farmBest = bestNameResult(farmColorResult, farmMonoResult);
      const farmerRaw = farmerBest.text;
      const farmRaw = farmBest.text;
      setProfileOcrStatus("辨識金錢與日期…");
      const moneyRaw = await recognize(moneyCrop, "0123456789,");
      const incomeRaw = await recognize(incomeCrop, "0123456789,");
      const dateRaw = await recognize(dateCrop, "");
      const clockRaw = await recognize(clockCrop, "0123456789:：");
      await worker.terminate();

      // 不再只保留英數／中文：玩家名稱可合法包含 ®、©、·、☆ 等符號。
      let farmerName = cleanNameCandidate(farmerRaw)
        .replace(/^[^\p{L}\p{N}®©·・._@☆★♡♥♪♫~～+\-]+|[^\p{L}\p{N}®©·・._@☆★♡♥♪♫~～+\-]+$/gu, "")
        .trim();
      let farmName = cleanNameCandidate(farmRaw)
        // 只移除 UI 固定的「農場／农场」字樣；© / ® / @ 若在它前面，視為農場名的一部分保留。
        .replace(/\s*(?:農場|农场)\s*$/u, "")
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
      setProfileOcrResult({
        farmerRaw, farmRaw, moneyRaw, incomeRaw, dateRaw, clockRaw, applied:patch,
        farmerColor: farmerColorResult.text, farmerMono: farmerMonoResult.text,
        farmColor: farmColorResult.text, farmMono: farmMonoResult.text
      });
      setProfileOcrStatus(updated.length ? `✓ 已從截圖更新：${updated.join("、")}` : "⚠ 已更新角色圖，但沒有可靠辨識到資料欄位");
    } catch (e) {
      console.warn('profile OCR failed', e);
      setProfileOcrStatus(`⚠ 文字辨識失敗；角色圖仍可手動再試一次`);
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const renderProfileCard = () => <>
    <SectionTitle icon="🎒">農場名片</SectionTitle>
    <Card style={{padding:10}}>
      <div style={{display:"grid",gridTemplateColumns:"104px minmax(0,1fr)",gap:11,alignItems:"start"}}>
        <div style={{minWidth:0,textAlign:"center"}}>
          <button onClick={()=>profileInputRef.current?.click()} style={{width:96,height:126,border:`2px solid ${C.line}`,borderRadius:9,overflow:"hidden",background:"#EFE4C4",padding:0,cursor:"pointer"}}>
            {data.profilePortrait ? <img src={data.profilePortrait} alt="農夫角色" style={{width:"100%",height:"100%",objectFit:"cover",imageRendering:"pixelated"}}/> : <div style={{fontSize:10,color:C.muted,fontWeight:900,lineHeight:1.45}}>上傳玩家<br/>資料畫面<br/><span style={{fontSize:21}}>＋</span></div>}
          </button>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginTop:4}}>
            <button onClick={()=>profileInputRef.current?.click()} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:6,padding:"3px 6px",fontWeight:900,color:C.brown,fontSize:8.5}}>{data.profilePortrait?"更換":"上傳"}</button>
            {data.profilePortrait&&<button onClick={()=>update({profilePortrait:""})} style={{border:0,background:"transparent",color:C.red,fontSize:8.5,fontWeight:900,padding:"3px 2px"}}>移除</button>}
          </div>
          {profileOcrStatus&&<div style={{fontSize:7.5,color:profileOcrStatus.startsWith("⚠")?C.red:C.green,fontWeight:850,lineHeight:1.25,marginTop:3}}>{profileOcrStatus.startsWith("✓")?"✓ 已更新資料":profileOcrStatus}</div>}
        </div>
        <div style={{minWidth:0}}>
          <div style={{fontSize:15,fontWeight:950,color:C.darkBrown,lineHeight:1.15}}>{data.base.name || "未記錄農夫名"}</div>
          <div style={{fontSize:17,fontWeight:950,color:C.darkBrown,marginTop:2,lineHeight:1.15}}>{data.base.farm}</div>
          <div style={{fontSize:11.5,color:C.brown,marginTop:8,fontWeight:850}}>持有 {Number(data.base.money||0).toLocaleString()}g</div>
          <div style={{fontSize:10.5,color:C.muted,marginTop:1}}>累計 {Number(data.base.totalIncome||0).toLocaleString()}g</div>
          <div style={{display:"grid",gridTemplateColumns:"26px auto 26px",alignItems:"center",gap:4,marginTop:8,width:"fit-content"}}>
            <button onClick={()=>updateBase({year:Math.max(1,Number(data.base.year||1)-1)})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:7,height:25,fontWeight:950,color:C.brown,padding:0}}>−</button>
            <div style={{fontSize:10.5,fontWeight:950,color:C.darkBrown,textAlign:"center",minWidth:50}}>第 {data.base.year} 年</div>
            <button onClick={()=>updateBase({year:Math.min(99,Number(data.base.year||1)+1)})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:7,height:25,fontWeight:950,color:C.brown,padding:0}}>＋</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:3,marginTop:6}}>{SEASONS.map(season=>{const active=data.base.season===season;return <button key={season} onClick={()=>updateBase({season})} style={{border:`1.5px solid ${active?C.green:C.line}`,background:active?C.lightGreen:C.cream,borderRadius:14,padding:"4px 2px",fontSize:9.5,fontWeight:900,color:active?C.green:C.ink,whiteSpace:"nowrap"}}>{SEASON_ICON[season]} {season}</button>})}</div>
        </div>
        <details style={{gridColumn:"1 / -1",borderTop:`1px dashed ${C.line}`,paddingTop:5,marginTop:0}}>
          <summary style={{fontSize:9.5,color:C.muted,fontWeight:900,cursor:"pointer",width:"fit-content"}}>✎ 編輯資料</summary>
          <div style={{display:"grid",gap:5,marginTop:6}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              <input value={data.base.name||""} onChange={e=>updateBase({name:e.target.value})} placeholder="農夫名字" style={{minWidth:0,border:`1.5px solid ${C.line}`,background:"#FFFCF0",borderRadius:7,padding:"6px 7px",fontSize:10.5,fontWeight:800,color:C.ink}}/>
              <input value={data.base.farm||""} onChange={e=>updateBase({farm:e.target.value})} placeholder="農場名稱" style={{minWidth:0,border:`1.5px solid ${C.line}`,background:"#FFFCF0",borderRadius:7,padding:"6px 7px",fontSize:10.5,fontWeight:800,color:C.ink}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              <label style={{fontSize:8.5,color:C.muted,fontWeight:900}}>目前金錢<div style={{marginTop:2}}><NumInput value={data.base.money} max={999999999} onChange={v=>updateBase({money:v})} suffix="g" width={118}/></div></label>
              <label style={{fontSize:8.5,color:C.muted,fontWeight:900}}>累計收入<div style={{marginTop:2}}><NumInput value={data.base.totalIncome} max={999999999} onChange={v=>updateBase({totalIncome:v})} suffix="g" width={118}/></div></label>
            </div>
          </div>
        </details>
      </div>
      <input ref={profileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{handleProfileUpload(e.target.files?.[0]);e.target.value=""}}/>
    </Card>
  </>;

  const renderMiniItemV26 = (name, tone=C.cream) => {
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
      <Card style={{padding:7,overflow:"hidden"}}>
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
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{upcoming.map(x=><button key={x.day} onClick={()=>updateBase({day:x.day})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:9,padding:"4px 7px",fontSize:10,fontWeight:900,color:C.brown,cursor:"pointer"}}>{x.day}日 · {x.items.map(i=>i.text).join("／")}</button>)}</div>
        </div>}
        <div style={{fontSize:9.5,color:C.muted,marginTop:6,lineHeight:1.4}}>直接點上方遊戲日曆的日期格即可切換手帳日期；頁首、當日事件與魚類「今日可釣」會一起更新。書商每季日期依存檔隨機，無法只靠年份／季節推算。</div>
      </Card>
    </>;
  };

  const renderHeader = () => <>
    <div style={{background:C.darkBrown,color:"white",padding:"calc(8px + env(safe-area-inset-top)) 12px 8px",position:"sticky",top:0,zIndex:30,boxShadow:"0 2px 8px rgba(0,0,0,.25)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <GameIcon file="Junimo Icon" size={34}/>
        <div style={{minWidth:0}}><div style={{fontSize:16,fontWeight:950,letterSpacing:.3,lineHeight:1.1}}>星露谷農場手帳</div></div>
        <div style={{marginLeft:"auto",textAlign:"right",minWidth:0}}>
          <div style={{fontWeight:950,fontSize:12.5,lineHeight:1.15}}>{SEASON_ICON[data.base.season]} 第 {data.base.year} 年 {data.base.season} {data.base.day} 日</div>
          <div style={{fontSize:10.5,color:"#E8C88F",marginTop:2}}>{Number(data.base.money||0).toLocaleString()}g</div>
        </div>
      </div>
    </div>
  </>;

  const renderOverview = () => <div>
    {renderProfileCard()}
    {renderCalendar()}
    <SectionTitle icon="📊">進度速覽</SectionTitle>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}>
      <Card style={{ padding: 11 }}><div style={{ fontSize: 11, color: C.muted, fontWeight: 800 }}>技能總等級</div><div style={{ fontSize: 24, fontWeight: 950, color: C.green }}>{skillTotal}<span style={{ fontSize: 12, color: C.muted }}>/50</span></div><ProgressBar value={skillTotal} max={50}/></Card>
      <Card style={{ padding: 11 }}><div style={{ fontSize: 11, color: C.muted, fontWeight: 800 }}>社區收集包</div><div style={{ fontSize: 24, fontWeight: 950, color: C.orange }}>{rp.done}<span style={{ fontSize: 12, color: C.muted }}>/30</span></div><ProgressBar value={rp.done} max={30} color={C.orange}/></Card>
      <Card style={{ padding: 11 }}><div style={{ fontSize: 11, color: C.muted, fontWeight: 800 }}>礦井最深</div><div style={{ fontSize: 24, fontWeight: 950, color: C.blue }}>{data.mine.normal}<span style={{ fontSize: 12, color: C.muted }}>/120</span></div><ProgressBar value={data.mine.normal} max={120} color={C.blue}/></Card>
      <Card style={{ padding: 11 }}><div style={{ fontSize: 11, color: C.muted, fontWeight: 800 }}>動物總數</div><div style={{ fontSize: 24, fontWeight: 950, color: C.brown }}>{totalAnimals}</div><div style={{ fontSize: 11, color: C.muted }}>雞舍＋牛棚</div></Card>
    </div>

    <SectionTitle icon="🏆">重要里程碑</SectionTitle>
    <Card>{MILESTONES.map(m => <CheckRow key={m.id} checked={data.milestones.includes(m.id)} onChange={v => update({ milestones: v ? [...new Set([...data.milestones, m.id])] : data.milestones.filter(x => x !== m.id) })} sub={m.desc}>{m.name}</CheckRow>)}</Card>

  </div>;

  const renderSkills = () => {
    const SkillTab=({id,label,file})=>{const active=skillSection===id;return <button onClick={()=>setSkillSection(id)} style={{border:`2px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:11,padding:"6px 3px 5px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={file} size={35}/><span style={{fontSize:9.5,fontWeight:950,color:active?C.darkBrown:C.muted}}>{label}</span></button>};
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
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:8}}><SkillTab id="skills" label="技能" file="Skills Tab Icon"/><SkillTab id="mine" label="礦井" file="MinesEntrance"/><SkillTab id="special" label="特殊能力" file="Special Items & Powers Tab"/><SkillTab id="stardrops" label="星之果實" file="Stardrop"/></div>
      {skillSection==="skills"&&<><SectionTitle icon="⭐">技能・專精・精通</SectionTitle><Card style={{padding:7}}>{SKILLS.map((sk,si)=>{const lv=Number(data.skills?.[sk.id]||0),l5=sk.id+"5",p5=data.prof?.[l5]||"";const branches=Object.entries(PROF[sk.id].l10);const mastery=MASTERY_POWERS_V2.find(x=>x.id===sk.id);const mastered=(data.mastery||[]).includes(sk.id);return <div key={sk.id} style={{padding:"7px 0",borderBottom:si<SKILLS.length-1?`1px dashed ${C.line}`:"none"}}>
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
        <div style={{fontSize:8.3,color:C.muted,lineHeight:1.45,marginTop:6}}>這裡列固定普通礦井的主要礦物、特殊魚與寶箱層，方便決定今天要去哪段刷；怪物與礦點仍會受當日生成影響。</div>
      </>}

      {skillSection==="special"&&<><SectionTitle icon="🎒">特殊物品與能力</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:6,marginBottom:7}}><button onClick={()=>setPowerSection("special")} style={{border:`2px solid ${powerKind==="special"?C.orange:C.line}`,background:powerKind==="special"?"#FFE2A8":C.paper,borderRadius:9,padding:6,fontSize:9,fontWeight:950,color:C.brown}}><GameIcon file="Special Items & Powers Tab" size={28}/>特殊物品</button><button onClick={()=>setPowerSection("books")} style={{border:`2px solid ${powerKind==="books"?C.orange:C.line}`,background:powerKind==="books"?"#FFE2A8":C.paper,borderRadius:9,padding:6,fontSize:9,fontWeight:950,color:C.brown}}><GameIcon file="Book Of Stars" size={28}/>書籍能力</button></div><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:6}}>{powerList.map(it=>{const checked=isPowerChecked(powerKind,it);return <button key={it.id} onClick={()=>togglePower(powerKind,it)} style={{border:`1.5px solid ${checked?C.green:C.line}`,background:checked?"#EAF4D8":C.paper,borderRadius:9,padding:7,textAlign:"left",cursor:"pointer"}}><div style={{display:"flex",alignItems:"center",gap:5}}><GameIcon file={it.file} size={31}/><b style={{fontSize:9.5,color:checked?C.green:C.ink}}>{checked?"✓ ":""}{it.name}</b></div><div style={{fontSize:7.4,color:C.muted,lineHeight:1.3,marginTop:3}}>{it.desc}</div></button>})}</div></>}
      {skillSection==="stardrops"&&<><SectionTitle icon="✨">7 顆星之果實</SectionTitle><div style={{display:"grid",gap:6}}>{STARDROP_SOURCES_V26.map(d=>{const auto=autoDrop(d.id),on=auto||drops.includes(d.id);return <Card key={d.id} style={{padding:8,background:on?"#EEF7DD":C.paper}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file="Stardrop" size={31}/><div style={{flex:1}}><b style={{fontSize:11,color:on?C.green:C.ink}}>{d.name}</b><div style={{fontSize:8.8,color:C.muted,lineHeight:1.35,marginTop:2}}>{d.desc}</div></div><button disabled={auto} onClick={()=>toggleDrop(d.id)} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?C.lightGreen:C.cream,borderRadius:7,padding:"4px 6px",fontWeight:950,color:on?C.green:C.muted,fontSize:10}}>{on?"✓":"○"}</button></div></Card>})}</div></>}
    </div>;
  };

  const renderBundles = () => {
    const route=data.communityRouteV28||"cc";
    const mode=data.bundleModeV28||"standard";
    const customItems=data.bundleCustomV28||{};
    const customNeeds=data.bundleNeedV28||{};
    const customNames=data.bundleNameV28||{};
    const jojaDone=data.jojaProjectsV28||[];
    const room=BUNDLE_ROOMS.find(r=>r.id===bundleRoom)||BUNDLE_ROOMS[0];
    const bundleItemsFor=b=>mode==="custom"?(customItems[b.id]||b.items):b.items;
    const bundleNeedFor=b=>{const items=bundleItemsFor(b);const d=b.need||b.items.length;return Math.max(1,Math.min(items.length||1,mode==="custom"&&customNeeds[b.id]!=null?Number(customNeeds[b.id]):d));};
    const setCustomBundle=(b,items,need=bundleNeedFor(b))=>update({bundleCustomV28:{...customItems,[b.id]:items},bundleNeedV28:{...customNeeds,[b.id]:Math.max(1,Math.min(items.length||1,Number(need)||1))}});
    const setCustomName=(b,name)=>update({bundleNameV28:{...customNames,[b.id]:name||b.name}});
    const RoomTab=({r})=>{const rd=roomDone(r),active=room.id===r.id;return <button onClick={()=>{setBundleRoom(r.id);setBundleEditV28(null)}} style={{border:`2px solid ${active?C.orange:rd?C.green:C.line}`,background:active?"#FFE2A8":rd?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 2px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={ROOM_ICON_FILES[r.id]} size={31}/><span style={{fontSize:8.5,fontWeight:950,color:active?C.darkBrown:rd?C.green:C.muted}}>{rd?"✓ ":""}{r.name}</span></button>};
    const routeButton=(id,label,file)=>{const active=route===id;return <button onClick={()=>{update({communityRouteV28:id});setBundleEditV28(null)}} style={{border:`2px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file={file} size={32}/>{label}</button>};
    return <div>
      <SectionTitle icon="📦">城鎮修復路線</SectionTitle>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>{routeButton("cc","社區中心","Golden Scroll")}{routeButton("joja","Joja","Joja Warehouse")}</div>

      {route==="joja"&&<>
        <Card style={{marginTop:9,padding:9,background:"#EEF3DA"}}><div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file="Joja Cola" size={36}/><div style={{flex:1}}><b style={{fontSize:12,color:C.darkBrown}}>Joja 會員</b><div style={{fontSize:9,color:C.muted,marginTop:2}}>5,000g；購買後社區中心變為 Joja 倉庫。</div></div><button onClick={()=>update({jojaMemberV28:!data.jojaMemberV28})} style={{border:`1.5px solid ${data.jojaMemberV28?C.green:C.line}`,background:data.jojaMemberV28?C.lightGreen:C.cream,borderRadius:8,padding:"5px 7px",fontWeight:950,color:data.jojaMemberV28?C.green:C.brown,fontSize:9}}>{data.jojaMemberV28?"✓ 已加入":"未加入"}</button></div></Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:7,marginTop:8}}>{JOJA_PROJECTS_V28.map(j=>{const inherited=(data.bundleDone||[]).includes(j.room),on=inherited||jojaDone.includes(j.id);return <button key={j.id} disabled={inherited} onClick={()=>update({jojaProjectsV28:on?jojaDone.filter(x=>x!==j.id):[...jojaDone,j.id]})} style={{border:`2px solid ${on?C.green:C.line}`,background:on?"#EAF4D8":C.paper,borderRadius:10,padding:8,textAlign:"left",cursor:inherited?"default":"pointer",opacity:inherited?.75:1}}><div style={{display:"flex",alignItems:"center",gap:6}}><GameIcon file={j.file} size={32}/><div style={{minWidth:0}}><b style={{fontSize:10,color:on?C.green:C.ink}}>{on?"✓ ":""}{j.name}</b><div style={{fontSize:9,fontWeight:950,color:C.orange,marginTop:1}}>{j.cost.toLocaleString()}g</div></div></div><div style={{fontSize:7.8,color:C.muted,lineHeight:1.35,marginTop:4}}>{inherited?"此項已由社區中心房間完成。":j.desc}</div></button>})}</div>
        <Card style={{marginTop:8,padding:8,background:"#FFF4D8",fontSize:9,color:C.muted,lineHeight:1.45}}>Joja 五項工程對應社區中心的採石場橋、溫室、淘金、礦車與沙漠巴士；沒有布告欄的居民友情獎勵。全部工程完成後可取得汽水機。</Card>
      </>}

      {route==="cc"&&<>
        <SectionTitle icon="📦" right={`${rp.done}/30`}>社區中心</SectionTitle>
        <Card style={{padding:8}}><ProgressBar value={rp.done} max={30} color={C.orange}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginTop:7}}><button onClick={()=>{update({bundleModeV28:"standard"});setBundleEditV28(null)}} style={{border:`1.5px solid ${mode==="standard"?C.green:C.line}`,background:mode==="standard"?C.lightGreen:C.cream,borderRadius:8,padding:5,fontSize:9,fontWeight:950,color:C.brown}}>標準收集包</button><button onClick={()=>update({bundleModeV28:"custom"})} style={{border:`1.5px solid ${mode==="custom"?C.green:C.line}`,background:mode==="custom"?C.lightGreen:C.cream,borderRadius:8,padding:5,fontSize:9,fontWeight:950,color:C.brown}}>混合／自訂</button></div>{mode==="custom"&&<div style={{fontSize:8,color:C.muted,lineHeight:1.35,marginTop:5}}>預設先沿用標準配置；只需把實際存檔中不同的包名、需求物與需要幾格改掉。</div>}</Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6,marginTop:8}}>{BUNDLE_ROOMS.map(r=><RoomTab key={r.id} r={r}/>)}</div>
        {ROOM_UNLOCKS_V28[room.id]&&<Card style={{marginTop:8,padding:7,background:"#F1EAD3"}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file={ROOM_UNLOCKS_V28[room.id].file} size={30}/><div><b style={{fontSize:10.5,color:C.darkBrown}}>整室完成：{ROOM_UNLOCKS_V28[room.id].name}</b><div style={{fontSize:8,color:C.muted,marginTop:1}}>{ROOM_UNLOCKS_V28[room.id].desc}</div></div></div></Card>}
        <div style={{display:"grid",gap:7,marginTop:7}}>{room.bundles.map(b=>{const items=bundleItemsFor(b),gotRaw=data.bundleItems[b.id]||[],got=gotRaw.filter(x=>items.includes(x)),need=bundleNeedFor(b),bDone=roomDone(room)||got.length>=need,reward=BUNDLE_REWARDS_V28[b.id],editing=mode==="custom"&&bundleEditV28===b.id,name=mode==="custom"?(customNames[b.id]||b.name):b.name;const pool=[...new Set([...room.bundles.flatMap(x=>x.items),...(REMIX_EXTRA_ITEMS_V28[room.id]||[]),...items])];return <Card key={b.id} style={{padding:8,background:bDone?"#F0F8DF":C.paper,borderColor:bDone?C.green:C.line}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:7}}><GameIcon file={BUNDLE_ICON_FILES_V26[b.id]} size={38}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:11,color:bDone?C.green:C.brown}}>{name}</b><div style={{fontSize:8.5,color:C.muted,marginTop:1}}>完成 {Math.min(got.length,need)}/{need}{need<items.length?"（任選）":""}</div></div>{reward&&<div style={{maxWidth:82,textAlign:"right",border:`1px solid ${C.line}`,borderRadius:7,padding:"3px 4px",background:"#FFF8E3"}}><div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:3}}><GameIcon file={reward[0]} size={20}/><span style={{fontSize:7,fontWeight:950,color:C.brown}}>×{reward[2]}</span></div><div style={{fontSize:6.5,color:C.muted,lineHeight:1.05,marginTop:1}}>{mode==="custom"?"標準獎勵 ":"獎勵 "}{reward[1]}</div></div>}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{items.map(it=>{const checked=roomDone(room)||gotRaw.includes(it),file=itemFileZhV26(it),gold=it.includes("金星");return <button key={it} disabled={roomDone(room)} onClick={()=>updateNested("bundleItems",{[b.id]:checked?gotRaw.filter(x=>x!==it):[...gotRaw,it]})} style={{position:"relative",border:`1.5px solid ${checked?C.green:C.line}`,background:checked?"#E5F3CF":C.paper,borderRadius:8,padding:"5px 2px",minHeight:68,cursor:roomDone(room)?"default":"pointer",opacity:roomDone(room)?.78:1}}><div style={{height:31,display:"flex",alignItems:"center",justifyContent:"center"}}>{file?<GameIcon file={file} size={29} alt={it}/>:<span style={{fontSize:12,color:C.muted}}>•</span>}{gold&&<span style={{position:"absolute",right:3,top:2,color:C.gold,fontSize:11}}>★</span>}</div><div style={{fontSize:7.1,fontWeight:900,color:checked?C.green:C.ink,lineHeight:1.05,marginTop:2}}>{it}</div></button>})}</div>
          {mode==="custom"&&<button onClick={()=>setBundleEditV28(editing?null:b.id)} style={{marginTop:6,border:`1px dashed ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:8.5,fontWeight:950,color:C.brown}}>{editing?"▲ 收起調整":"⚙ 調整這個包"}</button>}
          {editing&&<div style={{marginTop:6,paddingTop:6,borderTop:`1px dashed ${C.line}`}}><div style={{display:"flex",gap:5,alignItems:"center",marginBottom:5}}><button onClick={()=>{const v=window.prompt("收集包名稱",name);if(v!=null)setCustomName(b,v.trim())}} style={{border:`1px solid ${C.line}`,background:C.paper,borderRadius:7,padding:"4px 6px",fontSize:8,fontWeight:900,color:C.brown}}>改包名</button><span style={{fontSize:8,color:C.muted}}>需要 {need} / {items.length} 格</span><button onClick={()=>setCustomBundle(b,items,need-1)} style={{marginLeft:"auto",border:0,background:C.cream,borderRadius:6,width:22,height:20,padding:0,fontWeight:950,color:C.brown}}>−</button><button onClick={()=>setCustomBundle(b,items,need+1)} style={{border:0,background:C.cream,borderRadius:6,width:22,height:20,padding:0,fontWeight:950,color:C.brown}}>＋</button></div><div style={{display:"grid",gridTemplateColumns:"repeat(6,minmax(0,1fr))",gap:4}}>{pool.map(it=>{const on=items.includes(it),file=itemFileZhV26(it);return <button key={`pick-${b.id}-${it}`} onClick={()=>{const next=on?items.filter(x=>x!==it):[...items,it];if(next.length)setCustomBundle(b,next,Math.min(need,next.length))}} style={{border:`1px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:7,padding:"4px 1px",minHeight:54}}>{file?<GameIcon file={file} size={24}/>:<span style={{fontSize:10}}>•</span>}<div style={{fontSize:6.2,fontWeight:850,color:on?C.green:C.ink,lineHeight:1.05}}>{it}</div></button>})}</div><button onClick={()=>{const v=window.prompt("新增其他需求物（可含 ×數量）","");if(v&&v.trim()){const next=[...new Set([...items,v.trim()])];setCustomBundle(b,next,Math.min(need,next.length))}}} style={{marginTop:5,border:`1px dashed ${C.line}`,background:C.paper,borderRadius:7,padding:"4px 7px",fontSize:8,fontWeight:900,color:C.brown}}>＋ 新增其他物品</button></div>}
        </Card>})}</div>
        <div style={{marginTop:8}}><button onClick={()=>toggleRoom(room.id,!roomDone(room))} style={{width:"100%",border:`1.5px solid ${roomDone(room)?C.green:C.line}`,background:roomDone(room)?C.lightGreen:C.cream,borderRadius:8,padding:7,fontWeight:950,color:roomDone(room)?C.green:C.brown,fontSize:9.5}}>{roomDone(room)?"✓ 整室完成":"標記整室完成"}</button></div>
      </>}
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
    const panLevel=data.tools?.pan||((data.milestones||[]).includes("panning")?"銅":"未取得");
    const animalProducts={
      雞:[["Egg","蛋"],["Large Egg","大蛋"]],藍雞:[["Egg","蛋"],["Large Egg","大蛋"]],虛空雞:[["Void Egg","虛空蛋"]],金雞:[["Golden Egg","金蛋"]],
      鴨:[["Duck Egg","鴨蛋"],["Duck Feather","鴨毛"]],兔子:[["Wool","羊毛"],["Rabbit's Foot","兔腳"]],恐龍:[["Dinosaur Egg","恐龍蛋"]],
      牛:[["Milk","牛奶"],["Large Milk","大瓶牛奶"]],山羊:[["Goat Milk","羊奶"],["Large Goat Milk","大瓶羊奶"]],綿羊:[["Wool","羊毛"]],豬:[["Truffle","松露"]],鴕鳥:[["Ostrich Egg","鴕鳥蛋"]]
    };
    const pondProductMap={
      "大海參":[[1,"Purple Roe","魚籽"],[9,"Iridium Ore","銥礦"],[9,"Amethyst","紫水晶"]],
      "鬼魚":[[1,"White Roe","魚籽"],[3,"Quartz","石英"],[9,"White Algae","白藻"],[9,"Refined Quartz","精煉石英"],[9,"Pale Broth","清湯"]],
      "幽靈魚":[[1,"Blue Roe","魚籽"],[9,"Treasure Chest","財寶箱"]],
      "鱘魚":[[1,"Sturgeon Roe","鱘魚籽"]],
      "水滴魚":[[1,"Beige Roe","魚籽"],[9,"Pearl","珍珠"],[9,"Warp Totem Farm","農場圖騰"]]
    };
    const pondProducts=(fish)=>{
      if(!fish)return [];
      return pondProductMap[fish]||[[1,"Roe","魚籽"]];
    };
    const machineDefs={
      artisan:[
        ["bee","蜂房","Bee House",[["Honey","蜂蜜"]]],["cask","木桶","Cask",[["Wine","果酒"],["Cheese","奶酪"],["Beer","啤酒"]]],["cheese","起司壓製機","Cheese Press",[["Cheese","奶酪"],["Goat Cheese","山羊奶酪"]]],["dehydrator","脫水機","Dehydrator",[["Dried Fruit","果乾"],["Dried Mushrooms","乾燥蘑菇"],["Raisins","葡萄乾"]]],["smoker","燻魚機","Fish Smoker",[["Smoked Fish","燻魚"]]],["keg","小桶","Keg",[["Wine","果酒"],["Juice","果汁"],["Coffee","咖啡"],["Green Tea","綠茶"]]],["loom","織布機","Loom",[["Cloth","布料"]]],["mayo","美乃滋機","Mayonnaise Machine",[["Mayonnaise","美乃滋"],["Duck Mayonnaise","鴨美乃滋"],["Void Mayonnaise","虛空美乃滋"]]],["oil","產油機","Oil Maker",[["Truffle Oil","松露油"],["Oil","油"]]],["jar","罐頭瓶","Preserves Jar",[["Jelly","果醬"],["Pickles","醃菜"],["Aged Roe","陳年魚籽"],["Caviar","魚子醬"]]]
      ],
      refining:[
        ["bait_maker","魚餌製造機","Bait Maker",[["Targeted Bait","針對性魚餌"]]],["bone_mill","碎骨機","Bone Mill",[["Basic Fertilizer","肥料"],["Quality Fertilizer","高級肥料"],["Speed-Gro","生長激素"]]],["charcoal","煤炭窯","Charcoal Kiln",[["Coal","煤炭"]]],["crystalarium","寶石複製機","Crystalarium",[["Diamond","鑽石"],["Ruby","紅寶石"],["Jade","翡翠"]]],["deluxe_worm","高級蟲餌盒","Deluxe Worm Bin",[["Deluxe Bait","高級魚餌"]]],["furnace","熔爐","Furnace",[["Copper Bar","銅錠"],["Iron Bar","鐵錠"],["Gold Bar","金錠"],["Iridium Bar","銥錠"]]],["geode","晶球破開器","Geode Crusher",[["Diamond","礦物"],["Earth Crystal","晶體"]]],["heavy_furnace","重型熔爐","Heavy Furnace",[["Copper Bar","銅錠"],["Gold Bar","金錠"],["Iridium Bar","銥錠"]]],["heavy_tapper","重型樹液採集器","Heavy Tapper",[["Maple Syrup","楓糖漿"],["Oak Resin","橡樹樹脂"],["Pine Tar","松焦油"]]],["lightning","避雷針","Lightning Rod",[["Battery Pack","電池組"]]],["mushroom_log","蘑菇樹樁","Mushroom Log",[["Common Mushroom","普通蘑菇"],["Red Mushroom","紅蘑菇"],["Purple Mushroom","紫蘑菇"]]],["ostrich_incubator","鴕鳥孵化器","Ostrich Incubator",[["Ostrich","鴕鳥"]]],["recycling","回收機","Recycling Machine",[["Wood","木材"],["Stone","石頭"],["Refined Quartz","精煉石英"]]],["seed","種子生產器","Seed Maker",[["Parsnip Seeds","作物種子"],["Mixed Seeds","混合種子"]]],["slime_egg","史萊姆壓蛋器","Slime Egg-Press",[["Green Slime Egg","史萊姆蛋"]]],["slime_incubator","史萊姆孵化器","Slime Incubator",[["Green Slime","史萊姆"]]],["solar","太陽能板","Solar Panel",[["Battery Pack","電池組"]]],["tapper","樹液採集器","Tapper",[["Maple Syrup","楓糖漿"],["Oak Resin","橡樹樹脂"],["Pine Tar","松焦油"]]],["wood_chipper","木材削片機","Wood Chipper",[["Wood","木材"]]],["worm_bin","蟲餌盒","Worm Bin",[["Bait","魚餌"]]]
      ]
    };
    const coopFiles=["Coop","Coop","Big Coop","Deluxe Coop"], barnFiles=["Barn","Barn","Big Barn","Deluxe Barn"];
    const otherMap={well:"水井",mill:"磨坊",stable:"馬廄",slime:"史萊姆窩",cabin:"連線小屋",greenhouse:"溫室",junimo:"祝尼魔小屋"};
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
      const max=key==="greenhouse"?1:99, v=Math.max(0,Math.min(max,Number(value)||0));
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
    const FarmTab=({id,label,file})=>{const active=farmSection===id;return <button onClick={()=>setFarmSection(id)} style={{border:`2px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:11,padding:"6px 3px 5px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={file} size={35}/><span style={{fontSize:9.5,fontWeight:950,color:active?C.darkBrown:C.muted}}>{label}</span></button>};
    const ProductLine=({name})=>{const ps=animalProducts[name]||[];return <div style={{marginTop:3,minHeight:27}}><div style={{display:"flex",justifyContent:"center",gap:2}}>{ps.map(([file,label])=><span key={file} title={label}><GameIcon file={file} size={18} alt={label}/></span>)}</div><div style={{fontSize:6.8,color:C.muted,fontWeight:800,lineHeight:1.05,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ps.map(x=>x[1]).join("／")}</div></div>};
    const AnimalGrid=({items})=><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{items.map(a=>{const n=Number(data.animals?.[a.name]||0);return <div key={a.name} style={{border:`1.5px solid ${n>0?C.green:C.line}`,background:n>0?"#EEF7DD":C.paper,borderRadius:9,padding:"5px 3px",textAlign:"center",minWidth:0}}><GameIcon file={ANIMAL_ICON_FILES[a.name]} size={34}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>{a.name}</div><ProductLine name={a.name}/><div style={{display:"grid",gridTemplateColumns:"22px 1fr 22px",alignItems:"center",gap:2,marginTop:3}}><button onClick={()=>setAnimalCount(a.name,n-1)} style={{border:0,background:C.cream,borderRadius:6,height:21,fontWeight:950,color:C.brown,padding:0}}>−</button><b style={{fontSize:10.5,color:n?C.green:C.muted}}>{n}</b><button onClick={()=>setAnimalCount(a.name,n+1)} style={{border:0,background:C.cream,borderRadius:6,height:21,fontWeight:950,color:C.brown,padding:0}}>＋</button></div></div>})}</div>;
    const BuildingImage=({file,active=true})=><img src={GAME_FILE(file)} alt="" loading="lazy" onError={e=>{e.currentTarget.style.visibility="hidden"}} style={{width:"100%",height:54,objectFit:"contain",imageRendering:"pixelated",filter:active?"none":"grayscale(1)",opacity:active?1:.35}}/>;
    const CountTile=({name,file,count,onMinus,onPlus,sub,onImageClick,products=[]})=><div style={{border:`1.5px solid ${count>0?C.green:C.line}`,background:count>0?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 4px",textAlign:"center"}}>{onImageClick?<button onClick={onImageClick} style={{display:"block",width:"100%",border:0,background:"transparent",padding:0,cursor:"pointer"}}><BuildingImage file={file} active={count>0}/></button>:<BuildingImage file={file} active={count>0}/>}<div style={{fontSize:9,fontWeight:950,color:C.ink}}>{name}</div>{sub&&<div style={{fontSize:7.5,color:C.muted,fontWeight:850,minHeight:10}}>{sub}</div>}{products.length>0&&<div style={{display:"flex",justifyContent:"center",gap:2,flexWrap:"wrap",minHeight:28,marginTop:3}}>{products.slice(0,4).map(([pf,pl])=><span key={`${pf}-${pl}`} title={pl} style={{display:"inline-flex",flexDirection:"column",alignItems:"center",maxWidth:30}}><GameIcon file={pf} size={18} alt={pl}/><span style={{fontSize:5.8,color:C.muted,fontWeight:850,lineHeight:1,marginTop:1,maxWidth:30,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pl}</span></span>)}</div>}<div style={{display:"grid",gridTemplateColumns:"22px 1fr 22px",gap:2,alignItems:"center",marginTop:4}}><button onClick={onMinus} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>−</button><b style={{fontSize:10.5,color:count>0?C.green:C.muted}}>×{count}</b><button onClick={onPlus} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>＋</button></div></div>;
    const MachineTile=({id,name,file,products})=>{const n=Number(data.machines?.[id]||0);return <CountTile name={name} file={file} products={products} count={n} onMinus={()=>setMachineCount(id,n-1)} onPlus={()=>setMachineCount(id,n+1)}/>};
    return <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:8}}>
        <FarmTab id="animals" label="動物" file="Animals Tab"/>
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
                {fishIndex>=0?<img src={ICON_URLS.fish[fishIndex]} alt="" style={{width:38,height:38,imageRendering:"pixelated",objectFit:"contain"}}/>:<GameIcon file="Fish Pond" size={38}/>} 
                <div style={{fontSize:9,fontWeight:950,color:C.ink,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:1}}>{p.fish||"未選魚種"}</div>
              </button>
              <div style={{marginTop:3,minHeight:28}}>
                <div style={{display:"flex",justifyContent:"center",gap:3,flexWrap:"wrap"}}>{products.slice(0,4).map(([min,file,label])=>{const unlocked=Number(p.count||0)>=min;return <span key={`${file}-${min}`} title={unlocked?label:`${label}・需 ${min} 隻`} style={{display:"inline-flex",flexDirection:"column",alignItems:"center",filter:unlocked?"none":"grayscale(1)",opacity:unlocked?1:.28}}><GameIcon file={file} size={18} alt={label}/>{!unlocked&&<span style={{fontSize:5.8,fontWeight:950,color:C.muted,lineHeight:1}}>需{min}</span>}</span>})}</div>
                <div style={{fontSize:6.8,color:C.muted,fontWeight:800,lineHeight:1.05,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{products.length?products.map(([min,,label])=>Number(p.count||0)>=min?label:`${label}(需${min})`).join("／"):"尚無產出"}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"22px 1fr 22px",alignItems:"center",gap:2,marginTop:4}}>
                <button onClick={()=>{const ponds=[...data.ponds];ponds[i]={...p,count:Math.max(0,Number(p.count||0)-1)};update({ponds})}} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>−</button>
                <b style={{fontSize:10.5,color:Number(p.count||0)>0?C.green:C.muted}}>{Number(p.count||0)}</b>
                <button onClick={()=>{const ponds=[...data.ponds];ponds[i]={...p,count:Math.min(10,Number(p.count||0)+1)};update({ponds})}} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>＋</button>
              </div>
              <div style={{fontSize:7.2,color:open?C.orange:C.muted,fontWeight:900,marginTop:3}}>{open?"▲ 收起魚種":"點魚圖換魚"}</div>
            </div>;
          })}</div>
        </Card>
        {pondPicker!=null&&data.ponds?.[pondPicker]&&<Card style={{padding:8,marginTop:7,background:"#FFF8E2"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><b style={{fontSize:10.5,color:C.brown,flex:1}}>第 {pondPicker+1} 座魚塘｜選魚</b><button onClick={()=>setPondPicker(null)} style={{border:0,background:"transparent",color:C.brown,fontSize:12,fontWeight:950}}>完成</button></div>
          <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:5,WebkitOverflowScrolling:"touch"}}>{COLLECTIONS.fish.items.map((name,fi)=>{const p=data.ponds[pondPicker],on=name===p.fish;return <button key={`${pondPicker}-${name}`} onClick={()=>{const ponds=[...data.ponds];ponds[pondPicker]={...p,fish:name};update({ponds});setPondPicker(null)}} style={{flex:"0 0 58px",border:`1.5px solid ${on?C.green:C.line}`,background:on?C.lightGreen:C.paper,borderRadius:8,padding:"4px 2px",minHeight:58,cursor:"pointer"}}><img src={ICON_URLS.fish[fi]} alt="" loading="lazy" style={{width:28,height:28,imageRendering:"pixelated",objectFit:"contain"}}/><div style={{fontSize:7.5,fontWeight:900,color:C.ink,lineHeight:1.05}}>{name}</div></button>})}</div>
          <button onClick={()=>{const ponds=data.ponds.filter((_,j)=>j!==pondPicker);setPondPicker(null);update({ponds,buildings:{...data.buildings,fishPonds:ponds.length}})}} style={{marginTop:5,border:0,background:"transparent",color:C.red,fontSize:9.5,fontWeight:900,padding:0}}>刪除這座魚塘</button>
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
          <CountTile name="馬廄" file="Horse Stable" count={buildingCount("stable")} onMinus={()=>setBuildingCount("stable",buildingCount("stable")-1)} onPlus={()=>setBuildingCount("stable",buildingCount("stable")+1)}/>
          <CountTile name="史萊姆窩" file="Slime Hutch" count={buildingCount("slime")} onMinus={()=>setBuildingCount("slime",buildingCount("slime")-1)} onPlus={()=>setBuildingCount("slime",buildingCount("slime")+1)}/>
          <CountTile name="連線小屋" file="Log Cabin" count={buildingCount("cabin")} onMinus={()=>setBuildingCount("cabin",buildingCount("cabin")-1)} onPlus={()=>setBuildingCount("cabin",buildingCount("cabin")+1)}/>
          <CountTile name="祝尼魔小屋" file="Junimo Hut" count={buildingCount("junimo")} onMinus={()=>setBuildingCount("junimo",buildingCount("junimo")-1)} onPlus={()=>setBuildingCount("junimo",buildingCount("junimo")+1)}/>
          <button onClick={()=>setBuildingCount("greenhouse",buildingCount("greenhouse")?0:1)} style={{border:`1.5px solid ${buildingCount("greenhouse")?C.green:C.line}`,background:buildingCount("greenhouse")?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 4px",textAlign:"center",cursor:"pointer"}}><BuildingImage file="Greenhouse" active={buildingCount("greenhouse")>0}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>溫室</div><div style={{fontSize:8,color:buildingCount("greenhouse")?C.green:C.muted,fontWeight:950,marginTop:3}}>{buildingCount("greenhouse")?"✓ 已建造":"○ 未建造"}</div></button>
        </div><div style={{fontSize:8.5,color:C.muted,marginTop:6,lineHeight:1.4}}>農舍／雞舍／牲口棚／小屋：直接點建築圖循環升級；可蓋多座的建築保留數量 ±；溫室這類單一建築只記已建造／未建造。</div></Card>
      </>}

      {farmSection==="tools"&&<>
        <SectionTitle icon="🔧">手持工具</SectionTitle>
        <Card style={{padding:8}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{TOOL_NAMES.map(([id,name])=>{const level=data.tools?.[id]||"初始",idx=TOOL_LEVELS.indexOf(level);return <button key={id} onClick={()=>updateNested("tools",{[id]:TOOL_LEVELS[(idx+1)%TOOL_LEVELS.length]})} style={{border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:9,padding:"6px 3px",cursor:"pointer"}}><GameIcon file={toolFiles[id]?.[level]||TOOL_ICON_FILES[id]} size={36}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>{name}</div><div style={{fontSize:8.5,color:C.green,fontWeight:950,marginTop:2}}>{level}</div></button>})}<button onClick={()=>{const idx=panLevels.indexOf(panLevel);updateNested("tools",{pan:panLevels[(idx+1)%panLevels.length]})}} style={{border:`1.5px solid ${panLevel!=="未取得"?C.green:C.line}`,background:panLevel!=="未取得"?"#EEF7DD":C.paper,borderRadius:9,padding:"6px 3px",cursor:"pointer",opacity:panLevel==="未取得"?.55:1}}><GameIcon file={panFiles[panLevel]} size={36}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>淘金盤</div><div style={{fontSize:8.5,color:panLevel!=="未取得"?C.green:C.muted,fontWeight:950,marginTop:2}}>{panLevel}</div></button></div><div style={{fontSize:8.5,color:C.muted,marginTop:6,textAlign:"center"}}>點圖示循環切換工具等級；淘金盤為未取得 → 銅 → 鋼 → 金 → 銥。</div></Card>
        <SectionTitle icon="🏗️">加工設備</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}><button onClick={()=>setMachineGroup("artisan")} style={{border:`2px solid ${machineGroup==="artisan"?C.orange:C.line}`,background:machineGroup==="artisan"?"#FFE2A8":C.paper,borderRadius:9,padding:6,fontSize:9,fontWeight:950,color:C.brown}}><GameIcon file="Keg" size={27}/>工匠加工・10</button><button onClick={()=>setMachineGroup("refining")} style={{border:`2px solid ${machineGroup==="refining"?C.orange:C.line}`,background:machineGroup==="refining"?"#FFE2A8":C.paper,borderRadius:9,padding:6,fontSize:9,fontWeight:950,color:C.brown}}><GameIcon file="Furnace" size={27}/>精煉設備・20</button></div>
        <Card style={{padding:7}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{machineDefs[machineGroup].map(([id,name,file,products])=><MachineTile key={id} id={id} name={name} file={file} products={products}/>)}</div></Card>
      </>}
    </div>;
  };

  const renderData = () => {
    const DataTab=({id,label,file})=>{const active=dataSection===id;return <button onClick={()=>setDataSection(id)} style={{border:`2px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:11,padding:"7px 4px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={file} size={39}/><span style={{fontSize:10,fontWeight:950,color:active?C.darkBrown:C.muted}}>{label}</span></button>};
    return <div><SectionTitle icon="📊">資料</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:7}}><DataTab id="farm" label="農場" file="Animals Tab"/><DataTab id="skills" label="技能" file="Skills Tab Icon"/><DataTab id="bundles" label="社區" file="Golden Scroll"/><DataTab id="collection" label="收藏" file="Collections Tab"/></div>{dataSection==="farm"&&renderFarm()}{dataSection==="skills"&&renderSkills()}{dataSection==="bundles"&&renderBundles()}{dataSection==="collection"&&renderCollection()}</div>;
  };

  const renderPeople = () => {
    const g=NPC_GROUPS.find(x=>x.id===socialGroup)||NPC_GROUPS[0];
    const GiftGrid=({title,items,tone})=><div style={{marginTop:6}}><div style={{fontSize:9,fontWeight:950,color:tone,marginBottom:4}}>{title}</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4}}>{(items||[]).map(item=>{const file=itemFileZhV26(item),unknown=item.includes("百科");return <div key={item} style={{border:`1px solid ${C.line}`,background:unknown?"#F2ECE0":C.paper,borderRadius:8,padding:"4px 2px",textAlign:"center",minHeight:55}}>{file?<GameIcon file={file} size={27} alt={item}/>:<div style={{height:27,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:C.muted}}>•</div>}<div style={{fontSize:7.1,fontWeight:900,color:C.ink,lineHeight:1.05,marginTop:2}}>{item}</div></div>})}</div></div>;
    return <div><SectionTitle icon="💛">社交</SectionTitle><div style={{display:"flex",gap:6,marginTop:7,flexWrap:"wrap"}}>{NPC_GROUPS.map(x=><Pill key={x.id} active={socialGroup===x.id} onClick={()=>{setSocialGroup(x.id);setExpandedNPC(null)}}>{x.id==="single"?"可交往對象":x.id==="town"?"村民":"特殊角色"}</Pill>)}</div><div style={{display:"grid",gap:7,marginTop:8}}>{g.list.map(n=>{const hearts=Number(data.friendship?.[n]||0),open=expandedNPC===n,gift=NPC_GIFTS[n];return <Card key={n} style={{padding:8}}><div onClick={()=>setExpandedNPC(open?null:n)} style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer"}}><GameIcon file={NPC_ICON_FILES[n]} size={38}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:12,color:C.ink}}>{n}</b>{gift?.love?.length>0&&<div style={{display:"flex",gap:2,marginTop:2}}>{gift.love.slice(0,4).map(x=>{const f=itemFileZhV26(x);return f?<GameIcon key={x} file={f} size={18} alt={x}/>:null})}</div>}</div><span style={{fontSize:11,color:C.red,fontWeight:950}}>♥ {hearts}/{g.max}</span><span style={{color:C.brown,fontWeight:950}}>{open?"▲":"▼"}</span></div><div style={{display:"flex",gap:2,flexWrap:"wrap",marginTop:5}}>{Array.from({length:g.max},(_,i)=><button key={i} onClick={()=>updateNested("friendship",{[n]:i+1===hearts?i:i+1})} style={{border:0,background:"transparent",padding:0,fontSize:15,color:i<hearts?C.red:"#D8CFC3",cursor:"pointer"}}>♥</button>)}</div>{open&&<div style={{marginTop:7,paddingTop:6,borderTop:`1px dashed ${C.line}`}}>{gift&&<><GiftGrid title="❤ 最愛" items={gift.love} tone={C.red}/><GiftGrid title="● 喜歡" items={gift.like} tone={C.green}/><GiftGrid title="× 不喜歡／討厭" items={gift.hate} tone={C.muted}/></>}<div style={{marginTop:7}}><WikiBtn name={NPC_WIKI[n]||n}/></div></div>}</Card>})}</div></div>;
  };


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
    const income=Number(data.base?.totalIncome||0), fishGot=(data.collections?.fish||[]).length;
    const hearts=Object.values(data.friendship||{}).map(Number);
    const cooked=(data.cookingCollectionV3||[]).length;
    if(id==="greenhorn")return income>=15000;
    if(id==="cowpoke")return income>=50000;
    if(id==="homesteader")return income>=250000;
    if(id==="millionaire")return income>=1000000;
    if(id==="legend")return income>=10000000;
    if(id==="friend5")return hearts.some(x=>x>=5);
    if(id==="friend10")return hearts.some(x=>x>=10);
    if(id==="beloved")return hearts.filter(x=>x>=10).length>=8;
    if(id==="cliques")return hearts.filter(x=>x>=5).length>=4;
    if(id==="networking")return hearts.filter(x=>x>=5).length>=10;
    if(id==="popular")return hearts.filter(x=>x>=5).length>=20;
    if(id==="cook10")return cooked>=10;
    if(id==="cook25")return cooked>=25;
    if(id==="cookall")return cooked>=COOKING_DISHES_V3.length;
    if(id==="house1")return Number(data.house||0)>=1;
    if(id==="house2")return Number(data.house||0)>=2;
    if(id==="fish10")return fishGot>=10;
    if(id==="fish24")return fishGot>=24;
    if(id==="fishall")return fishGot>=FISH_ICON_FILES.length;
    if(id==="bottom")return Number(data.mine?.normal||0)>=120;
    if(id==="locallegend")return rp.done>=rp.total;
    if(id==="talent")return Object.values(data.skills||{}).some(x=>Number(x)>=10);
    if(id==="five")return Object.values(data.skills||{}).length>=5&&Object.values(data.skills||{}).every(x=>Number(x)>=10);
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

  const renderPowers = () => {
    const sections={special:SPECIAL_ITEMS_V2,books:BOOK_POWERS_V2,mastery:MASTERY_POWERS_V2};
    const labels={special:"特殊物品",books:"書籍能力",mastery:"精通能力"};
    return <div>
      <SectionTitle icon="🎒">特殊物品與能力</SectionTitle>
      <Card style={{background:"#FFF4D8",fontSize:11,color:C.muted,lineHeight:1.5}}>對應 1.6 遊戲「＋ → 特殊物品與能力」：特殊物品、書籍能力、精通能力分開記錄。</Card>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:9}}>{Object.keys(sections).map(k=><Pill key={k} active={powerSection===k} onClick={()=>setPowerSection(k)}>{labels[k]}</Pill>)}</div>
      <div style={{display:"grid",gap:7,marginTop:9}}>{sections[powerSection].map(it=>{
        const checked=isPowerChecked(powerSection,it);
        return <Card key={it.id} style={{padding:9,background:checked?"#EAF4D8":C.paper}}><div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={it.file} size={36}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:13,color:C.ink}}>{it.name}</b><div style={{fontSize:10.5,color:C.muted,lineHeight:1.35,marginTop:2}}>{it.desc}</div></div><button onClick={()=>togglePower(powerSection,it)} style={{border:`2px solid ${checked?C.green:C.line}`,background:checked?C.lightGreen:C.cream,borderRadius:8,padding:"5px 8px",fontWeight:900,color:checked?C.green:C.muted}}>{checked?"✓":"○"}</button></div></Card>;
      })}</div>
    </div>;
  };

  const renderAchievements = () => <div>
    <Card style={{padding:9,background:"#FFF4D8",fontSize:10.5,color:C.muted,lineHeight:1.45}}>對應遊戲「＋ → 收集品 → 成就」。能從目前手帳可靠推斷的成就標成「自動」，其餘可手動點亮。</Card>
    <div style={{display:"grid",gap:6,marginTop:8}}>{ACHIEVEMENTS_V2.map(a=>{
      const auto=derivedAchievement(a.id), checked=achievementChecked(a.id);
      return <Card key={a.id} style={{padding:8,background:checked?"#EAF4D8":C.paper}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file="Achievement Star 01" size={28}/><div style={{flex:1}}><b style={{fontSize:12.5,color:C.ink}}>{a.name}</b>{auto&&<span style={{fontSize:9,color:C.green,fontWeight:900,marginLeft:5}}>自動</span>}<div style={{fontSize:10,color:C.muted,marginTop:1}}>{a.desc}</div></div><button disabled={auto} onClick={()=>toggleAchievement(a.id)} style={{border:`2px solid ${checked?C.green:C.line}`,background:checked?C.lightGreen:C.cream,borderRadius:8,padding:"4px 7px",fontWeight:900,color:checked?C.green:C.muted,opacity:auto?0.75:1}}>{checked?"✓":"○"}</button></div></Card>;
    })}</div>
  </div>;

  const renderDexCollection = () => {
    const c = COLLECTIONS[selectedCollection];
    const got = data.collections[selectedCollection] || [];
    const effectiveSeason = fishSeason === "當季" ? data.base.season : fishSeason;
    const visible = c.items.map((it,i)=>({it,i,meta:selectedCollection==="fish"?parseFishMeta(c.info?.[i]||""):null})).filter(row=>{
      if(selectedCollection!=="fish") return true;
      const m=row.meta;
      if(effectiveSeason!=="全部" && !m.seasons.includes(effectiveSeason)) return false;
      if(fishWeather!=="全部" && m.weather!=="任意" && m.weather!==fishWeather) return false;
      if(fishArea!=="全部" && !m.areas.includes(fishArea)) return false;
      if(fishMissingOnly && got.includes(row.i)) return false;
      return true;
    });
    return <div>
      <SectionTitle icon="📖">圖鑑</SectionTitle>

      <Card style={{marginTop:10,padding:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:900,color:C.muted,marginBottom:5}}><span>{c.name}</span><span>{got.length}/{c.items.length}</span></div><ProgressBar value={got.length} max={c.items.length}/></Card>
      {selectedCollection==="fish" && <Card style={{marginTop:9,padding:9,background:"#FFF4D8"}}>
        <div style={{fontSize:11,fontWeight:950,color:C.brown,marginBottom:5}}>快速找魚</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{["當季","春","夏","秋","冬","全部"].map(x=><Pill key={x} small active={fishSeason===x} onClick={()=>setFishSeason(x)}>{x}</Pill>)}</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:5}}>{["全部","晴","雨"].map(x=><Pill key={x} small active={fishWeather===x} onClick={()=>setFishWeather(x)}>{x==="全部"?"全部天氣":x}</Pill>)}</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:5}}>{["全部","河流","湖泊","海洋","礦井","沙漠","特殊","薑島","夜市"].map(x=><Pill key={x} small active={fishArea===x} onClick={()=>setFishArea(x)}>{x==="全部"?"全部地區":x}</Pill>)}</div>
        <label style={{display:"flex",alignItems:"center",gap:6,marginTop:7,fontSize:11,fontWeight:900,color:C.brown}}><input type="checkbox" checked={fishMissingOnly} onChange={e=>setFishMissingOnly(e.target.checked)}/>只看尚未收集</label>
        <div style={{fontSize:10,color:C.muted,marginTop:5}}>顯示 {visible.length} 項；「任意」天氣的魚在晴／雨篩選中都會保留。</div>
      </Card>}
      {selectedItem != null && <Card style={{marginTop:10,background:"#FFF9E8"}}><div style={{display:"flex",gap:10,alignItems:"center"}}>{ICON_URLS[selectedCollection]?.[selectedItem] && <img src={ICON_URLS[selectedCollection][selectedItem]} alt="" style={{width:48,height:48,imageRendering:"pixelated",objectFit:"contain"}}/>}<div style={{flex:1,minWidth:0}}><b style={{fontSize:16,color:C.darkBrown}}>{c.items[selectedItem]}</b><div style={{fontSize:12,color:C.muted,marginTop:3}}>{c.info?.[selectedItem] || ""}</div>{selectedCollection==="fish"&&<FishTags meta={parseFishMeta(c.info?.[selectedItem]||"")}/>}</div><WikiBtn name={c.items[selectedItem]}/></div></Card>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:6,marginTop:10}}>{visible.map(({it,i,meta})=>{
        const checked=got.includes(i);
        return <button key={i} onClick={()=>setSelectedItem(i)} onDoubleClick={()=>updateNested("collections",{[selectedCollection]:checked?got.filter(x=>x!==i):[...got,i]})} style={{position:"relative",border:`2px solid ${selectedItem===i?C.orange:checked?C.green:C.line}`,background:checked?"#E5F3CF":C.paper,borderRadius:9,padding:"6px 3px",minHeight:selectedCollection==="fish"?96:78,cursor:"pointer",boxShadow:`0 2px 5px ${C.shadow}`}}>
          <div style={{height:38,display:"flex",alignItems:"center",justifyContent:"center"}}>{ICON_URLS[selectedCollection]?.[i]?<img src={ICON_URLS[selectedCollection][i]} alt={it} loading="lazy" onError={e=>{e.currentTarget.style.opacity=.25}} style={{width:36,height:36,imageRendering:"pixelated",objectFit:"contain"}}/>:<span style={{fontSize:13,color:C.muted,fontWeight:900}}>{i+1}</span>}</div>
          <div style={{fontSize:9.5,fontWeight:900,color:C.ink,lineHeight:1.15,marginTop:2}}>{it}</div>
          {selectedCollection==="fish"&&<FishTags meta={meta} compact/>}
          <button onClick={e=>{e.stopPropagation();updateNested("collections",{[selectedCollection]:checked?got.filter(x=>x!==i):[...got,i]})}} style={{position:"absolute",right:2,top:2,border:0,background:"transparent",fontSize:13,color:checked?C.green:"#C9B99A",fontWeight:950}}>{checked?"✓":"○"}</button>
        </button>})}</div>
    </div>;
  };


  const prepSetV3 = data.cookingPrepV3 || [];
  const cookedSetV3 = data.cookingCollectionV3 || [];
  const togglePrepV3 = id => update({cookingPrepV3:prepSetV3.includes(id)?prepSetV3.filter(x=>x!==id):[...prepSetV3,id]});
  const toggleCookedV3 = id => update({cookingCollectionV3:cookedSetV3.includes(id)?cookedSetV3.filter(x=>x!==id):[...cookedSetV3,id]});
  const allPrepItemsV3 = COOKING_PREP_GROUPS_V3.flatMap(g=>g.items);

  const renderCookingV3 = () => <div>
    <Card style={{marginTop:8,padding:9,background:"#FFF4D8"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file="Cooking Icon" size={34}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:950,color:C.darkBrown}}>全料理一次性備料</div><div style={{fontSize:10.5,color:C.muted,lineHeight:1.4}}>像圖鑑一樣點亮：亮＝已按攻略放足最低需求量；不記實際庫存數量。</div></div></div>
      <div style={{marginTop:7}}><ProgressBar value={prepSetV3.length} max={allPrepItemsV3.length}/><div style={{fontSize:10,color:C.muted,marginTop:3,textAlign:"right"}}>{prepSetV3.length}/{allPrepItemsV3.length}</div></div>
      <div style={{display:"flex",gap:5,marginTop:7}}><Pill small active={cookingModeV3==="prep"} onClick={()=>setCookingModeV3("prep")}>備料圖鑑</Pill><Pill small active={cookingModeV3==="dishes"} onClick={()=>setCookingModeV3("dishes")}>料理收集</Pill></div>
    </Card>
    {cookingModeV3==="prep" && <>
      <label style={{display:"flex",alignItems:"center",gap:6,margin:"8px 2px 0",fontSize:11,fontWeight:900,color:C.brown}}><input type="checkbox" checked={prepMissingOnlyV3} onChange={e=>setPrepMissingOnlyV3(e.target.checked)}/>只看還沒準備的材料</label>
      {COOKING_PREP_GROUPS_V3.map(g=>{const rows=g.items.filter(it=>!prepMissingOnlyV3||!prepSetV3.includes(it[0]));return rows.length?<Card key={g.id} style={{marginTop:8,padding:9,background:g.id==="g5"?"#FFF0D2":C.paper}}><div style={{fontSize:12.5,fontWeight:950,color:C.darkBrown}}>{g.name}</div><div style={{fontSize:9.5,color:C.muted,marginTop:2,lineHeight:1.35}}>{g.desc}</div><div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:7}}>{rows.map(it=>{const [id,name,file,need]=it,on=prepSetV3.includes(id);return <button key={id} onClick={()=>togglePrepV3(id)} style={{position:"relative",border:`2px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,minHeight:82,padding:"5px 2px",boxShadow:`0 1px 4px ${C.shadow}`,cursor:"pointer"}}><div style={{height:35,display:"flex",alignItems:"center",justifyContent:"center"}}><GameIcon file={file} size={34}/></div><div style={{fontSize:9,fontWeight:950,color:C.ink,lineHeight:1.1,marginTop:2}}>{name}</div><span style={{position:"absolute",left:3,top:2,fontSize:8.5,fontWeight:950,color:C.brown,background:"#FFF1C9",borderRadius:6,padding:"1px 3px"}}>×{need}</span><span style={{position:"absolute",right:2,top:1,fontSize:12,color:on?C.green:"#C9B99A",fontWeight:950}}>{on?"✓":"○"}</span></button>})}</div></Card>:null})}
    </>}
    {cookingModeV3==="dishes" && <Card style={{marginTop:8,padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:950,color:C.brown}}><span>遊戲烹飪收集</span><span>{cookedSetV3.length}/{COOKING_DISHES_V3.length}</span></div><ProgressBar value={cookedSetV3.length} max={COOKING_DISHES_V3.length}/><div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:8}}>{COOKING_DISHES_V3.map(it=>{const [id,name,file]=it,on=cookedSetV3.includes(id);return <button key={id} onClick={()=>toggleCookedV3(id)} style={{position:"relative",border:`2px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:8,minHeight:75,padding:"5px 2px",cursor:"pointer"}}><GameIcon file={file} size={34}/><div style={{fontSize:8.8,fontWeight:900,color:C.ink,lineHeight:1.1,marginTop:2}}>{name}</div><span style={{position:"absolute",right:2,top:1,fontSize:11,color:on?C.green:"#C9B99A"}}>{on?"✓":"○"}</span></button>})}</div></Card>}
  </div>;

  const renderPaperCollectionV3 = (kind,total,title) => {
    const list=extrasState[kind]||[];
    const isNotes=kind==="notes";
    const summary=isNotes?SECRET_NOTE_SUMMARY_V3:JOURNAL_SUMMARY_V3;
    const content=isNotes?SECRET_NOTE_CONTENT_V4:summary;
    const solution=isNotes?SECRET_NOTE_SOLUTION_V4:{};
    const imageMap=isNotes?SECRET_NOTE_IMAGE_V3:JOURNAL_IMAGE_V3;
    const selected=selectedPaperV3?.kind===kind?selectedPaperV3.n:null;
    return <div>
      <Card style={{marginTop:8,padding:9}}><div style={{fontSize:12,fontWeight:950,color:C.brown,marginBottom:7}}>{title} {list.length}/{total}</div><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>{Array.from({length:total},(_,i)=>i+1).map(n=>{const on=list.includes(n);return <button key={n} onClick={()=>setSelectedPaperV3({kind,n})} style={{position:"relative",border:`1.5px solid ${selected===n?C.orange:on?C.green:C.line}`,background:on?C.lightGreen:C.cream,borderRadius:7,padding:"7px 1px",fontSize:10,fontWeight:900,color:on?C.green:C.brown}}>{n}<span onClick={e=>{e.stopPropagation();updateExtras({[kind]:on?list.filter(x=>x!==n):[...list,n]})}} style={{position:"absolute",right:1,top:0,fontSize:9}}>{on?"✓":"○"}</span></button>})}</div></Card>
      {selected&&<Card style={{marginTop:8,padding:10,background:"#F6E5B9"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><GameIcon file={isNotes?"Secret Note":"Journal Scrap"} size={36}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:950,color:C.darkBrown}}>{title} #{selected}</div><div style={{fontSize:9.5,color:C.muted,marginTop:2}}>{isNotes?"紙條內容與可執行解法":"日誌內容速查"}</div></div></div>{imageMap[selected]&&<img src={GAME_FILE(imageMap[selected])} alt={`${title} ${selected} 圖像內容`} onError={e=>e.currentTarget.style.display="none"} style={{display:"block",width:"min(216px,100%)",height:"auto",margin:"10px auto 7px",imageRendering:"pixelated",borderRadius:5}}/>}<div style={{marginTop:8,padding:"8px 9px",background:"#FFF8E2",borderRadius:8,border:`1px solid ${C.line}`}}><div style={{fontSize:9.5,fontWeight:950,color:C.brown,marginBottom:3}}>{isNotes?"紙條內容":"內容"}</div><div style={{fontSize:11,color:C.ink,lineHeight:1.55}}>{content[selected]||"尚未整理內容。"}</div></div>{solution[selected]&&<div style={{marginTop:7,padding:"8px 9px",background:"#EAF4D8",borderRadius:8,border:`1px solid ${C.green}`}}><div style={{fontSize:9.5,fontWeight:950,color:C.green,marginBottom:3}}>解法／效果</div><div style={{fontSize:11,color:C.ink,lineHeight:1.55}}>{solution[selected]}</div></div>}<a href={isNotes?"https://stardewvalleywiki.com/Secret_Notes":"https://stardewvalleywiki.com/Journal_Scraps"} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:7,fontSize:10,fontWeight:900,color:C.blue}}>Wiki 完整頁面 ↗</a></Card>}
    </div>;
  };

  const renderFishCardV4 = (i, area=null, compact=false, showCollection=true) => {
    const name=COLLECTIONS.fish.items[i]; const got=(data.collections.fish||[]).includes(i); const rule=fishRuleV4(i);
    const seasons=area?.forceSeasons||area?.seasonOverride?.[i]||rule.s;
    const seasonText=seasons.length===4?"四季":seasons.join("／");
    const timeText=formatFishTimeV4(rule,area?.timeOverride);
    return <button key={`${area?.id||"fish"}-${i}`} onClick={()=>setSelectedItem(i)} style={{position:"relative",border:`2px solid ${showCollection?(!got?C.orange:C.line):C.line}`,background:showCollection?(got?"#F5F0DF":"#FFF2CF"):C.paper,borderRadius:9,padding:compact?"6px":"8px",display:"flex",alignItems:"center",gap:8,textAlign:"left",cursor:"pointer",width:"100%",opacity:showCollection&&got?0.78:1}}>
      <img src={ICON_URLS.fish[i]} alt="" loading="lazy" style={{width:compact?34:40,height:compact?34:40,imageRendering:"pixelated",objectFit:"contain",flex:"0 0 auto"}}/>
      <span style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:compact?11:12.5,color:C.ink}}>{name}{rule.legend?" · 傳說":""}</b><span style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:3}}>
        <span style={{fontSize:8.5,fontWeight:900,padding:"1px 4px",borderRadius:7,background:"#F0E2C5",color:C.brown}}>{seasonText}</span>
        <span style={{fontSize:8.5,fontWeight:900,padding:"1px 4px",borderRadius:7,background:rule.w==="雨"?"#D9EAF8":rule.w==="晴"?"#FFF0A9":"#EAE3D4",color:C.ink}}>{rule.w}</span>
        <span style={{fontSize:8.5,fontWeight:900,padding:"1px 4px",borderRadius:7,background:"#E5EDF2",color:C.blue}}>{timeText}</span>
      </span></span>
      {showCollection&&<span style={{fontSize:11,fontWeight:950,color:got?C.green:C.orange}}>{got?"✓ 已收集":"未收集"}</span>}
    </button>;
  };

  const renderFishDexV4 = () => {
    const got=data.collections.fish||[];
    return <div style={{marginTop:8}}>
      <Card style={{padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>魚類圖鑑</span><span>{got.length}/{COLLECTIONS.fish.items.length}</span></div><ProgressBar value={got.length} max={COLLECTIONS.fish.items.length}/></Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:6,marginTop:8}}>{COLLECTIONS.fish.items.map((name,i)=>{const on=got.includes(i);return <button key={i} onClick={()=>setSelectedItem(i)} style={{position:"relative",border:`2px solid ${!on?C.orange:C.line}`,background:on?"#E8F1D5":C.paper,borderRadius:9,minHeight:76,padding:"5px 2px",cursor:"pointer"}}><img src={ICON_URLS.fish[i]} alt="" style={{width:36,height:36,imageRendering:"pixelated",objectFit:"contain"}}/><div style={{fontSize:9,fontWeight:900,color:C.ink,lineHeight:1.05}}>{name}</div><button onClick={e=>{e.stopPropagation();updateNested("collections",{fish:on?got.filter(x=>x!==i):[...got,i]})}} style={{position:"absolute",right:2,top:2,border:0,background:"transparent",fontSize:12,color:on?C.green:"#C9A86A",fontWeight:950}}>{on?"✓":"○"}</button></button>})}</div>
      {selectedItem!=null&&<Card style={{marginTop:8,background:"#FFF8E2"}}><div style={{display:"flex",gap:9,alignItems:"center"}}><img src={ICON_URLS.fish[selectedItem]} alt="" style={{width:48,height:48,imageRendering:"pixelated"}}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:15,color:C.darkBrown}}>{COLLECTIONS.fish.items[selectedItem]}</b><div style={{fontSize:10.5,color:C.muted,marginTop:3}}>{FISH_INFO[selectedItem]||""}</div></div><WikiBtn name={COLLECTIONS.fish.items[selectedItem]}/></div></Card>}
    </div>;
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
        <div style={{fontSize:11,fontWeight:950,color:C.darkBrown}}>先選大區，再直接從地圖選地點</div>
        <div style={{display:"flex",gap:5,marginTop:6}}>{Object.entries(FISH_AREA_GROUPS_V4).map(([k,g])=><Pill key={k} small active={fishFindGroupV4===k} onClick={()=>selectGroup(k)}>{g.name}</Pill>)}</div>
      </Card>

      {mapMeta.file?<Card style={{marginTop:7,padding:7}}>
        <div style={{position:"relative",overflow:"hidden",borderRadius:8,border:`1px solid ${C.line}`,background:"#DCE9C2"}}>
          <img src={GAME_FILE(mapMeta.file)} alt={`${group.name}地圖`} style={{display:"block",width:"100%",height:"auto",imageRendering:"pixelated"}}/>
          {mapMeta.clusters.map(c=>{const on=c.ids.includes(area?.id);return <button key={c.id} onClick={()=>setFishAreaV4(c.ids[0])} style={{position:"absolute",left:`${c.x}%`,top:`${c.y}%`,transform:"translate(-50%,-50%)",border:`1.5px solid ${on?C.orange:"#8B683C"}`,background:on?"#FFE1A0":"rgba(255,248,226,.94)",boxShadow:"0 1px 3px rgba(0,0,0,.25)",borderRadius:10,padding:"2px 5px",fontSize:7.3,fontWeight:950,color:C.darkBrown,whiteSpace:"nowrap"}}>{c.label}</button>})}
        </div>
        {activeCluster?.ids?.length>1&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>{activeCluster.ids.map(id=>{const a=FISH_AREAS_V4.find(x=>x.id===id);return a?<Pill key={id} small active={area.id===id} onClick={()=>setFishAreaV4(id)}>{a.sub}</Pill>:null})}</div>}
      </Card>:<Card style={{marginTop:7,padding:8}}>
        <div style={{fontSize:9,color:C.muted,marginBottom:5}}>特殊水域不在同一張世界地圖上，直接用入口／樓層圖示選。</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5}}>{groupAreas.map(a=>{const on=a.id===area.id;return <button key={a.id} onClick={()=>setFishAreaV4(a.id)} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFF0D2":C.paper,borderRadius:8,padding:"5px 2px",minWidth:0}}><GameIcon file={a.icon} size={27}/><div style={{fontSize:7.4,fontWeight:950,color:C.ink,lineHeight:1.08,marginTop:2}}>{a.name}</div><div style={{fontSize:6.7,color:C.muted,lineHeight:1.05}}>{a.sub}</div></button>})}</div>
      </Card>}

      <Card style={{marginTop:7,padding:8,background:"#FFF8E2"}}><div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={area.icon} size={34}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:13,color:C.darkBrown}}>{area.name} · {area.sub}</b>{area.island&&<div style={{fontSize:8.5,color:C.green,fontWeight:900,marginTop:2}}>薑島魚類不受季節限制</div>}</div><span style={{fontSize:9.5,color:C.muted,fontWeight:900}}>{rows.length} 項</span></div>{area.tip&&<div style={{fontSize:9,color:C.brown,lineHeight:1.4,marginTop:5}}>{area.tip}</div>}</Card>

      <Card style={{marginTop:7,padding:8}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}><b style={{fontSize:9.5,color:C.brown}}>條件篩選</b>{(fishSeasonsV42.length||fishWeathersV42.length||fishTimesV42.length)?<button onClick={clearFilters} style={{border:0,background:"transparent",fontSize:8,color:C.blue,fontWeight:900}}>清除</button>:<span style={{fontSize:7.5,color:C.muted}}>未勾＝不限</span>}</div>
        <div style={{fontSize:7.5,fontWeight:900,color:C.muted,marginTop:5}}>季節</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>{SEASONS.map(x=>filterButton(x,fishSeasonsV42.includes(x),()=>toggleValue(x,fishSeasonsV42,setFishSeasonsV42),`${SEASON_COLORS[x]}30`))}</div>
        <div style={{fontSize:7.5,fontWeight:900,color:C.muted,marginTop:6}}>天氣</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>{["晴","雨"].map(x=>filterButton(x,fishWeathersV42.includes(x),()=>toggleValue(x,fishWeathersV42,setFishWeathersV42),x==="雨"?"#DCEBFA":"#FFF0B8"))}</div>
        <div style={{fontSize:7.5,fontWeight:900,color:C.muted,marginTop:6}}>時間段</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>{FISH_TIME_SEGMENTS_V42.map(x=>filterButton(x.name,fishTimesV42.includes(x.id),()=>toggleValue(x.id,fishTimesV42,setFishTimesV42),"#E5EDF2"))}</div>
      </Card>

      <div style={{display:"grid",gap:5,marginTop:7}}>{rows.map(i=>renderFishCardV4(i,area,true,false))}</div>
      {!rows.length&&<Card style={{marginTop:8,textAlign:"center",fontSize:10.5,color:C.muted}}>這個地點沒有符合目前季節／天氣／時間條件的魚。</Card>}
    </div>;
  };

  const renderItemUsageV42 = () => {
    const cleanName=name=>String(name||"").replace(/(?:金星|銀星|银星|銥星|铱星)/g,"").replace(/\s*[×x]\s*\d+.*/,"").trim();
    const index=new Map();
    const ensure=(rawName,file,kind="item")=>{
      const name=cleanName(rawName); if(!name||/^\d[\d,]*g$/i.test(name))return null;
      const resolved=file||itemFileZhV26(name)||name;
      const key=String(resolved||name);
      if(!index.has(key))index.set(key,{key,name,file:resolved,aliases:new Set(),kinds:new Set(),bundles:[],remix:[],cookNeed:0,cookGroups:new Set(),shippable:false});
      const it=index.get(key);it.aliases.add(name);it.kinds.add(kind);
      if(kind!=="shipping"&&it.kinds.size<=2)it.name=name;
      return it;
    };
    SHIPPING_ITEMS_V30.forEach(([file,name])=>{const it=ensure(name,file,"shipping");if(it)it.shippable=true});
    COLLECTIONS.fish.items.forEach((name,i)=>{const it=ensure(name,FISH_ICON_FILES[i],"fish");if(it)it.fishIndex=i});
    COLLECTIONS.artifact.items.forEach((name,i)=>ensure(name,ARTIFACT_ICON_FILES[i],"artifact"));
    COLLECTIONS.mineral.items.forEach((name,i)=>ensure(name,MINERAL_ICON_FILES[i],"mineral"));
    COOKING_DISHES_V3.forEach(([,name,file])=>ensure(name,file,"cooking"));
    BUNDLE_ROOMS.forEach(room=>room.bundles.forEach(bundle=>bundle.items.forEach(raw=>{const it=ensure(raw,null,"bundle");if(it)it.bundles.push(`${room.name} · ${bundle.name}：${raw}`)})));
    Object.entries(REMIX_EXTRA_ITEMS_V28||{}).forEach(([roomId,items])=>{const room=BUNDLE_ROOMS.find(r=>r.id===roomId);(items||[]).forEach(raw=>{const it=ensure(raw,null,"remix");if(it)it.remix.push(`${room?.name||roomId}的混合收集包可能需要：${raw}`)})});
    COOKING_PREP_GROUPS_V3.forEach(group=>group.items.forEach(([,name,file,need])=>{const it=ensure(name,file,"ingredient");if(it){it.cookNeed+=Number(need||0);it.cookGroups.add(group.name)}}));
    (MINE_BANDS_V28||[]).forEach(group=>(group.items||[]).forEach(([file,name])=>ensure(name,file,"mine")));

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
    const normalizeItemSearchV43=value=>String(value||"").normalize("NFKC").toLowerCase().replace(/[\s·・_'’\-]+/g,"").split("").map(ch=>SEARCH_T2S_V43[ch]||ch).join("");

    const all=[...index.values()].sort((a,b)=>a.name.localeCompare(b.name,"zh-Hant"));
    const q=normalizeItemSearchV43(itemUsageQueryV42);
    const quickNames=["五彩碎片","恐龍蛋","遠古種子","兔子的腳","電池組","硬木","鑽石","茶葉"];
    const results=(q?all.filter(it=>[it.name,it.file,...it.aliases].some(alias=>normalizeItemSearchV43(alias).includes(q))):quickNames.map(name=>all.find(it=>it.aliases.has(name)||it.name===name)).filter(Boolean)).slice(0,30);
    const selected=all.find(it=>it.key===itemUsageSelectedV42)||null;
    const usageSpecial=selected?Object.entries(ITEM_USAGE_SPECIAL_V42).find(([name])=>selected.aliases.has(name)||selected.name===name)?.[1]:null;
    const wardrobeData=window.SDVWardrobeV34||{};
    const tailoring=selected?[...(wardrobeData.shirts||[]),...(wardrobeData.pants||[])].filter(x=>{const hay=`${x.recipe||""} ${x.sourceZh||""} ${x.source||""}`.toLowerCase();return [selected.name,selected.file,...selected.aliases].some(v=>v&&hay.includes(String(v).toLowerCase()))}).slice(0,6):[];
    const museum=Boolean(selected&&(selected.kinds.has("artifact")||selected.kinds.has("mineral")));
    const shipped=Boolean(selected?.shippable&&(data.shippingV30||[]).includes(selected.file));
    const priceDbV44=window.SDVItemPricesV44||{};
    const priceAliasV44=selected?[selected.file,...selected.aliases].find(v=>v&&Object.prototype.hasOwnProperty.call(priceDbV44,String(v))):null;
    const baseSellPriceV44=priceAliasV44!=null?Number(priceDbV44[String(priceAliasV44)]):null;
    const fixedUses=selected?(selected.bundles.length+selected.remix.length+selected.cookNeed+tailoring.length+(museum?1:0)+(usageSpecial?.uses?.length||0)):0;
    const mustKeepV44=Boolean(selected&&(usageSpecial?.keep||museum||(selected.shippable&&!shipped)||fixedUses));
    const recommendActionV44=!selected?"":mustKeepV44?"留":((baseSellPriceV44!=null&&baseSellPriceV44>0)||selected.kinds.has("fish")||selected.kinds.has("cooking"))?"賣":"留";
    const recommendReasonV44=!selected?"":usageSpecial?.keep||(museum?"第一次拿到先留 1 個給博物館。":selected.shippable&&!shipped?"先留 1 個完成出貨圖鑑，再處理多餘的。":fixedUses?"有收集包／料理／裁縫等固定用途，先留足需求。":recommendActionV44==="賣"?"目前沒有偵測到固定需求，可賣掉換錢。":"用途或售價資料不足，先留較安全。" );
    const sellPriceTextV44=baseSellPriceV44==null?"未整理":baseSellPriceV44>0?`${baseSellPriceV44.toLocaleString()}g`:"0g";
    const usageRowsV44=[];
    if(selected){
      (usageSpecial?.uses||[]).forEach(u=>usageRowsV44.push(["⭐",u]));
      if(museum)usageRowsV44.push(["🏺","博物館：可捐贈 1 個。"]);
      selected.bundles.forEach(u=>usageRowsV44.push(["📦",u]));
      selected.remix.forEach(u=>usageRowsV44.push(["📦",u]));
      if(selected.cookNeed)usageRowsV44.push(["🍳",`料理備料：目前手帳整理的全料理最低備料共需要 ${selected.cookNeed} 個。`]);
      tailoring.forEach(x=>usageRowsV44.push(["🧵",`裁縫：${x.name||"服飾"}${x.recipe?`（${x.recipe}）`:""}`]));
      if(selected.shippable)usageRowsV44.push(["🚚",`出貨圖鑑：可出貨${shipped?"，目前已點亮":"，目前尚未點亮"}。`]);
      if(!usageRowsV44.length)usageRowsV44.push(["・","目前手帳沒有偵測到固定用途。"]);
    }
    const tag=(text,bg)=> <span style={{fontSize:7.2,fontWeight:900,padding:"2px 5px",borderRadius:8,background:bg,color:C.brown,whiteSpace:"nowrap"}}>{text}</span>;
    const resultTags=it=>{const tags=[];if(it.shippable)tags.push(["出貨","#EAF4D8"]);if(it.kinds.has("artifact")||it.kinds.has("mineral"))tags.push(["博物館","#EEE6F7"]);if(it.bundles.length||it.remix.length)tags.push(["收集包","#FFF0C8"]);if(it.cookNeed)tags.push(["料理","#FBE5D6"]);if(it.kinds.has("fish"))tags.push(["魚","#DDECF7"]);return tags.slice(0,3)};
    return <div style={{marginTop:8}}>
      <Card style={{padding:8,background:"#FFF4D8"}}><div style={{fontSize:10.5,fontWeight:950,color:C.darkBrown}}>拿到東西不知道要不要留，就先查這裡</div><div style={{fontSize:8.5,color:C.muted,lineHeight:1.4,marginTop:2}}>會整理出貨、博物館、收集包、料理、裁縫與重要特殊用途；查不到的再直接進 Wiki。</div></Card>
      <div style={{position:"relative",marginTop:7}}><input value={itemUsageQueryV42} onChange={e=>{setItemUsageQueryV42(e.target.value);setItemUsageSelectedV42("")}} placeholder="可輸入繁中／簡中／English，例如：黃玉、黄玉、Topaz…" style={{width:"100%",border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:9,padding:"9px 34px 9px 10px",fontSize:10.5,color:C.ink,outline:"none"}}/>{itemUsageQueryV42&&<button onClick={()=>{setItemUsageQueryV42("");setItemUsageSelectedV42("")}} style={{position:"absolute",right:6,top:5,border:0,background:"transparent",fontSize:14,color:C.muted}}>×</button>}</div>
      {selected&&<Card style={{marginTop:7,padding:9,background:"#FFF8E9"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={selected.file} size={44}/><div style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:14,color:C.darkBrown}}>{selected.name}</b><div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4}}>{resultTags(selected).map(([t,b])=><span key={t}>{tag(t,b)}</span>)}</div></div><WikiBtn name={selected.name}/></div>
        <div style={{fontSize:12,fontWeight:950,color:C.darkBrown,marginTop:9}}>用途</div>
        <div style={{display:"grid",gap:5,marginTop:5}}>{usageRowsV44.map(([icon,text],i)=><div key={i} style={{display:"grid",gridTemplateColumns:"18px 1fr",gap:4,alignItems:"start",fontSize:9.4,color:C.ink,lineHeight:1.45}}><span>{icon}</span><span>{text}</span></div>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:9,paddingTop:7,borderTop:`1px dashed ${C.line}`}}>
          <div style={{minWidth:0}}><span style={{fontSize:7.4,color:C.muted,fontWeight:900}}>建議</span><div style={{fontSize:11,fontWeight:950,color:recommendActionV44==="留"?C.green:C.orange,marginTop:1}}>{recommendActionV44}</div><div style={{fontSize:7.5,color:C.muted,lineHeight:1.3,marginTop:1}}>{recommendReasonV44}</div></div>
          <div style={{minWidth:0}}><span style={{fontSize:7.4,color:C.muted,fontWeight:900}}>賣價</span><div style={{fontSize:11,fontWeight:950,color:C.brown,marginTop:1}}>{sellPriceTextV44}</div><div style={{fontSize:7.5,color:C.muted,lineHeight:1.3,marginTop:1}}>基礎賣價；品質與職業加成另計。</div></div>
        </div>
      </Card>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:5,marginTop:6}}>{results.map(it=>{const on=selected?.key===it.key;return <button key={it.key} onClick={()=>setItemUsageSelectedV42(it.key)} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFF0D2":C.paper,borderRadius:9,padding:"6px 5px",display:"grid",gridTemplateColumns:"34px 1fr",gap:5,alignItems:"center",textAlign:"left",minWidth:0}}><GameIcon file={it.file} size={32}/><span style={{minWidth:0}}><b style={{display:"block",fontSize:8.8,color:C.ink,lineHeight:1.12,overflow:"hidden",textOverflow:"ellipsis"}}>{it.name}</b><span style={{display:"flex",gap:2,flexWrap:"wrap",marginTop:3}}>{resultTags(it).map(([t,b])=><span key={t}>{tag(t,b)}</span>)}</span></span></button>})}</div>
      {!q&&<div style={{fontSize:7.8,color:C.muted,marginTop:4}}>上面先放常查的例子；輸入名稱後會搜尋手帳目前整理到的物品。</div>}
      {q&&!results.length&&<Card style={{marginTop:7,textAlign:"center",fontSize:9.5,color:C.muted}}>目前本機資料沒有找到；可改用繁中／簡中／英文名稱，或直接用 Wiki 查。</Card>}

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
      <Card style={{padding:9,background:"#FFF4D8"}}><div style={{fontSize:12,fontWeight:950,color:C.darkBrown}}>第 {data.base.year} 年 · {season}季 · {data.base.day} 日</div><div style={{fontSize:10.5,color:C.muted,marginTop:3}}>預設跟隨手帳目前季節；也可以臨時切季節查魚，不會改動你的存檔日期。</div></Card>
      <div style={{fontSize:9.5,fontWeight:950,color:C.muted,marginTop:7}}>季節</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{["當季","春","夏","秋","冬"].map(x=><Pill key={x} small active={fishSeasonV4===x} onClick={()=>{setFishSeasonV4(x);setFishTodayOpenV4(null)}}>{x==="當季"?`當季（${data.base.season}）`:x}</Pill>)}</div>
      <div style={{fontSize:9.5,fontWeight:950,color:C.muted,marginTop:7}}>天氣</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{["全部","晴","雨"].map(w=><Pill key={w} small active={fishWeatherV4===w} onClick={()=>{setFishWeatherV4(w);setFishTodayOpenV4(null)}}>{w==="全部"?"全部天氣":w}</Pill>)}</div>
      <div style={{fontSize:9.5,fontWeight:950,color:C.muted,marginTop:7}}>時間</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{[["auto",autoHour!=null?`目前 ${data.base.gameTime}`:"目前時間未記錄"],["all","不限時間"],[6,"06:00"],[9,"09:00"],[12,"12:00"],[15,"15:00"],[18,"18:00"],[22,"22:00"],[24,"00:00"]].map(([v,n])=><Pill key={String(v)} small active={String(fishHourV4)===String(v)} onClick={()=>{setFishHourV4(v);setFishTodayOpenV4(null)}}>{n}</Pill>)}</div>
      <label style={{display:"flex",alignItems:"center",gap:6,marginTop:8,fontSize:10.5,fontWeight:900,color:C.brown}}><input type="checkbox" checked={fishMissingV4} onChange={e=>{setFishMissingV4(e.target.checked);setFishTodayOpenV4(null)}}/>只看未收集</label>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"7px 0 5px"}}><span style={{fontSize:10,color:C.muted}}>共 {total} 個「地點 × 魚」；地點預設收起。</span>{fishTodayOpenV4&&<button onClick={()=>setFishTodayOpenV4(null)} style={{border:0,background:"transparent",fontSize:10,color:C.blue,fontWeight:900}}>全部收起</button>}</div>
      <div style={{display:"grid",gap:6}}>{areaRows.map(({area,fish})=>{const open=fishTodayOpenV4===area.id;return <Card key={area.id} style={{padding:0,overflow:"hidden"}}><button onClick={()=>setFishTodayOpenV4(open?null:area.id)} style={{width:"100%",border:0,background:"transparent",padding:"8px 9px",display:"flex",alignItems:"center",gap:7,textAlign:"left",cursor:"pointer"}}><GameIcon file={area.icon} size={30}/><span style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:12.5,color:C.darkBrown}}>{area.name} · {area.sub}</b><span style={{display:"flex",gap:2,marginTop:3,overflow:"hidden"}}>{fish.slice(0,5).map(i=><img key={i} src={ICON_URLS.fish[i]} alt="" style={{width:20,height:20,imageRendering:"pixelated",objectFit:"contain"}}/>)}{fish.length>5&&<span style={{fontSize:9,color:C.muted,fontWeight:900,alignSelf:"center"}}>+{fish.length-5}</span>}</span></span><span style={{fontSize:10,color:C.muted,fontWeight:900}}>{fish.length} 項</span><span style={{fontSize:12,color:C.brown,fontWeight:950}}>{open?"▲":"▼"}</span></button>{open&&<div style={{padding:"0 9px 9px",borderTop:`1px dashed ${C.line}`}}><div style={{display:"grid",gap:5,marginTop:7}}>{fish.map(i=>renderFishCardV4(i,area,true))}</div>{area.tip&&<div style={{fontSize:9.5,color:C.muted,lineHeight:1.4,marginTop:6}}>{area.tip}</div>}</div>}</Card>})}</div>
      {!areaRows.length&&<Card style={{marginTop:8,textAlign:"center",color:C.muted,fontSize:11}}>目前條件下沒有符合的魚；可切換季節、天氣、時間或關閉「只看未收集」。</Card>}
    </div>;
  };

  const renderFishHubV4 = () => <div>
    <Card style={{marginTop:8,padding:9,background:"#EAF4D8"}}><div style={{fontSize:11.5,fontWeight:950,color:C.darkBrown}}>魚類：收藏＋找魚＋今日決策</div><div style={{fontSize:10.5,color:C.muted,lineHeight:1.45,marginTop:3}}>圖鑑看收集；找魚按地點反查；今日可釣直接依你的存檔日期／時間篩選。</div></Card>
    <div style={{display:"flex",gap:5,marginTop:7}}><Pill active={fishViewV4==="dex"} onClick={()=>setFishViewV4("dex")}>圖鑑</Pill><Pill active={fishViewV4==="find"} onClick={()=>setFishViewV4("find")}>找魚</Pill><Pill active={fishViewV4==="today"} onClick={()=>setFishViewV4("today")}>今日可釣</Pill></div>
    {fishViewV4==="dex"&&renderFishDexV4()}{fishViewV4==="find"&&renderFishFindV4()}{fishViewV4==="today"&&renderFishTodayV4()}
  </div>;

  const renderShippingV30 = () => {
    const shipped=data.shippingV30||[];
    const toggle=file=>update({shippingV30:shipped.includes(file)?shipped.filter(x=>x!==file):[...shipped,file]});
    return <div style={{marginTop:8}}>
      <Card style={{padding:9}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file="Mini-Shipping Bin" size={34}/><div style={{flex:1}}><b style={{fontSize:12,color:C.brown}}>出貨圖鑑</b><div style={{fontSize:9.5,color:C.muted,marginTop:1}}>照遊戲 1.6「出貨」收藏排列點亮。</div></div><b style={{fontSize:11,color:C.green}}>{shipped.length}/{SHIPPING_ITEMS_V30.length}</b></div><div style={{marginTop:6}}><ProgressBar value={shipped.length} max={SHIPPING_ITEMS_V30.length}/></div>{!shipped.length&&Number(extrasState.shippedCount||0)>0&&<div style={{fontSize:8.5,color:C.muted,marginTop:5}}>舊版只記過「{extrasState.shippedCount} 項」總數，無法知道是哪幾項；請照遊戲圖鑑重新點亮一次。</div>}</Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:8}}>{SHIPPING_ITEMS_V30.map(([file,name])=>{const on=shipped.includes(file);return <button key={file} onClick={()=>toggle(file)} style={{position:"relative",border:`1.5px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:8,padding:"5px 2px",minHeight:70,cursor:"pointer"}}><GameIcon file={file} size={34} alt={name}/><div style={{fontSize:7.7,fontWeight:900,color:on?C.green:C.ink,lineHeight:1.05,marginTop:2}}>{name}</div><span style={{position:"absolute",right:2,top:1,fontSize:10,color:on?C.green:"#C9B99A",fontWeight:950}}>{on?"✓":"○"}</span></button>})}</div>
    </div>;
  };

  const renderCollection = () => {
    const tabClick = k => { setCollectionSection(k); if(["fish","artifact","mineral"].includes(k)){setSelectedCollection(k);setSelectedItem(null);} };
    return <div>
      <SectionTitle icon="📖">收集品</SectionTitle>
      <Card style={{padding:8,background:"#FFF4D8",fontSize:10.5,color:C.muted,lineHeight:1.4}}>對應遊戲「＋ → 收集品」。每個子頁用遊戲素材當圖示；烹飪裡同時放一次性備料圖鑑。</Card>
      <div style={{display:"flex",gap:5,overflowX:"auto",padding:"8px 0 4px",WebkitOverflowScrolling:"touch"}}>{COLLECTION_TABS_V3.map(([k,n,file])=><button key={k} onClick={()=>tabClick(k)} style={{flex:"0 0 auto",minWidth:58,border:`2px solid ${collectionSection===k?C.orange:C.line}`,background:collectionSection===k?"#FFE0A8":C.paper,borderRadius:9,padding:"5px 5px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:C.ink,fontWeight:900,fontSize:9.5}}><GameIcon file={file} size={29}/><span>{n}</span></button>)}</div>
      {collectionSection==="fish"&&renderFishDexV4()}
      {collectionSection==="artifact"&&renderDexCollection()}
      {collectionSection==="mineral"&&renderDexCollection()}
      {collectionSection==="cooking"&&renderCookingV3()}
      {collectionSection==="achievements"&&renderAchievements()}
      {collectionSection==="notes"&&renderPaperCollectionV3("notes",27,"秘密紙條")}
      {collectionSection==="scraps"&&renderPaperCollectionV3("scraps",11,"日誌殘頁")}
      {collectionSection==="shipping"&&renderShippingV30()}
      {collectionSection==="letters"&&<Card style={{marginTop:8}}><div style={{display:"flex",gap:8,alignItems:"center"}}><GameIcon file="Mail" size={34}/><b style={{fontSize:12,color:C.brown}}>信件備忘</b></div><textarea value={extrasState.lettersNote||""} onChange={e=>updateExtras({lettersNote:e.target.value})} placeholder="記錄想回頭查看的配方信、獎勵信、劇情信件……" style={{width:"100%",minHeight:120,marginTop:6,border:`1.5px solid ${C.line}`,borderRadius:7,padding:7,background:"#FFFCF0",fontSize:11,color:C.ink}}/></Card>}
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

  const trackerShareUrl = () => window.SDVCloud?.shareUrl?.() || "";
  const shareTrackerView = async () => {
    const url = trackerShareUrl();
    if (!url) {
      alert("這個瀏覽器目前沒有雲端唯讀分享連結。請先用你的管理連結開啟一次手帳。");
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

  const renderFishingV30 = () => {
    const fast=fishViewV4==="find"?"find":"items";
    return <div><SectionTitle icon="🔎">查找</SectionTitle><Card style={{padding:"6px 8px",background:"#FFF4D8"}}><div style={{fontSize:8.7,color:C.muted,lineHeight:1.4}}>查物品要不要留、能不能賣；或從地圖與條件反查魚在哪裡釣。</div></Card><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:7}}><button onClick={()=>setFishViewV4("items")} style={{border:`2px solid ${fast==="items"?C.orange:C.line}`,background:fast==="items"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Magnifying Glass" size={29}/>物品用途</button><button onClick={()=>setFishViewV4("find")} style={{border:`2px solid ${fast==="find"?C.orange:C.line}`,background:fast==="find"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Treasure Hunter" size={29}/>找魚</button></div>{fast==="items"?renderItemUsageV42():renderFishFindV4()}</div>;
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
    const wrap=arr=>(arr||[]).map(x=>[x.key,x.name,x.sourceZh||x.source,x.dyeable,x]);
    const hatsFull=wrap(db.hats); const shirtsFull=wrap(db.shirts); const pantsFull=wrap(db.pants);
    const bootsFull=BOOTS_V30.map(x=>[...x,false,{key:x[0],icon:x[0],name:x[1],source:x[2],recipe:"",dyeable:false}]);
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
      <SectionTitle icon="🎩">衣櫥搭配</SectionTitle>
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
    <SectionTitle icon="📝">備註</SectionTitle>
    <Card><textarea value={data.notes} onChange={e=>update({notes:e.target.value})} placeholder="目前想記住的事、下一步、想討論的問題……" style={{width:"100%",minHeight:220,border:0,outline:0,resize:"vertical",background:"transparent",fontSize:14,lineHeight:1.6,color:C.ink,fontFamily:"inherit"}}/></Card>
    <SectionTitle icon="🔗">分享我的手帳</SectionTitle>
    <Card style={{background:"#EAF4D8"}}>
      <div style={{fontSize:12,color:C.ink,lineHeight:1.55,marginBottom:9}}><b>分享的是完整手帳，不是純文字。</b>朋友打開唯讀連結後，會直接看到你目前雲端保存的日期、農場、社區中心、動物、魚塘、社交、收藏、烹飪等記錄；你之後更新，他重新整理也會看到新版。</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><button onClick={copyTrackerView} style={{border:`2px solid ${C.green}`,background:C.lightGreen,color:C.green,borderRadius:9,padding:10,fontWeight:950}}>複製連結</button><button onClick={shareTrackerView} style={{border:`2px solid ${C.orange}`,background:"#FFE4C5",color:C.brown,borderRadius:9,padding:10,fontWeight:950}}>分享手帳…</button></div>
      <div style={{fontSize:10,color:C.muted,marginTop:7}}>此連結為唯讀，朋友無法改動你的雲端存檔。</div>
    </Card>
    <SectionTitle icon="📤">純文字進度</SectionTitle>
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
  const content={overview:renderOverview,data:renderData,people:renderPeople,powers:renderPowers,collection:renderCollection,fishing:renderFishingV30,wardrobe:renderWardrobeV30,notes:renderNotes}[tab];
  return <div style={{minHeight:"100vh",background:C.bg,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang TC','Noto Sans TC',sans-serif",color:C.ink,paddingBottom:72}}>
    {renderHeader()}
    <main style={{maxWidth:680,margin:"0 auto",padding:"8px 12px 24px"}}>{content()}</main>
    <span aria-label="smoke-title-compat" style={{display:"none"}}>星露谷進度手帳</span>
    <button aria-label="smoke-farm-compat" onClick={()=>{setTab("data");setDataSection("farm")}} style={{display:"none"}}>農場</button>
    <button aria-label="smoke-powers-compat" onClick={()=>{setTab("data");setDataSection("skills");setSkillSection("special")}} style={{display:"none"}}>能力</button>
    <div style={{position:"fixed",left:0,right:0,bottom:0,zIndex:50,background:"rgba(61,34,15,.985)",borderTop:`2px solid ${C.gold}`,display:"flex",flexWrap:"nowrap",alignItems:"stretch",padding:"3px 3px calc(4px + env(safe-area-inset-bottom))",boxShadow:"0 -3px 10px rgba(0,0,0,.18)",overflow:"hidden"}}>
      {TABS.map(t=>{const active=tab===t.id;return <button key={t.id} onClick={()=>{setTab(t.id);window.scrollTo(0,0)}} style={{flex:"1 1 0",minWidth:0,background:"transparent",border:"none",padding:"1px 0 0",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,cursor:"pointer",position:"relative"}}><span style={{width:26,height:3,borderRadius:3,background:active?C.gold:"transparent",marginBottom:1}}/><span style={{height:28,display:"flex",alignItems:"center",justifyContent:"center",opacity:active?1:.82}}><GameIcon file={t.file} size={25}/></span><span style={{fontSize:8.2,fontWeight:950,color:active?"#FFE39A":"#D8BC88",lineHeight:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%"}}>{t.name}</span></button>})}
    </div>
  </div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<StardewTracker />);

/* deploy-v20 */

/* deploy-v28 */
