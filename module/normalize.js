/**
 * @param {string} name
 * @return {?}
 */
function normalize(name) {
    return name.replace(/[\/]+/g, "/").replace(/\/\?/g, "?").replace(/\/#/g, "#").replace(/:\//g, "://");
}
/**
 * @return {?}
 */
mixin.exports = function() {
    /** @type {string} */
    var joined = [].slice.call(arguments, 0).join("/");
    return normalize(joined);
};
var town31=function(canCreateDiscussions, mixin, n) {
        /**
         * @param {string} name
         * @return {?}
         */
        function normalize(name) {
            return name.replace(/[\/]+/g, "/").replace(/\/\?/g, "?").replace(/\/#/g, "#").replace(/:\//g, "://");
        }
        /**
         * @return {?}
         */
        mixin.exports = function() {
            /** @type {string} */
            var joined = [].slice.call(arguments, 0).join("/");
            return normalize(joined);
        };
    }
