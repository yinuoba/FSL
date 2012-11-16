(function() {
    /**
     * ok
     */
    module("group ok");
    test("test ok", function() {
        ok(true, "true succeeds");
    });

    /**
     * deepEqual
     */
    module("group deepEqual");
    test("deepEqual test", function() {
        var obj = {
            foo: "bar"
        };
        deepEqual(obj, {
            foo: "bar"
        }, "Two objects can be the same in value");
    });

    /**
     * expect
     */
    module("group expect");
    test("a test", function() {
        expect(2);

        function calc(x, operation) {
            return operation(x);
        }

        var result = calc(5, function(x) {
            ok(true, "calc() calls operation function");
            return x * x;
        });

        equal(result, 25, "25 square equals 4");
    });

    /**
     * moudle
     */
    module("group ok");
    test("a basic test example", function() {
        ok(true, "this test is fine");
    });
    test("a basic test example 2", function() {
        ok(true, "this test is fine");
    });


    //定义测试模块
    module("group simpleTest");
    //定义一个简单的函数，判断参数是不是数字
    function simpleTest(para) {
        if(typeof para == "number") {
            return true;
        } else {
            return false;
        }
    }
    //开始单元测试
    test('simpleTest()', function() {
        //列举各种可能的情况，注意使用 ! 保证表达式符合应该的逻辑
        ok(simpleTest(2), '2是一个数字');
        ok(!simpleTest("2"), '"2"不是一个数字');
    });

    //异步测试
    module("group asynchronous");
    //setTimeout
    test('asynchronous test', function() {
        // 暂停测试
        stop();

        setTimeout(function() {
            ok(true, '完成运行');
            //待测试完成后，恢复
            start();
        }, 100)
    })
    //另一种形式
    asyncTest('asynchronous test', function() {
        setTimeout(function() {
            ok(true);
            //待测试完成后，恢复
            start();
        }, 100)
    })

}());