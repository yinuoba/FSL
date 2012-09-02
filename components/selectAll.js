/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description checkbox全选
 */

FS.extend(FS, function(){
	/**
	 * @description checkbox全选功能
	 * @param  {Object} options 参数对象
	 * @param {Element} options.allObj 全选checkbox对象 
	 * @param {String} options.signal 单选框的选择器
	 * @param {Boolean} [options.toggleChecked] 若为true，则点击全选，切换单选框的选中状态；若为false或为传值，点击全选，checkbox要么全选中，要么全未选中。
	 * @param {Function} [options.checkedFun] 单选框被选中置为true后的回调函数,参数为当前checkbox对象
	 * @param {Function} [options.uncheckedFun] 单选框被置为false后的回调函数
	 */
	var selectAll = function(options){
		var allObj = options.allObj,
			signalObjs = FS(options.signal),
			toggleChecked = options.toggleChecked,
			checkedFun = options.checkedFun || function(){},
			uncheckedFun = options.uncheckedFun || function(){};

		// 未选中的checkbox的数量
		var unCheckedLength = 0;

		// 给全选框添加click事件
		FS.addEvent(allObj, 'click', function(e){
			// 点击全选，切换checkbox的选中状态
			if(toggleChecked){
				// 勾上全选，所有单选框选中，并执行回调函数
				signalObjs.each(function(o){
					if(!o.checked){
						o.checked = true;
						checkedFun(o);
					}else{
						o.checked = false;
						uncheckedFun(o);
					}
				});
			}else{
				// 点击全选，要么全选中，要么全部选中
				if(allObj.checked){
					// 勾上全选，所有单选框选中，并执行回调函数
					signalObjs.each(function(o){
						o.checked = true;
						checkedFun(o);
					});
				}else{
					// 不勾上全选，单选框补选中，并执行回调函数
					signalObjs.each(function(o){
						o.checked = false;
						uncheckedFun(o);
					});
				}
			}
		});

		// 给单选框添加click事件
		FS.nodesAddEvent(signalObjs, 'click', function(e){
			// 处理单选框单击事件，并在单击后执行回调函数
			if(this.checked){
				this.checked = true;
				checkedFun(this);
			}else{
				this.checked = false;
				uncheckedFun(this);
			}

			// 存放未选中的checkbox
			var uncheck = [];
			// 每点击一下单选框，计算一下尚未选中的单选框的数量
			signalObjs.each(function(chk){
				if(!chk.checked){
					uncheck.push(chk);
				}
			});
			unCheckedLength = uncheck.length;

			// 判断全选是否需要勾上
			if(unCheckedLength==0){
				// 如果都已经选中了，全选勾上
				allObj.checked = true;
			}else{
				// 如果未全部选中，全选不勾
				allObj.checked = false;
			}
		})
	};

	return {
		selectAll: selectAll
	}
}());