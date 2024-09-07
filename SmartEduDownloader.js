/*

 */

function Anime(e) {
    /* 调用第三方库实现动态效果吸引注意 */
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.onload = function () {
        anime({
            targets: e,
            opacity: [0.2, 1],
            duration: 2000,
            loop: true,
            easing: 'easeInOutQuad'
        });
    };
    document.head.appendChild(script);
}

//One line:
//javascript: function downloadPDF(name, id) { var bookname = "《" + name + "》"; var pdfPlayer = document.getElementById("pdfPlayerFirefox"); var pdfPath = null; if (pdfPlayer) { var pdfUrl = pdfPlayer.src.match(/file=([^&]+)/)[1]; pdfPath = new URL(pdfUrl).pathname; console.log(pdfPath); } if (!pdfPath) pdfPath = `/edu_product/esp/assets_document/${id}.pkg/pdf.pdf`; const hide = (c) => { const e = document.getElementsByClassName(c); if (e && e.length > 0 && e[0]) e[0].style.display = "none"; }; hide("fish-modal-content"); hide("fish-modal-mask"); hide("fish-modal-wrap"); const bread = document.getElementsByClassName("web-breadcrumb")[0]; bread.style.fontSize = '30px'; bread.innerHTML = "SmartEduDownloaderJS v1.2 源码更新地址：<br /><a href='http://github.com/LoongBa/SmartEduDownloaderJS' target='_blank'>爱学习的龙爸 Gitee</a> | <a href='http://gitee.com/LoongBa/SmartEduDownloaderJS' target='_blank'>Github</a><br /> <span style='color:red'>请点击链接下载教材 PDF 文件，<br />正常情况三个链接均有效：</span><br /> "; var next = bread.nextElementSibling; if (next) next.style.display = 'none'; for (let i = 1; i <= 3; i++) { var base = `https://r${i}-ndr.ykt.cbern.com.cn`; var link = document.createElement('a'); link.href = `${base}${pdfPath}`; link.download = name + '.pdf';      /*保存文件时，文件名自动按照教材名字取名，但因为浏览器限制（跨域）可能无效*/ link.target = '_blank';             /*上一句无效时，新窗口打开*/ link.textContent = bookname + ` 链接${i} `; link.style = "color:blue"; link.style.textDecoration = 'underline'; link.style.cursor = 'pointer'; link.onclick = () => navigator.clipboard.writeText(bookname).then(() => { console.log('复制书名到剪切板成功。'); }).catch(err => { console.error('复制书名到剪切板失败:', err); }); bread.appendChild(link); bread.appendChild(document.createElement('br')); if (i == 3) return link; /* 默认返回第三个连接，用于后续自动下载等 */ } console.log("⨳⨳⨳ 请点击链接下载教材 PDF 文件，正常情况三个链接均有效。⨳⨳⨳"); } var url = window.location.href.match(/contentId=([^&]+)/)[1]; downloadPDF(document.title, url);/*.click();*/
function downloadPDF(name, id) {
    var bookname = "《" + name + "》";
    var pdfPlayer = document.getElementById("pdfPlayerFirefox");
    var pdfPath = null;
    if (pdfPlayer) {
        var pdfUrl = pdfPlayer.src.match(/file=([^&]+)/)[1];
        pdfPath = new URL(pdfUrl).pathname;
        console.log(pdfPath);
    }
    if (!pdfPath)
        pdfPath = `/edu_product/esp/assets_document/${id}.pkg/pdf.pdf`;
    const hide = (c) => {
        const e = document.getElementsByClassName(c);
        if (e && e.length > 0 && e[0]) e[0].style.display = "none";
    };
    hide("fish-modal-content");
    hide("fish-modal-mask");
    hide("fish-modal-wrap");

    const bread = document.getElementsByClassName("web-breadcrumb")[0];
    bread.style.fontSize = '30px';
    bread.innerHTML = "SmartEduDownloaderJS v1.2 源码更新地址：<br /><a href='http://github.com/LoongBa/SmartEduDownloaderJS' target='_blank'>爱学习的龙爸 Github</a> | <a href='http://gitee.com/LoongBa/SmartEduDownloaderJS' target='_blank'>Gitee</a><br /> <span style='color:red'>请点击链接下载教材 PDF 文件，<br />正常情况三个链接均有效：</span><br /> ";
    var next = bread.nextElementSibling;
    if (next) next.style.display = 'none'; 
    for (let i = 1; i <= 3; i++) {
        var base = `https://r${i}-ndr.ykt.cbern.com.cn`;
        var link = document.createElement('a');
        link.href = `${base}${pdfPath}`;
        link.download = name + '.pdf';      /*保存文件时，文件名自动按照教材名字取名，但因为浏览器限制（跨域）可能无效*/
        link.target = '_blank';             /*上一句无效时，新窗口打开*/
        link.textContent = bookname + ` 链接${i} `;
        link.style = "color:blue";
        link.style.textDecoration = 'underline';
        link.style.cursor = 'pointer';
        link.onclick = () => navigator.clipboard.writeText(bookname).then(() => {
            console.log('复制书名到剪切板成功。');
        }).catch(err => {
            console.error('复制书名到剪切板失败:', err);
        });
        bread.appendChild(link);
        bread.appendChild(document.createElement('br'));
        if (i == 3) return link; /* 默认返回第三个连接，用于后续自动下载等 */
    }
    console.log("⨳⨳⨳ 请点击链接下载教材 PDF 文件，正常情况三个链接均有效。⨳⨳⨳");
}
var url = window.location.href.match(/contentId=([^&]+)/)[1];
downloadPDF(document.title, url);/*.click();*/
//const link = downloadPDF(document.title, window.location.href.match(/contentId=([^&]+)/)[1]);
//Anime(link.parentElement);