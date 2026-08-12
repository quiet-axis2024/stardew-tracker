from pathlib import Path
import re

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

def rep(old,new,label):
    global s
    if old not in s:
        raise RuntimeError(f'missing patch anchor: {label}')
    s=s.replace(old,new,1)

# 1) Correct two book image keys.
rep('''{id:"raccoon",name:"浣熊日记",file:"Raccoon Journal",desc:"杂草更容易掉落混合种子。"}''','''{id:"raccoon",name:"浣熊日记",file:"Ways Of The Wild",desc:"杂草更容易掉落混合种子。"}''','raccoon book icon')
rep('''{id:"horse",name:"马术秘籍",file:"Horse: The Book",desc:"骑马速度稍微加快。"}''','''{id:"horse",name:"马术秘籍",file:"Horse The Book",desc:"骑马速度稍微加快。"}''','horse book icon')

# v55 shared data: complete/high-value pond produce, additional equipment, social category labels/services.
insert_anchor='''const MASTERY_POWERS_V2 = ['''
insert='''const POND_PRODUCTS_V55 = {
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

const MACHINE_EXTRA_V55 = {
  "Sewing Machine":{sourceZh:"艾米丽特殊订单「宝石恢复活力」完成后邮寄；用于裁缝与染色。"},
  "Telephone":{sourceZh:"木匠商店购买；可远程查询商店营业与部分库存。"},
  "Mini-Fridge":{sourceZh:"农舍升级后木匠商店购买；也可由格斯特殊订单取得。"},
  "Mini-Jukebox":{ingredients:[{name:"Iron Bar",quantity:2},{name:"Battery Pack",quantity:1}],sourceZh:"格斯 5 心事件后取得配方。"},
  "Statue Of Blessings":{ingredients:[{name:"Sap",quantity:999},{name:"Fiber",quantity:999},{name:"Stone",quantity:999},{name:"Moss",quantity:333}],sourceZh:"耕种精通后解锁配方。"},
  "Statue Of The Dwarf King":{ingredients:[{name:"Iridium Bar",quantity:20}],sourceZh:"采矿精通后解锁配方。"},
  "Deconstructor":{sourceZh:"齐先生核桃房以齐钻购买。"},
  "Anvil":{ingredients:[{name:"Iron Bar",quantity:50}],sourceZh:"战斗精通后解锁配方。"},
  "Mini-Forge":{ingredients:[{name:"Dragon Tooth",quantity:5},{name:"Iron Bar",quantity:10},{name:"Gold Bar",quantity:10},{name:"Iridium Bar",quantity:5}],sourceZh:"战斗精通后解锁配方；功能类似火山锻造台。"},
  "Crab Pot":{ingredients:[{name:"Wood",quantity:40},{name:"Iron Bar",quantity:3}],sourceZh:"钓鱼 3 级基础配方；诱捕者职业会改变材料需求。"}
};

const SOCIAL_SPECIAL_ITEM_V55 = {
  "Frog Egg":{name:"青蛙蛋",file:"Frog Egg Colors",source:"饰品；战斗精通后由怪物／箱子等来源取得"},
  "Parrot Egg":{name:"鹦鹉蛋",file:"Parrot Egg",source:"饰品；战斗精通后取得"},
  "Fairy Box":{name:"仙女盒",file:"Fairy Box",source:"饰品；战斗精通后取得"},
  "Basilisk Paw":{name:"蜥怪的爪子",file:"Basilisk Paw",source:"饰品；战斗精通后取得"},
  "Jack Be Nimble Jack Be Thick":{name:"铜墙铁壁",file:"Jack Be Nimble, Jack Be Thick",source:"能力书籍"},
  "Large Goat Milk":{name:"大瓶羊奶",file:"Large Goat Milk",source:"高好感山羊产出"},
  "Strange Doll (green)":{name:"诡异玩偶（绿）",file:"Strange Doll (green)",source:"古物"},
  "Strange Doll (yellow)":{name:"诡异玩偶（黄）",file:"Strange Doll (yellow)",source:"古物"}
};
const SOCIAL_GENERIC_V55 = {
  "All Artisan Goods (except Coffee, Green Tea & Oil)":{name:"所有工匠物品（咖啡、绿茶、油除外）",file:"Keg"},
  "All Artisan Goods (except Honey, Jelly & Oil)":{name:"所有工匠物品（蜂蜜、果酱、油除外）",file:"Preserves Jar"},
  "All Eggs (except Void Egg)":{name:"所有蛋类（虚空蛋除外）",file:"Egg"},
  "All Fish":{name:"所有鱼类",file:"Tuna"},
  "All Fish (except Clam, Cockle, Mussel & Oyster)":{name:"所有鱼类（蛤、鸟蛤、蚌、牡蛎除外）",file:"Tuna"},
  "All Milk":{name:"所有奶类",file:"Milk"},
  "All Universal Likes":{name:"所有通用喜欢",file:"Daffodil"},
  "All Universal Likes (except Garlic)":{name:"所有通用喜欢（大蒜除外）",file:"Daffodil"},
  "All Fruit (except Spice Berry)":{name:"所有水果（香味浆果除外）",file:"Apple"},
  "All Universal Hates":{name:"所有通用讨厌",file:"Holly"},
  "All Universal Hates (except Carp & Wild Bait)":{name:"所有通用讨厌（鲤鱼、万能鱼饵除外）",file:"Holly"},
  "All Universal Hates (except Seafoam Pudding)":{name:"所有通用讨厌（海泡布丁除外）",file:"Holly"},
  "All Universal Hates (except Slime)":{name:"所有通用讨厌（史莱姆泥除外）",file:"Holly"},
  "All Universal Hates (except Monster Musk, Seafoam Pudding, Strange Bun & Void Mayonnaise)":{name:"所有通用讨厌（怪物香水、海泡布丁、奇怪的小面包、虚空蛋黄酱除外）",file:"Holly"}
};
const SOCIAL_EMPTY_RULES_V55 = {
  "谢恩":{likes:["All Universal Likes"]},"謝恩":{likes:["All Universal Likes"]},
  "乔迪":{likes:["All Universal Likes (except Garlic)","All Eggs (except Void Egg)","All Fruit (except Spice Berry)","All Milk"]},"喬迪":{likes:["All Universal Likes (except Garlic)","All Eggs (except Void Egg)","All Fruit (except Spice Berry)","All Milk"]},
  "莱纳斯":{likes:["All Universal Likes"],hates:["All Universal Hates (except Carp & Wild Bait)"]},"萊納斯":{likes:["All Universal Likes"],hates:["All Universal Hates (except Carp & Wild Bait)"]},
  "威利":{hates:["All Universal Hates (except Seafoam Pudding)"]},
  "法师":{hates:["All Universal Hates (except Slime)"]},"法師":{hates:["All Universal Hates (except Slime)"]},
  "科罗布斯":{hates:["All Universal Hates (except Monster Musk, Seafoam Pudding, Strange Bun & Void Mayonnaise)"]},"克羅巴斯":{hates:["All Universal Hates (except Monster Musk, Seafoam Pudding, Strange Bun & Void Mayonnaise)"]},
  "矮人":{hates:["All Universal Hates"]}
};
const NPC_SERVICES_V55 = {
  "罗宾":[["Silo","建造／管理农场建筑","建造、升级、移动或拆除多数农场建筑，并负责农舍升级与部分社区升级。"]],
  "羅賓":[["Silo","建造／管理农场建筑","建造、升级、移动或拆除多数农场建筑，并负责农舍升级与部分社区升级。"]],
  "玛妮":[["Cow","购买农场动物","为鸡舍或牲口棚购买动物；也销售干草、暖气机、挤奶桶等动物照护用品。"]],
  "瑪妮":[["Cow","购买农场动物","为鸡舍或牲口棚购买动物；也销售干草、暖气机、挤奶桶等动物照护用品。"]],
  "克林特":[["Pickaxe","工具升级","支付金钱与金属锭升级主要手持工具。"],["Geode","处理晶球","在铁匠铺敲开晶球；每个基础处理费 25g。"]],
  "刘易斯":[["Prize Ticket","奖券兑换机","镇长家内可用奖品券在奖品机领取连续奖励。"]],
  "劉易斯":[["Prize Ticket","奖券兑换机","镇长家内可用奖品券在奖品机领取连续奖励。"]],
  "威利":[["Boat","姜岛船运","修复鱼店后室的旧船后可搭船前往姜岛；单程船票 1,000g。"]],
  "皮埃尔":[["36 Backpack","背包升级","杂货店可购买两次背包扩充，每次增加 12 格。"]],
  "皮埃爾":[["36 Backpack","背包升级","杂货店可购买两次背包扩充，每次增加 12 格。"]],
  "法师":[["Magic Ink","幻象神龛","达到条件后可付费修改角色外观。"],["Junimo Hut","魔法建筑","归还魔法墨水后可购买祝尼魔小屋、方尖碑与黄金时钟等魔法建筑。"]],
  "法師":[["Magic Ink","幻象神龛","达到条件后可付费修改角色外观。"],["Junimo Hut","魔法建筑","归还魔法墨水后可购买祝尼魔小屋、方尖碑与黄金时钟等魔法建筑。"]]
};

'''
if insert_anchor not in s: raise RuntimeError('mastery insertion anchor missing')
s=s.replace(insert_anchor,insert+insert_anchor,1)

# State used by searchable pond picker.
rep('''  const [pondPicker, setPondPicker] = useState(null);''','''  const [pondPicker, setPondPicker] = useState(null);
  const [pondFishQueryV55, setPondFishQueryV55] = useState("");''','pond query state')

# Expand lookup normalization punctuation tolerance and add birthday->social helper.
rep('''.replace(/[\\s·・_'’\\-]+/g,"")''','''.replace(/[\\s·・_'’\\-,:.()&]+/g,"")''','lookup punctuation normalization')
helper_anchor='''  const roomDone = (room) => data.bundleDone.includes(room.id);'''
helper='''  const openSocialNpcV55 = npc => {
    const group=NPC_GROUPS.find(g=>g.list.includes(npc));
    if(group)setSocialGroup(group.id);
    setExpandedNPC(npc);
    setTab("people");
    requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:"auto"}));
  };

'''
if helper_anchor not in s: raise RuntimeError('open social helper anchor missing')
s=s.replace(helper_anchor,helper+helper_anchor,1)

# Birthday character/header is clickable; gift buttons remain independently clickable.
old='''return <div key={it.text} style={{marginTop:7,padding:"8px 9px",borderRadius:9,background:"#FFF1CF",border:`1.5px solid ${C.line}`}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file={NPC_ICON_FILES[it.npc]} size={34}/><div><b style={{fontSize:12.5,color:C.brown}}>🎂 {it.npc}生日</b><div style={{fontSize:9,color:C.muted,marginTop:1}}>最愛禮物・直接照圖找</div></div></div>{gift?.love?.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4,marginTop:6}}>{gift.love.map(x=>renderMiniItemV26(x,"#FFF8E3"))}</div>}</div>;'''
new='''return <div key={it.text} style={{marginTop:7,padding:"8px 9px",borderRadius:9,background:"#FFF1CF",border:`1.5px solid ${C.line}`}}><button type="button" onClick={()=>openSocialNpcV55(it.npc)} style={{width:"100%",border:0,background:"transparent",padding:0,display:"flex",alignItems:"center",gap:7,textAlign:"left",cursor:"pointer"}}><GameIcon file={NPC_ICON_FILES[it.npc]} size={34}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:12.5,color:C.brown}}>🎂 {it.npc}生日</b><div style={{fontSize:9,color:C.muted,marginTop:1}}>点人物卡 → 社交速查；点礼物 → 物品资料</div></div><span style={{fontSize:11,color:C.orange,fontWeight:950}}>查看人物 ›</span></button>{gift?.love?.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4,marginTop:6}}>{gift.love.map(x=>renderMiniItemV26(x,"#FFF8E3"))}</div>}</div>;'''
rep(old,new,'birthday social link')

# Replace local incomplete pond output map with centralized complete data.
pond_start=s.index('''    const pondProductMap={''')
pond_end=s.index('''    const machineMetaV51=''',pond_start)
s=s[:pond_start]+'''    const pondFishFileV55=fish=>itemFileZhV26(fish)||fish;
    const pondProducts=fish=>{
      if(!fish)return [];
      const file=pondFishFileV55(fish);
      return POND_PRODUCTS_V55[file]||[[1,"Roe","鱼籽"]];
    };
    const pondableFishV55=COLLECTIONS.fish.items.map((name,fi)=>({name,fi,file:FISH_ICON_FILES[fi]||itemFileZhV26(name)})).filter(x=>x.file&&!POND_NON_PONDABLE_V55.has(x.file));

'''+s[pond_end:]

# Merge additional machines into metadata and lists.
rep('''    const machineMetaV51=window.SDVMachineV51?.byName||{};''','''    const machineMetaV51={...(window.SDVMachineV51?.byName||{}),...MACHINE_EXTRA_V55};''','machine metadata merge')
rep('''["mini_shipping","迷你出貨箱","Mini-Shipping Bin",[]]''','''["mini_shipping","迷你出货箱","Mini-Shipping Bin",[]],["sewing","裁缝机","Sewing Machine",[]],["telephone","电话","Telephone",[]],["mini_fridge","迷你冰箱","Mini-Fridge",[]],["mini_jukebox","迷你点唱机","Mini-Jukebox",[]],["blessing_statue","祝福雕像","Statue Of Blessings",[]],["dwarf_king_statue","矮人王雕像","Statue Of The Dwarf King",[]]''','farm equipment additions')
rep('''["worm_bin","蟲餌盒","Worm Bin",[["Bait","魚餌"]]]''','''["worm_bin","虫饵盒","Worm Bin",[["Bait","鱼饵"]]],["deconstructor","分解机","Deconstructor",[]],["anvil","铁砧","Anvil",[]],["mini_forge","迷你锻造台","Mini-Forge",[]],["crab_pot","蟹笼","Crab Pot",[]]''','refining equipment additions')

# Stable: cap to one per player. We use current multiplayer cabin count as additional-player proxy.
rep('''      const max=key==="greenhouse"?1:99, v=Math.max(0,Math.min(max,Number(value)||0));''','''      const stableMaxV55=Math.max(1,1+Number((d.buildingCounts||{}).cabin||0));
      const max=key==="greenhouse"?1:key==="stable"?stableMaxV55:99, v=Math.max(0,Math.min(max,Number(value)||0));''','stable maximum')
rep('''<CountTile name="馬廄" file="Horse Stable" count={buildingCount("stable")} onMinus={()=>setBuildingCount("stable",buildingCount("stable")-1)} onPlus={()=>setBuildingCount("stable",buildingCount("stable")+1)}/>''','''<CountTile name="马厩" file="Horse Stable" count={buildingCount("stable")} sub={buildingCount("cabin")>0?`多人：最多 ${1+buildingCount("cabin")} 座（每位玩家 1 座）`:"单人农场最多 1 座"} onMinus={()=>setBuildingCount("stable",buildingCount("stable")-1)} onPlus={()=>setBuildingCount("stable",buildingCount("stable")+1)}/>''','stable tile')

# Show all pond products rather than truncating to first four.
rep('''{products.slice(0,4).map(([min,file,label])=>''','''{products.map(([min,file,label])=>''','pond product display all')

# Replace horizontal fish scroller with search + recommended + grid.
picker_start=s.index('''        {pondPicker!=null&&data.ponds?.[pondPicker]&&<Card''')
picker_end=s.index('''        <button onClick={()=>{const i=(data.ponds||[]).length;''',picker_start)
picker='''        {pondPicker!=null&&data.ponds?.[pondPicker]&&<Card style={{padding:8,marginTop:7,background:"#FFF8E2"}}>
          {(()=>{const current=data.ponds[pondPicker];const q=normalizeLookupV54(pondFishQueryV55);const rows=pondableFishV55.filter(x=>!q||normalizeLookupV54(`${x.name} ${switchNameV47(x.name,x.file)} ${x.file}`).includes(q));const rare=pondableFishV55.filter(x=>POND_RARE_V55.includes(x.file));const Pick=({x,compact=false})=>{const on=x.name===current.fish;return <button key={`${compact?"r":"a"}-${x.name}`} onClick={()=>{const ponds=[...data.ponds];ponds[pondPicker]={...current,fish:x.name};update({ponds});setPondPicker(null);setPondFishQueryV55("")}} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?C.lightGreen:C.paper,borderRadius:8,padding:compact?"4px 3px":"5px 2px",minHeight:compact?55:64,cursor:"pointer",minWidth:0}}><img src={ICON_URLS.fish[x.fi]} alt="" loading="lazy" style={{width:compact?27:31,height:compact?27:31,imageRendering:"pixelated",objectFit:"contain"}}/><div style={{fontSize:7.5,fontWeight:900,color:C.ink,lineHeight:1.05,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{switchNameV47(x.name,x.file)}</div></button>};return <><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><b style={{fontSize:10.5,color:C.brown,flex:1}}>第 {pondPicker+1} 座鱼塘｜选鱼</b><button onClick={()=>{setPondPicker(null);setPondFishQueryV55("")}} style={{border:0,background:"transparent",color:C.brown,fontSize:12,fontWeight:950}}>完成</button></div><input value={pondFishQueryV55} onChange={e=>setPondFishQueryV55(e.target.value)} placeholder="搜鱼名，例如：熔岩鳗鱼、水滴鱼…" style={{width:"100%",border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:8,padding:"7px 9px",color:C.ink,outline:"none"}}/>{!q&&<><div style={{fontSize:7.7,fontWeight:950,color:C.muted,margin:"7px 0 4px"}}>常用／高价值鱼塘</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4}}>{rare.map(x=><Pick key={x.name} x={x} compact/>)}</div></>}<div style={{fontSize:7.7,fontWeight:950,color:C.muted,margin:"8px 0 4px"}}>{q?`搜索结果 · ${rows.length}`:`全部可养鱼种 · ${rows.length}`}</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4,maxHeight:310,overflowY:"auto",WebkitOverflowScrolling:"touch",paddingRight:2}}>{rows.map(x=><Pick key={x.name} x={x}/>)}</div></>})()}
          <button onClick={()=>{const ponds=data.ponds.filter((_,j)=>j!==pondPicker);setPondPicker(null);setPondFishQueryV55("");update({ponds,buildings:{...data.buildings,fishPonds:ponds.length}})}} style={{marginTop:7,border:0,background:"transparent",color:C.red,fontSize:9.5,fontWeight:900,padding:0}}>删除这座鱼塘</button>
        </Card>}
'''
s=s[:picker_start]+picker+s[picker_end:]

# Community hierarchy and explicit route selection.
rep('''    const route=data.communityRouteV28||"cc";''','''    const route=["cc","joja"].includes(data.communityRouteV28)?data.communityRouteV28:"";''','explicit community route')
route_old='''    const routeButton=(id,label,file)=>{const active=route===id;return <button onClick={()=>{update({communityRouteV28:id});setBundleRoom("");setBundleEditV28(null)}} style={{border:`1.5px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":"#E5E1D8",borderRadius:8,padding:4,display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontSize:8.5,fontWeight:950,color:active?C.brown:C.muted,filter:active?"none":"grayscale(.9)",opacity:active?1:.72}}><GameIcon file={file} size={25}/>{label}</button>};'''
route_new='''    const RouteLevelV55=({label,file,children})=><div style={{marginTop:9,marginLeft:6,paddingLeft:9,borderLeft:`3px solid ${C.orange}`}}><div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 2px 2px",fontSize:8,fontWeight:950,color:C.orange}}><span style={{background:"#FFF0D2",borderRadius:7,padding:"2px 5px"}}>第 4 层</span><GameIcon file={file} size={20}/><span>{label}</span></div>{children}</div>;
    const routeButton=(id,label,file)=>{const active=route===id,inactive=Boolean(route)&&!active;return <button onClick={()=>{if(route&&route!==id&&!window.confirm(`游戏里社区中心与 Joja 是二选一路线。确定把手帐当前路线切换成「${label}」吗？\n另一条路线已记录的数据会保留，但不会同时计入当前路线。`))return;update({communityRouteV28:id});setBundleRoom("");setBundleEditV28(null)}} style={{border:`2px solid ${active?C.green:C.line}`,background:active?"#EAF4D8":inactive?"#E5E1D8":C.paper,borderRadius:10,padding:"7px 5px",display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontSize:9,fontWeight:950,color:active?C.green:inactive?C.muted:C.brown,filter:inactive?"grayscale(.9)":"none",opacity:inactive?.65:1}}><GameIcon file={file} size={27}/><span>{active?"✓ ":""}{label}{active?<small style={{display:"block",fontSize:6.2,color:C.green,marginTop:1}}>目前路线</small>:null}</span></button>};'''
rep(route_old,route_new,'route button hierarchy')
rep('''      <SectionTitle icon="📦">城鎮修復路線</SectionTitle>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>{routeButton("cc","社區中心","Golden Scroll")}{routeButton("joja","Joja","Joja Warehouse")}</div>
''','''      <SectionTitle icon="📦">城镇修复路线</SectionTitle>
      <Card style={{padding:8,background:"#FFF4D8"}}><div style={{display:"flex",alignItems:"center",gap:5,fontSize:8.5,fontWeight:950,color:C.brown,marginBottom:6}}><span style={{background:"#FFE2A8",borderRadius:7,padding:"2px 6px"}}>第 3 层</span><span>先选这个存档走哪条路线｜游戏中二选一</span></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>{routeButton("cc","社区中心","Golden Scroll")}{routeButton("joja","Joja","Joja Warehouse")}</div>{!route&&<div style={{fontSize:8,color:C.muted,lineHeight:1.35,marginTop:6,textAlign:"center"}}>尚未选择路线；选择后才展开下一层的路线内容。</div>}</Card>
''','route selector card')

# Wrap route-specific contents as level 4 using segment-boundary surgery.
joja_open='{route==="joja"&&<>'
cc_open='{route==="cc"&&<>'
if joja_open not in s or cc_open not in s: raise RuntimeError('route content markers missing')
s=s.replace(joja_open,'{route==="joja"&&<RouteLevelV55 label="Joja 仓库路线内容" file="Joja Warehouse">',1)
# The fragment immediately before CC begins closes Joja.
s=s.replace('''      </>}

      {route==="cc"&&<>''','''      </RouteLevelV55>}

      {route==="cc"&&<RouteLevelV55 label="社区中心路线内容" file="Golden Scroll">''',1)
forest_marker='''

      <SectionTitle icon="game:Raccoon Icon">森林鄰居</SectionTitle>'''
cc_pos=s.index('{route==="cc"&&<RouteLevelV55')
forest_pos=s.index(forest_marker,cc_pos)
segment=s[cc_pos:forest_pos]
last_close=segment.rfind('</>}')
if last_close<0: raise RuntimeError('cc closing fragment missing')
segment=segment[:last_close]+'</RouteLevelV55>}'+segment[last_close+4:]
s=s[:cc_pos]+segment+s[forest_pos:]
# Make nested CC heading visually compact rather than looking like another level-3 title.
s=s.replace('''<SectionTitle icon="📦" right={`${rp.done}/30`}>社區中心</SectionTitle>''','''<div style={{display:"flex",alignItems:"center",gap:7,margin:"10px 0 7px"}}><GameIcon file="Golden Scroll" size={27}/><b style={{fontSize:14,color:C.darkBrown}}>社区中心</b><span style={{marginLeft:"auto",fontSize:11,fontWeight:950,color:C.muted}}>{rp.done}/30</span></div>''',1)

# Collections cooking: make progress header match fish/shipping/artifact.
cook_start=s.index('''  const renderCookingV3 = () => <div>''')
paper_start=s.index('''  const renderPaperCollectionV3 =''',cook_start)
old_cook=s[cook_start:paper_start]
new_cook='''  const renderCookingV3 = () => {
    const prepMode=cookingModeV3==="prep";
    const progressValue=prepMode?prepSetV3.length:cookedSetV3.length;
    const progressMax=prepMode?allPrepItemsV3.length:COOKING_DISHES_V3.length;
    return <div>
      <Card style={{marginTop:8,padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>{prepMode?"料理备料图鉴":"料理收集"}</span><span>{progressValue}/{progressMax}</span></div><ProgressBar value={progressValue} max={progressMax}/></Card>
      <div style={{display:"flex",gap:5,marginTop:7}}><Pill small active={prepMode} onClick={()=>setCookingModeV3("prep")}>备料图鉴</Pill><Pill small active={!prepMode} onClick={()=>setCookingModeV3("dishes")}>料理收集</Pill></div>
      {prepMode&&<Card style={{marginTop:7,padding:8,background:"#FFF4D8"}}><div style={{fontSize:9.5,fontWeight:950,color:C.darkBrown}}>全料理一次性备料</div><div style={{fontSize:8.5,color:C.muted,lineHeight:1.4,marginTop:2}}>点亮＝已按攻略准备最低需求量；这里只记准备进度，不当库存管理。</div></Card>}
      {prepMode && <>
        <label style={{display:"flex",alignItems:"center",gap:6,margin:"8px 2px 0",fontSize:11,fontWeight:900,color:C.brown}}><input type="checkbox" checked={prepMissingOnlyV3} onChange={e=>setPrepMissingOnlyV3(e.target.checked)}/>只看还没准备的材料</label>
        {COOKING_PREP_GROUPS_V3.map(g=>{const rows=g.items.filter(it=>!prepMissingOnlyV3||!prepSetV3.includes(it[0]));return rows.length?<Card key={g.id} style={{marginTop:8,padding:9,background:g.id==="g5"?"#FFF0D2":C.paper}}><div style={{fontSize:12.5,fontWeight:950,color:C.darkBrown}}>{g.name}</div><div style={{fontSize:9.5,color:C.muted,marginTop:2,lineHeight:1.35}}>{g.desc}</div><div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:7}}>{rows.map(it=>{const [id,name,file,need]=it,on=prepSetV3.includes(id);return <button key={id} onClick={()=>togglePrepV3(id)} style={{position:"relative",border:`2px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,minHeight:82,padding:"5px 2px",cursor:"pointer"}}><div style={{height:35,display:"flex",alignItems:"center",justifyContent:"center"}}><GameIcon file={file} size={34}/></div><div style={{fontSize:9,fontWeight:950,color:C.ink,lineHeight:1.1,marginTop:2}}>{name}</div><span style={{position:"absolute",left:3,top:2,fontSize:8.5,fontWeight:950,color:C.brown,background:"#FFF1C9",borderRadius:6,padding:"1px 3px"}}>×{need}</span><span style={{position:"absolute",right:2,top:1,fontSize:12,color:on?C.green:"#C9B99A",fontWeight:950}}>{on?"✓":"○"}</span></button>})}</div></Card>:null})}
      </>}
      {!prepMode&&<div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:8}}>{COOKING_DISHES_V3.map(it=>{const [id,name,file]=it,on=cookedSetV3.includes(id);return <button key={id} onClick={()=>toggleCookedV3(id)} style={{position:"relative",border:`2px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:8,minHeight:75,padding:"5px 2px",cursor:"pointer"}}><GameIcon file={file} size={34}/><div style={{fontSize:8.8,fontWeight:900,color:C.ink,lineHeight:1.1,marginTop:2}}>{switchNameV47(name,file)}</div><span style={{position:"absolute",right:2,top:1,fontSize:11,color:on?C.green:"#C9B99A"}}>{on?"✓":"○"}</span></button>})}</div>}
    </div>;
  };

'''
s=s[:cook_start]+new_cook+s[paper_start:]

# Paper/journal: split standard progress header from item grid.
paper_start=s.index('''  const renderPaperCollectionV3 =''')
shipping_start=s.index('''  const renderShippingV30 =''',paper_start)
paper_seg=s[paper_start:shipping_start]
old_return='''    return <div>
      <Card style={{marginTop:8,padding:9}}><div style={{fontSize:12,fontWeight:950,color:C.brown,marginBottom:7}}>{title} {list.length}/{total}</div><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>{Array.from({length:total},(_,i)=>i+1).map(n=>{const on=list.includes(n);return <button key={n} onClick={()=>setSelectedPaperV3({kind,n})} style={{position:"relative",border:`1.5px solid ${selected===n?C.orange:on?C.green:C.line}`,background:on?C.lightGreen:C.cream,borderRadius:7,padding:"7px 1px",fontSize:10,fontWeight:900,color:on?C.green:C.brown}}>{n}<span onClick={e=>{e.stopPropagation();updateExtras({[kind]:on?list.filter(x=>x!==n):[...list,n]})}} style={{position:"absolute",right:1,top:0,fontSize:9}}>{on?"✓":"○"}</span></button>})}</div></Card>'''
new_return='''    return <div>
      <Card style={{marginTop:8,padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>{title}</span><span>{list.length}/{total}</span></div><ProgressBar value={list.length} max={total}/></Card><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5,marginTop:8}}>{Array.from({length:total},(_,i)=>i+1).map(n=>{const on=list.includes(n);return <button key={n} onClick={()=>setSelectedPaperV3({kind,n})} style={{position:"relative",border:`1.5px solid ${selected===n?C.orange:on?C.green:C.line}`,background:on?C.lightGreen:C.cream,borderRadius:7,padding:"8px 1px",fontSize:10,fontWeight:900,color:on?C.green:C.brown}}>{n}<span onClick={e=>{e.stopPropagation();updateExtras({[kind]:on?list.filter(x=>x!==n):[...list,n]})}} style={{position:"absolute",right:1,top:0,fontSize:9}}>{on?"✓":"○"}</span></button>})}</div>'''
if old_return not in paper_seg: raise RuntimeError('paper progress block missing')
paper_seg=paper_seg.replace(old_return,new_return,1)
s=s[:paper_start]+paper_seg+s[shipping_start:]

# Social: better data selection, generic cards/icons, concrete missing item icons, service cards.
rep('''    const genericGiftV50=item=>/^(All |Any |Most |Every |Universal )|\\(except|except |items$|category$/i.test(String(item||""));''','''    const genericGiftV50=item=>Boolean(SOCIAL_GENERIC_V55[String(item||"")])||/^(All |Any |Most |Every |Universal )|\\(except|except |items$|category$/i.test(String(item||""));''','generic gift rule')
old_meta='''    const giftMetaV50=item=>{
      const raw=String(item||"");
      const row=lookupRowsV50.find(r=>r?.name===raw||r?.file===raw||r?.zh===raw);
      const generic=genericGiftV50(raw);
      const file=generic?"":(row?.file||raw);
      const canLookup=!generic&&Boolean(row);
      return {raw,file,key:file||raw,name:generic?raw:(socialNameZhV50[raw]||switchNameV47(row?.zh||raw,file)),source:generic?"通用物品分類":row?((row?.sources||[])[0]||"點擊查看詳細用途／來源"):"此項目前沒有獨立物品用途卡",generic,canLookup};
    };'''
new_meta='''    const giftMetaV50=item=>{
      const raw=String(item||"");
      const special=SOCIAL_SPECIAL_ITEM_V55[raw];
      const genericMeta=SOCIAL_GENERIC_V55[raw];
      const row=lookupRowV54(raw)||lookupRowsV50.find(r=>r?.name===raw||r?.file===raw||r?.zh===raw);
      const generic=Boolean(genericMeta)||genericGiftV50(raw);
      const file=genericMeta?.file||special?.file||row?.file||(!generic?raw:"");
      const canLookup=!generic&&!special&&Boolean(row);
      const name=genericMeta?.name||special?.name||socialNameZhV50[raw]||switchNameV47(row?.zh||raw,file);
      const source=generic?"通用喜好分类":special?.source||row?((row?.sources||[])[0]||"点击查看详细用途／来源"):"特殊物品／分类";
      return {raw,file,key:row?.file||file||raw,name,source,generic,canLookup};
    };
    const socialRowsV55=(npc,profile,fallback,cat)=>{const key={loves:"love",likes:"like",hates:"hate"}[cat];const rich=profile?.[cat];const clean=rows=>(rows||[]).filter(x=>!/见百科|見百科/.test(String(x)));if(Array.isArray(rich)){const rows=clean(rich);return rows.length?rows:(SOCIAL_EMPTY_RULES_V55[npc]?.[cat]||[])}return clean(fallback?.[key]||[])};
    const ServicesV55=({npc})=>{const rows=NPC_SERVICES_V55[npc]||[];if(!rows.length)return null;return <div style={{marginTop:9,paddingTop:8,borderTop:`1px dashed ${C.line}`}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><GameIcon file="Workbench" size={25}/><b style={{fontSize:10.5,color:C.darkBrown}}>功能／服务</b></div><div style={{display:"grid",gap:5}}>{rows.map(([file,title,desc])=><div key={title} style={{display:"flex",alignItems:"center",gap:7,border:`1px solid ${C.line}`,background:"#FFF4D8",borderRadius:8,padding:"6px 7px"}}><GameIcon file={file} size={28}/><div style={{minWidth:0}}><b style={{fontSize:8.8,color:C.brown}}>{title}</b><div style={{fontSize:7.5,color:C.ink,lineHeight:1.35,marginTop:2}}>{desc}</div></div></div>)}</div></div>};'''
rep(old_meta,new_meta,'social gift metadata')
# Generic/special cards should still look enabled visually but only concrete lookup cards click through.
rep('''disabled={!m.canLookup} onClick={()=>openLookupV50(item)}''','''disabled={false} onClick={()=>m.canLookup&&openLookupV50(item)}''','gift grid nonlookup display')
rep('''cursor:m.generic?"default":"pointer"''','''cursor:m.canLookup?"pointer":"default"''','gift cursor')
# Rich arrays even when empty, supplemented by explicit rules, not dirty legacy placeholders.
old_rows='''const loves=profile.loves?.length?profile.loves:fallback.love||[];const likes=profile.likes?.length?profile.likes:fallback.like||[];const hates=profile.hates?.length?profile.hates:fallback.hate||[];'''
new_rows='''const loves=socialRowsV55(n,profile,fallback,"loves");const likes=socialRowsV55(n,profile,fallback,"likes");const hates=socialRowsV55(n,profile,fallback,"hates");'''
rep(old_rows,new_rows,'social preference rows')
# Correct Special Orders Board image key.
s=s.replace('''<GameIcon file="Special Orders Board" size={26}/>''','''<GameIcon file="Special order board" size={26}/>''')
# Add services before orders/shop.
rep('''<OrdersV50 orders={profile.orders}/><ShopV50 shop={profile.shop}/>''','''<ServicesV55 npc={n}/><OrdersV50 orders={profile.orders}/><ShopV50 shop={profile.shop}/>''','social services insertion')

# Equipment grouping note to communicate completeness/scope.
rep('''<SectionTitle icon="🏗️">農場設備</SectionTitle>''','''<SectionTitle icon="🏗️">农场设备</SectionTitle><Card style={{padding:"6px 8px",marginBottom:6,background:"#FFF4D8",fontSize:7.8,color:C.muted,lineHeight:1.35}}>按用途分成工匠加工／精炼功能／农务设备；已补裁缝机、电话、迷你冰箱、迷你点唱机、精通雕像、分解机、铁砧、迷你锻造台与蟹笼等实用设施。</Card>''','equipment scope note')

p.write_text(s,encoding='utf-8')

# v55 cache/version bump.
ip=Path('index.html'); h=ip.read_text(encoding='utf-8')
if '?v=54' not in h: raise RuntimeError('v54 version marker missing')
h=h.replace('?v=54','?v=55').replace('<!-- deploy-v54 -->','<!-- deploy-v55 -->')
ip.write_text(h,encoding='utf-8')
sw=Path('sw.js'); w=sw.read_text(encoding='utf-8')
if 'stardew-tracker-v54' not in w: raise RuntimeError('v54 service worker marker missing')
sw.write_text(w.replace('stardew-tracker-v54','stardew-tracker-v55',1),encoding='utf-8')
