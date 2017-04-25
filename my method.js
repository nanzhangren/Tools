// 1. isEqualObject
// Compare whether the given two object are equal.
// which means the reuslt will be true when the count of the two object is same and the relative field is equal.
//
// The examples below will return true;
// eg:
//      {test: 123} & {test: 123}
//      {test: 123, [1,2,3]} & {test: 123, [1,2,3]}
//      {test: 123, {test: 234}} & {test: 123, {test: 234}}
var const_object = 'object';
function isEqualObject(obj1, obj2, compareObjectFieldFunc) {    
    function isEqualArray(arr1, arr2) {
        if (!arr1 && !arr2) {
            return true;
        }
        if (!arr1 || !arr2 || arr1.length !== arr2.length) {
            return false;
        }
        var find = false;
        for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr2.length; j++) {
                if (typeof arr1[i] === const_object) {
                    if (typeof arr2[j] === const_object) {
                        find = isEqualObject(arr1[i], arr2[j]);
                        if (find) {
                            break;
                        }
                    }
                } else if (arr1[i] === arr2[j]) {
                    find = true;
                    break;
                }
            }
            if (!find) {
                return false;
            }
        }
        return true;
    }

    if (!obj1 && !obj2) {
        return true;
    } else if (!obj1 || !obj2) {
        return false;
    }
    if (!compareObjectFieldFunc) {
        compareObjectFieldFunc = isEqualObject;
    }
    var propCache = {}, prop;
    for (prop in obj1) {
        if (obj1.hasOwnProperty(prop)) {
            var propValue = obj1[prop];
            if (propValue instanceof Array) {
                if (!isEqualArray(propValue, obj2[prop])) {
                    return false;
                }
            } else if (typeof propValue === const_object) {
                if (!compareObjectFieldFunc(propValue, obj2[prop])) {
                    return false;
                }
            } else if (propValue !== obj2[prop]) {
                return false;
            }
            propCache[prop] = true;
        }
    }
    for (prop in obj2) {
        if (obj2.hasOwnProperty(prop) && !propCache[prop]) {
            return false;
        }
    }
    return true;
}

// 2. convertKeyCodeToAsciiCode
// Convert keyCode in event to the ASCII code.
function convertKeyCodeToAsciiCode(event) {
    var keyCode = event.keyCode, shiftKey = event.shiftKey;
    var keyMap = {
        106: 42,    // * in number pad
        107: 43,    // + in number pad
        109: 45,    // - in number pad
        110: 46,    // . in number pad
        111: 47     // / in number pad
    }, generalKeyMap = {
        186: 59,    // ;
        187: 61,    // =
        188: 44,    // ,
        189: 45,    // -
        190: 46,    // .
        191: 47,    // /
        192: 96,    // `
        219: 91,    // [
        220: 92,    // \
        221: 93,    // ]
        222: 39     // '
    }, shiftKeyMap = {
        186: 58,    // :
        187: 43,    // +
        188: 60,    // <
        189: 95,    // _
        190: 62,    // >
        191: 63,    // ?
        192: 126,   // ~
        219: 123,   // {
        220: 124,   // |
        221: 125,   // }
        222: 34     // "
    };
    var retCode = keyCode;
    if(keyCode >= 96 && keyCode <= 105) {    // 0 ~ 9 in number pad
        retCode = keyCode - 48;
    } else if(keyMap[keyCode]) {
        retCode = keyMap[keyCode];
    } else if (shiftKey && shiftKeyMap[keyCode]) {
        retCode = shiftKeyMap[keyCode];
    } else if(!shiftKey && generalKeyMap[keyCode]) {
        retCode = generalKeyMap[keyCode];
    } else if(!shiftKey && keyCode >= 65 && keyCode <= 90) {    // eslint-disable-line      // a~z
        retCode = keyCode + 32;
    }
    // KeyCode is same with ASCII letter:
    //    A ~ Z  =>  65 ~ 90
    //    0 ~ 9  =>  48 ~ 57 (number in letter pad)
    //    space  =>  32
    return retCode;
}

// 3. getFieldValueInComplexObject
// Get the value of a field in an object.
// You can also specify the parent name of a field for getting a more accuracy field value.
function getFieldValueInComplexObject(obj, parentFieldName, fieldName, currentParentName) {
	if(!obj || !(obj instanceof Object)) {
		return null;
	}
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop)) {
			var value = obj[prop];
			if((!parentFieldName || parentFieldName === currentParentName) && prop === fieldName) {
				return value;
			} 
			if(value instanceof Array) {
				var retValue = null;
				value.some(function(item) {
					retValue = getFieldValueInComplexObject(item, parentFieldName, fieldName, prop);
					if(retValue !== null) {
						return true;
					}
				});
				if(retValue !== null) {
					return retValue;
				}
			} else if(value instanceof Object) {
				var innerValue = getFieldValueInComplexObject(value, parentFieldName, fieldName, prop);
				if(innerValue !== null) {
					return innerValue;
				}
			}
		}
	}
	return null;
}
