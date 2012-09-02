/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 美化滚动条，实现自定义滚动条背景
 */

FS.extend(FS, function () {
    /**
     * @description 美化滚动条，实现自定义滚动条背景
     * @param contentBox 内容容器的选择器
     * @param barClass 滚动条背景的class样式 （可选参数） 默认是'barClass'
     * @param barSpanClass 滚动条那个耙的class样式 （可选参数） 默认是'barSpanClass'
     * @param barHeight 滚动条的高度 （可选参数）默认是内容父节点的高度
     * @param allHeight 所有内容的总高度（可选参数）默认是内容本身的高度
     * @param {String} [barTopClass] 滚动条顶部的背景，可选参数
     * @param {String} [barBotClass] 滚动条底部的背景，可选参数
     */

    var styledScroll = function (options) {
        // contenterId 内容容器的ID
        // contentParent 存储内容容器的父容器
        var contenter = FS.query(options.contentBox),
            barClass = options.barClass || 'barClass',
            barSpanClass = options.barSpanClass || 'barSpanClass',

            contenterId = options.contentBox.slice(1),
            contentParent = contenter.parentNode,

            barHeight = options.barHeight || parseInt(FS.getStyle(contentParent, 'height')),
            allHeight = options.allHeight || parseInt(FS.getStyle(contenter, 'height')),

            barTopClass = options.barTopClass,
            barBotClass = options.barBotClass,

            // scaleY 所有内容总高度与可见高度的比例
            // barSpanHeight 滚动条那个把的高度
            // scrollHeight 滚动条可移动的距离
            scaleY = allHeight / barHeight,
            barSpanHeight = barHeight * (barHeight / allHeight),
            scrollHeight = barHeight - barSpanHeight;

        // nextValue 内容容器的top值,初始状态为0
        var nextValue = 0;

        // isClick 标记鼠标的mousedown状态，true为按下状态
        var isClick = false,
            disY;

        // 假如contentParent初始position不等于relative，则设置为relative
        if (FS.getStyle(contentParent, 'position') !== 'relative') {
            FS.setCss(contentParent, {
                //position: 'relative'
            });
        }
        // 假如contenter初始position不等于absolute，则设置为absolute
        if (FS.getStyle(contenter, 'position') !== 'absolute') {
            FS.setCss(contenter, {
                position: 'absolute'
            });
        }

        // 创建滚动条背景div
        var barBgNode = FS.query('#barBg' + contenterId);
        if(barBgNode == null){
            var barBgNode = document.createElement('div');
            barBgNode.id = 'barBg' + contenterId;
            contentParent.appendChild(barBgNode);
        }
        FS.setCss(barBgNode, {
            position: 'absolute',
            height: barHeight + 'px',
            top: '0px'
        });
        FS.addClass(barBgNode, barClass);

        // 创建滚动条
        var barBgSpan = FS.query('#div' + contenterId);
        if(barBgSpan == null){
            var barBgSpan = document.createElement('div');
            barBgSpan.id = 'div' + contenterId;
            barBgNode.appendChild(barBgSpan);
        }
        FS.setCss(barBgSpan, {
            position: 'absolute',
            height: barSpanHeight + 'px',
            top: '0px',
            cursor: 'pointer'
        });
        FS.addClass(barBgSpan, barSpanClass);  

        // 如果设置了滚动条顶部的class样式
        if(barTopClass != null){
            var barTopNode = document.createElement('div');
            barTopNode.id = 'barTop' + contenterId;
            barBgSpan.appendChild(barTopNode);
            FS.addClass(barTopNode, barTopClass);
        }

        // 如果设置了滚动条底部的class样式
        if(barBotClass != null){
            var barBotNode = document.createElement('div');
            barBotNode.id = 'barBot' + contenterId;
            barBgSpan.appendChild(barBotNode);
            FS.addClass(barBotNode, barBotClass);
        }

        // 鼠标移动，滚动条和内容滚动。
        FS.addEvent(barBgSpan, 'mousedown', function (e) {
            // 标记鼠标已按下
            isClick = true;
            disY = e.clientY - barBgSpan.offsetTop;

            FS.addEvent(document, 'mousemove', function (e) {
                dragFun(e);
                // 阻止事件的默认行为，防止鼠标离开滚动条就默认把文字给全选中了
                e.preventDefault();
            });
            FS.addEvent(document, 'mouseup', mouseup);
            // 阻止事件的默认行为，防止鼠标离开滚动条就默认把文字给全选中了
            e.preventDefault();
        });
        // 滚轮事件
        FS.addEvent(contenter, 'mousewheel', function (e) {
            // delta 取得滚动的值
            var delta = e.wheelDelta ? (e.wheelDelta / 120) : (-e.detail / 3);

            // 如果delta大于等于0，则鼠标是往上滚的，每次往上移动20px，否则每次往下移动20px
            // 并且nextValue在滚动范围内
            if (delta > 0 && nextValue < 0) {
                nextValue += 20;
            } else if (delta < 0 && nextValue >= -(allHeight - barHeight)) {
                nextValue -= 20;
            } else {
                return false;
            }

            // 设置内容的top
            FS.setCss(contenter, {
                top: nextValue + 'px'
            });

            // 根据nextValue跟总高度的比例，计算出滚动条距离滚动条顶部的距离，动态改变
            var barTop = -barHeight * (nextValue / allHeight);
            FS.setCss(barBgSpan, {
                top: barTop + 'px'
            });

            // 当滚动条超出边界时的处理方法
            outFun(barTop);
        });
        // 鼠标弹起时的处理方法
        function mouseup() {
            // 如果鼠标已弹起，则标记为false
            isClick = false;
            return false;
        }

        // 鼠标移动时的处理方法
        function dragFun(e) {
            // 判断鼠标还是按下状态
            if (isClick) {
                var barTop = e.clientY - disY;
                // 鼠标拖动改变nextValue，在这里设置nextValue变量，是为了让拖动事件和mousewheel这两个事件是连贯的
                nextValue = -scaleY * barTop;
                FS.setCss(barBgSpan, {
                    top: barTop + "px"
                });
                FS.setCss(contenter, {
                    top: nextValue + 'px'
                });

                // 当滚动条超出边界时的处理方法
                outFun(barTop);
            }
            return false;
        }

        // 滚动条超出边界的处理方法
        // barTop 滚动条barBgSpan的top
        function outFun(barTop) {
            // 如果滚动条已经超出了内容的上方，停止
            if (barTop < 0) {
                FS.setCss(barBgSpan, {
                    top: 0
                });
                FS.setCss(contenter, {
                    top: 0
                });
            }
            // 如果滚动条已经超出了内容的下方，停止
            if (barTop > scrollHeight) {
                FS.setCss(barBgSpan, {
                    top: scrollHeight + 'px'
                });
                FS.setCss(contenter, {
                    top: -scaleY * scrollHeight + 'px'
                });
            }
        }
    }

    return {
        styledScroll: styledScroll
    }
}());