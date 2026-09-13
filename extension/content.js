/*
 * SmartEduDownloader - Chrome/Edge 扩展内容脚本 v2.2
 * 对应 SmartEduDownloader.js v2.2 的逻辑，封装为浏览器插件。
 *
 * 功能：
 * - 教材页面右下角显示浮动下载按钮
 * - 未登录：高亮登录按钮 + 浮动提示
 * - 已登录：从 pdfPlayerFirefox iframe 提取 PDF 地址 + X-ND-AUTH 鉴权头，
 *   用 fetch 带认证下载（支持新版 -private CDN）
 * - 下载后显示面板，含"返回"链接（点击刷新当前页）
 */
(function () {
    'use strict';

    // ==================== 工具函数 ====================

    function showToast(msg, type) {
        var existing = document.getElementById('smartedu-toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.id = 'smartedu-toast';
        toast.style.cssText = 'position:fixed;top:20px;right:20px;padding:16px 24px;border-radius:8px;font-size:16px;font-weight:500;z-index:2147483647;box-shadow:0 4px 12px rgba(0,0,0,.15);max-width:400px;cursor:pointer;';

        var colors = {
            info: { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9', icon: 'ℹ️' },
            warning: { bg: '#fff3e0', color: '#e65100', border: '#ffcc80', icon: '⚠️' },
            error: { bg: '#ffebee', color: '#c62828', border: '#ef9a9a', icon: '❌' },
            success: { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7', icon: '✅' }
        };
        var c = colors[type] || colors.info;

        toast.style.backgroundColor = c.bg;
        toast.style.color = c.color;
        toast.style.border = '2px solid ' + c.border;
        toast.innerHTML = '<span style="font-size:20px;margin-right:8px">' + c.icon + '</span>' + msg;

        toast.onclick = function () { toast.remove(); };
        document.body.appendChild(toast);
        setTimeout(function () { if (toast.parentNode) toast.remove(); }, 5000);
    }

    // ==================== 登录检测 ====================

    function checkLogin() {
        var userEl = document.querySelector('.user-avatar, .user-name, .header-user, .avatar');
        var loginBtn = document.querySelector('.login-btn, .login-button, [data-action="login"]');
        var hasToken = localStorage.getItem('token') || localStorage.getItem('access_token');
        var hasCookie = document.cookie.includes('token') || document.cookie.includes('session');

        if (userEl || hasToken || hasCookie) return true;
        if (loginBtn) return false;
        return true;
    }

    function highlightLoginBtn() {
        var selectors = ['.login-btn', '.login-button', '[data-action="login"]', '.header-login', '.user-login'];
        var btn = null;

        for (var i = 0; i < selectors.length; i++) {
            try {
                btn = document.querySelector(selectors[i]);
                if (btn) break;
            } catch (e) {}
        }

        if (!btn) {
            var allEls = document.querySelectorAll('button, a, div[role="button"], span[role="button"]');
            for (var j = 0; j < allEls.length; j++) {
                var text = allEls[j].textContent.trim();
                if (text.includes('登录') || text.includes('Login')) {
                    btn = allEls[j];
                    break;
                }
            }
        }

        if (btn) {
            btn.style.cssText += ';border:3px solid #ff6b35 !important;animation:smartedu-pulse 1.5s ease-in-out infinite !important;position:relative';
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });

            if (!document.getElementById('smartedu-anim')) {
                var style = document.createElement('style');
                style.id = 'smartedu-anim';
                style.textContent = '@keyframes smartedu-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}';
                document.head.appendChild(style);
            }
            return true;
        }
        return false;
    }

    function handleNotLoggedIn() {
        showToast('请先登录后再下载教材（老版本教材无需登录）', 'warning');
        highlightLoginBtn();
    }

    // ==================== PDF 信息提取 ====================

    function getPdfInfo() {
        // 从 pdfPlayerFirefox iframe 的 src 中提取 file= 和 headers= 参数
        var pdfPlayer = document.getElementById('pdfPlayerFirefox');
        if (pdfPlayer && pdfPlayer.src) {
            var fileMatch = pdfPlayer.src.match(/file=([^&#]+)/);
            var headersMatch = pdfPlayer.src.match(/headers=([^&#]+)/);

            if (fileMatch) {
                var fileUrl = decodeURIComponent(fileMatch[1]);
                var headers = null;

                if (headersMatch) {
                    try {
                        headers = JSON.parse(decodeURIComponent(headersMatch[1]));
                    } catch (e) {
                        console.warn('解析 headers 失败:', e);
                    }
                }

                console.log('SmartEduDownloader: PDF URL:', fileUrl);
                console.log('SmartEduDownloader: Auth Headers:', headers);
                return { url: fileUrl, headers: headers };
            }
        }
        return null;
    }

    // ==================== 带认证下载 ====================

    async function downloadPdfWithAuth(pdfInfo, filename) {
        if (!pdfInfo || !pdfInfo.url) {
            showToast('无法获取 PDF 地址', 'error');
            return false;
        }

        showToast('正在下载...', 'info', 10000);

        try {
            // 🔑 关键：不能用 credentials:'include'！
            // 带凭证的 CORS 请求要求服务器返回 Access-Control-Allow-Credentials:true，
            // 而 CDN 只返回 Access-Control-Allow-Origin。
            // 因此必须用默认 credentials（same-origin），靠 X-ND-AUTH 头鉴权即可。
            // （content script 的跨域请求由扩展的 host_permissions 授权）
            var fetchOptions = { method: 'GET', cache: 'reload' };

            // 如果有认证头，添加到请求中
            if (pdfInfo.headers) {
                var h = Object.assign({}, pdfInfo.headers);
                delete h['range']; delete h['Range']; // 去掉 range 才能拿完整文件
                fetchOptions.headers = h;
            }

            var response = await fetch(pdfInfo.url, fetchOptions);

            if (!response.ok) {
                throw new Error('下载失败: ' + response.status);
            }

            var blob = await response.blob();
            if (blob.size < 100) {
                throw new Error('下载内容异常: ' + blob.size + ' B');
            }

            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename + '.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function () { URL.revokeObjectURL(url); }, 1000);

            showToast('下载完成', 'success');
            return true;
        } catch (e) {
            console.error('SmartEduDownloader 下载失败:', e);
            showToast('下载失败: ' + e.message, 'error');
            return false;
        }
    }

    // ==================== 结果面板（含"返回"刷新链接） ====================

    function showResultPanel(pdfInfo, name) {
        var panel = document.getElementById('smartedu-panel');
        if (panel) panel.remove();

        panel = document.createElement('div');
        panel.id = 'smartedu-panel';
        panel.style.cssText = 'position:fixed;right:20px;bottom:90px;width:340px;max-width:90vw;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.2);z-index:2147483646;padding:16px;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;';

        var bookname = '《' + name + '》';
        panel.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
            '<span style="font-size:15px;font-weight:bold;color:#333">中小学教材免费下载 v2.2</span>' +
            '<span id="smartedu-panel-close" style="cursor:pointer;color:#999;font-size:18px;line-height:1">✕</span>' +
            '</div>' +
            '<div style="font-size:14px;color:#555;margin-bottom:12px;word-break:break-all">' + bookname + '</div>' +
            '<div style="margin-bottom:10px">' +
            '<a id="smartedu-panel-dl" href="#" style="display:block;text-align:center;background:#1976d2;color:#fff;text-decoration:none;padding:10px 0;border-radius:6px;font-size:15px;font-weight:bold">⬇ 点击下载教材 PDF</a>' +
            '</div>' +
            '<div style="font-size:12px;color:#888;word-break:break-all;margin-bottom:10px;border-top:1px solid #eee;padding-top:8px">地址: ' + pdfInfo.url + '</div>' +
            '<div style="text-align:center;border-top:1px solid #eee;padding-top:8px">' +
            '<a id="smartedu-panel-back" href="#" style="color:#2e7d32;text-decoration:underline;font-size:14px;font-weight:bold">返回</a>' +
            '<span style="color:#999;font-size:12px;margin-left:4px">（点击刷新当前页）</span>' +
            '</div>';

        document.body.appendChild(panel);

        panel.querySelector('#smartedu-panel-close').onclick = function () { panel.remove(); };
        panel.querySelector('#smartedu-panel-dl').onclick = function (e) {
            e.preventDefault();
            downloadPdfWithAuth(pdfInfo, name);
            navigator.clipboard.writeText(bookname).then(function () {
                console.log('复制书名到剪切板成功');
            }).catch(function (err) {
                console.error('复制书名到剪切板失败:', err);
            });
        };
        panel.querySelector('#smartedu-panel-back').onclick = function (e) {
            e.preventDefault();
            location.reload();
        };
    }

    // ==================== 浮动下载按钮 ====================

    // 打开下载面板（浮动按钮与扩展图标点击共用）
    function openDownloadPanel() {
        var urlMatch = window.location.href.match(/contentId=([^&]+)/);
        if (!urlMatch) {
            showToast('无法获取教材 ID，请打开教材详情页', 'error');
            return;
        }
        if (!checkLogin()) {
            handleNotLoggedIn();
            return;
        }
        var pdfInfo = getPdfInfo();
        if (!pdfInfo) {
            showToast('未找到 PDF 预览，请先打开教材在线阅读', 'warning');
            return;
        }
        showResultPanel(pdfInfo, document.title);
    }

    function createFab() {
        var fab = document.getElementById('smartedu-fab');
        if (fab) return;

        fab = document.createElement('div');
        fab.id = 'smartedu-fab';
        fab.style.cssText = 'position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:50%;background:#1976d2;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;z-index:2147483647;box-shadow:0 4px 16px rgba(25,118,210,.4);font-family:system-ui,sans-serif;user-select:none;transition:transform .15s ease;';
        fab.title = '下载教材';
        fab.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span style="font-size:10px;margin-top:2px">教材</span>';

        fab.onmouseenter = function () { fab.style.transform = 'scale(1.08)'; };
        fab.onmouseleave = function () { fab.style.transform = 'scale(1)'; };
        fab.onclick = function () {
            openDownloadPanel();
        };

        document.body.appendChild(fab);
    }

    // ==================== 初始化 ====================

    // 教材详情页才注入按钮
    var isTextbookPage = /contentId=/.test(window.location.href);
    if (isTextbookPage) {
        createFab();
        console.log('SmartEduDownloader: 插件已就绪，点击右下角按钮下载教材');
    }

    // 扩展图标点击（详情页）→ 打开下载面板
    chrome.runtime.onMessage.addListener(function (message) {
        if (message && message.type === 'smartedu-download') {
            openDownloadPanel();
        }
    });
})();
