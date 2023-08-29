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
//javascript: function downloadPDF(name, id) {    const hide = (c) => {        const e = document.getElementsByClassName(c);        if (e.length > 0 && e[0]) e[0].style.display = "none";    };    hide("fish-modal-content");    hide("fish-modal-mask");    hide("fish-modal-wrap");    const bread = document.getElementsByClassName("web-breadcrumb")[0];    bread.innerHTML = "<span style='color:red'>下载 《" + name + "》PDF 文件：</span>";    var next = bread.nextElementSibling;    if (next) next.style.display = 'none';     for (let i = 1; i <= 3; i++) {        var link = document.createElement('a');        link.href = `https://r${i}-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/${id}.pkg/pdf.pdf`;        link.download = name + '.pdf';      /*保存文件时，文件名自动按照教材名字取名，但因为浏览器限制（跨域）可能无效*/        link.target = '_blank';             /*上一句无效时，新窗口打开*/        link.textContent = ` 链接${i} `;        link.style = "color:blue";        link.style.textDecoration = 'underline';        link.style.cursor = 'pointer';        bread.appendChild(link);        if (i == 3) return link;    }}downloadPDF(document.title, window.location.href.match(/contentId=([^&]+)/)[1]);console.log("⨳⨳⨳ 请点击链接下载教材 PDF 文件，正常情况三个链接均有效。⨳⨳⨳");
function downloadPDF(name, id) {
    const hide = (c) => {
        const e = document.getElementsByClassName(c);
        if (e.length > 0 && e[0]) e[0].style.display = "none";
    };
    hide("fish-modal-content");
    hide("fish-modal-mask");
    hide("fish-modal-wrap");

    const bread = document.getElementsByClassName("web-breadcrumb")[0];
    bread.innerHTML = "SmartEduDownloaderJS v1.0 源码更新地址：<a href='http://github.com/CoffeeScholar/SmartEduDownloaderJS' target='_blank'>爱学爸的 Github</a> <span style='color:red'>请点击链接下载教材《" + name + "》PDF 文件，正常情况三个链接均有效：</span>";
    var next = bread.nextElementSibling;
    if (next) next.style.display = 'none'; 
    for (let i = 1; i <= 3; i++) {
        var link = document.createElement('a');
        link.href = `https://r${i}-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/${id}.pkg/pdf.pdf`;
        link.download = name + '.pdf';      /*保存文件时，文件名自动按照教材名字取名，但因为浏览器限制（跨域）可能无效*/
        link.target = '_blank';             /*上一句无效时，新窗口打开*/
        link.textContent = ` 链接${i} `;
        link.style = "color:blue";
        link.style.textDecoration = 'underline';
        link.style.cursor = 'pointer';
        bread.appendChild(link);
        if (i == 3) return link;
    }    
    console.log("⨳⨳⨳ 请点击链接下载教材 PDF 文件，正常情况三个链接均有效。⨳⨳⨳");
}
const url = window.location.href.match(/contentId=([^&]+)/)[1];
downloadPDF(document.title, url);/*.click();*/
//const link = downloadPDF(document.title, window.location.href.match(/contentId=([^&]+)/)[1]);
//Anime(link.parentElement);