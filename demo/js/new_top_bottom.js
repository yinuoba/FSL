( function() {
    /*申明全局域名*/
    var web_host = location.href.substring(0,location.href.indexOf(".cn") + 3);
    
    /*让IE6缓存背景图片*/
    FS.ieCache();
    
    /*头部公告 一旦关闭,在cookie存在的情况下,一个自然日内不出现*/
    FS.addEvent(FS('#closeMsgLine')[0], 'click', function() {
        var nextDay = FS.getDateStr(1) + " 00:00:00";
        nextDayTime = new Date(nextDay);
        FS.slide(FS('#mainTopBoxMsg')[0], 'height', 25, 0, 500);
        FS.setCookie('displayNotice', '1', nextDayTime);
    });
    /*顶部添加收藏 兼容多个浏览器*/
    FS.addEvent(FS('#store_fclub')[0], 'click', function() {
        FS.addFavorite();
    });
    /*头部 导航*/
    if(FS.query('#menuBoxUl') !== null) {
        FS.nav({
            activeTab : 'menuBoxOn',
            activeDiv : 'now',
            parentNode : '#menuBoxUl'
        });
    }

    /*返回顶部  添加收藏*/
    ( function() {
        /**
         * 判空 因为只有首页、列表页、商品详情页有返回顶部这一块
         */
        var toTop = FS.query('#totop') ? FS.query('#totop') : null;
        if(toTop != null) {
            /**
             * 返回顶部
             */
            FS.goTop({
                node: FS('#totop')[0],
                toTop: FS.query('.gotop'),
                nodeHeight:278
            });

            /*浮动处添加收藏 兼容多个浏览器*/
            FS.addEvent(FS('.totop_collect')[0], 'click', function() {
                FS.addFavorite('http://www.fclub.cn', '聚尚网-中国首家国际名品限时特卖购物网');
            });
        }
    }());
    /**
     * 头部 购物车
     * 当两次请求时间差在5s以内,调用上一次的结果,避免多次请求.
     */
    FS.hover(FS('#cartInfo')[0], function() {
        FS.html(FS('#mainCartBoxNull')[0], '<font color="white">正在载入您的购物车数据</font>');
        FS.show(FS('#mainCartBoxNull')[0]);
        FS.ajax({
            method: 'POST',
            url: '/flow.html?step=get_cart_content_json&rand=' + parseInt(Math.random()*1000),
            async: true,
            success: function(data) {
                FS.html(FS('#mainCartBox')[0], '');
                var DataObj = FS.parseJson(data);
                var goodsCount = DataObj.total.goods_count;
                if( goodsCount > 0 )
                {
                    var html = "<ul>";
                    FS.forEach(DataObj.goods_list, function(item, i) {
                        var isPackage = false;
                        if(parseInt(item.package_id) > 0) {
                            isPackage = true;
                            var imgSrc = image_server_url + '/' + item.package_image + "_teeny.jpg";
                            var id = item.package_id;
                            var num = '&nbsp;x1';
                            var name = item.package_name.substring(0,10) + "...";
                            var price = '￥' + item.package_real_amount + '元';
                            var link_url = web_host + "/package-" + id + '.html';
                        } else {
                            var imgSrc = item.goods_thumb;
                            var id = item.goods_id;
                            var num = '&nbsp;x' + item.goods_number;
                            var price= '￥' + item.goods_price+'元';
                            var color_name = item.color_name;
                            var size_name = item.size_name;
                            var name = item.goods_name.substring(0,10) + "...";
                            var link_url = web_host + "/goods-" + id + '-' + item.color_id + '.html';
                        }
                        html += '<li><a href="' + link_url + '" target="_blank" class="main_fLeft main_mR10"><img src="' + imgSrc + '" alt=""  /></a>' +
                            '<a href="' + link_url + '" target="_blank" class="black main_fLeft" title="">' + name + '<br /><span>【' + color_name + '】</span>' +
                            '&nbsp;<span>【' + size_name + '】</span></a><span class="red main_fRight main_mR10">' + price + num + '</span></li>';
                    });
                    var totalHtml = '<li id="cartTotalBox"><p class="main_black">共有<strong class="main_red font14">' + DataObj.total.goods_count + '</strong>件商品&nbsp;&nbsp;' +
                        '总价格:<strong class="main_red font14">' + DataObj.total.formated_goods_amount + '</strong></p>' +
                        '<a href="'+ web_host + '/flow.php' + '" class="main_btnRed4 main_fRight" target="_self">立即结算</a></li>';
                    totalHtml += "</ul>";
                    FS.hide(FS('#mainCartBoxNull')[0]);
                    FS.show(FS('#mainCartBox')[0]);
                    FS.html(FS.getChildNodes(FS("#cartInfo")[0])[0], '购物车(' + DataObj.total.goods_count + ')');
                    lastRequestRs = FS('#mainCartBox')[0].innerHTML = html + totalHtml;
                } else {
                    FS.html(FS('#mainCartBoxNull')[0], '<span class="main_white_normal">购物车中还没有商品，赶紧选购吧！</span>');
                    FS.html(FS.getChildNodes(FS("#cartInfo")[0])[0], '购物车(0)');
                    FS.hide(FS('#mainCartBox')[0]);
                    FS.show(FS('#mainCartBoxNull')[0]);

                }
            }
        });
        }, function() {
            FS.hide(FS('#mainCartBox')[0], FS('#mainCartBoxNull')[0]);
        }
    );
    
    /* 头部购物车数量更新 */
    FS.ready(function(){
        FS.ajax({
            method: 'get',
            url: '/flow.html?step=getCartInfo&rand=' + parseInt(Math.random()*1000),
            async: true,
            success: function( result )
            {
                if(result > 0)
                {
                    FS.html(FS.getChildNodes(FS("#cartInfo")[0])[0], '购物车(' + result + ')');
                }
            }
        })
    })
    
    /*头部 在线客服*/
    FS.hover(FS('#seviceOnlineBox')[0], function() {
        FS.toggleDisplay(FS('#seviceBar')[0], 'block');
    }, function() {
        FS.toggleDisplay(FS('#seviceBar')[0], 'block');
    }
    );

    /*底部订阅邮件 当文本框获得焦点，提示文字隐藏，失去焦点，提示文字出现*/
    if(FS.query('#msgOrderInputBoxText') !== null && FS.query('.orderInput') !== null && FS.query('.cancelOrderInput') !== null) {
        FS.toogleText('#msgOrderInputBoxText, .orderInput, .cancelOrderInput');
    }

    /*底部订阅信息 ajax方法*/
    FS.addEvent(FS('#msgOrderInputBoxBtn')[0], 'click', function() {
        var inputText = FS('#msgOrderInputBoxText')[0].value;
        if(inputText.isMobile() || inputText.isEmail()) {
            var params = '&rush_id=' + '-1';
            if( inputText != '' && inputText.indexOf('@')==-1 )
                params+='&notice_type_mobile=mobile&mobile='+inputText;
            if( inputText != '' && inputText.indexOf('@')!=-1 )
                params+='&notice_type_email=email&email='+inputText;
            FS.ajax({
                method: 'POST',
                url: web_host + "/rushlist.php?act=rushNotice" + params,
                async: true,
                success: function (result) {
                    if( result > 0 && result < 6 )
                    {
                        FS.successPropTips({
                            title : '订阅成功',
                            msg : '成功订阅每日限抢信息！',
                            tip : '温馨提示：您已经成功订阅了开场通知，我们将在活动开场前通知您。',
                            className : 'mainIconMsg'
                        });
                    }else if( result == 6)
                    {
                        FS.successPropTips({
                            title : '订阅成功',
                            msg : '成功订阅每日限抢信息！',
                            tip : '温馨提示：您已经成功订阅了开场通知，无须重复订阅。',
                            className : 'mainIconMsg'
                        });
                    }else{
                        FS.successPropTips({
                            title : '订阅失败',
                            msg : '请在线咨询客服人员。',
                            tip : '',
                            className : 'mainIconMsgWarm'
                        });
                    }
                }
            });
        } else {
            FS.successPropTips({
                title : '提示',
                msg : '请输入正确的手机号或者邮箱地址!',
                tip : '',
                className : 'mainIconMsgWarm'
            });
            return false;
        }
    });
    
    /*底部取消订阅信息 ajax方法*/
    FS.addEvent(FS('#mainBtnCancel')[0], 'click', function() {
        var textMobile = FS('.cancelOrderInput')[0].value;
        var textEmail = FS('.cancelOrderInput')[1].value;
        var isEmail = true;
        var isMobile = true;
        if(textEmail.isEmail() == false && textEmail != "请输入您的邮箱")
        {
             isEmail = false;
        }
        if(textMobile.isMobile() == false && textMobile != "请输入手机号码")
        {
            isMobile = false;
        }
        if(isMobile == false && isEmail == false)
        {
            FS.successPropTips({
                title : '提示',
                msg : '请输入正确的手机号或邮箱地址!',
                tip : '',
                className : 'mainIconMsgWarm'
            });
            return false;
        }
        if(isMobile == false)
        {
            FS.successPropTips({
                title : '提示',
                msg : '请输入正确的手机号!',
                tip : '',
                className : 'mainIconMsgWarm'
            });
            return false;
        }
        if(isEmail == false)
        {
            FS.successPropTips({
                title : '提示',
                msg : '请输入正确的邮箱地址!',
                tip : '',
                className : 'mainIconMsgWarm'
            });
            return false;
        }
        var params = '&rush_id=' + '-1';
        if( textMobile != '' && textEmail.indexOf("@") == -1)
        {
            params += '&notice_type_mobile=mobile&mobile=' + textMobile;
        }
        if( textEmail != '' && textEmail.indexOf("@") != -1 ) 
        {
            params += '&notice_type_email=email&email=' + textEmail;
        }
        FS.ajax({
            method: 'POST',
            url: web_host + "/rushlist.php?act=channelrushNotice" + params,
            async: true,
            success: function (result) {
                FS.successPropTips({
                    title : '取消订阅',
                    msg : '成功取消订阅！',
                    tip : '温馨提示：如果需要重新订阅请在订阅处留下手机或邮箱。',
                    className : 'mainIconMsg'
                });
            }
        });
    });
    /*关闭弹出层*/
    FS.addEvent(FS.query("#closeMainSucMsgWindow"), 'click', function() {
        FS.hide(FS('#orderMainSucMsg')[0]);
        var bool = FS.getStyle(FS('#maskid')[0], 'display');
        if( bool !== 'none')
            FS.hide(FS('#maskid')[0]);
    });
    /*点击取消订阅 弹出弹窗*/
    if(FS.query('#order_msg') !== null && FS.query('#order_cancel') !== null) {
        FS.popUp({
            eventTarget : '#order_cancel',
            popUpId : '#order_msg',
            popUpWidth : 420,
            popUpHeight : 310,
            closeId : '#closeMainWindow',
            maskId : '#maskid',
            maskOpacity : '0.8'
        });
    }
    
    /* 请求站内信 */
    FS.ready(function(){
        var _user_id = FS.getCookie('ECS[user_id]');
        if(typeof _user_id == "string" && FS(".main_red_normal")[0] !== undefined)
        {
            var _AjaxURL = "/webservice.php?at=userMsg&st=getUnRead";
            FS.ajax({
                method: "get",
                url: web_host + _AjaxURL,
                async: true,
                success: function( result ){
                    var DataObj = FS.parseJson( result );
                    if(DataObj.err == 0)
                    {
                        if(DataObj.msgCount!=0)
                        {
                            FS(".main_red_normal")[0].innerHTML = "(" + DataObj.msgCount + ")";
                        }
                    }
                }
            })
        }
    })
    
}())