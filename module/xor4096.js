/**
 * @param {!Object} statusData
 * @return {undefined}
 */
function XorGen(statusData) {
    /**
     * @param {!Object} t
     * @param {!Object} data
     * @return {undefined}
     */
    function next(t, data) {
        var key;
        var value;
        var i;
        var off;
        var a;
        /** @type {!Array} */
        var array = [];
        /** @type {number} */
        var last = 128;
        if (data === (0 | data)) {
            /** @type {!Object} */
            value = data;
            /** @type {null} */
            data = null;
        } else {
            /** @type {string} */
            data = data + '\x00';
            /** @type {number} */
            value = 0;
            /** @type {number} */
            last = Math.max(last, data.length);
        }
        /** @type {number} */
        i = 0;
        /** @type {number} */
        off = -32;
        for (; off < last; ++off) {
            if (data) {
                /** @type {number} */
                value = value ^ data.charCodeAt((off + 32) % data.length);
            }
            if (0 === off) {
                a = value;
            }
            /** @type {number} */
            value = value ^ value << 10;
            /** @type {number} */
            value = value ^ value >>> 15;
            /** @type {number} */
            value = value ^ value << 4;
            /** @type {number} */
            value = value ^ value >>> 13;
            if (off >= 0) {
                /** @type {number} */
                a = a + 1640531527 | 0;
                /** @type {number} */
                key = array[127 & off] ^= value + a;
                /** @type {number} */
                i = 0 == key ? i + 1 : 0;
            }
        }
        if (i >= 128) {
            /** @type {number} */
            array[127 & (data && data.length || 0)] = -1;
        }
        /** @type {number} */
        i = 127;
        /** @type {number} */
        off = 512;
        for (; off > 0; --off) {
            value = array[i + 34 & 127];
            key = array[i = i + 1 & 127];
            /** @type {number} */
            value = value ^ value << 13;
            /** @type {number} */
            key = key ^ key << 17;
            /** @type {number} */
            value = value ^ value >>> 15;
            /** @type {number} */
            key = key ^ key >>> 12;
            /** @type {number} */
            array[i] = value ^ key;
        }
        /** @type {(number|undefined)} */
        t.w = a;
        /** @type {!Array} */
        t.X = array;
        /** @type {number} */
        t.i = i;
    }
    var that = this;
    /**
     * @return {?}
     */
    that.next = function() {
        var g;
        var k;
        var width = that.w;
        var a = that.X;
        var i = that.i;
        return that.w = width = width + 1640531527 | 0, k = a[i + 34 & 127], g = a[i = i + 1 & 127], k = k ^ k << 13, g = g ^ g << 17, k = k ^ k >>> 15, g = g ^ g >>> 12, k = a[i] = k ^ g, that.i = i, k + (width ^ width >>> 16) | 0;
    };
    next(that, statusData);
}
/**
 * @param {!Object} f
 * @param {!Object} t
 * @return {?}
 */
function copy(f, t) {
    return t.i = f.i, t.w = f.w, t.X = f.X.slice(), t;
}
/**
 * @param {string} obj
 * @param {!Object} data
 * @return {?}
 */
function impl(obj, data) {
    if (null == obj) {
    /** @type {number} */
        obj = +new Date;
    }
    var xg = new XorGen(obj);
    var value = data && data.state;
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
    }, prng.int32 = xg.next, prng.quick = prng, value && (value.X && copy(value, xg), prng.state = function() {
        return copy(xg, {});
    }), prng;
}
export default impl;
