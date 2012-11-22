/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 搜索提示。当用户在文本框中输入字符，当键盘释放时，如果数据源中的某个字段中包含输入的字符，则将弹出下拉搜索提示，此时可选择通过向上、向左、向下、向右键或鼠标对下拉项进行选择，按enter或tab键选好并收缩下拉区域，也可选择将搜索项手动输入完成。
 */

FS.extend(FS, function () {
    /**
     * @description 搜索提示。当用户在文本框中输入字符，当键盘释放时，如果数据源中的某个字段中包含输入的字符，则将弹出下拉搜索提示，此时可选择通过向上、向左、向下、向右键或鼠标对下拉项进行选择，按enter或tab键选好并收缩下拉区域，也可选择将搜索项手动输入完成。
     * @param {Object} options 参数对象
     * @param {String} options.hiddenId 页面中input文本框的ID
     * @param {String} options.method 获取数据源的方式，默认是'local'
     * @param {String} options.dataSource 本地提供的数据源
     * @param {String} [options.ulClass] ul下拉框的class样式,可选
     * @param {String} options.liNormal 下拉出来的选项中正常状态下的样式
     * @param {String} options.liHover 下拉出来的选项中高亮状态下的样式
     * @param {Number} [options.showLength = 20] 下拉出来的选项的数量，默认是20项
     * @example
     * FS.autoSearch({
            hiddenId: 'hiddenId',
            dataSource: jsonData,
            liNormal: 'liNormal',
            liHover: 'liHover'
        })
     */
    var autoSearch = function (options) {
        var hiddenId = options.hiddenId,
            method = options.method || 'local',
            dataSource = options.dataSource,
            ulClass = options.ulClass,
            liNormal = options.liNormal,
            liHover = options.liHover,
            showLength = options.showLength || 20;

        // outputId 生成的随机ID
        // outputObj input文本框，并动态设置其ID
        var outputId = hiddenId + '_' + FS.getRandom(100, 1000);
        var outputObj = FS.query('#' + hiddenId);
        outputObj.id = outputId;

        // input文本框最初的value，如“请输入品牌名称...”
        var inputOldText = outputObj.value;

        // 创建隐藏域，并设置隐藏域的ID
        var hiddenObj = document.createElement('input');
        hiddenObj.type = 'hidden';
        hiddenObj.id = hiddenId;
        hiddenObj.name = hiddenId;

        // parent_Div input的父节点，一个div
        var parent_Div = outputObj.parentNode;

        // TODO FSL中写个方法，将hiddenObj插入在outputObj的后面
        parent_Div.appendChild(hiddenObj);

        // 计算父节点div的宽度和高度，用以设置下拉ul节点的位置
        var divWidth = FS.getStyle(parent_Div, 'width'),
            divHeight = FS.getStyle(parent_Div, 'height');

        // 设置parent_Div的position，方便设置ul的位置
        FS.setCss(parent_Div, {
            position: 'relative'
        });

        // 创建下拉div，并根据hiddenId设置ID
        var ulObj = document.createElement('ul');
        ulObj.id = 'ul' + hiddenId;

        // 将下拉的ul添加为input的父div的子节点
        parent_Div.appendChild(ulObj);

        // 设置下拉ul的样式
        FS.setCss(ulObj, {
            position: 'absolute',
            top: divHeight,
            left: -1 + 'px',
            margin: 0,
            padding: '5px 0 5px 0',
            width: divWidth,
            height: 'auto',
            zIndex: '99999',
            border: '1px solid #999',
            cursor: 'pointer',
            display: 'none',
            background:'#fff'
        });

        // 如果定义了ul下拉框的样式，则将样式搞过来
        if( ulClass != null){
            FS.addClass(ulObj, ulClass);
        }

        // 监听input的输入，这里用keydown，当按键按着不动时能够持续触发，特别是对于上下左右的箭头
        // 注意不能是keyup或keypress，keypress只有按下字符时才触发，keyup不能连续触发，对于按下方向键时都不适应
        FS.addEvent(outputObj, 'keydown', function (e) {
            // 给向左、向上、向右、向下、Tab、Enter键添加事件
            var keyCode = e.keyCode;

            //输入不是37、38、39、40、13
            if (keyCode !== 37 && keyCode !== 38 && keyCode !== 39 && keyCode !== 40 && keyCode !== 9 && keyCode !== 13) {
                // 鼠标释放200ms后，创建下拉区域，并将匹配项放在下拉区域中。
                window.setTimeout(function () {
                    mainFun(e)
                }, 200)
            }

            // 37为向左箭头，38为向上箭头，39为向右箭头，40为向下箭头
            if (keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40) {

                // ul下拉区域总项数
                var liArray = FS.getChildNodes(ulObj),
                    liLength = liArray.length;

                // 如果没有匹配的下拉项，return
                if (liLength == 0) {
                    return;
                }
                // 如果当前没有高亮项，则将第一项设为高亮
                if (!FS('.' + liHover)[0]) {
                    FS.addClass(liArray[0], liHover);
                    setValue(liArray[0]);
                    return;
                }
                // 找出当前高亮项，并计算出当前高亮项在liArr中的位置
                var highObj = FS.query('.' + liHover),
                    highIndex = liArray.indexOf(highObj);

                // 向左、向上箭头
                if (keyCode == 37 || keyCode == 38) {
                    // 如果当前高亮项是第一项，return
                    if (highIndex == 0) {
                        return;
                    }
                    // 当前高亮项不是第一项，则将其上一项设为高亮，当前项设为normal
                    FS.removeClass(liArray[highIndex], liHover);
                    FS.addClass(liArray[highIndex - 1], liHover);

                    // 将liArr[highIndex-1]上的hidid属性值和innerHTML分别付给input文本框的value和input隐藏域的value
                    setValue(liArray[highIndex - 1]);
                }
                // 向右、向下箭头
                if (keyCode == 39 || keyCode == 40) {
                    // 如果已经是最后一项了
                    if (highIndex == liLength - 1) {
                        return;
                    }
                    // 如果当前项不是最后一项
                    FS.removeClass(liArray[highIndex], liHover);
                    FS.addClass(liArray[highIndex + 1], liHover);
                    // 将liArr[highIndex+1]上的hidid属性值和innerHTML分别付给input文本框的value和input隐藏域的value
                    setValue(liArray[highIndex + 1]);
                }
            }
            // 按下Tab、enter键
            if (keyCode == 9 || keyCode == 13) {
                // 获得当前input文本框的值
                var inputValue = outputObj.value;

                // 如果input文本框中输入的值正好在result中有，即有匹配结果，则将其第一项的id设置为文本框隐藏域的id，否则将input隐藏域的value设为空
                inputSelect(inputValue);

                // 点击后隐藏ul下拉区域
                FS.hide(ulObj);
            }
        })
        
        // 键盘释放的时候进行判断，当input文本框的值为空或默认提示文字时，input隐藏域的值清空
        // 注意事件类型不能为keypress、keydown，keypress和keydown是在按下键盘上的字符时触发，会晚一步。
        FS.addEvent(outputObj, 'keyup', function(){
            if(outputObj.value == '' || outputObj.value == inputOldText){
                // 将input隐藏域的value设为空
                hiddenObj.value = '';
            }
        })

        // 当鼠标点击下拉区域的项，将该项的innerHTML设置为input文本框的value，将id设置为隐藏域的值
        FS.addEvent(document, 'click', function(e){
            // 获取事件源对象，并计算出该事件源对象在ul数组中的位置
            var target = e.target,
                indexArr = FS('li', ulObj).indexOf(target);
            //　如果该事件源对象在ul下拉区域中
            if(indexArr !== -1){
                // 将当前项(事件源)对应id和value分别设为input隐藏域和input文本框
                setValue(target);
                // 隐藏下拉区域
                FS.hide(ulObj);
            }else{
                // 获得当前input文本框的值
                var inputValue = outputObj.value;

                // 如果input文本框中输入的值正好在result中有，即有匹配结果，则将其第一项的id设置为文本框隐藏域的id，否则将input隐藏域的value设为空
                inputSelect(inputValue);          

                // 隐藏下拉区域
                FS.hide(ulObj);
                return;
            }
            // 阻止事件冒泡，注意不能阻止事件默认行为，不然右键都点不了
            e.stopPropagation();
        })
        
        // 如果input文本框中输入的值正好在result中有，即有匹配结果，则将其第一项的id设置为文本框隐藏域的id，否则将input隐藏域的value设为空
        function inputSelect(inputValue){
            // 当鼠标点击下拉区域以外的地方，自动根据文本框输入，看result中是否包含该项，如果包含，则设置input隐藏域的值
            var result = findResult(inputValue),
                length = result.length,
                endResult = [];

            // 循环匹配出来的项，看result中是否有那一项的value恒等于input文本框的输入,如果有，则将该项插入endResult数组中
            for(var i = 0; i<length; i++){
                if(result[i].value == inputValue){
                    endResult.push(result[i]);
                }
            }

            // 如果存在匹配项，并且匹配结果的第一项的值正好是当前文本框的值，则将第一项的id设置为input隐藏域的id
            if(endResult.length > 0){
                // 将该项的id设置为input隐藏域的value
                hiddenObj.value = endResult[0].id;
            }else{
                // 将input隐藏域的value设为空
                hiddenObj.value = '';
            }
        }

        // 根据input的输入找出匹配的记录，并将其存入到result数组中
        // TODO 如果是通过ajax方式，则通过FS.Ajax(options)方法将input文本框的输入传给服务器端，返回result这一json数组
        function findResult(inputValue){
            // 用于存储监听input的输入后查询出来的对象数组
            var result = [];

            // 只有当input内有值时才去匹配
            if (inputValue != null && inputValue.trim() !== '' && dataSource != null) {
                // 遍历json数组，看每一项的value中是否包含输入的值，如果包含，则将该对象放入result数组中
                var length = dataSource.length;
                for (var i = 0; i < length; i++) {
                    var text = dataSource[i].value;
                    if (text.indexOf(inputValue) !== -1) {
                        result.push(dataSource[i]);
                    }
                }
            }
            return result;
        }

        // 监听键盘后的处理函数
        function mainFun(e) {

            // 获取input输入的值
            var inputValue = outputObj.value;

            // 根据input文本框的输入找出匹配的记录，并将其放入result数组中
            var result = findResult(inputValue);

            // liStr 拼凑li节点的字符串
            var liStr = '';
            // 如果有对应的匹配项，则创建对应的li节点
            if (result != null) {
                // 循环匹配结果数组，给每一个匹配项创建一个数组
                var leng = result.length;
                for (var j = 0; j < leng && j < showLength; j++) {
                    if (liNormal != null) {
                        liStr += '<li hidid=' + result[j].id + ' class=' + liNormal + ' id=' + 'li' + hiddenId + j + '>' + result[j].value + '</li>';
                    } else {
                        liStr += '<li hidid=' + result[j].id + ' style="padding-left:5px; height:18px; line-height:18px; overflow:hidden; font-size:12px" id=' + 'li' + hiddenId + j + '>' + result[j].value + '</li>';
                    }
                }
            }

            // 将li节点设置为ul的子节点，当没有匹配项的时候，ul的innerHTML将为空
            FS.html(ulObj, liStr);

            // 如果ul中存在li，即找到了匹配项，则显示ul，否则隐藏ul
            if (liStr.trim() !== '') {
                FS.show(ulObj);
            } else {
                FS.hide(ulObj);
            }

            // 当鼠标放在ul下拉块，则相对应的选项程高亮状态
            var liArr = FS.getChildNodes(ulObj);
            FS.nodesAddEvent(liArr, 'mouseenter', function (e) {
                // 设置每一项的title
                this.title = FS.html(this);

                // 如果liHover存在，并且当前项不是高亮，则移除高亮项的高亮class样式，将当前项设为高亮
                var targetIndex = liArr.indexOf(this);
                if (liHover != null) {
                    FS.currentOver(liArr, targetIndex, liHover);
                }
                
                // 阻止mouseenter事件的冒泡和默认行为
                e.preventDefault();
                e.stopPropagation();
            });

            // 阻止keypress事件的冒泡和默认行为
            e.preventDefault();
            e.stopPropagation();
        }

        // 将obj项上的hidid属性值和innerHTML分别付给input文本框的value和input隐藏域的value
        function setValue(obj) {
            // 获取该项的id
            var id = obj.getAttribute('hidid'),
                value = FS.html(obj);

            // 将该项的value设置为input文本框的value
            outputObj.value = value;
            // 将该项的id设置为input隐藏域的value
            hiddenObj.value = id;
        }
    }

    return {
        autoSearch: autoSearch
    }
}());