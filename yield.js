Array.prototype.getIterator = function () {
    "use strict";
    var that = {},
		curry = function (fn) {
			var slice = Array.prototype.slice;
			return function () {
				return fn.apply(null, slice.apply(arguments));
			};
		},
		getFuncCtxt = function (fnIndex, input) {
			var funcCtxt = that.fnContexts[fnIndex];
			if (funcCtxt === undefined) {
				funcCtxt = {
					"input" : input,
					"outputSequence" : []
				};
				that.fnContexts[fnIndex] = funcCtxt;
			} else {
				funcCtxt.input = input;
			}
			return funcCtxt;
		},
		isYieldEmpty = function () {
			return ((that.yieldIndex + 1) === that.inputSequence.length);
		},
		yieldX = function () {
			var args = arguments,
				resultX = null;
			function core() {
				var i,
					result = null,
					fn = null,
					fnCtxt = null,
					evalSkipped = false,
					slice = Array.prototype.slice;
				that.yieldIndex += 1;
				result = that.inputSequence[that.yieldIndex];
				if (args.length > 0) {
					for (i = 0; i < args.length; i += 1) {
						fn = args[i];
						fnCtxt = getFuncCtxt(i, result);
						result = fn.call(fnCtxt);
						if (result === null) {
							evalSkipped = true;
							break;
						} else {
							fnCtxt.outputSequence.push(result);
						}
					}
					if (result !== null) {
						that.outputSequence.push(result);
					}
					return result;
				} else {
					return that.inputSequence[that.yieldIndex];
				}
			}
			while ((resultX === null) && (!that.isYieldEmpty())) {
				resultX = core();
			}
			return resultX;
		};
    that.fnContexts = [];
    that.inputSequence = this;
    that.length = that.inputSequence.length;
    that.outputSequence = [];
    that.yieldIndex = -1;
    that.isYieldEmpty = isYieldEmpty;
    that.yieldX = yieldX;
    return that;
};

//Test Harness
function unique() {
    "use strict";
    if (this.outputSequence.indexOf(this.input) < 0) {
        return this.input;
    } else {
        return null;
    }
}

function square() {
    "use strict";
    return (this.input * this.input);
}

var x = [2, 3, 4, 5, 2, 3, 4, 1];
var continuation = x.getIterator();
while (!continuation.isYieldEmpty()) {
    console.log(continuation.yieldX(unique,square,square));
}
