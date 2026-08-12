# v67 首次載入靜態基準

更新：2026-08-13

這份數字用來比較 v66「所有大型資料在首頁 parser-blocking 載入」與 v67 拆分後的靜態 JS 體積。數字是 repo/build 的未壓縮 bytes，不等同實際行動網路 transfer size；瀏覽器 request waterfall 仍以實機 DevTools 為準。

- Safari 15 minified `app.js`：489,750 bytes
- v66 模式首頁 JS（app + 9 個同步資料/runtime 檔）：985,187 bytes
- v67 首頁 eager JS（app + 共用 runtime／名稱資料 + local asset map）：603,787 bytes
- 改為按需載入：384,386 bytes（lookup、lookup-extra、wardrobe）
- 靜態首頁 JS 減少：約 38.7%
- repo 內本地遊戲圖片映射：60 個名稱
- `assets/game` PNG：61 個，共 137,877 bytes

目前 `switch-names-v47.js` 保持 eager，因為它是全站 Switch canonical display-name 層，不是衣櫥專用資料。lookup 與衣櫥目錄只有進入相關頁面／操作時才載入，不再在總覽閒置數秒後自動 prefetch。
