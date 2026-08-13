/* Manual committed snapshot for the thin World data layer.
   Names follow the current Chinese game/wiki terminology used by the project; aliases keep Traditional/English lookup compatibility.
   Shop hours are fallback display values only: when social-data-v50 has a shop record for the owner, the UI reuses that shared record instead.
   Source review: official Chinese Stardew Valley Wiki location/shop pages, 2026-08-13. See docs/DATA_SOURCES.md. */
window.SDVWorldV70={
  version:70,
  sourceReviewedAt:"2026-08-13",
  people:{
    robin:{id:"robin",name:"罗宾",aliases:["羅賓","Robin"],icon:"Robin Icon",socialKeys:["羅賓","罗宾"]},
    clint:{id:"clint",name:"克林特",aliases:["Clint"],icon:"Clint Icon",socialKeys:["克林特"]},
    gus:{id:"gus",name:"格斯",aliases:["Gus"],icon:"Gus Icon",socialKeys:["格斯"]},
    harvey:{id:"harvey",name:"哈维",aliases:["哈維","Harvey"],icon:"Harvey Icon",socialKeys:["哈維","哈维"]},
    pierre:{id:"pierre",name:"皮埃尔",aliases:["皮埃爾","Pierre"],icon:"Pierre Icon",socialKeys:["皮埃爾","皮埃尔"]},
    marnie:{id:"marnie",name:"玛妮",aliases:["瑪妮","Marnie"],icon:"Marnie Icon",socialKeys:["瑪妮","玛妮"]},
    willy:{id:"willy",name:"威利",aliases:["Willy"],icon:"Willy Icon",socialKeys:["威利"]},
    wizard:{id:"wizard",name:"法师",aliases:["法師","Wizard","Rasmodius"],icon:"Wizard Icon",socialKeys:["法師","法师"]},
    sandy:{id:"sandy",name:"桑迪",aliases:["Sandy"],icon:"Sandy Icon",socialKeys:["桑迪"]},
    krobus:{id:"krobus",name:"科罗布斯",aliases:["克羅巴斯","Krobus"],icon:"Krobus Icon",socialKeys:["克羅巴斯","科罗布斯"]},
    marlon:{id:"marlon",name:"马龙",aliases:["馬龍","Marlon"],icon:"Marlon Icon",socialKeys:["馬龍","马龙"]},
    gunther:{id:"gunther",name:"冈瑟",aliases:["岡瑟","Gunther"],icon:"Gunther Icon",socialKeys:["岡瑟","冈瑟"]},
    lewis:{id:"lewis",name:"刘易斯",aliases:["劉易斯","Lewis"],icon:"Lewis Icon",socialKeys:["劉易斯","刘易斯"]},
    elliott:{id:"elliott",name:"艾利欧特",aliases:["艾利歐特","Elliott"],icon:"Elliott Icon",socialKeys:["艾利歐特","艾利欧特"]},
    leah:{id:"leah",name:"莉亚",aliases:["莉亞","Leah"],icon:"Leah Icon",socialKeys:["莉亞","莉亚"]},
    linus:{id:"linus",name:"莱纳斯",aliases:["萊納斯","Linus"],icon:"Linus Icon",socialKeys:["萊納斯","莱纳斯"]},
    qi:{id:"qi",name:"齐先生",aliases:["齊先生","Mr. Qi"],icon:"Mr. Qi Icon",socialKeys:["齊先生","齐先生"]},
    dwarf:{id:"dwarf",name:"矮人",aliases:["Dwarf"],icon:"Dwarf Icon",socialKeys:["矮人"]}
  },
  regions:[
    {id:"town",name:"鹈鹕镇",aliases:["鵜鶘鎮","Pelican Town"],icon:"Map",summary:"居民、商店与城镇设施最集中的区域。"},
    {id:"mountain",name:"深山",aliases:["山区","山區","Mountain"],icon:"MinesEntrance",summary:"木匠、矿井、探险家公会与铁路所在区域。"},
    {id:"forest",name:"煤矿森林",aliases:["煤礦森林","Cindersap Forest"],icon:"Map",summary:"玛妮的牧场、法师塔、旅行货车与秘密森林。"},
    {id:"beach",name:"海滩",aliases:["海灘","Beach"],icon:"Warp Totem Beach",summary:"鱼店、艾利欧特小屋与潮汐池。"},
    {id:"desert",name:"卡利科沙漠",aliases:["沙漠","Calico Desert"],icon:"Warp Totem Desert",summary:"绿洲、沙漠商人、赌场与骷髅洞穴。"},
    {id:"sewer",name:"下水道",aliases:["Sewer"],icon:"Rusty Key",summary:"科罗布斯与突变虫穴相关区域。"},
    {id:"island",name:"姜岛",aliases:["薑島","Ginger Island"],icon:"Ginger Island Map",summary:"火山、姜岛商人、岛屿办事处与齐先生的核桃房。"}
  ],
  places:[
    {id:"pierre_store",regionId:"town",name:"皮埃尔的杂货店",aliases:["皮埃爾的雜貨店","Pierre's General Store"],icon:"Parsnip Seeds",peopleIds:["pierre"],ownerId:"pierre",hours:"09:00–17:00；社区中心重建前周三不营业",services:["购买种子与基础农用品","背包升级","部分配方与季节商品"]},
    {id:"saloon",regionId:"town",name:"星之果实酒吧",aliases:["星之果實酒吧","Stardrop Saloon"],icon:"Beer",peopleIds:["gus"],ownerId:"gus",hours:"12:00–00:00；一般每天营业",services:["购买料理与饮品","每日特色菜","部分料理配方"]},
    {id:"blacksmith",regionId:"town",name:"铁匠铺",aliases:["鐵匠鋪","Blacksmith"],icon:"Anvil",peopleIds:["clint"],ownerId:"clint",hours:"09:00–16:00；社区中心重建后周五休息",services:["工具升级","敲开晶球","购买矿石与煤"]},
    {id:"clinic",regionId:"town",name:"哈维的诊所",aliases:["哈維的診所","Harvey's Clinic"],icon:"Energy Tonic",peopleIds:["harvey"],ownerId:"harvey",hours:"09:00–15:00；能否购物还要看柜台人员",services:["购买医疗用品","村民体检地点"]},
    {id:"museum",regionId:"town",name:"博物馆",aliases:["博物館","Museum","Library"],icon:"Dwarf Scroll I",peopleIds:["gunther"],ownerId:"gunther",hours:"08:00–18:00",services:["捐赠古物与矿物","领取捐赠奖励","阅读图书馆书籍"]},
    {id:"community_center",regionId:"town",name:"社区中心",aliases:["社區中心","Community Center"],icon:"Golden Scroll",peopleIds:[],hours:"主要用于收集包与城镇修复",services:["查看／完成收集包","完成房间后解锁城镇设施"]},
    {id:"joja",regionId:"town",name:"Joja超市",aliases:["JojaMart","Joja 超市"],icon:"Joja Cola",peopleIds:[],hours:"09:00–23:00；社区中心路线完成后会关闭",services:["购买一般商品","Joja 会员路线入口"]},
    {id:"carpenter",regionId:"mountain",name:"木匠的商店",aliases:["木匠商店","Carpenter's Shop"],icon:"Silo",peopleIds:["robin"],ownerId:"robin",hours:"09:00–17:00；周二休息，周五提早结束柜台服务",services:["建造／升级／移动农场建筑","农舍升级","购买木材与家具相关商品"]},
    {id:"mines",regionId:"mountain",name:"矿井",aliases:["礦井","The Mines"],icon:"MinesEntrance",peopleIds:["dwarf"],hours:"开放后可随时进入",requires:"第一年春季初期剧情后开放",services:["采矿与战斗","固定宝箱层","矿井内矮人商店"],fishingAreaId:"mine20"},
    {id:"guild",regionId:"mountain",name:"探险家公会",aliases:["探險家公會","Adventurer's Guild"],icon:"Galaxy Sword",peopleIds:["marlon"],ownerId:"marlon",hours:"14:00–02:00",requires:"完成初期矿井讨伐要求后加入",services:["购买武器／鞋／戒指","怪物讨伐目标与奖励","找回昏迷时丢失物品"]},
    {id:"railroad",regionId:"mountain",name:"铁路",aliases:["鐵路","Railroad"],icon:"Railroad",peopleIds:[],requires:"第一年夏季 3 日地震后开放",services:["温泉入口","火车经过事件","女巫相关后期入口"]},
    {id:"quarry",regionId:"mountain",name:"采石场",aliases:["採石場","Quarry"],icon:"Stone",peopleIds:[],requires:"修复采石场桥后进入",services:["周期生成石头、矿点与晶球","通往采石场矿洞"]},
    {id:"ranch",regionId:"forest",name:"玛妮的牧场",aliases:["瑪妮的牧場","Marnie's Ranch"],icon:"Cow",peopleIds:["marnie"],ownerId:"marnie",hours:"09:00–16:00；周一、周二不提供商店服务",services:["购买农场动物","购买干草与动物照护用品"]},
    {id:"wizard_tower",regionId:"forest",name:"法师塔",aliases:["法師塔","Wizard's Tower"],icon:"Magic Ink",peopleIds:["wizard"],ownerId:"wizard",hours:"06:00–23:00",services:["与法师互动","后期购买魔法建筑","幻象神龛相关功能"]},
    {id:"traveling_cart",regionId:"forest",name:"旅行货车",aliases:["旅行貨車","Traveling Cart"],icon:"Traveling Cart",peopleIds:[],hours:"周五、周日 06:00–20:00",services:["随机商品","可能提前取得非当季物品"]},
    {id:"leah_house",regionId:"forest",name:"莉亚的农舍",aliases:["莉亞的農舍","Leah's Cottage"],icon:"Leah Icon",peopleIds:["leah"],services:["莉亚的住处"]},
    {id:"secret_woods",regionId:"forest",name:"秘密森林",aliases:["Secret Woods"],icon:"Hardwood",peopleIds:[],requires:"需要能砍断入口硬木的斧头等级",services:["每日硬木来源","秘密森林水池钓鱼","雕像与季节采集"],fishingAreaId:"secret"},
    {id:"fish_shop",regionId:"beach",name:"鱼店",aliases:["魚店","Fish Shop"],icon:"Training Rod",peopleIds:["willy"],ownerId:"willy",hours:"09:00–17:00；修好旧船后改为 08:00 开门；部分周六不营业",services:["购买鱼竿、鱼饵与钓鱼用品","出售鱼获","旧船／姜岛交通"],fishingAreaId:"beach"},
    {id:"elliott_house",regionId:"beach",name:"艾利欧特小屋",aliases:["艾利歐特小屋","Elliott's Cabin"],icon:"Elliott Icon",peopleIds:["elliott"],services:["艾利欧特的住处"]},
    {id:"tide_pools",regionId:"beach",name:"潮汐池",aliases:["Tide Pools"],icon:"Coral",peopleIds:[],requires:"修好海滩东侧木桥后进入",services:["拾取珊瑚、海胆等海滩采集物"],fishingAreaId:"beach"},
    {id:"oasis",regionId:"desert",name:"绿洲",aliases:["綠洲","Oasis"],icon:"Cactus Seeds",peopleIds:["sandy"],ownerId:"sandy",hours:"09:00–23:50",requires:"修复巴士或使用沙漠传送方式抵达",services:["购买沙漠种子与轮换商品","赌场入口位于店内后方"]},
    {id:"desert_trader",regionId:"desert",name:"沙漠商人",aliases:["Desert Trader"],icon:"Omni Geode",peopleIds:[],hours:"一般 06:00–02:00",services:["用物品交换商品","每日／每周轮换交换"]},
    {id:"casino",regionId:"desert",name:"赌场",aliases:["賭場","Casino"],icon:"Club Card",peopleIds:["qi"],hours:"随绿洲开放时间进入",requires:"完成“神秘的齐”并取得会员卡",services:["齐币小游戏与奖品兑换"]},
    {id:"skull_cavern",regionId:"desert",name:"骷髅洞穴",aliases:["骷髏洞穴","Skull Cavern"],icon:"Skull Key",peopleIds:[],hours:"抵达沙漠后可随时进入",requires:"取得头骨钥匙",services:["无限层洞穴","铱矿等后期资源"],fishingAreaId:"desert"},
    {id:"sewer_main",regionId:"sewer",name:"下水道",aliases:["The Sewers"],icon:"Rusty Key",peopleIds:["krobus"],ownerId:"krobus",hours:"取得钥匙后可进入",requires:"取得生锈的钥匙",services:["科罗布斯商店","通往突变虫穴的后期入口"],fishingAreaId:"sewer"},
    {id:"bug_lair",regionId:"sewer",name:"突变虫穴",aliases:["突變蟲穴","Mutant Bug Lair"],icon:"Slimejack",peopleIds:[],requires:"法师后期任务线开启",services:["特殊怪物与史莱姆鱼钓点"],fishingAreaId:"bug"},
    {id:"island_trader",regionId:"island",name:"姜岛商人",aliases:["薑島商人","Island Trader"],icon:"Golden Walnut",peopleIds:[],requires:"解锁姜岛相关设施后开放",services:["以岛上物品交换商品","部分商品按星期轮换"]},
    {id:"volcano",regionId:"island",name:"火山地牢",aliases:["Volcano Dungeon"],icon:"Cinder Shard",peopleIds:[],services:["战斗与探索","锻造台与火山商店","火山口钓鱼"],fishingAreaId:"caldera"},
    {id:"field_office",regionId:"island",name:"岛屿办事处",aliases:["島嶼辦事處","Island Field Office"],icon:"Fossilized Skull",peopleIds:[],requires:"解锁姜岛北部后逐步开放",services:["岛屿化石调查与奖励"]},
    {id:"qi_room",regionId:"island",name:"齐先生的核桃房",aliases:["齊先生的核桃房","Qi's Walnut Room"],icon:"Qi Gem",peopleIds:["qi"],hours:"一直开放",requires:"累计取得 100 个金色核桃",services:["齐先生特别任务","齐钻商店","完美度追踪"]}
  ],
  weather:[
    {id:"sunny",name:"晴天",icon:"☀️",summary:"一般天气；今天助手的晴天分支会使用这类条件。"},
    {id:"rain",name:"雨天",icon:"🌧️",summary:"会改变部分鱼类、NPC 行程与商店／活动条件。"},
    {id:"storm",name:"雷雨",icon:"⛈️",summary:"属于特殊雨天情境；闪电与避雷针相关机制会参与。"},
    {id:"green_rain",name:"绿雨",aliases:["綠雨","Green Rain"],icon:"🌿",summary:"1.6 的夏季特殊天气；世界外观与大量 NPC 行为会改变。"},
    {id:"snow",name:"雪",icon:"❄️",summary:"冬季天气；后续 NPC 行程层会把它作为独立条件。"}
  ]
};
