/**
 * @fileoverview Feishang Javascript Library(FSL.js v1.0.0)
 * @version 2012 v1.0.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>
 */

/**
 * @class Feishang Javascript Library(FSL.js v1.0.0)
 * @param {Object} window window对象，以参数方式传入，将全局变量转为局部变量，并让其在混淆时可替换为单字符，节省大量空间
 * @param {Object} document document对象，以参数方式传入，将全局变量转为局部变量，并让其在混淆时可替换为单字符，节省大量空间
 * @param {undefined} undefined 传入undefined，防止undefined被重写
 * @return {Function}
 */
var FS = (function(window, document, undefined) {
    // 创建FS对象
    if (!window.FS || typeof(FS) === 'undefined') {
        FS = {};
    }

    var slice = Array.prototype.slice;

    // 标识当前的发布模式，如果为发布模式，则为true
    var developVersion = true;

    /**
     * @description 选择器。根据css选择器（可以是id选择器、class选择器、node、tagname、不带尖括号的tagname和*）选择出元素数组
     * @param {String|Element|null} selector 选择器 可以是id、class、node、tagname、不带尖括号的tagname和*
     * @param {Element|NodeList|Array} [limitNode] DOM范围。限制节点范围的节点元素或元素数组或元素结合，一般是selector的父节点,可选参数
     * @return {Array} elements(筛选出的DOM节点组成的一维数组)
     * @example
     * FS('#fs')
     * FS('.fs')
     * FS(FS('.fs')[0]))
     * FS('<1nput>')
     * FS('input')
     * FS('*')
     * FS("dt",FS("#menu"))
     * FS(".mainnews_close",FS(".mainnews_contbg"))
     * FS(".mainnews_close",FS(".mainnews_contbg")[0])
     */
    var FS = function(selector, limitNode) {
            return new FS.$$(selector, limitNode);
        };

    /**
     * @description 选择器。根据css选择器（可以是id选择器、class选择器、node、tagname、不带尖括号的tagname和*）选择出元素数组第一个元素
     * @param {String|Element|null} selector 选择器 可以是id、class、node、tagname、不带尖括号的tagname和*
     * @param {Element|NodeList|Array} [limitNode] DOM范围。限制节点范围的节点元素或元素数组或元素结合，一般是selector的父节点,可选参数
     * @return {Element} elements 筛选出的DOM节点组成的一维数组的第一个元素
     * @example
     * FS.query('#fs')
     * FS.query('.fs')
     * FS.query(FS('.fs')[0]))
     * FS.query('<1nput>')
     * FS.query('input')
     * FS.query('*')
     * FS.query("dt",FS("#menu"))
     * FS.query(".mainnews_close",FS(".mainnews_contbg"))
     * FS.query(".mainnews_close",FS(".mainnews_contbg")[0])
     */

    FS.query = function(selector, limitNode) {
        // 如果传入的参数为null、undefined或nodeType, 则返回它本身
        if (selector === null || typeof selector === 'undefined') {
            return selector;
        }
        return FS.$$(selector, limitNode)[0];
    }

    /**
     * @ignore
     * @description 选择出元素数组，用的时候不需要FS.$$(selector, limitNode)，只需FS(selector, limitNode)就可以了
     * @param {String|Element|null} selector 选择器 可以是id、class、node、tagname、不带尖括号的tagname和*
     * @param {Element|NodeList|Array} [limitNode] DOM范围。限制节点范围的节点元素或元素数组或元素结合，一般是selector的父节点,可选参数
     * @return {Array} elements(筛选出的DOM节点组成的一维数组)
     * @example
     * FS.$$('#fs')
     * FS.$$('.fs')
     * FS.$$(FS('.fs')[0]))
     * FS.$$('<1nput>')
     * FS.$$('input')
     * FS.$$('*')
     * FS.$$("dt",FS("#menu"))
     * FS.$$(".mainnews_close",FS(".mainnews_contbg"))
     * FS.$$(".mainnews_close",FS(".mainnews_contbg")[0])
     */

    FS.$$ = function(selector, limitNode) {
        // 如果传入的参数为null、undefined或nodeType, 则返回它本身
        if (selector === null || typeof(selector) === 'undefined') {
            return selector;
        }

        var elements = [];
        var match = {
            ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
            CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
            TAG: /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
            UTAG: /^(\w+)\s*/
        };

        // 如果传入的是一个ELEMENTS元素
        if (selector.nodeType === 1 || selector.nodeType === 9) {
            elements.push(selector);
            return elements;
        }

        if (typeof selector === 'string') {
            // 执行正则表达式，得到一个二维数组
            var match_id = match.ID.exec(selector),
                match_class = match.CLASS.exec(selector),
                match_tag = match.TAG.exec(selector),
                match_utag = match.UTAG.exec(selector),
                element = null,
                allElement = null;

            // 如果limitNode存在，则筛选出limitNode子节点中的符合条件的elements，并将其存入limitNodes数组中
            if (limitNode != null) {
                var elementsLimit = [],
                    limit = [];

                // 如果limitNode是节点元素、元素集合、节点数组
                // 分别将所有的限制节点放入limit数组中，下面就统一处理limit数组就可以了                
                if (limitNode.nodeType) {
                    limit.push(limitNode);
                } else if (limitNode.item) {
                    limit = FS.makeArray(limitNode);
                } else if (FS.isArray(limitNode)) {
                    // 取得限制节点数组的长度
                    var limitLeng = limitNode.length - 1;
                    // 循环所有限制节点，将元素节点放入limit数组
                    for (; limitLeng >= 0; limitLeng--) {
                        if (limitNode[limitLeng].nodeType === 1) {
                            limit.push(limitNode[limitLeng]);
                        }
                    }
                } else {
                    FS.error('limitNode参数类型不对，应传入节点元素或节点元素数组或元素结合!');
                }

                // 取出所有限制节点的所有子节点，存入limitNodes数组中，下面就只需要操作limitNodes数组
                var limitLength = limit.length - 1,
                    limitNodes = [];
                for (; limitLength >= 0; limitLength--) {
                    var limitElements = FS.getAll(limit[limitLength]),
                        limitElementsLeng = limitElements.length - 1;
                    for (; limitElementsLeng >= 0; limitElementsLeng--) {
                        limitNodes.push(limitElements[limitElementsLeng]);
                    }
                };
            }

            // 选择出匹配selector的所有节点
            // 如果浏览器支持document.querySelectorAll(IE8及以上、其他标准浏览器),则直接使用querySelectorAll
            if (document.querySelectorAll) {
                elements = document.querySelectorAll(selector);
            } else {
                // 不支持querySelectorAll的浏览器（主要是IE6、IE7）
                if (match_id) {
                    element = document.getElementById(match_id[1]);
                    // 如果找到了节点，则将其插入至elements数组
                    if (element) {
                        elements.push(element);
                    }
                } else if (match_tag || match_utag) {
                    if (match_tag) {
                        elements = document.getElementsByTagName(match_tag[1]);
                    } else {
                        elements = document.getElementsByTagName(match_utag[1]);
                    }
                } else if (match_class) {
                    elements = FS.getElementsByClass(match_class[0]);
                } else if (selector === '*') {
                    elements = FS.getAll();
                }
            }

            // 如果limitNode存在，并且传入的选择器是TagName或class选择器，则筛选出limitNode的子节点中的符合条件的所有elements
            if (limitNode != null && !match_id && selector !== '*') {
                var eleLength = elements.length;
                for (var k = 0; k < eleLength; k++) {
                    // 如果limitNodes数组中包含匹配出来的elements,则插入elementsLimit数组
                    if (limitNodes.contains(elements[k])) {
                        elementsLimit.push(elements[k]);
                    }
                }
                return elementsLimit;
            }

            // 统一处理元素集合，如果elements是一个元素集合，用makeArray将其转化为数组。
            if (elements.item) {
                return FS.makeArray(elements);
            }
            // 取得的不是元素集合，而且Array类型
            return elements;
        }
    }

    /**
     * @description 抛出异常,方便调试的时候查找出错误信息。如果是Firefox或Chrome等支持console.error的浏览器，则将错误信息输出到控制台，并抛出异常，如果是IE，指抛出异常
     * @param  {String} msg 异常信息
     */

    FS.error = function(msg) {
        try {
            console.error(msg);
            // 如果当前为已发布模式，则不抛出异常
            if (!developVersion) {
                throw msg;
            }
            return;
        } catch (e) {
            // 如果当前为已发布模式，则不抛出异常
            if (!developVersion) {
                throw msg;
            }
            return;
        }
    }

    /**
     * @description 在chrome和Firefox浏览器等支持console.error方法的浏览器中，控制台输出错误msg，在IE中，弹出错误msg
     * @param  {String} msg 日志信息
     */

    FS.consoleError = function(msg) {
        try {
            console.error(msg);
            return;
        } catch (e) {
            // 如果当前为已发布模式，则不抛出异常
            if (!developVersion) {
                alert(msg);
            }
            return;
        }
    }

    /**
     * @description 在chrome和Firefox浏览器等支持console.info方法的浏览器中，控制台输出msg信息，在IE中，弹出错误msg
     * @param  {String} msg 日志信息
     */

    FS.consoleInfo = function(msg) {
        try {
            console.info(msg);
        } catch (e) {
            alert(msg);
        }
    }

    /**
     * @description 计时器，用于跟踪一段js的执行时间，该方法必须与FS.consoleTimeEnd结合使用
     * @param  {String} name 计时器名称，该名称必须与FS.consoleTimeEnd中的名称一样
     * @return {Number} js执行时间
     */
    FS.consoleTime = function(name) {
        try {
            console.time(name);
        } catch (e) {
            return;
        }
    }

    /**
     * @description 计时器，用于跟踪一段js的执行时间，该方法必须与FS.consoleTime结合使用
     * @param  {String} name 计时器名称，该名称必须与FS.consoleTime中的名称一样
     * @return {Number} js执行时间
     */
    FS.consoleTimeEnd = function(name) {
        try {
            console.timeEnd(name);
        } catch (e) {
            return;
        }
    }

    /**
     * @description 忽略异常，让用户看不到方法抛出的异常，特别对于是一些不影响方法执行的异常
     */

    FS.ignoreError = function() {
        var win = window;
        win.onerror = function() {
            return true;
        }
    }

    // 如果当前为发布模式，则忽略error
    if (developVersion) {
        FS.ignoreError();
    }

    /**
     * @ignore
     * @description 根据class选择器查找DOM节点
     * @param {String} searchClass class选择器
     * @return {Array}
     * @example FS.getElementsByClass('.main');
     */

    FS.getElementsByClass = function(searchClass) {
        // 如果浏览器环境支持querySelectorAll,则使用querySelectorAll，因为它是DOM跟JavaScript的一个接口方法，速度会非常快
        if (typeof document.querySelectorAll !== 'undefined') {
            var classElements = document.querySelectorAll(searchClass);
            return FS.makeArray(classElements);
        } else {
            // 先找出所有的节点
            var allElements = document.getElementsByTagName('*');
            // 去掉前面的'.'
            var searchClass = searchClass.substring(1);
            // 匹配class样式
            var hasReg = new RegExp('(\\s|^)' + searchClass + '(\\s|$)'),
                length = allElements.length,
                classElements = [];
            for (var i = 0; i < length; i++) {
                var classnames = allElements[i].className,
                    hasClass = classnames.search(hasReg);
                // 如果hasClass===-1,则未匹配到
                if (hasClass !== -1) {
                    classElements.push(allElements[i]);
                }
            }
            return classElements;
        }
    }

    /**
     * @description 取得doc节点下所有的子Element
     * @param doc {Element}
     * @return {Array} doc节点是所有子Element
     * @example FS.getAll(FS.query('#footer'))
     */

    FS.getAll = function(doc) {
        var doc = doc || document;
        if (typeof document.querySelectorAll !== 'undefined') {
            return FS.makeArray(doc.querySelectorAll('*'));
        } else if (document.getElementsByTagName !== 'undefined') {
            return FS.makeArray(doc.getElementsByTagName('*'));
        } else {
            return null;
        }
    }

    /**
     * @description 取得ChildNodes中的nodeType为1的ELEMENT节点，去除TEXTNODE、COMMENT等节点，跟getAll相比较，该方法取得的是第一级的子节点。
     * @param {Element} node 需查找子节点的DOM节点
     * @return {Array} elements 子节点组成的一维数组
     * @example FS.getChildNodes(FS('#id')[0])
     */

    FS.getChildNodes = function(node) {
        try {
            if (!node.nodeType) {
                return false;
            }
            // 将所有的childNodes全存放在temp中
            var temp = node.childNodes,
                length = temp.length,
                elements = [];
            // 遍历所有childNodes，将符合条件的node全放入elements数组中
            for (var i = 0; i < length; i++) {
                if (temp[i].nodeType === 1) {
                    elements.push(temp[i]);
                }
            }
            return elements;
        } catch (msg) {
            FS.error('调用getChildNodes方法出现异常,可能是node为null,' + msg);
        }
    }

    /**
     * @description 取得node元素的下一个nodeType为1的ELEMENT节点
     * @param {Element} node 元素节点
     * @return {Element}
     */

    FS.getPrevElement = function(node) {
        try {
            if (!node.nodeType) {
                return false;
            }
            // 取得元素的下一个节点
            var node = node.previousSibling;
            // 帅选元素的下一个元素节点
            for (; node; node = node.previousSibling) {
                if (node.nodeType === 1) {
                    return node;
                }
            }
        } catch (msg) {
            FS.error('调用getPrevElement方法出现异常：' + msg);
        }
    }

    /**
     * @description 取得node元素的下一个nodeType为1的ELEMENT节点
     * @param {Element} node 元素节点
     * @return {Element}
     */

    FS.getNextElement = function(node) {
        try {
            if (!node.nodeType) {
                return false;
            }
            // 取得元素的下一个节点
            var node = node.nextSibling;
            // 帅选元素的下一个元素节点
            for (; node; node = node.nextSibling) {
                if (node.nodeType === 1) {
                    return node;
                }
            }
        } catch (msg) {
            FS.error('调用getNextElement方法出现异常：' + msg);
        }
    }

    /**
     * @description 取得node元素的最后一个节点
     * @param {Element} node 元素节点
     * @return {Element}
     */
    FS.getLastChild = function(node) {
        var childNodes = FS.getChildNodes(node),
            length = childNodes.length - 1;
        return childNodes[length]
    }

    /**
     * @description 取得node元素的第一个节点
     * @param {Element} node 元素节点
     * @return {Element}
     */
    FS.getFirstChild = function(node) {
        var childNodes = FS.getChildNodes(node);
        return childNodes[0]
    }

    /**
     * @description 再某节点后添加新节点
     * @param  {Element} newNode 新节点
     * @param  {Element} node 老节点
     */
    FS.insertAfter = function(node, newNode) {
        try {
            var parent = node.parentNode;
            if (FS.getLastChild(parent) == node) {
                // 如果最后的节点是目标元素，则直接添加。因为默认是最后
                parent.appendChild(newNode);
            } else {
                //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
                parent.insertBefore(newNode, FS.getNextElement(node))
            }
        } catch (msg) {
            FS.error('insertAfter方法出现异常：' + msg);
        }
    }

    /**
     * @description 在某节点的子节点末尾添加新节点
     * @param  {Element} node 老节点
     * @param {Element|String} child 需要添加的子节点,该参数可以是Element类型，也可以是html节点字符串
     */
    FS.append = function(node, child) {
        try {
            // 第二个参数是Elemet节点
            if (child.nodeType === 1) {
                node.appendChild(child);
            } else if (FS.isString(child)) {
                // 将节点字符串添加为其子节点
                var oldHtml = FS.html(node);
                oldHtml += child;
                FS.html(node, oldHtml);
            }
        } catch (msg) {
            FS.error('FS.append方法出现异常，可能是' + node + '或' + 'child' + '类型不对：' + msg);
        }
    }

    /**
     * 移除节点或节点数组
     * @param {Element|NodeList|Array} arguments 需要移除的节点，多个节点用逗号隔开
     * @example  FS.remove(FS(options.maskId)[0],FS('#iframe'+maskId)[0]);
     * @example  FS.remove(FS('select'),FS('#iframe'+maskId)[0]);
     * @example  FS.remove(document.images);
     */
    FS.remove = function() {
        try {
            var arg = arguments,
                length = arg.length - 1;
            for (; length >= 0; length--) {
                // 如果参数是节点数组
                if (arg[length] == null) {
                    continue;
                } else if (FS.isArray(arg[length]) || arg[length].item) {
                    var leng = arg[length].length - 1;
                    for (; leng >= 0; leng--) {
                        var argArr = arg[length][leng];
                        if (FS.notNode(argArr)) {
                            // 如果传入的不是node，继续下一个节点元素
                            continue;
                        }
                        // 先找出父节点，再移除该节点
                        var parentNode = argArr.parentNode;
                        parentNode.removeChild(argArr);
                    }
                } else if (FS.notNode(arg[length])) {
                    // 如果传入的不是node，继续下一个节点元素
                    continue;
                } else {
                    var parentNode = arg[length].parentNode;
                    parentNode.removeChild(arg[length]);
                }
            }
        } catch (msg) {
            FS.error('FS.remove方法出现异常' + msg);
        }
    }

    /**
     * @description 对象继承，destination继承source。
     * @param {object} destination 原始对象
     * @param {object} source 新对象
     * @return {object} 继承新特性后的对象
     * @example
     * var obj1 = {a:"1", b:'2'},
     * var obj2 = {c:3""};
     * FS.extend(obj1, obj2);
     */

    FS.extend = function(destination, source) {
        // 遍历新对象的每一个属性
        for (var property in source)
        destination[property] = source[property];
        return destination;
    }

    /**
     * @description 检测一个对象是否是数组类型
     * @param {object} obj 待检测的对象
     * @return {Boolean}
     * @example
     * var arr = [];
     * FS.isArray(arr);
     */

    FS.isArray = function(obj) {
        return Object.prototype.toString.call(obj) == "[object Array]"
    }

    /**
     * @description 将类数组(如元素集合、函数内部arguments对象，元素的attributes值、元素的classList值)转化为数组
     * @param {NodeList|arguments|attributes|className} arr DOM元素集合
     * @return {Array}
     * @example
     * FS.makeArray(document.images)
     */

    FS.makeArray = function(arr) {
        if (arr != null) {
            var len = arr.length,
                array = [];

            while (len--) {
                array[len] = arr[len];
            }
            return array;
        }
        return slice.call(arr);
    }

    /**
     * @description 检测一个对象是否是对象
     * @param {object} obj 待检测的对象
     * @return {Boolean}
     * @example
     * var obj = {};
     * FS.isObject(obj);
     */

    FS.isObject = function(obj) {
        return Object.prototype.toString.call(obj) == "[object Object]"
    }

    /**
     * @description 检测一个对象是否是function类型
     * @param {object} obj 待检测的对象
     * @return {Boolean}
     * @example
     * var obj = function(){};
     * FS.isFunction(obj);
     */

    FS.isFunction = function(obj) {
        return typeof obj == "function"
    }

    /**
     * @description 检测一个对象是否是string类型
     * @param {object} obj 待检测的对象
     * @return {Boolean}
     * @example
     * var obj = '';
     * FS.isString(obj);
     */

    FS.isString = function(obj) {
        return typeof obj == "string"
    }

    /**
     * @description 检测一个对象是否是number类型
     * @param {object} obj 待检测的对象
     * @return {Boolean}
     * @example
     * var obj = 45;
     * FS.isNumber(obj);
     */

    FS.isNumber = function(obj) {
        return typeof obj == "number"
    }

    /**
     * @ignore
     * @description 检测一个对象是否是数字或字符串
     * @param {object} obj 待检测的对象
     * @return {Boolean}
     * @example
     * var obj = '45';
     * FS.isValue(obj);
     */

    FS.isValue = function(obj) {
        return typeof obj == "number" || typeof obj == "string"
    }

    /**
     * @description 检测一个对象是否是bool类型
     * @param {object} obj 待检测的对象
     * @return {Boolean}
     * @example
     * var obj = true;
     * FS.isBoolean(obj);
     */

    FS.isBoolean = function(obj) {
        return typeof obj == "boolean"
    }

    /**
     * @description 检测一个对象是否已定义
     * @param {object} obj 待检测的对象
     * @return {Boolean}
     * @example
     * var obj = true;
     * FS.isDefined(obj);
     */

    FS.isDefined = function(obj) {
        return typeof obj !== "undefined"
    }

    /**
     * @description 检测一个对象是否是html
     * @param {object} obj 待检测的对象
     * @return {Boolean}
     * @example
     * var obj = '<div>';
     * FS.isHTML(obj);
     */

    FS.isHTML = function(obj) {
        return FS.isString(obj) ? /^<.+/.test(obj.substring(0, 3)) : false;
    }

    /**
     * @description 检测浏览器是否是IE浏览器
     * @return {Boolean}
     * @example
     * FS.isIE()
     */

    FS.isIE = function() {
        return !!(!window.addEventListener && window.ActiveXObject)
    }

    /**
     * @description 检测浏览器是否是IE6浏览器
     * @return {Boolean}
     * @example
     * FS.isIE6()
     */

    FS.isIE6 = function() {
        return !window.XMLHttpRequest
    }

    /**
     * @description 检测浏览器是否是IE7浏览器
     * @return {Boolean}
     * @example
     * FS.isIE7()
     */

    FS.isIE7 = function() {
        return !!(!window.addEventListener && window.XMLHttpRequest && !document.querySelectorAll)
    }

    /**
     * @description 检测浏览器是否是IE8浏览器
     * @return {Boolean}
     * @example
     * FS.isIE8()
     */

    FS.isIE8 = function() {
        return !!(!window.addEventListener && document.querySelectorAll)
    }

    /**
     * @description 检测浏览器是否是Opera浏览器
     * @return {Boolean}
     * @example
     * FS.isOpera()
     */

    FS.isOpera = function() {
        return !!window.opera
    }

    /**
     * @description 判断浏览器是否是Firefox
     * @return {Boolean}
     * @example
     * FS.isFirefox()
     */

    FS.isFirefox = function() {
        return navigator.userAgent.indexOf('Firefox') > 0 ? true : false;
    }

    /**
     * @description 判断浏览器是否是chrome浏览器
     * @return {Boolean}
     * @example
     * FS.isChrome()
     */

    FS.isChrome = function() {
        return navigator.userAgent.indexOf('Chrome') > 0 ? true : false;
    }

    /**
     * @description 判断非节点元素或非window元素
     * @param {object} node 待检测的对象
     * @return {Boolean}
     * @example
     * FS.notNode('fsfs')
     */

    FS.notNode = function(node) {
        return node === null || node === undefined || !node.nodeType && node !== window
    }

    /**
     * @description 判断变量没有定义
     * @object {object} 需要判断的变量
     * @return {Boolean}
     * @example FS.isUndefined(obj);
     */

    FS.isUndefined = function(object) {
        return typeof object === "undefined";
    }

    /**
     * @description 取得当前时间戳
     * return {Number} 返回当前时间戳
     * @example
     * FS.now();
     */

    FS.now = function() {
        return (new Date).getTime();
    }

    /**
     * @description 取得m到n之间的一个随机整数
     * @param  {Number} m 应返回的最小值
     * @param  {Number} n 应返回的最大值
     * @return {Number} m到n之间的一个随机整数
     * @example
     * FS.getRandom(0,10)
     */

    FS.getRandom = function(m, n) {
        // 可能值的总数量
        var all = n - m + 1;
        // 值 = Math.floor(Math.random()*可能值的总数量 + 可能的最小值)
        return Math.floor(Math.random() * all + m);
    }

    /**
     * @description 拓展Array这一包装对象
     */
    FS.extend(Array.prototype, function() {
        /**
         * @description 查找某一obj在array中的位置
         */

        function indexOf(obj) {
            var result = -1,
                length = this.length,
                i = length - 1;
            for (; i >= 0; i--) {
                if (this[i] == obj) {
                    result = i;
                    // 如果已找到，则跳出循环
                    break;
                }
            }
            return result;
        }

        /**
         * @description 判断数组中是否存在obj
         */

        function contains(obj) {
            return (this.indexOf(obj) >= 0);
        }

        /**
         * @description 数组末尾添加数组中没有的元素obj
         */

        function append(obj) {
            if (!(this.contains(obj))) {
                this[this.length] = obj;
            }
        }

        /**
         * @description 在数组中移除obj
         */

        function remove(obj) {
            var index = this.indexOf(obj);
            return index >= 0 ? this.splice(index, 1) : false;
        }

        /**
         * @description 对Array的每一个元素运行一个函数。
         * @method each
         * @param arr（this） 待处理的数组.
         * @param callback 需要执行的函数,该执行函数可传入两个参数，第一个代表当前对象，第二个为当前对象在数组中的索引
         * @return {void}
         * @example var a = [8,2,3]; a.each(function(o,i){console.log(o);console.info(i)});
         */

        function each(callback) {
            for (var i = 0, len = this.length; i < len; i++) {
                if (i in this) {
                    callback.call(this, this[i], i);
                }
            }
        }

        /**
         * @description 从一个数组中取出n个不同的值
         * @param {Array} arr 原始数组
         * @param {Number} 需取出的个数
         * @return {Array} 返回数组中n个不同的随机值组成的数组
         * @example var aaa = ['a', 'b', 'e', 'fs','we']; aaa.randArray(3);
         */

        function randArray(n) {
            var leng = this.length;
            //如果arr中总数量小于等于想取出的数量，直接返回arr
            if (leng <= n) {
                return this;
            } else {
                var randArr = [],
                    str = ',';
                //从0开始，共执行n次
                while (randArr.length < n) {
                    var rand = FS.getRandom(0, leng - 1);
                    //如果这个随机数没有被取过，将该随机数添加到data数组中，跳出这层循环
                    while (str.indexOf(',' + rand) === -1) {
                        str += rand + ',';
                        randArr.push(this[rand]);
                        break;
                    }
                }
                return randArr;
            }
        }

        return {
            indexOf: indexOf,
            contains: contains,
            append: append,
            remove: remove,
            each: each,
            randArray: randArray
        }
    }());

    /**
     * @description 扩展String这一包装对象
     */
    FS.extend(String.prototype, function() {
        /**
         * @description 清除字符串开头和结尾的空格,只有ECMA5才支持trim方法,因此扩展String这一包装对象的去除空格方法
         */

        function trim() {
            return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }

        /**
         * 去除字符串中所有的空格
         * @return {[type]} [description]
         */

        function trimAll() {
            return this.trim().replace(/\s+/g, '');
        }

        /**
         * @description 清除字符串首尾空格，并把字符串之间的多个空格转换为一个空格
         */

        function clean() {
            return this.trim().replace(/\s+/g, ' ');
        };

        /**
         * @description 将“-”连接的字符串转换成驼峰式写法
         */

        function capitalize() {
            return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
        }

        /**
         * @description 把目标字符串峰驼化
         */

        function camelize() {
            return this.replace(/-+(.)?/g, function(match, chr) {
                return chr ? chr.toUpperCase() : '';
            });
        }

        /**
         * @description验证是否是邮箱
         */

        function isEmail() {
            var reg1 = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4})$/;
            return reg1.test(this);
        }

        /**
         * @description 验证手机号码
         */

        function isMobile() {
            var reg = /^[1][3,4,5,8]\d{9}$/;
            return reg.test(this);
        }

        /**
         * @description 验证是否是日期
         */

        function isDate() {
            var pattern = /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/;
            if (!pattern.test(this)) {
                alert("日期格式不对");
                return false;
            }
            var arr = this.split("-");

            if (arr[1].indexOf("0") == 0) {
                arr[1] = arr[1].substr(1);
            }

            if (arr[2].indexOf("0") == 0) {
                arr[2] = arr[2].substr(1);
            }

            if (parseInt(arr[1]) < 1 || parseInt(arr[1]) > 12) {
                alert("月份不对");
                return false;
            }
            if (parseInt(arr[2]) < 1 || parseInt(arr[2]) > 31) {
                alert("日期的天数不对");
                return false;
            }
            return true;
        }

        return {
            trim: trim,
            trimAll: trimAll,
            clean: trimAll,
            capitalize: capitalize,
            camelize: camelize,
            isEmail: isEmail,
            isMobile: isMobile,
            isDate: isDate
        }
    }());

    /**
     * @description 扩展Function对象
     */
    FS.extend(Function.prototype, (function() {
        function update(array, args) {
            var arrayLength = array.length,
                length = args.length;
            while (length--)
            array[arrayLength + length] = args[length];
            return array;
        }

        function merge(array, args) {
            array = slice.call(array, 0);
            return update(array, args);
        }

        function argumentNames() {
            var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '').replace(/\s+/g, '').split(',');
            return names.length == 1 && !names[0] ? [] : names;
        }

        function bind(context) {
            if (arguments.length < 2 && FS.isUndefined(arguments[0])) return this;
            var __method = this,
                args = slice.call(arguments, 1);
            return function() {
                var a = merge(args, arguments);
                return __method.apply(context, a);
            }
        }

        function bindAsEventListener(context) {
            var __method = this,
                args = slice.call(arguments, 1);
            return function(event) {
                var a = update([event || window.event], args);
                return __method.apply(context, a);
            }
        }

        function curry() {
            if (!arguments.length) return this;
            var __method = this,
                args = slice.call(arguments, 0);
            return function() {
                var a = merge(args, arguments);
                return __method.apply(this, a);
            }
        }

        function delay(timeout) {
            var __method = this,
                args = slice.call(arguments, 1);
            timeout = timeout * 1000;
            return window.setTimeout(function() {
                return __method.apply(__method, args);
            }, timeout);
        }

        function defer() {
            var args = update([0.01], arguments);
            return this.delay.apply(this, args);
        }

        function wrap(wrapper) {
            var __method = this;
            return function() {
                var a = update([__method.bind(this)], arguments);
                return wrapper.apply(this, a);
            }
        }

        function methodize() {
            if (this._methodized) return this._methodized;
            var __method = this;
            return this._methodized = function() {
                var a = update([this], arguments);
                return __method.apply(null, a);
            };
        }

        return {
            argumentNames: argumentNames,
            bind: bind,
            bindAsEventListener: bindAsEventListener,
            curry: curry,
            delay: delay,
            defer: defer,
            wrap: wrap,
            methodize: methodize
        }
    })());

    /**
     * @description 给node添加处理事件，DOM时间模型中我们只关心冒泡事件流，因为IE8及一下浏览器只支持冒泡，兼容性最广。
     * @param {Element} node 需添加处理事件的节点 即事件源
     * @param {String} type 事件类型
     * @param {Function} listener 元素绑定的处理函数
     * @example FS.addEvent( FS(clickId)[0], 'click', function(){...} )
     */

    FS.addEvent = function(node, type, listener) {
        try {
            /**
             * 当node不是ELEMENTS，或node为null,或undefined,直接return
             */
            if (FS.notNode(node)) {
                return false;
            }
            if (node.addEventListener) {
                // false为冒泡事件
                // 因为考虑到mouseover和mouseout不会停止冒泡,而mouseenter和mouseleave可以做到，故用mouseenter和mouseleave
                // mousewheel 兼容滚轮事件（Firefox浏览器用DOMMouseScroll，其他浏览器用mousewheel）
                if (type === 'mouseenter') {
                    node.addEventListener('mouseover', withinElement(listener), false);
                } else if (type === 'mouseleave') {
                    node.addEventListener('mouseout', withinElement(listener), false);
                } else if (type === 'mousewheel' && FS.isFirefox()) {
                    node.addEventListener('DOMMouseScroll', listener, false);
                } else if (type === 'mousewheel' && !FS.isFirefox()) {
                    node.addEventListener('mousewheel', listener, false);
                } else {
                    node.addEventListener(type, listener, false);
                }
                // 防止IE9再跳到node.attachEvent
                return;
            }
            if (node.attachEvent) {
                // IE事件模型
                node['e' + type + listener] = listener;
                node[type + listener] = function() {
                    node['e' + type + listener](FS.fixEvent(window.event));
                }
                node.attachEvent('on' + type, node[type + listener]);
            }
        } catch (msg) {
            FS.error('FS.addEvent方法出现异常：' + msg);
        }
    }

    /**
     * @description 给node解除处理事件. 要成功接触，三个参数必须一样，匿名函数无法解绑，因为及时看上去是一样的匿名函数，也是Function包装对象的不同势力
     * @param {Element} node 需添加处理事件的节点 即事件源
     * @param {String} type 事件类型
     * @param {Function} listener 元素绑定的处理函数
     * @example FS.removeEvent( FS(clickId)[0], 'click', callback)
     */

    FS.removeEvent = function(node, type, listener) {
        try {
            if (FS.notNode(node)) {
                return false;
            }
            if (node.removeEventListener) {
                // false为冒泡事件
                // 因为考虑到mouseover和mouseout不会停止冒泡,而mouseenter和mouseleave可以做到，故用mouseenter和mouseleave
                // mousewheel 兼容滚轮事件（Firefox浏览器用DOMMouseScroll，其他浏览器用mousewheel）
                if (type === 'mouseenter') {
                    node.removeEventListener('mouseover', withinElement(listener), false);
                } else if (type === 'mouseleave') {
                    node.removeEventListener('mouseout', withinElement(listener), false);
                } else if (type === 'mousewheel' && FS.isFirefox()) {
                    node.removeEventListener('DOMMouseScroll', listener, false);
                } else if (type === 'mousewheel' && !FS.isFirefox()) {
                    node.removeEventListener('mousewheel', listener, false);
                } else {
                    node.removeEventListener(type, listener, false);
                }
                return true;
            } else if (node.detachEvent) {
                // IE事件模型
                node.detachEvent('on' + type, node[type + listener]);
                node[type + listener] = null;
                return true;
            } else {
                // 如果两种模型都不是，返回false
                return false;
            }
        } catch (msg) {
            FS.error('FS.removeEvent方法出现异常：' + msg);
        }
    }

    /**
     * @ignore
     * @description 用于处理event的相关元素relatedTarget
     * @param {Function} listener 监听函数
     * @return {Function} 监听函数
     */

    function withinElement(listener) {
        return function(event) {
            var parent = event.relatedTarget;
            while (parent && parent != this) {
                try {
                    parent = parent.parentNode;
                } catch (msg) {
                    break;
                }
            }
            if (parent != this) listener.call(this, event);
        }
    }

    /**
     * @ignore
     * @description 修复event对象的一些兼容性问题。
     * event.target 取得事件目标元素，考虑到IE事件模型跟DOM事件模型的不一样；
     * event.preventDefault 取消事件的默认行为，考虑到IE事件模型跟DOM事件模型的不一样；
     * event.stopPropagation 阻止冒泡流继续冒泡；
     * event.relatedTarget 事件相关元素
     * @param {event} e 事件对象
     * @return {event}
     */

    FS.fixEvent = function(e) {
        // 取消事件的默认行为
        if (!e.preventDefault) {
            e.preventDefault = function() {
                e.returnValue = false;
            }
        }
        // 阻止冒泡流继续冒泡
        if (!e.stopPropagation) {
            e.stopPropagation = function() {
                e.cancelBubble = true;
            }
        }
        // 取得事件目标元素
        if (!e.target) e.target = e.srcElement || document;

        if (e.target.nodeType == 3) e.target = e.target.parentNode;

        // 事件相关元素 主要运用于鼠标时间
        if (!e.relatedTarget && e.fromElement) e.relatedTarget = e.fromElement == e.target ? e.toElement : e.fromElement;

        return e;
    }

    /**
     * @description 校正鼠标相对页面的位置。
     * @param {event} e 事件对象
     * @return {event} 事件对象
     * @example var e = FS.fixMousePos(e);
     */

    FS.fixMousePos = function(e) {
        if (!e.pageX) {
            e.pageX = (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
        }
        if (!e.pageY) {
            e.pageY = (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
        }
        return e;
    }

    /**
     * @description 鼠标移上去和鼠标移开事件
     * @param {Element} node 鼠标移上去的节点
     * @param {Function} fun1 mouseenter的监听事件
     * @param {Function} fun2 mouseleave的监听事件
     * @example
     * var hoverNode = FS('.tuan3_container_lihover', o);
     * FS.hover(o, function() {
     *     FS.show(hoverNode);
     *     }, function() {
     *     FS.hide(hoverNode);
     *  });
     */

    FS.hover = function(node, fun1, fun2) {
        try {
            FS.addEvent(node, 'mouseenter', fun1);
            FS.addEvent(node, 'mouseleave', fun2);
        } catch (msg) {
            FS.error('FS.hover方法出现异常：' + msg);
        }
    }

    /**
     * @description 用于给多个node分别添加处理事件
     * @param {Array|NodeList} nodes 需要绑定处理事件的节点组成的数组
     * @param {String} type 事件类型
     * @param {Function} listener 绑定的处理函数
     * @example FS.nodesAddEvent( FS(.clickClass), 'click', function(){...} )
     */

    FS.nodesAddEvent = function(nodes, type, listener) {
        try {
            // 计算出节点数组的长度
            var length = nodes.length - 1;
            // 倒序循环遍历数组，并给其注册事件。倒序循环效率更高
            for (; length >= 0; length--) {
                FS.addEvent(nodes[length], type, listener);
            }
        } catch (msg) {
            FS.error('FS.nodesAddEvent出现异常：' + msg);
        }
    }

    /**
     * @description 给多个node分别添加处理事件
     * @param {String} selectors 需要添加处理事件的选择器组成的字符串，选择器之间用'，'隔开
     * @param {String} type 事件类型
     * @param {Function} listener 需要注册的事件
     * @example FS.selectorAddEvent('#closed1,#closed2', 'click', function() {
     */

    FS.selectorAddEvent = function(selectors, type, listener) {
        try {
            // 得到由多个选择器组成的数组
            var selectors = selectors.split(',');
            // 计算出选择器数组的长度
            var length = selectors.length - 1;
            // 声明allElements，用于存放各个选择器选出来的所有node
            var allElements = [];
            // 倒序循环遍历选择器数组，将各个选择器选出来的所有node放入allElements数组中
            for (; length >= 0; length--) {
                // 找出该选择器下的所有节点
                var elements = FS(selectors[length]),
                    leng = elements.length - 1;
                // 将该选择器下的所有node放入allElements数组中
                for (; leng >= 0; leng--) {
                    allElements.push(elements[leng]);
                }
            }

            var allLength = allElements.length - 1;

            // 给所有node注册事件
            for (; allLength >= 0; allLength--) {
                if (!allElements[allLength].nodeType) {
                    FS.error('selectAddEvent()方法中node节点的类型不对');
                }
                FS.addEvent(allElements[allLength], type, listener);
            }
        } catch (msg) {
            FS.error('FS.selectorAddEvent方法出现异常:' + msg);
        }
    }

    /**
     * @description 动态创建script，动态创建script元素的重点在于无论何时启动下载，文件的下载和执行过程不会阻塞页面其他进程。
     * @param {String} url script中的url
     * @param {Function} [callback] 加载完外链脚本后的回调函数
     * @example FS.loadScript('http://web01.optimix.asia/events/opxLoader.js',function(){alert(0)});
     */

    FS.loadScript = function(url, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        // 如果传入了回调函数
        if (callback) {
            // IE浏览器
            if (script.readyState) {
                script.onreadystatechange = function() {
                    // 如果script中的js文件下载完成或所有数据已准备就绪，则执行回调函数，从此保证js的顺序
                    if (script.readyState == 'loaded' || script.readyState == 'complete') {
                        script.onreadystatechange = null;
                        callback();
                    }
                }
            } else {
                // 其他浏览器
                script.onload = function() {
                    callback();
                }
            }
        }
        script.src = url;
        // 放在head里比放在body里更保险，当body中的内容没有全部加载完成时，IE可能抛出‘操作已中止’的错误信息
        FS.query('head').appendChild(script);
    }

    /**
     * @description 动态创建iframe，用于注入广告、添加跟踪等代码等
     * @param {Object} options 参数对象     *
     * @param {String} [options.id] : iframe的id,
     * @param {String} [options.src=''] : iframe中的src 默认为'',
     * @param {String} [options.scrolling='no'] : iframe是否有滚动条，默认为no,
     * @param {String} [options.frameborder='0'] : iframe的border，默认为0，
     * @param {String} [options.width='0'] : 默认为'0',
     * @param {String} [options.height='0'] : 默认为'0',
     * @param {String} [options.zIndex='1'] : 默认为'1'
     * @param {Boolean} [options.unInsert] 是否自动插入到document.body，设为true时，不插入到document.body尾部，默认为false,即默认将创建完的iframe插入到body的尾部
     * @return {Element} 返回创建的iframe元素
     * @example
     * FS.createIframe({
     *     id : 'iframe'+maskId,
     *     width : '100%',
     *     height : '100%',
     *     zIndex : '9994'
     * });
     */

    FS.createIframe = function(options) {
        var i = document.createElement('iframe');
        i.src = '';
        i.scrolling = 'no';
        i.frameborder = '0';
        i.width = '0';
        i.height = '0';
        i.marginheight = '0';
        i.marginwidth = '0';
        i.zIndex = '1';
        if (options.id) {
            i.setAttribute('id', options.id);
        }
        if (options.src) {
            i.setAttribute('src', options.src);
        }
        if (options.scrolling) {
            i.setAttribute('scrolling', options.scrolling);
        }
        if (options.frameborder) {
            i.setAttribute('frameborder', options.frameborder);
        }
        if (options.width) {
            i.width = options.width;
        }
        if (options.height) {
            i.height = options.height;
        }
        if (options.zIndex) {
            FS.setCss(i, {
                zIndex: 1
            });
        }
        var unInsert = options.unInsert === true ? true : false;
        // 默认为创建完iframe后，将其插入到body尾部
        if (!unInsert) {
            document.body.appendChild(i);
        }
        return i;
    }

    /**
     * @description 序列化json对象，跟stringify相反。
     * @param {String} data 可转化为json的字符串
     * @return {Object} json对象
     * @example
     * var jsonStr = '{"1":{"size_id":["big","fs"],"goods_num":"101","consign_num":"-1","gl_num":"101"},
     * "2":{"size_id":"2","goods_num":"209","consign_num":"-1","gl_num":"209"},
     * "3":{"size_id":"3","goods_num":"226","consign_num":"-1","gl_num":"226"},
     * "4":{"size_id":"4","goods_num":"185","consign_num":"-1","gl_num":"185"},
     * "5":{"size_id":"5","goods_num":"40","consign_num":"-1","gl_num":"40"}}';
     * var jsonObj = FS.parseJson(jsonStr);
     * console.log(jsonObj);
     */

    FS.parseJson = function(data) {
        try {
            if (typeof data !== "string" || !data) {
                return null;
            }
            // 移除头部和尾部的空白（否则IE无法处理）
            data = data.trim();
            // 确保是一个JSON字符串
            if (/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                // 尝试使用window.JSON.parse解析字符串
                // 如果浏览器不支持window.JSON.parse,则使用new Function转，但IE6/7中当字符串中含有换行（\n）时，new Function不能解析，但eval却可以。
                return window.JSON && window.JSON.parse ? window.JSON.parse(data) : (new Function("return " + data))();
            } else {
                FS.error("Invalid JSON: " + data);
            }
        } catch (msg) {
            FS.error('FS.parseJson方法出现异常：' + msg);
        }
    }

    /**
     * @description 将obj转换成字符串,跟parseJson相反
     * @param  {Object} obj 需要转换的json对象
     * @return {String} 返回一个字符串类型
     * @example
     * var jsonStr = '{"1":{"size_id":["big","fs"],"goods_num":"101","consign_num":"-1","gl_num":"101"},
     * "2":{"size_id":"2","goods_num":"209","consign_num":"-1","gl_num":"209"},
     * "3":{"size_id":"3","goods_num":"226","consign_num":"-1","gl_num":"226"},
     * "4":{"size_id":"4","goods_num":"185","consign_num":"-1","gl_num":"185"},
     * "5":{"size_id":"5","goods_num":"40","consign_num":"-1","gl_num":"40"}}';
     * var jsonObj = FS.parseJson(jsonStr);
     * var str = FS.stringify(jsonObj);
     * console.log(str);
     */

    FS.stringify = function(obj) {
        try {
            // 如果是IE8以上及Firefox,chrome,safari等支持JSON对象的浏览器，使用JSON.tringify()来序列化
            if (window.JSON) {
                return JSON.stringify(obj);
            }
            var type = typeof obj;
            switch (type) {
            case 'string':
            case 'number':
            case 'boolean':
            case 'null':
            case 'undefined':
                return String(obj);
            case 'object':
                var key, value, typeVal, json = [],
                    isArr = FS.isArray(obj);
                // 遍历obj的各个项
                for (key in obj) {
                    value = obj[key];
                    typeVal = typeof(value);
                    // 用hasOwnProperty过滤掉扩展属性
                    if (obj.hasOwnProperty(key)) {
                        // 如果对象的值还是一个对象，则迭代，一层一层拨开
                        if (typeVal === "object") {
                            value = arguments.callee(value);
                        }
                        // 如果是数组的话，直接存入json数组中，如果是对象，则以键值对方式存入
                        json.push((isArr ? "" : '"' + key + '":') + String(value));
                    }
                }
                // 组装成数组或对象字符串
                return (isArr ? "[" : "{") + String(json) + (isArr ? "]" : "}");
            }
        } catch (msg) {
            FS.error('FS.stringify方法出现异常：' + msg);
        }
    }

    /**
     * @description 获取url的host，前面带http://
     * @param {String} [url] 需处理的url,可选项。若传入url参数，则返回该url的host部分，否则返回window.location.href的host部分
     * @example FS.getHost()
     * @example FS.getHost('http://www.fclub.cn/rush-7239.html')
     */

    // FS.getHost = function(url) {
    //     var url = url || window.location.href,
    //         host = url.replace(/^(\w+:\/\/[^/]*)\/?.*$/, '$1');
    //     return host;
    // }
    /**
     * @description 获取url的页面文件，踢掉后缀参数,返回当前页面的文件名
     * @param {String} [url='window.location.href'] 需处理的url,可选项。
     * @return {String} url中域名与'?'之间，如http://www.fclub.cn/goods.php?id=0,则得到goods.php
     * @example FS.subUrl();
     */

    FS.subUrl = function(url) {
        var url = url || window.location.href,
            sUrl = url.lastIndexOf("?") == -1 ? url.substring(url.lastIndexOf("/") + 1) : url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("?"));
        return sUrl;
    }

    /**
     * @description ajax 参数为options对象,对象的各个属性如下。其中不管是get方式还是post方式，都可以用data参数，
     * 如果是get，data将会拼接在url后面，如果是post，则data将会以post的方式发送到服务器端。
     * 如不需要缓存ajax请求，可自行用FS.now()方法取得时间戳，加在url后面;如果服务器端输出格式是json字符串，可以将options.dataType设置为'json'，则ajax方法内部自动将返回的json字符串转化为json对象。
     * @param {Object} options 参数对象
     * @param {String} [options.method='GET'] http方法，如：POST、GET，默认是GET
     * @param {String} options.url 请求的URL地址
     * @param {String} [options.data=null] queryString字符串，多个名值对用&拼接，默认为null
     * @param {Boolean} [options.Async=true] 是否为异步请求，可选参数，true为允许、false为不允许，默认为true
     * @param {Number} [options.timeout=30000] ajax超时时间，默认是30000ms
     * @param {Function} [options.onTimeout] 请求超时时的回调函数，参数为ajax方法中传入的options对象
     * @param {Function} [options.success] Ajax返回成功时的回调函数，参数为responseText,即成功时返回的数据。
     * @param {Function} [options.onError] 请求出错时的回调函数，参数为包含responseText，status及ajax中传入的options组成的obj对象
     * @param {String} [options.dataType] 返回的数据类型，如果是传json，则内部将其转化为json对象格式
     * @param {Boolean} [options.unencode] 制定是否对url参数编码，默认编码，当指定值为true时，不编码
     * @example FS.ajax({
     *        method: 'POST',
     *        url: '/index.php?sex=male&company=fclub&old=dfs',
     *        data : 'good_id=wefw&good_color=red',
     *        async: true,
     *        success: testAjax,
     *        timeout:10000,
     *        onTimeout:function(o){alert(o)}
     *        onError:function(o){alert(o)}
     *    })
     */

    FS.ajax = function(options) {
        try {
            var async = options.async || true,
                method = options.method != null ? options.method.toUpperCase() : options.method || 'GET',
                url = options.url,
                data = options.data || null,
                dataType = options.dataType,
                timeout = options.timeout || 30000,
                isTimeout = false,
                isComplete = false,
                onTimeout = options.onTimeout ||
            function() {}, success = options.success ||
            function() {}, onError = options.onError ||
            function() {};

            // 指定是否对url参数编码，默认编码
            var unencode = options.unencode === true ? true : false;

            // 假如method是GET请求，并且data是有值的
            if (method === 'GET' && data != null) {
                url += (url.indexOf('?') === -1 ? '?' : '&');
                url += data;
            }
            // 假如url是带参数的，则对url中参数的名值对编码，不然GET请求有时会报异常
            // 如果指定为不编码，则不进行编码
            if (url.indexOf('?') !== -1 && !unencode) {
                var params = url.substring(url.indexOf('?') + 1).split('&'),
                    pLength = params.length - 1,
                    param, paramString = '';

                // 将url截到最后一个是？
                url = url.slice(0, url.indexOf('?') + 1);

                // 遍历所有的名值对，对名和值编码，并将各个名值对用&连接起来
                for (; pLength >= 0; pLength--) {
                    param = params[pLength].split('=');
                    paramString += encodeURIComponent(param[0]) + '=' + encodeURIComponent(param[1]) + '&';
                }

                // 截掉最后一个&
                paramString = paramString.slice(0, paramString.length - 1);

                // 将url拼接回去
                url += paramString;
            }

            // 非IE创建xmlHttp对象
            if (window.XMLHttpRequest && window.location.protocol !== "file:") {
                var xmlHttp = new XMLHttpRequest();
            } else if (window.ActiveXObject && window.location.protocol !== "file:") {
                // IE创建xmlHttp对象，其实只有IE6及以下浏览器会通过window.activeXObject创建
                // 因为IE6以上浏览器都支持XMLHttpRequest
                var xmlHttp = new window.ActiveXObject(navigator.userAgent.indexOf("MSIE 5") >= 0 ? "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP");
            }

            if (xmlHttp == null) {
                FS.error('未成功创建XHR对象，ajax方法出现异常！');
            }
            if (url.length == 0) {
                FS.error('发送的url为空，ajax方法出现异常！');
            }
            xmlHttp.onreadystatechange = function() {
                // readyState值为4，表示请求完成，已经接受到全部数据，并已经可以在客户端使用
                if (xmlHttp.readyState == 4) {
                    // 尚未超时时执行
                    if (!isTimeout) {
                        // 判断http状态码
                        // 其中304表示
                        // IE中XHR的ActiveX版本会将204设置为1223
                        // Opera中会在取得204的时候却报告为0
                        if (xmlHttp.status >= 200 && xmlHttp.status < 300 || xmlHttp.status == 304 || xmlHttp.status === 1223 || xmlHttp.status === 0) {
                            if (dataType == 'json') {
                                var jsonObj = FS.parseJson(xmlHttp.responseText);
                                success(jsonObj);
                            } else {
                                success(xmlHttp.responseText);
                            }
                        } else {
                            var obj = {};
                            obj.responseText = xmlHttp.responseText;
                            obj.options = options;
                            obj.status = xmlHttp.status;
                            onError(obj);
                        }
                    }
                    // 执行完成
                    isComplete = true;
                    // 删除对象,节省内存
                    xmlHttp = null;
                }
            }
            // 打开链接
            xmlHttp.open(method, url, async);
            // 设置编码集
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlHttp.send(data);
            // 如果超时了，执行超时时的回调函数
            window.setTimeout(function() {
                // 如果还没有complete，及上面还没有执行，则执行超时和执行完成时的回调函数
                if (!isComplete) {
                    isTimeout = true;
                    onTimeout(options);
                }
            }, timeout);
        } catch (msg) {
            FS.error('FS.ajax方法出现异常：' + msg);
        }
    }

    /**
     * 执行ajax加载过来的script代码块，此方法不适用于返回的html有外部js引用的情况
     * @param  {String} html html字符串
     */

    // FS.runScript = function(html) {
    //     // 匹配script代码块正则
    //     var regScript = /<script[^>]*>([^\x00]+)$/i;
    //     // 对整段html片段按</script>拆分
    //     var htmlBlock = html.split(/<\/script[$>]/i),
    //         length = htmlBlock.length;
    //     var scriptBlocks;
    //     for (var i = 0; i < length; i++) {
    //         //匹配正则表达式的内容数组，blocks[1]就是真正的一段脚本内容，因为前面reg定义我们用了括号进行了捕获分组
    //         scriptBlocks = htmlBlock[i].match(regScript);
    //         if(scriptBlocks){
    //             //清除可能存在的注释标记，对于注释结尾-->可以忽略处理，eval一样能正常工作
    //             var codeScript = scriptBlocks[1].replace(/<!--/, '');
    //             try {
    //                 //执行脚本
    //                 eval(codeScript)
    //             } catch (msg) {
    //                 FS.error('FS.runScript方法出现异常：' + msg)
    //             }
    //         }
    //     }
    // }
    /**
     * @description 跨域请求
     * @param  {Object} options 参数对象
     * @param {String} [url] 远程url
     * @param {String} [callback] 回调函数名，不允许是匿名函数，回调函数的参数格式统一为json对象
     * @example
     * function handleResponse(response){
     *     console.log(response);
     * }
     * FS.jsonp({
     *     url : 'http://www.fclub.cn?name=Hoogle',
     *     callback : 'handleResponse'
     * });
     * 服务端：
     * $data = '{"Name":"Hoogle", "Id" : 1988, "Rank": 1}';
     * echo $_GET['callback']."(".$data.")";
     */

    FS.jsonp = function(options) {
        try {
            var url = options.url,
                success = options.success;

            //如果url本来就是带参数的，则后面加'&'，否则加'?'
            url.indexOf('?') > 0 ? url += '&' : url += '?';

            //将回调函数拼接到后面
            url += 'callback=' + success;
            //创建script，发送请求
            FS.createScript(url);
        } catch (msg) {
            FS.error('FS.jsonp方法出现异常：' + msg);
        }
    }

    /**
     * @description 给node节点添加class样式
     * @param {Element} node 需要添加class样式的ELEMENT
     * @param {String} classname 类名
     * @example FS.addClass(picElements[0],'main');
     * @example FS.addClass(picElements[0],'main centerdiv');
     */

    FS.addClass = function(node, classname) {
        // 如果不是Dom节点  return false
        if (!node.nodeType) {
            FS.error(node + '节点的类型不对');
        } else {
            // 如果已经存在class样式，则加空格再追加新classname，否则直接加classname
            node.className += (node.className ? ' ' : '') + classname;
        }
    }

    /**
     * @description 找到node上的所有 class样式
     * @param {Element} node 需要getclass的ELEMENT
     * @return {String} 所有className组成的字符创
     * @example FS.getClass(FS.query('.footer'))
     */

    FS.getClass = function(node) {
        // 如果不是Dom节点,抛出异常
        if (!node.nodeType) {
            FS.error('node节点的类型不对');
        } else {
            // 先将任意多个空格替换为一个空格
            // 返回class样式的数组，如果没有class样式，则返回一空数组，如果有多个，则返回一个className数组
            return node.className.replace(/\s+/, ' ').split(' ');
        }
    }

    /**
     * @description 设置元素的class属性,设置后，node之前的class将全部被classname替换掉
     * @param {Element} node 元素
     * @param {String} classname class 名称
     */
    FS.setClass = function(node, classname) {
        node.className = classname;
    }

    /**
     * @description 判断node是否存在某class样式
     * @param {Element} node 需要判断的ELEMENT
     * @param {String} classname class样式
     * @return {Boolean}
     * @example FS.hasClass(numElements[i],'main')
     */

    FS.hasClass = function(node, classname) {
        // 如果不是Dom节点,抛出异常
        if (!node.nodeType) {
            FS.error('node节点的类型不对');
        }
        // 先取得该node的class样式数组，再遍历查找是否存在
        var classes = FS.getClass(node),
            length = classes.length;
        for (var i = 0; i < length; i++) {
            if (classes[i] === classname) {
                return true;
            }
        }
    }

    /**
     * @description 移除样式 class样式
     * @param {Element} node 需要移除样式的ELEMENT
     * @param {String} classname 类名
     * @example FS.removeClass(picElements[0],'main');
     */

    FS.removeClass = function(node, classname) {
        // 如果不是Dom节点,抛出异常
        if (!node.nodeType) {
            FS.error('node节点的类型不对');
        } else {
            // 先取得该节点的所有class样式，再遍历每个class样式，找到相同的则移除
            var classes = FS.getClass(node);
            var length = classes.length;
            // 删掉数组中的项会让数组长度越来越短  因此用你循环
            for (var i = length - 1; i >= 0; i--) {
                if (classes[i] === classname) {
                    delete(classes[i]);
                }
            }
            // 将修改后的className赋给node
            node.className = classes.join(' ');
            return (length == classes.length ? false : true);
        }
    }

    /**
     * @description 将node节点的oldClass样式替换成newClass样式
     * @param {Element} node 需要替换class样式的节点元素
     * @param {String} oldClass 旧class样式
     * @param {String} newClass 新的class样式
     * @example FS.replaceClass(currentNode, 'old', 'now');
     */

    FS.replaceClass = function(node, oldClass, newClass) {
        if (!node.nodeType) {
            FS.error('node节点的类型不对');
        } else {
            FS.removeClass(node, oldClass);
            FS.addClass(node, newClass);
        }
    }

    /**
     * @description 切换样式node节点的class样式，如果节点上有classname样式，则移除，没有则添加。
     * @param {Element} node 需要切换样式的ELEMENT
     * @param {String} classname 类名
     * @example FS.toggleClass(FS.query('#current'), 'now')
     */

    FS.toggleClass = function(node, classname) {
        // 如果传入的不是node，抛出异常
        if (!node.nodeType) {
            FS.error('toggleClass()方法中node节点的类型不对');
        } else if (FS.hasClass(node, classname)) {
            // 如果存在该class样式，则删除
            FS.removeClass(node, classname);
        } else {
            // 如果不存在该class样式，则添加
            FS.addClass(node, classname);
        }
    }

    /**
     * @description 切换是否可见
     * @param {Element} node 需要切换的节点
     * @param {String} value 想要切换到的值，如'block'、'none'
     * @example FS.toggleDisplay(FS.query('#nav'),'block')
     */

    FS.toggleDisplay = function(node, value) {
        // 如果传入的不是node，抛出异常
        if (!node.nodeType) {
            FS.error('toggleDisplay()方法中node节点的类型不对');
        }
        // 如果没有被隐藏，则隐藏，否则display值设为参数value
        var oldDisplay = FS.getStyle(node, 'display');
        if (oldDisplay !== "none") {
            node.style.display = 'none'
        } else {
            node.style.display = value || '';
        }
        return true;
    }

    /**
     * @description 循环数组中所有Element节点，判断元素是否含有样式classname，如果有，则删掉，最后再给当前节点加上该classname样式
     * @param {Array|NodeList} arrayNode 节点数组
     * @param {Number} current 当前节点在数组中的索引
     * @param {String} classname 需要添加的class样式
     * @example FS.currentOver(liArr, targetIndex, 'liSelected');
     */

    FS.currentOver = function(arrayNode, current, classname) {
        for (var i = 0, l = arrayNode.length; i < l; i++) {
            if (arrayNode[i].className.indexOf(classname) != -1) {
                arrayNode[i].className = arrayNode[i].className.replace(classname, '');
            }
        }
        arrayNode[current].className = arrayNode[current].className.replace(/\s$/g, '') + ' ' + classname;
    }

    /**
     * @description 取出selector的样式
     * @param {Element} node node节点
     * @param {String} css属性
     * @example parseInt(FS.getStyle(contentParent, 'height'))
     */

    FS.getStyle = function(node, styles) {
        try {
            var value;
            if (styles == "float") {
                document.defaultView ? styles = 'float' /*cssFloat*/
                : styles = 'styleFloat';
            }
            value = node.style[styles] || node.style[styles.camelize()];
            if (!value) {
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    var css = document.defaultView.getComputedStyle(node, null);
                    value = css ? css.getPropertyValue(styles) : null;
                } else {
                    if (node.currentStyle) {
                        value = node.currentStyle[styles.camelize()];
                    }
                }
            }
            if (value == "auto" && ["width", "height"].contains(styles) && node.style.display != "none") {
                value = node["offset" + styles.capitalize()] + "px";
            }
            if (styles == "opacity") {
                try {
                    value = node.filters['DXImageTransform.Microsoft.Alpha'].opacity;
                    value = value / 100;
                } catch (e) {
                    try {
                        value = node.filters('alpha').opacity;
                    } catch (msg) {}
                }
            }
            return value == "auto" ? null : value;
        } catch (msg) {
            FS.error('FS.getStyle方法出现异常' + msg);
        }
    }

    /**
     * @description 给selector设置样式
     * @param {Element|selector|Array|NodeList} selector 可以是node节点，可以是选择器，也可以是node节点数组
     * @param {Object} prop 属性对象
     * @example FS.setCss(FS('img')[0], { position:'absolute', left:'0', top:'0', border:'0', display:'none'});
     * @example FS.setCss('#iframe'+maskId, { position:'absolute', left:'0', top:'0', border:'0', display:'none'});
     * @example FS.setCss(FS('img'), { position:'absolute', left:'0', top:'0', border:'0', display:'none'});
     */

    FS.setCss = function(selector, prop) {
        try {
            // 如果传入的是节点元素，则直接给节点设置样式
            if (selector.nodeType) {
                // 遍历名值对
                for (var i in prop) {
                    selector.style[i] = prop[i];
                }
            } else {
                // 如果第一个参数是String类型，则是传入的选择器，否则是dom元素数组
                if (typeof(selector) === 'string') {
                    var nodes = FS(selector);
                } else {
                    // 第一个参数传入的是dom元素数组
                    var nodes = selector;
                }

                // 声明length变量记得加var 去掉var将容易出错
                var length = nodes.length - 1;

                for (; length >= 0; length--) {
                    // 遍历名值对
                    for (var i in prop) {
                        nodes[length].style[i] = prop[i];
                    }
                }
            }
        } catch (msg) {
            FS.error('FS.setCss方法出现异常，可能是' + selector + '中有节点为定义：' + msg);
        }
    }

    /**
     * @description 隐藏某节点,需隐藏多个节点的话用逗号分割，同时可以隐藏数组中的所有节点
     * @param {Element|NodeList|Array} arguments 需要隐藏的节点，可以一下隐藏多个节点
     * @example  FS.hide(FS(options.maskId)[0],FS('#iframe'+maskId)[0]);
     * @example  FS.hide(FS('select'),FS('#iframe'+maskId)[0]);
     * @example  FS.hide(document.images);
     */

    FS.hide = function() {
        try {
            var arg = arguments,
                length = arg.length - 1;
            for (; length >= 0; length--) {
                // 如果参数是节点数组或元素集合，则隐藏数组中的所有元素
                if (arg[length] == null) {
                    continue;
                } else if (FS.isArray(arg[length]) || arg[length].item) {
                    var leng = arg[length].length - 1;
                    for (; leng >= 0; leng--) {
                        var argArr = arg[length][leng];
                        if (FS.notNode(argArr)) {
                            // 如果传入的不是node，继续下一个节点元素
                            continue;
                        }
                        argArr.style.display = 'none'
                    }
                } else if (FS.notNode(arg[length])) {
                    // 如果传入的不是node，继续下一个节点元素
                    continue;
                } else {
                    arg[length].style.display = 'none';
                }
            }
        } catch (msg) {
            FS.error('FS.hide方法出现异常' + msg);
        }
    }

    /**
     * @description 显示某节点，需显示多个节点的话用逗号分割，同时可以显示数组中的所有节点
     * @param {Element|NodeList|Array} arguments 需要显示的节点，可以一下显示多个节点，多个节点用逗号隔开
     * @example  FS.show(FS(options.maskId)[0],FS('#iframe'+maskId)[0]);
     * @example  FS.show(FS('select'),FS('#iframe'+maskId)[0]);
     * @example  FS.show(document.images);
     */

    FS.show = function() {
        try {
            var arg = arguments,
                length = arg.length - 1;
            for (; length >= 0; length--) {
                // 如果参数是节点数组，则隐藏数组中的所有元素
                if (arg[length] == null) {
                    continue;
                } else if (FS.isArray(arg[length]) || arg[length].item) {
                    var leng = arg[length].length - 1;
                    for (; leng >= 0; leng--) {
                        var argArr = arg[length][leng];
                        if (FS.notNode(argArr)) {
                            // 如果传入的不是node，继续下一个节点元素
                            continue;
                        }
                        argArr.style.display = 'block'
                    }
                } else if (FS.notNode(arg[length])) {
                    // 如果传入的不是node，继续下一个节点元素
                    continue;
                } else {
                    arg[length].style.display = 'block';
                }
            }
        } catch (msg) {
            FS.error('FS.show方法出现异常' + msg);
        }
    }

    /**
     * @description 获取水平滚动条距离左侧的距离，即文档被拉下的距离. 兼容不同的文档模式
     * @return {Number} 水平滚动条距离顶部的距离
     * @example FS.getScrollLeft()
     */

    FS.getScrollLeft = function() {
        return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
    }

    /**
     * @description 获取垂直滚动条距离顶部的距离，即文档被拉下的距离. 兼容不同的文档模式
     * @return {Number} 垂直滚动条距离顶部的距离
     * @example FS.getScrollTop()
     */

    FS.getScrollTop = function() {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    }

    /**
     * @description 获取window的宽度，兼容不同的文档模式
     * @return {Number} 返回窗口的宽度
     * @example FS.getWindowWidth()
     */

    FS.getWindowWidth = function() {
        // 设定初始值0，防止返回undefined
        var width = 0;
        if (window.innerWidth) {
            width = window.innerWidth;
            return width;
        } else if ((document.documentElement) && (document.documentElement.clientWidth)) {
            width = document.documentElement.clientWidth;
            return width;
        }
        return width;
    }

    /**
     * @description 获取window的高度，兼容不同的文档模式
     * @return {Number} 返回窗口的高度
     * @example FS.getWindowHeight()
     */

    FS.getWindowHeight = function() {
        // 设定初始值0，防止返回undefined
        var height = 0;
        if (window.innerHeight) {
            height = window.innerHeight;
        } else if ((document.documentElement) && (document.documentElement.clientHeight)) {
            height = document.documentElement.clientHeight;
        }
        return height;
    }

    /**
     * @description 取得document的宽度
     * @return {Number} 返回页面的宽度
     * @example FS.getPageWidth()
     */

    FS.getPageWidth = function() {
        var body = document.body,
            html = document.documentElement,
            client = document.compatMode == 'BackCompat' ? body : document.documentElement;

        return Math.max(html.scrollWidth, body.scrollWidth, client.clientWidth);
    }

    /**
     * @description 取得document的高度
     * @return {Number} 返回页面的高度
     * @example FS.getPageHeight()
     */

    FS.getPageHeight = function() {
        var body = document.body,
            html = document.documentElement,
            client = document.compatMode == 'BackCompat' ? body : document.documentElement;

        return Math.max(html.scrollHeight, body.scrollHeight, client.clientHeight);
    }

    /**
     * @description 取得元素到body顶部/左侧的距离
     * @param {Element} node 节点元素
     * @param {String} [pos='top'] 要取的Offset的位置，left或top，默认为top
     * @return {Number}
     * @example FS.getOffset(node);
     * @example FS.getOffset(node, 'left')
     */

    FS.getOffset = function(node, pos) {
        // 如果传入的不是node，抛出异常
        if (!node.nodeType) {
            FS.error('getOffsetTop()方法中node节点的类型不对');
        }
        var position = pos || 'top';
        // 特殊处理display为none的隐藏元素，由于正常情况下无法获取隐藏元素的offsetTop，但可以获取visibility为hidden的offsetTop.
        var displayOld = FS.getStyle(node, 'display');
        if (displayOld === 'none') {
            // 现将元素的visibility和position属性存起来，一边后面恢复原始属性
            var visibilityOld = FS.getStyle(node, 'visibility'),
                positionOld = FS.getStyle(node, 'position');
            FS.setCss(node, {
                display: 'block',
                visibility: 'hidden',
                position: 'absolute'
            });
        }

        // 如果position为top，则取得元素距离页面顶部的距离，否则就是到页面左侧的距离
        if (position === 'top') {
            var actualTop = node.offsetTop,
                current = node.offsetParent;

            // 保证获取到的高度是到顶部的距离
            while (current !== null) {
                actualTop += current.offsetTop;
                current = current.offsetParent;
            }
        } else {
            var actualLeft = node.offsetLeft,
                current = node.offsetParent;

            // 保证获取到的高度是到顶部的距离
            while (current !== null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
        }

        // 将一开始的样式恢复
        if (displayOld === 'none') {
            FS.setCss(node, {
                display: displayOld,
                visibility: visibilityOld,
                position: positionOld
            });
        }

        // 如果position是top，则返回到顶部的距离，否则返回到左侧的距离。
        if (position === 'top') {
            return actualTop;
        }
        return actualLeft;
    }

    /**
     * @description 设置node的透明度，兼容不同的浏览器
     * @param {Element} node 需要设置透明度的element
     * @param {Number} deep 透明度 为0到1的小数
     * @example FS.opacity(FS.query('#mask'), 0.8);
     */

    FS.opacity = function(node, deep) {
        // 如果传入的不是node，抛出异常
        if (!node.nodeType) {
            FS.error('opacity()方法中node节点的类型不对');
        }
        // IE浏览器设置透明度
        if (window.ActiveXObject) {
            node.style.filter = 'alpha(opacity=' + deep * 100 + ')';
        } else {
            // IE以外的浏览器设置透明度
            node.style.opacity = deep;
        }
    }

    /**
     * @description 渐变 淡入效果
     * @param {Element} node 需要渐变的节点
     * @param {Number} [start=0] 初始透明度 默认为0
     * @param {Number} [end=1] 最终透明度 默认为1
     * @param {Number} [speed=1000] 渐变完成的时间 默认为1000ms
     * @example FS.fadeIn(inArea)
     * @example FS.fadeIn(inArea, 0.1, 0.9, 2000)
     */

    FS.fadeIn = function(node, start, end, speed) {
        // 如果传入的不是node，抛出异常
        if (!node.nodeType) {
            FS.error('fadeIn()方法中node节点的类型不对');
        }
        // 默认时间段为1000ms
        if (speed === undefined) {
            speed = 1000;
        }
        // 默认start为0
        if (start === undefined) {
            start = 0;
        }
        // 默认end为0
        if (end === undefined) {
            end = 1.0;
        }

        // startTime 动画开始时间
        // endTime 动画结束时间        
        var startTime = FS.now(),
            endTime = startTime + speed;

        // 不断设置透明度，达到渐变的目的
        // setInterval的时间间隔为speed/1000ms，如是1000ms，则每1ms执行一次
        var fadeInId = window.setTimeout(function() {
            window.clearTimeout(fadeInId);
            fadeInId = null;
            // curTime 当前时间
            // elapsed 当前时间与开始时间之差
            // curVal 计算当前帧的值
            var curTime = FS.now(),
                elapsed = curTime - startTime,
                curVal = FS.easeIn(elapsed, start, end - start, speed);

            // 设置当前帧的透明度
            FS.opacity(node, curVal);

            // 时间到了，则直接设置为最终的透明度
            if (curTime >= endTime) {
                FS.opacity(node, end);
                return;
            } else {
                fadeInId = window.setTimeout(arguments.callee, 13);
            }
        }, 13);
    }

    /**
     * @description 渐变 淡出效果
     * @param {Element} node 需要渐变的节点
     * @param {Number} [start=1] 初始透明度 默认为1
     * @param {Number} [end=0] 最终透明度 默认为0
     * @param {Number} [speed=1000] 渐变完成的时间 默认为1000ms
     * @example FS.fadeOut(inArea, 0.95, 0.1, 2000)
     */

    FS.fadeOut = function(node, start, end, speed) {
        // 如果传入的不是node，抛出异常
        if (!node.nodeType) {
            FS.error('fadeOut()方法中node节点的类型不对');
        }
        // 默认时间段为1000ms
        if (speed === undefined) {
            speed = 1000;
        }
        // 默认start为0
        if (start === undefined) {
            start = 1.0;
        }
        // 默认end为0
        if (end === undefined) {
            end = 0;
        }
        // startTime 动画开始时间
        // endTime 动画结束时间  
        var startTime = FS.now(),
            endTime = startTime + speed;

        // 不断设置透明度，达到渐变的目的
        // setInterval的时间间隔为speed/1000ms，如是1000ms，则每1ms执行一次
        var fadeOutId = window.setTimeout(function() {
            window.clearTimeout(fadeOutId);
            fadeOutId = null;
            // curTime 当前时间
            // elapsed 当前时间与开始时间之差
            // curVal 计算当前帧的值
            var curTime = FS.now(),
                elapsed = curTime - startTime,
                curVal = FS.easeOut(elapsed, start, end - start, speed);

            // 设置当前帧的透明度
            FS.opacity(node, curVal);
            // 时间到了，则直接设置为最终的透明度
            if (curTime >= endTime) {
                FS.opacity(node, end);
                return;
            } else {
                fadeOutId = window.setTimeout(arguments.callee, 13);
            }
        }, 13);
    }

    /**
     * @description 动画效果
     * @param {Element} node 需要滑动的element元素数组
     * @param {String} attr 实现动画需要改变的属性 有width、height、left、top、scrollTop
     * @param {Number} start 开始值
     * @param {Number} end 结束值
     * @param {Number} [speed=1000] 动画完成的时间，默认是1000ms
     * @example FS.slide(inArea, 'height', minHeight, maxHeight, 300);
     * @example FS.slide(outArea, 'height', maxHeight, minHeight, 300);
     * @example FS.slide(FS('#mainTopBoxMsg')[0], 'height', 25, 0, 500);
     * @example FS.slide(window, 'scrollTop', FS.getScrollTop(), 0 , 200);
     */

    FS.slide = function(node, attr, start, end, speed) {
        // 如果传入的不是node，抛出异常
        if (FS.notNode(node)) {
            FS.error('slide()方法中node节点的类型不对');
        }
        // 默认时间段为1000ms
        if (speed === undefined) {
            speed = 1000;
        }

        // startTime 动画开始时间
        // endTime 动画结束时间
        var startTime = FS.now(),
            endTime = startTime + speed;

        // 不断设置属性值，达到动画的目的
        // setInterval的时间间隔为speed/1000ms，如是1000ms，则每1ms执行一次
        // 用了easeOut算法
        var slideId = window.setTimeout(function() {
            window.clearTimeout(slideId);
            slideId = null;
            // curTime 当前时间
            // elapsed 当前时间与开始时间之差
            // curVal 计算当前帧的值
            var curTime = FS.now(),
                elapsed = curTime - startTime,
                curVal = FS.easeInOut(elapsed, start, end - start, speed);

            // 将当前帧的值设置为当前高度
            switch (attr) {
            case 'width':
                FS.setCss(node, {
                    width: curVal + 'px'
                });
                break;
            case 'height':
                FS.setCss(node, {
                    height: curVal + 'px'
                });
                break;
            case 'left':
                FS.setCss(node, {
                    left: curVal + 'px'
                });
                break;
            case 'top':
                FS.setCss(node, {
                    top: curVal + 'px'
                });
                break;
            case 'scrollTop':
                window.scrollY = node.document.documentElement.scrollTop = node.document.body.scrollTop = curVal;
                break;
            }
            // 时间到了，则直接设置为最终的值
            if (curTime >= endTime) {
                switch (attr) {
                case 'width':
                    FS.setCss(node, {
                        width: curVal + 'px'
                    });
                    break;
                case 'height':
                    FS.setCss(node, {
                        height: end + 'px'
                    });
                    break;
                case 'left':
                    FS.setCss(node, {
                        left: end + 'px'
                    });
                    break;
                case 'top':
                    FS.setCss(node, {
                        top: end + 'px'
                    });
                    break;
                case 'scrollTop':
                    window.scrollY = node.document.documentElement.scrollTop = node.document.body.scrollTop = end;
                    break;
                }
                return;
            } else {
                slideId = window.setTimeout(arguments.callee, 13);
            }
        }, 13);
    }

    /**
     * @description 取得cookie值
     * @param {String} sName  cookie名称
     * @return {String} cookie值
     * @example FS.getCookie('ECS[user_id]');
     */

    FS.getCookie = function(sName) {
        try {
            // 将cookie字符串用'；'分割成数组
            var aCookie = document.cookie.split("; "),
                length = aCookie.length;
            for (var i = 0; i < length; i++) {
                // 将键值对用'='隔开
                var aCrumb = aCookie[i].split("=");
                // 如果找到了这个cookie名称，则返回cookie的值
                if (sName == aCrumb[0]) return decodeURIComponent(aCrumb[1]);
            }
            // 没有此cookie
            return null;
        } catch (msg) {
            FS.error('FS.getCookie方法出现异常：' + msg);
        }
    }

    /**
     * @description 设置cookie值
     * @param {String} sName  cookie名称
     * @param {String} sValue cookie值
     * @param {Date} [sExpires] 过期时间，可选参数
     * @example FS.setCookie('displayNotice', '1', new Date(nextDay));
     */

    FS.setCookie = function(sName, sValue, sExpires) {
        try {
            var sCookie = sName + "=" + encodeURIComponent(sValue);
            if (sExpires != null && (sExpires instanceof Date)) {
                sCookie += "; expires=" + sExpires.toGMTString();
            }
            document.cookie = sCookie;
        } catch (msg) {
            FS.error('FS.setCookie方法出现异常：' + msg);
        }
    }

    /**
     * @description 删除cookie值
     * @param {String} sName  cookie名称
     * @example FS.removeCookie('displayNotice')
     */

    FS.removeCookie = function(sName) {
        try {
            document.cookie = sName + "=; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
        } catch (msg) {
            FS.error('FS.removeCookie方法出现异常：' + msg);
        }
    }

    /**
     * @description 让节点水平、垂直方向均居中于浏览器
     * @param {Element} node [description]
     * @example FS.layerCenter(FS('#pop')[0])
     */

    FS.layerCenter = function(node) {
        if (!node.nodeType) {
            FS.error('layerCenter方法中节点类型不对！');
        }

        // 先获取到node的高度和宽度，以便后面设置负margin
        // 注意，如果node是display的，则无法获取到offsetWidth和offsetHeight
        var width = node.offsetWidth,
            height = node.offsetHeight;
        FS.setCss(node, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: '-' + width / 2 + 'px',
            marginTop: '-' + height / 2 + 'px'
        });
    }

    /**
     * @description 查找和获取元素的html内容
     * @param {Element | NodeList | Array} node 需要获取内部html内容的节点
     * @param {String} [val] 设置node的html内容，如果没有传这个参数，就是获取node的html内容
     * @example FS.html(FS('#play_list')[0])
     * @example FS.html(FS('#play_list')[0],'aaa')
     * @example FS.html(FS('#play_list'),'aaa')
     */

    FS.html = function() {
        try {
            var length = arguments.length;
            // 如果只有一个node节点参数
            if (length === 1 && arguments[0].nodeType) {
                // 返回该节点的内部html内容
                return arguments[0].innerHTML;
            }
            // 如果传入了两个参数，第一个是node节点或node节点数组，第二个是需要设置的字符串
            if (arguments.length === 2 && (typeof arguments[1] === 'string')) {
                if (arguments[0].nodeType) {
                    arguments[0].innerHTML = arguments[1];
                    return;
                } else if (FS.isArray(arguments[0]) || arguments[0].item) {
                    var leng = arguments[0].length;
                    for (var i = 0; i < leng; i++) {
                        arguments[0][i].innerHTML = arguments[1];
                    }
                }
            }
        } catch (msg) {
            FS.error('FS.html方法出现异常：' + msg);
        }
    }

    /**
     * @description 查找和设置元素的自定义属性值
     * @param {Element} node 需要获取或设置自定义属性的节点
     * @param {String} 自定义属性
     * @param {String | Number} 自定义属性值
     * @example FS.attr(FS('#play_list')[0], 'rid');
     * @example FS.attr(FS('#play_list')[0],'rid',5);
     */
    FS.attr = function() {
        var args = arguments,
            length = args.length;
        if (length === 2 && args[0].nodeType && FS.isString(args[1])) {
            return args[0].getAttribute(args[1]);
        } else if (length === 3 && args[0].nodeType && FS.isString(args[1]) && args[2]) {
            args[0].setAttribute(args[1], args[2]);
        } else {
            FS.error("传入的参数错误！");
        }
    }

    /**
     * @description forEach方法，遍历object参数，并给它每一项运行特定的函数。
     * @param {Array|object|String} object 数组、类数组(如元素集合、函数内部arguments对象，元素的attributes值、元素的classList值)、对象、字符串
     * @param {Function} block 给定的特定函数
     * @param {Object} [context] block函数的执行环境
     * @param {Array|object} fn
     * @see 参考：<a href="http://www.cnblogs.com/rubylouvre/archive/2009/11/10/1599978.html" target="_blank">http://www.cnblogs.com/rubylouvre/archive/2009/11/10/1599978.html</a>
     * @example function print(el,index){alert(index+"  :  "+el)} 第一个参数是value,第二个参数是key
     * @example FS.forEach ([1, 2, 3], function(el){alert(el)});
     * @example FS.forEach ({a: "aa", b: "bb",c: "cc"}, print);
     * @example FS.forEach ("http://www.fclub.cn", print);
     * @example FS.forEach(document.styleSheets,function(el){if(el.href) alert(el.href)});
     */

    FS.forEach = function(object, block, context, fn) {
        try {
            if (object == null) return;
            if (!fn) {
                if (typeof object == "function" && object.call) {
                    //遍历普通对象
                    fn = Function;
                } else if (typeof object.forEach == "function" && object.forEach != arguments.callee) {
                    //如果目标已经实现了forEach方法，则使用它自己的forEach方法（如标准浏览器的Array对象）
                    object.forEach(block, context);
                    return;
                } else if (typeof object.length == "number") {
                    // 如果是类数组对象(如元素集合)或数组对象
                    arrayForEach(object, block, context);
                    return;
                }
            }
            functionForEach(fn || Object, object, block, context);
        } catch (msg) {
            FS.error('FS.forEach方法出现异常：' + msg);
        }
    }

    /**
     * @ignore
     * @param array 需要遍历的字符串或数组、类数组(如元素集合、函数内部arguments对象，元素的attributes值、元素的classList值)
     */

    function arrayForEach(array, block, context) {
        if (array == null) return;
        var i = 0,
            length = array.length;
        if (typeof array == "string") {
            for (; i < length; i++) {
                block.call(context, array.charAt(i), i, array);
            }
        } else {
            for (; i < length; i++) {
                block.call(context, array[i], i, array);
            }
        }
    }

    /**
     * @ignore
     */

    function functionForEach(fn, object, block, context) {
        for (var key in object) {
            //只遍历本地属性
            if (object.hasOwnProperty(key)) {
                block.call(context, key, object[key], object);
            }
        }
    }

    /**
     * @ignore
     * @description 属性计算算法 （Tween算法）
     * @see 参考：http://www.cnblogs.com/cloudgamer/archive/2009/01/06/Tween.html、http://www.cnblogs.com/bluedream2009/archive/2010/06/19/1760909.html
     * @param  {Number} t 当前时间戳与开始时间戳之差
     * @param  {Number} b 开始时间戳
     * @param  {Number} c 变化量
     * @param  {Number} d 持续时间
     * @return {Number}   当前帧的值
     * @example
     * var curTime = FS.now(),
     * elapsed = curTime - startTime,
     * curVal = easeOut(elapsed, start, end-start, speed);
     */

    FS.easeOut = function(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    }

    /**
     * @ignore
     * @description 属性计算算法 （Tween算法）
     * @see 参考：http://www.cnblogs.com/cloudgamer/archive/2009/01/06/Tween.html、http://www.cnblogs.com/bluedream2009/archive/2010/06/19/1760909.html
     * @param  {Number} t 当前时间戳与开始时间戳之差
     * @param  {Number} b 开始时间戳
     * @param  {Number} c 变化量
     * @param  {Number} d 持续时间
     * @return {Number}   当前帧的值
     * @example
     * var curTime = FS.now(),
     * elapsed = curTime - startTime,
     * curVal = easeIn(elapsed, start, end-start, speed);
     */

    FS.easeIn = function(t, b, c, d) {
        return c * (t /= d) * t + b;
    }

    /**
     * @ignore
     * @description 属性计算算法 （Tween算法）
     * @see 参考：http://www.cnblogs.com/cloudgamer/archive/2009/01/06/Tween.html、http://www.cnblogs.com/bluedream2009/archive/2010/06/19/1760909.html
     * @param  {Number} t 当前时间戳与开始时间戳之差
     * @param  {Number} b 开始时间戳
     * @param  {Number} c 变化量
     * @param  {Number} d 持续时间
     * @return {Number}   当前帧的值
     * @example
     * var curTime = FS.now(),
     * elapsed = curTime - startTime,
     * curVal = easeInOut(elapsed, start, end-start, speed);
     */

    FS.easeInOut = function(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }

    /**
     * @description DomReady方法
     * @see jQuery、karma-0.2.js、http://www.cnblogs.com/zhangziqiu/archive/2011/06/27/domready.html
     * @param  {Function} fn  需要Dom一加载完成就执行的方法，通常接一匿名函数，若有多个方法，可将多个方法放入匿名函数中。
     * @param  {Object}   win document的父对象，如window、iframe的名称。
     * @example
     * FS.ready(function(){
     *     alert(FS.html(FS.query('.main_white_normal')));
     * });
     */

    FS.ready = function(fn, win) {
        try {
            // 将window、document定义成局部变量
            var win = win || window,
                doc = win.document,
                isReady = false;
            var init = function() {
                    // 如果该方法已经被执行过了，则return
                    if (isReady) {
                        return;
                    }
                    isReady = true;
                    // 执行预执行的方法
                    fn.apply(doc, arguments);
                    win = null;
                    doc = null;
                }
                // DOM2级事件模型，Mozilla, Opera, webkit等支持DOMContentLoaded方法的浏览器，直接用DOMContentLoaded判断。
            if (doc.addEventListener) {
                doc.addEventListener("DOMContentLoaded", init, false);
            } else if (/WebKit/i.test(navigator.userAgent)) {
                (function() {
                    if (/loaded|complete/.test(doc.readyState)) {
                        init();
                    } else {
                        setTimeout(arguments.callee, 50);
                        return;
                    }
                })();
            } else if (doc.documentElement.doScroll) {
                (function() {
                    try {
                        doc.documentElement.doScroll('left');
                    } catch (e) {
                        setTimeout(arguments.callee, 50);
                        return;
                    }
                    init();
                })();
            }
        } catch (msg) {
            FS.error('FS.ready方法出现异常：' + msg);
        }
    }

    /**
     * @description 获取addDayCount天后的日期
     * @param  {Number} addDayCount
     * @return {String} addDayCount天后的日期
     */

    FS.getDateStr = function(addDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + addDayCount);
        //获取addDayCount天后的日期
        var y = dd.getFullYear(),
            //获取当前月份的日期
            m = dd.getMonth() + 1,
            d = dd.getDate();
        return y + "/" + m + "/" + d;
    }

    /**
     * @description 让IE6缓存背景图片,否则执行onscroll事件的时候，容易不断引发一些请求。
     * @example FS.ieCache();
     */

    FS.ieCache = function() {
        if (FS.isIE6()) {
            try {
                document.execCommand("BackgroundImageCache", false, true);
            } catch (e) {}
        }
    }

    /**
     * @description 如果是IE6并且页面中存在select下拉框，隐藏页面中所有的select，以解决select的z-index的问题
     * @example FS.hideSelect()
     */

    FS.hideSelect = function() {
        if (FS.isIE6() && FS('select').length > 0) {
            FS.hide(FS('select'));
        }
    }

    /**
     * @description 如果是IE6并且页面中存在select下拉框，显示页面中所有的select，以解决select的z-index的问题
     * @example FS.showSelect()
     */

    FS.showSelect = function() {
        if (FS.isIE6() && FS('select').length > 0) {
            FS.show(FS('select'));
        }
    }

    /**
     * @description 如果是IE6浏览器，并且页面中存在select，则创建一透明iframe。所有遮罩层罩不住select的问题都由这个iframe来解决
     * @example FS.createSelectIframe();
     */
    FS.createSelectIframe = function() {
        // 如果是IE6浏览器，并且页面中存在select
        if (FS.isIE6() && FS('select').length > 0) {
            // 如果当前没有iframe，则创建，否则不创建。网站所有页面因为弹出层遮不住select的问题都由这个透明iframe来解决。
            if (!FS('#iframeSelect')[0]) {
                var iframeHeight = FS.getPageHeight() + 'px';
                FS.createIframe({
                    id: 'iframeSelect',
                    width: '100%',
                    height: iframeHeight
                });
                var frameObj = FS.query('#iframeSelect');
                // 给iframe设置样式
                FS.setCss(frameObj, {
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    border: '0',
                    display: 'block'
                });
                // 将iframe的透明度设为0
                FS.opacity(frameObj, 0);
            }
            FS.show(frameObj);
        }
    }

    /**
     * @description 隐藏iframeSelect(IE6浏览器中因为弹出层无法遮掉select而创建的透明iframe)
     * @example FS.hideSelectIframe()
     */
    FS.hideSelectIframe = function() {
        // 如果是IE6并且页面中存在select下拉框，则动态创建一透明的覆盖全屏的iframe，以遮住select.
        if (FS.isIE6() && FS('select').length > 0 && FS('#iframeSelect')[0] != null) {
            FS.hide(FS('#iframeSelect')[0]);
        }
    }

    /**
     * 返回FS对象,将FS对象暴露出去
     */
    return FS;
}(window, document));