
智慧班級管理平台 (Smart Classroom)
這是一個專為國小級任教師設計的現代化班級管理平台。

功能特色
學生管理

視覺化座位表

每日出缺席紀錄

成績管理

數位作品繳交 (整合 Google Drive)

課堂即時互動 (PingPong)

技術棧
前端: Vue 3 (Composition API) + Vite

狀態管理: Pinia

路由: Vue Router

後端服務: Firebase (Authentication, Firestore, Storage, Functions)

部署: Vercel

安裝與啟動
安裝依賴

npm install

啟動開發伺服器

npm run dev

本專案的詳細規格與開發指南請參考相關文件。


智慧班級管理平台 - 專案檔案結構表
本文件定義了「智慧班級管理平台」專案的標準檔案與資料夾結構。此結構旨在提高程式碼的可維護性、可讀性與可擴展性。

smart-classroom/
├── .gitignore               # Git 忽略清單，避免將 node_modules 等檔案上傳
├── index.html               # 網站的 HTML 進入點
├── package.json             # 專案依賴與腳本設定
├── README.md                # 專案說明文件
├── vite.config.js           # Vite 開發伺服器與建構設定檔
│
├── public/                  # 靜態資源資料夾 (不會被 Vite 處理)
│   └── favicon.ico          # 網站圖示
│
└── src/                     # 核心原始碼目錄
    │
    ├── assets/              # 靜態資源資料夾 (會被 Vite 處理)
    │   ├── images/          # 專案用到的圖片 (Logo, 背景圖等)
    │   └── styles/          # 全域 CSS 樣式
    │       └── main.css     # 主要的全域樣式檔
    │
    ├── components/          # 可複用的 Vue 元件
    │   ├── layout/          # 頁面佈局元件
    │   │   ├── TheNavbar.vue  # 頂部導覽列
    │   │   └── TheSidebar.vue # 側邊功能選單
    │   │
    │   ├── shared/          # 共用基礎元件
    │   │   ├── BaseButton.vue # 基礎按鈕元件
    │   │   ├── BaseModal.vue  # 基礎彈出視窗元件
    │   │   ├── LoadingSpinner.vue # 讀取中圖示
    │   │   └── DrawingCanvas.vue # 繪圖板元件
    │   │
    │   ├── StudentCard.vue    # 學生名片元件
    │   └── SeatingChart.vue   # 座位表核心元件
    │
    ├── composables/         # 可複用的組合式函數 (Composition API)
    │   ├── useAuth.js         # 處理使用者認證狀態的邏輯
    │   └── useFirestore.js    # 封裝 Firestore 數據操作的邏輯
    │
    ├── router/              # 路由設定
    │   └── index.js         # 定義所有頁面路徑
    │
    ├── services/            # 外部服務串接層
    │   ├── firebase.js        # Firebase 初始化與設定
    │   ├── authService.js     # 封裝 Firebase Authentication 相關操作
    │   ├── firestoreService.js# 封裝 Firestore 資料庫 CRUD 操作
    │   └── googleDriveService.js # 封裝 Google Drive API 相關操作
    │
    ├── stores/              # Pinia 狀態管理
    │   ├── authStore.js       # 管理使用者登入狀態、使用者資料
    │   ├── classStore.js      # 管理班級、學生、座位表等核心資料
    │   └── uiStore.js         # 管理 UI 狀態 (例如：Modal 是否開啟)
    │
    ├── utils/               # 共用工具函數
    │   ├── formatters.js      # 日期、文字格式化工具
    │   └── fileHandlers.js    # 處理檔案上傳 (如 Excel, 圖片)
    │
    ├── views/               # 頁面級別的元件
    │   ├── LoginView.vue        # 登入頁
    │   ├── DashboardView.vue    # 主控台/儀表板頁
    │   ├── StudentManageView.vue# 學生管理頁
    │   ├── SeatingChartView.vue # 座位表編輯頁
    │   ├── AttendanceView.vue   # 出缺席紀錄頁
    │   ├── GradeRecordView.vue  # 成績紀錄頁
    │   ├── AssignmentView.vue   # 數位作品繳交頁
    │   └── InteractiveView.vue  # 課堂互動 (PingPong) 頁
    │
    ├── App.vue                # 應用程式的根元件
    └── main.js                # 專案進入點 (初始化 Vue, Pinia, Router)


結構說明
public/ vs src/assets/:

放在 public 的檔案會被直接複製到最終建構的根目錄，適合放 favicon.ico 或 robots.txt。

放在 src/assets 的檔案會被 Vite 視為原始碼的一部分進行處理和優化，適合放圖片、CSS、字體等。

components/ vs views/:

components 存放的是可到處重複使用的「積木」，例如一個按鈕、一張卡片。

views 存放的是代表一個完整「頁面」的元件，它通常會組合多個 components 來構成畫面。每個路由對應到一個 View。

services/:

這是一個非常重要的概念，稱為「關注點分離」。我們將所有與 Firebase 或 Google API 溝通的程式碼集中放在這裡。這樣做的好處是，如果未來要更換資料庫，我們只需要修改 services 裡面的檔案，而不用動到畫面 (views 或 components) 的程式碼。

stores/:

使用 Pinia 來做全域狀態管理。當多個頁面需要共享或修改同一份資料時（例如：目前登入的使用者是誰），就將該資料放在 Store 中。

composables/:

這是 Vue 3 Composition API 的精華。可以將一些可複用的邏輯（例如：訂閱某個資料庫的即時更新）抽出來變成一個 use 開頭的函式，讓元件的程式碼更乾淨。

這份結構表為專案提供了一個清晰的藍圖，您可以依照這個藍圖開始逐步建立對應的資料夾與檔案。