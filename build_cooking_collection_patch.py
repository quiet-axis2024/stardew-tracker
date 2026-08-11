from pathlib import Path
import sys, re

path = Path(sys.argv[1] if len(sys.argv) > 1 else 'build/entry.jsx')
s = path.read_text(encoding='utf-8')

def repl(old, new, label):
    global s
    if old not in s:
        raise SystemExit(f'build_cooking_collection_patch: marker not found: {label}')
    s = s.replace(old, new, 1)

# ---- 1.6 Cooking: 88 distinct preparation entries needed to cook all 81 dishes once ----
anchor = 'const SPECIAL_ITEMS_V2 = ['
defs = r'''
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
'''
repl(anchor, defs + '\n' + anchor, 'cooking definitions')

# ---- state ----
state_old = '''  const [powerSection, setPowerSection] = useState("special");
  const [collectionSection, setCollectionSection] = useState("dex");
  const profileInputRef = useRef(null);'''
state_new = '''  const [powerSection, setPowerSection] = useState("special");
  const [collectionSection, setCollectionSection] = useState("dex");
  const [cookingMode, setCookingMode] = useState("ingredients");
  const [cookingGroup, setCookingGroup] = useState("all");
  const [cookingMissingOnly, setCookingMissingOnly] = useState(false);
  const [recipeQuery, setRecipeQuery] = useState("");
  const [recipeFilter, setRecipeFilter] = useState("all");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const profileInputRef = useRef(null);'''
repl(state_old, state_new, 'cooking states')

# ---- helper functions: insert before existing renderPowers ----
insert_at = s.index('  const renderPowers = () => {')
helpers = r'''
  const preparedIngredientsV3 = data.cookingIngredientsV3 || [];
  const cookedRecipesV3 = data.cookedRecipesV3 || [];
  const ingredientPreparedV3 = name => preparedIngredientsV3.includes(name);
  const togglePreparedIngredientV3 = name => update({cookingIngredientsV3:ingredientPreparedV3(name)?preparedIngredientsV3.filter(x=>x!==name):[...preparedIngredientsV3,name]});
  const recipeCookedV3 = name => cookedRecipesV3.includes(name);
  const toggleCookedRecipeV3 = name => update({cookedRecipesV3:recipeCookedV3(name)?cookedRecipesV3.filter(x=>x!==name):[...cookedRecipesV3,name]});
  const missingForRecipeV3 = recipe => recipe.ingredients.filter(x=>!ingredientPreparedV3(x));

  const renderCookingHubV3 = () => {
    const groups = cookingGroup==="all" ? COOKING_INGREDIENTS_V3 : COOKING_INGREDIENTS_V3.filter(x=>x.group===cookingGroup);
    const visibleIngredients = cookingMissingOnly ? groups.filter(x=>!ingredientPreparedV3(x.name)) : groups;
    const q=recipeQuery.trim().toLowerCase();
    const visibleRecipes=COOKING_RECIPES_V3.filter(r=>{
      if(q && !(r.name.toLowerCase().includes(q)||r.file.toLowerCase().includes(q)))return false;
      const ready=missingForRecipeV3(r).length===0;
      if(recipeFilter==="ready"&&!ready)return false;
      if(recipeFilter==="missing"&&ready)return false;
      if(recipeFilter==="uncooked"&&recipeCookedV3(r.name))return false;
      return true;
    });
    const readyCount=COOKING_RECIPES_V3.filter(r=>missingForRecipeV3(r).length===0).length;
    return <div style={{marginTop:8}}>
      <Card style={{padding:9,background:"#FFF4D8"}}><div style={{fontSize:11,fontWeight:950,color:C.brown}}>一次备齐全料理</div><div style={{fontSize:10.5,color:C.muted,lineHeight:1.45,marginTop:3}}>按 1.6 全料理食材表整理：共 88 种项目，包含 6 个要先做好的中间料理。这里只记“已经准备好／还缺”，不用维护库存数量；角落的 ×N 是做完全部料理一次所需的静态参考量。</div><div style={{marginTop:6,fontSize:11,fontWeight:900,color:C.green}}>已备 {preparedIngredientsV3.length}/88 · 当前可直接做 {readyCount}/81 道 · 已亲手烹饪 {cookedRecipesV3.length}/81</div></Card>
      <div style={{display:"flex",gap:5,marginTop:8}}><Pill active={cookingMode==="ingredients"} onClick={()=>setCookingMode("ingredients")}>食材准备</Pill><Pill active={cookingMode==="recipes"} onClick={()=>setCookingMode("recipes")}>料理图鉴</Pill></div>
      {cookingMode==="ingredients" && <>
        <div style={{display:"flex",gap:4,overflowX:"auto",padding:"7px 0",WebkitOverflowScrolling:"touch"}}><Pill small active={cookingGroup==="all"} onClick={()=>setCookingGroup("all")}>全部</Pill>{COOKING_INGREDIENT_GROUPS_V3.map(g=><Pill key={g.id} small active={cookingGroup===g.id} onClick={()=>setCookingGroup(g.id)}>{g.name}</Pill>)}</div>
        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:10.5,fontWeight:900,color:C.brown,marginBottom:7}}><input type="checkbox" checked={cookingMissingOnly} onChange={e=>setCookingMissingOnly(e.target.checked)}/>只看还没准备的</label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:6}}>{visibleIngredients.map(it=>{const on=ingredientPreparedV3(it.name);return <button key={it.name} onClick={()=>togglePreparedIngredientV3(it.name)} style={{position:"relative",minHeight:84,border:`2px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,padding:"6px 2px",boxShadow:`0 2px 5px ${C.shadow}`,cursor:"pointer"}}><GameIcon file={it.file} size={36}/><div style={{fontSize:9.3,fontWeight:900,color:C.ink,lineHeight:1.1,marginTop:3}}>{it.name}</div><span style={{position:"absolute",left:3,top:2,fontSize:8.5,fontWeight:900,color:C.muted}}>×{it.need}</span><span style={{position:"absolute",right:3,top:2,fontSize:13,fontWeight:950,color:on?C.green:"#C9B99A"}}>{on?"✓":"○"}</span></button>})}</div>
      </>}
      {cookingMode==="recipes" && <>
        <div style={{marginTop:8,display:"grid",gridTemplateColumns:"1fr",gap:6}}><input value={recipeQuery} onChange={e=>setRecipeQuery(e.target.value)} placeholder="搜料理名称……" style={{border:`1.5px solid ${C.line}`,background:"#FFFCF0",borderRadius:8,padding:"7px 9px",fontSize:11,color:C.ink}}/><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{[["all","全部"],["ready","可做"],["missing","缺材料"],["uncooked","未烹饪"]].map(([k,n])=><Pill key={k} small active={recipeFilter===k} onClick={()=>setRecipeFilter(k)}>{n}</Pill>)}</div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:7,marginTop:8}}>{visibleRecipes.map(r=>{const missing=missingForRecipeV3(r);const ready=!missing.length;const cooked=recipeCookedV3(r.name);return <Card key={r.name} style={{padding:8,background:cooked?"#E5F3CF":ready?"#FFF1CF":C.paper,borderColor:cooked?C.green:ready?C.orange:C.line}}><div style={{display:"flex",gap:7,alignItems:"flex-start"}}><GameIcon file={r.file} size={40}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:11.5,color:C.ink}}>{r.name}</b><div style={{fontSize:9.5,fontWeight:900,color:ready?C.green:C.red,marginTop:2}}>{ready?"✓ 材料已齐":`缺：${missing.join("、")}`}</div></div><button onClick={()=>toggleCookedRecipeV3(r.name)} title="标记是否已经亲自烹饪" style={{border:0,background:"transparent",fontSize:15,fontWeight:950,color:cooked?C.green:"#C9B99A",padding:0}}>{cooked?"✓":"○"}</button></div></Card>})}</div>
      </>}
    </div>;
  };

  const renderPaperCollectionV3 = (kind,total,title) => {
    const list=extrasState[kind]||[];
    const isNote=kind==="notes";
    const selected=selectedPaper?.kind===kind?selectedPaper.n:null;
    const hasImage=n=>isNote?SECRET_NOTE_IMAGE_NUMBERS_V3.has(n):JOURNAL_SCRAP_IMAGE_NUMBERS_V3.has(n);
    const imageFile=n=>isNote?`SecretNote${n}`:`JournalScrap${n}`;
    const baseFile=isNote?"Secret Note Icon":"Journal Scrap";
    const baseUrl=isNote?"https://stardewvalleywiki.com/Secret_Notes":"https://stardewvalleywiki.com/Journal_Scraps";
    return <div style={{marginTop:8}}><Card style={{padding:9}}><div style={{fontSize:12,fontWeight:900,color:C.brown,marginBottom:7}}>{title} {list.length}/{total}</div><div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>{Array.from({length:total},(_,i)=>i+1).map(n=>{const on=list.includes(n);return <button key={n} onClick={()=>setSelectedPaper(selected===n?null:{kind,n})} style={{position:"relative",border:`1.5px solid ${selected===n?C.orange:on?C.green:C.line}`,background:on?C.lightGreen:C.cream,borderRadius:8,padding:"5px 2px",minHeight:58,color:on?C.green:C.brown,cursor:"pointer"}}><GameIcon file={baseFile} size={28}/><div style={{fontSize:9.5,fontWeight:900}}>#{n}</div><button onClick={e=>{e.stopPropagation();updateExtras({[kind]:on?list.filter(x=>x!==n):[...list,n]})}} style={{position:"absolute",right:1,top:1,border:0,background:"transparent",fontSize:11,color:on?C.green:"#C9B99A",fontWeight:950}}>{on?"✓":"○"}</button></button>})}</div></Card>{selected&&<Card style={{marginTop:8,padding:10,background:"#FFF7DF"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><b style={{fontSize:13,color:C.darkBrown}}>{title} #{selected}</b><a href={`${baseUrl}#${isNote?`Secret_Note_#${selected}`:`Journal_Scrap_#${selected}`}`} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:C.blue,fontWeight:900,textDecoration:"none"}}>百科完整内容 ↗</a></div>{hasImage(selected)?<div style={{display:"flex",justifyContent:"center",marginTop:8}}><img src={GAME_FILE(imageFile(selected))} alt={`${title} ${selected}`} style={{width:216,maxWidth:"100%",height:"auto",imageRendering:"pixelated"}}/></div>:<div style={{marginTop:8,padding:14,border:`2px solid ${C.line}`,borderRadius:7,background:"#F6E8C6",fontSize:11,color:C.brown,lineHeight:1.5,textAlign:"center"}}>这张在游戏里是文字型纸条，Wiki 没有独立的 216×216 原图素材；这里保留游戏纸条图标并提供对应内容入口。图像型纸条则直接显示游戏原图。</div>}</Card>}</div>;
  };

'''
s = s[:insert_at] + helpers + s[insert_at:]

# ---- replace collection wrapper with icon-rich player-menu style and integrated cooking ----
start = s.index('  const renderCollection = () => <div>')
end = s.index('\n  const buildSummary = () => {', start)
wrapper = r'''  const renderCollection = () => {
    const nav=[
      ["dex","图鉴"],["achievements","成就"],["shipping","出货"],["cooking","烹饪"],["letters","信件"],["notes","秘密纸条"],["scraps","日志残页"]
    ];
    return <div>
      <SectionTitle icon="📖">收集品</SectionTitle>
      <Card style={{padding:8,background:"#FFF4D8",fontSize:10.5,color:C.muted,lineHeight:1.4}}>对应游戏「+ → 收集品」。子页按钮与内页尽量使用游戏原始图案；烹饪页同时放“料理图鉴＋一次备齐食材”。</Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,padding:"8px 0 3px"}}>{nav.map(([k,n])=><button key={k} onClick={()=>setCollectionSection(k)} style={{border:`2px solid ${collectionSection===k?C.orange:C.line}`,background:collectionSection===k?"#FFE1B6":C.paper,borderRadius:9,padding:"6px 2px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:C.ink,fontWeight:900,fontSize:9.5,cursor:"pointer"}}><GameIcon file={COLLECTION_PAGE_ICONS_V3[k]} size={30}/><span>{n}</span></button>)}</div>
      {collectionSection==="dex"&&renderDexCollection()}
      {collectionSection==="achievements"&&renderAchievements()}
      {collectionSection==="shipping"&&<Card style={{marginTop:8}}><div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file="Shipping Bin" size={36}/><div><div style={{fontSize:12,fontWeight:900,color:C.brown}}>出货收集进度</div><div style={{fontSize:10.5,color:C.muted}}>游戏会逐项记录真正通过出货箱卖出的收集品。</div></div></div><div style={{marginTop:7}}><NumInput value={Number(extrasState.shippedCount||0)} max={999} onChange={v=>updateExtras({shippedCount:v})} suffix="项"/></div></Card>}
      {collectionSection==="cooking"&&renderCookingHubV3()}
      {collectionSection==="letters"&&<Card style={{marginTop:8}}><div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file="Letter" size={34}/><div style={{fontSize:12,fontWeight:900,color:C.brown}}>信件</div></div><textarea value={extrasState.lettersNote||""} onChange={e=>updateExtras({lettersNote:e.target.value})} placeholder="记录还想核对的信件、配方信件、奖励信件……" style={{width:"100%",minHeight:120,marginTop:6,border:`1.5px solid ${C.line}`,borderRadius:7,padding:7,background:"#FFFCF0",fontSize:11,color:C.ink}}/></Card>}
      {collectionSection==="notes"&&renderPaperCollectionV3("notes",27,"秘密纸条")}
      {collectionSection==="scraps"&&renderPaperCollectionV3("scraps",11,"日志残页")}
    </div>;
  };
'''
s = s[:start] + wrapper + s[end:]

# ---- remove standalone fridge bottom tab; fridge is now inside Collections > Cooking ----
s = s.replace('  { id: "fridge", name: "冰箱", icon: "🧊", file: "Mini-Fridge" },\n','')
s = s.replace(',fridge:renderFridge','')

path.write_text(s,encoding='utf-8')
print('build_cooking_collection_patch: cooking checklist, recipe readiness, collection icons, note images, and integrated fridge concept applied')
