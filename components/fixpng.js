/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 透明png的img在ie6下透明
 */

FS.extend(FS, function () {
    /**
     * @extends fixPng(selectors) 透明png的img在ie6下透明
     * @description 透明png的img在ie6下透明
     * @param selectors 用到透明图片的元素的selector（class或id、TagName等）
     * @example
     * FS.ready( function() {
         FS.fixPng('#img1, #img2');
         });
     */
    var fixPng = function (selectors) {
        // IE6中执行,判断IE6
        if (FS.isIE6()) {
            // 将选择器数组去除空格
            var selectors = selectors.trim().split(','),
                length = selectors.length - 1,
                elements = [];
            for (; length >= 0; length--) {
                // 根据各个选择器选择出来的元素数组
                var selectorsElements = FS(selectors[length]);
                var leng = selectorsElements.length - 1;
                for (; leng >= 0; leng--) {
                    // 根据各个选择器选择出来的元素数组中的各个元素插入elements数组中,下面就只操作elements数组
                    elements.push(selectorsElements[leng]);
                }
            }

            // 计算透明png的img的个数，并循环做处理
            var eleLength = elements.length;
            for (var j = 0; j < eleLength; j++) {
                var img = elements[j];
                // 将图片路径全转换成大写，方便后面的判断
                var imgName = img.src.toUpperCase();
                // 判断如果是png图片
                if (imgName.substring(imgName.length - 3, imgName.length) == "PNG") {
                    // 拼id、class、title、style等，为最后定义img外层的span做准备
                    var imgID = (img.id) ? "id='" + img.id + "' " : "";
                    var imgClass = (img.className) ? "class='" + img.className + "' " : "";
                    var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
                    var imgStyle = "display:inline-block;" + img.style.cssText;
                    if (img.align == "left") imgStyle = "float:left;" + imgStyle
                    if (img.align == "right") imgStyle = "float:right;" + imgStyle
                    if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle
                    var strNewHTML = "<span " + imgID + imgClass + imgTitle + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";" + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>";
                    img.outerHTML = strNewHTML;
                }
            }
        }
    };

    return {
        fixPng: fixPng
    }
}());