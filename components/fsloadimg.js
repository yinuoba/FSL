/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 图片延时加载
 */

FS.extend(FS, function () {
    /**
     * @description 图片延时加载
     * @param attr 需要延时加载的图片的自定义属性，默认为'fslazy'
     * @param height 不可见但需预先加载的高度，默认为200
     * @example 
     * FS.fsLoadImg({
         attr : 'fslazy',
         height : 200
         });
     */
    var fsLoadImg = function (options) {
        // 先找出页面中所有的图片，并定义一些局部变量
        var imgs = document.images,
            leng = imgs.length - 1,
            options = options || {},
            attr = options.attr,
            height = options.height,
            fsWindow = window,
            elements = [];

        // 筛选出具备自定义属性，需延时加载的图片，并将其放入elements数组中
        for (; leng >= 0; leng--) {
            if (imgs[leng].getAttribute(attr)) {
                elements.push(imgs[leng]);
            }
        }

        // 判断图片位置，如果在加载区域，则替换attr值为src的值
        function showImg(elements, options) {
            var length = elements.length - 1;
            // 遍历所有尚未加载的img，如果在加载区域，则加载。（两次倒序，相当于顺序了）
            for (; length >= 0; length--) {
                var element = elements[length];
                // 如果元素在可视区域的上方，则直接循环下一个元素，不用同时执行belowTheFold和aboveTheTop方法
                if (aboveTheTop(element, options)) {
                    continue;
                }
                // 如果元素不在加载区域的下方。因为上面已经判断了aboveTheTop，因此，如果不在元素的下方，就在就在可视区域
                if (!belowTheFold(element, options)) {
                    // 获取图片地址
                    var imgSrc = element.getAttribute(attr);
                    // 将获取到的图片地址赋给src属性,并移除自定义属性，防止onscroll和onresize时再次把它认为是未加载图片
                    if (imgSrc !== null && imgSrc !== undefined) {
                        element.setAttribute('src', imgSrc);
                        element.removeAttribute(attr);
                        // 将已加载的元素从elements数组中移除，防止再次执行这个元素
                        elements.splice(length, 1);
                    }
                    // 返回继续循环下一个元素
                    continue;
                }
                // 元素在可视区域的下方了，则退出循环，不再继续循环后面的元素
                break;
            }
        }

        var showimg = new showImg(elements, options);

        // 移动滚动条，触发事件。不断遍历各个带attr属性的元素，判断未加载元素数量是否大于0，如果大于0，则不在执行showImg方法
        FS.addEvent(fsWindow, 'scroll', function () {
            var unLoadLength = elements.length;
            // 如有未加载项，则执行showImg
            if (unLoadLength > 0) {
                showImg(elements, options);
            }
        })

        // resize窗口，触发事件。不断遍历各个带attr属性的元素，判断未加载元素数量是否大于0，如果大于0，则不在执行showImg方法
        FS.addEvent(fsWindow, 'resize', function () {
            var unLoadLength = elements.length;
            // 如有未加载项，则执行showImg
            if (unLoadLength > 0) {
                showImg(elements, options)
            }
        })

        // 判断某一元素在加载区域的底部
        function belowTheFold(node, options) {
            // 计算窗口高度与已滚动的高度之和
            var fold = FS.getWindowHeight() + FS.getScrollTop();
            // 判断元素在加载区域底部
            return fold <= FS.getOffset(node) - options.height;
        }

        // 判断某一元素在加载区域的顶部
        function aboveTheTop(node, options) {
            // 计算窗口顶部到页面顶部之间的高度
            var fold = FS.getScrollTop();

            // 判断元素在加载区域顶部
            return fold >= FS.getOffset(node) + options.height + node.offsetHeight;
        }
    };

    return {
        fsLoadImg: fsLoadImg
    }
}());