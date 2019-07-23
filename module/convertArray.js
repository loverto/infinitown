/**
 * 判断是否为对象
 * @param value
 * @returns {boolean}
 */
function isObject(value) {
    return '[object Object]' === Object.prototype.toString.call(value);
}

/**
 * 判断是否为参数列表
 * @param value
 * @returns {boolean}
 */
function isArgumentsArrays(value) {
    return '[object Arguments]' === Object.prototype.toString.call(value);
}

/**
 * 对象转数组
 * @param cache
 * @returns {*[]}
 */
function objectToArray(cache) {
    return Object.keys(cache).map(function(colorSpace) {
        return cache[colorSpace];
    });
}

/**
 * 转换参数列表为数组
 * @param value
 * @param result
 */
export default function(value, result) {
    return value || (value = []), isArgumentsArrays(value) && (value = [].splice.call(value, 0)), isObject(value) && result && (value = objectToArray(value)), Array.isArray(value) ? value : [value];
};


