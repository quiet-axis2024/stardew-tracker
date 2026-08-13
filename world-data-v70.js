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
    {id:"town",name:"鹈鹕镇",aliases:["鵜鶘鎮","Pelican Town"],icon:"Map",summary:"居民、商店與城鎮設施最集中的區域。"},
    {id:"mountain",name:"深山",aliases:["山区","山區","Mountain"],icon:"MinesEntrance",summary:"木匠、矿井、探险家公会與铁路所在區域。"},
    {id:"forest",name:"煤矿森林",aliases:["煤礦森林","Cindersap Forest"],icon:"Map",summary:"玛妮的牧场、法师塔、旅行货车與秘密森林。"},
    {id:"beach",name:"海滩",aliases:["海灘","Beach"],icon:"Warp Totem Beach",summary:"鱼店、艾利欧特小屋與潮汐池。"},
    {id:"desert",name:"卡利科沙漠",aliases:["沙漠","Calico Desert"],icon:"Warp Totem Desert",summary:"绿洲、沙漠商人、赌场與骷髅洞穴。"},
    {id:"sewer",name:"下水道",aliases:["Sewer"],icon:"Rusty Key",summary:"科罗布斯與突变虫穴相關區域。"},
    {id:"island",name:"姜岛",aliases:["薑島","Ginger Island"],icon:"Ginger Island Map",summary:"火山、姜岛商人、岛屿办事处與齐先生的核桃房。"}
  ],
  places:[
    {id:"pierre_store",regionId:"town",name:"皮埃尔的杂货店",aliases:["皮埃爾的雜貨店","Pierre's General Store"],icon:"Parsnip Seeds",peopleIds:["pierre"],ownerId:"pierre",hours:"09:00–17:00；社区中心重建前週三不營業",services:["購買種子與基礎農用品","背包升級","部分配方與季節商品"]},
    {id:"saloon",regionId:"town",name:"星之果实酒吧",aliases:["星之果實酒吧","Stardrop Saloon"],icon:"Beer",peopleIds:["gus"],ownerId:"gus",hours:"12:00–00:00；一般每天營業",services:["購買料理與飲品","每日特色菜","部分料理配方"]},
    {id:"blacksmith",regionId:"town",name:"铁匠铺",aliases:["鐵匠鋪","Blacksmith"],icon:"Anvil",peopleIds:["clint"],ownerId:"clint",hours:"09:00–16:00；社区中心重建後週五休息",services:["工具升級","敲開晶球","購買礦石與煤"]},
    {id:"clinic",regionId:"town",name:"哈维的诊所",aliases:["哈維的診所","Harvey's Clinic"],icon:"Energy Tonic",peopleIds:["harvey"],ownerId:"harvey",hours:"09:00–15:00；能否購物還要看櫃檯人員",services:["購買醫療用品","村民體檢地點"]},
    {id:"museum",regionId:"town",name:"博物馆",aliases:["博物館","Museum","Library"],icon:"Dwarf Scroll I",peopleIds:["gunther"],ownerId:"gunther",hours:"08:00–18:00",services:["捐贈古物與礦物","領取捐贈獎勵","閱讀圖書館書籍"]},
    {id:"community_center",regionId:"town",name:"社区中心",aliases:["社區中心","Community Center"],icon:"Golden Scroll",peopleIds:[],hours:"主要用於收集包與城鎮修復",services:["查看／完成收集包","完成房間後解鎖城鎮設施"]},
    {id:"joja",regionId:"town",name:"Joja超市",aliases:["JojaMart","Joja 超市"],icon:"Joja Cola",peopleIds:[],hours:"09:00–23:00；社区中心路線完成後會關閉",services:["購買一般商品","Joja 會員路線入口"]},
    {id:"carpenter",regionId:"mountain",name:"木匠的商店",aliases:["木匠商店","Carpenter's Shop"],icon:"Silo",peopleIds:["robin"],ownerId:"robin",hours:"09:00–17:00；週二休息，週五提早結束櫃檯服務",services:["建造／升級／移動農場建築","農舍升級","購買木材與家具相關商品"]},
    {id:"mines",regionId:"mountain",name:"矿井",aliases:["礦井","The Mines"],icon:"MinesEntrance",peopleIds:["dwarf"],hours:"開放後可隨時進入",requires:"第一年春季初期劇情後開放",services:["採礦與戰鬥","固定寶箱層","矿井內矮人商店"],fishingAreaId:"mine20"},
    {id:"guild",regionId:"mountain",name:"探险家公会",aliases:["探險家公會","Adventurer's Guild"],icon:"Galaxy Sword",peopleIds:["marlon"],ownerId:"marlon",hours:"14:00–02:00",requires:"完成初期矿井討伐要求後加入",services:["購買武器／鞋／戒指","怪物討伐目標與獎勵","找回昏迷時遺失物品"]},
    {id:"railroad",regionId:"mountain",name:"铁路",aliases:["鐵路","Railroad"],icon:"Railroad",peopleIds:[],requires:"第一年夏季 3 日地震後開放",services:["溫泉入口","火車經過事件","女巫相關後期入口"]},
    {id:"quarry",regionId:"mountain",name:"采石场",aliases:["採石場","Quarry"],icon:"Stone",peopleIds:[],requires:"修復采石场橋後進入",services:["週期生成石頭、礦點與晶球","通往采石场礦洞"]},
    {id:"ranch",regionId:"forest",name:"玛妮的牧场",aliases:["瑪妮的牧場","Marnie's Ranch"],icon:"Cow",peopleIds:["marnie"],ownerId:"marnie",hours:"09:00–16:00；週一、週二不提供商店服務",services:["購買農場動物","購買乾草與動物照護用品"]},
    {id:"wizard_tower",regionId:"forest",name:"法师塔",aliases:["法師塔","Wizard's Tower"],icon:"Magic Ink",peopleIds:["wizard"],ownerId:"wizard",hours:"06:00–23:00",services:["與法师互動","後期購買魔法建築","幻象神龛相關功能"]},
    {id:"traveling_cart",regionId:"forest",name:"旅行货车",aliases:["旅行貨車","Traveling Cart"],icon:"Traveling Cart",peopleIds:[],hours:"週五、週日 06:00–20:00",services:["隨機商品","可能提前取得非當季物品"]},
    {id:"leah_house",regionId:"forest",name:"莉亚的农舍",aliases:["莉亞的農舍","Leah's Cottage"],icon:"Leah Icon",peopleIds:["leah"],services:["莉亚的住處"]},
    {id:"secret_woods",regionId:"forest",name:"秘密森林",aliases:["Secret Woods"],icon:"Hardwood",peopleIds:[],requires:"需要能砍斷入口硬木的斧頭等級",services:["每日硬木來源","秘密森林水池釣魚","雕像與季節採集"],fishingAreaId:"secret"},
    {id:"fish_shop",regionId:"beach",name:"鱼店",aliases:["魚店","Fish Shop"],icon:"Training Rod",peopleIds:["willy"],ownerId:"willy",hours:"09:00–17:00；修好舊船後改為 08:00 開門；部分週六不營業",services:["購買魚竿、魚餌與釣魚用品","出售魚獲","舊船／姜岛交通"],fishingAreaId:"beach"},
    {id:"elliott_house",regionId:"beach",name:"艾利欧特小屋",aliases:["艾利歐特小屋","Elliott's Cabin"],icon:"Elliott Icon",peopleIds:["elliott"],services:["艾利欧特的住處"]},
    {id:"tide_pools",regionId:"beach",name:"潮汐池",aliases:["Tide Pools"],icon:"Coral",peopleIds:[],requires:"修好海滩東側木橋後進入",services:["拾取珊瑚、海膽等海滩採集物"],fishingAreaId:"beach"},
    {id:"oasis",regionId:"desert",name:"绿洲",aliases:["綠洲","Oasis"],icon:"Cactus Seeds",peopleIds:["sandy"],ownerId:"sandy",hours:"09:00–23:50",requires:"修復巴士或使用沙漠傳送方式抵達",services:["購買沙漠種子與輪換商品","赌场入口位於店內後方"]},
    {id:"desert_trader",regionId:"desert",name:"沙漠商人",aliases:["Desert Trader"],icon:"Omni Geode",peopleIds:[],hours:"一般 06:00–02:00",services:["用物品交換商品","每日／每週輪換交換"]},
    {id:"casino",regionId:"desert",name:"赌场",aliases:["賭場","Casino"],icon:"Club Card",peopleIds:["qi"],hours:"隨绿洲開放時間進入",requires:"完成「神秘的齐」並取得会员卡",services:["齐币小遊戲與獎品兌換"]},
    {id:"skull_cavern",regionId:"desert",name:"骷髅洞穴",aliases:["骷髏洞穴","Skull Cavern"],icon:"Skull Key",peopleIds:[],hours:"抵達沙漠後可隨時進入",requires:"取得头骨钥匙",services:["無限層洞穴","銥礦等後期資源"],fishingAreaId:"desert"},
    {id:"sewer_main",regionId:"sewer",name:"下水道",aliases:["The Sewers"],icon:"Rusty Key",peopleIds:["krobus"],ownerId:"krobus",hours:"取得鑰匙後可進入",requires:"取得生锈的钥匙",services:["科罗布斯商店","通往突变虫穴的後期入口"],fishingAreaId:"sewer"},
    {id:"bug_lair",regionId:"sewer",name:"突变虫穴",aliases:["突變蟲穴","Mutant Bug Lair"],icon:"Slimejack",peopleIds:[],requires:"法师後期任務線開啟",services:["特殊怪物與史莱姆鱼釣點"],fishingAreaId:"bug"},
    {id:"island_trader",regionId:"island",name:"姜岛商人",aliases:["薑島商人","Island Trader"],icon:"Golden Walnut",peopleIds:[],requires:"解鎖姜岛相關設施後開放",services:["以島上物品交換商品","部分商品按星期輪換"]},
    {id:"volcano",regionId:"island",name:"火山地牢",aliases:["Volcano Dungeon"],icon:"Cinder Shard",peopleIds:[],services:["戰鬥與探索","鍛造台與火山商店","火山口釣魚"],fishingAreaId:"caldera"},
    {id:"field_office",regionId:"island",name:"岛屿办事处",aliases:["島嶼辦事處","Island Field Office"],icon:"Fossilized Skull",peopleIds:[],requires:"解鎖姜岛北部後逐步開放",services:["島嶼化石調查與獎勵"]},
    {id:"qi_room",regionId:"island",name:"齐先生的核桃房",aliases:["齊先生的核桃房","Qi's Walnut Room"],icon:"Qi Gem",peopleIds:["qi"],hours:"一直開放",requires:"累計取得 100 個金色核桃",services:["齐先生特別任務","齐鑽商店","完美度追蹤"]}
  ],
  weather:[
    {id:"sunny",name:"晴天",icon:"☀️",summary:"一般天氣；今天助手的晴天分支會使用這類條件。"},
    {id:"rain",name:"雨天",icon:"🌧️",summary:"會改變部分魚類、NPC 行程與商店／活動條件。"},
    {id:"storm",name:"雷雨",icon:"⛈️",summary:"屬於特殊雨天情境；閃電與避雷針相關機制會參與。"},
    {id:"green_rain",name:"绿雨",aliases:["綠雨","Green Rain"],icon:"🌿",summary:"1.6 的夏季特殊天氣；世界外觀與大量 NPC 行為會改變。"},
    {id:"snow",name:"雪",icon:"❄️",summary:"冬季天氣；後續 NPC 行程層會把它作為獨立條件。"}
  ]
};
