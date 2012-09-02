/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 弹出层表单提交成功后的弹窗
 */

FS.extend(FS, function () {
    /**
     * @description 弹出层表单提交成功后的弹窗
     * @param {String} options.title 弹窗的标题
     * @param {String} options.msg 弹窗的文字提示
     * @param {String} options.tip 成功提示框底部的附言
     * @param {String} options.className 文字提示前需要的图片
     * @param {Boolean} [options.noFixed] 是否需要在该方法中对弹出层进行定位
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
        var noFixed = options.noFixed === true ? true : false;

        FS.hide(FS('#order_msg')[0]);
        FS.show(FS('#orderMainSucMsg')[0]);
        FS.html(FS('#titleWindow')[0], title);
        FS.html(FS('#mainIconMsg')[0], msg);

        FS.removeClass(FS('#iconFace')[0],'iconMsgSuc');
		FS.removeClass(FS('#iconFace')[0],'iconMsgFal');
		FS.setClass(FS('#iconFace')[0], className);
        FS.html(FS('#mainNoticeWindowsText')[0], tip);

        if(!noFixed){
            var orderMainSucMsg = FS('#orderMainSucMsg')[0];
            FS.layerCenter(orderMainSucMsg);

            var top = Math.floor(FS.getWindowHeight() / 2);
            var pageHeight = FS.getPageHeight();

            FS.setCss(FS('#orderMainSucMsg')[0], {
                top: (pageHeight - top - 16) + 'px',
                zIndex: '99996'
            });
        }
        
    };

    return {
        successPropTips: successPropTips
    }
}());