/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 图片轮播，从任意序号跳转到任意序号，都只有一次滚动,不过会切换方向。如，从1到3，只需向左滚动一步；从4到1，向右滚动1步。
 */

FS.extend(FS, function () {
    /**
     * @description 图片轮播，从任意序号跳转到任意序号，都只有一次滚动,不过会切换方向。如，从1到3，只需向左滚动一步；从4到1，向右滚动1步。
     * @param elem  滚动图片所在li的父节点
     * @param how 切换效果。0(默认)淡入淡出，1滚动; how与direct搭配使用.
     * @param direct 方向，值为0时向左，为1时向1上，默认为0.在how参数不为0时有效；how与direct搭配使用.
     * @param delay 自动滚动间隔时间。默认为4000
     * @param step 滚动步长。当滚动方向是水平时，step会默认为slider元素的offsetWidth；当滚动方向是垂直时，则默认为高度。当然，也可以自己设置
     * @param pager 值是一个元素的id选择符,指定slider的页码翻页元素。指定后会为此标签的第一层子元素添加跳转函数
     * @param numClass 激活状态下数字图标的class样式
     * @example FS.playScroll('#play_list',{direct:1, how:1, pager:'#play_focus', numClass:'active_num', step:320});
     */
    var playScroll = function (elm, option) {
        return new playScroll.main(elm, option);
    };

    function Bind(object, fun) {
        var args = Array.prototype.slice.call(arguments).slice(2);
        return function () {
            return fun.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        }
    };

    playScroll.main = function (elm, option) {
        this.slider = FS.query(elm);
        this.items = this.slider.children;
        this.count = this.items.length;
        // 初始化各个参数
        this.reset(option);
        this.how = this.defaults.how;
        this.delay = this.defaults.delay;
        this.ing = 35;

        var drt = this.defaults.direct;
        this.direct = ['left', 'top'][drt % 2];
        this.step = this.defaults.step || (drt % 2 ? this.slider.offsetHeight : this.slider.offsetWidth);
        this.speed = 13;
        this.tween = this.defaults.Tween;
        this.auto = this.defaults.auto; 
        // 页码翻页功能
        this.pager = FS.query(this.defaults.pager);
        this.event = this.defaults.event;
        this.pause = this.defaults.pause;
        this.next = this.now = this._time = 0;

        this.pos = {};
        this.init();
    }
    playScroll.prototype = {
        init: function () {
            var len = this.count,
                root = this;
            var posi = (root.how == 0) ? "position:absolute;" : '',
                fl = (root.direct == 'left') ? "float:left;" : "",
                width = (root.direct == 'left') ? ('width:' + 2 * root.step + 'px') : null,
                css = fl + "display:none; z-index:5;" + posi;
            while (len-- > 0) {
                this.items[len].style.cssText = css;
            }

            this.slider.style.cssText = 'position:absolute;left:0;top:0;' + width;
            FS.setCss(this.slider.parentNode, {
                position: 'relative',
                overflow: 'hidden'
            });
            FS.setCss(this.items[0], {
                zIndex: 10,
                display: 'block'
            });
            this.auto && (this.timer = setTimeout(Bind(this, this.Next), this.delay));
            if (this.pause) {
                FS.addEvent(this.slider, 'mouseout', function () {
                    root.Continue();
                });
                FS.addEvent(this.slider, 'mouseover', function () {
                    root.Pause();
                });
            }
            this.pager && this.Pager();
            this.Hower = this.How();
        },
        reset: function (ops) {
            this.defaults = {
                how: 0,
                direct: 0,
                delay: 4000,
                auto: true,
                pause: true,
                event: 'mouseover',
                Tween: FS.easeOut
            }
            FS.extend(this.defaults, ops);
        },
        fix: function () {
            for (var i = 0, l = this.count; i < l; i++) {
                if (this.items[i] != this.curS && this.items[i] != this.nextS) {
                    this.items[i].style.display = 'none';
                }
            }
        },
        go: function (num) {
            clearTimeout(this.timer);
            this.curS = this.items[this.now];
            if (num != undefined) {
                this.next = num
            } else {
                this.next = this.now + 1;
            }
            (this.next >= this.count) && (this.next = 0) || (this.next < 0) && (this.next = (this.count - 1));

            this.nextS = this.items[this.next];
            //当前项为curS,下一项为nextS,谨记
            if (this.now != this.next) {
                this.fix();
                this.run();
                if (this.pager) {
                    //console.log(this.defaults.numClass);
                    FS.currentOver(this.pages, this.next, this.defaults.numClass)
                };
                this.now = this.next;
            }
        },
        run: function (elm, callback) {
            var curS = this.curS,
                nextS = this.nextS,
                step = this.step; /* 从这里开始初始化运动开始前的选项 */

            //将当前项与下一项的起止位置都初始化为0
            //首先，显示出下一项
            nextS.style.display = 'block';
            if (this.how == 0) {
                curS.style.zIndex = '5';
                nextS.style.zIndex = '10';
                this.Hower.fadeIn(nextS);
            } else {
                if (this.next < this.now) {
                    this._end = 0;
                    this._begin = -step;
                    //console.log(this.slider.style[this.direct]);
                } else {
                    this._begin = 0;
                    this._end = -step;
                    //console.log(this.slider.style[this.direct]);
                }
                this._c = this._end - this._begin;

                this.Move();

            }
            var t = +new Date();

        },
        Move: function () {
            clearTimeout(this.timer);
            if (this._c && (this._time++ < this.ing)) {
                this.Moving(Math.floor(this.tween(this._time, this._begin, this._c, this.ing)));
                setTimeout(Bind(this, this.Move), this.speed);
            } else {
                this.Moving(this._end);
                this._time = 0;
                this.after();
            }
        },
        Moving: function (p) {
            this.slider.style[this.direct] = p + 'px';
        },
        How: function (t) {
            var root = this,
                speed = this.speed,
                how = this.how;
            //console.log(t);

            function fadeIn(elm) {
                var op0 = 0;
                (elm.show = function () {
                    if ((op0 += 0.05) < 1) {
                        FS.opacity(elm, op0);
                        setTimeout(elm.show, speed);
                    } else {
                        FS.opacity(elm, 1);
                        if (!elm.moving) root.after();
                    }
                })();
            }

            function fadeOut(elm) {
                var op1 = 1;
                (elm.hide = function () {
                    if ((op1 -= 0.05) > 0) {
                        FS.opacity(elm, op1);
                        setTimeout(elm.hide, speed);
                    } else {
                        FS.opacity(elm, 0);
                        if (!elm.moving) root.after();
                        return;
                    }
                })();
            }

            return {
                fadeIn: fadeIn,
                fadeOut: fadeOut
            }
        },
        after: function () {
            //console.log('end');
            FS.setCss(this.curS, {
                display: 'none',
                zIndex: 5
            });
            this.slider.style[this.direct] = 0;
            this.auto && (this.timer = setTimeout(Bind(this, this.Next), this.delay));

        },
        Prev: function () {
            this.go(--this.next);
        },
        Next: function () {
            this.go(++this.next);
        },
        Pause: function () {
            clearTimeout(this.timer);
            this.auto = false;
            //console.log('Pause!' + this.timer);
        },
        Continue: function () {
            //this.Pause();
            clearTimeout(this.timer);
            this.auto = true;
            this.timer = setTimeout(Bind(this, this.Next), this.delay);
            //console.log('Continue');
        },
        Pager: function () {
            this.pages = this.pager.children;
            var page = this.pager;
            var evt = this.event,
                pl = this.pages.length,
                root = this,
                to;
            for (var i = 0; i < pl; i++) {
                (function (i) {
                    FS.addEvent(root.pages[i], evt, function () {
                        root.Pause();
                        to = setTimeout(function () {
                            root.go(i)
                        }, 100);
                    });
                    FS.addEvent(root.pages[i], 'mouseout', function () {
                        root.auto = true;
                        clearTimeout(to);
                    });
                })(i);
            }
        }
    }

    playScroll.main.prototype = playScroll.prototype;

    return {
        playScroll: playScroll
    }
}());