/** 
 * FSL (Feishang Javascript Library)
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 *
 * @description 点击显示更多，再次点击折叠
 */

FS.extend(FS, function() {
    /**
     * @extends clickMore(options) 点击显示更多，再次点击折叠
     * @description 点击显示更多，再次点击折叠，如果本身的高度低于或等于设置的默认高度，'显示更多'按钮隐藏，并且高度自适应；
     * @description 如果本身加起来的高度大于设置的默认高度，则默认折叠，点击展开。
     * @param {String} all_by 更多按钮
     * @param {String} by_li 内容区域节点
     * @param {Number} limit_height
     * @param {Function} options.hiddenFun 当内容区域缩起来时的回调函数
     * @param {Function} options.blockFun 当内容区域展开时的回调函数
     *
     * @example 
     * FS.clickMore({
            all_by: "#more_brand",
            by_li: "#brand_ul",
            limit_height: 46,
            hiddenFun: function(){
                var morebtn = FS.query("#more_brand");
                FS.setClass(morebtn, 'clickmore');
            },
            blockFun: function(){
                var morebtn = FS.query("#more_brand");
                FS.setClass(morebtn, 'clicksuo');
            }
        });
     *
     */
    var clickMore = function (options) {
        // 需要折叠的区域的id
        var by_li = FS(options.by_li)[0],
            by_all = FS(options.all_by)[0],
            setheight = options.limit_height,
            hiddenFun = options.hiddenFun || function(){},
            blockFun = options.blockFun || function(){};

            var padHeight = parseInt(FS.getStyle(by_li, 'padding-top')) + parseInt(FS.getStyle(by_li, 'padding-bottom'));
            var setPadheight = setheight + padHeight;
            // 如果需折叠区域高度低于或等于默认高度
            if (by_li.offsetHeight <= setPadheight) {
                // 将高度设置为auto
                FS.setCss(by_li, {
                    height: 'auto'
                });
                // 隐藏显示更多按钮
                FS.hide(by_all);
            }
            // 如果需折叠区域高度低于默认高度
            if (by_li.offsetHeight > setPadheight) {
                // 将高度设置为折叠后的默认高度
                FS.setCss(by_li, {
                    height: setheight + 'px'
                });
                hiddenFun();
            }
            // 点击显示更多按钮
            FS.addEvent(by_all, 'click', function(e) {
                // 如果折叠后的高度刚好等于设置的高度，说明被折叠过
                if (by_li.offsetHeight == setPadheight) {
                    // 被折叠过，则展开
                    FS.setCss(by_li, {
                        height: 'auto'
                    });
                    blockFun();
                } else {
                    // 如果高度大于设置的高度，说明已展开，将其折叠
                    FS.setCss(by_li, {
                        height: setheight + 'px'
                    });
                    hiddenFun();
                }
                e.stopPropagation();
            })
        };

    return {
        clickMore: clickMore
    }
}());