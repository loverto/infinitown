var town40 = function (canCreateDiscussions, exports, n) {
    !function(EMSarray, module, define) {
        /**
         * @param {undefined} seed
         * @return {undefined}
         */
        function XorGen(seed) {
            /**
             * @param {!Object} p
             * @param {number} val
             * @return {undefined}
             */
            function next(p, val) {
                var i;
                var currentContext;
                /** @type {!Array} */
                var data = [];
                if (val === (0 | val)) {
                    currentContext = data[0] = val;
                } else {
                    /** @type {string} */
                    val = "" + val;
                    /** @type {number} */
                    i = 0;
                    for (; i < val.length; ++i) {
                        /** @type {number} */
                        data[7 & i] = data[7 & i] << 15 ^ val.charCodeAt(i) + data[i + 1 & 7] << 13;
                    }
                }
                for (; data.length < 8;) {
                    data.push(0);
                }
                /** @type {number} */
                i = 0;
                for (; i < 8 && 0 === data[i]; ++i) {
                }
                currentContext = 8 == i ? data[7] = -1 : data[i];
                /** @type {!Array} */
                p.x = data;
                /** @type {number} */
                p.i = 0;
                /** @type {number} */
                i = 256;
                for (; i > 0; --i) {
                    p.next();
                }
            }
            var i = this;
            /**
             * @return {?}
             */
            i.next = function() {
                var t;
                var c;
                var p = i.x;
                var n = i.i;
                return t = p[n], t = t ^ t >>> 7, c = t ^ t << 24, t = p[n + 1 & 7], c = c ^ (t ^ t >>> 10), t = p[n + 3 & 7], c = c ^ (t ^ t >>> 3), t = p[n + 4 & 7], c = c ^ (t ^ t << 7), t = p[n + 7 & 7], t = t ^ t << 13, c = c ^ (t ^ t << 9), p[n] = c, i.i = n + 1 & 7, c;
            };
            next(i, seed);
        }
        /**
         * @param {!Object} f
         * @param {!Object} t
         * @return {?}
         */
        function copy(f, t) {
            return t.x = f.x.slice(), t.i = f.i, t;
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
            var message = data && data.state;
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
            }, prng.int32 = xg.next, prng.quick = prng, message && (message.x && copy(message, xg), prng.state = function() {
                return copy(xg, {});
            }), prng;
        }
        if (module && module.exports) {
            /** @type {function(string, !Object): ?} */
            module.exports = impl;
        } else {
            if (define && define.amd) {
                define(function() {
                    return impl;
                });
            } else {
                /** @type {function(string, !Object): ?} */
                this.xorshift7 = impl;
            }
        }
    }(this, "object" == typeof exports && exports, "function" == typeof define && define);
}