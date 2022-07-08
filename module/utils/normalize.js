/**
 * Uri 规范化,
 * 例如: 把//替换为/、把两个连续的/替换为一个/，把/?替换为?,把/#替换为#，把:/替换为://
 * @param name
 * @returns {string}
 */
function urlNormalize(name) {
    return name.replace(/[\/]+/g, '/').replace(/\/\?/g, '?').replace(/\/#/g, '#').replace(/:\//g, '://');
}

/**
 * @return {?}
 */
export default function() {
    var joined = [].slice.call(arguments, 0).join('/');
    return urlNormalize(joined);
};
