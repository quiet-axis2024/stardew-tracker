(() => {
  const wikiFile = (name) => `https://wiki.stardewvalley.net/Special:Redirect/file/${encodeURIComponent(name + '.png')}`;

  const NAV = {
    '總覽': 'Inventory Tab',
    '技能': 'Skills Tab Icon',
    '社區': 'Junimo Icon',
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

  const SECTION = {
    '日期與資金': 'Inventory Tab',
    '進度速覽': 'Stardrop',
    '重要里程碑': 'Stardrop',
    '特殊物品與能力': 'Special Items & Powers Tab',
    '技能等級': 'Skills Tab Icon',
    '礦井': 'Pickaxe',
    '精通': 'Stardrop',
    '社區中心': 'Junimo Icon',
    '農舍': 'House (tier 2)',
    '工具': 'Pickaxe',
    '建築': 'Silo',
    '雞舍動物': 'White Chicken',
    '牲口棚動物': 'Cow',
    '魚塘': 'Fish Pond',
    '社交': 'Social Tab',
    '可交往對象': 'Bouquet',
    '村民': 'Social Tab',
    '特殊角色': 'Void Essence',
    '圖鑑': 'Collections Tab',
    '備註': 'Special Items & Powers Tab',
    '分享進度': 'Letter',
    '完整備份': 'Chest',
    '分享給朋友': 'Social Tab',
    '手機使用': 'Inventory Tab',
    '資料管理': 'Trash Can',
  };

  const ROOMS = {
    '工藝室': 'Junimo Icon',
    '食品儲藏室': 'Parsnip',
    '魚缸': 'Sunfish',
    '鍋爐房': 'Copper Bar',
    '布告欄': 'Letter',
    '保險庫': 'Gold',
  };

  const TOOLS = {
    '水壺': 'Watering Can',
    '十字鎬': 'Pickaxe',
    '斧頭': 'Axe',
    '鋤頭': 'Hoe',
    '垃圾桶': 'Trash Can',
  };

  const ANIMALS = {
    '藍雞': 'Blue Chicken',
    '虛空雞': 'Void Chicken',
    '金雞': 'Golden Chicken',
    '雞': 'White Chicken',
    '鴨': 'Duck',
    '兔子': 'Rabbit',
    '恐龍': 'Dinosaur',
    '牛': 'Cow',
    '山羊': 'Goat',
    '綿羊': 'Sheep',
    '豬': 'Pig',
    '鴕鳥': 'Ostrich',
  };

  const NPCS = {
    '阿比蓋爾': 'Abigail', '艾蜜麗': 'Emily', '海莉': 'Haley', '莉亞': 'Leah', '瑪魯': 'Maru', '潘妮': 'Penny',
    '亞歷克斯': 'Alex', '艾利歐特': 'Elliott', '哈維': 'Harvey', '山姆': 'Sam', '塞巴斯蒂安': 'Sebastian', '謝恩': 'Shane',
    '卡洛琳': 'Caroline', '克林特': 'Clint', '德米特里厄斯': 'Demetrius', '艾芙琳': 'Evelyn', '喬治': 'George', '格斯': 'Gus',
    '賈斯': 'Jas', '喬迪': 'Jodi', '肯特': 'Kent', '劉易斯': 'Lewis', '萊納斯': 'Linus', '瑪妮': 'Marnie', '潘姆': 'Pam',
    '皮埃爾': 'Pierre', '羅賓': 'Robin', '文森特': 'Vincent', '威利': 'Willy', '法師': 'Wizard', '桑迪': 'Sandy',
    '克羅巴斯': 'Krobus', '矮人': 'Dwarf', '雷歐': 'Leo',
  };

  const COLLECTION_CATEGORIES = {
    '魚類圖鑑': 'Pufferfish',
    '古物圖鑑': 'Dwarf Scroll I',
    '礦物圖鑑': 'Emerald',
  };

  const EMOJI_RE = /[🌱🏡⭐📦🐄💛📖📝📅📊🏆🎒⛏️✨🏠🔧🏗️🐔🐟💘🏘️📤💾🔗📱⚠️🧺🥕⚒️📌💰💧🪓🗑️🦆🐰🦖🐐🐑🐖🦩🏺💎]/gu;

  function makeSprite(name, size = 30, fallback = '') {
    const img = document.createElement('img');
    img.src = wikiFile(name);
    img.alt = '';
    img.dataset.sdvSprite = name;
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    img.style.objectFit = 'contain';
    img.style.imageRendering = 'pixelated';
    img.style.flex = '0 0 auto';
    img.loading = 'lazy';
    img.onerror = () => {
      const span = document.createElement('span');
      span.textContent = fallback || '•';
      span.style.fontSize = `${Math.max(16, size * 0.68)}px`;
      img.replaceWith(span);
    };
    return img;
  }

  function replaceIconHost(host, spriteName, size = 30) {
    if (!host || host.dataset.sdvIconDone === spriteName) return;
    const fallback = host.textContent || '';
    host.textContent = '';
    host.appendChild(makeSprite(spriteName, size, fallback));
    host.dataset.sdvIconDone = spriteName;
    host.style.display = 'inline-flex';
    host.style.alignItems = 'center';
    host.style.justifyContent = 'center';
  }

  function enhanceHeader() {
    const sticky = [...document.querySelectorAll('div')].find((el) => el.style.position === 'sticky' && el.textContent.includes('星露谷進度手帳'));
    if (!sticky) return;
    const firstSpan = sticky.querySelector('span');
    if (firstSpan) replaceIconHost(firstSpan, 'Junimo Icon', 40);
  }

  function enhanceBottomNav() {
    document.querySelectorAll('div[style*="position: fixed"] button').forEach((button) => {
      const spans = button.querySelectorAll(':scope > span');
      if (spans.length < 2) return;
      const label = spans[spans.length - 1].textContent.trim();
      const sprite = NAV[label];
      if (!sprite) return;
      replaceIconHost(spans[0], sprite, 34);
      button.style.minWidth = '49px';
    });
  }

  function enhanceSectionTitles() {
    document.querySelectorAll('main span').forEach((label) => {
      if (label.style.fontSize !== '17px') return;
      const text = label.textContent.trim();
      const key = Object.keys(SECTION).find((name) => text.startsWith(name));
      if (!key) return;
      const iconHost = label.parentElement?.firstElementChild;
      if (iconHost && iconHost !== label) replaceIconHost(iconHost, SECTION[key], 29);
    });
  }

  function enhanceSkills() {
    document.querySelectorAll('main b').forEach((nameEl) => {
      const sprite = SKILLS[nameEl.textContent.trim()];
      if (!sprite) return;
      const row = nameEl.parentElement;
      const iconHost = row?.firstElementChild;
      if (iconHost && iconHost !== nameEl) replaceIconHost(iconHost, sprite, 31);
    });
  }

  function enhanceRoomsAndTools() {
    document.querySelectorAll('main b').forEach((nameEl) => {
      const text = nameEl.textContent.trim();
      if (ROOMS[text]) {
        const row = nameEl.parentElement?.parentElement;
        const iconHost = row?.firstElementChild;
        if (iconHost) replaceIconHost(iconHost, ROOMS[text], 35);
      }
      if (TOOLS[text]) {
        const row = nameEl.parentElement;
        const iconHost = row?.querySelector(':scope > span');
        if (iconHost) replaceIconHost(iconHost, TOOLS[text], 29);
      }
    });
  }

  function enhanceAnimals() {
    document.querySelectorAll('main label').forEach((label) => {
      if (!label.querySelector('input')) return;
      if (label.querySelector('img[data-sdv-animal]')) return;
      const normalized = label.textContent.replace(EMOJI_RE, '').replace(/\s/g, '');
      const animal = Object.keys(ANIMALS).sort((a, b) => b.length - a.length).find((name) => normalized.startsWith(name));
      if (!animal) return;
      const img = makeSprite(ANIMALS[animal], 29, '');
      img.dataset.sdvAnimal = animal;
      label.insertBefore(img, label.firstChild);
      [...label.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).forEach((node) => {
        node.nodeValue = node.nodeValue.replace(EMOJI_RE, '');
      });
    });
  }

  function enhanceNPCs() {
    document.querySelectorAll('main b').forEach((nameEl) => {
      const text = nameEl.textContent.trim();
      const sprite = NPCS[text];
      if (!sprite) return;
      const row = nameEl.parentElement;
      if (!row || row.querySelector('img[data-sdv-npc]')) return;
      const img = makeSprite(sprite, 42, '');
      img.dataset.sdvNpc = text;
      img.style.borderRadius = '5px';
      img.style.marginRight = '2px';
      row.insertBefore(img, nameEl);
    });
  }

  function enhanceHearts() {
    document.querySelectorAll('main button').forEach((button) => {
      if (button.textContent.trim() !== '♥' || button.querySelector('img[data-sdv-heart]')) return;
      const computed = getComputedStyle(button).color;
      const filled = !(computed.includes('216, 207, 195') || computed.includes('216,207,195'));
      const img = makeSprite('HeartIconLarge', 16, '♥');
      img.dataset.sdvHeart = '1';
      img.style.opacity = filled ? '1' : '.22';
      if (!filled) img.style.filter = 'grayscale(1)';
      button.textContent = '';
      button.appendChild(img);
    });
  }

  function enhanceCollectionCategoryButtons() {
    document.querySelectorAll('main button').forEach((button) => {
      if (button.querySelector('img[data-sdv-category]')) return;
      const text = button.textContent.trim();
      const key = Object.keys(COLLECTION_CATEGORIES).find((name) => text.includes(name));
      if (!key) return;
      const img = makeSprite(COLLECTION_CATEGORIES[key], 24, '');
      img.dataset.sdvCategory = key;
      button.insertBefore(img, button.firstChild);
      [...button.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).forEach((node) => {
        node.nodeValue = node.nodeValue.replace(EMOJI_RE, '').trimStart();
      });
      button.style.display = 'inline-flex';
      button.style.alignItems = 'center';
      button.style.gap = '5px';
    });
  }

  function enhanceCloudUI() {
    const cloud = window.SDVCloud;
    if (!cloud) return;

    if (cloud.state.mode === 'share') {
      const main = document.querySelector('main');
      if (main && !document.getElementById('sdv-cloud-banner')) {
        const banner = document.createElement('div');
        banner.id = 'sdv-cloud-banner';
        banner.innerHTML = '<span style="font-size:18px">👀</span><div><b>唯讀遊玩紀錄</b><br><span style="font-size:11px;font-weight:600">資料來自玩家雲端存檔，重新開啟會回到最新同步狀態。</span></div>';
        banner.style.cssText = 'display:flex;gap:8px;align-items:center;margin:8px 0 10px;padding:9px 11px;border:2px solid #4f84a8;border-radius:9px;background:#e3f1fb;color:#3d2a1f;font-size:12px;font-weight:800;';
        main.prepend(banner);
      }
    }

    if (cloud.state.mode === 'owner' && cloud.state.shareToken) {
      document.querySelectorAll('main span').forEach((label) => {
        if (label.style.fontSize !== '17px' || !label.textContent.trim().startsWith('分享給朋友')) return;
        const card = label.parentElement?.nextElementSibling;
        if (!card || card.querySelector('[data-sdv-share-button]')) return;
        const button = document.createElement('button');
        button.dataset.sdvShareButton = '1';
        button.innerHTML = '<span style="font-size:16px">☁️</span> 複製我的唯讀遊玩紀錄連結';
        button.style.cssText = 'margin-top:10px;width:100%;border:2px solid #4f84a8;background:#e3f1fb;color:#315f7c;border-radius:9px;padding:10px;font-weight:900;';
        button.onclick = async () => {
          try {
            await cloud.copyShareLink();
            const old = button.innerHTML;
            button.textContent = '✓ 已複製唯讀連結';
            window.setTimeout(() => { button.innerHTML = old; }, 1600);
          } catch {
            alert('目前沒有可用的唯讀分享連結');
          }
        };
        card.appendChild(button);
      });
    }
  }

  function addGameLikeCSS() {
    if (document.getElementById('sdv-game-theme-css')) return;
    const style = document.createElement('style');
    style.id = 'sdv-game-theme-css';
    style.textContent = `
      img[data-sdv-sprite], img[data-sdv-animal], img[data-sdv-npc], img[data-sdv-category], img[data-sdv-heart] {
        image-rendering: pixelated;
        image-rendering: crisp-edges;
      }
      div[style*="position: fixed"] button > span:first-child { min-height: 35px; }
      div[style*="position: fixed"] button img { filter: drop-shadow(0 1px 0 rgba(35,20,8,.35)); }
      main img[data-sdv-npc] { background: rgba(255,249,232,.65); }
    `;
    document.head.appendChild(style);
  }

  function enhance() {
    addGameLikeCSS();
    enhanceHeader();
    enhanceBottomNav();
    enhanceSectionTitles();
    enhanceSkills();
    enhanceRoomsAndTools();
    enhanceAnimals();
    enhanceNPCs();
    enhanceHearts();
    enhanceCollectionCategoryButtons();
    enhanceCloudUI();
  }

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      enhance();
    });
  };

  new MutationObserver(schedule).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
  });
  document.addEventListener('sdv-cloud-ready', schedule);
  document.addEventListener('sdv-cloud-status', schedule);
  document.addEventListener('DOMContentLoaded', schedule);
  window.setTimeout(schedule, 150);
  window.setTimeout(schedule, 900);
})();
