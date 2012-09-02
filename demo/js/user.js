(function() {
	// 支付宝合并 删除账户相关
	// 账户账户节点数组
	var alipay_zh = FS('.merge_zhanghu');
	if (alipay_zh[0] != null) {
		// 遍历每一个账户
		alipay_zh.each(function(o) {
			// 鼠标放到账户的那一行，显示删除账户按钮
			FS.hover(o, function() {
				FS.show(FS.query('.zhanghu_del', o));
			}, function() {
				FS.hide(FS.query('.zhanghu_del', o));
			});
			// 点击删除账户
			FS.addEvent(FS.query('.zhanghu_del', o), 'click', function() {
				var no_order_num = parseInt(FS.html(FS.query('.no_finish', o))),
					yue_num = parseInt(FS.html(FS.query('.yue', o)));
				// 如果账户有未完结订单或余额，则提示不能删除，否则提示删除后不可恢复
				if (no_order_num > 0 || yue_num > 0) {
					FS.show(FS.query('#del_tip1'));
				} else {
					FS.show(FS.query('#del_tip2'));
				}
			})
		});
		// 关闭弹窗
		FS.selectorAddEvent('.close_alert, .later_del, .confirms', 'click', function() {
			FS.hide(FS('.del_tip'));
		});
	}

	/**
	 *  注册登录 相关表单验证
	 */

	// 处理未通过验证的表单

	function dealError(pwdObj, inputOk, inputWrong, wrongMsgObj, msg) {
		// 如果表单输入的字符数量不在6至16个字符之间，则提示此项必填，边框变红
		FS.hide(inputOk);
		FS.html(wrongMsgObj, msg);
		FS.setCss(pwdObj, {
			borderColor: '#f00'
		});
		FS.show(inputWrong)
	}

	// 处理通过验证的表单

	function dealRight(inputObj, inputOk, inputWrong) {
		// 验证通过，边框颜色恢复，错误提示隐藏，输入正确表示显示
		FS.setCss(inputObj, {
			borderColor: '#989898'
		});
		FS.show(inputOk);
		FS.hide(inputWrong);
	}

	// 注册、登录 用户名文本框 验证
	// userObj 注册用户文本框
	// loginUser 登录用户文本框
	var userObj = FS.query('#reg_user'),
		loginUser = FS.query('#login_user');

	// 最初表单中的提示文字
	var oldUser = userObj != null ? userObj.value : null,
		oldLoginUser = loginUser != null ? loginUser.value : null;

	// 验证用户名，传入需要检测的input对象
	// first {Boolean} 可选参数 表示页面初始化
	function checkUser(inputObj, first) {
		// 取得用户名文本框及文本框的当前值
		var username = inputObj.value;

		if (username == oldUser || username == oldLoginUser) {
			inputObj.value = username;
		}

		// 获取错误输入提示信息的父节点
		var userParent = inputObj.parentNode.parentNode,
			inputOk = FS.query('.tips_correct', userParent),
			inputWrong = FS.query('.tips_wrong', userParent),
			wrongMsgObj = inputWrong.getElementsByTagName('b');

		// 如果用户名是邮箱或手机号码，继续验证用户名是否已被使用
		if (username.isEmail() || username.isMobile()) {
			// ajax验证用户名是否已被使用
			FS.ajax({
					method: 'get',
					url: '/user/check_user',
					data: 'login_user='+username,
					async: true,
					success: function( result ){
						var resultObj = FS.parseJson(result);
						if (resultObj.exist === 1) {
							dealError(inputObj, inputOk, inputWrong, wrongMsgObj, '此帐号已存在，请重新输入！');
							return false
						} else {
							dealRight(inputObj, inputOk, inputWrong);
							// 注册表单中，用户名表单失去焦点，自动将焦点转到密码表单
							if (inputObj == userObj) {
								FS.query('#reg_pwd').focus();
							}
							return true;
						}
					}
				});
		} else if (username.trimAll() === '') {
			// 输入为空，则提示此项必填
			dealError(inputObj, inputOk, inputWrong, wrongMsgObj, '此项为必填项！')
			return false
		} else if (username == 'Email地址或者手机号码' && first) {
			// 初次加载，并且表单的值还是最初的提示文字
			return false
		} else {
			// 输入验证不通过
			dealError(inputObj, inputOk, inputWrong, wrongMsgObj, '请输入有效的Email地址或手机号码！');
			return false
		}
	}

	// 当焦点在用户帐号表单上，按enter，清空密码
	FS.addEvent(FS.query('#reg_user'), 'keydown', function(e) {
		window.setTimeout(function() {
			if (e.keyCode == 13) {
				FS.query('#reg_pwd').value = ''
			}
		}, 1000)
	})

	// 当刷新表单时，由于IE中只有在页面载入后才会将表单缓存设置为表单value，故必须放在ready方法中
	FS.ready(function() {
		// 页面刚载入时的检测
		if (userObj) {
			checkUser(userObj, true)
		}
		if (loginUser) {
			checkUser(loginUser, true)
		}
	});

	// 鼠标失去焦点，验证用户名
	var blurCheckUser = function() {
			// 取得当前input节点
			var inputObj = arguments[0];
			// 验证input的输入
			checkUser(inputObj);
		}

	FS.toogleText('#reg_user,#login_user', {
		blurFun: blurCheckUser,
		backTip: false,
		fadeText: 'Email地址或者手机号码',
		focusFade: false
	})

	/**
	 * 验证用户密码
	 */

	// user_pwd 用户密码框，包括注册页面和登录页面的密码框
	// reg_pwd 注册密码框
	// confirm_pwd 确认密码框
	// login_pwd 登录密码框
	var user_pwd = FS.query('.user_pwd'),
		reg_pwd = FS.query('#reg_pwd'),
		confirm_pwd = FS.query('#confirm_pwd'),
		login_pwd = FS.query('#login_pwd');
	// 验证密码
	var blurCheckPwd = function() {
			// 取得当前input节点
			var pwdObj = arguments[0];

			// 获取错误输入提示信息的父节点
			var userParent = pwdObj.parentNode.parentNode,
				inputOk = FS.query('.tips_correct', userParent),
				inputWrong = FS.query('.tips_wrong', userParent),
				wrongMsgObj = inputWrong.getElementsByTagName('b');

			// 获取密码框中的value
			var pwdValue = pwdObj.value,
				length = pwdValue.length;
			if (length === 0) {
				dealError(pwdObj, inputOk, inputWrong, wrongMsgObj, '此项为必填项！');
				if (confirm_pwd) {
					confirm_pwd.setAttribute('disabled', true);
				}
				return false
			} else if (length < 6) {
				dealError(pwdObj, inputOk, inputWrong, wrongMsgObj, '密码太短，请输入6-16位非中文字符！');
				if (confirm_pwd) {
					confirm_pwd.setAttribute('disabled', true);
				}
				return false
			} else if (length > 16) {
				dealError(pwdObj, inputOk, inputWrong, wrongMsgObj, '密码太长，请输入6-16位非中文字符！');
				if (confirm_pwd) {
					confirm_pwd.setAttribute('disabled', true);
				}
				return false
			} else if (/.*[\u4e00-\u9fa5]+.*$/.test(pwdValue)) {
				dealError(pwdObj, inputOk, inputWrong, wrongMsgObj, '密码不能含有中文！');
				if (confirm_pwd) {
					confirm_pwd.setAttribute('disabled', true);
				}
				return false
			} else {
				// 输入正确
				dealRight(pwdObj, inputOk, inputWrong);
				// 如果包含确认密码节点，即注册
				if (confirm_pwd) {
					confirm_pwd.removeAttribute('disabled');
				}
				return true;
			}
		}

		// 注册注册表单不记住密码
	if (reg_pwd) {
		FS.ready(function() {
			reg_pwd.value = ''
		})
	}

	// 给设置密码文本框添加keyup事件，让其在键盘释放的时候就知道是否输入正确，并及时将重复密码文本框设为可用状态
	FS.addEvent(reg_pwd, 'keyup', function() {
		blurCheckPwd(this)
	})

	FS.toogleText('#reg_pwd,#login_pwd', {
		blurFun: blurCheckPwd
	})


	/**
	 * 验证确认密码
	 */
	var confirmPwd = function() {
			var confirmObj = arguments[0],
				confirmValue = confirmObj.value;

			// 获取错误输入提示信息的父节点
			var userParent = confirmObj.parentNode.parentNode,
				inputOk = FS.query('.tips_correct', userParent),
				inputWrong = FS.query('.tips_wrong', userParent),
				wrongMsgObj = inputWrong.getElementsByTagName('b');

			if (reg_pwd.value !== confirmValue) {
				dealError(confirmObj, inputOk, inputWrong, wrongMsgObj, '两次密码输入不一致！');
				return false;
			} else {
				dealRight(confirmObj, inputOk, inputWrong);
				return true;
			}
		}
	if (confirm_pwd) {
		FS.toogleText('#confirm_pwd', {
			blurFun: confirmPwd
		})
	}


	/**
	 * 检测验证码
	 */
	var testObj = FS.query('#yzma');
	var testCheck = function() {
			var textObj = arguments[0];
			var testValue = testObj.value;

			// 获取错误输入提示信息的父节点
			var userParent = testObj.parentNode.parentNode,
				inputOk = FS.query('.tips_correct', userParent),
				inputWrong = FS.query('.tips_wrong', userParent),
				wrongMsgObj = inputWrong.getElementsByTagName('b');

			// ajax比较验证码是否正确
			FS.ajax({
					method: 'get',
					url: '/user/check_user',
					data: 'login_user='+username,
					async: true,
					success: function( result ){
						var resultObj = FS.parseJson(result);
						if (resultObj.correct === 0) {
							dealError(testObj, inputOk, inputWrong, wrongMsgObj, '验证码输入错误！');
							return false;
						} else {
							// 校验验证码正确
							dealRight(testObj, inputOk, inputWrong);
							return true;
						}
					}
				});
		}
	if (testObj) {
		FS.toogleText('#yzma', {
			blurFun: testCheck
		})
	}

	/**
	 * 是否同意服务协议验证
	 */	
	var agreeLabel = FS.query('#tongyi'),
		agreeTip = FS.query('#recive_tip');

	// 载入页面时，重置checkbox为未选中状态
	if (agreeLabel) {
		agreeLabel.checked = false;
	}

	var agreeCheck = function() {
			if (!agreeLabel.checked) {
				agreeTip.style.display = 'inline'
				return false;
			} else {
				FS.hide(agreeTip);
				return true;
			}
		}
	if (agreeLabel && agreeTip) {
		agreeCheck();
		// 给checkbox注册单击事件
		FS.addEvent(agreeLabel, 'click', agreeCheck);
	}

	// 注册跟登录的提交按钮
	var subFormReg = FS.query('#sub_form_reg'),
		subFormLogin = FS.query('#sub_form_login'),
		tongyi = FS.query('#tongyi');

	// 给注册表单的提交按钮添加事件
	if (subFormReg) {
		FS.addEvent(subFormReg, 'click', function() {
			var pwdObj = FS.query('#reg_pwd'),
				confirmObj = FS.query('#confirm_pwd');
			if (checkUser(userObj) && blurCheckPwd(pwdObj) && confirmPwd(confirmObj) && testCheck(testObj) && agreeCheck()) {
				FS.query('#formReg').submit();
			}
		})
	}
	// 给登录表单的提交按钮添加事件
	if (subFormLogin) {
		FS.addEvent(subFormLogin, 'click', function() {
			if (checkUser(loginUser) && blurCheckPwd(login_pwd)) {
				FS.query('#formLogin').submit();
			}
		})
	}
}());
