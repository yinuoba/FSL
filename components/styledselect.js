/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 美化select表单的选择器
 */

FS.extend(FS, function () {
    /**
     * @description 美化select表单的选择器
     * @param {Object} options
     * @param {String} options.selectSelector select的选择器
     * @param {String} [options.liClass] 给li添加的class样式  （可选参数）
     * @param {String} [options.divClass] select的值对应的div容器的样式  （可选参数）
     * @param {String} [options.liHover] options对应的li在hover状态的样式  （可选参数）
     * @param {String} [options.liSelected] 选中状态的options对应的li的样式  （可选参数）
     * @param {String} [options.dumpUrl] 跳转url，默认传选中option的value （可选参数）
     * @param {Function} [options.clickFun] 点击select中option后的回调函数 （可选参数）
     * @param {Boolean} [isLive] 是否添加document上的委托事件
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

        var isLive = options.isLive === true ? true : false;

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
        var ul_select = FS.query('#'+ul_selectId);
        if(ul_select == null){
            ul_select = document.createElement('ul');
            ul_select.id = ul_selectId;
            wrapDiv.appendChild(ul_select);
        }

        // optionArr select中的option组成的数组
        // length select中option的个数
        // selectedOption 存储options中的选中项
        var optionArr = selectObj.options,
            length = optionArr.length,
            selectedOption = [];

        // 在创建li之前，现将ul的innerHTML职位空
        FS.html(ul_select, '');

        // 循环select的所有option，创建option对应的li,并给li添加class样式
        for (var i = 0; i < length; i++) {
            // 创建li，并放在ul中，li中的innerHTML为option的HTML
            var optionLi = document.createElement('li'),
                liId = 'li' + selectId + i;
            optionLi.id = liId;
            ul_select.appendChild(optionLi);
            FS.html(FS.query('#'+liId), FS.html(optionArr[i]));
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
        var selected_div = FS.query('#'+selected_div_selectId);
        if(selected_div == null){
            selected_div = document.createElement('div');
            selected_div.id = selected_div_selectId;
            wrapDiv.appendChild(selected_div);
        }        
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
        if(!isLive){
            FS.addEvent(document, 'click', function (e) {
                // targetObj 事件源对象
                var targetObj = e.target;
                // 如果事件源对象是select对应的div，则展开ul，否则收缩
                if (targetObj == selected_div) {
                    FS.toggleDisplay(ul_select, 'block');
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
                        // 阻止事件冒泡
                        e.stopPropagation();
                    }
                    // 点击的是任何其他地方，隐藏ul
                    FS.hide(ul_select);
                    e.stopPropagation();
                }
            })
        }
    };

    return {
        styledSelect: styledSelect
    }
}());