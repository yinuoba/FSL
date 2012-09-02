( function() {
    /*轮播图片*/
    FS.playScroll('#play_list',{how:0, pager:'#play_text', numClass:'btn_picshow_on'});

    /*图片延时加载*/
    FS.fsLoadImg({
        attr : 'fslazy',
        height : 200
    });

    /*限抢商品 底部热区*/
    FS.hotFade({
        eventTarget : '.hot_area'
    });

    /*即将开始的品牌 头部tab*/
    FS.tab({
        divActive : 'active_brand',
        active : 'willonline_on',
        tabParent : '#start_date',
        contentParent : '#start_brand'
    });

    /*即将结束的品牌 倒计时*/
    ( function() {
        var time_t = FS(".time_t"),
        timeLeng = time_t.length - 1;
        for(; timeLeng>=0; timeLeng--) {
            var times = FS.getChildNodes(time_t[timeLeng]);
            if(times[0] != null && times[2]!= null) {
                FS.countDown({
                    shi : times[0],
                    fen : times[2],
                    toDate: new Date('2012/06/30 23:59:59')
                });
            }
        }
    }());
    /*到场通知，点击弹层*/
    FS.popUp({
        eventTarget : '.tellMe',
        popUpId : '#tellme_willopen',
        popUpWidth : 440,
        popUpHeight : 237,
        closeId : '#willopen_close',
        maskId : '#maskid',
        maskOpacity : '0.8',
        targetId : 'rid',
        popHiddenId : '#notice_rush_id'
    });
}())