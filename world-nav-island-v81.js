/* v81 Ginger Island route graph extension. */
(()=>{
const D=window.SDVWorldNavV81Data;if(!D)return;const W=(f)=>`https://stardewvalleywiki.com/Special:Redirect/file/${encodeURIComponent(f+'.png')}`;
Object.assign(D.nodes,{
ginger_island:{id:'ginger_island',name:'姜岛',summary:'从海滩威利旧船抵达后的岛屿总览。',mapLocal:'Ginger Island Map',portals:[
{id:'south',label:'岛南／码头',to:'island_south',x:55,y:82},{id:'north',label:'岛北',to:'island_north',x:53,y:25},{id:'west',label:'岛西',to:'island_west',x:22,y:56},{id:'se',label:'岛东南',to:'island_southeast',x:77,y:75},{id:'volcano',label:'火山',to:'volcano',x:53,y:10}]},
island_south:{id:'island_south',name:'姜岛南部',summary:'威利的船抵达姜岛后的码头与度假村区域。',map:W('Ginger Island South'),places:[
{id:'dock',label:'码头',x:45,y:84},{id:'resort',label:'度假村',x:62,y:46,requires:'用金色核桃修复度假村'}],spots:[{id:'sf',label:'岛南海域',fishAreaId:'island_s',x:52,y:70}]},
island_north:{id:'island_north',name:'姜岛北部',summary:'岛屿办事处、挖掘场、姜岛商人与火山入口。',map:W('IslandNorthDistances'),places:[
{id:'office',label:'岛屿办事处',x:52,y:48},{id:'trader',label:'姜岛商人',x:35,y:58},{id:'dig',label:'挖掘场',x:77,y:56}],portals:[{id:'nv',label:'火山入口',to:'volcano',x:53,y:8}],spots:[{id:'nf',label:'岛北淡水',fishAreaId:'island_n',x:42,y:58}]},
island_west:{id:'island_west',name:'姜岛西部',summary:'姜岛农场、鸟儿、青蛙洞穴与齐先生的核桃房。',map:W('Ginger Island West'),places:[
{id:'farm',label:'姜岛农场',x:51,y:53},{id:'birdie',label:'鸟儿',x:16,y:54},{id:'qi',label:'齐先生的核桃房',x:20,y:53},{id:'frog',label:'青蛙洞穴',x:72,y:45}],spots:[
{id:'wf',label:'岛西淡水',fishAreaId:'island_w_fresh',x:42,y:53},{id:'wo',label:'岛西海洋',fishAreaId:'island_w_ocean',x:17,y:73}]},
island_southeast:{id:'island_southeast',name:'姜岛东南部',summary:'度假村开放后可进入；海盗湾从这里继续前往。',map:W('IslandSouthEastDistances'),portals:[{id:'pirate',label:'海盗湾',to:'pirate_cove',x:74,y:71}],spots:[{id:'sef',label:'东南海域',fishAreaId:'island_s',x:50,y:60}]},
pirate_cove:{id:'pirate_cove',name:'海盗湾',summary:'姜岛东南侧的隐藏海湾。',map:W('Pirate Cove'),spots:[{id:'pf',label:'海盗湾',fishAreaId:'pirate',x:50,y:62}]},
volcano:{id:'volcano',name:'火山地牢',summary:'姜岛北部的 10 层火山地牢。',map:W('Ginger Island Volcano'),places:[{id:'vd',label:'火山矮人商店',x:35,y:30}],portals:[{id:'cal',label:'火山口／锻造台',to:'caldera',x:50,y:10,requires:'抵达火山第 10 层'}]},
caldera:{id:'caldera',name:'火山口',summary:'火山第 10 层锻造台旁的岩浆水域。',map:W('CalderaDistances'),spots:[{id:'cf',label:'火山口岩浆',fishAreaId:'caldera',x:52,y:55}]}
});
Object.assign(D.fishAreas,{island_n:{title:'姜岛北部 · 淡水',icon:'Blue Discus'},island_w_fresh:{title:'姜岛西部 · 淡水',icon:'Blue Discus'},island_w_ocean:{title:'姜岛西部 · 海洋',icon:'Lionfish'},island_s:{title:'姜岛南部 · 海洋',icon:'Lionfish'},pirate:{title:'海盗湾',icon:'Stingray'},caldera:{title:'火山口',icon:'Lava Eel'}});
})();
