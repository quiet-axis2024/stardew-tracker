/* v83 — fish data consumed by the standalone World UI. Kept in sync with app.jsx FISH_* v4/v42 tables. */
(()=>{
'use strict';
const names=[
'河豚','鳳尾魚','金槍魚','沙丁魚','鯛魚','大嘴鱸魚','小嘴鱸魚','虹鱒魚','鮭魚','大眼魚',
'鱸魚','鯉魚','鯰魚','梭子魚','太陽魚','紅鯔魚','鯡魚','鰻魚','章魚','紅鯛魚',
'魷魚','海草','綠藻','海參','大海參','鬼魚','白藻','石魚','緋紅魚','安康魚',
'冰柱魚','熔岩鰻魚','傳說之魚','沙魚','蠍鯉魚','比目魚','午夜鯉魚','蛤','突變鯉魚','鱘魚',
'虎紋鱒魚','大頭魚','羅非魚','鰱魚','麻哈脂鯉','長鰭金槍魚','西鯡','蛇齒單線魚','大比目魚','龍蝦',
'小龍蝦','螃蟹','鳥蛤','蚌','蝦','蝸牛','玉黍螺','牡蠣','木躍魚','冰川魚',
'虛空鮭魚','史萊姆魚','午夜魷魚','幽靈魚','水滴魚','黃貂魚','獅子魚','藍鐵餅魚','河凝膠','洞穴凝膠',
'海凝膠','鰕虎魚'];
const files=[
'Pufferfish','Anchovy','Tuna','Sardine','Bream','Largemouth Bass','Smallmouth Bass','Rainbow Trout','Salmon','Walleye',
'Perch','Carp','Catfish','Pike','Sunfish','Red Mullet','Herring','Eel','Octopus','Red Snapper',
'Squid','Seaweed','Green Algae','Sea Cucumber','Super Cucumber','Ghostfish','White Algae','Stonefish','Crimsonfish','Angler',
'Ice Pip','Lava Eel','Legend','Sandfish','Scorpion Carp','Flounder','Midnight Carp','Clam','Mutant Carp','Sturgeon',
'Tiger Trout','Bullhead','Tilapia','Chub','Dorado','Albacore','Shad','Lingcod','Halibut','Lobster',
'Crayfish','Crab','Cockle','Mussel','Shrimp','Snail','Periwinkle','Oyster','Woodskip','Glacierfish',
'Void Salmon','Slimejack','Midnight Squid','Spook Fish','Blobfish','Stingray','Lionfish','Blue Discus','River Jelly','Cave Jelly',
'Sea Jelly','Goby'];
const rules={
0:{s:['夏'],w:'晴',t:[[12,16]]},1:{s:['春','秋'],w:'任意',t:[[6,26]]},2:{s:['夏','冬'],w:'任意',t:[[6,19]]},3:{s:['春','秋','冬'],w:'任意',t:[[6,19]]},
4:{s:['春','夏','秋','冬'],w:'任意',t:[[18,26]]},5:{s:['春','夏','秋','冬'],w:'任意',t:[[6,19]]},6:{s:['春','秋'],w:'任意',t:[[6,26]]},7:{s:['夏'],w:'晴',t:[[6,19]]},
8:{s:['秋'],w:'任意',t:[[6,19]]},9:{s:['秋','冬'],w:'雨',t:[[12,26]]},10:{s:['冬'],w:'任意',t:[[6,26]]},11:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},
12:{s:['春','秋'],w:'雨',t:[[6,24]]},13:{s:['夏','冬'],w:'任意',t:[[6,26]]},14:{s:['春','夏'],w:'晴',t:[[6,19]]},15:{s:['夏','冬'],w:'任意',t:[[6,19]]},
16:{s:['春','冬'],w:'任意',t:[[6,26]]},17:{s:['春','秋'],w:'雨',t:[[16,26]]},18:{s:['夏'],w:'任意',t:[[6,13]]},19:{s:['夏','秋','冬'],w:'雨',t:[[6,19]]},
20:{s:['冬'],w:'任意',t:[[18,26]]},21:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},22:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},23:{s:['秋','冬'],w:'任意',t:[[6,19]]},
24:{s:['夏','秋'],w:'任意',t:[[18,26]]},25:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},26:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},27:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},
28:{s:['夏'],w:'任意',t:[[6,26]],legend:true},29:{s:['秋'],w:'任意',t:[[6,26]],legend:true},30:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},31:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},
32:{s:['春'],w:'雨',t:[[6,26]],legend:true},33:{s:['春','夏','秋','冬'],w:'任意',t:[[6,20]]},34:{s:['春','夏','秋','冬'],w:'任意',t:[[6,20]]},35:{s:['春','夏'],w:'任意',t:[[6,20]]},
36:{s:['秋','冬'],w:'任意',t:[[22,26]]},38:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]],legend:true},39:{s:['夏','冬'],w:'任意',t:[[6,19]]},40:{s:['秋','冬'],w:'任意',t:[[6,19]]},
41:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},42:{s:['夏','秋'],w:'任意',t:[[6,14]]},43:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},44:{s:['夏'],w:'任意',t:[[6,19]]},
45:{s:['秋','冬'],w:'任意',t:[[6,11],[18,26]]},46:{s:['春','夏','秋'],w:'雨',t:[[9,26]]},47:{s:['冬'],w:'任意',t:[[6,26]]},48:{s:['春','夏','冬'],w:'任意',t:[[6,11],[19,26]]},
58:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},59:{s:['冬'],w:'任意',t:[[6,26]],legend:true},60:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},61:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},
62:{s:['冬'],w:'任意',t:[[17,26]]},63:{s:['冬'],w:'任意',t:[[17,26]]},64:{s:['冬'],w:'任意',t:[[17,26]]},65:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},
66:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},67:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]},68:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]],jelly:true},
69:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]],jelly:true},70:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]],jelly:true},71:{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]}};
const areas=[
{id:'town',name:'鹈鹕镇',sub:'河流',icon:'Sunfish',fish:[14,12,22,6,46,4,7,13,8,40,9,47,10,29,68]},
{id:'forest_river',name:'煤矿森林',sub:'河流',icon:'Chub',fish:[14,12,43,22,46,4,44,7,13,8,40,9,47,10,68]},
{id:'forest_pond',name:'煤矿森林',sub:'池塘',icon:'Smallmouth Bass',fish:[22,6,13,9,36,10,68]},
{id:'forest_falls',name:'煤矿森林',sub:'南部瀑布',icon:'Goby',fish:[71,8],tip:'蝦虎魚需把浮標拋進南部瀑布下方水池；有效釣魚等級至少 4。'},
{id:'glacier',name:'煤矿森林',sub:'南部小島',icon:'Glacierfish',fish:[59],tip:'冰川魚是冬季傳說魚，需在箭頭形小島南端指定水域。'},
{id:'mountain',name:'山湖',sub:'礦井外湖泊',icon:'Largemouth Bass',fish:[5,41,11,43,22,7,39,9,36,47,10,32,68],tip:'傳說之魚需春季雨天、釣魚等級 10，浮標需落在離岸足夠遠的位置。'},
{id:'beach',name:'海灘',sub:'海洋',icon:'Sardine',fish:[3,35,1,16,21,48,17,18,42,15,19,2,0,24,23,45,20,28,70],tip:'緋紅魚需夏季、釣魚等級 5，並在修橋後的東側區域拋遠。'},
{id:'secret',name:'秘密森林',sub:'池塘',icon:'Woodskip',fish:[11,58,12,68],seasonOverride:{12:['春','夏','秋']}},
{id:'desert',name:'沙漠',sub:'池塘',icon:'Sandfish',fish:[33,34,22,68]},
{id:'sewer',name:'下水道',sub:'水域',icon:'Mutant Carp',fish:[11,22,26,38]},
{id:'bug',name:'突變蟲穴',sub:'水域',icon:'Slimejack',fish:[11,61,22,26]},
{id:'mine20',name:'礦井',sub:'20 層',icon:'Stonefish',fish:[25,27,22,26,69]},
{id:'mine60',name:'礦井',sub:'60 層',icon:'Ice Pip',fish:[25,30,22,26,69]},
{id:'mine100',name:'礦井',sub:'100 層',icon:'Lava Eel',fish:[31,22,26,69]},
{id:'witch',name:'女巫沼澤',sub:'沼澤',icon:'Void Salmon',fish:[60,12,22,26],seasonOverride:{12:['春','夏','秋']}},
{id:'night',name:'冬季夜市',sub:'潛水艇',icon:'Midnight Squid',fish:[62,63,64,18,23,24,21,70],forceSeasons:['冬'],days:[15,16,17],timeOverride:[[17,26]],tip:'夜市冬 15–17 日 17:00–02:00；潛水艇下潛還會消耗約 30 分鐘遊戲時間。'},
{id:'island_n',name:'姜岛北部',sub:'淡水',icon:'Blue Discus',fish:[67,36,42,68],forceSeasons:['春','夏','秋','冬']},
{id:'island_w_fresh',name:'姜岛西部',sub:'河流／池塘',icon:'Blue Discus',fish:[67,36,42,68],forceSeasons:['春','夏','秋','冬']},
{id:'island_w_ocean',name:'姜岛西部',sub:'海洋',icon:'Lionfish',fish:[35,66,18,0,24,2,70],forceSeasons:['春','夏','秋','冬']},
{id:'island_s',name:'姜岛南部及東南部',sub:'南部／東南部海域',icon:'Lionfish',fish:[35,66,0,24,2,70],forceSeasons:['春','夏','秋','冬']},
{id:'pirate',name:'海盜灣',sub:'海盜灣水域',icon:'Stingray',fish:[35,0,65,24,2,70],forceSeasons:['春','夏','秋','冬']},
{id:'caldera',name:'火山口',sub:'熔岩湖',icon:'Lava Eel',fish:[31],forceSeasons:['春','夏','秋','冬']}
];
const segments=[{id:'morning',name:'早上',range:[6,12]},{id:'afternoon',name:'下午',range:[12,17]},{id:'evening',name:'晚上',range:[17,22]},{id:'late',name:'深夜',range:[22,26]}];
const locations=[
{id:'all',name:'全世界',areas:[]},{id:'town',name:'鹈鹕镇',areas:['town']},{id:'forest',name:'煤矿森林',areas:['forest_river','forest_pond','forest_falls','glacier']},
{id:'mountain',name:'山湖',areas:['mountain']},{id:'beach',name:'海滩',areas:['beach']},{id:'secret',name:'秘密森林',areas:['secret']},{id:'desert',name:'沙漠',areas:['desert']},
{id:'sewer',name:'下水道／突变虫穴',areas:['sewer','bug']},{id:'mines',name:'矿井',areas:['mine20','mine60','mine100']},{id:'witch',name:'女巫沼泽',areas:['witch']},
{id:'night',name:'冬季夜市',areas:['night']},{id:'island',name:'姜岛',areas:['island_n','island_w_fresh','island_w_ocean','island_s','pirate','caldera']}];
const areaNode={town:'town',forest_river:'forest',forest_pond:'forest',forest_falls:'forest',glacier:'forest',mountain:'mountain',beach:'beach',secret:'secret_woods',desert:'desert',sewer:'sewer',bug:'mutant_bug_lair',mine20:'mines',mine60:'mines',mine100:'mines',witch:'witch_swamp',night:'night_market',island_n:'island_north',island_w_fresh:'island_west',island_w_ocean:'island_west',island_s:'island_south',pirate:'pirate_cove',caldera:'caldera'};
window.SDVWorldFishV83={version:83,names,files,rules,areas,segments,locations,areaNode};
})();
