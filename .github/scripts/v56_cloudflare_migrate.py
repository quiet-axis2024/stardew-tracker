from pathlib import Path


def replace_once(text, old, new, label):
    if old not in text:
        raise RuntimeError(f'missing patch anchor: {label}')
    return text.replace(old, new, 1)

# cloud.js: one-click handoff from the legacy GitHub Pages origin to the new Cloudflare Pages origin.
p = Path('cloud.js')
s = p.read_text(encoding='utf-8')
s = replace_once(
    s,
    "  const PROGRESS_KEYS = new Set(['sdv2-progress-pub', 'sdv2-progress-v3']);\n",
    "  const PROGRESS_KEYS = new Set(['sdv2-progress-pub', 'sdv2-progress-v3']);\n  const LEGACY_APP_URL = 'https://quiet-axis2024.github.io/stardew-tracker/';\n  const CLOUDFLARE_APP_URL = 'https://stardewfarm-handbook.pages.dev/';\n",
    'cloud migration urls',
)
s = replace_once(
    s,
    "    const shareKey = url.searchParams.get('sharekey');\n\n    if (manage) {\n",
    "    const shareKey = url.searchParams.get('sharekey');\n    const migration = url.searchParams.get('sdv_migrate');\n\n    // v56: one-click migration. The new pages.dev app temporarily sends this browser\n    // back to the known legacy GitHub Pages origin, where that origin is allowed to\n    // read its own localStorage/cookies. It then hands only the existing cloud tokens\n    // back to the hard-coded new origin. No arbitrary redirect target is accepted.\n    if (migration === 'cloudflare') {\n      const legacy = new URL(LEGACY_APP_URL);\n      const hereIsLegacy = url.origin === legacy.origin && url.pathname.startsWith(legacy.pathname);\n      if (hereIsLegacy) {\n        const owner = lsGet(OWNER_STORE) || cookieGet(OWNER_COOKIE) || '';\n        const share = lsGet(SHARE_STORE) || cookieGet(SHARE_COOKIE) || '';\n        const target = new URL(CLOUDFLARE_APP_URL);\n        if (owner) target.searchParams.set('manage', owner);\n        if (share) target.searchParams.set('sharekey', share);\n        target.searchParams.set('migrated', owner ? '1' : 'missing');\n        window.location.replace(target.toString());\n        return;\n      }\n    }\n\n    if (manage) {\n",
    'cloud init migration handoff',
)
s = replace_once(
    s,
    "      url.searchParams.delete('manage');\n      url.searchParams.delete('sharekey');\n      window.history.replaceState({}, '', url.pathname + (url.searchParams.toString() ? `?${url.searchParams}` : '') + url.hash);\n",
    "      url.searchParams.delete('manage');\n      url.searchParams.delete('sharekey');\n      url.searchParams.delete('migrated');\n      window.history.replaceState({}, '', url.pathname + (url.searchParams.toString() ? `?${url.searchParams}` : '') + url.hash);\n",
    'strip migration marker with management token',
)
s = replace_once(
    s,
    "    document.documentElement.dataset.sdvCloudMode = state.mode;\n",
    "    if (url.searchParams.has('migrated')) {\n      url.searchParams.delete('migrated');\n      window.history.replaceState({}, '', url.pathname + (url.searchParams.toString() ? `?${url.searchParams}` : '') + url.hash);\n    }\n\n    document.documentElement.dataset.sdvCloudMode = state.mode;\n",
    'strip migration marker without management token',
)
s = replace_once(
    s,
    "  function connectFromManagementUrl(raw) {\n    const url = new URL(String(raw || '').trim(), window.location.href);\n    if (url.origin !== window.location.origin) throw new Error('管理連結不是這個手帳 App 的網址');\n    const owner = url.searchParams.get('manage') || '';\n",
    "  function connectFromManagementUrl(raw) {\n    const url = new URL(String(raw || '').trim(), window.location.href);\n    const legacy = new URL(LEGACY_APP_URL);\n    const cloudflare = new URL(CLOUDFLARE_APP_URL);\n    const currentOk = url.origin === window.location.origin;\n    const legacyOk = url.origin === legacy.origin && url.pathname.startsWith(legacy.pathname);\n    const cloudflareOk = url.origin === cloudflare.origin;\n    if (!currentOk && !legacyOk && !cloudflareOk) throw new Error('這不是這個手帳的管理連結');\n    const owner = url.searchParams.get('manage') || '';\n",
    'allow known old/new management links',
)
s = replace_once(
    s,
    "  window.SDVCloud = { init, state, shareUrl, copyShareLink, connectFromManagementUrl };\n",
    "  function migrateFromLegacy() {\n    const cloudflare = new URL(CLOUDFLARE_APP_URL);\n    if (window.location.origin !== cloudflare.origin) return false;\n    const legacy = new URL(LEGACY_APP_URL);\n    legacy.searchParams.set('sdv_migrate', 'cloudflare');\n    window.location.assign(legacy.toString());\n    return true;\n  }\n\n  window.SDVCloud = { init, state, shareUrl, copyShareLink, connectFromManagementUrl, migrateFromLegacy };\n",
    'export one-click legacy migration',
)
p.write_text(s, encoding='utf-8')

# app.jsx: make the existing reconnect button start the one-click migration first.
p = Path('app.jsx')
s = p.read_text(encoding='utf-8')
s = replace_once(
    s,
    '''  const reconnectCloudV49 = async () => {\n    const raw=window.prompt("貼上原本的手帳管理連結（包含 manage 與 sharekey）");\n    if(!raw)return;\n    try { window.SDVCloud?.connectFromManagementUrl?.(raw); window.location.reload(); }\n    catch(e){ alert(e?.message||"這不是有效的管理連結"); }\n  };''',
    '''  const reconnectCloudV49 = async () => {\n    try {\n      if(window.SDVCloud?.migrateFromLegacy?.()) return;\n    } catch(e) { console.warn("舊網址自動搬移啟動失敗",e); }\n    const raw=window.prompt("貼上原本的手帳管理連結（包含 manage 與 sharekey）");\n    if(!raw)return;\n    try { window.SDVCloud?.connectFromManagementUrl?.(raw); window.location.reload(); }\n    catch(e){ alert(e?.message||"這不是有效的管理連結"); }\n  };''',
    'reconnect cloud one-click migration',
)
s = replace_once(
    s,
    '''<div style={{fontSize:9.5,color:C.brown,lineHeight:1.45}}>主畫面 App 尚未帶入雲端連線時，可貼上原本的管理連結重新連接一次。</div><button onClick={reconnectCloudV49} style={{width:"100%",marginTop:6,border:`1.5px solid ${C.orange}`,background:"#FFE4C5",color:C.brown,borderRadius:8,padding:7,fontWeight:950,fontSize:10}}>重新連接雲端</button>''',
    '''<div style={{fontSize:9.5,color:C.brown,lineHeight:1.45}}>新網址第一次使用時，按一下就會從舊 GitHub 網址帶回這台裝置原本的雲端手帳；不需要自己找管理連結。</div><button onClick={reconnectCloudV49} style={{width:"100%",marginTop:6,border:`1.5px solid ${C.orange}`,background:"#FFE4C5",color:C.brown,borderRadius:8,padding:7,fontWeight:950,fontSize:10}}>搬移／重新連接原本手帳</button>''',
    'notes migration copy',
)
p.write_text(s, encoding='utf-8')

# Bust both GitHub Pages and Cloudflare Pages caches.
p = Path('index.html')
s = p.read_text(encoding='utf-8').replace('?v=55', '?v=56').replace('deploy-v55', 'deploy-v56')
p.write_text(s, encoding='utf-8')

p = Path('sw.js')
s = p.read_text(encoding='utf-8').replace("stardew-tracker-v55", "stardew-tracker-v56")
p.write_text(s, encoding='utf-8')
