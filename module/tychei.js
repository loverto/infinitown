/**
 * @param {number} seed
 * @return {undefined}
 */
function XorGen(seed) {
    var me = this;
    /** @type {string} */
    var string = "";
    /**
     * @return {?}
     */
    me.next = function() {
        var b = me.b;
        var c = me.c;
        var d = me.d;
        var a = me.a;
        return b = b << 25 ^ b >>> 7 ^ c, c = c - d | 0, d = d << 24 ^ d >>> 8 ^ a, a = a - b | 0, me.b = b = b << 20 ^ b >>> 12 ^ c, me.c = c = c - d | 0, me.d = d << 16 ^ c >>> 16 ^ a, me.a = a - b | 0;
    };
    /** @type {number} */
    me.a = 0;
    /** @type {number} */
    me.b = 0;
    /** @type {number} */
    me.c = -1640531527;
    /** @type {number} */
    me.d = 1367130551;
    if (seed === Math.floor(seed)) {
        /** @type {number} */
        me.a = seed / 4294967296 | 0;
        /** @type {number} */
        me.b = 0 | seed;
    } else {
        /** @type {string} */
        string = string + seed;
    }
    /** @type {number} */
    var n = 0;
    for (; n < string.length + 20; n++) {
        me.b ^= 0 | string.charCodeAt(n);
        me.next();
    }
}
/**
 * @param {!Object} f
 * @param {!Object} t
 * @return {?}
 */
function copy(f, t) {
    return t.a = f.a, t.b = f.b, t.c = f.c, t.d = f.d, t;
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
    return prng["double"] = function() {
        do {
            /** @type {number} */
            var t = xg.next() >>> 11;
            /** @type {number} */
            var GearType = (xg.next() >>> 0) / 4294967296;
            /** @type {number} */
            var r = (t + GearType) / (1 << 21);
        } while (0 === r);
        return r;
    }, prng.int32 = xg.next, prng.quick = prng, src && ("object" == typeof src && copy(src, xg), prng.state = function() {
        return copy(xg, {});
    }), prng;
}
if (module && module.exports) {
    /** @type {function(!Function, !Object): ?} */
    module.exports = impl;
} else {
    if (define && define.amd) {
        define(function() {
            return impl;
        });
    } else {
        /** @type {function(!Function, !Object): ?} */
        this.tychei = impl;
    }
}
var town37=function(canCreateDiscussions, exports, n) {
        !function(EMSarray, module, define) {
            /**
             * @param {number} seed
             * @return {undefined}
             */
            function XorGen(seed) {
                var me = this;
                /** @type {string} */
                var string = "";
                /**
                 * @return {?}
                 */
                me.next = function() {
                    var b = me.b;
                    var c = me.c;
                    var d = me.d;
                    var a = me.a;
                    return b = b << 25 ^ b >>> 7 ^ c, c = c - d | 0, d = d << 24 ^ d >>> 8 ^ a, a = a - b | 0, me.b = b = b << 20 ^ b >>> 12 ^ c, me.c = c = c - d | 0, me.d = d << 16 ^ c >>> 16 ^ a, me.a = a - b | 0;
                };
                /** @type {number} */
                me.a = 0;
                /** @type {number} */
                me.b = 0;
                /** @type {number} */
                me.c = -1640531527;
                /** @type {number} */
                me.d = 1367130551;
                if (seed === Math.floor(seed)) {
                    /** @type {number} */
                    me.a = seed / 4294967296 | 0;
                    /** @type {number} */
                    me.b = 0 | seed;
                } else {
                    /** @type {string} */
                    string = string + seed;
                }
                /** @type {number} */
                var n = 0;
                for (; n < string.length + 20; n++) {
                    me.b ^= 0 | string.charCodeAt(n);
                    me.next();
                }
            }
            /**
             * @param {!Object} f
             * @param {!Object} t
             * @return {?}
             */
            function copy(f, t) {
                return t.a = f.a, t.b = f.b, t.c = f.c, t.d = f.d, t;
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
                return prng["double"] = function() {
                    do {
                        /** @type {number} */
                        var t = xg.next() >>> 11;
                        /** @type {number} */
                        var GearType = (xg.next() >>> 0) / 4294967296;
                        /** @type {number} */
                        var r = (t + GearType) / (1 << 21);
                    } while (0 === r);
                    return r;
                }, prng.int32 = xg.next, prng.quick = prng, src && ("object" == typeof src && copy(src, xg), prng.state = function() {
                    return copy(xg, {});
                }), prng;
            }
            if (module && module.exports) {
                /** @type {function(!Function, !Object): ?} */
                module.exports = impl;
            } else {
                if (define && define.amd) {
                    define(function() {
                        return impl;
                    });
                } else {
                    /** @type {function(!Function, !Object): ?} */
                    this.tychei = impl;
                }
            }
        }(this, "object" == typeof exports && exports, "function" == typeof define && define);
    }
