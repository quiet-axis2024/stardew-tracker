(() => {
  const ENDPOINT = 'https://cobkkabxxoyxyecgmjql.supabase.co/functions/v1/stardew-cloud';
  const OWNER_STORE = 'sdv-cloud-owner-token-v1';
  const SHARE_STORE = 'sdv-cloud-share-token-v1';
  const LOCAL_UPDATED_STORE = 'sdv-cloud-local-updated-v1';
  const OWNER_COOKIE = 'sdv_cloud_owner_v1';
  const SHARE_COOKIE = 'sdv_cloud_share_v1';
  const PROGRESS_KEYS = new Set(['sdv2-progress-pub', 'sdv2-progress-v3']);
  const LEGACY_APP_URL = 'https://quiet-axis2024.github.io/stardew-tracker/';
  const CLOUDFLARE_APP_URL = 'https://stardewfarm-handbook.pages.dev/';

  const proto = Storage.prototype;
  const rawGet = proto.getItem;
  const rawSet = proto.setItem;
  const rawRemove = proto.removeItem;

  const state = {
    mode: 'local',
    token: '',
    shareToken: '',
    updatedAt: null,
    status: 'local',
  };

  let shareRaw = null;
  let syncTimer = null;
  let lastCloudPayload = '';

  const lsGet = (key) => {
    try { return rawGet.call(window.localStorage, key); }
    catch { return null; }
  };
  const lsSet = (key, value) => {
    try { rawSet.call(window.localStorage, key, String(value)); }
    catch {}
  };


  const cookiePath = (() => {
    const path = window.location.pathname || '/';
    return path.endsWith('/') ? path : path.replace(/[^/]*$/, '');
  })();
  const cookieGet = (name) => {
    const prefix = `${encodeURIComponent(name)}=`;
    const row = String(document.cookie || '').split('; ').find(v => v.startsWith(prefix));
    return row ? decodeURIComponent(row.slice(prefix.length)) : '';
  };
  const cookieSet = (name, value) => {
    if (!value) return;
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=31536000; Path=${cookiePath || '/'}; SameSite=Strict; Secure`;
  };
  const persistCloudPair = (owner, share) => {
    if (owner) { lsSet(OWNER_STORE, owner); cookieSet(OWNER_COOKIE, owner); }
    if (share) { lsSet(SHARE_STORE, share); cookieSet(SHARE_COOKIE, share); }
  };

  function emitStatus(status) {
    state.status = status;
    document.dispatchEvent(new CustomEvent('sdv-cloud-status', { detail: { ...state } }));
  }

  async function request(action, token, data) {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, token, ...(data ? { data } : {}) }),
      cache: 'no-store',
    });
    let body = {};
    try { body = await response.json(); } catch {}
    if (!response.ok) throw new Error(body?.error || `cloud_${response.status}`);
    return body;
  }

  function parseProgress(raw) {
    if (!raw) return null;
    try {
      const value = JSON.parse(raw);
      return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
    } catch {
      return null;
    }
  }

  function localProgress() {
    for (const key of PROGRESS_KEYS) {
      const parsed = parseProgress(lsGet(key));
      if (parsed) return parsed;
    }
    return null;
  }

  function writeLocalProgress(data) {
    const raw = JSON.stringify(data);
    for (const key of PROGRESS_KEYS) lsSet(key, raw);
    return raw;
  }

  function meaningful(data) {
    return !!data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 2;
  }

  function installOwnerSync() {
    if (proto.__sdvOwnerSyncInstalled) return;
    proto.__sdvOwnerSyncInstalled = true;

    proto.setItem = function(key, value) {
      const result = rawSet.call(this, key, value);
      if (this === window.localStorage && PROGRESS_KEYS.has(String(key)) && state.mode === 'owner') {
        const now = Date.now();
        lsSet(LOCAL_UPDATED_STORE, now);
        clearTimeout(syncTimer);
        syncTimer = setTimeout(async () => {
          try {
            const data = parseProgress(String(value));
            if (!data) return;
            const encoded = JSON.stringify(data);
            if (encoded === lastCloudPayload) return;
            emitStatus('syncing');
            const result = await request('write', state.token, data);
            lastCloudPayload = encoded;
            state.updatedAt = result.updated_at || new Date().toISOString();
            emitStatus('synced');
          } catch (error) {
            console.warn('Stardew cloud write failed:', error);
            emitStatus('offline-local');
          }
        }, 800);
      }
      return result;
    };
  }

  function installShareStorage() {
    if (proto.__sdvShareStorageInstalled) return;
    proto.__sdvShareStorageInstalled = true;

    proto.getItem = function(key) {
      if (this === window.localStorage && PROGRESS_KEYS.has(String(key)) && shareRaw !== null) {
        return shareRaw;
      }
      return rawGet.call(this, key);
    };
    proto.setItem = function(key, value) {
      if (this === window.localStorage && PROGRESS_KEYS.has(String(key))) return;
      return rawSet.call(this, key, value);
    };
    proto.removeItem = function(key) {
      if (this === window.localStorage && PROGRESS_KEYS.has(String(key))) return;
      return rawRemove.call(this, key);
    };
  }

  async function init() {
    const url = new URL(window.location.href);
    const manage = url.searchParams.get('manage');
    const view = url.searchParams.get('view');
    const shareKey = url.searchParams.get('sharekey');
    const migration = url.searchParams.get('sdv_migrate');

    // v56: one-click migration. The new pages.dev app temporarily sends this browser
    // back to the known legacy GitHub Pages origin, where that origin is allowed to
    // read its own localStorage/cookies. It then hands only the existing cloud tokens
    // back to the hard-coded new origin. No arbitrary redirect target is accepted.
    if (migration === 'cloudflare') {
      const legacy = new URL(LEGACY_APP_URL);
      const hereIsLegacy = url.origin === legacy.origin && url.pathname.startsWith(legacy.pathname);
      if (hereIsLegacy) {
        const owner = lsGet(OWNER_STORE) || cookieGet(OWNER_COOKIE) || '';
        const share = lsGet(SHARE_STORE) || cookieGet(SHARE_COOKIE) || '';
        const target = new URL(CLOUDFLARE_APP_URL);
        if (owner) target.searchParams.set('manage', owner);
        if (share) target.searchParams.set('sharekey', share);
        target.searchParams.set('migrated', owner ? '1' : 'missing');
        window.location.replace(target.toString());
        return;
      }
    }

    if (manage) {
      const pairedShare = shareKey || lsGet(SHARE_STORE) || cookieGet(SHARE_COOKIE) || '';
      persistCloudPair(manage, pairedShare);
      state.mode = 'owner';
      state.token = manage;
      state.shareToken = pairedShare;

      // 管理密鑰只在第一次開啟時出現在網址；存入本機後立即清掉。
      url.searchParams.delete('manage');
      url.searchParams.delete('sharekey');
      url.searchParams.delete('migrated');
      window.history.replaceState({}, '', url.pathname + (url.searchParams.toString() ? `?${url.searchParams}` : '') + url.hash);
    } else if (view) {
      state.mode = 'share';
      state.token = view;
    } else {
      const storedOwner = lsGet(OWNER_STORE) || cookieGet(OWNER_COOKIE);
      const storedShare = lsGet(SHARE_STORE) || cookieGet(SHARE_COOKIE);
      if (storedOwner) {
        persistCloudPair(storedOwner, storedShare);
        state.mode = 'owner';
        state.token = storedOwner;
        state.shareToken = storedShare || '';
      }
    }

    if (url.searchParams.has('migrated')) {
      url.searchParams.delete('migrated');
      window.history.replaceState({}, '', url.pathname + (url.searchParams.toString() ? `?${url.searchParams}` : '') + url.hash);
    }

    document.documentElement.dataset.sdvCloudMode = state.mode;

    if (state.mode === 'share') {
      emitStatus('loading');
      // 先隔離觀察者本機資料；即使雲端暫時讀不到，也不能誤顯示觀察者自己的進度。
      shareRaw = '{}';
      installShareStorage();
      try {
        const remote = await request('read', state.token);
        shareRaw = JSON.stringify(remote.data || {});
        state.updatedAt = remote.updated_at || null;
        emitStatus('readonly');
      } catch (error) {
        console.warn('Stardew shared cloud read failed:', error);
        emitStatus('readonly-error');
      }

      // 觀察頁定期檢查；玩家進度更新時自動刷新成最新資料。
      window.setInterval(async () => {
        try {
          const next = await request('read', state.token);
          const raw = JSON.stringify(next.data || {});
          if (raw !== shareRaw) {
            shareRaw = raw;
            window.location.reload();
          }
        } catch {}
      }, 30000);
    } else if (state.mode === 'owner') {
      installOwnerSync();
      emitStatus('loading');

      const local = localProgress();
      const localUpdated = Number(lsGet(LOCAL_UPDATED_STORE) || 0);
      let remote = null;
      try { remote = await request('read', state.token); }
      catch (error) { console.warn('Stardew cloud read failed:', error); }

      if (remote && meaningful(remote.data)) {
        const remoteTime = remote.updated_at ? Date.parse(remote.updated_at) : 0;
        if (local && localUpdated > remoteTime) {
          // 離線期間本機有較新的修改：以上傳本機為準，避免重連後倒退。
          try {
            const result = await request('write', state.token, local);
            lastCloudPayload = JSON.stringify(local);
            state.updatedAt = result.updated_at || new Date().toISOString();
            emitStatus('synced');
          } catch {
            emitStatus('offline-local');
          }
        } else {
          lastCloudPayload = writeLocalProgress(remote.data);
          state.updatedAt = remote.updated_at || null;
          emitStatus('synced');
        }
      } else if (local) {
        try {
          const result = await request('write', state.token, local);
          lastCloudPayload = JSON.stringify(local);
          state.updatedAt = result.updated_at || new Date().toISOString();
          emitStatus('synced');
        } catch {
          emitStatus('offline-local');
        }
      } else {
        emitStatus(remote ? 'synced' : 'offline-local');
      }
    } else {
      emitStatus('local');
    }

    document.dispatchEvent(new CustomEvent('sdv-cloud-ready', { detail: { ...state } }));
  }

  function shareUrl() {
    if (!state.shareToken) return '';
    return `${window.location.origin}${window.location.pathname}?view=${encodeURIComponent(state.shareToken)}`;
  }

  async function copyShareLink() {
    const url = shareUrl();
    if (!url) throw new Error('no_share_token');
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      window.prompt('請複製唯讀連結', url);
    }
    return url;
  }

  function connectFromManagementUrl(raw) {
    const url = new URL(String(raw || '').trim(), window.location.href);
    const legacy = new URL(LEGACY_APP_URL);
    const cloudflare = new URL(CLOUDFLARE_APP_URL);
    const currentOk = url.origin === window.location.origin;
    const legacyOk = url.origin === legacy.origin && url.pathname.startsWith(legacy.pathname);
    const cloudflareOk = url.origin === cloudflare.origin;
    if (!currentOk && !legacyOk && !cloudflareOk) throw new Error('這不是這個手帳的管理連結');
    const owner = url.searchParams.get('manage') || '';
    const share = url.searchParams.get('sharekey') || '';
    if (!owner || !share) throw new Error('管理連結需要同時包含 manage 與 sharekey');
    persistCloudPair(owner, share);
    state.mode='owner'; state.token=owner; state.shareToken=share;
    return true;
  }

  function migrateFromLegacy() {
    const cloudflare = new URL(CLOUDFLARE_APP_URL);
    if (window.location.origin !== cloudflare.origin) return false;
    const legacy = new URL(LEGACY_APP_URL);
    legacy.searchParams.set('sdv_migrate', 'cloudflare');
    window.location.assign(legacy.toString());
    return true;
  }

  window.SDVCloud = { init, state, shareUrl, copyShareLink, connectFromManagementUrl, migrateFromLegacy };
})();
