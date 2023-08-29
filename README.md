# SmartEduDownloaderJS 极简一步下载电子教材

极简一步下载【国家智慧教育平台电子教材】，无需注册、登录，无需下载安装软件和环境，粘贴一行 Javascript 即可。

# 一、使用说明：额外操作只有一步

## 1. 一步下载

- 在浏览器中访问国家智慧教育平台，
- 找到你感兴趣的电子教材（复制教材名称），
- ——极简：**在浏览器地址栏粘贴以下代码，按回车**，
- 点击下载：选个保存路径、取个名字（粘贴教材名称），完事。

```javascript
javascript: function downloadPDF(name, id) {    const hide = (c) => {        const e = document.getElementsByClassName(c);        if (e.length > 0 && e[0]) e[0].style.display = "none";    };    hide("fish-modal-content");    hide("fish-modal-mask");    hide("fish-modal-wrap");    const bread = document.getElementsByClassName("web-breadcrumb")[0];    bread.innerHTML = "<span style='color:red'>下载 《" + name + "》PDF 文件：</span>";    var next = bread.nextElementSibling;    if (next) next.style.display = 'none';     for (let i = 1; i <= 3; i++) {        var link = document.createElement('a');        link.href = `https://r${i}-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/${id}.pkg/pdf.pdf`;        link.download = name + '.pdf';      /*保存文件时，文件名自动按照教材名字取名，但因为浏览器限制（跨域）可能无效*/        link.target = '_blank';             /*上一句无效时，新窗口打开*/        link.textContent = ` 链接${i} `;        link.style = "color:blue";        link.style.textDecoration = 'underline';        link.style.cursor = 'pointer';        bread.appendChild(link);        if (i == 3) return link;    }}downloadPDF(document.title, window.location.href.match(/contentId=([^&]+)/)[1]);console.log("⨳⨳⨳ 请点击链接下载教材 PDF 文件，正常情况三个链接均有效。⨳⨳⨳");
```

注：鼠标移动到上面代码框，点击代码狂右上角之图标，即可复制全部代码。

## 2. 添加到收藏夹，不必每次粘贴

1. 添加新收藏，取名字如“下载电子教材”

2. 粘贴代码，保存

3. 在要下载教材的页面，打开收藏夹点击“下载电子教材”（刚才取的名字），完事

# 二、原理说明

## 1. 背景介绍

注：国家智慧教育平台 全称：【国家智慧教育公共服务平台】，其中中小学内容部分又叫做【国家中小学智慧教育平台】，因为涉及九年制义务教育的教材，按照国家《中华人民共和国义务教育法》之规定，以及教育部《关于发布中小学国家课程教材电子版链接的通告》将各中小学教材编写出版单位提供的免费电子版教材链接统一予以公布，才有了下载电子版教材之说。

## 2. 技术原理

原理很简单，用 javascript 获取电子教材 PDF 文件地址，去掉地址中错误的部分，显示为链接。

## 3. 自动下载

可以不用“点击”就可以自动下载，最后一行代码末尾去掉 .click() 的注释即可：

```javascript
downloadPDF(document.title, url);/*.click();*/
downloadPDF(document.title, url).click();
```

# 三、特别声明

本项目代码出于学习的目的，对相关网站主体的权利、电子书籍的版权等等不构成任何威胁和侵权行为，切勿用于其它用途，更不能用于牟利。

虽然代码很简单，功能也没什么大不了，但应该注意的还是要注意。