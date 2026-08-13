/* v78 — small stable-ID additions discovered during World route audit. */
(()=>{
  'use strict';
  const db=window.SDVWorldV70;
  if(!db||!Array.isArray(db.places))return;
  if(!db.places.some(row=>row&&row.id==='bus_stop')){
    db.places.push({
      id:'bus_stop',
      regionId:'town',
      name:'巴士站',
      aliases:['公交车站','Bus Stop'],
      icon:'Map',
      peopleIds:[],
      hours:'巴士修復後 10:00–17:00 可搭車前往沙漠',
      requires:'完成金库收集包或 Joja 巴士工程後恢復營運',
      services:['搭乘巴士前往卡利科沙漠','西北角礦車修復後可快速移動','西側通往農場、東側通往鹈鹕镇']
    });
  }
})();
