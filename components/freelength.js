/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 键盘释放，计算文本框（域）的剩余可输入字符数量
 */

FS.extend(FS, function(){
	/**
	 * @description 键盘释放，计算文本框（域）的剩余可输入字符数量
	 * @param  {Object} options 参数对象
	 * @param {Element} options.inputSelector  文本框（域）的选择器，只能输入一个选择器
	 * @param {Element} [options.lengthSelector]  显示剩余字数的节点
	 * @param {Number} options.maxLength 可输入的最大字符数
	 */
	var freeLength = function(options){
		var inputSelector = options.inputSelector,
			lengthSelector = options.lengthSelector,
			maxLength = options.maxLength;

		// inputObj 文本框对象
		// freeObj 存放剩余数量的节点
		var inputObj = FS.query(inputSelector),
			freeObj = FS.query(lengthSelector);

		// 计算方法
		var checkLength = function(inputNode, freeNode, maxLeng){
			var nowLength = inputNode.value.length,
				freeNum = parseInt(maxLeng) - nowLength;
				if(freeNode){
					FS.html(freeNode, String(freeNum));
				}
				
			// 如果通过复制粘贴等途径导致文本框文字超过最大数量，则直接截断
			if(freeNum <= 0){
				inputNode.value = inputNode.value.slice(0,maxLeng);
				if(freeNode){
					FS.html(freeNode, "0");
				}
			}
		}
		// 键盘释放，检查剩余数量
		FS.addEvent(inputObj, 'keyup', function(){
			checkLength(this, freeObj, maxLength)
		})
	}
	return {
		freeLength: freeLength
	}
}());