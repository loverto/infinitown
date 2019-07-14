/**
 * @param {number} seed
 * @return {undefined}
 */
function XorGen(seed) {
    var me = this;
    /** @type {string} */
    var string = '';
    /** @type {number} */
    me.x = 0;
    /** @type {number} */
    me.y = 0;
    /** @type {number} */
    me.z = 0;
    /** @type {number} */
    me.w = 0;
    /**
     * @return {?}
     */
    me.next = function() {
    /** @type {number} */
        var t = me.x ^ me.x << 11;
        return me.x = me.y, me.y = me.z, me.z = me.w, me.w ^= me.w >>> 19 ^ t ^ t >>> 8;
    };
    if (seed === (0 | seed)) {
    /** @type {number} */
        me.x = seed;
    } else {
    /** @type {string} */
        string = string + seed;
    }
    /** @type {number} */
    var n = 0;
    for (; n < string.length + 64; n++) {
        me.x ^= 0 | string.charCodeAt(n);
        me.next();
    }
}
/**
 * @param {!Object} f
 * @param {!Object} t
 * @return {?}
 */
function copy(f, t) {
    return t.x = f.x, t.y = f.y, t.z = f.z, t.w = f.w, t;
}
/**
 * @param {!Function} obj
 * @param {!Object} data
 * @return {?}
 */
function impl(obj, data) {
    var xg = new XorGen(obj);
    var src = data && data.state;
    /**
     * @return {?}
     */
    var prng = function() {
        return (xg.next() >>> 0) / 4294967296;
    };
    return prng['double'] = function() {
        do {
            /** @type {number} */
            var t = xg.next() >>> 11;
            /** @type {number} */
            var GearType = (xg.next() >>> 0) / 4294967296;
            /** @type {number} */
            var r = (t + GearType) / (1 << 21);
        } while (0 === r);
        return r;
    }, prng.int32 = xg.next, prng.quick = prng, src && ('object' == typeof src && copy(src, xg), prng.state = function() {
        return copy(xg, {});
    }), prng;
}
export default impl;

