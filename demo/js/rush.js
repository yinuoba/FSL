( function() {
    /*图片延时加载*/
    FS.fsLoadImg({
        attr : 'fslazy',
        height : 200
    });

    /*商品图片 底部热区*/
    FS.hotFade({
        eventTarget : '.hot_rush'
    });

    /*更多品牌 */
    if(FS.query('#viewall_bypp') != null && FS.query('#brand_pp') != null) {
        FS.clickMore({
            all_by: "#viewall_bypp",
            by_li: "#brand_pp",
            limit_height: 38
        });
    }

    /*更多尺寸*/
    if(FS.query('#viewall_bysize') != null && FS.query('#product_list_size') != null) {
        FS.clickMore({
            all_by: "#viewall_bysize",
            by_li: "#product_list_size",
            limit_height: 50
        });
    }
	
	/*缺省页面 补货通知表单*/
    if(FS.query('#default_sub') != null) {
        FS.toogleText('#default_sub');
    }
    
    /*缺省页面聚团购商品列表区域hover效果*/
    FS.ie6Hover({
        allElements : FS('.tuan3_container_on'),
        hoverClass : 'tuanlihover'
    });

}())