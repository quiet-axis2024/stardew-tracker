/* Stardew Valley horse/pet wardrobe preview.
 * Pet variants use the six vanilla cat/dog sheets (cat..cat5, dog..dog5).
 * Cat/dog hats follow Pet.drawHat() and use hats_animals.png.
 * Horse hats follow Horse.draw(): normal hat texture, standing-facing positions,
 * and vanilla per-hat corrections. Game artwork © ConcernedApe.
 */
(function(){
  'use strict';
  const PIN='6fcc1d4d20d14c5be6232d0f9eac1d423222fd84';
  const RAW=`https://raw.githubusercontent.com/shayderrr/stardew_decomp/${PIN}/stardew/unpacked/`;
  const ANIMAL_HATS=RAW+'Characters/Farmer/hats_animals.png';
  const cache=new Map();
  function load(src){
    if(cache.has(src))return cache.get(src);
    const p=new Promise((resolve,reject)=>{const i=new Image();i.crossOrigin='anonymous';i.decoding='async';i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});
    cache.set(src,p);return p;
  }
  function crop(ctx,img,sx,sy,sw,sh,dx,dy,flip=false){
    ctx.save();
    if(flip){ctx.translate(dx+sw,dy);ctx.scale(-1,1);ctx.drawImage(img,sx,sy,sw,sh,0,0,sw,sh)}
    else ctx.drawImage(img,sx,sy,sw,sh,dx,dy,sw,sh);
    ctx.restore();
  }
  const HAT_FRAME_Y={front:0,right:20,left:40,back:60};
  const FRAME={
    horse:{front:{sy:0,flip:false},right:{sy:32,flip:false},back:{sy:64,flip:false},left:{sy:32,flip:true}},
    cat:{front:{sy:0,flip:false},right:{sy:32,flip:false},back:{sy:64,flip:false},left:{sy:96,flip:false}},
    dog:{front:{sy:0,flip:false},right:{sy:32,flip:false},back:{sy:64,flip:false},left:{sy:96,flip:false}}
  };
  // Converted from vanilla Pet.drawHat() standing frames into raw 32px-sheet coordinates.
  const PET_HAT_POS={
    cat:{front:[6.5,10],right:[12.25,8],back:[6.5,2],left:[1,8]},
    dog:{front:[6.5,5],right:[13,4],back:[6.5,-1],left:[0,4]}
  };
  // Converted from vanilla Horse.draw() world coordinates. The horse itself is rendered at 4x;
  // Hat.draw() also resolves to 4x here, so these are raw-pixel offsets relative to a 32x32 horse frame.
  const HORSE_HAT_POS={front:[7,9],right:[16,1],back:[6.5,-7],left:[-4,1]};
  function horseHatAdjustment(index,dir){
    let x=0,y=0,hide=false;
    if(index===14&&dir==='back')hide=true;
    if(index===6){y+=2;if(dir==='front')y-=1;}
    if(index===10){y+=3;if(dir==='back')hide=true;}
    if((index===9||index===32)&&(dir==='back'||dir==='front'))y+=1;
    if(index===31)y+=1;
    if((index===39||index===11)&&(dir==='left'||dir==='right'))x+=dir==='left'?2:-2;
    if(index===26&&(dir==='left'||dir==='right'))x+=dir==='left'?1:-1;
    if((index===67||index===56)&&dir==='back')hide=true;
    return {x,y,hide};
  }
  function petSrc(kind,variant){
    const v=Math.max(0,Math.min(5,Number(variant)||0));
    return RAW+`Animals/${kind}${v===0?'':v}.png`;
  }
  async function draw(canvas,opts){
    if(!canvas)return;
    const kind=(opts?.type==='cat'||opts?.type==='dog')?opts.type:'horse';
    const variant=kind==='horse'?0:Math.max(0,Math.min(5,Number(opts?.variant)||0));
    const dir=FRAME[kind][opts?.direction]?opts.direction:'front';
    const token=String(Date.now())+Math.random();canvas.dataset.sdvAnimalToken=token;
    const farmerHats=window.SDVFarmerSpriteV33?.SRC?.hats;
    const hatSrc=kind==='horse'?farmerHats:ANIMAL_HATS;
    const src=kind==='horse'?RAW+'Animals/horse.png':petSrc(kind,variant);
    const [animal,hats]=await Promise.all([load(src),hatSrc?load(hatSrc):Promise.resolve(null)]);
    if(canvas.dataset.sdvAnimalToken!==token)return;
    const SCALE=2,W=52,H=48;canvas.width=W*SCALE;canvas.height=H*SCALE;
    const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.setTransform(SCALE,0,0,SCALE,0,0);ctx.clearRect(0,0,W,H);
    const f=FRAME[kind][dir],ax=10,ay=12;
    crop(ctx,animal,0,f.sy,32,32,ax,ay,f.flip);
    const hatIndex=window.SDVWardrobeV34?.byKey?.hat?.[opts?.hat]?.index ?? window.SDVFarmerSpriteV33?.HATS?.[opts?.hat];
    if(!hats||!Number.isFinite(hatIndex))return;
    const hx=(hatIndex%12)*20,hy=Math.floor(hatIndex/12)*80+HAT_FRAME_Y[dir];
    if(kind==='horse'){
      const adj=horseHatAdjustment(hatIndex,dir);if(adj.hide)return;
      const p=HORSE_HAT_POS[dir];
      crop(ctx,hats,hx,hy,20,20,ax+p[0]+adj.x,ay+p[1]+adj.y,false);
    }else{
      const p=PET_HAT_POS[kind][dir];
      crop(ctx,hats,hx,hy,20,20,ax+p[0],ay+p[1],false);
    }
  }
  window.SDVAnimalSpriteV33={draw,petSrc};
})();
