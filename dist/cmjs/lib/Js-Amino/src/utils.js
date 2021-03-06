'use strict';

var getHash256 = function getHash256(input) {
    var sha256 = require('js-sha256');
    var hash2 = sha256.update(input);
    return hash2.array();
};

var isEqual = function isEqual(value, other) {

    // Get the value type
    var type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    var compare = function compare(item1, item2) {

        // Get the object type
        var itemType = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        }

        // Otherwise, do a simple comparison
        else {

                // If the two items are not the same type, return false
                if (itemType !== Object.prototype.toString.call(item2)) return false;

                // Else if it's a function, convert to a string and compare
                // Otherwise, just compare
                if (itemType === '[object Function]') {
                    if (item1.toString() !== item2.toString()) return false;
                } else {
                    if (item1 !== item2) return false;
                }
            }
    };

    // Compare properties
    if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }

    // If nothing failed, return true
    return true;
};
//extension for Number global type
Number.MaxInt8 = 1 << 7 - 1;
Number.MaxInt16 = 1 << 15 - 1;

var MinSecond = -62135596800; // seconds of 01-01-0001
var MaxSecond = 253402300800; // seconds of 10000-01-01
var MaxNano = 999999999; //nanos have to be in interval: [0, 999999999]

//extension for String
String.prototype.toBytes = function (str) {
    var bytes = [];
    for (var i = 0, n = str.length; i < n; i++) {
        var char = str.charCodeAt(i);
        bytes.push(char >>> 8, char & 0xFF);
    }
    return bytes;
};

String.fromBytes = function (bytes) {
    var chars = [];
    for (var i = 0, n = bytes.length; i < n;) {
        chars.push((bytes[i++] & 0xff) << 8 | bytes[i++] & 0xff);
    }
    return String.fromCharCode.apply(null, chars);
};

module.exports = {
    getHash256: getHash256,
    isEqual: isEqual,
    MinSecond: MinSecond,
    MaxSecond: MaxSecond,
    MaxNano: MaxNano
};