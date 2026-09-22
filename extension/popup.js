/*
 * SmartEduDownloader - popup 逻辑
 *
 * 打开 popup 时根据当前活动标签页动态渲染：
 * - 教材详情页（URL 含 contentId）→ 下载视图（下载按钮）
 * - 其他页面 → 菜单视图（教材目录 / 龙爸博客 / 仓库链接）
 */
(function () {
    'use strict';

    var content = document.getElementById('content');

    // ==================== 下载视图（教材详情页） ====================

    function showDownloadView(tab) {
        // 请求 content script 返回教材信息
        chrome.tabs.sendMessage(tab.id, { type: 'smartedu-get-info' }, function (resp) {
            var bookname = (resp && resp.bookname) || '教材';
            content.innerHTML =
                '<div class="download-view">' +
                '<div class="book">《' + bookname + '》</div>' +
                '<a class="btn" id="dl-btn">⬇ 下载教材 PDF</a>' +
                '<div class="downloaded-hint" id="dl-hint"></div>' +
                '<a class="more" href="https://loongba.cn" target="_blank" rel="noopener">更多免费教育资源 →</a>' +
                '</div>';

            // 已下载过提示：比对当前 contentId
            var idMatch = (tab.url || '').match(/contentId=([^&]+)/);
            var contentId = idMatch ? idMatch[1] : null;
            chrome.storage.local.get({ downloaded: {} }, function (data) {
                var downloaded = data.downloaded || {};
                var hintEl = document.getElementById('dl-hint');
                if (hintEl && contentId && downloaded[contentId]) {
                    hintEl.textContent = '✓ 已下载过';
                }
            });

            document.getElementById('dl-btn').addEventListener('click', function () {
                chrome.tabs.sendMessage(tab.id, { type: 'smartedu-download-direct' }, function () {
                    if (chrome.runtime.lastError) {
                        console.warn('content script 未响应:', chrome.runtime.lastError.message);
                    }
                    window.close(); // 触发下载后关闭 popup
                });
            });
        });
    }

    // ==================== 已下载列表 ====================

    // 渲染已下载列表（小字），最新在前
    function renderDownloadedList() {
        var listEl = document.getElementById('dl-list');
        if (!listEl) return;
        chrome.storage.local.get({ downloaded: {} }, function (data) {
            var downloaded = data.downloaded || {};
            var entries = [];
            for (var id in downloaded) {
                if (downloaded.hasOwnProperty(id)) {
                    entries.push({ id: id, bookname: downloaded[id].bookname, time: downloaded[id].time });
                }
            }
            entries.sort(function (a, b) { return (b.time || 0) - (a.time || 0); }); // 最新在前

            if (entries.length === 0) {
                listEl.innerHTML = '<div class="dl-empty">（暂无下载记录）</div>';
                return;
            }
            var html = '';
            entries.forEach(function (e) {
                var t = e.time ? new Date(e.time) : null;
                var timeStr = t ? (t.getMonth() + 1) + '/' + t.getDate() : '';
                html += '<div class="dl-item" title="' + e.id + '">' + escapeHtml(e.bookname) + ' <span class="dl-time">' + timeStr + '</span></div>';
            });
            listEl.innerHTML = html;
        });
    }

    function escapeHtml(s) {
        return String(s || '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // ==================== 菜单视图（其他页面） ====================

    function showMenuView() {
        content.innerHTML =
            '<div class="status">⏳ 正在检测教材平台标签页...</div>' +
            '<div class="menu">' +
            '<a class="menu-item" href="#" data-url="https://basic.smartedu.cn/tchMaterial">' +
            '<span class="icon" style="background:#e3f2fd">📚</span>' +
            '<span class="label">国家智慧教育平台 教材目录</span>' +
            '</a>' +
            '<div class="divider"></div>' +
            '<a class="menu-item" href="#" data-url="https://loongba.cn">' +
            '<span class="icon" style="background:#fff3e0">🐉</span>' +
            '<span class="label">爱学习的龙爸</span>' +
            '<span class="badge">loongba.cn</span>' +
            '</a>' +
            '<a class="menu-item" href="#" data-url="https://github.com/LoongBa/SmartEduDownloaderJS">' +
            '<span class="icon" style="background:#e8eaf6">🐙</span>' +
            '<span class="label">Github 仓库（国外）</span>' +
            '<span class="badge">Github</span>' +
            '</a>' +
            '<a class="menu-item" href="#" data-url="https://gitee.com/LoongBa/SmartEduDownloaderJS">' +
            '<span class="icon" style="background:#e8f5e9">🟢</span>' +
            '<span class="label">Gitee 仓库（国内）</span>' +
            '<span class="badge">Gitee</span>' +
            '</a>' +
            '<a class="menu-item" href="#" data-url="https://gitcode.com/LoongBa/SmartEduDownloader">' +
            '<span class="icon" style="background:#fce4ec">🔵</span>' +
            '<span class="label">GitCode 仓库（国内无需注册）</span>' +
            '<span class="badge">GitCode</span>' +
            '</a>' +
            '</div>' +
            '<div class="dl-section" id="dl-section">' +
            '<div class="dl-header">已下载列表 <a href="#" id="dl-clear" class="dl-clear">清空</a></div>' +
            '<div class="dl-list" id="dl-list"></div>' +
            '</div>';

        // 菜单链接点击：新标签页打开
        content.querySelectorAll('.menu-item').forEach(function (item) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                var url = item.getAttribute('data-url');
                if (url) chrome.tabs.create({ url: url });
            });
        });

        // 渲染已下载列表 + 清空
        renderDownloadedList();

        // 清空按钮
        var clearBtn = document.getElementById('dl-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', function (e) {
                e.preventDefault();
                chrome.storage.local.remove('downloaded', function () {
                    var list = document.getElementById('dl-list');
                    if (list) list.innerHTML = '<div class="dl-empty">（空）</div>';
                });
            });
        }

        // 检测教材平台标签页状态（无则后台打开教材目录）
        chrome.tabs.query({}, function (tabs) {
            var eduTab = null;
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].url && /smartedu\.cn/i.test(tabs[i].url)) {
                    eduTab = tabs[i];
                    break;
                }
            }
            var statusEl = content.querySelector('.status');
            if (eduTab) {
                statusEl.textContent = '✅ 已在国家智慧教育平台';
            } else {
                chrome.tabs.create({ url: 'https://basic.smartedu.cn/tchMaterial', active: false });
                statusEl.textContent = '📖 教材目录已在后台打开';
            }
        });
    }

    // ==================== 入口：按当前 tab 渲染 ====================

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tab = tabs && tabs[0];
        if (tab && tab.url && /contentId=/.test(tab.url)) {
            showDownloadView(tab);
        } else {
            showMenuView();
        }
    });
})();
