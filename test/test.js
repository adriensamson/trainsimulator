var test = (function () {
    var allTests = {};
    var test = {};
    function addTests(namespace, tests) {
        allTests[namespace] = tests;
    }
    function runAll() {
        var namespace, testName;
        for (namespace in allTests) {
            if (allTests.hasOwnProperty(namespace)) {
                for (testName in allTests[namespace]) {
                    if (allTests[namespace].hasOwnProperty(testName)) {
                        try {
                            allTests[namespace][testName]();
                            test.reportSuccess(namespace, testName);
                        } catch (e) {
                            test.reportFailure(namespace, testName, e);
                        }
                    }
                }
            }
        }
    }
    
    test.assertEquals = function (val1, val2) {
        if (val1 !== val2) {
            throw 'Failed asserting that '+val1+' is '+val2;
        }
    };
    test.assertTrue = function (val) {test.assertEquals(val, true);};
    test.assertFalse = function (val) {test.assertEquals(val, false);};
    test.addTests = addTests;
    test.runAll = runAll;
    test.reportSuccess = function(){};
    test.reportFailure = function(){};
    return test;
})();