(function() {
	/**
	 * 测试基本方法
	 */
	module("Basic requirements");
	test("Basic requirements", function() {
		expect(7);
		ok(Array.prototype.push, "Array.push()");
		ok(Array.prototype.slice, "Array.slice()");
		ok(Function.prototype.apply, "Function.apply()");
		ok(document.getElementById, "getElementById");
		ok(document.getElementsByTagName, "getElementsByTagName");
		ok(RegExp, "RegExp");
		ok(FS, "FS");
	});

	
}());