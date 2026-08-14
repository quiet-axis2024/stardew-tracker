/* v81 route graph: every map owns only what is actually reachable on that map. */
(()=>{
const W=(f,e='png')=>`https://stardewvalleywiki.com/Special:Redirect/file/${encodeURIComponent(f+'.'+e)}`;
const D=window.SDVWorldNavV81Data={version:81,root:'world',nodes:{},fishAreas:{}};
D.nodes={
world:{id:'world',name:'世界大地图',summary:'按游戏实际行动路线进入区域。',mapLocal:'Map',root:true,portals:[
{id:'wf',label:'煤矿森林',to:'forest',x:29,y:69},{id:'wb',label:'公交站',to:'bus_stop',x:43,y:48},{id:'wt',label:'鹈鹕镇',to:'town',x:55,y:50},{id:'wm',label:'郊外／深山',to:'mountain',x:66,y:29},{id:'wbe',label:'海滩',to:'beach',x:69,y:82},{id:'ws',label:'下水道',to:'sewer',x:43,y:75,requires:'取得生锈的钥匙'}]},
forest:{id:'forest',name:'煤矿森林',summary:'玛妮的牧场、法师塔、旅行货车，以及秘密森林和下水道入口。',map:W('CindersapForest'),places:[
{id:'ranch',label:'玛妮的牧场',worldPlaceId:'ranch',x:80,y:12},{id:'wizard',label:'法师塔',worldPlaceId:'wizard_tower',x:7,y:25},{id:'cart',label:'旅行货车',worldPlaceId:'traveling_cart',x:43,y:9},{id:'leah',label:'莉亚的农舍',worldPlaceId:'leah_house',x:89,y:26},{id:'mastery',label:'精通山洞',x:76,y:86,requires:'五项技能都达到 10 级',description:'1.6 精通系统入口。'}],portals:[
{id:'secret',label:'秘密森林入口',to:'secret_woods',x:5,y:13,requires:'钢斧或更高等级清除大圆木'},{id:'fsewer',label:'下水道入口',to:'sewer',x:73,y:94,requires:'生锈的钥匙'}],spots:[
{id:'fp',label:'池塘',fishAreaId:'forest_pond',x:34,y:30},{id:'fr',label:'河流',fishAreaId:'forest_river',x:55,y:61},{id:'ff',label:'南部瀑布',fishAreaId:'forest_falls',x:51,y:91},{id:'fg',label:'南部小岛',fishAreaId:'glacier',x:44,y:71}]},
secret_woods:{id:'secret_woods',name:'秘密森林',summary:'煤矿森林西北角进入的独立小区域。',map:W('SecretWoods'),places:[
{id:'cannoli',label:'老坎诺利大师',x:13,y:19,description:'给雕像宝石甜莓可获得星之果实。'},{id:'hardwood',label:'硬木树桩',x:56,y:43,description:'6 个大树桩每天重生。'}],spots:[{id:'sp',label:'秘密森林池塘',fishAreaId:'secret',x:18,y:68}]},
bus_stop:{id:'bus_stop',name:'公交站',summary:'农场与鹈鹕镇之间的交通节点；修复公交后从这里去沙漠。',map:W('Bus stop','jpg'),places:[
{id:'bus',label:'公交车／潘姆',x:51,y:55,description:'公交修复后由潘姆驾驶前往沙漠。'},{id:'minecart',label:'矿车',x:17,y:19,description:'修复后可快速前往矿井、镇上与采石场。'}],portals:[
{id:'desert',label:'乘公交前往沙漠',to:'desert',x:55,y:61,transport:true,requires:'修复公交并购票'},{id:'tunnel',label:'隧道',to:'tunnel',x:4,y:56}]},
tunnel:{id:'tunnel',name:'隧道',summary:'公交站道路向西进入的隧道。',map:W('Bus Stop Black Line Door','jpg'),places:[{id:'box',label:'隧道暗箱',x:78,y:48,description:'齐先生任务线相关地点。'}]},
town:{id:'town',name:'鹈鹕镇',summary:'居民、商店与城镇设施最集中的区域。',map:W('Pelican Town'),places:[
{id:'cc',label:'社区中心',worldPlaceId:'community_center',x:26,y:18},{id:'clinic',label:'哈维的诊所',worldPlaceId:'clinic',x:30,y:44},{id:'pierre',label:'皮埃尔的杂货店',worldPlaceId:'pierre_store',x:39,y:44},{id:'saloon',label:'星之果实酒吧',worldPlaceId:'saloon',x:35,y:57},{id:'joja',label:'Joja超市',worldPlaceId:'joja',x:82,y:41},{id:'smith',label:'铁匠铺',worldPlaceId:'blacksmith',x:75,y:65},{id:'museum',label:'博物馆',worldPlaceId:'museum',x:83,y:72}],portals:[
{id:'tsewer',label:'下水道入口',to:'sewer',x:42,y:82,requires:'生锈的钥匙'}],spots:[{id:'tr',label:'镇上河流',fishAreaId:'town',x:64,y:57}]},
mountain:{id:'mountain',name:'郊外／深山',summary:'山湖、木匠、矿井、公会、铁路与采石场。',map:W('The Mountain'),places:[
{id:'carpenter',label:'木匠的商店',worldPlaceId:'carpenter',x:14,y:58},{id:'guild',label:'探险家公会',worldPlaceId:'guild',x:70,y:25},{id:'linus',label:'莱纳斯帐篷',x:50,y:12,description:'莱纳斯的住处。'}],portals:[
{id:'mines',label:'矿井入口',to:'mines',x:61,y:21},{id:'rail',label:'铁路入口',to:'railroad',x:16,y:16,requires:'第一年夏 3 日地震后开放'},{id:'quarry',label:'采石场',to:'quarry',x:90,y:40,requires:'修复采石场桥'}],spots:[{id:'lake',label:'山湖',fishAreaId:'mountain',x:54,y:58}]},
mines:{id:'mines',name:'矿井',summary:'20、60、100 层有独立可钓水域。',map:W('MinesDistances'),places:[{id:'dwarf',label:'矮人商店',x:8,y:23,description:'矿井入口层右侧。'}],spots:[
{id:'m20',label:'20 层水域',fishAreaId:'mine20',x:17,y:58},{id:'m60',label:'60 层水域',fishAreaId:'mine60',x:50,y:58},{id:'m100',label:'100 层岩浆池',fishAreaId:'mine100',x:83,y:58}]},
railroad:{id:'railroad',name:'铁路',summary:'深山北方的铁路与温泉区域。',map:W('Railroad'),places:[
{id:'spa',label:'温泉',x:22,y:65,description:'可恢复体力与生命值。'},{id:'station',label:'铁路',x:50,y:28,description:'火车经过时会掉落物品。'}],portals:[
{id:'witch',label:'女巫沼泽入口',to:'witch_swamp',x:90,y:31,requires:'暗黑护身符任务线'},{id:'summit',label:'山顶入口',to:'summit',x:54,y:5,requires:'达到完美度后开放'}]},
summit:{id:'summit',name:'山顶',summary:'铁路北方的最终区域。',map:W('Summit'),places:[{id:'view',label:'山顶',x:50,y:50,description:'达到完美度后可抵达。'}]},
quarry:{id:'quarry',name:'采石场',summary:'修复工艺室桥梁后开放的采矿区域。',map:W('Quarry'),places:[{id:'q',label:'采石场',worldPlaceId:'quarry',x:50,y:46}],portals:[{id:'qm',label:'采石场矿洞',to:'quarry_mine',x:86,y:23}]},
quarry_mine:{id:'quarry_mine',name:'采石场矿洞',summary:'采石场东北侧的单层矿洞。',map:W('Quarry Mine Map'),places:[{id:'scythe',label:'金色镰刀雕像',x:82,y:18,description:'首次抵达终点可取得金色镰刀。'}]},
beach:{id:'beach',name:'海滩',summary:'鱼店、艾利欧特小屋、潮汐池，以及威利旧船。',map:W('BeachDistances'),places:[
{id:'fishshop',label:'鱼店',worldPlaceId:'fish_shop',x:29,y:57},{id:'elliott',label:'艾利欧特小屋',worldPlaceId:'elliott_house',x:52,y:18},{id:'tide',label:'潮汐池',worldPlaceId:'tide_pools',x:84,y:39}],portals:[
{id:'island',label:'威利的船 → 姜岛',to:'ginger_island',x:27,y:68,transport:true,requires:'修复鱼店后屋旧船'},{id:'night',label:'夜市潜水艇',to:'night_market',x:68,y:79,requires:'冬 15–17 日夜市'}],spots:[{id:'ocean',label:'海洋',fishAreaId:'beach',x:51,y:75}]},
night_market:{id:'night_market',name:'夜市潜水艇',summary:'冬 15–17 日的深海钓鱼区域。',map:W('SubmarineDistances'),spots:[{id:'deep',label:'深海潜水艇',fishAreaId:'night',x:50,y:55}]},
desert:{id:'desert',name:'卡利科沙漠',summary:'从公交站乘车抵达。',map:W('DesertDistances'),places:[
{id:'oasis',label:'绿洲',worldPlaceId:'oasis',x:15,y:80},{id:'trader',label:'沙漠商人',worldPlaceId:'desert_trader',x:77,y:35},{id:'casino',label:'赌场',x:23,y:72,requires:'完成齐先生任务线'}],portals:[{id:'skull',label:'骷髅洞穴',to:'skull_cavern',x:15,y:16,requires:'取得骷髅钥匙'}],spots:[{id:'dp',label:'沙漠池塘',fishAreaId:'desert',x:19,y:27}]},
skull_cavern:{id:'skull_cavern',name:'骷髅洞穴',summary:'沙漠西北角的无限层地下城。',map:W('Skull Cavern'),places:[{id:'entry',label:'骷髅洞穴',x:50,y:50,description:'使用矿井 120 层取得的骷髅钥匙进入。'}]},
sewer:{id:'sewer',name:'下水道',summary:'镇南与煤矿森林南方两个入口都进入同一张地图。',map:W('SewerDistances'),places:[
{id:'krobus',label:'科罗布斯',x:78,y:31,description:'科罗布斯的商店所在地。'},{id:'statue',label:'不确定性雕像',x:54,y:64,description:'可重置职业选择。'}],portals:[{id:'bug',label:'突变虫穴',to:'mutant_bug_lair',x:10,y:36,requires:'暗黑护身符任务线'}],spots:[{id:'sw',label:'下水道水域',fishAreaId:'sewer',x:56,y:72}]},
mutant_bug_lair:{id:'mutant_bug_lair',name:'突变虫穴',summary:'下水道后期任务线开放的小区域。',map:W('MutantBugLairDistances'),spots:[{id:'bw',label:'虫穴水域',fishAreaId:'bug',x:48,y:55}]},
witch_swamp:{id:'witch_swamp',name:'女巫沼泽',summary:'从铁路东北侧传送洞穴进入。',map:W('SwampDistances'),places:[{id:'hut',label:'女巫小屋',x:80,y:20}],spots:[{id:'ww',label:'沼泽水域',fishAreaId:'witch',x:54,y:58}]}
};
D.fishAreas={town:{title:'鹈鹕镇 · 河流',icon:'Sunfish'},forest_river:{title:'煤矿森林 · 河流',icon:'Chub'},forest_pond:{title:'煤矿森林 · 池塘',icon:'Smallmouth Bass'},forest_falls:{title:'煤矿森林 · 南部瀑布',icon:'Goby'},glacier:{title:'煤矿森林 · 南部小岛',icon:'Glacierfish'},mountain:{title:'山湖',icon:'Largemouth Bass'},beach:{title:'海滩 · 海洋',icon:'Sardine'},secret:{title:'秘密森林 · 池塘',icon:'Woodskip'},desert:{title:'沙漠 · 池塘',icon:'Sandfish'},sewer:{title:'下水道 · 水域',icon:'Mutant Carp'},bug:{title:'突变虫穴 · 水域',icon:'Slimejack'},mine20:{title:'矿井 · 20 层',icon:'Stonefish'},mine60:{title:'矿井 · 60 层',icon:'Ice Pip'},mine100:{title:'矿井 · 100 层',icon:'Lava Eel'},witch:{title:'女巫沼泽',icon:'Void Salmon'},night:{title:'夜市 · 潜水艇',icon:'Midnight Squid'}};
})();
