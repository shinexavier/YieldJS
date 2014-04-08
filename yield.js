Array.prototype.iterator = function (fn) {
    "use strict";
    var that = {};
    that.inputSequence = this;
    that.length = that.inputSequence.length;
    that.outputSequence = [];
    that.yieldIndex = -1;
    that.isYieldEmpty = function () {
        return ((that.yieldIndex + 1) === that.inputSequence.length);
    };
    that.yieldX = function () {
        that.yieldIndex += 1;
        return fn(that.inputSequence[that.yieldIndex]);
    };
    return that;
};
function print(x) {
    "use strict";
    console.log(x * x);
}

//Test Harness
var x = [2, 3, 4, 5, 2, 3, 4, 1];
var continuation = x.iterator(print);
while (!continuation.isYieldEmpty()) {
continuation.yieldX();
}
