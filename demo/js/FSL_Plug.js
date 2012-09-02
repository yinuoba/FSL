/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description FSL UI组建库
 */

FS.extend(FS, function () {
    /**
     * @extends tab(options) tab选项卡
     * @description tab选项卡功能
     * @param {Object} options 参数对象
     * @param {String} options.divActive 激活状态下tab对应内容的class样式
     * @param {String} options.active 激活状态下tab项的class样式
     * @param {String} options.tabParent tab项的父节点的选择器
     * @param {String} options.contentParent tab项对应的内容div的父节点选择器
     * @param {String} options.eventType 让tab工作的事件类型，默认是'mouseenter'
     * 
     * @example 
     * FS.tab({
             divActive : 'nowNews',
             active : 'dynamic_active',
             tabParent : '#dynamic_btn',
             contentParent : '#msg_lists',
             eventType : 'click'
        });
     *
     */
    var tab = function (options) {
        // tab的事件类型，主要考虑到有的tab是mouseenter触发，有的是click出发
        var tabParent = options.tabParent,
            contentParent = options.contentParent,
            eventType = options.eventType;
        // 取得tab项及其对应的内容项节点
        var tabList = FS.getChildNodes(FS(tabParent)[0]),
            tabContents = FS.getChildNodes(FS(contentParent)[0]);
        // 取得tab的个数，tab的个数与其对应的内容div的个数相等
        var length = tabList.length;

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
                    dynamic_hover: options.dynamic_hover
                }));
            } else {
                // 默认是mouseenter事件触发tab
                FS.addEvent(tabList[i], 'mouseenter', tabCore.bind(this, {
                    divActive: options.divActive,
                    active: options.active,
                    tabParent: options.tabParent,
                    contentParent: options.contentParent,
                    currentNode: tabList[i],
                    currentDiv: tabContents[i]
                }))
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
            dynamic_hover = options.dynamic_hover;

        // 如果当前tab不处于激活状态
        if (!FS.hasClass(currentNode, currentClass)) {
            // 找出出于激活状态的节点并且remove掉
            FS.removeClass(FS('.' + currentClass)[0], currentClass);
            FS.removeClass(FS('.' + divActiveClass)[0], divActiveClass);

            FS.addClass(currentNode, currentClass);
            FS.addClass(currentDiv, divActiveClass);
        } else {
            // 如果当前tab就已经出于激活状态
            return
        }
    };

    return {
        tab: tab
    }
}());
FS.extend(FS, function () {
    /**
     * @extends countDown(options) 倒计时
     * @description 倒计时
     * @param tian 存放天的选择器 形式如'#tian' (可选参数) 如果不需要显示天，可直接不传入这一参数
     * @param shi 存放小时的选择器 形式如'#shi'
     * @param fen 存放分钟的选择器 形式如'#fen'
     * @param miao 存放秒的选择器 形式如'#miao'  (可选参数)如果不需要显示秒，则直接不传入这一参数
     * @param toDate 截止日期
     * @example countDown({
     *         tian: '#tian',
     *         shi: '#shi',
     *         fen: '#fen',
     *         miao: '#miao',
     *         toDate: new Date('2012/03/30 23:59:59')
     *     })
     */

    var countDown = function (options) {
        var toDate = options.toDate,
            tian = options.tian,
            shi = options.shi,
            fen = options.fen,
            miao = options.miao;

        // today 现在时间
        // innerTime 截止时间与现在时间的时间轴的差
        // sectimeOld 截止时间与现在时间之间的秒数
        // secondSold 截止时间与现在时间之间的秒数(整数)
        // msPerDay 一天的总秒数
        // e_daysold 剩余的天数
        // daysold 剩余的天数（整数）
        // e_hrsold 剩余天数以外的小时数
        // hrsold 剩余天数以外的小时数(整数)
        // e_minsold 剩余分数
        // minsold 剩余分数(整数)
        // seconds 得到尾剩余秒数(整数)
        var today = new Date(),
            innerTime = toDate.getTime() - today.getTime(),
            sectimeOld = innerTime / 1000,
            secondSold = Math.floor(sectimeOld),
            msPerDay = 24 * 60 * 60 * 1000,
            e_daysold = innerTime / msPerDay,
            daysold = Math.floor(e_daysold),
            e_hrsold = (e_daysold - daysold) * 24,
            hrsold = Math.floor(e_hrsold),
            e_minsold = (e_hrsold - hrsold) * 60,
            minsold = Math.floor((e_hrsold - hrsold) * 60),
            seconds = Math.floor((e_minsold - minsold) * 60);

        // 如果已经到期了，则都显示为0，并且不再执行
        if (innerTime < 0) {
            if (tian !== undefined) {
                FS(tian)[0].innerHTML = '0';
            }
            if (shi !== undefined) {
                FS(shi)[0].innerHTML = '0';
            }
            if (fen !== undefined) {
                FS(fen)[0].innerHTML = '0';
            }
            if (miao !== undefined) {
                FS(miao)[0].innerHTML = '0';
            }
            // 阻止定时器继续执行
            return false;
        } else {
            // 小于2位数，则十位补0
            if (tian !== undefined && daysold < 10) {
                daysold = '0' + daysold;
            }
            if (hrsold < 10) {
                hrsold = '0' + hrsold;
            }
            if (minsold < 10) {
                minsold = '0' + minsold;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
        }
        // 给天、时、分、秒的DOM设置值
        if (tian !== undefined) {
            FS(tian)[0].innerHTML = daysold;
        }
        if (shi !== undefined) {
            FS(shi)[0].innerHTML = hrsold;
            if (tian === undefined) {
                FS(shi)[0].innerHTML = 24 * daysold + parseInt(hrsold);
            }
        }
        if (fen !== undefined) {
            FS(fen)[0].innerHTML = minsold;
        }
        if (miao !== undefined) {
            FS(miao)[0].innerHTML = seconds;
        }
        // 函数内部不断自调用
        window.setTimeout(function () {
            countDown(options);
        }, 1000);
    };

    return {
        countDown: countDown
    }
}());
FS.extend(FS, function () {
    /**
     * @extends clickMore(options) 点击显示更多，再次点击折叠
     * @description 点击显示更多，再次点击折叠，如果本身的高度低于或等于设置的默认高度，'显示更多'按钮隐藏，并且高度自适应；
     * @description 如果本身加起来的高度大于设置的默认高度，则默认折叠，点击展开。
     * @param all_by
     * @param by_li
     * @param limit_height
     *
     * @example 
     * FS.clickMore({
         all_by: "#viewall_bysize",
         by_li: ".product_list_size",
         limit_height: 50
         });
     *
     */
    var clickMore = function (options) {
        // 需要折叠的区域的id
        var by_li = FS(options.by_li)[0],
            by_all = FS(options.all_by)[0],
            setheight = options.limit_height;
        // 如果需折叠区域高度低于或等于默认高度
        if (by_li.offsetHeight <= setheight) {
            // 将高度设置为auto
            FS.setCss(by_li, {
                height: 'auto'
            });
            // 隐藏显示更多按钮
            FS.hide(by_all);
        }
        // 如果需折叠区域高度低于默认高度
        if (by_li.offsetHeight > setheight) {
            // 将高度设置为折叠后的默认高度
            FS.setCss(by_li, {
                height: setheight + 'px'
            });
        }
        // 点击显示更多按钮
        FS.addEvent(by_all, 'click', function () {
            // 如果折叠后的高度刚好等于设置的高度，说明被折叠过
            if (by_li.offsetHeight == setheight) {
                // 被折叠过，则展开
                FS.setCss(by_li, {
                    height: 'auto'
                });
            } else {
                // 如果高度大于设置的高度，说明已展开，将其折叠
                FS.setCss(by_li, {
                    height: setheight + 'px'
                });
            }
        })
    };

    return {
        clickMore: clickMore
    }
}());
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
FS.extend(FS, function () {
    /**
     * @extends popUp(options) 点击弹层
     * @description 点击弹层链接，弹层出现并居中，滚动条下拉，仍然水平和垂直均居中于浏览器
     * 如果是ie6，则不用position:fixed，用absolute，并实现fixed一样的效果
     * 如果是ie6并且存在select，则加上一透明度为0，高宽100%的iframe，用以覆盖select。
     * 如果想要弹出层可拖拽，则让options.moveAble为true
     * 如果想要在几秒钟后关闭弹出层，则将时间段赋给options.timeToOut
     *
     * @param {Object} options 参数对象
     * @param {String} options.clickTarget 点击弹层链接的选择器，多个选择器可用逗号隔开
     * @param {String} options.popUpId 弹出层的选择器
     * @param {Number} [options.popUpWidth] 弹出层的宽度，默认为弹出层的宽度
     * @param {Number} [options.popUpHeight] 弹出层的高度，默认为弹出层的高度
     * @param {String} [options.maskId] 需要创建的遮罩层的ID选择器， 不需要遮罩层的话则不传入maskId
     * @param {String} options.closeId 关闭按钮的选择器，可有多个按钮，多个按钮之间用逗号隔开，如：'#close1,#close2'
     * @param {Number} [options.maskOpacity] 遮罩层的透明度， 默认是0.8
     * @param {String} [options.targetId] 给点击弹层按钮添加的自定义属性 为区分各个弹层 如首页开场通知。（可选参数）
     * @param {String} [options.popHiddenId] 弹出层隐藏域的id选择器，为了用来接受targetId上的数据，区分各个弹层。（可选参数）
     * @param {Boolean} [options.moveAble] 让弹出层可拖拽
     * @param {Number} [options.timeToOut] 让弹出层在经过timeToOut时间段后自动关闭
     * @example
     * FS.popUp({
            eventTarget : '.notice_btn',
            popUpId : '#start_alert',
            closeId : '#close_alert',
            maskId : '#maskid',
            maskOpacity : '0.8',
            targetId : 'rid',
            popHiddenId : '#notice_rush_id',
            moveAble: true,
            timeToOut: 8000
        }); 
     */
    var popUp = function (options) {
        // 将传进来的对象中的各个值赋给一个简短的局部变量
        var eventTarget = options.eventTarget,
            popUpId = options.popUpId,
            closeId = options.closeId,
            maskSelector = options.maskId,
            popUpObj = FS(popUpId)[0],
            targetId = options.targetId,
            maskOpacity = options.maskOpacity || 0.8,
            popHiddenId = options.popHiddenId,
            moveAble = options.moveAble,
            timeToOut = options.timeToOut;

        if (maskSelector != null) {
            var maskId = maskSelector.substring(1);
        }

        // 给点击弹层链接注册click事件 用以打开浮层
        FS.selectorAddEvent(eventTarget, 'click', function () {
            // 为区别每个弹出层，给弹出层的隐藏域设置一个rid，rid从事件源节点上取得
            if (targetId != null && popHiddenId != null) {
                var rid = this.getAttribute(targetId);
                FS(popHiddenId)[0].value = rid;
            }

            // 如果options.maskId存在，并且document中无id为maskId的div，则创建以options.maskId为遮罩层Id的遮罩层
            if (maskSelector != null && FS(maskSelector)[0] == null) {
                mask = document.createElement('div');
                mask.setAttribute('id', maskId);
                document.body.appendChild(mask);
                // 给遮罩层设置样式
                FS.setCss(maskSelector, {
                    width: '100%',
                    height: '100%',
                    background: '#000',
                    zIndex: '99995',
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    display: 'none'
                });
                FS.opacity(mask, maskOpacity);
            }

            // 在计算popUpWidth与popUpHeight之前先显示popUpObj节点，否则取不到offsetWidth和offsetHeight
            FS.show(popUpObj);
            var popUpWidth = options.popUpWidth || popUpObj.offsetWidth,
                popUpHeight = options.popUpHeight || popUpObj.offsetHeight;

            // 为弹出层设置样式
            FS.setCss(popUpId, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                zIndex: '99999',
                marginLeft: '-' + popUpWidth / 2 + 'px',
                marginTop: '-' + popUpHeight / 2 + 'px'
            });

            // 如果是IE6
            if (FS.isIE6()) {
                // 如果页面中有select，则创建一透明的，覆盖全屏的iframe，防止遮罩层遮不住select
                FS.createSelectIframe();

                // 获取body的高度，用来设置遮罩层的高度
                var maskHeight = FS('body')[0].offsetHeight;
                // 设置遮罩层的高度
                if (maskSelector != null) {
                    FS.setCss(maskSelector, {
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        height: maskHeight + 'px'
                    });
                }
                // 如果是IE6，则把弹出层的position设为absolute
                FS.setCss(popUpId, {
                    position: 'absolute',
                    top: FS.getScrollTop() + (FS.getWindowHeight()) / 2,
                    left: '50%'
                });
                FS.addEvent(window, 'scroll', function () {
                    FS.setCss(popUpId, {
                        position: 'absolute',
                        top: FS.getScrollTop() + (FS.getWindowHeight()) / 2,
                        left: '50%'
                    });
                });
            }

            // 显示遮罩层及弹出层，并将显示层浮动在遮罩层的上方
            if(maskSelector != null){
                FS.show(FS(maskSelector)[0]);
            }

            // 如果设置了几秒钟后关闭弹窗
            if(timeToOut){
                window.setTimeout(closeFun, timeToOut);
            }
        })
        
        // 关闭弹层、遮罩、iframe
        function closeFun(){
            // 如果是ie6，则需要隐藏iframe，否则不需要
            if (FS.isIE6()) {
                if (FS('#iframeSelect')[0] != null) {
                    // 如果传入了遮罩层的选择器，则同时隐藏弹出层、遮罩层、iframe，否则不隐藏遮罩层
                    maskSelector != null ? FS.hide(popUpObj, FS(maskSelector)[0], FS('#iframeSelect')[0]) : FS.hide(popUpObj, FS('#iframeSelect')[0]);
                } else {
                    // 若maskSelector存在，隐藏弹出层和遮罩层，否则只隐藏弹出层。
                    maskSelector != null ? FS.hide(popUpObj, FS(maskSelector)[0]) : FS.hide(popUpObj);
                }
            } else {
                // 如果不是IE6，则若maskSelector存在，隐藏弹出层和遮罩层，否则只隐藏弹出层。
                maskSelector != null ? FS.hide(popUpObj, FS(maskSelector)[0]) : FS.hide(popUpObj);
            }
        }

        // 通过selectorAddEvent方法给选择器数组注册事件，用以关闭浮层，closeId.split(',')去空格之类的在选择器方法里面已经做了处理
        FS.selectorAddEvent(closeId, 'click', closeFun);

        // 如果弹出层是可移动的,则让弹出层可拖拽
        if (moveAble) {
            // 给弹出层添加移动事件
            FS.addEvent(popUpObj, 'mousedown', function (e) {
                // 鼠标相对页面的位置，校正，让其兼容各个浏览器
                var e = FS.fixMousePos(e);

                // 计算弹出层的marginLeft和marginRight的值
                var innerLeft = e.pageX - FS.getOffset(popUpObj, 'left'),
                    innerTop = e.pageY - FS.getOffset(popUpObj);

                // 标记鼠标已按下
                var isClick = true;

                // 添加鼠标移动事件
                FS.addEvent(popUpObj, 'mousemove', function (e) {
                    // 判断鼠标还是按下状态
                    if (isClick) {
                        // 鼠标相对页面的位置，校正，让其兼容各个浏览器
                        var dragE = FS.fixMousePos(e);

                        var popML = parseInt(FS.getStyle(popUpObj, 'marginLeft')),
                            popMT = parseInt(FS.getStyle(popUpObj, 'marginTop'));

                        // 计算距离横向和纵向的值
                        var toLeftVal = dragE.pageX - innerLeft - popML,
                            toTopVal = dragE.pageY - innerTop - popMT;

                        FS.setCss(popUpObj, {
                            left: toLeftVal + 'px',
                            top: toTopVal + 'px'
                        });

                        // 弹出层超出边界时的处理方法
                        // 如果滚动条已经超出了内容的左边，停止
                        if (toLeftVal < 0) {
                            FS.setCss(popUpObj, {
                                left: 0
                            });
                        }
                        // 如果滚动条已经超出了内容的上边，停止
                        if (toTopVal < 0) {
                            FS.setCss(popUpObj, {
                                top: 0
                            });
                        }
                    }
                    // 阻止事件的冒泡，防止鼠标离开滚动条就默认把文字给全选中了
                    e.stopPropagation();
                    return false;
                })

                FS.addEvent(popUpObj, 'mouseup', function () {
                    // 如果鼠标已弹起，则标记为false
                    isClick = false;
                    // 阻止事件的冒泡，防止鼠标离开滚动条就默认把文字给全选中了
                    e.stopPropagation();
                    return false;
                })
            })
        }
    };

    /**
     * @description 弹出层表单提交成功后的弹窗
     * @param title 弹窗的标题
     * @param msg 弹窗的文字提示
     * @param tip 成功提示框底部的附言
     * @param className 文字提示前需要的图片
     *
     * @example
     * FS.successPropTips({
         title : '订阅成功',
         msg : '成功订阅每日限抢信息！',
         tip : '温馨提示：您已经成功订阅了开场通知，我们将在活动开场前通知您。',
         className : 'mainIconMsg'
         });
     */
    var successPropTips = function (options) {
        var title = options.title,
            msg = options.msg,
            tip = options.tip,
            className = options.className;

        FS.hide(FS('#order_msg')[0]);
        FS.show(FS('#orderMainSucMsg')[0]);
        FS.html(FS('#titleWindow')[0], title);
        FS.html(FS('#mainIconMsg')[0], msg);
        FS.removeClass(FS('#mainIconMsg')[0], 'mainIconMsg');
        FS.removeClass(FS('#mainIconMsg')[0], 'mainIconMsgWarm');
        FS.addClass(FS('#mainIconMsg')[0], className);
        FS.html(FS('#mainNoticeWindowsText')[0], tip);
        var orderMainSucMsg = FS('#orderMainSucMsg')[0];
        FS.layerCenter(orderMainSucMsg);

        var top = Math.floor(FS.getWindowHeight() / 2);
        var pageHeight = FS.getPageHeight();

        FS.setCss(FS('#orderMainSucMsg')[0], {
            top: (pageHeight - top - 16) + 'px',
            zIndex: '99996'
        })
    };

    return {
        popUp: popUp,
        successPropTips: successPropTips
    }
}());
FS.extend(FS, function () {
    /**
     * @extends fixPng(selectors) 透明png的img在ie6下透明
     * @description 透明png的img在ie6下透明
     * @param selectors 用到透明图片的元素的selector（class或id、TagName等）
     * @example
     * FS.ready( function() {
         FS.fixPng('#img1, #img2');
         });
     */
    var fixPng = function (selectors) {
        // IE6中执行,判断IE6
        if (FS.isIE6()) {
            // 将选择器数组去除空格
            var selectors = selectors.trim().split(','),
                length = selectors.length - 1,
                elements = [];
            for (; length >= 0; length--) {
                // 根据各个选择器选择出来的元素数组
                var selectorsElements = FS(selectors[length]);
                var leng = selectorsElements.length - 1;
                for (; leng >= 0; leng--) {
                    // 根据各个选择器选择出来的元素数组中的各个元素插入elements数组中,下面就只操作elements数组
                    elements.push(selectorsElements[leng]);
                }
            }

            // 计算透明png的img的个数，并循环做处理
            var eleLength = elements.length;
            for (var j = 0; j < eleLength; j++) {
                var img = elements[j];
                // 将图片路径全转换成大写，方便后面的判断
                var imgName = img.src.toUpperCase();
                // 判断如果是png图片
                if (imgName.substring(imgName.length - 3, imgName.length) == "PNG") {
                    // 拼id、class、title、style等，为最后定义img外层的span做准备
                    var imgID = (img.id) ? "id='" + img.id + "' " : "";
                    var imgClass = (img.className) ? "class='" + img.className + "' " : "";
                    var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
                    var imgStyle = "display:inline-block;" + img.style.cssText;
                    if (img.align == "left") imgStyle = "float:left;" + imgStyle
                    if (img.align == "right") imgStyle = "float:right;" + imgStyle
                    if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle
                    var strNewHTML = "<span " + imgID + imgClass + imgTitle + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";" + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>";
                    img.outerHTML = strNewHTML;
                }
            }
        }
    };

    return {
        fixPng: fixPng
    }
}());
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
                        FS.slide(outArea, 'height', maxHeight, minHeight, 300);
                    }
                }
            })
        }
    };

    return {
        hotFade: hotFade
    }
}());
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
        var parent = FS(parentNode)[0],
            nodeList = FS.getChildNodes(parent),
            length = nodeList.length,
            //length = nodeList.length - 1,
            //nodeList = nodeList.splice(0, length),
            firstContent = FS.getChildNodes(nodeList[0])[1];

        // 循环给各个导航节点添加事件
        for (var i = 0; i < length; i++) {
            FS.addEvent(nodeList[i], 'mouseenter', function () {
                // 如果是IE6并且页面中存在select下拉框，则动态创建一透明的覆盖全屏的iframe，以遮住select.
                FS.createSelectIframe();

                if (!FS.hasClass(this, activeTab)) {
                    // 找出该nav对应的内容节点
                    var content = FS.getChildNodes(this)[1];

                    // 找出出于激活状态的nav并且remove掉
                    FS.removeClass(FS('.' + activeTab)[0], activeTab);

                    // 找出出于激活状态的nav对应的内容节点并且remove掉
                    FS.removeClass(FS('.' + activeDiv)[0], activeDiv);

                    // 将该nav激活
                    FS.addClass(this, activeTab);

                    FS.addClass(content, activeDiv);
                } else {
                    // 如果当前tab就已经出于激活状态
                    return;
                }
            })
            // 鼠标移开，触发事件
            FS.addEvent(nodeList[i], 'mouseleave', function () {
                // 如果是IE6并且页面中存在select下拉框，则动态创建一透明的覆盖全屏的iframe，以遮住select.
                FS.hideSelectIframe()
                // 找出出于激活状态的nav并且remove掉
                FS.removeClass(FS('.' + activeTab)[0], activeTab);

                // 找出出于激活状态的nav对应的内容节点并且remove掉
                FS.removeClass(FS('.' + activeDiv)[0], activeDiv);

                // 将该nav激活
                FS.addClass(nodeList[0], activeTab);

                FS.addClass(firstContent, activeDiv);
            })
        }
    };

    return {
        nav: nav
    }
}());
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

    /**
     * @description 返回顶部
     * @param node  回顶部父层节点
     * @param toTop 回顶部节点
     */

    var goTop = function (options) {
        var fsWindow = window,
            node = options.node,
            toTop = options.toTop;

        if (FS.getScrollTop() > 0) {
            FS.show(node);
        }

        // 当鼠标滚动，页面下拉后，返回顶部出现
        FS.addEvent(fsWindow, 'scroll', function () {
            FS.fixScrollTop(node)
        });
        FS.addEvent(fsWindow, 'resize', function () {
            FS.fixScrollTop(node)
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

    var fixScrollTop = function (node) {
        // h必须在fixScroll内部定义，否则resize将无效
        // totopHeight参数必须放在函数内部，以便page的高度发生变化时动态获取。
        var h = FS.getWindowHeight(),
            footer_top = FS.getOffset(FS.query(".mainBottomBox")),
            totopHeight = 278;

        // scrollTop 滚动条距离顶部的距离
        var scrollTop = FS.getScrollTop();
        if (scrollTop > 0) {
            // 当返回顶部到了底部上方的时候，不再滑倒底部            
            if (footer_top <= scrollTop + h) {
                var topY = footer_top - scrollTop - totopHeight;
                FS.setCss(FS.query('#totop'), {
                    top: topY + 'px'
                });
                // IE6浏览器，特殊处理
                if (FS.isIE6()) {
                    FS.setCss(node, {
                        position: 'absolute',
                        top: footer_top - 283 + 'px'
                    });
                }

            } else {
                FS.setCss(FS.query('#totop'), {
                    top: h - totopHeight + 'px'
                });
                // IE6浏览器，特殊处理
                if (FS.isIE6()) {
                    var oldTop = FS.getWindowHeight() - 283,
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
        fixFixed: fixFixed,
        goTop: goTop,
        fixScrollTop: fixScrollTop
    }
}());
FS.extend(FS, function () {
    /**
     * @description 当文本框获得焦点，提示文字隐藏，失去焦点，提示文字出现
     * @param selectorStr 文本框对象选择器组成的字符串，多个对象选择器用逗号隔开
     * @example FS.toogleText('#msgOrderInputBoxText, .orderInput, .cancelOrderInput');
     */

    var toogleText = function (selectorStr) {
        // 先去除空格，然后将class组成的字符创分割成数组
        var selectorStr = selectorStr.trim(),
            selectorArr = selectorStr.split(','),
            length = selectorArr.length - 1,
            tempValue = [],
            tempColor = [],
            elements = []; 
        // 循环class数组，找出所有的node，并将其放入elements数组中
        for (; length >= 0; length--) {
            // 得到各个class对应的节点
            var nodelist = FS(selectorArr[length]),
                leng = nodelist.length - 1; 
            for (; leng >= 0; leng--) {
                // 将class对应的 每一个节点放入elements数组
                elements.push(nodelist[leng]);
            }
        }

        // 遍历每一个节点，判断其value长度是否大于0，如果大于0，则获取焦点后value清空，失去焦点后
        var nodeLength = elements.length;
        for (var i = 0; i < nodeLength; i++) {
            var element = elements[i],
                value = element.getAttribute('value'),
                color = FS.getStyle(element, 'color') || '#000';
            if (value == null || value == undefined) {
                continue;
            }
            // 将文本框的初始值存入tempValue数组中
            var valueStrip = value.trim();
            tempValue.push(value);
            tempColor.push(color);
            // 如果文本款存在提示文字
            if (valueStrip.length > 0) {
                // 文本框获取焦点
                FS.addEvent(element, 'focus', focusText.bind(element, {
                    tempValue: tempValue[i],
                    tempColor: tempColor[i]
                }))
                // 文本框失去焦点
                FS.addEvent(element, 'blur', blurText.bind(element, {
                    tempValue: tempValue[i],
                    tempColor: tempColor[i]
                }))
            }
        }
    };
    
    // 获得焦点，当文本框的值跟原来的值一样，说明文本框还没被改过，则首先将文本框设为空，并更改字体颜色，否则，文本框已经被更改过，直接保留更改后的文本
    function focusText(options) {
        if (this.value == options.tempValue) {
            this.value = '';
            this.style.color = '#000';
        } else {
            return;
        }
    }

    // 失去焦点，如果文本中的值长度大于0，说明已经更改了文本框，return， 否则，文本框提示文字再次出现
    function blurText(options) {
        if (this.value.trim().length > 0) {
            return;
        } else {
            this.value = options.tempValue;
            FS.setCss(this, {
                color: options.tempColor
            });
        }
    }

    return {
        toogleText: toogleText
    }
}());
FS.extend(FS, function () {
    /**
     * @description 图片轮播，从任意序号跳转到任意序号，都只有一次滚动,不过会切换方向。如，从1到3，只需向左滚动一步；从4到1，向右滚动1步。
     * @param elem  滚动图片所在li的父节点
     * @param how 切换效果。0(默认)淡入淡出，1滚动; how与direct搭配使用.
     * @param direct 方向，值为0时向左，为1时向1上，默认为0.在how参数不为0时有效；how与direct搭配使用.
     * @param delay 自动滚动间隔时间。默认为4000
     * @param step 滚动步长。当滚动方向是水平时，step会默认为slider元素的offsetWidth；当滚动方向是垂直时，则默认为高度。当然，也可以自己设置
     * @param pager 值是一个元素的id选择符,指定slider的页码翻页元素。指定后会为此标签的第一层子元素添加跳转函数
     * @param numClass 激活状态下数字图标的class样式
     * @example FS.playScroll('#play_list',{direct:1, how:1, pager:'#play_focus', numClass:'active_num', step:320});
     */
    var playScroll = function (elm, option) {
        return new playScroll.main(elm, option);
    };

    function Bind(object, fun) {
        var args = Array.prototype.slice.call(arguments).slice(2);
        return function () {
            return fun.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        }
    };

    playScroll.main = function (elm, option) {
        this.slider = FS.query(elm);
        this.items = this.slider.children;
        this.count = this.items.length;
        // 初始化各个参数
        this.reset(option);
        this.how = this.defaults.how;
        this.delay = this.defaults.delay;
        this.ing = 35;

        var drt = this.defaults.direct;
        this.direct = ['left', 'top'][drt % 2];
        this.step = this.defaults.step || (drt % 2 ? this.slider.offsetHeight : this.slider.offsetWidth);
        this.speed = 13;
        this.tween = this.defaults.Tween;
        this.auto = this.defaults.auto; 
        // 页码翻页功能
        this.pager = FS.query(this.defaults.pager);
        this.event = this.defaults.event;
        this.pause = this.defaults.pause;
        this.next = this.now = this._time = 0;

        this.pos = {};
        this.init();
    }
    playScroll.prototype = {
        init: function () {
            var len = this.count,
                root = this;
            var posi = (root.how == 0) ? "position:absolute;" : '',
                fl = (root.direct == 'left') ? "float:left;" : "",
                width = (root.direct == 'left') ? ('width:' + 2 * root.step + 'px') : null,
                css = fl + "display:none; z-index:5;" + posi;
            while (len-- > 0) {
                this.items[len].style.cssText = css;
            }

            this.slider.style.cssText = 'position:absolute;left:0;top:0;' + width;
            FS.setCss(this.slider.parentNode, {
                position: 'relative',
                overflow: 'hidden'
            });
            FS.setCss(this.items[0], {
                zIndex: 10,
                display: 'block'
            });
            this.auto && (this.timer = setTimeout(Bind(this, this.Next), this.delay));
            if (this.pause) {
                FS.addEvent(this.slider, 'mouseout', function () {
                    root.Continue();
                });
                FS.addEvent(this.slider, 'mouseover', function () {
                    root.Pause();
                });
            }
            this.pager && this.Pager();
            this.Hower = this.How();
        },
        reset: function (ops) {
            this.defaults = {
                how: 0,
                direct: 0,
                delay: 4000,
                auto: true,
                pause: true,
                event: 'mouseover',
                Tween: FS.easeOut
            }
            FS.extend(this.defaults, ops);
        },
        fix: function () {
            for (var i = 0, l = this.count; i < l; i++) {
                if (this.items[i] != this.curS && this.items[i] != this.nextS) {
                    this.items[i].style.display = 'none';
                }
            }
        },
        go: function (num) {
            clearTimeout(this.timer);
            this.curS = this.items[this.now];
            if (num != undefined) {
                this.next = num
            } else {
                this.next = this.now + 1;
            }
            (this.next >= this.count) && (this.next = 0) || (this.next < 0) && (this.next = (this.count - 1));

            this.nextS = this.items[this.next];
            //当前项为curS,下一项为nextS,谨记
            if (this.now != this.next) {
                this.fix();
                this.run();
                if (this.pager) {
                    //console.log(this.defaults.numClass);
                    FS.currentOver(this.pages, this.next, this.defaults.numClass)
                };
                this.now = this.next;
            }
        },
        run: function (elm, callback) {
            var curS = this.curS,
                nextS = this.nextS,
                step = this.step; /* 从这里开始初始化运动开始前的选项 */

            //将当前项与下一项的起止位置都初始化为0
            //首先，显示出下一项
            nextS.style.display = 'block';
            if (this.how == 0) {
                curS.style.zIndex = '5';
                nextS.style.zIndex = '10';
                this.Hower.fadeIn(nextS);
            } else {
                if (this.next < this.now) {
                    this._end = 0;
                    this._begin = -step;
                    //console.log(this.slider.style[this.direct]);
                } else {
                    this._begin = 0;
                    this._end = -step;
                    //console.log(this.slider.style[this.direct]);
                }
                this._c = this._end - this._begin;

                this.Move();

            }
            var t = +new Date();

        },
        Move: function () {
            clearTimeout(this.timer);
            if (this._c && (this._time++ < this.ing)) {
                this.Moving(Math.floor(this.tween(this._time, this._begin, this._c, this.ing)));
                setTimeout(Bind(this, this.Move), this.speed);
            } else {
                this.Moving(this._end);
                this._time = 0;
                this.after();
            }
        },
        Moving: function (p) {
            this.slider.style[this.direct] = p + 'px';
        },
        How: function (t) {
            var root = this,
                speed = this.speed,
                how = this.how;
            //console.log(t);

            function fadeIn(elm) {
                var op0 = 0;
                (elm.show = function () {
                    if ((op0 += 0.05) < 1) {
                        FS.opacity(elm, op0);
                        setTimeout(elm.show, speed);
                    } else {
                        FS.opacity(elm, 1);
                        if (!elm.moving) root.after();
                    }
                })();
            }

            function fadeOut(elm) {
                var op1 = 1;
                (elm.hide = function () {
                    if ((op1 -= 0.05) > 0) {
                        FS.opacity(elm, op1);
                        setTimeout(elm.hide, speed);
                    } else {
                        FS.opacity(elm, 0);
                        if (!elm.moving) root.after();
                        return;
                    }
                })();
            }

            return {
                fadeIn: fadeIn,
                fadeOut: fadeOut
            }
        },
        after: function () {
            //console.log('end');
            FS.setCss(this.curS, {
                display: 'none',
                zIndex: 5
            });
            this.slider.style[this.direct] = 0;
            this.auto && (this.timer = setTimeout(Bind(this, this.Next), this.delay));

        },
        Prev: function () {
            this.go(--this.next);
        },
        Next: function () {
            this.go(++this.next);
        },
        Pause: function () {
            clearTimeout(this.timer);
            this.auto = false;
            //console.log('Pause!' + this.timer);
        },
        Continue: function () {
            //this.Pause();
            clearTimeout(this.timer);
            this.auto = true;
            this.timer = setTimeout(Bind(this, this.Next), this.delay);
            //console.log('Continue');
        },
        Pager: function () {
            this.pages = this.pager.children;
            var page = this.pager;
            var evt = this.event,
                pl = this.pages.length,
                root = this,
                to;
            for (var i = 0; i < pl; i++) {
                (function (i) {
                    FS.addEvent(root.pages[i], evt, function () {
                        root.Pause();
                        to = setTimeout(function () {
                            root.go(i)
                        }, 100);
                    });
                    FS.addEvent(root.pages[i], 'mouseout', function () {
                        root.auto = true;
                        clearTimeout(to);
                    });
                })(i);
            }
        }
    }

    playScroll.main.prototype = playScroll.prototype;

    return {
        playScroll: playScroll
    }
}());
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
FS.extend(FS, function () {
    /**
     * @description 鼠标移至图片上，出现放大镜效果
     * @param {Object} options 参数对象
     * @param {String|Element} options.mediumImg 中等大小的图片节点的选择器或节点本身
     * @param {Number} [options.mediumWidth] 中等大小图片的宽度
     * @param {Number} [options.mediumHeight] 中等大小图片的高度
     * @param {Number} [options.bigDivWidth] 大图容器的宽度，默认是中等图片的宽度
     * @param {Number} [options.bigDivHeight] 大图的高度，默认是中等图片的高度
     * @param {Number} [options.offsetLeft=10] 大图容器离中等图片的距离，默认为10
     * @param {String} [options.attr='zoomsrc'] 存储大图片路径的自定义属性，该自定义属性写在中等大小图片节点上，默认为'zoomsrc'
     * @param {Number} [options.pupWidth] 包围鼠标那个透明层的宽度
     * @param {Number} [options.pupHeight] 包围鼠标那个透明层的高度
     * @param {Number} options.bigWidth 大图的宽度
     * @param {Number} options.bigHeight 大图的高度
     * @param {String} [options.bigClass = ''] 大图的class样式
     * @example
     * FS.zoomImg({
            mediumImg: FS.query('#mediumImg'),
            bigImg: '#bigZoom',
            mediumWidth: 342,
            mediumHeight: 455,
            bigWidth: 1800,
            bigHeight: 2400,
            bigClass: 'bigImg'
        });
     */

    var zoomImg = function (options) {
        // mediumImg 中等大小的图片选择器
        // mediumDiv 放中等大小图片的div容器
        var mediumImg = FS.query(options.mediumImg),
            mediumDiv = mediumImg.parentNode;

        //防止行内元素获取到不准确的offsetWidth、offsetHeight、offsetLeft、offsetTop
        FS.setCss([mediumImg, mediumDiv], {
            display: 'block'
        });

        // bigImgId 鼠标放上去后，展现大图的容器的id
        // mediumWidth 中等大小图片的宽度
        // mediumHeight 中等大小图片的高度
        // mediumLeft 中等大小图片离浏览器左侧的距离
        // mediumTop 中等大小图片离浏览器顶部的距离
        // bigDivWidth 大图容器的宽度，默认是中等图片的高度
        // bigDivHeight 大图的高度，默认是中等图片的高度
        // offsetLeft 大图容器离中等图片的距离，默认为10
        // attr 存储大图片路径的自定义属性，该自定义属性写在中等大小图片节点上
        // pupWidth 包围鼠标那个透明层的宽度
        // pupHeight 包围鼠标那个透明层的高度

        var bigImgId = options.bigImg.slice(1),
            mediumWidth = options.mediumWidth || mediumImg.offsetWidth,
            mediumHeight = options.mediumHeight || mediumImg.offsetHeight,
            mediumLeft = FS.getOffset(mediumImg, 'left'),
            mediumTop = FS.getOffset(mediumImg),
            attr = options.attr || 'zoomsrc',
            bigSrc = mediumImg.getAttribute(attr),
            bigDivWidth = options.bigDivWidth || mediumHeight,
            bigDivHeight = options.bigDivHeight || mediumHeight,
            offsetLeft = options.offsetLeft || 10,
            pupWidth = options.pupWidth,
            pupHeight = options.pupHeight,
            bigClass = options.bigClass || '';

        // 创建大图容器和大图
        // 一执行zoomImg方法则创建大图容器和大图，以避免鼠标放上去要等好久大图才出来的情况
        var zoomImageDiv = document.createElement('div');
        zoomImageDiv.id = bigImgId + 'Div';
        zoomImageDiv.innerHTML = "<img class="+bigClass+" id="+bigImgId+" src='"+bigSrc+"'/>";
        // bigLeft 计算大图容器离浏览器左侧和顶部的距离
        var bigLeft = mediumLeft + mediumWidth + offsetLeft,
            bigTop = mediumTop;

        // 定义大图容器的style对象
        var bigStyle = {
            position: 'absolute',
            left: bigLeft + 'px',
            top: bigTop + 'px',
            width: bigDivWidth + 'px',
            height: bigDivHeight + 'px',
            visibility: 'hidden',
            overflow: 'hidden',
            zIndex: '999'
        };
        FS.setCss(zoomImageDiv, bigStyle);
        document.body.appendChild(zoomImageDiv);

        FS.addEvent(mediumDiv, 'mouseenter', function (e) {

            // 获取最新的bigSrc,因为有可能中等大小的图片已经被切换过，并将其设置为大图的src
            var zoomImageDiv = FS('#' + bigImgId + 'Div')[0],
                bigSrc = mediumImg.getAttribute(attr);
            zoomImageDiv.innerHTML = "<img class='"+bigClass+"' id="+bigImgId+" src='"+bigSrc+"'/>";
            FS.query('#' + bigImgId).setAttribute('src', bigSrc);

            // zoomimg 大图
            // bigWidth 大图的宽度
            // bigHeight 大图的高度
            // scaleX 大图跟中等图的宽度比
            // scaleY 大图跟中等图的高度比
            var zoomimg = FS.query('#' + bigImgId);
            zoomimg.display = 'block';
            var bigWidth = options.bigWidth || zoomimg.offsetWidth,
                bigHeight = options.bigHeight || zoomimg.offsetHeight,
                scaleX = bigWidth / mediumWidth,
                scaleY = bigHeight / mediumHeight;

            // 如果鼠标周围的透明层还未创建
            if (FS('#' + bigImgId + 'Pup')[0] == null) {
                var zoomPup = document.createElement('div');
                zoomPup.id = bigImgId + 'Pup';
                mediumDiv.appendChild(zoomPup);
                //如果没有设置pupWidth和pupHeight，则将大图div容器与scaleX之比设为包围鼠标透明层的宽高。
                if (pupWidth == null) {
                    pupWidth = Math.floor(bigDivWidth / scaleX);
                }
                if (pupHeight == null) {
                    pupHeight = Math.floor(bigDivHeight / scaleY);
                }
                // 定义包围鼠标透明层的style
                var pupStyle = {
                    width: pupWidth + 'px',
                    height: pupHeight + 'px',
                    background: '#fff',
                    border: '1px solid #AAA',
                    position: 'absolute',
                    top: 0,
                    visibility: 'hidden',
                    cursor: 'move'
                }
                FS.setCss(zoomPup, pupStyle);
                FS.opacity(zoomPup, 0.5);
            }

            // 如果包围鼠标那一层已经存在了，则直接获取该节点
            var zoomPup = FS('#' + bigImgId + 'Pup')[0];

            // mouseenter 右侧大图显示
            FS.setCss([zoomImageDiv, zoomPup], {
                visibility: 'visible'
            });

            // 显示大图
            showBig(e);

            FS.addEvent(document.body, 'mousemove', showBig);

            // 如果是IE6并且页面中存在select下拉框，隐藏页面中所有的select
            FS.hideSelect();

            // 设置包围鼠标透明层的位置，并设置图片所在div的scrollTop、scrollLeft，让图片显示

            function showBig(e) {
                // 鼠标相对页面的位置，校正，让其兼容各个浏览器
                var e = FS.fixMousePos(e),
                    mouseX = e.pageX,
                    mouseY = e.pageY;

                // 包围鼠标层相对中等大小图片的位置
                var posX = mouseX - mediumLeft - pupWidth / 2,
                    posY = mouseY - mediumTop - pupHeight / 2;

                // 判断包围鼠标透明层的位置，把它控制在图片内
                posX = (mouseX - pupWidth / 2 < mediumLeft) ? 0 : (mouseX + pupWidth / 2 > mediumWidth + mediumLeft) ? (mediumWidth - pupWidth - 2) : posX;
                posY = (mouseY - pupHeight / 2 < mediumTop) ? 0 : (mouseY + pupHeight / 2 > mediumHeight + mediumTop) ? (mediumHeight - pupHeight - 2) : posY;

                // 调整大图的相对位置
                var bigImgX = posX * scaleX,
                    bigImgY = posY * scaleY;

                // 定义包围鼠标透明层的style
                var pupStyle = {
                    left: posX + 'px',
                    top: posY + 'px'
                }
                FS.setCss(zoomPup, pupStyle);

                //设置大图的相对位置
                zoomImageDiv.scrollTop = bigImgY;
                zoomImageDiv.scrollLeft = bigImgX;

                e.preventDefault();
                e.stopPropagation();
            }
        });

        FS.addEvent(mediumDiv, 'mouseleave', function (e) {
            // mouseleave时，获取存放大图的div容器和包围鼠标的div节点
            var zoomImageDiv = FS('#' + bigImgId + 'Div')[0],
                zoomPup = FS('#' + bigImgId + 'Pup')[0];

            zoomImageDiv.innerHTML = '';
            FS.setCss([zoomImageDiv, zoomPup], {
                visibility: 'hidden'
            });
            // 如果是IE6并且页面中存在select下拉框，显示页面中所有的select
            FS.showSelect();
        })
    };

    return {
        zoomImg: zoomImg
    }
}());
FS.extend(FS, function () {
    /**
     * @description 美化select表单的选择器
     * @param selectSelector select的选择器
     * @param liClass 给li添加的class样式  （可选参数）
     * @param divClass select的值对应的div容器的样式  （可选参数）
     * @param liHover options对应的li在hover状态的样式  （可选参数）
     * @param liSelected 选中状态的options对应的li的样式  （可选参数）
     * @param dumpUrl 跳转url，默认传选中option的value （可选参数）
     * @param clickFun 点击select中option后的回调函数 （可选参数）
     */
    var styledSelect = function (options) {
        // selectObj select对象
        // selectId select的ID
        // wrapDiv select的父节点
        var selectSelector = options.selectSelector,
            liClass = options.liClass || 'liClass',
            divClass = options.divClass || 'divClass',
            liHover = options.liHover || 'liHover',
            liSelected = options.liSelected || 'liSelected',
            dumpUrl = options.dumpUrl,
            clickFun = options.clickFun,

            selectObj = FS.query(selectSelector),
            selectId = selectSelector.slice(1),
            wrapDiv = selectObj.parentNode;

        // 将select设为不可见
        FS.setCss(selectObj, {
            visibility: 'hidden',
            display: 'inline'
        });

        // ul_selectId select相对应的ul的id
        // ul_li_selectId select中的option对应的li的Id
        // selected_li_selectId 被选中的options对应的div的Id
        var ul_selectId = 'ul_' + selectId,
            ul_li_selectId = 'ul_li_' + selectId,
            selected_div_selectId = 'selected_div_' + selectId;

        // 创建select对应的ul
        var ul_select = document.createElement('ul');
        ul_select.id = ul_selectId;
        wrapDiv.appendChild(ul_select);

        // optionArr select中的option组成的数组
        // length select中option的个数
        // selectedOption 存储options中的选中项
        var optionArr = selectObj.options,
            length = optionArr.length,
            selectedOption = [];

        // 循环select的所有option，创建option对应的li,并给li添加class样式
        for (var i = 0; i < length; i++) {
            // 创建li，并放在ul中，li中的innerHTML为option的HTML
            var optionLi = document.createElement('li');
            ul_select.appendChild(optionLi);
            FS.html(optionLi, FS.html(optionArr[i]));

            // 如果定义了liClass,则把liClass赋给li
            if (liClass !== undefined && liClass !== null) {
                FS.addClass(optionLi, liClass);
            }

            // 如果有选中项，则给选中项对应的li加上选中状态的class样式
            // 并将选中项存到数组中，一边下面创建select的值对应的div时调用
            if (optionArr[i].selected && liSelected !== undefined) {
                FS.addClass(optionLi, liSelected);
                selectedOption.push(optionArr[i]);
            }

            // 如果定义了option对应的li在hover状态下的样式，则添加到li
            if (liHover !== undefined && liHover !== null) {
                FS.hover(optionLi, function () {
                    FS.addClass(this, liHover);
                }, function () {
                    FS.removeClass(this, liHover);
                });
            }
        }

        // 假如选中项有好几个，则选择第一个为默认选中项，如果没有选中项，则选options的第一项为选中项
        var selOpt;
        if (selectedOption.length >= 0) {
            selOpt = selectedOption[0];
        } else {
            selOpt = selectObj.options[0]
        }

        // 创建选中项对应的div,并将选中option的text付给div的innerHTML
        var selected_div = document.createElement('div');
        selected_div.id = selected_div_selectId;
        wrapDiv.appendChild(selected_div);
        if (selOpt !== undefined && selOpt !== null) FS.html(selected_div, FS.html(selOpt));

        // wrapDivPos 包裹select的div的position值
        // wrapDivWidth 包裹select的div的宽度
        // wrapDivHeight 包裹select的div的高度
        var wrapDivPos = FS.getStyle(wrapDiv, 'position');

        // 假如wrapDiv初始position不等于relative，则设置为relative
        if (wrapDivPos !== 'relative') {
            FS.setCss(wrapDiv, {
                position: 'relative'
            });
        }
        // 给select外层的div添加class样式
        if (divClass !== undefined && divClass !== null) {
            FS.addClass(selected_div, divClass);
        }

        // 给选中select对应的div设置style
        FS.setCss(selected_div, {
            fontSize: '12px',
            position: 'absolute',
            left: '0px',
            top: '0px'
        });

        // 用事件委托实现点击select，下拉展开，再次点击任何地方，select收缩
        // 并实现select的选中和回调行数的执行
        FS.addEvent(document, 'click', function (e) {
            // targetObj 事件源对象
            var targetObj = e.target;

            // 如果事件源对象是select对应的div，则展开ul，否则收缩
            if (targetObj == selected_div) {
                FS.show(ul_select);
                // 阻止事件冒泡
                e.stopPropagation();
            } else {
                // liArr options对应的li
                // targetIndex 事件源对象在li数组中的索引
                var liArr = FS.getChildNodes(ul_select),
                    options = selectObj.options,
                    length = options.length,
                    targetIndex = liArr.indexOf(targetObj);

                // 如果事件源对象是option对应的li，则选中对应的option，并修改li的样式
                if (targetIndex !== -1) {
                    // 如果定义了选中状态下的样式，将样式切换到当前li上
                    if (liSelected !== undefined && liSelected !== null) {
                        FS.currentOver(liArr, targetIndex, liSelected);
                    }
                    // 循环所有option，将selected为true的option设为false
                    for (var i = 0; i < length; i++) {
                        if (options[i].selected) {
                            options[i].selected = false;
                            break;
                        }
                    }
                    // 将当前点击的li对应的select设为true,并selected_div的li的innerHTML
                    options[targetIndex].selected = true;
                    FS.html(selected_div, FS.html(targetObj));

                    // 执行默认跳转
                    if (dumpUrl !== undefined) {
                        window.location.href = dumpUrl + options[targetIndex].value;
                    }

                    // 如果设置了点击option后的回调函数，则执行回调行数
                    if (clickFun !== undefined) {
                        clickFun();
                    }
                }
                // 点击的是任何其他地方，隐藏ul
                FS.hide(ul_select);
                return false;
            }
        })
    };

    return {
        styledSelect: styledSelect
    }
}());
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
                position: 'relative'
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
FS.extend(FS, function () {
    /**
     * @description IE6下给节点数组或元素集合添加hover状态下的class样式
     * @param allElements 所有需要处理的节点
     * @param hoverClass hover状态下的class样式
     * @example
     * FS.ie6Hover({
            allElements : FS.getChildNodes(FS.query("#allbrand")),
            hoverClass : 'mouseon'
        })
     */

    var ie6Hover = function (options) {
        if (FS.isIE6()) {
            var allElements = options.allElements,
                hoverClass = options.hoverClass;

            // 加入allElements是一个数组或一个元素集合
            if (FS.isArray(allElements) || allElements.item) {
                // 如果是一个元素集合，则将元素集合转化为数组，以为元素集合不是Array类型，没有each方法
                if (allElements.item) {
                    allElements = FS.makeArray(allElements);
                }
                allElements.each(function (i) {
                    FS.hover(i, function () {
                        FS.addClass(i, hoverClass);
                    }, function () {
                        FS.removeClass(i, hoverClass);
                    });
                });
            }
        }
    };

    return {
        ie6Hover: ie6Hover
    }

}());
FS.extend(FS, function () {
    /**
     * @description slideTab 可滑动图片tab，并且tab的内容显示在同一个div容器中
     * @param {Object} options 参数对象
     *
     * @param {String} options.tabParent tab项的父节点的选择器 tabParent跟tabSelector之间必须传一个
     * @param {String} options.tabSelector tab项的选择器，用户找出tab节点数组，当没有传入tabParent时使用。
     * @param {String} options.contentParent tab项对应的内容div的选择器,可选项
     * @param {String} options.active 激活状态下tab项的class样式 可选项
     * @param {String} [options.smallEventType='click'] tab的事件类型，默认是click
     * @param {String} [options.mediumAttr='bsrc'] tab中的小图对应的放置中等大小图片的src的自定义属性
     * @param {String} [options.bigAttr='zsrc'] tab中的小图对应的放置大图片的src的自定义属性
     * @param {String} options.upPic 点击即往上滑动的节点的id选择器
     * @param {String} options.downPic 点击即往下滑动的节点的id选择器
     * @param {String} options.upNormal upPic节点正常情况下的class样式
     * @param {String} options.upHover upPic节点高亮情况下的class样式
     * @param {String} options.downNormal upPic节点正常情况下的class样式
     * @param {String} options.downHover upPic节点高亮情况下的class样式
     * @param {Number} [options.showNum=4] 展现出来的图片数量，默认为4
     * @param {Boolean} [options.mediumFade=false] 中等大小的图片是否需要缓入，如果undefined，则自然默认为否
     */

    var slideImgTab = function (options) {
        // tabList 所有tab组成的数组
        // length tab的个数
        if(options.tabParent != null){
            var tabList = FS.getChildNodes(FS.query(options.tabParent))
        }else{
            var tabList = FS(options.tabSelector);
        }
        var length = tabList.length,
            contentParent = FS.query(options.contentParent || null),
            activeClass = options.active,
            upPic = FS.query(options.upPic),
            downPic = FS.query(options.downPic),
            upNormal = options.upNormal || '',
            upHover = options.upHover || '',
            downNormal = options.downNormal || '',
            downHover = options.downHover || '',
            mediumAttr = options.mediumAttr || 'bsrc',
            bigAttr = options.bigAttr || 'zsrc',
            showNum = options.showNum || 4,
            mediumFade = options.mediumFade,
            smallEventType = options.smallEventType || 'click';


        //默认第一次加载隐藏上箭头
        upPic.className = upNormal;

        // 顺序遍历tab，跟tab添加点击事件，并根据tab的数量设置相关节点的状态
        for (var i = 0; i < length; i++) {
            // 给小图绑定事件
            if(contentParent != null){
                FS.addEvent(tabList[i], smallEventType, smallFun);
            }            

            //超出showNum部分隐藏 
            if (i + 1 > showNum) {
                downPic.className = downHover;
                //超过4张就隐藏
                FS.hide(tabList[i]);
            } else {
                //显示个数的范围内张内就显示
                FS.show(tabList[i]);
            }
        }

        //当少于4张图是则不显示下箭头
        if (length <= showNum) {
            downPic.className = downNormal;
        }

        if (length > showNum) {
            FS.addEvent(upPic, 'click', function (e) {
                // 如果当前节点是高亮状态，则相应点击事件
                if (FS.hasClass(this, upHover)) {
                    clickFun('up')
                }
                return;
            });
            FS.addEvent(downPic, 'click', function () {
                // 如果当前节点是高亮状态，则相应点击事件
                if (FS.hasClass(this, downHover)) {
                    clickFun('down')
                }
                return;
            });
        }

        //点击每一张小图片的动作

        function smallFun() {
            // 如果存在高亮状态的class样式，当前节点不是高亮显示的节点
            if (!FS.hasClass(this, activeClass)) {
                if(activeClass != null){
                    // 则让高亮的节点灭掉，当前节点高亮
                    FS.removeClass(FS.query('.' + activeClass), activeClass);
                    FS.addClass(this, activeClass);
                }

                // imgObj 当前tab下的img对象
                // mediumUrl 中等大小图片的url
                // bigUrl 大图的url
                var imgObj = this.getElementsByTagName('img')[0],
                    mediumUrl = imgObj.getAttribute(mediumAttr),
                    bigUrl = imgObj.getAttribute(bigAttr);

                // mediumImg 内容展示容器内img对象
                var mediumImg = contentParent.getElementsByTagName('img')[0];
                mediumImg.setAttribute('src', mediumUrl);
                if (mediumFade) {
                    //让图片渐现
                    FS.fadeIn(mediumImg, 0.5, 1.0, 200);
                }
                mediumImg.setAttribute(bigAttr, bigUrl);
            }
            return;
        }

        // 滚动到上一张或下一张

        function clickFun(directions) {
            var showPics = [];
            // 顺序遍历所有的tab，如果计算出该tab的display属性不为'none'，则将其放入showPics数组中
            for (var i = 0; i < length; i++) {
                if (FS.getStyle(tabList[i], 'display') !== 'none') {
                    showPics.push(tabList[i]);
                }
            }
            // 如果是点击向下
            if (directions === 'down') {
                // 算出showPics的最后一项是位于tabList的什么位置
                var indexList = tabList.indexOf(showPics[showNum - 1]);
                // 如果indexList不是最后，则隐藏showPics的第一项，显示tabList数组中的第indexList项            
                if (indexList < length - 1) {
                    FS.hide(showPics[0]);
                    FS.show(tabList[indexList + 1]);

                    // 让向上的箭头高亮
                    upPic.className = upHover;
                    // 如果indexList+1想是最后一项，则将向下箭头置为normal状态
                    if (indexList + 2 == length) {

                        downPic.className = downNormal;
                    }
                }
            }
            // 如果是点击向上
            if (directions === 'up') {
                // showPics中的第一项在tabList中的位置
                var indexList = tabList.indexOf(showPics[0]);
                // 如果showPics中的第一项不是tabList中的第一项
                // 则显示tabList中的第indexList-1项,隐藏showPics中的最后一项
                if (indexList > 0) {
                    FS.show(tabList[indexList - 1]);
                    FS.hide(showPics[showNum - 1]);

                    // 让向上的箭头高亮
                    downPic.className = downHover;

                    // 假如再往前一项是tabList中的第一项，则向上滑动变灰
                    if (indexList - 1 == 0) {
                        upPic.className = upNormal;
                    }
                }
            }
            // 将showPics队列销毁
            showPics = null;
        }
    };

    return {
        slideImgTab: slideImgTab
    }
}());

FS.extend(FS, function () {
    /**
     * @description 搜索提示。当用户在文本框中输入字符，当键盘释放时，如果数据源中的某个字段中包含输入的字符，则将弹出下拉搜索提示，此时可选择通过向上、向左、向下、向右键或鼠标对下拉项进行选择，按enter或tab键选好并收缩下拉区域，也可选择将搜索项手动输入完成。
     * @param  {Object} options 参数对象
     * @param {String} options.hiddenId 页面中input文本框的ID
     * @param {String} options.method 获取数据源的方式，默认是'local'
     * @param {String} options.dataSource 本地提供的数据源
     * @param {String} [options.ulClass] ul下拉框的class样式,可选
     * @param {String} options.liNormal 下拉出来的选项中正常状态下的样式
     * @param {String} options.liHover 下拉出来的选项中高亮状态下的样式
     * @param {Number} [options.showLength = 20] 下拉出来的选项的数量，默认是20项
     * @example
     * FS.autoSearch({
            hiddenId: 'hiddenId',
            dataSource: jsonData,
            liNormal: 'liNormal',
            liHover: 'liHover'
        })
     */
    var autoSearch = function (options) {
        var hiddenId = options.hiddenId,
            method = options.method || 'local',
            dataSource = options.dataSource,
            ulClass = options.ulClass,
            liNormal = options.liNormal,
            liHover = options.liHover,
            showLength = options.showLength || 20;

        // outputId 生成的随机ID
        // outputObj input文本框，并动态设置其ID
        var outputId = hiddenId + '_' + FS.getRandom(100, 1000);
        var outputObj = FS.query('#' + hiddenId);
        outputObj.id = outputId;

        // input文本框最初的value，如“请输入品牌名称...”
        var inputOldText = outputObj.value;

        // 创建隐藏域，并设置隐藏域的ID
        var hiddenObj = document.createElement('input');
        hiddenObj.type = 'hidden';
        hiddenObj.id = hiddenId;
        hiddenObj.name = hiddenId;

        // parent_Div input的父节点，一个div
        var parent_Div = outputObj.parentNode;

        // TODO FSL中写个方法，将hiddenObj插入在outputObj的后面
        parent_Div.appendChild(hiddenObj);

        // 计算父节点div的宽度和高度，用以设置下拉ul节点的位置
        var divWidth = FS.getStyle(parent_Div, 'width'),
            divHeight = FS.getStyle(parent_Div, 'height');

        // 设置parent_Div的position，方便设置ul的位置
        FS.setCss(parent_Div, {
            position: 'relative'
        });

        // 创建下拉div，并根据hiddenId设置ID
        var ulObj = document.createElement('ul');
        ulObj.id = 'ul' + hiddenId;

        // 将下拉的ul添加为input的父div的子节点
        parent_Div.appendChild(ulObj);

        // 设置下拉ul的样式
        FS.setCss(ulObj, {
            position: 'absolute',
            top: divHeight,
            left: -1 + 'px',
            margin: 0,
            padding: '5px 0 5px 0',
            width: divWidth,
            height: 'auto',
            zIndex: '99999',
            border: '1px solid #999',
            cursor: 'pointer',
            display: 'none',
            background:'#fff'
        });

        // 如果定义了ul下拉框的样式，则将样式搞过来
        if( ulClass != null){
            FS.addClass(ulObj, ulClass);
        }

        // 监听input的输入，这里用keydown，当按键按着不动时能够持续触发，特别是对于上下左右的箭头
        // 注意不能是keyup或keypress，keypress只有按下字符时才触发，keyup不能连续触发，对于按下方向键时都不适应
        FS.addEvent(outputObj, 'keydown', function (e) {
            // 给向左、向上、向右、向下、Tab、Enter键添加事件
            var keyCode = e.keyCode;

            //输入不是37、38、39、40、13
            if (keyCode !== 37 && keyCode !== 38 && keyCode !== 39 && keyCode !== 40 && keyCode !== 9 && keyCode !== 13) {
                // 鼠标释放200ms后，创建下拉区域，并将匹配项放在下拉区域中。
                window.setTimeout(function () {
                    mainFun(e)
                }, 200)
            }

            // 37为向左箭头，38为向上箭头，39为向右箭头，40为向下箭头
            if (keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40) {

                // ul下拉区域总项数
                var liArray = FS.getChildNodes(ulObj),
                    liLength = liArray.length;

                // 如果没有匹配的下拉项，return
                if (liLength == 0) {
                    return;
                }
                // 如果当前没有高亮项，则将第一项设为高亮
                if (!FS('.' + liHover)[0]) {
                    FS.addClass(liArray[0], liHover);
                    setValue(liArray[0]);
                    return;
                }
                // 找出当前高亮项，并计算出当前高亮项在liArr中的位置
                var highObj = FS.query('.' + liHover),
                    highIndex = liArray.indexOf(highObj);

                // 向左、向上箭头
                if (keyCode == 37 || keyCode == 38) {
                    // 如果当前高亮项是第一项，return
                    if (highIndex == 0) {
                        return;
                    }
                    // 当前高亮项不是第一项，则将其上一项设为高亮，当前项设为normal
                    FS.removeClass(liArray[highIndex], liHover);
                    FS.addClass(liArray[highIndex - 1], liHover);

                    // 将liArr[highIndex-1]上的hidid属性值和innerHTML分别付给input文本框的value和input隐藏域的value
                    setValue(liArray[highIndex - 1]);
                }
                // 向右、向下箭头
                if (keyCode == 39 || keyCode == 40) {
                    // 如果已经是最后一项了
                    if (highIndex == liLength - 1) {
                        return;
                    }
                    // 如果当前项不是最后一项
                    FS.removeClass(liArray[highIndex], liHover);
                    FS.addClass(liArray[highIndex + 1], liHover);
                    // 将liArr[highIndex+1]上的hidid属性值和innerHTML分别付给input文本框的value和input隐藏域的value
                    setValue(liArray[highIndex + 1]);
                }
            }
            // 按下Tab、enter键
            if (keyCode == 9 || keyCode == 13) {
                // 获得当前input文本框的值
                var inputValue = outputObj.value;

                // 如果input文本框中输入的值正好在result中有，即有匹配结果，则将其第一项的id设置为文本框隐藏域的id，否则将input隐藏域的value设为空
                inputSelect(inputValue);

                // 点击后隐藏ul下拉区域
                FS.hide(ulObj);
            }
        })
        
        // 键盘释放的时候进行判断，当input文本框的值为空或默认提示文字时，input隐藏域的值清空
        // 注意事件类型不能为keypress、keydown，keypress和keydown是在按下键盘上的字符时触发，会晚一步。
        FS.addEvent(outputObj, 'keyup', function(){
            if(outputObj.value == '' || outputObj.value == inputOldText){
                // 将input隐藏域的value设为空
                hiddenObj.value = '';
            }
        })

        // 当鼠标点击下拉区域的项，将该项的innerHTML设置为input文本框的value，将id设置为隐藏域的值
        FS.addEvent(document, 'click', function(e){
            // 获取事件源对象，并计算出该事件源对象在ul数组中的位置
            var target = e.target,
                indexArr = FS('li', ulObj).indexOf(target);
            //　如果该事件源对象在ul下拉区域中
            if(indexArr !== -1){
                // 将当前项(事件源)对应id和value分别设为input隐藏域和input文本框
                setValue(target);
                // 隐藏下拉区域
                FS.hide(ulObj);
            }else{
                // 获得当前input文本框的值
                var inputValue = outputObj.value;

                // 如果input文本框中输入的值正好在result中有，即有匹配结果，则将其第一项的id设置为文本框隐藏域的id，否则将input隐藏域的value设为空
                inputSelect(inputValue);          

                // 隐藏下拉区域
                FS.hide(ulObj);
                return;
            }
            // 阻止事件冒泡，注意不能阻止事件默认行为，不然右键都点不了
            e.stopPropagation();
        })
        
        // 如果input文本框中输入的值正好在result中有，即有匹配结果，则将其第一项的id设置为文本框隐藏域的id，否则将input隐藏域的value设为空
        function inputSelect(inputValue){
            // 当鼠标点击下拉区域以外的地方，自动根据文本框输入，看result中是否包含该项，如果包含，则设置input隐藏域的值
            var result = findResult(inputValue),
                length = result.length,
                endResult = [];

            // 循环匹配出来的项，看result中是否有那一项的value恒等于input文本框的输入,如果有，则将该项插入endResult数组中
            for(var i = 0; i<length; i++){
                if(result[i].value == inputValue){
                    endResult.push(result[i]);
                }
            }

            // 如果存在匹配项，并且匹配结果的第一项的值正好是当前文本框的值，则将第一项的id设置为input隐藏域的id
            if(endResult.length > 0){
                // 将该项的id设置为input隐藏域的value
                hiddenObj.value = endResult[0].id;
            }else{
                // 将input隐藏域的value设为空
                hiddenObj.value = '';
            }
        }

        // 根据input的输入找出匹配的记录，并将其存入到result数组中
        // TODO 如果是通过ajax方式，则通过FS.Ajax(options)方法将input文本框的输入传给服务器端，返回result这一json数组
        function findResult(inputValue){
            // 用于存储监听input的输入后查询出来的对象数组
            var result = [];

            // 只有当input内有值时才去匹配
            if (inputValue != null && inputValue.trim() !== '' && dataSource != null) {
                // 遍历json数组，看每一项的value中是否包含输入的值，如果包含，则将该对象放入result数组中
                var length = dataSource.length;
                for (var i = 0; i < length; i++) {
                    var text = dataSource[i].value;
                    if (text.indexOf(inputValue) !== -1) {
                        result.push(dataSource[i]);
                    }
                }
            }
            return result;
        }

        // 监听键盘后的处理函数
        function mainFun(e) {

            // 获取input输入的值
            var inputValue = outputObj.value;

            // 根据input文本框的输入找出匹配的记录，并将其放入result数组中
            var result = findResult(inputValue);

            // liStr 拼凑li节点的字符串
            var liStr = '';
            // 如果有对应的匹配项，则创建对应的li节点
            if (result != null) {
                // 循环匹配结果数组，给每一个匹配项创建一个数组
                var leng = result.length;
                for (var j = 0; j < leng && j < showLength; j++) {
                    if (liNormal != null) {
                        liStr += '<li hidid=' + result[j].id + ' class=' + liNormal + ' id=' + 'li' + hiddenId + j + '>' + result[j].value + '</li>';
                    } else {
                        liStr += '<li hidid=' + result[j].id + ' style="padding-left:5px; height:18px; line-height:18px; overflow:hidden; font-size:12px" id=' + 'li' + hiddenId + j + '>' + result[j].value + '</li>';
                    }
                }
            }

            // 将li节点设置为ul的子节点，当没有匹配项的时候，ul的innerHTML将为空
            FS.html(ulObj, liStr);

            // 如果ul中存在li，即找到了匹配项，则显示ul，否则隐藏ul
            if (liStr.trim() !== '') {
                FS.show(ulObj);
            } else {
                FS.hide(ulObj);
            }

            // 当鼠标放在ul下拉块，则相对应的选项程高亮状态
            var liArr = FS.getChildNodes(ulObj);
            FS.nodesAddEvent(liArr, 'mouseenter', function (e) {
                // 设置每一项的title
                this.title = FS.html(this);

                // 如果liHover存在，并且当前项不是高亮，则移除高亮项的高亮class样式，将当前项设为高亮
                var targetIndex = liArr.indexOf(this);
                if (liHover != null) {
                    FS.currentOver(liArr, targetIndex, liHover);
                }
                
                // 阻止mouseenter事件的冒泡和默认行为
                e.preventDefault();
                e.stopPropagation();
            });

            // 阻止keypress事件的冒泡和默认行为
            e.preventDefault();
            e.stopPropagation();
        }

        // 将obj项上的hidid属性值和innerHTML分别付给input文本框的value和input隐藏域的value
        function setValue(obj) {
            // 获取该项的id
            var id = obj.getAttribute('hidid'),
                value = FS.html(obj);

            // 将该项的value设置为input文本框的value
            outputObj.value = value;
            // 将该项的id设置为input隐藏域的value
            hiddenObj.value = id;
        }
    }

    return {
        autoSearch: autoSearch
    }
}());