/*
 * SmartEduDownloader - 后台 Service Worker
 *
 * 图标颜色与点击行为：
 * - 当前活动标签页是教材详情页（URL 含 contentId）→ 绿色图标
 * - 教材详情页：点击扩展图标 → 直接弹出下载面板（无 popup 菜单）
 * - 其他页面：点击扩展图标 → 打开菜单（popup.html）
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

    function isTextbookDetail(url) {
        return !!(url && /contentId=/.test(url));
    }

    // 更新指定 tab 的图标颜色 + popup 行为
    function updateTabState(tabId) {
        chrome.tabs.get(tabId, function (tab) {
            if (chrome.runtime.lastError) return; // 标签页已关闭
            var detail = isTextbookDetail(tab.url);

            // 图标颜色：详情页绿色，其他蓝色
            chrome.action.setIcon({ tabId: tabId, path: detail ? GREEN_ICON : BLUE_ICON });

            // 点击行为：详情页无 popup（触发 onClicked → 下载面板），其他页面显示菜单
            chrome.action.setPopup({ tabId: tabId, popup: detail ? '' : 'popup.html' });
        });
    }

    // 更新当前窗口活动标签页状态
    function checkActiveTab() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs.length > 0) {
                updateTabState(tabs[0].id);
            }
        });
    }

    // 详情页点击图标 → 通知 content script 显示下载面板
    chrome.action.onClicked.addListener(function (tab) {
        if (tab && tab.id !== undefined && isTextbookDetail(tab.url)) {
            chrome.tabs.sendMessage(tab.id, { type: 'smartedu-download' }, function () {
                if (chrome.runtime.lastError) {
                    // content script 未注入（页面未刷新），提示刷新
                    console.warn('content script 未响应:', chrome.runtime.lastError.message);
                }
            });
        }
    });

    // 切换标签页
    chrome.tabs.onActivated.addListener(function (info) {
        updateTabState(info.tabId);
    });

    // 标签页 URL 变化
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
        if (changeInfo.url) {
            updateTabState(tabId);
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
