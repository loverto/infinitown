var uriUtils = require("module/uriUtils");
var normalize = require("module/normalize");
var convertArray = require("module/convertArray");
var self = require("valid-url");
/** @type {function(): ?} */
utils = mixin.exports = function() {
    var array = convertArray(arguments).map(s);
    return self.isUri(array[0]) ? normalize.apply(normalize, array) : uriUtils.join.apply(uriUtils, array);
};
/** @type {function(!Array, ?, !Object): ?} */
var s = (utils.isUrl = function(value) {
    return self.isUri(value) || "http://" === value || "https://" === value || "ftp://" === value;
}, utils.replaceUndefined = function(currentValue, index, arr) {
    return void 0 === currentValue || null === currentValue ? self.isUri(arr[0]) ? "/" : uriUtils.sep : currentValue;
});

var town29=function(require, mixin, utils) {
        var ref = require("module/uriUtils");
        var select = require("module/normalize");
        var _slic = require("module/convertArray");
        var self = require("module/valid-url");
        /** @type {function(): ?} */
        utils = mixin.exports = function() {
            var q = _slic(arguments).map(s);
            return self.isUri(q[0]) ? select.apply(select, q) : ref.join.apply(ref, q);
        };
        /** @type {function(!Array, ?, !Object): ?} */
        var s = (utils.isUrl = function(value) {
            return self.isUri(value) || "http://" === value || "https://" === value || "ftp://" === value;
        }, utils.replaceUndefined = function(t, value, key) {
            return void 0 === t || null === t ? self.isUri(key[0]) ? "/" : ref.sep : t;
        });
    }
