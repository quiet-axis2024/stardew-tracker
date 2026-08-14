#!/usr/bin/env bash
set -euo pipefail
python3 scripts/audit-foundation-v67.py
python3 scripts/audit-progress-link-v68.py
python3 scripts/audit-today-v69.py
python3 scripts/audit-world-v70.py
python3 scripts/audit-world-v87.py
python3 scripts/audit-search-v88.py
node --check world-data-v70.js
node --check world-nav-data-v87.js
node --check sw-v87.js
node --check assets/game/local-assets-v87.js
npm install --no-save react@18 react-dom@18 esbuild@0.25.8
mkdir -p build dist
cat > build/entry.jsx <<'EOT'
import React from 'react';
import { createRoot } from 'react-dom/client';
window.React = React;
window.ReactDOM = { createRoot };
EOT
cat app.jsx >> build/entry.jsx
./node_modules/.bin/esbuild build/entry.jsx --bundle --minify --format=iife --target=safari15 --outfile=dist/app.js
cp index.html manifest.webmanifest icon.svg cloud.js wardrobe-data-v34.js farmer-preview-v33.js animal-preview-v33.js lookup-data-v46.js lookup-extra-v49.js social-data-v50.js machine-data-v51.js switch-names-v47.js dist/
cp world-data-v70.js world-nav-data-v87.js sw-v87.js dist/
cp -R assets dist/
