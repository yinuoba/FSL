/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 分类侧边栏导航效果，看上去像select，可自定义背景。
 */

FS.extend(FS, function () {
    /**
     * @description 分类侧边栏导航效果，看上去像select，可自定义背景。
     * @param sortBoxId 整个box的选择器
     * @param hideDiv 鼠标放上去才显示的隐藏层的选择器
     * @param showAll 显示全部（目前是预留参数）节点的选择器
     * @param ulSort 隐藏层中ul的选择器,即一级菜单父节点的选择器。
     * @param boxHover sortBoxId在hover状态下的class样式
     * @param allSortHover 一级菜单li在hover状态下的class样式
     * @example
     * FS.sortBox({
         sortBoxId :'#sortBoxId',
         hideDiv : '#hideDiv',
         showAll : '#showAll',
         ulSort : '#ulSort',
         boxHover : 'hover',
         allSortHover : 'hover'
         });
     */
    var sortBox = function (options) {
        var sortBoxNode = FS.query(options.sortBoxId),
            hideDiv = FS.query(options.hideDiv),
            showAll = FS.query(options.showAll),
            ulSort = FS.query(options.ulSort),
            allSort = FS.getChildNodes(ulSort),
            length = allSort.length - 1,
            boxHover = options.boxHover,
            allSortHover = options.allSortHover;

        // 当鼠标移动到下拉框上，展示所有一级分类，当鼠标移开，回复初始状态
        FS.hover(sortBoxNode, function () {
            // 鼠标移上去的时候延时300ms
            var timeoutId = setTimeout(function () {
                // 改变下拉框背景
                FS.addClass(sortBoxNode, boxHover);
                // 显示所有一级分类
                FS.show(hideDiv);
            }, 350);
        }, function () {
            // 鼠标移走的时候延时300ms
            var timeoutId = setTimeout(function () {
                // 换回下拉框原有背景
                FS.removeClass(sortBoxNode, boxHover);
                // 隐藏所有一级分类
                FS.hide(hideDiv);
            }, 350);
        });
        // 当鼠标移动到一级分类上，展示一级分类下面的二级分类
        for (; length >= 0; length--) {
            FS.hover(allSort[length], function () {
                // 取得给节点的孩子节点的第二个元素，即隐藏的二级分类
                var item = this,
                    secondSort = item.children[1];
                FS.addClass(item, allSortHover);
                FS.show(secondSort);
            }, function () {
                var item = this,
                    secondSort = item.children[1];
                FS.removeClass(item, allSortHover);
                FS.hide(secondSort);
            });
        }
    }

    return {
        sortBox: sortBox
    }
}());