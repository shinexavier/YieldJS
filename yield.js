Array.prototype.getIterator = function () {
    "use strict";
    var that = {},
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
	current = null,
    moveNext = function () {
        var args = arguments,
        yieldedResult = null,
        core = function () {
            var i,
            result = null,
            fn = null,
            fnCtxt = null;
            that.yieldIndex += 1;
            result = that.inputSequence[that.yieldIndex];
            if (args.length > 0) {
                for (i = 0; i < args.length; i += 1) {
                    fn = args[i];
                    fnCtxt = getFuncCtxt(i, result);
                    result = fn.call(fnCtxt);
                    if (result === null) {
                        break;
                    } else {
                        fnCtxt.outputSequence.push(result);
                    }
                }
				if (result !== null) {
					that.outputSequence.push(result);
					that.current = result;
				}
				return result;
            } else {
                that.current = that.inputSequence[that.yieldIndex];
				that.outputSequence.push(that.current);
				return that.current;
            }
        };
        while ((yieldedResult === null) && (!isYieldEmpty())) {
            yieldedResult = core();
        }
        return (yieldedResult !== null) ? true : false;
    };
    that.fnContexts = [];
    that.inputSequence = this;
    that.length = that.inputSequence.length;
    that.outputSequence = [];
    that.yieldIndex = -1;
    that.current = null;
    that.moveNext = moveNext;
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

function filter() {
	"use strict";
	return (this.input % 2 === 0) ? this.input : null; 
}

function skip1() {
	"use strict";
	if (this.hasOwnProperty('count')) {
		this.count += 1;
	} else {
		this.count = 0;
	}
	return (this.count % 2 !== 0) ? this.input : null; 
}

var x = [1,2,3,200,null,1,2,3,200],
	continuation = x.getIterator();

while (continuation.moveNext(unique,skip1)) {
    console.log(continuation.current);
}
console.log(continuation.outputSequence);
