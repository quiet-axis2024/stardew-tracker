/* Real Stardew Valley horse/pet preview frames. Game artwork © ConcernedApe. */
(function(){
  'use strict';
  const GAME='https://raw.githubusercontent.com/shayderrr/stardew_decomp/6fcc1d4d20d14c5be6232d0f9eac1d423222fd84/stardew/unpacked/Animals/';
  const TYPES={
    horse:{src:GAME+'horse.png'},
    cat:{src:GAME+'cat.png'},
    dog:{src:GAME+'dog.png'}
  };
  const ROW={front:0,right:1,back:2,left:3};
  const cache=new Map();
  function load(src){
    if(cache.has(src)) return cache.get(src);
    const p=new Promise((resolve,reject)=>{const i=new Image();i.crossOrigin='anonymous';i.decoding='async';i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});
    cache.set(src,p);return p;
  }
  function crop(ctx,img,sx,sy,sw,sh,dx,dy){ctx.drawImage(img,sx,sy,sw,sh,dx,dy,sw,sh);}
  function headAnchor(img,sy,dir){
    const c=document.createElement('canvas');c.width=32;c.height=32;const x=c.getContext('2d',{willReadFrequently:true});
    x.drawImage(img,0,sy,32,32,0,0,32,32);const d=x.getImageData(0,0,32,32).data;let xs=[],minY=32;
    for(let yy=0;yy<22;yy++)for(let xx=0;xx<32;xx++){
      if(dir==='right'&&xx<15)continue;if(dir==='left'&&xx>17)continue;if((dir==='front'||dir==='back')&&(xx<5||xx>27))continue;
      if(d[(yy*32+xx)*4+3]>40){xs.push(xx);if(yy<minY)minY=yy;}
    }
    if(!xs.length)return dir==='right'?[16,5]:dir==='left'?[4,5]:[10,4];
    xs.sort((a,b)=>a-b);const center=xs[Math.floor(xs.length/2)];
    return [Math.max(0,Math.min(20,Math.round(4+center-10))),Math.max(2,Math.min(10,Math.round(6+minY-2)))];
  }
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
    const hatIndex=window.SDVWardrobeV34?.byKey?.hat?.[opts?.hat]?.index ?? window.SDVFarmerSpriteV33?.HATS?.[opts?.hat];
    if(hats&&Number.isFinite(hatIndex)){
      const hx=(hatIndex%12)*20;
      const hatY={front:0,right:20,back:60,left:40}[dir];
      const hy=Math.floor(hatIndex/12)*80+hatY;
      const [x,y]=headAnchor(animal,sy,dir);
      crop(ctx,hats,hx,hy,20,20,x,y);
    }
  }
  window.SDVAnimalSpriteV33={draw};
})();
