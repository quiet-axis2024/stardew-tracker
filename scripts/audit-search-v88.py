"""v88 search audit — 索引來源、別名表、跳轉佈線、收藏持久化。"""
import re
from pathlib import Path

def fail(msg):
    raise SystemExit('v88 audit: '+msg)

app=Path('app.jsx').read_text()

# core wiring tokens
for token in ['normalizeSearchV88','SEARCH_ALIAS_TABLE_V88','buildSearchIndexV88','searchResultsV88',
              'renderSearchOverlayV88','renderFavStripV88','openSearchV88','runJumpV88','goToWorldV88',
              'toggleFavV88','extrasState.favV88','aria-label="全域搜尋"','searchOpenV88&&renderSearchOverlayV88()']:
    if token not in app: fail('app.jsx missing '+token)

# search must reach every source family
for token in ['SEARCH_ALIAS_TABLE_V88.forEach','NPC_GROUPS.forEach','COLLECTIONS.fish.items.forEach',
              'window.SDVLookupV46?.items','Object.values(NAV.nodes||{}).forEach']:
    if token not in app: fail('index builder missing source: '+token)

# multilingual matching: normalizer must run T2S and strip punctuation
mm=re.search(r'const normalizeSearchV88[\s\S]{0,400}?SWITCH_T2S_V47',app)
if not mm: fail('normalizeSearchV88 must map via SWITCH_T2S_V47')

# alias table acts must be valid jump targets
acts=set(re.findall(r'act:"([a-z]+)"',app))
valid={'bundles','collection','skills','farm','wardrobe','notes','overview'}
bad=acts-valid
if bad: fail(f'alias table has unknown acts: {sorted(bad)}')
for need in ['bundles','collection','skills','overview']:
    if need not in acts: fail('alias table missing act '+need)

# favorites strip lives on overview, overlay mounted at root above tabs
ov=app.index('const renderOverview')
if 'renderFavStripV88()' not in app[ov:ov+400]: fail('overview missing fav strip')

# jump dispatch covers all descriptor types
for token in ['go.t==="item"','go.t==="npc"','go.t==="world"','go.t==="act"']:
    if token not in app: fail('runJumpV88 missing branch '+token)

# build pipeline runs this audit
build=Path('build-cloudflare.sh').read_text()
if 'audit-search-v88.py' not in build: fail('build-cloudflare.sh must run audit-search-v88.py')

print('v88 search audit passed')
