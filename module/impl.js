/**
 * @param {?} seed
 * @return {undefined}
 */
function Alea(seed) {
    var me = this;
    var mash = Mash();
    /**
     * @return {?}
     */
    me.next = function() {
    /** @type {number} */
        var t = 2091639 * me.s0 + 2.3283064365386963E-10 * me.c;
        return me.s0 = me.s1, me.s1 = me.s2, me.s2 = t - (me.c = 0 | t);
    };
    /** @type {number} */
    me.c = 1;
    me.s0 = mash(' ');
    me.s1 = mash(' ');
    me.s2 = mash(' ');
    me.s0 -= mash(seed);
    if (me.s0 < 0) {
        me.s0 += 1;
    }
    me.s1 -= mash(seed);
    if (me.s1 < 0) {
        me.s1 += 1;
    }
    me.s2 -= mash(seed);
    if (me.s2 < 0) {
        me.s2 += 1;
    }
    /** @type {null} */
    mash = null;
}
/**
 * @param {!Object} f
 * @param {!Object} t
 * @return {?}
 */
function copy(f, t) {
    return t.c = f.c, t.s0 = f.s0, t.s1 = f.s1, t.s2 = f.s2, t;
}
/**
 * @param {!Function} obj
 * @param {!Object} data
 * @return {?}
 */
function impl(obj, data) {
    var xg = new Alea(obj);
    var src = data && data.state;
    var prng = xg.next;
    return prng.int32 = function() {
        return 4294967296 * xg.next() | 0;
    }, prng['double'] = function() {
        return prng() + 1.1102230246251565E-16 * (2097152 * prng() | 0);
    }, prng.quick = prng, src && ('object' == typeof src && copy(src, xg), prng.state = function() {
        return copy(xg, {});
    }), prng;
}
/**
 * @return {?}
 */
function Mash() {
    /** @type {number} */
    var t = 4022871197;
    /**
     * @param {string} data
     * @return {?}
     */
    var mash = function(data) {
        data = data.toString();
        /** @type {number} */
        var i = 0;
        for (; i < data.length; i++) {
            t = t + data.charCodeAt(i);
            /** @type {number} */
            var x = .02519603282416938 * t;
            /** @type {number} */
            t = x >>> 0;
            /** @type {number} */
            x = x - t;
            /** @type {number} */
            x = x * t;
            /** @type {number} */
            t = x >>> 0;
            /** @type {number} */
            x = x - t;
            /** @type {number} */
            t = t + 4294967296 * x;
        }
        return 2.3283064365386963E-10 * (t >>> 0);
    };
    return mash;
}
export default impl;


