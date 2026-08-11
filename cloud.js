(() => {
  const ENDPOINT = 'https://cobkkabxxoyxyecgmjql.supabase.co/functions/v1/stardew-cloud';
  const OWNER_STORE = 'sdv-cloud-owner-token-v1';
  const SHARE_STORE = 'sdv-cloud-share-token-v1';
  const LOCAL_UPDATED_STORE = 'sdv-cloud-local-updated-v1';
  const PROGRESS_KEYS = new Set(['sdv2-progress-pub', 'sdv2-progress-v3']);

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

    if (manage) {
      lsSet(OWNER_STORE, manage);
      if (shareKey) lsSet(SHARE_STORE, shareKey);
      state.mode = 'owner';
      state.token = manage;
      state.shareToken = shareKey || lsGet(SHARE_STORE) || '';

      // 管理密鑰只在第一次開啟時出現在網址；存入本機後立即清掉。
      url.searchParams.delete('manage');
      url.searchParams.delete('sharekey');
      window.history.replaceState({}, '', url.pathname + (url.searchParams.toString() ? `?${url.searchParams}` : '') + url.hash);
    } else if (view) {
      state.mode = 'share';
      state.token = view;
    } else {
      const storedOwner = lsGet(OWNER_STORE);
      if (storedOwner) {
        state.mode = 'owner';
        state.token = storedOwner;
        state.shareToken = lsGet(SHARE_STORE) || '';
      }
    }

    document.documentElement.dataset.sdvCloudMode = state.mode;

    if (state.mode === 'share') {
      emitStatus('loading');
      const remote = await request('read', state.token);
      shareRaw = JSON.stringify(remote.data || {});
      state.updatedAt = remote.updated_at || null;
      installShareStorage();
      emitStatus('readonly');

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

  window.SDVCloud = { init, state, shareUrl, copyShareLink };
})();
