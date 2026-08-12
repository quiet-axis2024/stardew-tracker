#!/usr/bin/env bash
set -euo pipefail

npm install --no-save react@18 react-dom@18 esbuild@0.25.8
mkdir -p build dist
cat > build/entry.jsx <<'EOF'
import React from 'react';
import { createRoot } from 'react-dom/client';
window.React = React;
window.ReactDOM = { createRoot };
EOF
cat app.jsx >> build/entry.jsx
./node_modules/.bin/esbuild build/entry.jsx --bundle --minify --format=iife --target=safari15 --outfile=dist/app.js
cp index.html manifest.webmanifest icon.svg sw.js cloud.js wardrobe-data-v34.js farmer-preview-v33.js animal-preview-v33.js lookup-data-v46.js lookup-extra-v49.js social-data-v50.js machine-data-v51.js switch-names-v47.js dist/
