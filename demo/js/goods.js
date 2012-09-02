( function() {
    /*图片延时加载*/
    FS.fsLoadImg({
        attr : 'fslazy',
        height : 200
    });

    /*此价格剩余时间*/
    FS.countDown({
        tian: '#ViewFrist_d1',
        shi: '#ViewFrist_h1',
        fen: '#ViewFrist_m1',
        miao: '#ViewFrist_s1',
        toDate: new Date('2013/08/30 23:59:59')
    });

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
                var nowTop = FS.getWindowHeight() - 330;
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
    /*买过此商品的用户还购买了模块 hover*/
    ( function() {
        var goodsArr = FS('.goods_rphotobox');
        /**
         * 给每个对象添加事件
         */
        goodsArr.each( function(o) {
            /**
             * goodsMask 下半截灰色区域
             * maskPrice 灰色区域的分割线左侧区域
             */
            var goodsMask = FS.getChildNodes(o)[1],
            maskPrice = FS.getChildNodes(goodsMask)[0];

            /**
             * 鼠标放到整个对象上，触发hover事件
             */
            FS.hover(o, function() {
                FS.setCss(o, { border:'1px solid #7d0000'});
                FS.setCss(goodsMask, { background:'#7d0000'});
                FS.setCss(maskPrice, { borderRight:'1px solid #bb251e'});
            }, function() {
                FS.setCss(o, { border:'1px solid #fff'});
                FS.setCss(goodsMask, { background:'#000'});
                FS.setCss(maskPrice, { borderRight:'1px solid #414141'});
            });
        });
    }());
    /**
     * 商品图片模块
     */
    FS.slideImgTab({
        tabParent: '#spjbxx_img_list',
        contentParent: '#medium-image-div',
        active: 'borderhot',
        upPic: '#up_pic',
        downPic: '#down_pic',
        upNormal: 'up_pic_normal',
        upHover: 'up_pic_on',
        downNormal: 'down_pic_normal',
        downHover: 'down_pic_on',
        mediumFade: true
    });

    // 给中等大小图片注册放大镜事件
    
    FS.ready(function(){
        FS.zoomImg({
            mediumImg: FS.query('#medium-image-div').getElementsByTagName('img')[0],
            bigImg: '#bigZoom',
            attr: 'zsrc',
            mediumWidth: 342,
            mediumHeight: 455,
            bigWidth: 1800,
            bigHeight: 2400
        });
    });    


}())