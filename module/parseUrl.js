var uriUtils = require("module/uriUtils");
var normalize = require("module/normalize");
var _slic = require("30");
var self = require("module/uri");
/** @type {function(): ?} */
utils = mixin.exports = function() {
    var q = _slic(arguments).map(s);
    return self.isUri(q[0]) ? normalize.apply(normalize, q) : uriUtils.join.apply(uriUtils, q);
};
/** @type {function(!Array, ?, !Object): ?} */
var s = (utils.isUrl = function(value) {
    return self.isUri(value) || "http://" === value || "https://" === value || "ftp://" === value;
}, utils.replaceUndefined = function(t, value, key) {
    return void 0 === t || null === t ? self.isUri(key[0]) ? "/" : uriUtils.sep : t;
});

var town29=function(require, mixin, utils) {
        var ref = require("module/uriUtils");
        var select = require("module/normalize");
        var _slic = require("30");
        var self = require("module/uri");
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
