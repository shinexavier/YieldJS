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
    var inList = this,
		it = {},
		fnContexts = [],
		yieldIndex = -1,
		getFunctionContext = function (fnIndex, input) {
			var fnContext = fnContexts[fnIndex];
			if (fnContext === undefined) {
				fnContext = {
					"index" : 0,
					"current" : input,
					"outList" : []
				};
				fnContexts[fnIndex] = fnContext;
			} else {
				fnContext.current = input;
				fnContext.index += 1;
			}
			return fnContext;
		},
		isYieldEmpty = function () {
			return ((yieldIndex + 1) === inList.length);
		},
		moveNext = function () {
			var args = arguments,
			yieldedResult = null,
			core = function () {
				var i,
				result = null,
				fn = null,
				fnCtxt = null,
				returnVal = null;
				yieldIndex += 1;
				result = inList[yieldIndex];
				if (args.length > 0) {
					for (i = 0; i < args.length; i += 1) {
						fn = args[i];
						fnCtxt = getFunctionContext(i, result);
						result = fn.call(null, fnCtxt);
						if (result === null) {
							break;
						} else {
							fnCtxt.outList.push(result);
						}
					}
					if (result !== null) {
						it.outList.push(result);
						it.current = result;
					}
					returnVal = result;
				} else {
					it.current = inList[yieldIndex];
					it.outList.push(it.current);
					returnVal = it.current;
				}
				return returnVal;
			};
			while ((yieldedResult === null) && (!isYieldEmpty())) {
				//Recursive call to find the next non-null value
				yieldedResult = core();
			}
			return (yieldedResult !== null) ? true : false;
		},
		iterate = function () {
			var slice = Array.prototype.slice;
			while (moveNext.apply(null, slice.apply(arguments))) {
				//Force chained evaluation of continuation methods (if any).
			}
			return it.outList;
		},
		reset = function () {
			fnContexts.length = 0;
			fnContexts = [];
			yieldIndex = -1;
			it.outList.length = 0;
			it.outList = [];
			it.current = null;
		};
    it.length = inList.length;
    it.outList = [];
    it.current = null;
    it.moveNext = moveNext;
    it.iterate = iterate;
    it.reset = reset;
    return it;
};

Function.prototype.getGenerator = function (setCount1) {
    "use strict";
    var fnGen = this,
		numberOfElements = setCount1,
		slice = Array.prototype.slice,
		gen = {},
		fnContexts = [],
		yieldIndex = -1,
		getFunctionContext = function (fnIndex, input) {
			var fnContext = fnContexts[fnIndex];
			if (fnContext === undefined) {
				fnContext = {
					"index" : 0,
					"current" : input,
					"outList" : []
				};
				fnContexts[fnIndex] = fnContext;
			} else {
				fnContext.current = input;
				fnContext.index += 1;
			}
			return fnContext;
		},
		isYieldEmpty = function () {
			return ((yieldIndex + 1) === numberOfElements);
		},
		moveNext = function () {
			var args = arguments,
			yieldedResult = null,
			core = function () {
				var i,
				result = null,
				fn = null,
				fnCtxt = null;
				yieldIndex += 1;
				result = fnGen.apply(null, []);
				if (args.length > 0) {
					for (i = 0; i < args.length; i += 1) {
						fn = args[i];
						fnCtxt = getFunctionContext(i, result);
						result = fn.call(null, fnCtxt);
						if (result === null) {
							break;
						} else {
							fnCtxt.outList.push(result);
						}
					}
					if (result !== null) {
						gen.current = result;
					}
				} else {
					gen.current = result;
				}
				return result;
			};
			while ((yieldedResult === null) && (!isYieldEmpty())) {
				//Recursive call to find the next non-null value
				yieldedResult = core();
			}
			return (yieldedResult !== null) ? true : false;
		},
		generate = function () {
			var outList = [];
			//Force generation in one iteration.
			while (moveNext.apply(null, slice.apply(arguments))) {
				outList.push(gen.current);
			}
			return outList;
		},
		nextSet = function (setCount2) {
			if (arguments.length > 0) {
				numberOfElements = setCount2;
			}
			fnContexts.length = 0;
			fnContexts = [];
			yieldIndex = -1;
			gen.current = null;
		};
    gen.current = null;
    gen.moveNext = moveNext;
    gen.generate = generate;
    gen.nextSet = nextSet;
    return gen;
};
