/*
 * Stardew wardrobe preview compositor.
 * Uses vanilla farmer sprite sheets at pinned revisions and follows Stardew Valley 1.6 layer logic.
 * Game artwork remains property of ConcernedApe / Stardew Valley.
 */
(function(){
  'use strict';

  const UPSTREAM='https://raw.githubusercontent.com/lybell-art/stardew-dressup/15f7be39b9a1de549595df8102bc7e77b406b605/assets/';
  const GAME='https://raw.githubusercontent.com/shayderrr/stardew_decomp/6fcc1d4d20d14c5be6232d0f9eac1d423222fd84/stardew/unpacked/Characters/Farmer/';
  const SRC={
    male:UPSTREAM+'farmer_base.png',
    female:UPSTREAM+'farmer_girl_base.png',
    hair:UPSTREAM+'hairstyle.png',
    hats:UPSTREAM+'hats.png',
    shirts:UPSTREAM+'shirts.png',
    pants:UPSTREAM+'pants.png',
    shoeColors:GAME+'shoeColors.png'
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

  // Data/Boots shoe-color index (the game recolors base farmer palette entries 268..271 from this row).
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
  const shoeBodyCache=new Map();
  function loadImage(src){
    if(imageCache.has(src)) return imageCache.get(src);
    const promise=new Promise((resolve,reject)=>{
      const img=new Image();img.crossOrigin='anonymous';img.decoding='async';
      img.onload=()=>resolve(img);
      img.onerror=()=>{const fallback=new Image();fallback.decoding='async';fallback.onload=()=>resolve(fallback);fallback.onerror=reject;fallback.src=src;};
      img.src=src;
    });
    imageCache.set(src,promise);return promise;
  }

  function hexColor(value,fallback){const v=String(value||'');return /^#[0-9a-f]{6}$/i.test(v)?v:fallback;}
  function parseShirtIndex(file){const m=String(file||'').match(/^Shirt(\d+)$/i);return m?Number(m[1]):null;}

  function drawCrop(ctx,img,sx,sy,sw,sh,dx,dy,flip,tint){
    if(!img)return;
    const temp=document.createElement('canvas');temp.width=sw;temp.height=sh;
    const t=temp.getContext('2d');t.imageSmoothingEnabled=false;t.clearRect(0,0,sw,sh);t.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);
    if(tint){t.globalCompositeOperation='multiply';t.fillStyle=tint;t.fillRect(0,0,sw,sh);t.globalCompositeOperation='destination-in';t.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);t.globalCompositeOperation='source-over';}
    ctx.save();ctx.imageSmoothingEnabled=false;
    if(flip){ctx.translate(dx+sw,dy);ctx.scale(-1,1);ctx.drawImage(temp,0,0);}else ctx.drawImage(temp,dx,dy);
    ctx.restore();
  }

  function recolorShoes(body,palette,gender,boot){
    const row=BOOT_COLOR_INDEX[boot];
    if(!Number.isFinite(row)||!palette)return body;
    const key=`${gender}:${row}`;if(shoeBodyCache.has(key))return shoeBodyCache.get(key);
    const c=document.createElement('canvas');c.width=body.width;c.height=body.height;
    const x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingEnabled=false;x.drawImage(body,0,0);
    const im=x.getImageData(0,0,c.width,c.height),d=im.data;
    const source=[268,269,270,271].map(p=>[d[p*4],d[p*4+1],d[p*4+2],d[p*4+3]]);
    const pc=document.createElement('canvas');pc.width=palette.width;pc.height=palette.height;
    const px=pc.getContext('2d',{willReadFrequently:true});px.drawImage(palette,0,0);
    const pd=px.getImageData(0,0,pc.width,pc.height).data;
    const rr=Math.max(0,Math.min(palette.height-1,row));
    const target=[0,1,2,3].map(col=>{const p=(rr*palette.width+col)*4;return[pd[p],pd[p+1],pd[p+2],pd[p+3]];});
    for(let p=0;p<d.length;p+=4){
      for(let i=0;i<4;i++){
        const s=source[i];if(d[p]===s[0]&&d[p+1]===s[1]&&d[p+2]===s[2]&&d[p+3]===s[3]){const t=target[i];d[p]=t[0];d[p+1]=t[1];d[p+2]=t[2];d[p+3]=t[3];break;}
      }
    }
    x.putImageData(im,0,0);shoeBodyCache.set(key,c);return c;
  }

  async function draw(canvas,opts){
    if(!canvas)return;
    const token=String(Date.now())+Math.random();canvas.dataset.sdvDrawToken=token;
    const gender=opts?.gender==='male'?'male':'female';
    const directionName=opts?.direction||'front';const direction=DIR[directionName]||DIR.front;
    const [body,hair,hats,shirts,pants,shoeColors]=await Promise.all([
      loadImage(SRC[gender]),loadImage(SRC.hair),loadImage(SRC.hats),loadImage(SRC.shirts),loadImage(SRC.pants),loadImage(SRC.shoeColors)
    ]);
    if(canvas.dataset.sdvDrawToken!==token)return;

    // Native logical pixels at 2x backing. The UI displays only exact 1x/2x multiples for crisp pixels.
    const SCALE=2,LW=24,LH=42;canvas.width=LW*SCALE;canvas.height=LH*SCALE;
    const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.setTransform(SCALE,0,0,SCALE,0,0);ctx.clearRect(0,0,LW,LH);
    const ox=4,oy=6;

    const selected=opts?.selected||{};const db=window.SDVWardrobeV34?.byKey||{};
    const shirtMeta=db.shirt?.[selected.shirt],pantsMeta=db.pants?.[selected.pants],hatMeta=db.hat?.[selected.hat];
    const shirtIdx=shirtMeta?(gender==='female'?shirtMeta.femaleSprite:shirtMeta.maleSprite):parseShirtIndex(selected.shirt);
    const pantsIdx=Number.isFinite(pantsMeta?.sheetIndex)?pantsMeta.sheetIndex:PANTS[selected.pants];
    const hatIdx=Number.isFinite(hatMeta?.index)?hatMeta.index:HATS[selected.hat];
    const hairIdx=Math.max(0,Math.min(55,Number(opts?.hairIndex)||0));const female=gender==='female';
    const dressedBody=recolorShoes(body,shoeColors,gender,selected.boots);

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

    const hx=(hairIdx%8)*16,hy=Math.floor(hairIdx/8)*96+direction.hairY;
    drawCrop(ctx,hair,hx,hy,16,32,ox,oy+(female?2:1),direction.flip,hexColor(opts?.hairColor,'#6a402c'));

    if(Number.isFinite(hatIdx)){
      const hx2=(hatIdx%12)*20,hy2=Math.floor(hatIdx/12)*80+direction.hatY;
      let hatOffset=female?-1:-2;if(directionName==='back')hatOffset-=1;
      drawCrop(ctx,hats,hx2,hy2,20,20,ox-2,oy+hatOffset,false,null);
    }

    if(directionName!=='back')drawCrop(ctx,dressedBody,96,direction.bodyY,16,32,ox,oy,direction.flip,null);
  }

  window.SDVFarmerSpriteV33={draw,SRC,HATS,PANTS,BOOT_COLOR_INDEX};
})();
