/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 鼠标移上去，显示nav对应的内容，当鼠标移开，激活项跳到第一项
 */

FS.extend(FS, function () {
    /**
     * @description 鼠标移上去，显示nav对应的内容，当鼠标移开，激活项跳到第一项
     * @param activeTab nav在激活状态下的class样式
     * @param activeDiv nav对应的内容div在激活状态下的class样式
     * @param parentNode 各个项的父节点
     *
     * @example
     * FS.nav({
         activeTab : 'menuBoxOn',
         activeDiv : 'now',
         parentNode : '#menuBoxUl'
         });
     */
    var nav = function (options) {
        // 将各个参数定义成局部变量
        var activeTab = options.activeTab,
            activeDiv = options.activeDiv,
            parentNode = options.parentNode;
        // 取出导航的各项
        var parent = FS.query(parentNode),
            navArr = FS.getChildNodes(parent);

        // 找出初始状态处于高亮的nav
        var activeObj = FS.query('.'+activeTab),
            activeIndex = navArr.indexOf(activeObj);

        // 循环给各个导航节点添加事件
        navArr.each(function(o,i){
            // 排除第一项"首页"，因为首页一般都下拉内容
            if(i !== 0){
                var navContent = FS.getLastChild(o);
            }
            // 给每一个nav添加mouseenter和mouseleave事件
            FS.hover(o, function(){
                // 鼠标移到导航上，让已经处于高亮状态的nav不高亮，当前高亮
                FS.currentOver(navArr, i, activeTab);
                // 如果不是第一项"首页"，让该nav对应的内容显示
                if(navContent){
                    FS.addClass(navContent, activeDiv);
                }
            },function(){
                // 鼠标移开，让其返回到初始的高亮状态
                FS.currentOver(navArr, activeIndex, activeTab);
                // 如果不是第一项"首页"，让该nav对应的内容隐藏
                if(navContent){
                    FS.removeClass(navContent, activeDiv);
                }
            })
        });
    };

    return {
        nav: nav
    }
}());