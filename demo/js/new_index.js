( function() {
    /*轮播图片*/
    FS.playScroll('#play_list',{direct:1, how:1, pager:'#play_focus', numClass:'active_num', step:320});

    /*图片延时加载*/
    //console.time('lazy');
    FS.fsLoadImg({
        attr : 'fslazy',
        height : 200
    });
    //console.timeEnd('lazy');

    /*限抢商品 底部热区 渐现渐隐*/
    FS.hotFade({
        eventTarget : '.hot_area'
    });

    /*爱分享 底部热区 hover交互*/
    FS.hotFade({
        eventTarget : '.hot_share',
        minHeight : 30,
        maxHeight : 76,
        method : 'slide'
    });

    /*即将结束的品牌 倒计时  即将结束的品牌倒计时可以不用*/
    var rushOffDate = FS('#rushOffDate') ? FS('#rushOffDate')[0] : null;
    if(rushOffDate != null) {
        var endSale = new FS.countDown({
            shi : '#reverse_shi',
            fen : '#reverse_fen',
            toDate: new Date(rushOffDate.value)
        });
    }

    /*公司动态tab*/
    FS.tab({
        divActive : 'nowNews',
        active : 'dynamic_active',
        tabParent : '#dynamic_btn',
        contentParent : '#msg_lists',
        eventType : 'click'
    });

    /*即将出售的品牌 头部tab*/
    FS.tab({
        divActive : 'active_content',
        active : 'start_active',
        tabParent : '#start_date',
        contentParent : '#start_brand'
    });

    /**
     * 给各个tab项添加mouseenter事件
     * 解决由于各个tab内容高度不一样，导致page高度发生变化，但onscroll事件未触发，从而导致快速通道那一块定位出现bug的问题。
     */
    FS.nodesAddEvent(FS.getChildNodes(FS('#start_date')[0]), 'mouseenter', function() {
        FS.fixScrollTop(FS('#totop')[0])
    });
    /*点击开场通知按钮 弹出弹窗*/
    FS.popUp({
        eventTarget : '.notice_btn',
        popUpId : '#start_alert',
        popUpWidth : 406,
        popUpHeight : 310,
        closeId : '#close_alert',
        maskId : '#maskid',
        maskOpacity : '0.8',
        targetId : 'rid',
        popHiddenId : '#notice_rush_id'
    });

    /*订阅指定限抢信息*/
    FS.addEvent(FS('.send_notice')[0], 'click', function() {
        var rushId = FS('#notice_rush_id')[0].value;
        var mobileText = FS('.orderInput')[0].value;
        var emailText = FS('.orderInput')[1].value;
        if(mobileText.trim() == "" && emailText.trim() == "") {
            alert("请填写手机通知或邮件通知.");
            return false;
        }
        if(mobileText.isMobile() || emailText.isEmail()) {
            var params = '&rush_id=' + rushId;
            if( mobileText != '' && mobileText.indexOf('@') == -1 )
                params += '&mobile=' + mobileText;
            if( emailText != '' && emailText.indexOf('@') != -1 )
                params += '&email=' + emailText;
            params += '&type=rush';
            FS.ajax({
                method: 'POST',
                url: "/rushlist.php?act=rushNotice" + params,
                async: true,
                success: function (result) {
                    var msg=new Array(
                    '请填写您的联系方式，我们会在开售当天通知您。'  //0
                    ,'您已经成功定制了开售通知，我们将在开售当天以短信形式通知您。' //1
                    ,'您已经成功定制了开售通知，我们将在开售当天以邮件形式通知您。' //2
                    ,'您已经成功定制了开售通知，我们将在开售当天以短信和邮件形式通知您。' //3
                    ,'您定制的抢购活动已经开始，无法提前通知您。' //4
                    ,'该活动马上开始，敬请期待。' //5
                    ,'您已经定制了该抢购活动，无须重复定制。'//6
                    ,'对不起，请输入合法的手机号码。'//7
                    ,'对比起，请输入合法的Email。'//8
                    );
                    if(result > 0) {
                        FS.hide(FS('#start_alert')[0],FS('##maskid')[0]);
                    }
                    alert(msg[result]);
                }
            });
        } else {
            alert("请输入正确的手机号或者邮箱地址!");
            return false;
        }
    });
    /*当文本框获得焦点，提示文字隐藏，失去焦点，提示文字出现*/
    FS.toogleText('.orderInput');
}())
