/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description IE6下给节点数组或元素集合添加hover状态下的class样式
 */

FS.extend(FS, function () {
    /**
     * @description IE6下给节点数组或元素集合添加hover状态下的class样式
     * @param allElements 所有需要处理的节点
     * @param hoverClass hover状态下的class样式
     * @example
     * FS.ie6Hover({
            allElements : FS.getChildNodes(FS.query("#allbrand")),
            hoverClass : 'mouseon'
        })
     */

    var ie6Hover = function (options) {
        if (FS.isIE6()) {
            var allElements = options.allElements,
                hoverClass = options.hoverClass;

            // 加入allElements是一个数组或一个元素集合
            if (FS.isArray(allElements) || allElements.item) {
                // 如果是一个元素集合，则将元素集合转化为数组，以为元素集合不是Array类型，没有each方法
                if (allElements.item) {
                    allElements = FS.makeArray(allElements);
                }
                allElements.each(function (i) {
                    FS.hover(i, function () {
                        FS.addClass(i, hoverClass);
                    }, function () {
                        FS.removeClass(i, hoverClass);
                    });
                });
            }
        }
    };

    return {
        ie6Hover: ie6Hover
    }
}());