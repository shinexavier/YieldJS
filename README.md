YieldJS
=======

A JavaScript library for creating Iterators, Generators and Continuation methods for Arrays.

The Iterator would be a method (<b>getIterator()</b>) that augments the Array data type and would have the following interfaces:

Properties:

1. <b>length</b>   : Length of the collection/array that would be iterated.
2. <b>current</b>  : Gives the current element during the course of an iteration.
2. <b>outList</b>  : The output collection/array after iteration.

Methods:

1. <b>moveNext</b>  : Attempts to move the iteration pointer to the next element in the list and returns "<b>true</b>" if successful. If unsuccessful (primarily because the iteration pointer is at the last element in the list), returns "<b>false</b>".
2. <b>iterate</b>  : Iterates the elements in the input array based on the continuation methods (if any) and returns the results as an "<b>array</b>".
3. <b>reset</b>  : Resets the iterator (including the iteration pointer and output array) to be used for other iterations without creating a new iterator. Basically promotes reusability.

Usage:

```javascript
var x = [1, 2, 3, 4, 5, 6, 7],
    list = x.getIterator();
while (list.moveNext() {
    console.log(list.current);
}
console.log(continuation.outList);
continuation.reset();
console.log(continuation.iterate());
```

The Generator would be a method (<b>getGenerator(numberOfElements)</b>) that augments any Generator function (by accepting the number of elements to be generated) and would have the following interfaces:

Properties:

1. <b>current</b>  : Gives the current element during the course of a generation.

Methods:

1. <b>moveNext</b>  : Attempts to Generate the next element based on the generator function, increments the iteration pointer and returns "<b>true</b>" if successful. If unsuccessful (primarily because the iteration pointer points to the last element returned by the generator function based on the number of elements specified), returns "<b>false</b>".
2. <b>generate</b>  : Generates the elements based on the generator function, number of elements, continuation methods (if any) and returns the results as an "<b>array</b>".
3. <b>nextSet</b>  : Prepares the generator to generate the next set of elements based on the number of elements specified (if unspecified, the default number of elements initialized as part of the generator creation would be used).

Usage:

```javascript
//A generic sequence generator function:
function sequence(z) {
	"use strict";
	var y = 0;
	return function () {
		y += z;
		return y;
	};
}

var a = sequence(1).getGenerator(10);//For generating the first 10 elements (1 through 10)
while(a.moveNext()) {
	console.log(a.current);
}

a.nextSet(5);//For generating the next 5 elements (11 through 15)
console.log(a.generate());
```


Continuation Methods:
=====================

For creating continuation methods a context object is provided for qualifying methods.
The context object provides the following attributes for creating various useful functions:

1. <b>index</b> : Gives the index of the current element in iteration context.
2. <b>current</b> : Gives the current element in iteration context.
3. <b>outList</b> : Gives the cumilative output collection/array till that point of iteration.

Usage:

```javascript
//Continuation Methods
function unique(context) {
    "use strict";
    return (context.outList.indexOf(context.current) < 0) ? context.current : null;
}

function square(context) {
    "use strict";
    return (context.current * context.current);
}

function filter(condition) {
    "use strict";
    return function (context) {
        return condition(context.current) ? context.current : null;
    };
}

function even(val) {
    "use strict";
    return (val % 2 === 0);
}

function skip(count) {
    "use strict";
    return function (context) {
        //console.log(this.index.toString() + " : " + this.current.toString());
        return ((context.index % (count + 1)) === 0) ? context.current : null;
    };
}
```

Example Usage:
==============

```javascript
//Test Harness using all of above (iterators, generators and continuation methods)
var x = [1, 2, 3, 200, 1, 2, 3, 200],
continuation = x.getIterator();
console.log(continuation.iterate());
continuation.reset();
while (continuation.moveNext(unique, skip(2))) {
    //console.log(continuation.current);
}
console.log(continuation.outList);

function sequence(z) {
	"use strict";
	var y = 0;
	return function () {
		y += z;
		return y;
	};
}

var a = sequence(1).getGenerator(10);
while(a.moveNext(square,skip(1))) {
	console.log(a.current);
}
a.nextSet(5);
console.log(a.generate(square));
```
