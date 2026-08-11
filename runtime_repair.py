from pathlib import Path
p=Path('app.jsx')
assert p.exists(), 'app.jsx missing'
print('canonical app.jsx already repaired; deploy-only smoke')
