( function() {
    /*文本款获取焦点和失去焦点*/
    if(FS.query('.tuan_textbox')) {
        FS.toogleText('.tuan_textbox');
    }

    /*图片延时加载*/
    FS.fsLoadImg({
        attr : 'fslazy',
        height : 200
    });

    /*商品列表hover效果*/
    var container = FS('.tuan3_container_on');
    /*给团购列表的每一个商品添加商检*/
    if(container[0] != null) {
        container.each( function(o) {
            /**
             * 先取得hover的事件源
             */
            var hoverNode = FS('.tuan3_container_lihover', o);
            FS.hover(o, function() {
                FS.show(hoverNode);
            }, function() {
                FS.hide(hoverNode);
            });
        });
    }

    /*返回顶部*/
    ( function() {
        /**
         * goTop 返回顶部节点
         */
        var goTop = FS.query('#gotop');
        function gotop() {
            if(FS.getScrollTop() > 0) {
                FS.show(goTop);
            } else {
                FS.hide(goTop);
            }
            /**
             * 如果是IE6，则动态改变top
             */
            if(FS.isIE6()) {
                var nowTop = FS.getWindowHeight()-65;
                FS.setCss(goTop, {top: nowTop + FS.getScrollTop() + 'px'});
            }
        }

        /**
         * 添加scroll和resize事件
         */
        FS.addEvent(window, 'scroll', function() {
            gotop();
        })
        FS.addEvent(window, 'resize', function() {
            gotop();
        })
    }());
    /*结束时间 倒计时*/
    if(FS.query('#sp_hour') != null) {
        FS.countDown({
            shi: '#sp_hour',
            fen: '#sp_minute',
            miao: '#sp_second',
            toDate: new Date('2012/06/30 23:59:59')
        });
    }

}())