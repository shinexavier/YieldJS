/*The MIT License (MIT)

Copyright (c) 2014 Shine Xavier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

Array.prototype.getIterator = function () {
    "use strict";
    var that = {},
    getFunctionContext = function (fnIndex, input) {
        var fnContext = that.fnContexts[fnIndex];
        if (fnContext === undefined) {
            fnContext = {
				"index" : 0,
                "current" : input,
                "outList" : []
            };
            that.fnContexts[fnIndex] = fnContext;
        } else {
            fnContext.current = input;
			fnContext.index += 1;
        }
        return fnContext;
    },
    isYieldEmpty = function () {
        return ((that.yieldIndex + 1) === that.inList.length);
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
            result = that.inList[that.yieldIndex];
            if (args.length > 0) {
                for (i = 0; i < args.length; i += 1) {
                    fn = args[i];
                    fnCtxt = getFunctionContext(i, result);
                    result = fn.call(fnCtxt);
                    if (result === null) {
                        break;
                    } else {
                        fnCtxt.outList.push(result);
                    }
                }
				if (result !== null) {
					that.outList.push(result);
					that.current = result;
				}
				return result;
            } else {
                that.current = that.inList[that.yieldIndex];
				that.outList.push(that.current);
				return that.current;
            }
        };
        while ((yieldedResult === null) && (!isYieldEmpty())) {
            yieldedResult = core();
        }
        return (yieldedResult !== null) ? true : false;
    };
    that.fnContexts = [];
    that.inList = this;
    that.length = that.inList.length;
    that.outList = [];
    that.yieldIndex = -1;
    that.current = null;
    that.moveNext = moveNext;
    return that;
};

//Test Harness
function unique() {
    "use strict";
    if (this.outList.indexOf(this.current) < 0) {
        return this.current;
    } else {
        return null;
    }
}

function square() {
    "use strict";
    return (this.current * this.current);
}

function filter(condition) {
	"use strict";
	return function () {
		return condition(this.current) ? this.current : null; 
	};
}

function even(val) {
	"use strict";
	return (val % 2 === 0);
}

function skip(count) {
	"use strict";
	return function () {
		//console.log(this.index.toString() + " : " + this.current.toString());
		return ((this.index % (count+1)) === 0) ? this.current : null;
	};
}

var x = [1,2,3,200,1,2,3,200],
	continuation = x.getIterator();

while (continuation.moveNext(filter(even))) {
    //console.log(continuation.current);
	continuation.current;
}
console.log(continuation.outList);
