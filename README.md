# 星露谷農場手帳

一個為《星露谷物語》1.6 製作的非官方手機手帳／進度記錄器。主要使用情境是玩 Switch 時把手機放在旁邊，隨手查資料、記進度、看日曆與社交資訊。

## 公開網址

正式分享網址：

`https://stardewfarm-handbook.pages.dev/`

GitHub Pages 仍保留作為備援部署：

`https://quiet-axis2024.github.io/stardew-tracker/`

iPhone／iPad 可用 Safari「分享 → 加入主畫面」，當成 PWA 使用。

## 主要功能

底部目前分成 6 個主要頁面：

- **總覽**：農場名片、年份／季節／日期、金錢、遊戲日曆、生日與節日提醒。
- **資料**：角色能力、農場、社區中心／Joja 路線、收藏與各類進度記錄。
- **社交**：NPC 好感度、生日、喜愛／討厭物品、特殊訂單、商店與角色服務資訊。
- **查找**：物品用途／來源查詢，以及依季節、天氣、地點、時間反查魚類；從收藏、日曆或社交卡片跳入詳細資料時可一鍵返回原位置。
- **衣櫥**：玩家、馬、貓、狗的實際遊戲 sprite 四方向換裝預覽，包含服裝、帽子與染色。
- **備註**：唯讀分享、純文字摘要、JSON 備份／匯入、App 網址分享與資料管理。

另外包含：

- Switch 玩家資料頁匯入：支援標準 16:9 原圖，也支援常見橫向 4:3 手機拍照／社群裁切圖；自動裁角色肖像並預填農夫／農場名稱，金錢、年份、季節與日期仍採多路 OCR／一致性檢查，辨識不可靠時不覆蓋原值。
- 28 天季節日曆：生日、節日、固定季節事件，生日人物可直接跳到社交速查。
- 社區中心、Joja、森林鄰居、建築、動物、工具、設備、魚塘與里程碑記錄。
- 出貨、魚類、古物、礦物、料理、成就、秘密紙條與日誌殘頁收藏。
- Switch 中文名稱對照、Stardew Valley Wiki 圖像與資料整合。
- 本機儲存、Supabase 雲端手帳、唯讀分享網址與跨舊 GitHub Pages 網址搬移。
- Service Worker 快取與離線使用。

## 資料儲存

### 一般使用

直接開啟公開 App 時，資料會保存在目前瀏覽器／裝置。不同使用者的本機記錄互不影響。

建議重要進度定期在「備註 → 完整備份」匯出 JSON。

### 雲端手帳

連接管理憑證後可同步至 Supabase。管理憑證不寫進公開 repo；唯讀分享網址只能讀取該份手帳，不能修改雲端資料。

目前正式網域為 `stardewfarm-handbook.pages.dev`。舊 GitHub Pages 上既有的雲端身份可透過 App 內的一次性搬移流程接回新網址。

## 專案結構

目前 repo 只保留實際執行與部署需要的檔案：

- `app.jsx`：主要 React UI、手帳狀態與互動邏輯。
- `index.html`：PWA 啟動頁與 runtime 載入。
- `cloud.js`：雲端／分享／舊網址搬移邏輯。
- `sw.js`、`manifest.webmanifest`、`icon.svg`：PWA 與離線快取。
- `lookup-data-v46.js`、`lookup-extra-v49.js`：物品／魚類查找資料。
- `social-data-v50.js`：NPC 社交資料。
- `machine-data-v51.js`：農場設備／製作資料。
- `switch-names-v47.js`：Switch 中文名稱對照。
- `wardrobe-data-v34.js`、`farmer-preview-v33.js`、`animal-preview-v33.js`：衣櫥與角色／動物 sprite 預覽。
- `build-cloudflare.sh`：Cloudflare Pages 建置腳本。
- `.github/workflows/pages.yml`：GitHub Pages 備援部署。

資料檔名中的版本尾碼是歷史資料 schema 名稱，目前仍由 runtime 直接引用，因此暫時保留；舊的測試稿與一次性 migration workflow 不留在 `main`。

## 建置／部署

Cloudflare Pages：

- Production branch：`main`
- Build command：`bash build-cloudflare.sh`
- Build output directory：`dist`

GitHub Pages 由 `.github/workflows/pages.yml` 自動建置；兩邊都使用 esbuild 將 `app.jsx` 打包成瀏覽器可執行的 `app.js`。

## 語言與資產規則

- App 自己的介面、說明與功能文案使用繁體中文（台灣用語）。
- 遊戲內專有名詞以 Switch 版《星露谷物語》遊戲本體實際顯示為準；搜尋別名另外支援繁中／簡中／英文，不用顯示字串當資料 ID。
- 高頻導航、NPC 頭像、日曆／地圖等核心圖優先由 repo 內 `assets/game` 提供；未本地化的遊戲圖仍可回退 Stardew Valley Wiki，並由 Service Worker runtime cache。
- 大型查找與完整衣櫥目錄採延後載入；後續世界／NPC 行程／完整分類等資料模組也沿用此原則。

## 資料來源與聲明

遊戲資料以《星露谷物語》1.6 為基準，名稱以 Switch 中文版本實際顯示為優先；圖鑑、魚類、NPC、設備與遊戲圖片主要參考 Stardew Valley Wiki 及遊戲資料。

本專案為非官方玩家工具，與 ConcernedApe、Stardew Valley 官方及 Stardew Valley Wiki 無隸屬關係。《Stardew Valley》及其遊戲素材之權利歸原權利人所有。
