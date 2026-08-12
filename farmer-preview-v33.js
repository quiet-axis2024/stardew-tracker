/*
 * Stardew wardrobe preview compositor.
 * Uses vanilla Stardew Valley 1.6 farmer assets and follows the game's layer/palette layout.
 * Game artwork remains property of ConcernedApe / Stardew Valley.
 */
(function(){
  'use strict';

  const GAME='https://raw.githubusercontent.com/shayderrr/stardew_decomp/6fcc1d4d20d14c5be6232d0f9eac1d423222fd84/stardew/unpacked/Characters/Farmer/';
  const SRC={
    male:GAME+'farmer_base.png',
    female:GAME+'farmer_girl_base.png',
    hair:GAME+'hairstyles.png',
    hats:GAME+'hats.png',
    accessories:GAME+'accessories.png',
    shirts:GAME+'shirts.png',
    pants:GAME+'pants.png',
    shoeColors:GAME+'shoeColors.png',
    skinColors:GAME+'skinColors.png'
  };

  const HATS={
    'Cowboy Hat':0,'Bowler Hat':1,'Top Hat':2,'Sombrero':3,'Straw Hat':4,'Official Cap':5,'Blue Bonnet':6,'Plum Chapeau':7,
    'Hard Hat':27,"Sou'wester":28,'Daisy':29,'Watermelon Band':30,'Mouse Ears':31,'Cat Ears':32,'Cowgal Hat':33,'Cowpoke Hat':34,"Archer's Cap":35,
    'Blue Cowboy Hat':37,'Red Cowboy Hat':38,'Cone Hat':39,'Elegant Turban':64,'White Turban':65,'Garbage Hat':66,'Golden Mask':67,'Propeller Hat':68,
    'Bridal Veil':69,'Witch Hat':70,'Copper Pan':71,'Green Turban':72,'Magic Cowboy Hat':73,'Magic Turban':74,'Golden Helmet':75,'Deluxe Pirate Hat':76,
    'Pink Bow':77,'Frog Hat':78,'Small Cap':79,'Bluebird Mask':80,'Deluxe Cowboy Hat':81,"Mr. Qi's Hat":82,'Dark Cowboy Hat':83
  };
  const PANTS={
    'Farmer Pants':0,'Shorts':1,'Long Dress':2,'Skirt':3,'Pleated Skirt':4,'Dinosaur Pants':5,'Grass Skirt':6,
    'Genie Pants':8,'Baggy Pants':10,'Simple Dress':11,'Relaxed Fit Pants':12,'Relaxed Fit Shorts':13,
    'Prismatic Pants':0,'Prismatic Genie Pants':8
  };
  const BOOT_COLOR_INDEX={
    'Sneakers':0,'Rubber Boots':1,'Leather Boots':2,'Work Boots':3,'Combat Boots':4,'Tundra Boots':5,
    'Thermal Boots':6,'Dark Boots':7,'Firewalker Boots':8,'Genie Shoes':9,'Space Boots':10,'Cowboy Boots':11,
    "Emily's Magic Boots":13,'Leprechaun Shoes':14,'Cinderclown Shoes':15,'Mermaid Boots':16,'Dragonscale Boots':17,'Crystal Shoes':18
  };
  const DIR={
    front:{bodyY:0,shirtY:0,hatY:0,hairY:0,flip:false},
    right:{bodyY:32,shirtY:8,hatY:20,hairY:32,flip:false},
    back:{bodyY:64,shirtY:24,hatY:60,hairY:64,flip:false},
    left:{bodyY:32,shirtY:16,hatY:40,hairY:32,flip:true}
  };

  const imageCache=new Map();
  const bodyCache=new Map();
  function loadImage(src){
    if(imageCache.has(src))return imageCache.get(src);
    const promise=new Promise((resolve,reject)=>{
      const img=new Image();img.crossOrigin='anonymous';img.decoding='async';
      img.onload=()=>resolve(img);img.onerror=reject;img.src=src;
    });
    imageCache.set(src,promise);return promise;
  }
  function hexColor(value,fallback){const v=String(value||'');return /^#[0-9a-f]{6}$/i.test(v)?v:fallback;}
  function rgbFromHex(value){const m=String(value||'').match(/^#([0-9a-f]{6})$/i);if(!m)return null;const n=parseInt(m[1],16);return[(n>>16)&255,(n>>8)&255,n&255,255];}
  function hexFromRgb(c){return '#'+c.slice(0,3).map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function darkerEye(c){
    const brightness=-75;
    return [clamp(c[0]+brightness,0,255),clamp(c[1]+brightness,0,255),clamp(c[2]+Math.round(brightness*8/7),0,255),255];
  }
  function parseShirtIndex(file){const m=String(file||'').match(/^Shirt(\d+)$/i);return m?Number(m[1]):null;}

  function drawCrop(ctx,img,sx,sy,sw,sh,dx,dy,flip,tint){
    if(!img)return;
    const temp=document.createElement('canvas');temp.width=sw;temp.height=sh;
    const t=temp.getContext('2d');t.imageSmoothingEnabled=false;t.clearRect(0,0,sw,sh);t.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);
    if(tint){
      t.globalCompositeOperation='multiply';t.fillStyle=tint;t.fillRect(0,0,sw,sh);
      t.globalCompositeOperation='destination-in';t.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);t.globalCompositeOperation='source-over';
    }
    ctx.save();ctx.imageSmoothingEnabled=false;
    if(flip){ctx.translate(dx+sw,dy);ctx.scale(-1,1);ctx.drawImage(temp,0,0);}else ctx.drawImage(temp,dx,dy);
    ctx.restore();
  }

  function paletteRows(img){
    const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
    const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0);
    return {data:x.getImageData(0,0,c.width,c.height).data,width:c.width,height:c.height};
  }
  function recolorBody(body,skinPalette,shoePalette,gender,skinIndex,eyeColor,boot){
    const eye=rgbFromHex(eyeColor);
    const skin=Number.isFinite(Number(skinIndex))?Number(skinIndex):0;
    const shoe=BOOT_COLOR_INDEX[boot];
    const key=[gender,skin,eyeColor||'',Number.isFinite(shoe)?shoe:'base'].join(':');
    if(bodyCache.has(key))return bodyCache.get(key);

    const c=document.createElement('canvas');c.width=body.width;c.height=body.height;
    const x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingEnabled=false;x.drawImage(body,0,0);
    const im=x.getImageData(0,0,c.width,c.height),d=im.data;
    const sourceAt=i=>[d[i*4],d[i*4+1],d[i*4+2],d[i*4+3]];
    const sources={
      skin:[260,261,262].map(sourceAt),
      shoe:[268,269,270,271].map(sourceAt),
      eye:[276,277].map(sourceAt)
    };
    const swap=(source,target)=>{
      if(!source||!target)return;
      for(let p=0;p<d.length;p+=4){if(d[p]===source[0]&&d[p+1]===source[1]&&d[p+2]===source[2]&&d[p+3]===source[3]){d[p]=target[0];d[p+1]=target[1];d[p+2]=target[2];d[p+3]=target[3];}}
    };

    if(skinPalette){
      const pal=paletteRows(skinPalette);const row=clamp(Math.round(skin),0,Math.max(0,pal.height-1));
      for(let i=0;i<3;i++){const p=(row*pal.width+i)*4;swap(sources.skin[i],[pal.data[p],pal.data[p+1],pal.data[p+2],pal.data[p+3]]);}
    }
    if(eye){
      const dark=darkerEye(eye);
      swap(sources.eye[0],eye);swap(sources.eye[1],dark);
    }
    if(shoePalette&&Number.isFinite(shoe)){
      const pal=paletteRows(shoePalette);const row=clamp(shoe,0,Math.max(0,pal.height-1));
      for(let i=0;i<4;i++){const p=(row*pal.width+i)*4;swap(sources.shoe[i],[pal.data[p],pal.data[p+1],pal.data[p+2],pal.data[p+3]]);}
    }
    x.putImageData(im,0,0);bodyCache.set(key,c);return c;
  }

  function accessoryInfo(index){
    const n=Number(index);
    const valid=Number.isFinite(n)&&n>=0;
    return {index:valid?Math.floor(n):-1,facial:valid&&(n<6||(n>=19&&n<=22)),below:valid&&(n<8||(n>=19&&n<=22))};
  }
  function drawAccessory(ctx,accessories,index,directionName,ox,oy,hairColor,belowPass){
    const info=accessoryInfo(index);if(info.index<0||directionName==='back'||info.below!==belowPass)return;
    const perRow=Math.max(1,Math.floor(accessories.width/16));
    const sx=(info.index%perRow)*16;
    let sy=Math.floor(info.index/perRow)*32;
    if(directionName==='right'||directionName==='left')sy+=16;
    drawCrop(ctx,accessories,sx,sy,16,16,ox,oy+1,directionName==='left',info.facial?hairColor:null);
  }

  async function getAppearanceMeta(){
    const [hair,skin,accessories,body]=await Promise.all([loadImage(SRC.hair),loadImage(SRC.skinColors),loadImage(SRC.accessories),loadImage(SRC.female)]);
    const hairCount=Math.max(1,Math.floor(hair.width/16)*Math.floor(hair.height/96));
    const skinCount=Math.max(1,skin.height);
    const accessoryCount=Math.max(1,Math.floor(accessories.width/16)*Math.floor(accessories.height/32));
    const c=document.createElement('canvas');c.width=body.width;c.height=body.height;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(body,0,0);
    const d=x.getImageData(0,0,c.width,c.height).data,p=276*4;
    return {hairCount,skinCount,accessoryCount,defaultEyeColor:hexFromRgb([d[p],d[p+1],d[p+2],255])};
  }

  async function draw(canvas,opts){
    if(!canvas)return;
    const token=String(Date.now())+Math.random();canvas.dataset.sdvDrawToken=token;
    const gender=opts?.gender==='male'?'male':'female';
    const directionName=opts?.direction||'front';const direction=DIR[directionName]||DIR.front;
    const [body,hair,hats,accessories,shirts,pants,shoeColors,skinColors]=await Promise.all([
      loadImage(SRC[gender]),loadImage(SRC.hair),loadImage(SRC.hats),loadImage(SRC.accessories),loadImage(SRC.shirts),loadImage(SRC.pants),loadImage(SRC.shoeColors),loadImage(SRC.skinColors)
    ]);
    if(canvas.dataset.sdvDrawToken!==token)return;

    const SCALE=2,LW=24,LH=42;canvas.width=LW*SCALE;canvas.height=LH*SCALE;
    const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.setTransform(SCALE,0,0,SCALE,0,0);ctx.clearRect(0,0,LW,LH);
    const ox=4,oy=6;
    const selected=opts?.selected||{},db=window.SDVWardrobeV34?.byKey||{};
    const shirtMeta=db.shirt?.[selected.shirt],pantsMeta=db.pants?.[selected.pants],hatMeta=db.hat?.[selected.hat];
    const shirtIdx=shirtMeta?(gender==='female'?shirtMeta.femaleSprite:shirtMeta.maleSprite):parseShirtIndex(selected.shirt);
    const pantsIdx=Number.isFinite(pantsMeta?.sheetIndex)?pantsMeta.sheetIndex:PANTS[selected.pants];
    const hatIdx=Number.isFinite(hatMeta?.index)?hatMeta.index:HATS[selected.hat];
    const hairPerRow=Math.max(1,Math.floor(hair.width/16));
    const hairRows=Math.max(1,Math.floor(hair.height/96));
    const hairMax=hairPerRow*hairRows-1;
    const hairIdx=clamp(Number(opts?.hairIndex)||0,0,hairMax);
    const female=gender==='female';
    const hairTint=hexColor(opts?.hairColor,'#6a402c');
    const dressedBody=recolorBody(body,skinColors,shoeColors,gender,Number(opts?.skinIndex)||0,opts?.eyeColor,selected.boots);

    if(directionName==='back')drawCrop(ctx,dressedBody,96,direction.bodyY,16,32,ox,oy,direction.flip,null);
    drawCrop(ctx,dressedBody,0,direction.bodyY,16,32,ox,oy,direction.flip,null);

    if(Number.isFinite(pantsIdx)){
      const px=(pantsIdx%10)*192+(female?96:0),py=Math.floor(pantsIdx/10)*688+direction.bodyY;
      drawCrop(ctx,pants,px,py,16,32,ox,oy,direction.flip,opts?.pantsDyeable?hexColor(opts?.pantsColor,'#3f5f99'):null);
    }
    if(Number.isFinite(shirtIdx)){
      const sx=(shirtIdx%16)*8,sy=Math.floor(shirtIdx/16)*32+direction.shirtY;
      const shirtDY=oy+(female?(directionName==='back'?15:16):(directionName==='back'?14:15));
      drawCrop(ctx,shirts,sx,sy,8,8,ox+4,shirtDY,false,null);
      drawCrop(ctx,shirts,sx+128,sy,8,8,ox+4,shirtDY,false,opts?.shirtDyeable?hexColor(opts?.shirtColor,'#5f8fb8'):null);
    }

    drawAccessory(ctx,accessories,opts?.accessoryIndex,directionName,ox,oy,hairTint,true);
    const hx=(hairIdx%hairPerRow)*16,hy=Math.floor(hairIdx/hairPerRow)*96+direction.hairY;
    const hairYOffset=(female?((hairIdx<16)?2:1):((hairIdx>=16)?0:1));
    drawCrop(ctx,hair,hx,hy,16,32,ox,oy+hairYOffset,direction.flip,hairTint);
    drawAccessory(ctx,accessories,opts?.accessoryIndex,directionName,ox,oy,hairTint,false);

    if(Number.isFinite(hatIdx)){
      const hatsPerRow=Math.max(1,Math.floor(hats.width/20));
      const hx2=(hatIdx%hatsPerRow)*20,hy2=Math.floor(hatIdx/hatsPerRow)*80+direction.hatY;
      let hatOffset=female?-1:-2;if(directionName==='back')hatOffset-=1;
      drawCrop(ctx,hats,hx2,hy2,20,20,ox-2,oy+hatOffset,false,null);
    }
    if(directionName!=='back')drawCrop(ctx,dressedBody,96,direction.bodyY,16,32,ox,oy,direction.flip,null);
  }

  window.SDVFarmerSpriteV33={draw,getAppearanceMeta,SRC,HATS,PANTS,BOOT_COLOR_INDEX};
})();
