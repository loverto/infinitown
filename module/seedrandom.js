/**
 * @param {!Function} c
 * @param {!Object} options
 * @param {!Function} callback
 * @return {?}
 */
function seedrandom(c, options, callback) {
    /** @type {!Array} */
    var key = [];
    options = 1 == options ? {
        entropy : true
    } : options || {};
    var shortseed = mixkey(w(options.entropy ? [c, tostring(pool)] : null == c ? autoseed() : c, 3), key);
    var arc4 = new ARC4(key);
    /**
     * @return {?}
     */
    var prng = function() {
        var n = arc4.g(chunks);
        /** @type {number} */
        var d = startdenom;
        /** @type {number} */
        var x = 0;
        for (; n < i;) {
            /** @type {number} */
            n = (n + x) * width;
            /** @type {number} */
            d = d * width;
            x = arc4.g(1);
        }
        for (; n >= left;) {
            /** @type {number} */
            n = n / 2;
            /** @type {number} */
            d = d / 2;
            /** @type {number} */
            x = x >>> 1;
        }
        return (n + x) / d;
    };
    return prng.int32 = function() {
        return 0 | arc4.g(4);
    }, prng.quick = function() {
        return arc4.g(4) / 4294967296;
    }, prng['double'] = prng, mixkey(tostring(arc4.S), []), (options.pass || callback || function(prng, value, initAccum, opts) {
        return opts && (opts.S && copy(opts, arc4), prng.state = function() {
            return copy(arc4, {});
        }), initAccum ? (Math[rngname] = prng, value) : prng;
    })(prng, shortseed, 'global' in options ? options.global : this == Math, options.state);
}
/**
 * @param {string} key
 * @return {undefined}
 */
function ARC4(key) {
    var t;
    var keylen = key.length;
    var me = this;
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var j = me.i = me.j = 0;
    /** @type {!Array} */
    var s = me.S = [];
    if (!keylen) {
    /** @type {!Array} */
        key = [keylen++];
    }
    for (; i < width;) {
    /** @type {number} */
        s[i] = i++;
    }
    /** @type {number} */
    i = 0;
    for (; i < width; i++) {
        s[i] = s[j = mask & j + key[i % keylen] + (t = s[i])];
        s[j] = t;
    }
    (me.g = function(count) {
        var t;
        /** @type {number} */
        var r = 0;
        var i = me.i;
        var j = me.j;
        var s = me.S;
        for (; count--;) {
            t = s[i = mask & i + 1];
            r = r * width + s[mask & (s[i] = s[j = mask & j + t]) + (s[j] = t)];
        }
        return me.i = i, me.j = j, r;
    })(width);
}
/**
 * @param {!Object} f
 * @param {!Object} t
 * @return {?}
 */
function copy(f, t) {
    return t.i = f.i, t.j = f.j, t.S = f.S.slice(), t;
}
/**
 * @param {string} index
 * @param {number} value
 * @return {?}
 */
function w(index, value) {
    var i;
    /** @type {!Array} */
    var b = [];
    /** @type {string} */
    var undefined = typeof index;
    if (value && 'object' == undefined) {
        for (i in index) {
            try {
                b.push(w(index[i], value - 1));
            } catch (o) {
            }
        }
    }
    return b.length ? b : 'string' == undefined ? index : index + '\x00';
}
/**
 * @param {string} seed
 * @param {!Array} key
 * @return {?}
 */
function mixkey(seed, key) {
    var n;
    /** @type {string} */
    var stringseed = seed + '';
    /** @type {number} */
    var j = 0;
    for (; j < stringseed.length;) {
    /** @type {number} */
        key[mask & j] = mask & (n = n ^ 19 * key[mask & j]) + stringseed.charCodeAt(j++);
    }
    return tostring(key);
}
/**
 * @return {?}
 */
function autoseed() {
    try {
        var out;
        return nodecrypto && (out = nodecrypto.randomBytes) ? out = out(width) : (out = new Uint8Array(width), (global.crypto || global.msCrypto).getRandomValues(out)), tostring(out);
    } catch (e) {
        var navigator = global.navigator;
        var isPhantom = navigator && navigator.plugins;
        return [+new Date, global, isPhantom, global.screen, tostring(pool)];
    }
}
/**
 * @param {!Array} a
 * @return {?}
 */
function tostring(a) {
    return String.fromCharCode.apply(0, a);
}
var nodecrypto;
var global = this;
/** @type {number} */
var width = 256;
/** @type {number} */
var chunks = 6;
/** @type {number} */
var y = 52;
/** @type {string} */
var rngname = 'random';
/** @type {number} */
var startdenom = Math.pow(width, chunks);
/** @type {number} */
var i = Math.pow(2, y);
/** @type {number} */
var left = 2 * i;
/** @type {number} */
var mask = width - 1;
export default seedrandom;
