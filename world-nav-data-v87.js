/* v87 — 世界導航圖（單一來源）。
   規範：
   - 地點／物品名詞沿用 Switch 遊戲內官方簡中文本（與 switch-names-v47 同一套）。
   - summary／介面說明為繁體（app 介面語）。
   - mapKey 一律指向本地 assets 資產（local-assets-v67/v87），不再於執行期熱鏈 wiki。
   - 座標為地圖百分比，已依實際地圖渲染逐點校正（2026-08-14）。 */
(()=>{
'use strict';
const D=window.SDVWorldNavV87={version:87,root:'world',nodes:{},areaNode:{}};
D.nodes={
world:{id:'world',name:'星露谷',summary:'依遊戲實際動線點選入口進入各區域。',mapKey:'Map',root:true,portals:[
  {id:'wf',label:'煤矿森林',to:'forest',x:29,y:69},
  {id:'wb',label:'公交站',to:'bus_stop',x:43,y:48},
  {id:'wt',label:'鹈鹕镇',to:'town',x:55,y:50},
  {id:'wm',label:'山岭',to:'mountain',x:64,y:25},
  {id:'wbe',label:'海滩',to:'beach',x:69,y:82},
  {id:'ws',label:'下水道',to:'sewer',x:50,y:63,requires:'生锈的钥匙'},
  {id:'wgi',label:'姜岛',to:'ginger_island',x:90,y:90,transport:true,requires:'修复威利的旧船'}
]},

forest:{id:'forest',name:'煤矿森林',summary:'瑪妮的牧場、法師塔、旅行貨車，以及秘密森林與下水道入口。',mapKey:'CindersapForest',places:[
  {id:'ranch',label:'玛妮的牧场',worldPlaceId:'ranch',x:80,y:12},
  {id:'wizard',label:'法师塔',worldPlaceId:'wizard_tower',x:7,y:25},
  {id:'cart',label:'旅行货车',worldPlaceId:'traveling_cart',x:35,y:13},
  {id:'leah',label:'莉亚的小屋',worldPlaceId:'leah_house',x:89,y:26},
  {id:'mastery',label:'精通洞穴',x:75,y:88,requires:'五项技能全部达到 10 级',description:'1.6 精通系統入口，在下水道柵欄西側。'}],portals:[
  {id:'secret',label:'秘密森林',to:'secret_woods',x:5,y:13,requires:'钢斧劈开大原木'},
  {id:'fsewer',label:'下水道',to:'sewer',x:79,y:83,requires:'生锈的钥匙'}],spots:[
  {id:'fp',label:'池塘',fishAreaId:'forest_pond',x:34,y:30},
  {id:'fr',label:'河流',fishAreaId:'forest_river',x:55,y:61},
  {id:'ff',label:'南部瀑布',fishAreaId:'forest_falls',x:51,y:91},
  {id:'fg',label:'南部小岛',fishAreaId:'glacier',x:50,y:77}]},

secret_woods:{id:'secret_woods',name:'秘密森林',summary:'煤礦森林西北角進入的獨立小區域。',mapKey:'SecretWoods',places:[
  {id:'cannoli',label:'老坎诺利大师雕像',x:13,y:19,description:'放入寶石甜莓可獲得星之果实。'},
  {id:'hardwood',label:'硬木树桩',x:56,y:43,description:'6 個大樹樁每天重生，是穩定硬木來源。'}],spots:[
  {id:'sp',label:'池塘',fishAreaId:'secret',x:18,y:68}]},

bus_stop:{id:'bus_stop',name:'公交站',summary:'農場與鵜鶘鎮之間的交通節點；修好公交後由售票机搭車去沙漠。',mapKey:'Bus stop',places:[
  {id:'bus',label:'公交车／潘姆',x:42,y:24,npcs:['潘姆'],description:'公交修復後由潘姆駕駛前往卡利科沙漠。'},
  {id:'minecart',label:'矿车',x:13,y:11,description:'修復後可快速往返矿井、鹈鹕镇与采石场。'},
  {id:'tunnel',label:'隧道',x:3,y:52,description:'公路西端的隧道；齐先生任務的暗箱在隧道深處。'}],portals:[
  {id:'desert',label:'售票机 → 卡利科沙漠',to:'desert',x:21,y:36,transport:true,requires:'修复公交（500 木材由社區包裹或 Joja 完成）'}]},

town:{id:'town',name:'鹈鹕镇',summary:'居民、商店與城鎮設施最集中的區域。',mapKey:'Pelican Town',places:[
  {id:'cc',label:'社区中心',worldPlaceId:'community_center',x:43,y:17},
  {id:'clinic',label:'哈维的诊所',worldPlaceId:'clinic',x:30,y:44},
  {id:'pierre',label:'皮埃尔的杂货店',worldPlaceId:'pierre_store',x:39,y:44},
  {id:'saloon',label:'星之果实酒吧',worldPlaceId:'saloon',x:35,y:57},
  {id:'joja',label:'Joja超市',worldPlaceId:'joja',x:82,y:41},
  {id:'smith',label:'铁匠铺',worldPlaceId:'blacksmith',x:78,y:67},
  {id:'museum',label:'博物馆',worldPlaceId:'museum',x:83,y:72}],portals:[
  {id:'tsewer',label:'下水道',to:'sewer',x:44,y:87,requires:'生锈的钥匙'}],spots:[
  {id:'tr',label:'河流',fishAreaId:'town',x:64,y:57}]},

mountain:{id:'mountain',name:'山岭',summary:'山中湖泊、木匠的商店、矿井、冒险家公会、铁路與采石场。',mapKey:'The Mountain',places:[
  {id:'carpenter',label:'木匠的商店',worldPlaceId:'carpenter',x:12,y:55},
  {id:'guild',label:'冒险家公会',worldPlaceId:'guild',x:91,y:22},
  {id:'linus',label:'莱纳斯的帐篷',x:21,y:9,npcs:['萊納斯'],description:'莱纳斯的住處。'}],portals:[
  {id:'mines',label:'矿井',to:'mines',x:57,y:12},
  {id:'rail',label:'铁路',to:'railroad',x:16,y:10,requires:'第一年夏 3 日地震後開放'},
  {id:'quarry',label:'采石场',to:'quarry',x:74,y:58,requires:'修復采石场吊桥'}],spots:[
  {id:'lake',label:'山中湖泊',fishAreaId:'mountain',x:50,y:60}]},

mines:{id:'mines',name:'矿井',summary:'20、60、100 層各有獨立可釣水域。',mapKey:'MinesDistances',places:[
  {id:'dwarf',label:'矮人商店',x:8,y:23,npcs:['矮人'],description:'矿井入口層右側，需可與矮人溝通（集齊 4 卷矮人卷轴）。'}],spots:[
  {id:'m20',label:'20 层水域',fishAreaId:'mine20',x:17,y:58},
  {id:'m60',label:'60 层水域',fishAreaId:'mine60',x:50,y:58},
  {id:'m100',label:'100 层岩浆',fishAreaId:'mine100',x:83,y:58}]},

railroad:{id:'railroad',name:'铁路',summary:'山嶺北方的铁路與温泉區域（wiki 無全區地圖，用清單選擇）。',places:[
  {id:'spa',label:'温泉',x:22,y:65,description:'泡水可恢復體力與生命值。'},
  {id:'station',label:'铁路月台',x:50,y:28,description:'火車經過時可能掉落物品。'}],portals:[
  {id:'witch',label:'女巫沼泽',to:'witch_swamp',x:90,y:31,requires:'黑暗护身符（暗影人任務線）'},
  {id:'summit',label:'山顶',to:'summit',x:54,y:5,requires:'達成完美度後開放'}]},

summit:{id:'summit',name:'山顶',summary:'铁路北方的最終景觀區域。',mapKey:'The Summit',places:[
  {id:'view',label:'山顶',x:50,y:14,description:'達成完美度後可抵達，觸發結尾動畫。'}]},

quarry:{id:'quarry',name:'采石场',summary:'修復吊橋後開放的露天採礦區。',mapKey:'Quarry',places:[
  {id:'q',label:'采石场',worldPlaceId:'quarry',x:50,y:46}],portals:[
  {id:'qm',label:'采石场矿洞',to:'quarry_mine',x:86,y:23}]},

quarry_mine:{id:'quarry_mine',name:'采石场矿洞',summary:'采石场東北側的單層礦洞。',mapKey:'Quarry Mine Map',places:[
  {id:'scythe',label:'金色镰刀',x:35,y:6,description:'首次抵達洞底雕像可取得金色镰刀。'}]},

beach:{id:'beach',name:'海滩',summary:'鱼店、艾利欧特的小屋、潮水潭，以及威利的旧船。',mapKey:'BeachDistances',places:[
  {id:'fishshop',label:'鱼店',worldPlaceId:'fish_shop',x:29,y:57},
  {id:'elliott',label:'艾利欧特的小屋',worldPlaceId:'elliott_house',x:52,y:18},
  {id:'tide',label:'潮水潭',worldPlaceId:'tide_pools',x:84,y:39}],portals:[
  {id:'island',label:'威利的船 → 姜岛',to:'ginger_island',x:27,y:68,transport:true,requires:'修復鱼店後屋的旧船'},
  {id:'night',label:'夜市（冬 15–17）',to:'night_market',x:52,y:56,requires:'冬季 15–17 日 17:00 後'}],spots:[
  {id:'ocean',label:'海洋',fishAreaId:'beach',x:60,y:72}]},

night_market:{id:'night_market',name:'夜市',summary:'冬季 15–17 日的海灘市集；潜水艇可釣深海魚。',mapKey:'NightMarket',spots:[
  {id:'deep',label:'潜水艇（深海）',fishAreaId:'night',x:37,y:72}]},

desert:{id:'desert',name:'卡利科沙漠',summary:'搭公交抵達；绿洲、沙漠商人與骷髅洞穴。',mapKey:'DesertDistances',places:[
  {id:'oasis',label:'绿洲',worldPlaceId:'oasis',x:15,y:80},
  {id:'trader',label:'沙漠商人',worldPlaceId:'desert_trader',x:76,y:24},
  {id:'casino',label:'赌场',x:23,y:72,requires:'完成齐先生的「神秘的齐」任務'}],portals:[
  {id:'skull',label:'骷髅洞穴',to:'skull_cavern',x:16,y:10,requires:'骷髅钥匙（矿井 120 层）'}],spots:[
  {id:'dp',label:'池塘',fishAreaId:'desert',x:19,y:27}]},

skull_cavern:{id:'skull_cavern',name:'骷髅洞穴',summary:'沙漠西北角的無限層地下城。',mapKey:'Skull Cavern 1',places:[
  {id:'entry',label:'骷髅洞穴',x:43,y:18,description:'使用矿井 120 層取得的骷髅钥匙進入。'}]},

sewer:{id:'sewer',name:'下水道',summary:'鎮南與煤礦森林南方兩個入口進入同一張地圖。',mapKey:'SewerDistances',places:[
  {id:'krobus',label:'科罗布斯',x:76,y:38,npcs:['科罗布斯'],description:'科罗布斯的商店。'},
  {id:'statue',label:'不确定性雕像',x:20,y:41,description:'花 10,000g 重置職業選擇。'}],portals:[
  {id:'bug',label:'突变虫穴',to:'mutant_bug_lair',x:7,y:35,requires:'黑暗护身符（暗影人任務線）'}],spots:[
  {id:'sw',label:'下水道水域',fishAreaId:'sewer',x:52,y:74}]},

mutant_bug_lair:{id:'mutant_bug_lair',name:'突变虫穴',summary:'下水道任務線開放的小區域。',mapKey:'MutantBugLairDistances',spots:[
  {id:'bw',label:'虫穴水域',fishAreaId:'bug',x:48,y:55}]},

witch_swamp:{id:'witch_swamp',name:'女巫沼泽',summary:'從铁路東北側傳送洞穴進入。',mapKey:'SwampDistances',places:[
  {id:'hut',label:'女巫小屋',x:50,y:37,description:'黑暗祭坛與後續任務地點。'}],spots:[
  {id:'ww',label:'沼泽水域',fishAreaId:'witch',x:53,y:60}]},

ginger_island:{id:'ginger_island',name:'姜岛',summary:'從海滩搭威利的船抵達後的島嶼總覽。',mapKey:'Ginger Island Map',portals:[
  {id:'south',label:'岛屿南部／码头',to:'island_south',x:55,y:82},
  {id:'north',label:'岛屿北部',to:'island_north',x:53,y:25},
  {id:'west',label:'岛屿西部',to:'island_west',x:22,y:56},
  {id:'se',label:'岛屿东南部',to:'island_southeast',x:76,y:71}]},

island_south:{id:'island_south',name:'姜岛南部',summary:'船隻抵達的码头與度假村區域。',mapKey:'Ginger Island South',places:[
  {id:'dock',label:'码头',x:45,y:84,description:'威利的船停靠處，可返回海滩。'},
  {id:'resort',label:'度假村',x:62,y:46,requires:'20 顆金色核桃修復度假村'}],spots:[
  {id:'sf',label:'南部海域',fishAreaId:'island_s',x:55,y:80}]},

island_north:{id:'island_north',name:'姜岛北部',summary:'岛屿田野办公室、挖掘场、姜岛商人與火山入口。',mapKey:'IslandNorthDistances',places:[
  {id:'office',label:'岛屿田野办公室',worldPlaceId:'field_office',x:65,y:50},
  {id:'trader',label:'姜岛商人',worldPlaceId:'island_trader',x:33,y:57},
  {id:'dig',label:'挖掘场',x:76,y:54,description:'化石與遠古種子挖掘點。'}],portals:[
  {id:'nv',label:'火山地牢',to:'volcano',x:55,y:22}],spots:[
  {id:'nf',label:'岛北淡水',fishAreaId:'island_n',x:44,y:60}]},

island_west:{id:'island_west',name:'姜岛西部',summary:'姜岛农场、鸟儿、青蛙洞穴與齐先生的核桃房。',mapKey:'Ginger Island West',places:[
  {id:'farm',label:'姜岛农场',x:51,y:53,description:'第二座可耕作農地，含專屬小屋。'},
  {id:'birdie',label:'鸟儿',x:18,y:50,description:'海盗的妻子任務線起點。'},
  {id:'qi',label:'齐先生的核桃房',worldPlaceId:'qi_room',x:16,y:22},
  {id:'frog',label:'青蛙洞穴',x:75,y:42,description:'雨天可與變異青蛙互動。'}],spots:[
  {id:'wf',label:'岛西淡水',fishAreaId:'island_w_fresh',x:41,y:47},
  {id:'wo',label:'岛西海洋',fishAreaId:'island_w_ocean',x:17,y:73}]},

island_southeast:{id:'island_southeast',name:'姜岛东南部',summary:'度假村開放後可進入；由此前往海盗湾。',mapKey:'IslandSouthEastDistances',portals:[
  {id:'pirate',label:'海盗湾',to:'pirate_cove',x:85,y:30}],spots:[
  {id:'sef',label:'东南海域',fishAreaId:'island_s',x:50,y:60}]},

pirate_cove:{id:'pirate_cove',name:'海盗湾',summary:'姜岛東南側的隱藏海灣，週間晚上有海盜聚會。',mapKey:'Pirate Cove',spots:[
  {id:'pf',label:'海盗湾水域',fishAreaId:'pirate',x:50,y:68}]},

volcano:{id:'volcano',name:'火山地牢',summary:'姜岛北部的 10 層火山地牢。',mapKey:'Ginger Island Volcano',places:[
  {id:'vd',label:'火山矮人商店',x:35,y:30,description:'第 5 層的矮人商店。'}],portals:[
  {id:'cal',label:'火山口／锻造',to:'caldera',x:50,y:10,requires:'抵達火山第 10 層'}]},

caldera:{id:'caldera',name:'火山口',summary:'火山第 10 層，锻造台旁的岩浆水域。',mapKey:'CalderaDistances',spots:[
  {id:'cf',label:'岩浆水域',fishAreaId:'caldera',x:52,y:55}]}
};
D.areaNode={town:'town',forest_river:'forest',forest_pond:'forest',forest_falls:'forest',glacier:'forest',mountain:'mountain',beach:'beach',secret:'secret_woods',desert:'desert',sewer:'sewer',bug:'mutant_bug_lair',mine20:'mines',mine60:'mines',mine100:'mines',witch:'witch_swamp',night:'night_market',island_n:'island_north',island_w_fresh:'island_west',island_w_ocean:'island_west',island_s:'island_south',pirate:'pirate_cove',caldera:'caldera'};
})();
