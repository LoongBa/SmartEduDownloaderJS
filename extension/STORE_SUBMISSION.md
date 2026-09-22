# Edge Add-ons 商店提交资料（中小学教材免费下载 v2.2.1）

# Edge Add-ons Store Submission Kit (Free Primary & Secondary Textbook Download v2.2.1)

> 提交地址 / Submit at: [Partner Center](https://partner.microsoft.com) → Edge 程序 → Create new extension
> 上传包 / Package: `SmartEduDownloader-v2.2.1.zip`（仓库根目录，manifest 已在 zip 根目录 / repo root, manifest at zip root）

---

## 一句话描述 / One-line Description

> 帮助用户找到官方免费提供的中小学教材电子版，最新、最权威，并一键下载，方便老师教学、学生自学和家长辅导。
> Helps users find the latest, most authoritative official free electronic textbooks for primary and secondary schools, and download them with one click — convenient for teachers' instruction, students' self-study, and parents' tutoring.

---

## 1. 扩展包 / Packages

- 文件 / File：`SmartEduDownloader-v2.2.1.zip`（约 13KB，已打包 / packaged）
- 上传后 Partner Center 会自动校验 manifest / Partner Center validates the manifest automatically after upload

## 2. 可用性 / Availability

| 字段 / Field        | 值 / Value                                                                    |
| ------------------- | ----------------------------------------------------------------------------- |
| 可见性 / Visibility | Public（公开 / Public）                                                       |
| 市场 / Markets      | **仅中国（先小范围发布，稳定后放开）** / **China only (pilot, expand later)** |

## 3. 属性 / Properties

| 字段 / Field               | 值 / Value                                                                                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 类别 / Category            | **Productivity（效率工具）** —— Edge 商店无 Education 分类，下载工具归 Productivity 最贴切 / No Education category in Edge store; Productivity is the best fit for a download utility |
| 网站 / Website             | https://loongba.cn                                                                                                                                                                    |
| 支持联系 / Support contact | https://loongba.cn                                                                                                                                                                    |
| 成人内容 / Mature content  | 否 / No                                                                                                                                                                               |

## 4. 商店列表 / Store listings — 简体中文 / Simplified Chinese

### 名称 / Name

```
中小学教材免费下载
Free Primary & Secondary Textbook Download
```

### 短描述 / Short description（manifest 的 description，≤132 字符 / from manifest, ≤132 chars）

```
一键下载国家中小学智慧教育平台电子教材。自动从 PDF 播放器提取地址与 X-ND-AUTH 鉴权头，支持新版 CDN；未登录时高亮登录按钮提示。
```

### 长描述 / Long description（≥250 字符 / ≥250 chars）— 中文版 / Chinese version

```
一键下载【国家中小学智慧教育平台】（basic.smartedu.cn）电子教材的浏览器插件，无需安装任何软件。

【功能特点】
• 一键下载：打开教材页面，右下角自动出现【教材】下载按钮，点击即可下载 PDF
• 登录提示：未登录时自动高亮登录按钮并浮动提示（老版本教材无需登录，新版本教材需登录）
• 智能图标：当前页为教材详情页时，扩展图标自动变为绿色，一眼识别可下载状态
• 便捷菜单：点击扩展图标弹出菜单，一键直达教材目录、作者博客、Github/Gitee/GitCode 仓库
• 安全返回：下载完成后提供【返回】按钮，点击刷新页面恢复正常浏览

【使用步骤】
1. 登录并打开教材详情页（URL 含 contentId）
2. 点击页面右下角【教材】按钮
3. 点击【下载教材 PDF】，文件自动保存

【隐私说明】
本扩展不收集、不上传、不共享任何用户数据。所有操作均在本地浏览器完成：
- 仅在教材详情页注入下载按钮（content_scripts，限定 smartedu.cn 域名）
- 权限仅用于：读取当前标签页 URL 以切换图标颜色、检测浏览器是否打开教材平台标签页、访问教材 CDN 以下载 PDF
- 无远程代码、无统计追踪、无广告

【特别声明】
本项目代码出于学习目的，对相关网站主体的权利、电子书籍版权等不构成任何威胁和侵权行为，请勿用于其它用途或牟利。
```

### 长描述 / Long description — English version (if adding en-US)

```
A browser extension that downloads electronic textbooks from the National Smart Education Platform (basic.smartedu.cn) with one click — no software installation required.

【Features】
• One-click download: open a textbook page, the 【Textbook】 button appears at the bottom-right; click to download the PDF
• Automatic authentication: automatically extracts the download URL and X-ND-AUTH auth header from the PDF player, supports the platform's new CDN (r1~r3-ndr-private.ykt.cbern.com.cn)
• Login reminder: highlights the login button with a floating hint when not logged in (older textbooks need no login; newer editions do)
• Smart icon: the extension icon turns green on textbook detail pages — downloadable state at a glance
• Convenient menu: click the extension icon for quick links to the textbook catalog, author blog, and Github/Gitee/GitCode repos
• Safe return: a 【Back】 button refreshes the page back to normal after download

【How to use】
1. Log in and open a textbook detail page (URL contains contentId)
2. Click the 【Textbook】 button at the bottom-right of the page
3. Click 【Download Textbook PDF】; the file is saved automatically

【Privacy】
This extension does NOT collect, upload, or share any user data. Everything runs locally in your browser:
- The download button is injected only on textbook detail pages (content_scripts limited to smartedu.cn)
- Permissions are used only to: read the current tab URL to switch the icon color, check whether the browser has the platform tab open, and access the textbook CDN for downloading PDFs
- No remote code, no tracking, no ads

【Disclaimer】
This project is for learning purposes and does not infringe the rights of the website or the copyright of the e-books. Do not use it for other purposes or profit.
```

### Logo

- 文件 / File：`extension/store-logo-300.png`（300×300，蓝色圆底白色下箭头 / blue rounded square with white down arrow）

### 截图 / Screenshots（建议 1280×800，最多 6 张 / recommended 1280×800, max 6）

1. 教材详情页：右下角蓝色【教材】浮动按钮 + 图标绿色状态 / Textbook detail page with the blue floating button and green icon state
2. 点击后弹出的下载面板 / Download panel (title + download button + URL + back link)
3. 扩展菜单：五个链接 / Extension menu with five links
4. 下载完成提示 / "Download complete" toast
5. 未登录场景：登录按钮高亮 + 提示 / Not-logged-in state: highlighted login button + hint

> 截图准备：打开 basic.smartedu.cn 教材页 → 安装扩展 → 依次截取 / Take screenshots on a textbook page with the extension installed.

### 搜索词 / Search terms

```
中小学, 免费, 智慧教育, 教材, 课本, 义务教育
```

## 5. 认证说明 / Notes for certification

中文版 / Chinese version：

```
1. 测试环境：需要先登录国家中小学智慧教育平台（basic.smartedu.cn），使用任意账号登录后打开教材详情页（URL 含 contentId）。
2. 测试步骤：
   a. 打开 https://basic.smartedu.cn/tchMaterial 选择任意教材进入详情页；
   b. 等待 PDF 预览加载完成（pdfPlayerFirefox iframe）；
   c. 点击页面右下角【教材】浮动按钮；
   d. 面板出现后点击【下载教材 PDF】，浏览器开始下载文件；
   e. 未登录时点击按钮会高亮页面登录按钮并提示登录。
3. 权限说明：tabs 权限仅用于检测浏览器是否已打开教材平台标签页（决定是否自动打开教材目录）以及图标颜色切换；host_permissions 仅限定 smartedu.cn 与教材 CDN 域名。
4. 扩展不收集任何用户数据，无远程代码。
```

English version：

```
1. Test environment: log in to the National Smart Education Platform (basic.smartedu.cn) with any account, then open a textbook detail page (URL contains contentId).
2. Test steps:
   a. Open https://basic.smartedu.cn/tchMaterial and enter any textbook detail page;
   b. Wait for the PDF preview to finish loading (pdfPlayerFirefox iframe);
   c. Click the 【Textbook】 floating button at the bottom-right of the page;
   d. Click 【Download Textbook PDF】 in the panel; the browser starts downloading;
   e. When not logged in, clicking the button highlights the page login button and shows a hint.
3. Permissions: the "tabs" permission only checks whether the browser has the platform tab open (to decide whether to auto-open the catalog) and switches the icon color; host_permissions are limited to smartedu.cn and the textbook CDN domains.
4. The extension collects no user data and uses no remote code.
```

## 6. 隐私政策 / Privacy policy

- URL：`https://github.com/LoongBa/SmartEduDownloaderJS/blob/main/PRIVACY.md`（仓库内 / in repo）
- 提示：需先 `git push` 到 GitHub 后 URL 才可访问 / Note: push to GitHub first so the URL is accessible
- 扩展不收集数据，但建议填写以满足审核 / The extension collects no data, but filling it in is recommended for review

## 7. 权限说明 / Permission justification（1000 字符内 / within 1000 chars each）

### tabs justification

```
The "tabs" permission is used only to: 1) check whether the browser has a tab open on the National Smart Education Platform (basic.smartedu.cn) when the extension menu opens, and open the official textbook catalog in a background tab if none exists; 2) read the current active tab's URL to determine whether it is a textbook detail page (URL contains "contentId"), so the extension icon turns green (downloadable state) or blue. No other page content is read, stored, or uploaded.
【中文】tabs 权限仅用于检测浏览器是否已打开教材平台标签页（无则后台打开教材目录），以及读取当前标签页 URL 切换图标颜色。不读取/存储/上传任何其他内容。
```

### Host permission justification

```
Host permissions are strictly limited to two domain groups: 1) basic.smartedu.cn and *.smartedu.cn, where the content script injects the download button on textbook detail pages only; 2) r1/r2/r3-ndr-private.ykt.cbern.com.cn, the CDN that serves textbook PDF files, which requires the platform-generated X-ND-AUTH header during download (otherwise the CDN returns 401). No <all_urls> or other wildcard permissions are requested; every permission is required for the single purpose of downloading textbook PDFs.
【中文】host_permissions 仅限教材平台域名（注入下载按钮）与教材 PDF 的 CDN 域名（携带 X-ND-AUTH 鉴权头下载）。无任何通配权限，全部为单一下载用途所需。
```

### Are you using remote code? → 选 / Select **No**

```
The extension does not use any remote code. All JavaScript (content.js, popup.js, background.js) and resources (HTML, CSS, icons) are bundled in the package; no external <script>, no dynamic external modules, no eval() of remote strings.
【中文】扩展无远程代码，全部 JS 与资源均打包在扩展包内。
```

### Data usage

- 全部选"不收集" / Select "no data collected" for all

### Certification checkboxes

- 三个声明全部勾选 / Check all three certification boxes

## 8. 版本记录 / Version history

- 2.2.1：改名「中小学教材免费下载」并首次发布 / Renamed and first release
- 每次提交需递增 version / Increment version for each submission
