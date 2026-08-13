from pathlib import Path

def fail(msg): raise SystemExit(msg)
t=Path("app.jsx").read_text()
need=[
 "todayV69:{weatherByDate:{},hiddenByDate:{},pinnedIds:[]}",
 "const buildTodayHintsV69 = () =>", "const renderTodayV69 = () =>",
 "天氣未記錄 · 如果", "未記錄天氣時，會同時列出晴天／雨天",
 "今天先不管", "toggleTodayPinV69", "restoreTodayHintsV69", "點開看詳細內容", "renderTodayDetailV69",
 "fish-weather:${weather}", "bundle-gap:${g.bundle.id}", ".slice(0,6)",
 "{renderProfileCard()}\n    {renderCalendar()}\n    {renderTodayV69()}", "game-calendar-v69"
]
missing=[x for x in need if x not in t]
if missing: fail("v69 today invariant missing: "+repr(missing))
idx=Path("index.html").read_text()
if "?v=69" not in idx or "deploy-v69" not in idx: fail("v69 index version missing")
if "const CACHE='stardew-tracker-v69';" not in Path("sw.js").read_text(): fail("v69 SW cache missing")
if "python3 scripts/audit-today-v69.py" not in Path("build-cloudflare.sh").read_text(): fail("Cloudflare v69 audit missing")
print("v69 today assistant audit passed")
