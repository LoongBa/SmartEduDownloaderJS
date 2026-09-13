# Edge Add-ons 商店提交资料（SmartEduDownloader v2.2.0）

> 提交地址：[Partner Center](https://partner.microsoft.com) → Edge 程序 → Create new extension
> 上传包：`SmartEduDownloader-v2.2.0.zip`（位于仓库根目录，manifest 已在 zip 根目录）

## 1. 扩展包（Packages）

- 文件：`SmartEduDownloader-v2.2.0.zip`（13KB，已打包）

## 2. 可用性（Availability）

- **可见性**：Public（公开）
- **市场**：默认全部（建议先只选"中国"测试，稳定后放开）

## 3. 属性（Properties）

| 字段 | 值 |
|------|-----|
| 类别 | **Education（教育）** |
| 网站 | https://loongba.cn |
| 支持联系 | https://loongba.cn（或 loongba 博客留言） |
| 成人内容 | 否 |

## 4. 商店列表（Store listings）— 简体中文

### 名称
`SmartEduDownloader - 国家智慧教育平台教材下载`

### 短描述（manifest 中的 description，≤132 字符）
`一键下载国家中小学智慧教育平台电子教材。自动从 PDF 播放器提取地址与 X-ND-AUTH 鉴权头，支持新版 CDN；未登录时高亮登录按钮提示。`

### 长描述（≥250 字符，复制以下内容）

```
一键下载【国家中小学智慧教育平台】（basic.smartedu.cn）电子教材的浏览器插件，无需安装任何软件。

【功能特点】
• 一键下载：打开教材页面，右下角自动出现【教材】下载按钮，点击即可下载 PDF
• 自动鉴权：自动从 PDF 播放器提取下载地址与 X-ND-AUTH 鉴权头，支持平台新版 CDN（r1~r3-ndr-private.ykt.cbern.com.cn）
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

### Logo（每语言必填）
- 文件：`extension/store-logo-300.png`（300×300，蓝色圆底白色下箭头）

### 截图（建议 1280×800，最多 6 张）
需要**实际操作截图**，建议：
1. 教材详情页：右下角蓝色【教材】浮动按钮（配图标绿色状态）
2. 点击后弹出的下载面板（书名 + 下载按钮 + 地址 + 返回链接）
3. 扩展菜单：五个链接（教材目录 / 龙爸 / Github / Gitee / GitCode）
4. 下载完成提示 Toast（"下载完成"）
5. 未登录场景：登录按钮高亮 + 浮动提示

> 截图准备：打开 `basic.smartedu.cn` 教材页 → 安装扩展 → 依次截取以上场景。

### 搜索词
```
SmartEduDownloader, 国家智慧教育平台, 智慧教育, 电子教材, 教材下载, 中小学教材, 义务教育, 课本下载, smartedu, 教材PDF, 免费教材
```

## 5. 认证说明（Notes for certification）

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

## 6. 隐私政策

扩展**不收集任何用户数据**，但仍需按商店要求提供隐私政策 URL。建议在 loongba.cn 挂一页，文本模板：

```
# 隐私政策 - SmartEduDownloader

SmartEduDownloader 浏览器扩展（下称"本扩展"）尊重并保护您的个人隐私。

## 数据收集
本扩展【不收集、不存储、不上传、不共享】任何个人数据。所有功能均在您的浏览器本地完成。

## 权限说明
1. tabs：仅用于检测浏览器是否已打开国家智慧教育平台标签页，以及切换扩展图标颜色（教材详情页变绿）。
2. host_permissions（仅限定以下域名）：
   - basic.smartedu.cn / *.smartedu.cn：注入下载按钮
   - r1~r3-ndr-private.ykt.cbern.com.cn：携带平台生成的鉴权头下载教材 PDF
3. 本扩展不读取、不修改、不发送您的任何个人信息、浏览历史、账号数据。

## 数据共享
本扩展不向任何第三方共享任何数据。

## 联系我们
如有疑问，请通过 https://loongba.cn 联系我们。

最后更新：2026-09-14
```

## 7. 版本记录（每次提交需递增 version）

- 2.2.0：首次发布
