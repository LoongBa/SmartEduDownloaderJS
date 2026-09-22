/*
 * SmartEduDownloader - 后台 Service Worker
 *
 * 图标颜色逻辑：
 * - 当前活动标签页是教材详情页（URL 含 contentId）→ 绿色图标
 * - 其他情况 → 蓝色图标
 * （点击行为统一由 popup 处理：详情页显示下载视图，其他页面显示菜单）
 */
(function () {
    'use strict';

    var BLUE_ICON = {
        16: 'icons/icon16.png',
        48: 'icons/icon48.png',
        128: 'icons/icon128.png'
    };
    var GREEN_ICON = {
        16: 'icons/icon16_green.png',
        48: 'icons/icon48_green.png',
        128: 'icons/icon128_green.png'
    };

    // ==================== 鉴权头捕获（webRequest） ====================
    // 从 pdf.js 加载 PDF 的真实网络请求中捕获 X-ND-AUTH 等鉴权头。
    // 某些教材的 iframe src 不含 headers= 参数，下载时必须用这里捕获的头。
    var lastAuthHeaders = null;
    var lastCaptureTime = 0;

    chrome.webRequest.onBeforeSendHeaders.addListener(
        function (details) {
            if (!details.requestHeaders) return;
            var h = {};
            for (var i = 0; i < details.requestHeaders.length; i++) {
                var name = details.requestHeaders[i].name;
                h[name] = details.requestHeaders[i].value;
            }
            // 优先缓存含 x-nd-auth 的请求（PDF 请求），否则缓存最后一个
            var hasAuth = !!(h['x-nd-auth'] || h['X-ND-Auth'] || h['X-ND-AUTH']);
            if (hasAuth || !lastAuthHeaders) {
                lastAuthHeaders = h;
                lastCaptureTime = Date.now();
            }
        },
        { urls: ['*://*.ykt.cbern.com.cn/*'] },
        ['requestHeaders']
    );

    // content script 请求捕获的鉴权头
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message && message.type === 'get-auth-headers') {
            sendResponse(lastAuthHeaders);
        }
        return true; // 异步响应
    });

    function isTextbookDetail(url) {
        return !!(url && /contentId=/.test(url));
    }

    // 用 URL 直接更新图标（同步，避免异步竞态）
    function updateIconWithUrl(tabId, url) {
        if (tabId === undefined || tabId === null) return;
        chrome.action.setIcon({ tabId: tabId, path: isTextbookDetail(url) ? GREEN_ICON : BLUE_ICON });
    }

    function updateIcon(tabId) {
        chrome.tabs.get(tabId, function (tab) {
            if (chrome.runtime.lastError) return; // 标签页已关闭
            updateIconWithUrl(tabId, tab.url);
        });
    }

    // 更新当前窗口活动标签页的图标
    function checkActiveTab() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs.length > 0) {
                updateIcon(tabs[0].id);
            }
        });
    }

    // 切换标签页
    chrome.tabs.onActivated.addListener(function (info) {
        updateIcon(info.tabId);
    });

    // URL 变化 或 页面加载完成 时更新图标
    // 🔑 F5 刷新同一 URL 不触发 changeInfo.url（URL 未变），但必然触发 status 事件
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.url || changeInfo.status === 'complete') {
            updateIconWithUrl(tabId, tab && tab.url);
        }
    });

    // 窗口焦点变化（popup 打开也会触发，作为兜底）
    chrome.windows.onFocusChanged.addListener(function (windowId) {
        if (windowId !== chrome.windows.WINDOW_ID_NONE) {
            checkActiveTab();
        }
    });

    // 初始化
    checkActiveTab();
})();
