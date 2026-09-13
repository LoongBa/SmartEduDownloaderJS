/*
 * SmartEduDownloader - popup 菜单逻辑
 *
 * 1. 打开 popup 时：若浏览器没有任何国家智慧教育平台标签页，
 *    在【后台】打开官网教材目录 https://basic.smartedu.cn/tchMaterial
 *    （不抢焦点，避免 popup 被关闭）
 * 2. 菜单链接：点击后在新标签页前台打开对应地址
 */
(function () {
    'use strict';

    var statusEl = document.getElementById('status');

    function showStatus(text) {
        if (statusEl) statusEl.textContent = text;
    }

    // 确保有国家智慧教育平台的标签页（后台打开，不干扰 popup）
    function ensureEduTab() {
        chrome.tabs.query({}, function (tabs) {
            var eduTab = null;
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].url && /smartedu\.cn/i.test(tabs[i].url)) {
                    eduTab = tabs[i];
                    break;
                }
            }

            if (eduTab) {
                showStatus('✅ 已在国家智慧教育平台');
            } else {
                chrome.tabs.create({
                    url: 'https://basic.smartedu.cn/tchMaterial',
                    active: false
                });
                showStatus('📖 教材目录已在后台打开');
            }
        });
    }

    // 菜单链接点击：新标签页前台打开
    document.querySelectorAll('.menu-item').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            var url = item.getAttribute('data-url');
            if (url) {
                chrome.tabs.create({ url: url });
            }
        });
    });

    // 打开 popup 时执行
    ensureEduTab();
})();
