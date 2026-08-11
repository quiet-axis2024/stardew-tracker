/*
 * Stardew wardrobe preview compositor.
 * Uses vanilla farmer sprite sheets published by Stardew Dressup at a pinned revision
 * and follows Stardew Valley's farmer layer/frame layout.
 * Game artwork remains property of ConcernedApe / Stardew Valley.
 */
(function(){
  'use strict';

  const UPSTREAM='https://raw.githubusercontent.com/lybell-art/stardew-dressup/15f7be39b9a1de549595df8102bc7e77b406b605/assets/';
  const SRC={
    male:UPSTREAM+'farmer_base.png',
    female:UPSTREAM+'farmer_girl_base.png',
    hair:UPSTREAM+'hairstyle.png',
    hats:UPSTREAM+'hats.png',
    shirts:UPSTREAM+'shirts.png',
    pants:UPSTREAM+'pants.png'
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

  const DIR={
    front:{bodyY:0,shirtY:0,hatY:0,hairY:0,flip:false},
    right:{bodyY:32,shirtY:8,hatY:20,hairY:32,flip:false},
    back:{bodyY:64,shirtY:24,hatY:60,hairY:64,flip:false},
    left:{bodyY:32,shirtY:16,hatY:40,hairY:32,flip:true}
  };

  const imageCache=new Map();
  function loadImage(src){
    if(imageCache.has(src)) return imageCache.get(src);
    const promise=new Promise((resolve,reject)=>{
      const img=new Image();
      img.crossOrigin='anonymous';
      img.decoding='async';
      img.onload=()=>resolve(img);
      img.onerror=()=>{
        const fallback=new Image();
        fallback.decoding='async';
        fallback.onload=()=>resolve(fallback);
        fallback.onerror=reject;
        fallback.src=src;
      };
      img.src=src;
    });
    imageCache.set(src,promise);
    return promise;
  }

  function hexColor(value,fallback){
    const v=String(value||'');
    return /^#[0-9a-f]{6}$/i.test(v)?v:fallback;
  }

  function parseShirtIndex(file){
    const m=String(file||'').match(/^Shirt(\d+)$/i);
    return m?Number(m[1]):null;
  }

  function drawCrop(ctx,img,sx,sy,sw,sh,dx,dy,flip,tint){
    if(!img) return;
    const temp=document.createElement('canvas');
    temp.width=sw; temp.height=sh;
    const t=temp.getContext('2d');
    t.imageSmoothingEnabled=false;
    t.clearRect(0,0,sw,sh);
    t.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);
    if(tint){
      t.globalCompositeOperation='multiply';
      t.fillStyle=tint;
      t.fillRect(0,0,sw,sh);
      t.globalCompositeOperation='destination-in';
      t.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);
      t.globalCompositeOperation='source-over';
    }
    ctx.save();
    if(flip){
      ctx.translate(dx+sw,dy);
      ctx.scale(-1,1);
      ctx.drawImage(temp,0,0);
    }else ctx.drawImage(temp,dx,dy);
    ctx.restore();
  }

  async function draw(canvas,opts){
    if(!canvas) return;
    const token=String(Date.now())+Math.random();
    canvas.dataset.sdvDrawToken=token;
    const gender=opts?.gender==='male'?'male':'female';
    const directionName=opts?.direction||'front';
    const direction=DIR[directionName]||DIR.front;
    const [body,hair,hats,shirts,pants]=await Promise.all([
      loadImage(SRC[gender]),loadImage(SRC.hair),loadImage(SRC.hats),loadImage(SRC.shirts),loadImage(SRC.pants)
    ]);
    if(canvas.dataset.sdvDrawToken!==token) return;

    const SCALE=4, LW=24, LH=42;
    canvas.width=LW*SCALE; canvas.height=LH*SCALE;
    const ctx=canvas.getContext('2d');
    ctx.imageSmoothingEnabled=false;
    ctx.setTransform(SCALE,0,0,SCALE,0,0);
    ctx.clearRect(0,0,LW,LH);
    const ox=4, oy=6;

    const selected=opts?.selected||{};
    const db=window.SDVWardrobeV34?.byKey||{};
    const shirtMeta=db.shirt?.[selected.shirt];
    const pantsMeta=db.pants?.[selected.pants];
    const hatMeta=db.hat?.[selected.hat];
    const shirtIdx=shirtMeta?(gender==='female'?shirtMeta.femaleSprite:shirtMeta.maleSprite):parseShirtIndex(selected.shirt);
    const pantsIdx=Number.isFinite(pantsMeta?.sheetIndex)?pantsMeta.sheetIndex:PANTS[selected.pants];
    const hatIdx=Number.isFinite(hatMeta?.index)?hatMeta.index:HATS[selected.hat];
    const hairIdx=Math.max(0,Math.min(55,Number(opts?.hairIndex)||0));
    const female=gender==='female';

    // In Stardew Valley the back-facing arm layer sits behind the body/clothing.
    if(directionName==='back') drawCrop(ctx,body,96,direction.bodyY,16,32,ox,oy,direction.flip,null);

    // 1. Vanilla farmer body (head/torso/boots).
    drawCrop(ctx,body,0,direction.bodyY,16,32,ox,oy,direction.flip,null);

    // 2. Vanilla pants layer. Left-facing uses the right frame mirrored.
    if(Number.isFinite(pantsIdx)){
      const px=(pantsIdx%10)*192+(female?96:0);
      const py=Math.floor(pantsIdx/10)*688+direction.bodyY;
      drawCrop(ctx,pants,px,py,16,32,ox,oy,direction.flip,opts?.pantsDyeable?hexColor(opts?.pantsColor,'#3f5f99'):null);
    }

    // 3. Vanilla shirt: 8x8 fixed half + 8x8 dye-mask half, four direction frames.
    if(Number.isFinite(shirtIdx)){
      const sx=(shirtIdx%16)*8;
      const sy=Math.floor(shirtIdx/16)*32+direction.shirtY;
      const shirtDY=oy+(female?(directionName==='back'?15:16):(directionName==='back'?14:15));
      drawCrop(ctx,shirts,sx,sy,8,8,ox+4,shirtDY,false,null);
      drawCrop(ctx,shirts,sx+128,sy,8,8,ox+4,shirtDY,false,opts?.shirtDyeable?hexColor(opts?.shirtColor,'#5f8fb8'):null);
    }

    // 4. Vanilla hairstyle. 8 styles per row; each style owns a 16x96 direction strip.
    const hx=(hairIdx%8)*16;
    const hy=Math.floor(hairIdx/8)*96+direction.hairY;
    drawCrop(ctx,hair,hx,hy,16,32,ox,oy+(female?2:1),direction.flip,hexColor(opts?.hairColor,'#6a402c'));

    // 5. Vanilla hat sheet. Each hat is 20x80: front / right / left / back, 20x20 each.
    if(Number.isFinite(hatIdx)){
      const hx2=(hatIdx%12)*20;
      const hy2=Math.floor(hatIdx/12)*80+direction.hatY;
      let hatOffset=female?-1:-2;
      if(directionName==='back') hatOffset-=1;
      drawCrop(ctx,hats,hx2,hy2,20,20,ox-2,oy+hatOffset,false,null);
    }

    // 6. Front/side vanilla arm layer sits on top.
    if(directionName!=='back') drawCrop(ctx,body,96,direction.bodyY,16,32,ox,oy,direction.flip,null);
  }

  window.SDVFarmerSpriteV33={draw,SRC,HATS,PANTS};
})();
