/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 网站添加收藏，兼容各个浏览器 
 */

FS.extend(FS, function () {
    /**
     * @description 网站添加收藏，兼容各个浏览器
     * @param url 添加收藏的网址 ，默认是'http://www.fclub.cn'
     * @param title 网站名称，默认是'聚尚网-国际名品限时特卖购物网'
     * @example FS.addFavorite('http://www.fclub.cn', '聚尚网-国际名品限时特卖购物网');
     });
     */
    var addFavorite = function (url, title) {
        var url = url || 'http://www.fclub.cn',
            title = title || '聚尚网-国际名品限时特卖购物网';
        var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL';
        try {
            // Firefox浏览器
            window.external.addFavorite(url, title);
        } catch (e) {
            try {
                // IE浏览器
                window.sidebar.addPanel(title, url, "");
            } catch (e) {
                alert('您的浏览器不支持自动加入收藏，请按 ' + ctrl + ' + D 收藏聚尚网');
                FS.ignoreError();
            }
        }
    };

    return {
        addFavorite: addFavorite
    }
}());