/**
 * @param {!Array} value
 * @return {?}
 */
function isObject(value) {
    return '[object Object]' === Object.prototype.toString.call(value);
}
/**
 * @param {!Array} value
 * @return {?}
 */
function isArgumentsArrays(value) {
    return '[object Arguments]' === Object.prototype.toString.call(value);
}
/**
 * @param {!Array} cache
 * @return {?}
 */
function objectToArray(cache) {
    return Object.keys(cache).map(function(colorSpace) {
        return cache[colorSpace];
    });
}

/**
 * @param {!Array} value
 * @param {!Object} result
 * @return {?}
 */
export default function(value, result) {
    return value || (value = []), isArgumentsArrays(value) && (value = [].splice.call(value, 0)), isObject(value) && result && (value = objectToArray(value)), Array.isArray(value) ? value : [value];
};


