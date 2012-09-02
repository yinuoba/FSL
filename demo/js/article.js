(function() {
    /**
     *轮播图片
     */
    if (FS.query("#play_list") != null) {
        FS.playScroll('#play_list', {
            how: 0,
            pager: '#play_text',
            numClass: 'btn_picshow_on'
        });
    }

    /**
     * 左侧项目点击展开
     */
    (function() {
        /**
         * 找出menu下的dt节点
         */
        var menu = FS('dt', FS('#menu'));
        /**
         * 如果是article页面
         */
        if (menu[0] != null) {
            /**
             * 给所有的dt添加click事件
             */
            FS.nodesAddEvent(menu, 'click', function() {
                /**
                 * 找出当前高亮的dt及dt下的dl
                 */
                var dt_hover = FS.query('.dt_hover', FS('#menu')),
                    dt_hover_next = FS.getNextElement(dt_hover);

                /**
                 * 如果当前节点不包含dt_hover样式
                 */
                if (!FS.hasClass(this, 'dt_hover')) {
                    /**
                     * 则让当前处于高亮的节点移除高亮的class样式，并隐藏下拉的内容
                     */
                    FS.removeClass(dt_hover, 'dt_hover');
                    FS.hide(dt_hover_next);

                    /**
                     * 让当前节点添加click后的class样式，并渐现下拉内容
                     */
                    var now_hover_next = FS.getNextElement(this);
                    FS.addClass(this, 'dt_hover');
                    FS.fadeIn(now_hover_next, 0.1, 1, 1500);
                    FS.show(now_hover_next);
                }
                return;
            });
        }

    }());
}());