/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 可滑动图片tab，并且tab的内容显示在同一个div容器中
 */

FS.extend(FS, function () {
    /**
     * @description slideTab 可滑动图片tab，并且tab的内容显示在同一个div容器中
     * @param {Object} options 参数对象
     *
     * @param {String} options.tabParent tab项的父节点的选择器 tabParent跟tabSelector之间必须传一个
     * @param {String} options.tabSelector tab项的选择器，用户找出tab节点数组，当没有传入tabParent时使用。
     * @param {String} options.contentParent tab项对应的内容div的选择器,可选项
     * @param {String} options.active 激活状态下tab项的class样式 可选项
     * @param {String} [options.smallEventType='click'] tab的事件类型，默认是click
     * @param {String} [options.mediumAttr='bsrc'] tab中的小图对应的放置中等大小图片的src的自定义属性
     * @param {String} [options.bigAttr='zsrc'] tab中的小图对应的放置大图片的src的自定义属性
     * @param {String} options.upPic 点击即往上滑动的节点的id选择器
     * @param {String} options.downPic 点击即往下滑动的节点的id选择器
     * @param {String} options.upNormal upPic节点正常情况下的class样式
     * @param {String} options.upHover upPic节点高亮情况下的class样式
     * @param {String} options.downNormal upPic节点正常情况下的class样式
     * @param {String} options.downHover upPic节点高亮情况下的class样式
     * @param {Number} [options.showNum=4] 展现出来的图片数量，默认为4
     * @param {Number} [options.moveNum=1] 一次性滑动的数量，默认为1
     * @param {Boolean} [options.mediumFade=false] 中等大小的图片是否需要缓入，如果undefined，则自然默认为否
     */

    var slideImgTab = function (options) {
        // tabList 所有tab组成的数组
        // length tab的个数
        if(options.tabParent != null){
            var tabList = FS.getChildNodes(FS.query(options.tabParent))
        }else{
            var tabList = FS(options.tabSelector);
        }
        var length = tabList.length,
            contentParent = FS.query(options.contentParent || null),
            activeClass = options.active,
            upPic = FS.query(options.upPic),
            downPic = FS.query(options.downPic),
            upNormal = options.upNormal || '',
            upHover = options.upHover || '',
            downNormal = options.downNormal || '',
            downHover = options.downHover || '',
            mediumAttr = options.mediumAttr || 'bsrc',
            bigAttr = options.bigAttr || 'zsrc',
            showNum = options.showNum || 4,
            moveNum = options.moveNum > showNum ? showNum : options.moveNum || 1,
            mediumFade = options.mediumFade,
            smallEventType = options.smallEventType || 'click';

        //默认第一次加载隐藏上箭头
        FS.setClass(upPic, upNormal);

        // 顺序遍历tab，跟tab添加点击事件，并根据tab的数量设置相关节点的状态
        for (var i = 0; i < length; i++) {
            // 给小图绑定事件
            if(contentParent != null){
                FS.addEvent(tabList[i], smallEventType, smallFun);
            }

            //超出showNum部分隐藏 
            if (i + 1 > showNum) {
                FS.setClass(downPic, downHover);
                //超过4张就隐藏
                FS.hide(tabList[i]);
            } else {
                //显示个数的范围内张内就显示
                FS.show(tabList[i]);
            }
        }

        //当少于4张图是则不显示下箭头
        if (length <= showNum) {
            FS.setClass(downPic, downNormal);
        }

        if (length > showNum) {
            FS.addEvent(upPic, 'click', function (e) {
                // 如果当前节点是高亮状态，则相应点击事件
                if (FS.hasClass(this, upHover)) {
                    clickFun('up')
                }
                return;
            });
            FS.addEvent(downPic, 'click', function () {
                // 如果当前节点是高亮状态，则相应点击事件
                if (FS.hasClass(this, downHover)) {
                    clickFun('down')
                }
                return;
            });
        }

        //点击每一张小图片的动作
        function smallFun() {
            // 如果存在高亮状态的class样式，当前节点不是高亮显示的节点
            if (!FS.hasClass(this, activeClass)) {
                if(activeClass != null){
                    // 则让高亮的节点灭掉，当前节点高亮
                    FS.removeClass(FS.query('.' + activeClass), activeClass);
                    FS.addClass(this, activeClass);
                }

                // imgObj 当前tab下的img对象
                // mediumUrl 中等大小图片的url
                // bigUrl 大图的url
                var imgObj = this.getElementsByTagName('img')[0],
                    mediumUrl = imgObj.getAttribute(mediumAttr),
                    bigUrl = imgObj.getAttribute(bigAttr);

                // mediumImg 内容展示容器内img对象
                var mediumImg = contentParent.getElementsByTagName('img')[0];
                mediumImg.setAttribute('src', mediumUrl);
                if (mediumFade) {
                    //让图片渐现
                    FS.fadeIn(mediumImg, 0.5, 1.0, 200);
                }
                mediumImg.setAttribute(bigAttr, bigUrl);
            }
            return;
        }

        // 滚动到上一张或下一张

        function clickFun(directions) {
            var showPics = [];
            // 顺序遍历所有的tab，如果计算出该tab的display属性不为'none'，则将其放入showPics数组中
            for (var i = 0; i < length; i++) {
                if (FS.getStyle(tabList[i], 'display') !== 'none') {
                    showPics.push(tabList[i]);
                }
            }
            // 如果是点击向下
            if (directions === 'down') {
                // 算出showPics的最后一项是位于tabList的什么位置
                var indexList = tabList.indexOf(showPics[showNum - 1]);
                // 如果indexList后剩余的项数少于moveNum，则隐藏showPics的第前moveNum项，显示tabList数组后moveNum项            
                if (indexList + 1 < length) {
                    // 如果indexList+1项是最后一项，则将向下箭头置为normal状态
                    if (indexList + moveNum >= length - 1) {
                        FS.setClass(downPic, downNormal);
                    }
                    // 找出需隐藏掉的tab数组
                    var hideDownArr = showPics.splice(0, moveNum);
                    // 找出需显示的tab数组
                    var showDownArr = tabList.slice(indexList+1, indexList+1+moveNum);

                    // 隐藏当前显示的前moveNum项，显示indexList后的moveNum项
                    FS.hide(hideDownArr);
                    FS.show(showDownArr);

                    // 让向上的箭头高亮
                    FS.setClass(upPic, upHover);
                }
            }
            // 如果是点击向上
            if (directions === 'up') {
                // showPics中的第一项在tabList中的位置
                var indexList = tabList.indexOf(showPics[0]);
                // 如果showPics中的第一项不是tabList中的第一项
                // 则显示indexList的前moveNum项,隐藏indexList的后moveNum项
                if (indexList > 0) {
                    var showUpArr = indexList+1 <= moveNum ? tabList.slice(0, moveNum+1) : tabList.slice(indexList-moveNum, indexList+1);
                    var hideUpArr = showPics.splice(showNum-moveNum, moveNum);
                    FS.show(showUpArr);
                    FS.hide(hideUpArr);

                    // 让向上的箭头高亮
                    FS.setClass(downPic, downHover);

                    // 假如再往前一项是tabList中的第一项，则向上滑动变灰
                    if (indexList - moveNum <= 0) {
                        FS.setClass(upPic, upNormal);
                    }
                }
            }
            // 将showPics队列销毁
            showPics = null;
        }
    };

    return {
        slideImgTab: slideImgTab
    }
}());