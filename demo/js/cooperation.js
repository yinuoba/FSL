( function() {
    /*图片延时加载*/
    FS.fsLoadImg({
        attr : 'fslazy',
        height : 200
    });

    /*品牌区域hover效果*/
    FS.ie6Hover({
        allElements : FS.getChildNodes(FS.query("#allbrand")),
        hoverClass : 'mouseon'
    });
}());