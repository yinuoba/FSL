/** 
 * FSL (Feishang Javascript Library) 
 * Copyright (c) 2012, All rights reserved.
 *
 * @fileOverview Feishang Javascript Library components
 * @version 1.0
 * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
 * 
 * @description 星级评分插件 鼠标移动到星上，星的状态发生变化，根据星的数量，判断是哭脸还是笑脸，并可在设置玩笑脸后执行回调函数
 */
FS.extend(FS, function() {
	/**
	 * @description 星级评分插件 鼠标移动到星上，星的状态发生变化，根据星的数量，判断是哭脸还是笑脸，并可在设置玩笑脸后执行回调函数
	 * @param {Object} options 参数对象
	 * @param {Element} options.parentObj 星的父节点
	 * @param {Number} [options.cryNum=2] 表示当小于cryNum(包括)时，显示哭脸,默认为2
	 * @param {String} [options.smile='smile'] 笑脸的class样式，默认为"smile"
	 * @param {String} [options.cry='cry'] 哭脸的class样式，默认为"cry"
	 * @param {Function} [options.clickFun=function(){}] 鼠标点击星后的回调函数,默认以当前分数（星数）作为参数,默认为一空函数
	 * @example
	 * var goods_rate = new FS.star({
			parentObj: FS.query('#goods_rate'),
			clickFun: function(i){
				FS.consoleInfo("已选中" + i + "颗星")
			}
		})
	 */	
	var star = function(options){
		// 直接返回一个对应的实例
		return new star.main(options)
	}
	star.main = function(options) {
			// 将this赋给self，方便混淆
			var self = this;
			// 取出参数列表
			self.parentObj = options.parentObj;
			self.cryNum = options.cryNum || 2;
			self.smile = options.smile || 'smile';
			self.cry = options.cry || 'cry';
			self.clickFun = options.clickFun || function(){};

			// 根据parentObj计算出星节点数组
			self.allStar = FS.makeArray(self.parentObj.children);

			// 实例创建即执行
			self.init();
		}
	star.main.prototype = {
		constructor: star.main,
		init: function(){
			var mine = this;
			var allStar = mine.allStar,
				length = allStar.length,
				cryNum = mine.cryNum;

			// 取得当前笑脸或哭脸数量,以便鼠标未点击并移开后恢复状态
			mine.nowNum = 0;

			// 给星节点数组添加事件
			allStar.each(function(o,i){
				// 鼠标移入和移出，星做出相应的变化
				FS.hover(o,function(){
					// 取得从开始到当前节点的星数组
					var hoverObj = allStar.slice(0,i+1);
					// 当前索引之后的节点设为正常星
					var normalObj = allStar.slice(i+1);
						mine.setNormal(normalObj);
					// 鼠标移到星上，根据当前索引数给星加笑脸或哭脸
					mine.setMode(hoverObj);
				},function(){
					// 先取出当前评分及评分数组
					var nowNum = mine.nowNum,
						nowObj = allStar.slice(0, nowNum);
					
					// 设置笑脸或哭脸
					mine.setMode(nowObj);

					// 设置正常星
					if(nowNum>0){
						var normalObj = allStar.slice(nowNum);
						mine.setNormal(normalObj);
					}else{
						mine.setNormal(allStar);
					}					
				});

				// 鼠标点击星，改变this.nowNum,并改变状态
				FS.addEvent(o, 'click', function(e){
					mine.nowNum = i + 1;
					mine.clickFun(mine.nowNum);
				});
			})
		},
		setMode: function(arr){	//传入设置笑脸或哭脸
			if(!arr[0]) return;
			var mine = this;
			var cryNum = mine.cryNum,
				length = arr.length;
			if(length>cryNum){
				this.setSmile(arr)
			}else{
				this.setCry(arr);
			}
		},
		setNormal: function(arr){	// 将笑脸或哭脸设置成正常的星
			if(!arr[0]) return;
			arr.each(function(o){
				FS.setClass(o, '')
			});
		},
		getNowNum: function(){	// 得到当前笑脸或哭脸的数量
			var mine = this;
			var nowNum = 0,
				smileClass = mine.smile,
				cryClass = mine.cry,
				allStar = mine.allStar;
			allStar.each(function(o){
				if(FS.hasClass(o, smileClass) || FS.hasClass(o, cryClass)){
					nowNum++
				}
			});
			return nowNum;
		},
		setSmile: function(arr){	// 将节点数组中的星设置为笑脸
			if(!arr[0]) return;
			var smileClass = this.smile;
			arr.each(function(o){
				FS.setClass(o, smileClass)
			});
		},
		setCry: function(arr){	// 将节点数组中的星设置为哭脸
			if(!arr[0]) return;
			var cryClass = this.cry;
			arr.each(function(o){
				FS.setClass(o, cryClass)
			});
		}
	}

	return {
		star: star
	}
}());