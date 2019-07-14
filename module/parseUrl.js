import * as  uriUtils from 'module/uriUtils';
import normalize from 'module/normalize';
import convertArray from 'module/convertArray';
import self from 'valid-url';

/** @type {function(): ?} */
var parseUrl = function() {
    var array = convertArray(arguments).map(s);
    return self.isUri(array[0]) ? normalize.apply(normalize, array) : uriUtils.join.apply(uriUtils, array);
};

/** @type {function(!Array, ?, !Object): ?} */
var s = (parseUrl.isUrl = function(value) {
    return self.isUri(value) || 'http://' === value || 'https://' === value || 'ftp://' === value;
}, parseUrl.replaceUndefined = function(currentValue, index, arr) {
    return void 0 === currentValue || null === currentValue ? self.isUri(arr[0]) ? '/' : uriUtils.sep : currentValue;
});

export {parseUrl};
