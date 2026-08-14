# 資料來源與可重現性

更新基準：2026-08-13

本文件配合 `docs/ROADMAP.md` 的 0G。目的不是宣稱所有資料都已可重建，而是明確區分「有可重現 generator」與「目前只能視為 committed snapshot」的資料。

## 原則

1. generator、pinned source、輸出格式三者若齊全，才把資料視為可重建。
2. 檔頭出現 `generated` 不代表 generator 真的存在 repo。
3. generator 缺失時，正式資料檔視為 **committed snapshot**；可以人工修正，但不得用來源不明的舊腳本整檔覆寫。
4. 日後若恢復 generator，必須先用固定輸入重建並比對現有 snapshot，確認不會洗掉人工修正後才能取代正式檔。
5. 顯示名稱不是 stable ID。新資料應保存 stable ID、Switch canonical display name 與 aliases。

## 目前資料檔

| 檔案 | 目前狀態 | 已知來源線索 | 處理規則 |
|---|---|---|---|
| `lookup-data-v46.js` | committed snapshot | 檔頭曾標示由 pinned game-data extracts 產生；目前 repo 無對應 generator | 不得用不明舊腳本整檔覆寫；後續恢復 generator 前以 committed snapshot 為準 |
| `lookup-extra-v49.js` | committed snapshot | 內含 `sourceCommit` 欄位 | generator 未在 repo，先保留 snapshot；種植日期資料可沿用，但變更要可追溯 |
| `switch-names-v47.js` | committed snapshot | 檔頭標示 pinned multilingual game-data export | 目前作為 Switch 名稱顯示層；generator 缺失前不整檔重生 |
| `wardrobe-data-v34.js` | committed snapshot | 檔頭標示 pinned localization＋Dressup metadata | generator 缺失前不整檔重生；衣櫥人工修正直接留在 snapshot |
| `social-data-v50.js` | committed snapshot | 內含 `sourceCommit` | generator 未在 repo；後續 NPC 行程若新增，應使用新資料檔與可追溯來源，不把行程硬塞回舊 snapshot |
| `machine-data-v51.js` | committed snapshot | 目前為正式設備資料 | generator 未確認；先視為 snapshot |
| `world-data-v70.js` | manual committed snapshot | 2026-08-13 對照官方中文 Stardew Valley Wiki 的地點／商店／營業時間頁；UI 會優先重用 `social-data-v50.js` 已有商店資料 | 使用 stable region/place/person ID 與繁／簡／英 aliases；世界頁維持薄版，後續全域搜尋與 NPC 行程直接共用 |
| `farmer-preview-v33.js` / `animal-preview-v33.js` | 手寫 runtime compositor | pinned Stardew decomp 圖像路徑 | 不是 generated data；修改以程式碼 review／實機預覽為主 |

## v67 之後新增資料

世界、NPC 行程、全域搜尋索引、種植計算等新資料模組必須至少留下：

- stable ID
- Switch canonical name
- aliases（繁／簡／英可分欄）
- 來源或 source version
- 若由腳本產生，generator 與輸入版本一併進 repo

若資料量小到適合手工維護，可直接 committed data，但要明確標示「manual snapshot」，不要假裝 generated。

## v87 世界導航（2026-08-14）
| 檔案 | 來源 | 說明 |
| --- | --- | --- |
| `world-nav-data-v87.js` | manual committed snapshot | 世界導航圖單一來源：節點／pin／areaNode。座標依實際地圖渲染逐點校正。 |
| `assets/game/local-assets-v87.js` | Stardew Valley Wiki（一次性下載，本地快照） | 地圖、全部魚類與世界圖示改為本地資產，執行期不再熱鏈 wiki。檔名＝sha1(key)[:14]。 |
| （移除） | — | world-nav-v81/83、world-nav-island-v81、world-fish-data-v83、world-lifecycle-v84–86、world-map-pins-v73、world-map-secret-v75、world-route-fixes-v79、world-extra-v79、sw.js／sw-v81–86：v83 覆蓋層架構整批退役，改為 app.jsx 內建 `renderWorldV87`。 |
