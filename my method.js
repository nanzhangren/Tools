var const_object = 'object';

// Compare whether the given two object are equal.
// which means the reuslt will be true when the count of the two object is same and the relative field is equal.
//
// The examples below will return true;
// eg:
//      {test: 123} & {test: 123}
//      {test: 123, [1,2,3]} & {test: 123, [1,2,3]}
//      {test: 123, {test: 234}} & {test: 123, {test: 234}}
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