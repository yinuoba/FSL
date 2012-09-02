(function(){
    /* 图片延时加载 */
    FS.fsLoadImg({
        attr : 'fslazy',
        height : 200
    });

    /* 品牌倒计时 */
    FS.countDown({
        tian: '#tian',
        shi: '#shi',
        fen: '#fen',
        toDate: new Date('2012/07/30 23:59:59')
    });

	/* rush页面图片hover效果 */
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
            })
        })
    }

    /* 选择品类 */
    (function(){
        // 一级菜单
        
        // 找出所有的一级菜单
        var firstItems = FS('.bytype');
        if(firstItems[0] != null){
            firstItems.each(function(i,j){
                var selectObj = FS.getChildNodes(i)[0],
                    selectDiv = FS.getChildNodes(i)[1];

                // 鼠标移到一级菜单上，展示下拉块，鼠标移走，隐藏下拉块
                FS.hover(i, function(){
                    // 选择品类select上的文字
                    var selectValue = FS.html(FS.query('#select_type')).trimAll();
                    // 当放到选择尺码上时，如果未选择品类，则弹出选择品类提示下拉框
                    if(j==1 && selectValue == '选择品类'){
                        // 请先选择品类
                        var typeFirst = FS.getChildNodes(i)[2];
                        FS.addClass(selectObj, 'select_hover');
                        FS.show(typeFirst);
                        return;
                    }
                    FS.addClass(selectObj, 'select_hover');                
                    FS.show(selectDiv);
                }, function(){
                    // 选择品类select上的文字
                    var selectValue = FS.html(FS.query('#select_type')).trimAll();
                    // 当放到选择尺码上时，如果未选择品类，则弹出选择品类提示下拉框
                    // 鼠标移开，隐藏选择品类提示下拉框
                    if(j==1 && selectValue == '选择品类'){
                        // 请先选择品类
                        var typeFirst = FS.getChildNodes(i)[2];
                        FS.removeClass(selectObj, 'select_hover');
                        FS.hide(typeFirst);
                        return;
                    }
                    FS.removeClass(selectObj, 'select_hover');
                    FS.hide(selectDiv);
                })
            })
        }

        // 切换一级分类
        FS.tab({
            divActive : 'menunow',
            active : 'hover_menu',
            tabParent : '#first_menu',
            contentParent : '#sec_menu'
        });

        // 找出所有二级分类
        var menuItems = FS('li', FS.query('.sec_menu'));
        // 当鼠标放到二级分类上，打开三级分类，鼠标移走，关闭三级分类
        menuItems.each(function(o){
            // 鼠标移到li上的hover事件
            FS.hover(o, function(){
                FS.addClass(this, 'hover_sec');
                // 找到当前li下的div节点
                var subDiv = FS.getChildNodes(this)[1],
                subHeight = subDiv.offsetHeight,
                perIndex = 1,
                divTop;

                // 找出当前li节点的ul父节点，并计算出当前li节点在父节点ul中的索引
                var itemsUl = o.parentNode;
                var nowItems = FS.getChildNodes(itemsUl),
                itemsLength = nowItems.length,
                nowIndex = nowItems.indexOf(o);
                
                // 如果是第一项，则top设为-1
                if(nowIndex == 0){
                    perIndex = 0;
                    divTop = -1;
                }else{
                    perIndex = nowIndex / (itemsLength - 1);
                    divTop = -(subHeight - 29) * perIndex + 1;
                }
                FS.setCss(subDiv, { top: divTop + 'px'});

                // 如果弹出的三级菜单比较高，则动态设置li的父节点ul的高度
                // 计算当前li离ul底部的距离
                var parentHeight = itemsLength*31;
                var parentSubHeight = (itemsLength - nowIndex)*31;

                // 计算弹出的三级div中，除去超出当前li顶部高度部分还剩下的高度
                var subLiHeight = subHeight + divTop;

                // 计算subLiHeight和parentSubHeight的高度差
                var extraHeight = subLiHeight - parentSubHeight;
                // 如果弹出部分超出了ul的底部，则动态设置ul的高度
                if(extraHeight>0){
                    FS.setCss(itemsUl, {height: parentHeight + extraHeight + 'px'});
                }else{
                    FS.setCss(itemsUl, {height: parentHeight + 'px'});
                }
            },function(){
                FS.removeClass(this, 'hover_sec');
                // 找出当前li节点的ul父节点，并计算出当前li节点在父节点ul中的索引
                var itemsUl = o.parentNode;
                var nowItems = FS.getChildNodes(itemsUl),
                    itemsLength = nowItems.length,
                    parentHeight = itemsLength*31;
                // 鼠标离开，重新设置ul的高度
                FS.setCss(itemsUl, {height: parentHeight + 'px'});
            })
        })
    }());

    /* 点击下次开售通知我 弹出弹窗 */
    FS.popUp({
        eventTarget : '.off_notice',
        popUpId : '#start_alert',
        popUpWidth : 406,
        popUpHeight : 310,
        closeId : '#close_alert',
        maskId : '#maskid',
        maskOpacity : '0.8',
        targetId : 'rid',
        popHiddenId : '#notice_rushoff_id'
    });

    /*当文本框获得焦点，提示文字隐藏，失去焦点，提示文字出现*/
    FS.toogleText('.orderInput');

    /* 品牌故事 滑动tab */
    FS.slideImgTab({
        tabSelector: '.play_center',
        upPic: '.prev_brand',
        downPic: '.next_brand',
        upNormal: 'prev_brand_normal',
        upHover: 'prev_brand',
        downNormal: 'next_brand_normal',
        downHover: 'next_brand',
        showNum: 1
    });
}());