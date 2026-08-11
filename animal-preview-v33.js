/* Real Stardew Valley horse/pet preview frames. Game artwork © ConcernedApe. */
(function(){
  'use strict';
  const GAME='https://raw.githubusercontent.com/shayderrr/stardew_decomp/6fcc1d4d20d14c5be6232d0f9eac1d423222fd84/stardew/unpacked/Animals/';
  const TYPES={
    horse:{src:GAME+'horse.png',hatY:{front:0,right:20,back:60,left:40},hatPos:{front:[10,-1],right:[15,0],back:[10,-3],left:[5,0]}},
    cat:{src:GAME+'cat.png',hatY:{front:0,right:20,back:60,left:40},hatPos:{front:[10,0],right:[13,1],back:[10,-1],left:[7,1]}},
    dog:{src:GAME+'dog.png',hatY:{front:0,right:20,back:60,left:40},hatPos:{front:[10,-1],right:[13,0],back:[10,-2],left:[7,0]}}
  };
  const ROW={front:0,right:1,back:2,left:3};
  const cache=new Map();
  function load(src){
    if(cache.has(src)) return cache.get(src);
    const p=new Promise((resolve,reject)=>{const i=new Image();i.crossOrigin='anonymous';i.decoding='async';i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});
    cache.set(src,p);return p;
  }
  function crop(ctx,img,sx,sy,sw,sh,dx,dy){ctx.drawImage(img,sx,sy,sw,sh,dx,dy,sw,sh);}
  async function draw(canvas,opts){
    if(!canvas)return;
    const type=TYPES[opts?.type]||TYPES.horse;
    const dir=ROW[opts?.direction]===undefined?'front':opts.direction;
    const token=String(Date.now())+Math.random();canvas.dataset.sdvAnimalToken=token;
    const hatSheet=window.SDVFarmerSpriteV33?.SRC?.hats;
    const [animal,hats]=await Promise.all([load(type.src),hatSheet?load(hatSheet):Promise.resolve(null)]);
    if(canvas.dataset.sdvAnimalToken!==token)return;
    const SCALE=4,L=40;canvas.width=L*SCALE;canvas.height=L*SCALE;
    const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.setTransform(SCALE,0,0,SCALE,0,0);ctx.clearRect(0,0,L,L);
    const sy=(ROW[dir]||0)*32;
    crop(ctx,animal,0,sy,32,32,4,6);
    const hatIndex=window.SDVFarmerSpriteV33?.HATS?.[opts?.hat];
    if(hats&&Number.isFinite(hatIndex)){
      const hx=(hatIndex%12)*20;
      const hy=Math.floor(hatIndex/12)*80+type.hatY[dir];
      const [x,y]=type.hatPos[dir];
      crop(ctx,hats,hx,hy,20,20,x,y);
    }
  }
  window.SDVAnimalSpriteV33={draw};
})();
