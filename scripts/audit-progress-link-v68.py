from pathlib import Path
import re

def fail(msg): raise SystemExit(msg)
t=Path('app.jsx').read_text()
need=[
 'const SAVE_SCHEMA_VERSION_V68 = 2;', 'factClaimsV68: {}', 'function normalizeSaveV68(input)',
 'LINKED_ROUTE_FACTS_V68', 'LINKED_MILESTONES_V68', 'progressFactDoneFromStateV68', 'setLinkedMilestoneV68',
 'roomItemsCompleteFromStateV68', 'roomExplicitDoneFromStateV68', '點此直接標記整室完成',
 'progressFactV68("panning")', 'it?.id==="skull_key"', 'greenhouseFarmClaimV68',
 'const checked=roomExplicitDoneV68(room)||gotRaw.includes(it)',
 'storedPanV68&&storedPanV68!=="未取得"?storedPanV68:(progressFactV68("panning")?"銅":"未取得")'
]
missing=[x for x in need if x not in t]
if missing: fail('v68 progress-link invariant missing: '+repr(missing))
for bad in ['normalizeSaveV67(', 'SAVE_SCHEMA_VERSION_V67', 'setBuildingCount("greenhouse"', 'inherited=(data.bundleDone||[]).includes(j.room)', 'const checked=roomDone(room)||gotRaw.includes(it)']:
 if bad in t: fail('v68 stale duplicate/source behavior remains: '+bad)
if re.search(r'<div style=\{\{marginTop:8,display:showRoomV51\?"block":"none"\}\}><button[^>]+>\{roomDone\(room\)\?"✓ 整室完成":"標記整室完成"\}',t):
 fail('redundant bottom room completion control remains')
print('v68 progress linking audit passed')
