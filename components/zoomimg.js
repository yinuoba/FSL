/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 鼠标移至图片上，出现放大镜效果
 */

FS.extend(FS, function () {
    /**
     * @description 鼠标移至图片上，出现放大镜效果
     * @param {Object} options 参数对象
     * @param {String|Element} options.mediumImg 中等大小的图片节点的选择器或节点本身
     * @param {Number} [options.mediumWidth] 中等大小图片的宽度
     * @param {Number} [options.mediumHeight] 中等大小图片的高度
     * @param {Number} [options.bigDivWidth] 大图容器的宽度，默认是中等图片的宽度
     * @param {Number} [options.bigDivHeight] 大图的高度，默认是中等图片的高度
     * @param {Number} [options.offsetLeft=10] 大图容器离中等图片的距离，默认为10
     * @param {String} [options.attr='zoomsrc'] 存储大图片路径的自定义属性，该自定义属性写在中等大小图片节点上，默认为'zoomsrc'
     * @param {Number} [options.pupWidth] 包围鼠标那个透明层的宽度
     * @param {Number} [options.pupHeight] 包围鼠标那个透明层的高度
     * @param {Number} options.bigWidth 大图的宽度
     * @param {Number} options.bigHeight 大图的高度
     * @param {String} [options.bigClass = ''] 大图的class样式
     * @example
     * FS.zoomImg({
            mediumImg: FS.query('#mediumImg'),
            bigImg: '#bigZoom',
            mediumWidth: 342,
            mediumHeight: 455,
            bigWidth: 1800,
            bigHeight: 2400,
            bigClass: 'bigImg'
        });
     */

    var zoomImg = function (options) {
        // mediumImg 中等大小的图片选择器
        // mediumDiv 放中等大小图片的div容器
        var mediumImg = FS.query(options.mediumImg),
            mediumDiv = mediumImg.parentNode;

        //防止行内元素获取到不准确的offsetWidth、offsetHeight、offsetLeft、offsetTop
        FS.setCss([mediumImg, mediumDiv], {
            display: 'block'
        });

        // bigImgId 鼠标放上去后，展现大图的容器的id
        // mediumWidth 中等大小图片的宽度
        // mediumHeight 中等大小图片的高度
        // mediumLeft 中等大小图片离浏览器左侧的距离
        // mediumTop 中等大小图片离浏览器顶部的距离
        // bigDivWidth 大图容器的宽度，默认是中等图片的高度
        // bigDivHeight 大图的高度，默认是中等图片的高度
        // offsetLeft 大图容器离中等图片的距离，默认为10
        // attr 存储大图片路径的自定义属性，该自定义属性写在中等大小图片节点上
        // pupWidth 包围鼠标那个透明层的宽度
        // pupHeight 包围鼠标那个透明层的高度

        var bigImgId = options.bigImg.slice(1),
            mediumWidth = options.mediumWidth || mediumImg.offsetWidth,
            mediumHeight = options.mediumHeight || mediumImg.offsetHeight,
            attr = options.attr || 'zoomsrc',
            bigSrc = mediumImg.getAttribute(attr),
            bigDivWidth = options.bigDivWidth || mediumHeight,
            bigDivHeight = options.bigDivHeight || mediumHeight,
            offsetLeft = options.offsetLeft || 10,
            pupWidth = options.pupWidth,
            pupHeight = options.pupHeight,
            bigClass = options.bigClass || '';

        // 中等大小图片距离浏览器左侧的距离
        var mediumLeft = FS.getOffset(mediumImg, 'left'),
            mediumTop = FS.getOffset(mediumImg);

        // bigLeft 计算大图容器离浏览器左侧和顶部的距离
        var bigLeft = mediumLeft + mediumWidth + offsetLeft,
            bigTop = mediumTop;

        // 创建大图容器和大图
        // 一执行zoomImg方法则创建大图容器和大图，以避免鼠标放上去要等好久大图才出来的情况
        if(FS.query('#'+ bigImgId + 'Div') == null){
            var zoomImageDiv = document.createElement('div');
            zoomImageDiv.id = bigImgId + 'Div';
            zoomImageDiv.innerHTML = "<img class="+bigClass+" id="+bigImgId+" src='"+bigSrc+"'/>";

            // 定义大图容器的style对象
            var bigStyle = {
                position: 'absolute',
                left: bigLeft + 'px',
                top: bigTop + 'px',
                width: bigDivWidth + 'px',
                height: bigDivHeight + 'px',
                visibility: 'hidden',
                overflow: 'hidden',
                zIndex: '999'
            };
            FS.setCss(zoomImageDiv, bigStyle);
            document.body.appendChild(zoomImageDiv);
        }

        // 如果发生了resize事件，浏览器窗口大小发生了变化，则重新计算里浏览器左侧的距离
        FS.addEvent(window, 'resize', function(){
            // 重新计算中等大小图片离窗口左侧的距离
            mediumLeft = FS.getOffset(mediumImg, 'left');
            mediumTop = FS.getOffset(mediumImg);

            // bigLeft 计算大图容器离浏览器左侧和顶部的距离
            var bigLeft = mediumLeft + mediumWidth + offsetLeft,
                bigTop = mediumTop;

            // 重新将新的left、top设置给大图
            FS.setCss(zoomImageDiv, { left: bigLeft + 'px', top: bigTop + 'px'});
        });

        FS.addEvent(mediumDiv, 'mouseenter', function (e) {
            // 获取最新的bigSrc,因为有可能中等大小的图片已经被切换过，并将其设置为大图的src
            var zoomImageDiv = FS('#' + bigImgId + 'Div')[0],
                bigSrc = mediumImg.getAttribute(attr);
            zoomImageDiv.innerHTML = "<img class='"+bigClass+"' id="+bigImgId+" src='"+bigSrc+"'/>";

            // 注释这一段，防止大图被请求两遍
            // FS.query('#' + bigImgId).setAttribute('src', bigSrc);

            // zoomimg 大图
            // bigWidth 大图的宽度
            // bigHeight 大图的高度
            // scaleX 大图跟中等图的宽度比
            // scaleY 大图跟中等图的高度比
            var zoomimg = FS.query('#' + bigImgId);
            zoomimg.display = 'block';
            
            var bigWidth = options.bigWidth || zoomimg.offsetWidth,
                bigHeight = options.bigHeight || zoomimg.offsetHeight;
            // 防止大图没有加载完
            if(!bigWidth || !bigHeight){
                setTimeout(arguments.callee,50);
            }else{
                var scaleX = bigWidth / mediumWidth,
                scaleY = bigHeight / mediumHeight;

                // 如果鼠标周围的透明层还未创建
                if (FS('#' + bigImgId + 'Pup')[0] == null) {
                    var zoomPup = document.createElement('div');
                    zoomPup.id = bigImgId + 'Pup';
                    mediumDiv.appendChild(zoomPup);
                    //如果没有设置pupWidth和pupHeight，则将大图div容器与scaleX之比设为包围鼠标透明层的宽高。
                    if (pupWidth == null) {
                        pupWidth = Math.floor(bigDivWidth / scaleX);
                    }
                    if (pupHeight == null) {
                        pupHeight = Math.floor(bigDivHeight / scaleY);
                    }
                    // 定义包围鼠标透明层的style
                    var pupStyle = {
                        width: pupWidth + 'px',
                        height: pupHeight + 'px',
                        background: '#fff',
                        border: '1px solid #AAA',
                        position: 'absolute',
                        top: 0,
                        visibility: 'hidden',
                        cursor: 'move'
                    }
                    FS.setCss(zoomPup, pupStyle);
                    FS.opacity(zoomPup, 0.5);
                }

                // 如果包围鼠标那一层已经存在了，则直接获取该节点
                var zoomPup = FS('#' + bigImgId + 'Pup')[0];

                // mouseenter 右侧大图显示
                FS.setCss([zoomImageDiv, zoomPup], {
                    visibility: 'visible'
                });

                // 显示大图
                showBig(e);

                FS.addEvent(document.body, 'mousemove', showBig);

                // 如果是IE6并且页面中存在select下拉框，隐藏页面中所有的select
                FS.hideSelect();
            }            

            // 设置包围鼠标透明层的位置，并设置图片所在div的scrollTop、scrollLeft，让图片显示
            function showBig(e) {
                // 鼠标相对页面的位置，校正，让其兼容各个浏览器
                var e = FS.fixMousePos(e),
                    mouseX = e.pageX,
                    mouseY = e.pageY;

                // 包围鼠标层相对中等大小图片的位置
                var posX = mouseX - mediumLeft - pupWidth / 2,
                    posY = mouseY - mediumTop - pupHeight / 2;

                // 判断包围鼠标透明层的位置，把它控制在图片内
                posX = (mouseX - pupWidth / 2 < mediumLeft) ? 0 : (mouseX + pupWidth / 2 > mediumWidth + mediumLeft) ? (mediumWidth - pupWidth) : posX;
                posY = (mouseY - pupHeight / 2 < mediumTop) ? 0 : (mouseY + pupHeight / 2 > mediumHeight + mediumTop) ? (mediumHeight - pupHeight) : posY;

                // 调整大图的相对位置
                var bigImgX = posX * scaleX,
                    bigImgY = posY * scaleY;

                // 定义包围鼠标透明层的style
                var pupStyle = {
                    left: posX + 'px',
                    top: posY + 'px'
                }
                FS.setCss(zoomPup, pupStyle);

                //设置大图的相对位置
                zoomImageDiv.scrollTop = bigImgY;
                zoomImageDiv.scrollLeft = bigImgX;

                e.preventDefault();
                e.stopPropagation();
            }
        });

        FS.addEvent(mediumDiv, 'mouseleave', function (e) {
            // mouseleave时，获取存放大图的div容器和包围鼠标的div节点
            var zoomImageDiv = FS('#' + bigImgId + 'Div')[0],
                zoomPup = FS('#' + bigImgId + 'Pup')[0];

            if(zoomImageDiv){
                zoomImageDiv.innerHTML = '';
                FS.setCss(zoomImageDiv, {
                    visibility: 'hidden'
                });
            }
            if(zoomPup){
                FS.setCss(zoomPup, {
                    visibility: 'hidden'
                });
            }            
            // 如果是IE6并且页面中存在select下拉框，显示页面中所有的select
            FS.showSelect();
        })
    };

    return {
        zoomImg: zoomImg
    }
}());