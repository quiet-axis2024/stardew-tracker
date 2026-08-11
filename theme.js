(() => {
  const wikiFile = (name) => `https://stardewvalleywiki.com/Special:Redirect/file/${encodeURIComponent(name + '.png')}`;

  const NAV = {
    '總覽': 'Inventory Tab',
    '技能': 'Skills Tab Icon',
    '社區': 'Golden Scroll',
    '農場': 'Animals Tab',
    '社交': 'Social Tab',
    '圖鑑': 'Collections Tab',
    '備註': 'Special Items & Powers Tab',
  };

  const SKILLS = {
    '耕種': 'Farming Skill Icon',
    '採礦': 'Mining Skill Icon',
    '採集': 'Foraging Skill Icon',
    '釣魚': 'Fishing Skill Icon',
    '戰鬥': 'Combat Skill Icon',
  };

  const TOOLS = {
    '水壺': 'Watering Can',
    '十字鎬': 'Pickaxe',
    '斧頭': 'Axe',
    '鋤頭': 'Hoe',
    '垃圾桶': 'Trash Can',
  };

  const ROOMS = {
    '工藝室': 'Bundle Icon',
    '食品儲藏室': 'Parsnip',
    '魚缸': 'Sunfish',
    '鍋爐房': 'Copper Bar',
    '布告欄': 'Letter',
    '保險庫': 'Gold',
  };

  const NPCS = {
    '阿比蓋爾': 'Abigail', '艾蜜麗': 'Emily', '海莉': 'Haley', '莉亞': 'Leah', '瑪魯': 'Maru', '潘妮': 'Penny',
    '亞歷克斯': 'Alex', '艾利歐特': 'Elliott', '哈維': 'Harvey', '山姆': 'Sam', '塞巴斯蒂安': 'Sebastian', '謝恩': 'Shane',
    '卡洛琳': 'Caroline', '克林特': 'Clint', '德米特里厄斯': 'Demetrius', '艾芙琳': 'Evelyn', '喬治': 'George', '格斯': 'Gus',
    '賈斯': 'Jas', '喬迪': 'Jodi', '肯特': 'Kent', '劉易斯': 'Lewis', '萊納斯': 'Linus', '瑪妮': 'Marnie', '潘姆': 'Pam',
    '皮埃爾': 'Pierre', '羅賓': 'Robin', '文森特': 'Vincent', '威利': 'Willy', '法師': 'Wizard', '桑迪': 'Sandy',
    '克羅巴斯': 'Krobus', '矮人': 'Dwarf', '雷歐': 'Leo',
  };

  const style = document.createElement('style');
  style.textContent = `
    .sdv-icon-slot{font-size:0!important;width:34px!important;height:34px!important;min-width:34px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;background-image:var(--sdv-icon)!important;background-size:contain!important;background-position:center!important;background-repeat:no-repeat!important;image-rendering:pixelated}
    .sdv-icon-slot.sdv-small{width:28px!important;height:28px!important;min-width:28px!important}
    .sdv-npc-name{display:inline-flex!important;align-items:center!important;gap:8px!important}
    .sdv-npc-name::before{content:"";width:32px;height:32px;min-width:32px;background-image:var(--sdv-icon);background-size:contain;background-position:center;background-repeat:no-repeat;image-rendering:pixelated}
    html,body,#root{max-width:100%;overflow-x:hidden!important}
    main{max-width:100%!important;min-width:0!important}
    main *{min-width:0}
  `;
  document.head.appendChild(style);

  function applySlot(span, file, small = false) {
    if (!span || !file) return;
    span.classList.add('sdv-icon-slot');
    if (small) span.classList.add('sdv-small');
    span.style.setProperty('--sdv-icon', `url("${wikiFile(file)}")`);
  }

  function textOf(el) {
    return (el?.textContent || '').trim();
  }

  function enhanceNav() {
    const candidates = [...document.querySelectorAll('div[style*="position: fixed"]')];
    for (const bar of candidates) {
      const buttons = [...bar.querySelectorAll(':scope > button')];
      if (buttons.length < 5) continue;
      for (const button of buttons) {
        const spans = button.querySelectorAll(':scope > span');
        if (spans.length < 2) continue;
        const label = textOf(spans[spans.length - 1]);
        if (NAV[label]) applySlot(spans[0], NAV[label]);
      }
    }
  }

  function enhanceSkills() {
    document.querySelectorAll('main b').forEach((b) => {
      const name = textOf(b);
      if (!SKILLS[name]) return;
      const row = b.parentElement;
      if (!row) return;
      const first = row.querySelector(':scope > span');
      if (first) applySlot(first, SKILLS[name], true);
    });
  }

  function enhanceTools() {
    document.querySelectorAll('main b').forEach((b) => {
      const name = textOf(b);
      if (!TOOLS[name]) return;
      const row = b.parentElement;
      if (!row) return;
      const first = row.querySelector(':scope > span');
      if (first) applySlot(first, TOOLS[name], true);
    });
  }

  function enhanceRooms() {
    document.querySelectorAll('main b').forEach((b) => {
      const name = textOf(b);
      if (!ROOMS[name]) return;
      const row = b.parentElement?.parentElement;
      const first = row?.querySelector(':scope > span');
      if (first) applySlot(first, ROOMS[name]);
    });
  }

  function enhanceNPCs() {
    document.querySelectorAll('main b').forEach((b) => {
      const name = textOf(b);
      const english = NPCS[name];
      if (!english) return;
      b.classList.add('sdv-npc-name');
      b.style.setProperty('--sdv-icon', `url("${wikiFile(english + ' Icon')}")`);
    });
  }

  function enhance() {
    try {
      enhanceNav();
      enhanceSkills();
      enhanceTools();
      enhanceRooms();
      enhanceNPCs();
    } catch (error) {
      console.warn('Stardew visual enhancement skipped:', error);
    }
  }

  let attempts = 0;
  const timer = setInterval(() => {
    enhance();
    attempts += 1;
    if (attempts >= 24) clearInterval(timer);
  }, 250);

  document.addEventListener('click', () => setTimeout(enhance, 80), true);
  document.addEventListener('change', () => setTimeout(enhance, 80), true);
  window.addEventListener('pageshow', () => setTimeout(enhance, 120));
})();
