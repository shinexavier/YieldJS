YieldJS
=======

A JavaScript library for creating Iterators and Continuation methods for Arrays.

The Iterator would be a method (<b>getIterator()</b>) that augments the Array data type:

and would have the following interfaces:

Properties:

1. <b>length</b>   : Length of the collection/array that would be iterated.
2. <b>current</b>  : Gives the current element during the course of an iteration.
2. <b>outList</b>  : The output collection/array after iteration.

Methods:

1. <b>moveNext</b>  : Attempts to move the iteration pointer to the next element in the list and returns "<b>true</b>" if successful. If unsuccessful (primarily because the iteration pointer is at the last element in the list), returns "<b>false</b>".

Usage:

```javascript
var x = [1, 2, 3, 4, 5, 6, 7],
    list = x.getIterator();
while (list.moveNext() {
    console.log(list.current);
}
console.log(continuation.outList);
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
//Iteration Methods
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

//Test Harness
var x = [1, 2, 3, 200, 1, 2, 3, 200],
    continuation = x.getIterator();
while (continuation.moveNext(unique, skip(2))) {
    console.log(continuation.current);
}
console.log(continuation.outList);
```
