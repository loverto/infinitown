import * as  path from 'path';
import normalize from 'module/utils/normalize';
import convertArray from 'module/utils/ConvertArray';
import validUrl from 'valid-url';

/**
 * url转换
 * @returns {*}
 */
var parseUrl = function() {
    // 转换参数列表为参数数组
    var array = convertArray(arguments).map(replaceUndefined);
    return validUrl.isUri(array[0]) ? normalize.apply(normalize, array) : path.join.apply(path, array);
};
/**
 * 判断是否是url
 * @param value
 * @returns {*|!Uint8Array|!Array|boolean}
 */
parseUrl.isUri = function(value) {
    return validUrl.isUri(value) || 'http://' === value || 'https://' === value || 'ftp://' === value;
}
/**
 * 替换未定义的值
 * @type {function(*, *, *): string}
 */
var replaceUndefined =  parseUrl.replaceUndefined = function(currentValue, index, arr) {
    return undefined === currentValue || null === currentValue ? validUrl.isUri(arr[0]) ? '/' : path.sep : currentValue;
};

export default parseUrl;
