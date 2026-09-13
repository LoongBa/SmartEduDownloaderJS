/*
 * SmartEduDownloader - popup 菜单逻辑
 *
 * 1. 打开 popup 时：若浏览器当前没有任何国家智慧教育平台标签页，
 *    自动打开官网教材目录 https://basic.smartedu.cn/tchMaterial
 * 2. 菜单链接：点击后在新标签页打开对应地址
 */
(function () {
    'use strict';

    // 打开（或激活）国家智慧教育平台的标签页
    function openOrActivateEduTab() {
        chrome.tabs.query({}, function (tabs) {
            var eduTab = null;
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].url && /smartedu\.cn/i.test(tabs[i].url)) {
                    eduTab = tabs[i];
                    break;
                }
            }

            if (eduTab) {
                // 已有教材平台标签页 → 直接激活
                chrome.tabs.update(eduTab.id, { active: true });
                if (!eduTab.windowId || chrome.windows) {
                    chrome.windows.update(eduTab.windowId, { focused: true });
                }
            } else {
                // 没有 → 打开官网教材目录
                chrome.tabs.create({ url: 'https://basic.smartedu.cn/tchMaterial' });
            }
        });
    }

    // 菜单链接点击：在新标签页打开
    document.querySelectorAll('.menu-item').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            var url = item.getAttribute('data-url');
            if (url) {
                chrome.tabs.create({ url: url });
            }
        });
    });

    // 打开 popup 时执行：确保有教材平台标签页
    openOrActivateEduTab();
})();
