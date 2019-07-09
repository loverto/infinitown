/**
 * @param {!Array} value
 * @return {?}
 */
function eq(value) {
    return "[object Object]" === Object.prototype.toString.call(value);
}
/**
 * @param {!Array} value
 * @return {?}
 */
function getStringTag(value) {
    return "[object Arguments]" === Object.prototype.toString.call(value);
}
/**
 * @param {!Array} cache
 * @return {?}
 */
function makeStyleLoaders(cache) {
    return Object.keys(cache).map(function(colorSpace) {
        return cache[colorSpace];
    });
}
/**
 * @param {!Array} value
 * @param {!Object} result
 * @return {?}
 */
mixin.exports = function(value, result) {
    return value || (value = []), getStringTag(value) && (value = [].splice.call(value, 0)), eq(value) && result && (value = makeStyleLoaders(value)), Array.isArray(value) ? value : [value];
};
var town30=function(canCreateDiscussions, mixin, n) {
        /**
         * @param {!Array} value
         * @return {?}
         */
        function eq(value) {
            return "[object Object]" === Object.prototype.toString.call(value);
        }
        /**
         * @param {!Array} value
         * @return {?}
         */
        function getStringTag(value) {
            return "[object Arguments]" === Object.prototype.toString.call(value);
        }
        /**
         * @param {!Array} cache
         * @return {?}
         */
        function makeStyleLoaders(cache) {
            return Object.keys(cache).map(function(colorSpace) {
                return cache[colorSpace];
            });
        }
        /**
         * @param {!Array} value
         * @param {!Object} result
         * @return {?}
         */
        mixin.exports = function(value, result) {
            return value || (value = []), getStringTag(value) && (value = [].splice.call(value, 0)), eq(value) && result && (value = makeStyleLoaders(value)), Array.isArray(value) ? value : [value];
        };
    }
