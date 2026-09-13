/*
 * SmartEduDownloader v2.2
 * 基于原版改进，增加登录状态检测 + 修复新版下载地址
 * 
 * 功能：
 * - 未登录：突出显示登录按钮 + 浮动提示
 * - 已登录：正常生成下载链接
 * - 支持新版 PDF 路径（assets/uuid.pkg/书名.pdf）
 * 
 * v2.2 修复：
 * - 去掉 credentials:'include'（CDN 不返回 Allow-Credentials 头导致 ERR_FAILED）
 * - 删除 range 头，获取完整文件
 * - 增加缓存重载（cache:'reload'）与内容大小校验
 */

// ========== 登录检测 + UI 提示 ==========

function checkLogin() {
    var userEl = document.querySelector('.user-avatar, .user-name, .header-user, .avatar');
    var loginBtn = document.querySelector('.login-btn, .login-button, [data-action="login"]');
    var hasToken = localStorage.getItem('token') || localStorage.getItem('access_token');
    var hasCookie = document.cookie.includes('token') || document.cookie.includes('session');

    if (userEl || hasToken || hasCookie) return true;
    if (loginBtn) return false;
    return true;
}

function showToast(msg, type) {
    var existing = document.getElementById('smartedu-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'smartedu-toast';
    toast.style.cssText = 'position:fixed;top:20px;right:20px;padding:16px 24px;border-radius:8px;font-size:16px;font-weight:500;z-index:99999;box-shadow:0 4px 12px rgba(0,0,0,.15);max-width:400px;cursor:pointer;';

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

    toast.onclick = function() { toast.remove(); };
    document.body.appendChild(toast);
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 5000);
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
    showToast('请先登录后再下载教材', 'warning');
    var highlighted = highlightLoginBtn();
    if (!highlighted) {
        var panel = document.createElement('div');
        panel.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:32px;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.2);z-index:99998;text-align:center;max-width:400px';
        panel.innerHTML = '<div style="font-size:48px;margin-bottom:16px">🔐</div><h3 style="margin:0 0 12px;color:#333">需要先登录</h3><p style="margin:0 0 20px;color:#666;font-size:14px">下载电子教材需要登录国家智慧教育平台账号。</p><button onclick="this.parentElement.remove()" style="background:#1976d2;color:white;border:none;padding:10px 24px;border-radius:6px;cursor:pointer">我知道了</button>';
        document.body.appendChild(panel);
    }
}

// ========== 核心：PDF 路径获取 + 下载链接生成 ==========

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
            
            console.log('PDF URL:', fileUrl);
            console.log('Auth Headers:', headers);
            return { url: fileUrl, headers: headers };
        }
    }
    return null;
}

async function downloadPdfWithAuth(pdfInfo, filename) {
    if (!pdfInfo || !pdfInfo.url) {
        showToast('无法获取 PDF 地址', 'error');
        return false;
    }

    showToast('正在下载...', 'info', 10000);

    try {
        // 🔑 关键：不能用 credentials:'include'！
        // 带凭证的 CORS 请求要求服务器返回 Access-Control-Allow-Credentials:true，
        // 而 CDN 只返回 Access-Control-Allow-Origin（见 curl 测试）。
        // 因此必须用默认 credentials（same-origin），靠 X-ND-AUTH 头鉴权即可。
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
        URL.revokeObjectURL(url);

        showToast('下载完成', 'success');
        return true;
    } catch (e) {
        console.error('下载失败:', e);
        showToast('下载失败: ' + e.message, 'error');
        return false;
    }
}

function downloadPDF(name, id) {
    var bookname = "《" + name + "》";
    var pdfInfo = getPdfInfo();

    if (!pdfInfo) {
        showToast('无法获取 PDF 下载地址', 'error');
        return null;
    }

    // 隐藏弹窗
    ['fish-modal-content', 'fish-modal-mask', 'fish-modal-wrap'].forEach(function(c) {
        var e = document.getElementsByClassName(c);
        if (e && e.length > 0 && e[0]) e[0].style.display = "none";
    });

    var bread = document.getElementsByClassName("web-breadcrumb")[0];
    if (!bread) {
        showToast('页面结构异常', 'error');
        return null;
    }

    bread.style.fontSize = '30px';
    bread.innerHTML = "中小学教材免费下载 v2.2<br><a href='https://github.com/LoongBa/SmartEduDownloaderJS' target='_blank'>Github</a> | <a href='https://gitee.com/LoongBa/SmartEduDownloaderJS' target='_blank'>Gitee</a><br><span style='color:red'>点击链接下载教材 PDF：</span><br>";

    var next = bread.nextElementSibling;
    if (next) next.style.display = 'none';

    // 生成下载按钮（使用 fetch + 认证头下载）
    var link = document.createElement('a');
    link.href = '#';
    link.textContent = bookname + ' 点击下载 ';
    link.style = "color:blue;text-decoration:underline;cursor:pointer;font-size:18px;font-weight:bold";
    link.onclick = function(e) {
        e.preventDefault();
        downloadPdfWithAuth(pdfInfo, name);
        navigator.clipboard.writeText(bookname).then(function() {
            console.log('复制书名到剪切板成功');
        }).catch(function(err) {
            console.error('复制书名到剪切板失败:', err);
        });
    };

    bread.appendChild(link);
    bread.appendChild(document.createElement('br'));

    // 显示 PDF 地址（调试用）
    var debugInfo = document.createElement('span');
    debugInfo.style.cssText = 'color:#666;font-size:12px;word-break:break-all';
    debugInfo.textContent = '地址: ' + pdfInfo.url;
    bread.appendChild(debugInfo);

    // 返回链接（点击刷新当前页，恢复正常浏览）
    bread.appendChild(document.createElement('br'));
    var backLink = document.createElement('a');
    backLink.href = '#';
    backLink.textContent = '返回 ';
    backLink.style = 'color:green;text-decoration:underline;cursor:pointer;font-size:16px;font-weight:bold';
    backLink.onclick = function(e) {
        e.preventDefault();
        location.reload();
    };
    bread.appendChild(backLink);
    var backHint = document.createElement('span');
    backHint.style.cssText = 'color:#888;font-size:12px;';
    backHint.textContent = '（点击刷新当前页）';
    bread.appendChild(backHint);

    console.log("SmartEduDownloader: 下载链接就绪");
    return link;
}

// ========== 主流程 ==========

var url = window.location.href.match(/contentId=([^&]+)/);
if (!url) {
    showToast('无法获取教材 ID', 'error');
} else if (!checkLogin()) {
    handleNotLoggedIn();
} else {
    var link = downloadPDF(document.title, url[1]);
    if (link) {
        showToast('下载链接已就绪，点击即可下载', 'success');
    }
}
