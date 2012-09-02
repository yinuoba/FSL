/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 当文本框获得焦点，提示文字隐藏，失去焦点，提示文字出现
 */

FS.extend(FS, function () {
    /**
     * @description 当文本框获得焦点，提示文字隐藏，失去焦点，提示文字出现
     * @param {String} selectorStr 文本框对象选择器组成的字符串，多个对象选择器用逗号隔开
     * @param {Function} [options.focusFun] 文本框获得焦点时的处理函数，以当前input为参数
     * @param {Function} [options.blurFun] 文本框失去焦点时的处理函数，以当前input为参数
     * @param {Boolean} [options.backTip] 当文本框失去焦点时，提示文字是否恢复
     * @param {Boolean} [options.focusFade] 聚焦时，文本内容不变为空
     * @param {String} [options.fadeText] 文本框最初的提示文字，用以防止在刷新表单后，表单的缓存文本被当作是提示文本，点击立即消失。
     * @example FS.toogleText('#msgOrderInputBoxText, .orderInput, .cancelOrderInput');
     */
    var toogleText = function(selectorStr, options) {
            // 先去除空格，然后将class组成的字符创分割成数组
            var selectorStr = selectorStr.trimAll(),
                selectorArr = selectorStr.split(','),
                length = selectorArr.length - 1,
                tempValue = [],
                tempColor = [],
                elements = [];

            // 聚焦时，文本内容是否设为空
            var focusFade = true,
                backTip = true;
            // 当文本框获得焦点和失去焦点后的处理事件。
            if (options != null) {
                var focusFun = options.focusFun,
                    blurFun = options.blurFun,
                    fadeText = options.fadeText;
                if (options.backTip !== undefined) {
                    backTip = options.backTip;
                }
                if (options.focusFade === false){
                    focusFade = false
                }
            }
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
                var element = elements[i];
                if (FS.notNode(element)) {
                    continue;
                }

                var value = element.value,
                    color = FS.getStyle(element, 'color') || '#000';

                // 将文本框的初始值存入tempValue数组中
                tempValue.push(value);
                tempColor.push(color);

                // 文本框获取焦点
                if (focusFun != null) {
                    FS.addEvent(element, 'focus', focusText.bind(element, {
                        tempValue: tempValue[i],
                        tempColor: tempColor[i],
                        focusFun: focusFun,
                        fadeText: fadeText,
                        focusFade: focusFade
                    }))
                } else {
                    FS.addEvent(element, 'focus', focusText.bind(element, {
                        tempValue: tempValue[i],
                        tempColor: tempColor[i],
                        fadeText: fadeText,
                        focusFade: focusFade
                    }))
                }

                // 文本框失去焦点
                if (blurFun != null) {
                    FS.addEvent(element, 'blur', blurText.bind(element, {
                        tempValue: tempValue[i],
                        tempColor: tempColor[i],
                        blurFun: blurFun,
                        backTip: backTip
                    }))
                } else {
                    FS.addEvent(element, 'blur', blurText.bind(element, {
                        tempValue: tempValue[i],
                        tempColor: tempColor[i],
                        backTip: backTip
                    }))
                }
            }
        }

    // 获得焦点，当文本框的值跟原来的值一样，说明文本框还没被改过，则首先将文本框设为空，并更改字体颜色，否则，文本框已经被更改过，直接保留更改后的文本

    function focusText(options) {
        if (this.value == options.tempValue) {

            // 如果当前表单的值等于给出的提示文字，并且表明要点击消失，则将表单置为空
            if(this.value == options.fadeText && !options.focusFade){
                this.value = '';
            }else if(options.focusFade){
                this.value = ''
            }else if (options.focusFun) {
                // 如果有聚焦时的回调函数，则执行处理函数
                options.focusFun(this)
            }
            this.style.color = '#000';
        } else {
            // 如果有聚焦时的回调函数，则执行处理函数
            if (options.focusFun) {
                options.focusFun(this)
            }
            return;
        }

    }

    // 失去焦点，如果文本中的值长度大于0，说明已经更改了文本框，return， 否则，文本框提示文字再次出现

    function blurText(options) {
        if (this.value.length > 0) {
            // 如果有失焦时的回调函数，则执行处理函数
            if (options.blurFun) {
                options.blurFun(this)
            }
            return;
        } else {
            this.value = options.tempValue;
            FS.setCss(this, {
                color: options.tempColor
            });

            // 如果失去焦点后不需要恢复最初的提示文字
            if (!options.backTip) {
                this.value = '';
                FS.setCss(this, {
                    color: '#000'
                });
            }

            // 如果有失焦时的回调函数，则执行处理函数
            if (options.blurFun) {
                options.blurFun(this)
            }
        }
    }

    return {
        toogleText: toogleText
    }
}());