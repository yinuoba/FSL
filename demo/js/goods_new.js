(function(){
    // 当js遇到错误时继续往下执行
    FS.ignoreError();

	/* 商品倒计时 */
    if(FS('#secondoff')[0] != null){
        // 从存放时间差的隐藏input取得时间差
        var timestr = FS.query('#timestr'),
            allTime = timestr.value;

        // 倒计时开始
        FS.countDown({
            tian: '#dayoff',
            shi: '#houroff',
            fen: '#minusoff',
            miao: '#secondoff',
            inner: allTime
        })
    }

    /* 图片延时加载 */
    FS.fsLoadImg({
        attr : 'fslazy',
        height : 200
    });

    // // 购买尺寸
    // FS.styledSelect({
    //     selectSelector : '#buy_size',
    //     liClass : 'liClass',
    //     divClass : 'divClass',
    //     liHover : 'liHover',
    //     liSelected : 'liSelected'
    // });

    // // 该尺寸
    // FS.styledSelect({
    //     selectSelector :　'#this_size',
    //     liClass : 'liClass',
    //     divClass : 'divClass',
    //     liHover : 'liHover',
    //     liSelected : 'liSelected'
    // });

    /* goods页面商品图片hover效果 */
    var container = FS('.goods_area');
    // 给rush列表的每一个图片添加hover效果
    if(container[0] != null) {
        container.each( function(o) {
            // 先取得hover的事件源
            var hoverNode = FS('.lihover', o);
            FS.hover(o, function() {
                FS.show(hoverNode);
            }, function() {
                FS.hide(hoverNode);
            });
        });
    }

    /* 滑动图片tab */
    FS.slideImgTab({
        tabParent: '#smallimgs',
        contentParent: '#goods_medium',
        active: 'small_hover',
        upPic: '#slide_left',
        downPic: '#slide_right',
        upNormal: 'slide_left',
        upHover: 'slide_left_on',
        downNormal: 'slide_right',
        downHover: 'slide_right_on'
    });

    /* 给中等大小图片注册放大镜事件 */    
    FS.ready(function(){
        FS.zoomImg({
            mediumImg: FS.query('#goods_medium').getElementsByTagName('img')[0],
            bigImg: '#bigZoom',
            attr: 'zsrc',
            mediumWidth: 340,
            mediumHeight: 455,
            bigDivWidth: 457,
            bigDivHeight: 457,
            bigWidth: 1800,
            bigHeight: 2400
        })
    }); 

    /* 商品详细信息区tab */
    FS.tab({
        divActive : 'show_goods',
        active : 'tab_active',
        tabParent : '#tabmenu',
        contentParent : '#goods_tabinner',
        eventType : 'click'
    });

    /* 选择数量 */
    FS.styledSelect({
        selectSelector :　'#select_num',
        liClass : 'liClass',
        divClass : 'divClass',
        liHover : 'liHover',
        liSelected : 'liSelected'
    });

    /* 选择尺码 */

    // allSize 取得所有的尺码组成的节点数组
    var allSize = FS.makeArray(FS.query('.size_span').getElementsByTagName('a'));
    allSize.remove(FS.query('.refer_size'));

    // 给每一个尺码节点添加处理函数
    allSize.each(function(o){
        var sizeNum = o.getAttribute('num');
		var sizeid = o.getAttribute('sizeid');
        // 假如该尺码数量为0，则将该节点变灰，
        if(sizeNum == 0){
            // 给该尺码添加选中状态的class样式，并在该节点内部添加b标签  
            FS.addClass(o, 'no_goods_size');
            FS.html(o, FS.html(o)+'<b></b>');
        }

        // 如果只剩下一个尺码
        if(this.length === 1){
            // 如果只剩下一个尺码，并且该尺码的数量大于0，则默认选中该尺码
            if(sizeNum > 0 ){
                FS.addClass(o, 'selectedsize'); 
                FS.html(o, FS.html(o)+'<b></b>');
            }
            // 将尺码节点上num的值设置为隐藏input的value
			FS.query("#sizeid").value = sizeid;
            setSelect();
            return;
        }

        // 更新数量select
        function setSelect(){
            // 更新select_num
            sizeNum = parseInt(FS.query("#voucher_number").value) > parseInt(sizeNum) ? parseInt(sizeNum) : parseInt(FS.query("#voucher_number").value);
            FS.query("#select_num").length = 1;
            for (var i = 1; i <= sizeNum; i++) {
                FS.query("#select_num").options[i] = new Option(i, i);
            }
        }

        // 给每一个尺码节点添加事件
        FS.addEvent(o, 'click', function(e){
            // 若尺码已变灰，直接return
            if(FS.hasClass(o, 'no_goods_size') || FS.hasClass(o, 'selectedsize')){
                return;
            }
            // 找出已选中并数量大于0的节点
            var selectObj = FS.query('.selectedsize');
            // 如果已经有选中并且数量大于0的尺码，则先将那个尺码选中状态去掉，再将当前尺码设为选中状态
            if(selectObj != null){
                FS.removeClass(selectObj, 'selectedsize');
                FS.hide(selectObj.getElementsByTagName('b'));

                FS.addClass(this, 'selectedsize');
                FS.html(this, FS.html(this)+'<b></b>');
            }else{
                // 如果没有选中的节点
                FS.addClass(this, 'selectedsize');
                FS.html(this, FS.html(this)+'<b></b>');
            }
            // 将尺码节点上sizeid的值设置为隐藏input的value
			FS.query("#sizeid").value = sizeid;
			
			//更新select_num
			setSelect();

            FS.styledSelect({
                selectSelector :　'#select_num',
                liClass : 'liClass',
                divClass : 'divClass',
                liHover : 'liHover',
                liSelected : 'liSelected'
            });
            
            // 如果库存数量小于等于隐藏input中设置的数量，显示库存紧张
            var jinzhang_num = parseInt(FS.query('#jinzhang_num').value);
            if(o.getAttribute('num') <= jinzhang_num){
                FS.show(FS.query('.jinzhang'));
            }else{
                FS.hide(FS.query('.jinzhang'));
            }
        })
    });

    /* 弹出用户注册弹窗 */
    if(FS.query('#reg_alert') != null) {
        FS.popUp({
            eventTarget: '.addcart_btn',
            popUpId: '#reg_alert',
            closeId: '#close_reg',
            maskId : '#maskid',
            maskOpacity : '0.8',
            moveAble: true,
            timeToOut: 80000,
            clickToOut: true,
            fixed: false
        })
    }

    /* 当文本框获得焦点，提示文字隐藏，失去焦点，提示文字出现 */
    FS.toogleText('.orderInput');

    /* 看看我的尺码 弹窗 */
    var size_alert = FS.query('#size_alert');
    if(size_alert != null) {
        var widthFun = function(){
            // 根据图片宽度，动态设置弹出层的宽度
            var sizeImg = FS.query('.see_size', FS.query('#size_alert')),
            imgWidth = sizeImg.offsetWidth;
            FS.setCss(size_alert, {width: imgWidth + 'px'});
        }
        FS.popUp({
            eventTarget: '#refer_size',
            popUpId: '#size_alert',
            closeId: '#close_size',
            moveAble: true,
            clickToOut: true,
            fixed: false,
            targetFun: widthFun
        })
    }
    
}());