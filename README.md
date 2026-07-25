# Open Jam Portfolio

Open Jam 是一個使用 Angular 與 ASP.NET Core Web API 建立的全端個人作品集網站，包含公開作品展示、作品詳細頁面，以及具備 JWT 驗證與角色授權的後台管理功能。

## 專案功能

### 公開網站

- 個人介紹頁面
- 首頁作品自動輪播
- 公開作品集列表
- 作品詳細頁面
- 技能與開發工具介紹
- 響應式版面設計
- 403 無權限頁面
- 404 找不到頁面

### 後台管理

- 管理員登入
- JWT 身分驗證
- Writer 角色授權
- Angular Auth Guard 路由保護
- 登入狀態初始化與重新整理恢復
- 作品新增、修改與刪除
- 技術項目新增、修改與刪除
- 圖片選擇與作品圖片設定
- 未登入使用者無法進入後台路由

## 使用技術

### Frontend

- Angular
- TypeScript
- HTML
- CSS
- Bootstrap
- Angular Signals
- Angular Router
- Angular HttpClient
- Angular Functional Interceptor
- Angular Route Guards
- RxJS

### Backend

- ASP.NET Core Web API
- C#
- Entity Framework Core
- ASP.NET Core Identity
- JWT Authentication
- Role-based Authorization
- Repository Pattern

### Database

- SQL Server

### Development Tools

- Git
- GitHub
- Visual Studio
- Visual Studio Code
- Swagger

## 專案結構

```text
open-jam-portfolio/
├─ API/
│  └─ Portfolio.API/        # ASP.NET Core Web API
├─ Portfolio/               # Angular 前端
├─ .gitignore
└─ README.md
```

## 本機執行方式

### 1. 下載專案

```bash
git clone https://github.com/jampeng-rd/open-jam-portfolio.git

cd open-jam-portfolio
```

### 2. 啟動 ASP.NET Core 後端

進入後端專案資料夾：

```bash
cd API/Portfolio.API
```

還原 NuGet 套件：

```bash
dotnet restore
```

啟動後端：

```bash
dotnet run
```

後端啟動後，請依終端機顯示的網址開啟 API。

例如：

```text
https://localhost:7014
```

Swagger 網址可能為：

```text
https://localhost:7014/swagger
```

實際 Port 請以專案啟動時顯示的網址為準。

### 3. 啟動 Angular 前端

開啟另一個終端機，回到專案根目錄後進入 Angular 專案：

```bash
cd Portfolio
```

安裝 npm 套件：

```bash
npm install
```

啟動 Angular 開發伺服器：

```bash
npm start
```

也可以使用 Angular CLI：

```bash
ng serve
```

前端預設網址：

```text
http://localhost:4200
```

## 前端環境設定

前端 API 網址設定於：

```text
Portfolio/src/environments/environment.ts
```

範例：

```typescript
export const environment = {
  apiBaseUrl: 'https://localhost:7014',
};
```

請將 `apiBaseUrl` 設定成實際的 ASP.NET Core API 網址。

開發環境若有獨立設定檔，也請確認：

```text
Portfolio/src/environments/environment.development.ts
```

## 後端環境設定

後端執行前需要設定：

- SQL Server Connection String
- JWT Issuer
- JWT Audience
- JWT Key
- JWT Expiry Minutes
- 初始管理員帳號
- 初始管理員 Email
- 初始管理員密碼

敏感資料不應直接提交到 GitHub。

建議使用：

- ASP.NET Core User Secrets
- 作業系統環境變數
- 部署平台的 Secret 設定

### User Secrets 範例

進入後端專案資料夾：

```bash
cd API/Portfolio.API
```

初始化 User Secrets：

```bash
dotnet user-secrets init
```

設定 JWT Key：

```bash
dotnet user-secrets set "Jwt:Key" "請填入安全且足夠長度的-JWT-Key"
```

設定管理員帳號：

```bash
dotnet user-secrets set "AdminUser:UserName" "管理員帳號"
```

設定管理員 Email：

```bash
dotnet user-secrets set "AdminUser:Email" "管理員信箱"
```

設定管理員密碼：

```bash
dotnet user-secrets set "AdminUser:Password" "管理員密碼"
```

目前 User Secrets 使用的結構如下：

```json
{
  "AdminUser": {
    "UserName": "帳號",
    "Email": "信箱",
    "Password": "密碼"
  },
  "Jwt": {
    "Key": "金鑰"
  }
}
```

> User Secrets 的設定名稱必須與專案內實際使用的設定路徑一致。

## 資料庫設定

建立或更新資料庫前，請先確認 SQL Server 已啟動，並完成 Connection String 設定。

進入後端專案：

```bash
cd API/Portfolio.API
```

套用 Entity Framework Core Migration：

```bash
dotnet ef database update
```

如果尚未安裝 Entity Framework Core CLI：

```bash
dotnet tool install --global dotnet-ef
```

如果已安裝但需要更新：

```bash
dotnet tool update --global dotnet-ef
```

查看目前 Migration：

```bash
dotnet ef migrations list
```

## 身分驗證與授權

系統使用 JWT 驗證登入狀態，並透過角色授權保護後台 API。

目前主要角色：

- Reader
- Writer

其中新增、修改與刪除功能需要 `Writer` 權限。

### 登入流程

1. 使用者輸入帳號與密碼。
2. Angular 呼叫 ASP.NET Core 登入 API。
3. 後端驗證帳號與密碼。
4. 驗證成功後回傳 JWT。
5. 前端將 Token 保存於 `sessionStorage`。
6. Angular Interceptor 自動在 API Request 加入 Bearer Token。
7. Angular 呼叫 `/api/auth/me` 取得目前使用者與角色。
8. Auth Guard 根據角色決定是否允許進入後台頁面。

### Token 儲存位置

Token 儲存在瀏覽器的：

```text
sessionStorage
```

使用的 Key：

```text
portfolio_access_token
```

關閉瀏覽器分頁或工作階段結束後，Token 會被移除。

## 主要 API 功能

### Authentication

- 管理員登入
- 取得目前登入使用者
- JWT 驗證
- Writer 角色授權

### Portfolio

- 取得全部作品
- 取得首頁指定數量的公開作品
- 依 ID 取得作品
- 依作品名稱取得詳細資料
- 新增作品
- 修改作品
- 刪除作品

首頁作品 API 範例：

```http
GET /api/portfolio/home-preview?count=5
```

`count` 必須介於後端允許的範圍內。

### Technology

- 取得技術列表
- 新增技術
- 修改技術
- 刪除技術

### Images

- 取得圖片列表
- 上傳圖片
- 選擇作品圖片
- 刪除圖片

## 前端路由

公開頁面包含：

```text
/
```

首頁。

```text
/about-me
```

個人介紹頁面。

```text
/portfolio-projects
```

公開作品集列表。

```text
/portfolio/:url
```

作品詳細頁面。

```text
/login
```

管理員登入頁面。

後台頁面包含：

```text
/admin/portfolios
```

作品管理。

```text
/admin/portfolios/add
```

新增作品。

```text
/admin/portfolios/edit/:id
```

修改作品。

```text
/admin/technologys
```

技術管理。

```text
/admin/technologys/add
```

新增技術。

```text
/admin/technologys/edit/:id
```

修改技術。

## 專案特色

### 前後端分離

Angular 負責使用者介面與前端互動，ASP.NET Core Web API 負責資料存取、驗證、授權與商業邏輯。

### 公開與後台功能分離

一般訪客可以查看公開作品與個人介紹，只有具備 `Writer` 角色的登入使用者能夠進入管理後台。

### 路由保護

Angular 使用 Auth Guard 保護後台頁面，並使用 Guest Guard 避免已登入使用者再次進入登入頁。

### API 權限保護

即使略過前端路由，ASP.NET Core API 仍透過：

```csharp
[Authorize(Roles = "Writer")]
```

保護新增、修改與刪除功能。

### 登入狀態恢復

重新整理瀏覽器後，Angular 會讀取 `sessionStorage` 中的 Token，重新呼叫目前使用者 API，恢復登入狀態與角色資訊。

### 響應式設計

網站使用 Bootstrap 與自訂 CSS，支援桌面、平板與手機畫面。

## 專案狀態

目前第一版本已完成：

- Angular 公開網站
- ASP.NET Core Web API
- SQL Server 資料庫
- 個人介紹頁面
- 公開作品集列表
- 作品詳細頁面
- 首頁自動作品輪播
- 管理員登入
- JWT 身分驗證
- 前端登入狀態管理
- Auth Guard
- Guest Guard
- Writer 角色授權
- 作品管理
- 技術管理
- 圖片選擇功能
- 403 無權限頁面
- 404 找不到頁面
- 響應式版面設計

## 作者

Jam

Email：

```text
jampeng.rd@gmail.com
```

## 使用說明

本專案目前作為個人作品集與技術展示用途。

未經作者同意，請勿直接複製、修改或重新發布專案內容。
