/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 点击弹层
 */

FS.extend(FS, function () {
    /**
     * @extends popUp(options) 点击弹层
     * @description 点击弹层链接，弹层出现并居中，滚动条下拉，仍然水平和垂直均居中于浏览器
     * 如果是ie6，则不用position:fixed，用absolute，并实现fixed一样的效果
     * 如果是ie6并且存在select，则加上一透明度为0，高宽100%的iframe，用以覆盖select。
     * 如果要弹出层可拖拽，则让options.moveAble为true
     * 如果要在几秒钟后关闭弹出层，则将时间段赋给options.timeToOut
     * 如果要在点击弹出层以外区域时，关闭弹出层，设置options.clickToOut为true
     * 如果弹窗不需要固定位置，将fixed设为false
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
     * @param {Boolean} [options.clickToOut] 点击弹出层以外区域、弹出层关闭
     * @param {Boolean} [options.fixed] 让弹窗不固定在一个位置
     * @param {Function} [options.beforeFun] 点击触发弹层的按钮、弹窗之前触发的一个回调函数
     * @param {Function} [options.targetFun] 点击触发弹层的按钮、弹窗后的处理事件
     * @param {Boolean} [options.clickFlug] 点击触发弹窗节点，click监听事件是在这个插件内添加，还是在调用的时候手动添加
     * @param {Boolean} [options.noPopup] 弹层是否弹出
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
            timeToOut: 8000,
            clickToOut: true,
            fixed: false,
            targetFun: widthFun
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
            maskOpacity = options.maskOpacity || 0.6,
            popHiddenId = options.popHiddenId,
            moveAble = options.moveAble,
            timeToOut = options.timeToOut,
            clickToOut = options.clickToOut,
            beforeFun = options.beforeFun,
            targetFun = options.targetFun;
            
        var fixed = true;
        options.fixed == false ? fixed = false : true;

        var clickFlug = true;
        options.clickFlug == false ? clickFlug = false : true;

        var noPopup = options.noPopup === true ? true : false; 

        if (maskSelector != null) {
            var maskId = maskSelector.substring(1);
        }

        // 定义点击事件源后的回调函数
        var popFun = function () {
            // 点击触发按钮，并在弹窗之前触发的回调函数
            if(beforeFun){
                beforeFun();
            }

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
            FS.hide(popUpObj);

            // 为弹出层设置样式
            FS.setCss(popUpId, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                zIndex: '99999',
                marginLeft: '-' + popUpWidth / 2 + 'px',
                marginTop: '-' + popUpHeight / 2 + 'px'
            });

            // 如果弹出层位置固定
            if(!fixed){
                FS.setCss(popUpId, {position: 'absolute'});
            }

            // 如果是IE6
            if (FS.isIE6()) {
                // 如果页面中有select，则创建一透明的，覆盖全屏的iframe，防止遮罩层遮不住select
                FS.createSelectIframe();

                // 获取body的高度，用来设置遮罩层的高度
                var maskHeight = FS.getPageHeight();
                // 设置遮罩层的高度
                if (maskSelector != null) {
                    FS.setCss(maskSelector, {
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        height: maskHeight + 'px'
                    })
                }

                // 如果是IE6，则把弹出层的position设为absolute
                FS.setCss(popUpId, {
                    position: 'absolute',
                    top: (FS.getWindowHeight()) / 2,
                    left: '50%'
                });

                // 如果需要固定位置
                if(fixed){
                    FS.setCss(popUpId, {
                        top: FS.getScrollTop() + (FS.getWindowHeight()) / 2
                    });
                }

                FS.addEvent(window, 'scroll', function () {
                    FS.setCss(popUpId, {
                        position: 'absolute',
                        top: (FS.getWindowHeight()) / 2,
                        left: '50%'
                    });

                    // 如果需要固定位置
                    if(fixed){
                        FS.setCss(popUpId, {
                            top: FS.getScrollTop() + (FS.getWindowHeight()) / 2
                        });
                    }
                });
            }
            
            if(!noPopup){
                FS.show(popUpObj);
            }            

            // 显示遮罩层及弹出层，并将显示层浮动在遮罩层的上方
            if (maskSelector != null) {
                FS.show(FS(maskSelector)[0]);
            }

            // 如果设置了几秒钟后关闭弹窗
            if (timeToOut) {
                window.setTimeout(closeFun, timeToOut);
            }

            // 如果要弹窗后的处理函数，则执行处理函数
            if(targetFun){
                targetFun();
            }
        }

        // 给点击弹层链接注册click事件 用以打开浮层
        if(clickFlug){
            // 在popUp方法内部添加监听事件，适用于页面初始化的时候就添加的情况
            FS.selectorAddEvent(eventTarget, 'click', popFun)
        }else{
            // 调用的时候手动触发popUp事件
            popFun()
        }       
        

        // 关闭弹层、遮罩、iframe
        function closeFun() {
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
        if(closeId){
            FS.selectorAddEvent(closeId, 'click', closeFun);
        }

        // 点击弹出层以外区域、弹出层关闭
        if (clickToOut) {
            FS.addEvent(document, 'click', function (e) {
                var clickTarget = e.target,
                    popDisplay = FS.getStyle(popUpObj, 'display');

                // 如果弹出层处于显示状态，并且事件源不是触发弹层的节点
                if (popDisplay !== 'none' && clickTarget != FS.query(eventTarget)) {
                    // 获得弹出层的所有子节点                  
                    var pupArr = FS.getAll(popUpObj);
                    // 将弹出层本身添加到数组
                    pupArr.push(popUpObj);

                    // 如果事件源不在弹出层上，则关闭弹出层
                    if (pupArr.indexOf(clickTarget) === -1) {
                        closeFun();
                        return
                    }
                }
            })
        }

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
    }

    return {
        popUp: popUp
    }
}());