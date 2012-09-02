/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 返回顶部
 */

FS.extend(FS, function () {
    /**
     * @description 返回顶部
     * @param node  回顶部父层节点
     * @param toTop 回顶部节点
     * @param nodeHeight 回顶部父层节点的高度
     * @param {Number} [options.pageWidth] 页面的宽度，默认为1000
     * @param {Number} [options.toLeft] 返回顶部相对页面的距离，默认为30
     */

    var goTop = function (options) {
        var fsWindow = window,
            node = options.node,
            toTop = options.toTop,
            nodeHeight = options.nodeHeight,
            pageWidth = options.pageWidth || 1000,
            toLeft = options.toLeft || 30;
        
        // 获取document的宽度
        var bodyWidth = FS.getPageWidth(),
            halfWidth = (bodyWidth - pageWidth)/2;
            // 为计算node的宽度，先将其display设为block
            FS.show(node);
        var nodeWidth = node.offsetWidth || 52;
            FS.hide(node);

        if(nodeWidth + toLeft > halfWidth){
            FS.hide(node);
            return false;
        }

        // 设置返回顶部块的left
        FS.setCss(node, {left: halfWidth + pageWidth + toLeft + 'px'});

        // 如果滚动调滚动了，显示返回顶部块
        if (FS.getScrollTop() > 0) {
            FS.show(node)
        }

        // 初始化页面时设置返回顶部的位置
        FS.ready(function(){
            FS.fixScrollTop(node, nodeHeight);
        });

        // 当鼠标滚动，页面下拉后，返回顶部出现
        FS.addEvent(fsWindow, 'scroll', function () {
            FS.fixScrollTop(node, nodeHeight);
        });
        FS.addEvent(fsWindow, 'resize', function () {
            FS.fixScrollTop(node, nodeHeight);

            // 获取document的宽度
            var dBodyWidth = FS.getPageWidth(),
                dHalfWidth = (dBodyWidth - pageWidth)/2;
                nodeWidth = node.offsetWidth || 52;

            if(nodeWidth + toLeft > halfWidth){
                FS.hide(node);
                return false;
            }

            // 设置返回顶部块的left
            FS.setCss(node, {left: dHalfWidth + pageWidth + toLeft + 'px'});
        });
        // 点击返回顶部按钮，缓冲到顶部
        FS.addEvent(toTop, 'click', function (event) {
            //alert(FS.getScrollTop());
            FS.slide(window, 'scrollTop', FS.getScrollTop(), 0, 200);
            // 阻止事件的默认行为
            event.preventDefault();
            // 阻止冒泡流继续冒泡
            event.stopPropagation();
        });
    };

    /**
     * @description 让返回顶部那一块不进入黑色区域
     * @description 把这个方法单独写出来，赋给FS对象，方便页面由Tab或其他原因导致页面高度变化但未触发onscroll事件时调用
     * @param node 快速通道那一块节点
     */
    var fixScrollTop = function (node, nodeHeight) {
        // h必须在fixScroll内部定义，否则resize将无效
        // totopHeight参数必须放在函数内部，以便page的高度发生变化时动态获取。
        var h = FS.getWindowHeight(),
            footer_top = FS.getOffset(FS.query(".mainBottomBox")),
            totopHeight = nodeHeight;

        // scrollTop 滚动条距离顶部的距离
        var scrollTop = FS.getScrollTop();
        if (scrollTop > 0) {			
            // 当返回顶部到了底部上方的时候，不再滑倒底部            
            if (footer_top <= scrollTop + h) {
                var topY = footer_top - scrollTop - totopHeight;
                FS.setCss(node, {
                    top: topY + 'px'
                });
                // IE6浏览器，特殊处理
                if (FS.isIE6()) {
                    FS.setCss(node, {
                        position: 'absolute',
                        top: footer_top - nodeHeight -5 + 'px'
                    });
                }

            } else {
				
                FS.setCss(node, {
                    top: h - totopHeight + 'px'
                });
                // IE6浏览器，特殊处理
                if (FS.isIE6()) {
                    var oldTop = FS.getWindowHeight() - nodeHeight -5,
                        nodeTop = oldTop + FS.getScrollTop() + 'px';
                    FS.setCss(node, {
                        position: 'absolute',
                        top: nodeTop
                    });
                }
            }
            FS.show(node);
        } else {
            FS.hide(node);
        }
    };

    return {
        goTop: goTop,
        fixScrollTop: fixScrollTop
    }
}());