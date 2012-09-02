/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 商品限抢热区 toggleDisplay/渐现渐隐/上升下拉
 */

FS.extend(FS, function () {
    /**
     * @description 商品限抢热区 toggleDisplay/渐现渐隐/上升下拉
     * @param eventTarget 需添加处理事件的元素
     * @param method 热区展现的方式 默认为'show'，即直接显示或隐藏，还可以为'fade'（淡入淡出），还可以是'slide'（上升下拉的方式） 默认是'show'
     * @param minHeight 当method为'slide'时，缓出后的最低高度 。默认是0
     * @param maxHeight 当method为'slide'时，缓入后的最大高度。默认是36
     * @param speed 当method为'fade'或'slide'时，动画完成的时间。 默认是200
     * @example
     * FS.hotFade({
         eventTarget : '.hot_area'
         });
     */
    var hotFade = function (options) {
        // 取得需添加处理事件的元素
        var eventTarget = FS(options.eventTarget),
            minHeight = options.minHeight || 0,
            maxHeight = options.maxHeight || 36,
            speed = options.speed || 300,
            method = options.method || 'show',
            length = eventTarget.length - 1;

        // 遍历各个元素，为元素添加处理事件
        for (; length >= 0; length--) {
            FS.hover(eventTarget[length], function () {
                var inArea = FS.getChildNodes(this)[1];
                if (inArea !== undefined) {
                    // 直接显示
                    if (method === 'show') {
                        FS.show(inArea);
                    }
                    // 通过透明度变化，淡入
                    if (method === 'fade') {
                        FS.fadeIn(inArea);
                    }
                    // 通过高度变化，实现上升
                    if (method === 'slide') {
                        FS.slide(inArea, 'height', minHeight, maxHeight, 300);
                    }
                }
            }, function () {
                var outArea = FS.getChildNodes(this)[1];
                if (outArea !== undefined) {
                    // 直接隐藏
                    if (method === 'show') {
                        FS.hide(outArea);
                    }
                    // 通过透明度变化，淡出
                    if (method === 'fade') {
                        FS.fadeOut(outArea);
                    }
                    // 通过高度变化，实现下落
                    if (method === 'slide') {
                        FS.slide(outArea, 'height', maxHeight, minHeight, 350);
                    }
                }
            })
        }
    };

    return {
        hotFade: hotFade
    }
}());