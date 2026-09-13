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

    function updateIcon(tabId) {
        chrome.tabs.get(tabId, function (tab) {
            if (chrome.runtime.lastError) return; // 标签页已关闭
            var isTextbookDetail = !!(tab.url && /contentId=/.test(tab.url));
            chrome.action.setIcon({ tabId: tabId, path: isTextbookDetail ? GREEN_ICON : BLUE_ICON });
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

    // 标签页 URL 变化
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
        if (changeInfo.url) {
            updateIcon(tabId);
        }
    });

    // 窗口焦点变化
    chrome.windows.onFocusChanged.addListener(function (windowId) {
        if (windowId !== chrome.windows.WINDOW_ID_NONE) {
            checkActiveTab();
        }
    });

    // 初始化
    checkActiveTab();
})();
