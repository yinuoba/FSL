( function() {
    /*让IE6缓存背景图片*/
    FS.ieCache();

    /*文本框获得焦点，提示文字消失*/
    FS.toogleText('.main_textbox, .mainmsg_textbox');

    /*头部 导航*/
    if(FS.query('#hd-nav') !== null) {
        FS.nav({
            activeTab : 'menuBoxOn',
            activeDiv : 'now',
            parentNode : '#hd-nav'
        });
    }

    /*取消订阅弹层*/
    FS.popUp({
        eventTarget : '#msg_cancel',
        popUpId : '#msg_cancel_contain',
        popUpWidth : 420,
        popUpHeight : 310,
        closeId : '#box_mainmsg_close',
        maskId : '#maskid',
        maskOpacity : '0.8'
    });

    /*关闭公告*/
    var mainnews_close = FS.query(".mainnews_close");
    if(mainnews_close != null) {
        FS.addEvent(FS.query(".mainnews_close"), 'click', function() {
            var mainnews_contbg = FS.query('.mainnews_contbg'),
            msgHeight = parseInt(FS.getStyle(mainnews_contbg, 'height'));
            FS.slide(mainnews_contbg, 'height', msgHeight, 0, 500);
            setTimeout( function() {
                FS.hide(mainnews_contbg);
            },500);
        });
    }

}())