/** 
 * FSL (Feishang Javascript Library)
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 *
 * @description tab选项卡
 */

FS.extend(FS, function() {
    /**
     * @extends tab(options) tab选项卡
     * @description tab选项卡功能
     * @param {Object} options 参数对象
     * @param {String} options.divActive 激活状态下tab对应内容的class样式
     * @param {String} options.active 激活状态下tab项的class样式
     * @param {String} options.tabParent tab项的父节点的选择器
     * @param {String} options.contentParent tab项对应的内容div的父节点选择器
     * @param {String} [options.eventType] 让tab工作的事件类型，默认是'mouseenter'
     * @param {Function} [options.enterFun] 鼠标移到tab上的回调函数
     * 
     * @example FS.tab({
             divActive : 'nowNews',
             active : 'dynamic_active',
             tabParent : '#dynamic_btn',
             contentParent : '#msg_lists',
             eventType : 'click'
        });
     *
     */
    var tab = function(options) {
            // tab的事件类型，主要考虑到有的tab是mouseenter触发，有的是click出发
            var tabParent = options.tabParent,
                contentParent = options.contentParent,
                eventType = options.eventType,
                enterFun = options.enterFun || function() {};
            // 取得tab项及其对应的内容项节点
            var tabList = FS.getChildNodes(FS(tabParent)[0]),
                tabContents = FS.getChildNodes(FS(contentParent)[0]);
            // 取得tab的个数，tab的个数与其对应的内容div的个数相等
            var length = tabList.length;
            if (length > 1) {
                for (var i = 0; i < length; i++) {
                    // 如果定义了tab的事件类型，则按指定的事件类型出发
                    if (eventType !== undefined) {
                        FS.addEvent(tabList[i], eventType, tabCore.bind(this, {
                            divActive: options.divActive,
                            active: options.active,
                            tabParent: options.tabParent,
                            contentParent: options.contentParent,
                            currentNode: tabList[i],
                            currentDiv: tabContents[i],
                            dynamic_hover: options.dynamic_hover,
			    enterFun: enterFun
                        }));
                    } else {
                        // 默认是mouseenter事件触发tab
                        FS.addEvent(tabList[i], 'mouseenter', tabCore.bind(this, {
                            divActive: options.divActive,
                            active: options.active,
                            tabParent: options.tabParent,
                            contentParent: options.contentParent,
                            currentNode: tabList[i],
                            currentDiv: tabContents[i],
                            enterFun: enterFun
                        }))
                    }
                }
            }
        };

    /**
     * 处理tab的逻辑
     */

    function tabCore(options) {
        // 将参数定义为局部变量
        var currentNode = options.currentNode,
            currentDiv = options.currentDiv,
            currentClass = options.active,
            divActiveClass = options.divActive,
            tabParent = options.tabParent,
            dynamic_hover = options.dynamic_hover,
            enterFun = options.enterFun;

        // 如果当前tab不处于激活状态
        if (!FS.hasClass(currentNode, currentClass)) {
            // 执行鼠标移到tab时的回调函数
            enterFun(currentDiv);
            // 找出出于激活状态的节点并且remove掉
            FS.removeClass(FS('.' + currentClass)[0], currentClass);
            FS.removeClass(FS('.' + divActiveClass)[0], divActiveClass);

            FS.addClass(currentNode, currentClass);
            FS.addClass(currentDiv, divActiveClass);
        } else {
            // 如果当前tab就已经处于激活状态
            enterFun(currentDiv);
            return
        }
    };

    return {
        tab: tab
    }
}());
