# 中小学教材免费下载 浏览器插件

一键下载【国家智慧教育平台】电子教材的 Chrome / Edge 浏览器插件（Manifest V3）。

对应 `SmartEduDownloader.js` v2.2 的逻辑，封装为浏览器插件：打开教材页面右下角自动出现【教材】下载按钮，无需每次复制粘贴代码。

## 商店安装（推荐）

| 商店 | 链接 | 状态 |
|------|------|------|
| **Microsoft Edge Add-ons**（微软商店） | https://microsoftedge.microsoft.com/addons/ （发布后更新本行） | 🚧 已提交 / 审核中 |
| **Chrome Web Store**（谷歌商店） | 暂无 | ⏳ 筹备中 |

> 谷歌商店注册需一次性 $5 费用，暂未开通；Edge 商店免费。

## 手动安装（开发者模式加载）

商店未上架或想用最新开发版时，手动加载本目录：

1. **下载代码**：Clone 本仓库，或 [Download ZIP](https://github.com/LoongBa/SmartEduDownloaderJS/archive/refs/heads/main.zip) 后解压；
2. **打开扩展管理页**：
   - Edge：地址栏输入 `edge://extensions/`
   - Chrome：地址栏输入 `chrome://extensions/`
3. 打开右上角【**开发者模式**】开关；
4. 点击【**加载已解压的扩展程序**】，选择本仓库的 **`extension`** 文件夹；
5. 安装完成，工具栏出现「中小学教材免费下载」图标。

## 使用说明

1. 打开教材详情页（`basic.smartedu.cn`，URL 含 `contentId`）；
2. 页面**右下角**出现【教材】浮动按钮，点击：
   - **老版本教材**：直接点击【下载教材 PDF】（无需登录）；
   - **新版本教材**：需先登录（未登录时高亮登录按钮并提示）；
3. 下载面板提供【返回】链接，点击刷新当前页恢复正常浏览。

### 扩展图标颜色

- 🔵 **蓝色**：当前页面非教材详情页
- 🟢 **绿色**：当前页面是教材详情页（URL 含 `contentId`，可下载状态）

### 扩展菜单（点击工具栏图标）

- 📚 国家智慧教育平台 教材目录
- 🐉 爱学习的龙爸（loongba.cn）
- 🐙 Github 仓库
- 🟢 Gitee 仓库
- 🔵 GitCode 仓库（国内，无需注册）

> 打开菜单时若浏览器没有教材平台标签页，会自动在后台打开官网教材目录。

## 目录结构

```
extension/
├── manifest.json      # MV3 清单
├── content.js         # 内容脚本：浮动按钮 + 下载逻辑
├── popup.html         # 扩展菜单
├── popup.js           # 菜单逻辑 + 教材目录自动打开
├── background.js      # Service Worker：图标颜色状态
└── icons/             # 蓝色 + 绿色两套图标 (16/48/128)
```

## 更新日志

### v2.2.0
- 首次打包发布版本
- 弹出菜单（教材目录 / 龙爸博客 / Github / Gitee / GitCode）
- 扩展图标按教材详情页状态变绿
- 未登录高亮登录按钮；带 X-ND-AUTH 鉴权下载新版 CDN

## 相关链接

- [SmartEduDownloaderJS 主页](../README.md)
- [国家中小学智慧教育平台](https://basic.smartedu.cn/)
- [Github 仓库](https://github.com/LoongBa/SmartEduDownloaderJS)
- [Gitee 仓库](https://gitee.com/LoongBa/SmartEduDownloaderJS)
- [GitCode 仓库](https://gitcode.com/LoongBa/SmartEduDownloader)
