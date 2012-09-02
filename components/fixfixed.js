/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 修正IE6下position为fixed时的bug
 */

FS.extend(FS, function () {
    /**
     * @description 修正IE6下position为fixed时的bug
     * @param node 需要fix的node节点
     */
    var fixFixed = function (node) {
        if (FS.isIE6()) {
            // 计算出该节点的left和top的值
            var oldLeft = parseInt(FS.getStyle(node, 'left')),
                oldTop = parseInt(FS.getStyle(node, 'top'));
            FS.addEvent(window, 'scroll', function () {
                var nodeLeft = oldLeft + FS.getScrollLeft() + 'px',
                    nodeTop = oldTop + FS.getScrollTop() + 'px';
                FS.setCss(node, {
                    position: 'absolute',
                    top: nodeTop,
                    left: nodeLeft
                });
            });
            var nodeLeft = oldLeft + FS.getScrollLeft() + 'px',
                nodeTop = oldTop + FS.getScrollTop() + 'px';

            FS.setCss(node, {
                position: 'absolute',
                top: nodeTop,
                left: nodeLeft
            });
        }
    };

    return {
        fixFixed: fixFixed
    }
}());