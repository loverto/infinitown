/**
 * @param {number} t
 * @return {undefined}
 */
function XorGen(t) {
    var p = this;
    /** @type {string} */
    var text = '';
    /**
     * @return {?}
     */
    p.next = function() {
    /** @type {number} */
        var t = p.x ^ p.x >>> 2;
        return p.x = p.y, p.y = p.z, p.z = p.w, p.w = p.v, (p.d = p.d + 362437 | 0) + (p.v = p.v ^ p.v << 4 ^ (t ^ t << 1)) | 0;
    };
    /** @type {number} */
    p.x = 0;
    /** @type {number} */
    p.y = 0;
    /** @type {number} */
    p.z = 0;
    /** @type {number} */
    p.w = 0;
    /** @type {number} */
    p.v = 0;
    if (t === (0 | t)) {
    /** @type {number} */
        p.x = t;
    } else {
    /** @type {string} */
        text = text + t;
    }
    /** @type {number} */
    var i = 0;
    for (; i < text.length + 64; i++) {
        p.x ^= 0 | text.charCodeAt(i);
        if (i == text.length) {
            /** @type {number} */
            p.d = p.x << 10 ^ p.x >>> 4;
        }
        p.next();
    }
}
/**
 * @param {!Object} f
 * @param {!Object} t
 * @return {?}
 */
function copy(f, t) {
    return t.x = f.x, t.y = f.y, t.z = f.z, t.w = f.w, t.v = f.v, t.d = f.d, t;
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


