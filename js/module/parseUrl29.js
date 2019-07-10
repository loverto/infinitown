function parseUrl($, mixin, utils) {
    var ref = $("26");
    var select = $("31");
    var _slic = $("30");
    var self = $("32");
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
