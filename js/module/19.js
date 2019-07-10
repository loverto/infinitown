var town19 = function (canCreateDiscussions, module, n) {
    if (void 0 === Date.now) {
        /**
         * @return {number}
         */
        Date.now = function() {
            return (new Date).valueOf();
        };
    }
    window.TWEEN = function() {
        /** @type {!Array} */
        var tags = [];
        /** @type {!Array} */
        var e = [];
        /** @type {!Array} */
        var arrUrls = [];
        return {
            REVISION : "14",
            getAll : function() {
                return tags;
            },
            removeAll : function() {
                /** @type {!Array} */
                tags = [];
            },
            add : function(type) {
                e.push(type);
            },
            remove : function(url) {
                arrUrls.push(url);
            },
            update : function(value) {
                /** @type {number} */
                var i = 0;
                value = void 0 !== value ? value : "undefined" != typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now();
                for (; i < tags.length;) {
                    if (tags[i].update(value)) {
                        i++;
                    } else {
                        tags.splice(i, 1);
                    }
                }
                return arrUrls.length > 0 && (arrUrls.forEach(function(i) {
                    var n = tags.indexOf(i);
                    if (n !== -1) {
                        tags.splice(n, 1);
                    }
                }), arrUrls = []), e.length > 0 && (e.forEach(function(transform) {
                    tags.push(transform);
                }), e = []), true;
            }
        };
    }();
    /**
     * @param {number} delay
     * @return {undefined}
     */
    TWEEN.Tween = function(delay) {
        var a;
        var percentage;
        var a1;
        var range;
        var nonDuplicateIds;
        var c;
        var tRecord;
        var modeswitches;
        var u;
        var l;
        var encoding;
        var i;
        var token;
        var type;
        var color;
        var debug;
        var g;
        var b;
        var constraint;
        var now;
        /**
         * @param {number} name
         * @return {?}
         */
        this.reset = function(name) {
            return a = name, percentage = 0, a1 = {}, range = {}, nonDuplicateIds = {}, c = 1E3, tRecord = 0, modeswitches = false, u = false, l = false, encoding = 0, i = null, token = TWEEN.Easing.Linear.None, type = TWEEN.Interpolation.Linear, color = [], debug = null, g = false, b = null, constraint = null, now = null, this;
        };
        /**
         * @param {!Array} fn
         * @param {number} value
         * @return {?}
         */
        this.to = function(fn, value) {
            return void 0 !== value && (c = value), range = fn, this;
        };
        /**
         * @param {number} n
         * @return {?}
         */
        this.start = function(n) {
            TWEEN.add(this);
            /** @type {boolean} */
            u = true;
            /** @type {boolean} */
            g = false;
            i = void 0 !== n ? n : "undefined" != typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now();
            i = i + encoding;
            var j;
            for (j in range) {
                a1[j] = a[j];
                nonDuplicateIds[j] = a1[j] || 0;
            }
            return this;
        };
        /**
         * @return {?}
         */
        this.stop = function() {
            return u ? (TWEEN.remove(this), u = false, null !== now && now.call(a), this.stopChainedTweens(), this) : this;
        };
        /**
         * @return {undefined}
         */
        this.stopChainedTweens = function() {
            /** @type {number} */
            var i = 0;
            var colorLength = color.length;
            for (; i < colorLength; i++) {
                color[i].stop();
            }
        };
        /**
         * @param {string} object
         * @return {?}
         */
        this.delay = function(object) {
            return encoding = object, this;
        };
        /**
         * @param {string} t
         * @return {?}
         */
        this.repeat = function(t) {
            return tRecord = t, this;
        };
        /**
         * @param {boolean} value
         * @return {?}
         */
        this.yoyo = function(value) {
            return modeswitches = value, this;
        };
        /**
         * @param {number} t
         * @return {?}
         */
        this.easing = function(t) {
            return token = t, this;
        };
        /**
         * @param {?} method
         * @return {?}
         */
        this.interpolation = function(method) {
            return type = method, this;
        };
        /**
         * @return {?}
         */
        this.chain = function() {
            return color = arguments, this;
        };
        /**
         * @param {?} state
         * @return {?}
         */
        this.onStart = function(state) {
            return debug = state, this;
        };
        /**
         * @param {?} data
         * @return {?}
         */
        this.onUpdate = function(data) {
            return b = data, this;
        };
        /**
         * @param {?} width
         * @return {?}
         */
        this.onComplete = function(width) {
            return constraint = width, this;
        };
        /**
         * @param {?} to
         * @return {?}
         */
        this.onStop = function(to) {
            return now = to, this;
        };
        /**
         * @param {number} x
         * @return {?}
         */
        this.update = function(x) {
            var j;
            if (x < i) {
                return true;
            }
            if (!u) {
                return false;
            }
            if (g === false) {
                if (null !== debug) {
                    debug.call(a);
                }
                /** @type {boolean} */
                g = true;
            }
            /** @type {number} */
            var p = (x - i) / c;
            /** @type {number} */
            p = p > 1 ? 1 : p;
            /** @type {number} */
            percentage = p;
            var val = token(p);
            for (j in range) {
                var min = a1[j] || 0;
                var max = range[j];
                a[j] = min + (max - min) * val;
            }
            if (null !== b && b.call(a, val), 1 == p) {
                if (null !== constraint) {
                    constraint.call(a);
                }
                /** @type {number} */
                var i = 0;
                var colorLength = color.length;
                for (; i < colorLength; i++) {
                    color[i].start(x);
                }
                return false;
            }
            return true;
        };
        /**
         * @return {?}
         */
        this.getProgress = function() {
            return percentage;
        };
        if (void 0 !== delay) {
            this.reset(delay);
        }
    };
    TWEEN.Easing = {
        Linear : {
            None : function(to) {
                return to;
            }
        },
        Quadratic : {
            In : function(b) {
                return b * b;
            },
            Out : function(d) {
                return d * (2 - d);
            },
            InOut : function(t) {
                return (t = t * 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1);
            }
        },
        Cubic : {
            In : function(t) {
                return t * t * t;
            },
            Out : function(t) {
                return --t * t * t + 1;
            },
            InOut : function(t) {
                return (t = t * 2) < 1 ? .5 * t * t * t : .5 * ((t = t - 2) * t * t + 2);
            }
        },
        Quartic : {
            In : function(t) {
                return t * t * t * t;
            },
            Out : function(t) {
                return 1 - --t * t * t * t;
            },
            InOut : function(t) {
                return (t = t * 2) < 1 ? .5 * t * t * t * t : -.5 * ((t = t - 2) * t * t * t - 2);
            }
        },
        Quintic : {
            In : function(t) {
                return t * t * t * t * t;
            },
            Out : function(t) {
                return --t * t * t * t * t + 1;
            },
            InOut : function(t) {
                return (t = t * 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t = t - 2) * t * t * t * t + 2);
            }
        },
        Sinusoidal : {
            In : function(t) {
                return 1 - Math.cos(t * Math.PI / 2);
            },
            Out : function(t) {
                return Math.sin(t * Math.PI / 2);
            },
            InOut : function(t) {
                return .5 * (1 - Math.cos(Math.PI * t));
            }
        },
        Exponential : {
            In : function(b) {
                return 0 === b ? 0 : Math.pow(1024, b - 1);
            },
            Out : function(t) {
                return 1 === t ? 1 : 1 - Math.pow(2, -10 * t);
            },
            InOut : function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : (t = t * 2) < 1 ? .5 * Math.pow(1024, t - 1) : .5 * (-Math.pow(2, -10 * (t - 1)) + 2);
            }
        },
        Circular : {
            In : function(b) {
                return 1 - Math.sqrt(1 - b * b);
            },
            Out : function(t) {
                return Math.sqrt(1 - --t * t);
            },
            InOut : function(t) {
                return (t = t * 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t = t - 2) * t) + 1);
            }
        },
        Elastic : {
            In : function(t) {
                var n;
                /** @type {number} */
                var r = .1;
                /** @type {number} */
                var l = .4;
                return 0 === t ? 0 : 1 === t ? 1 : (!r || r < 1 ? (r = 1, n = l / 4) : n = l * Math.asin(1 / r) / (2 * Math.PI), -(r * Math.pow(2, 10 * (t = t - 1)) * Math.sin((t - n) * (2 * Math.PI) / l)));
            },
            Out : function(t) {
                var p;
                /** @type {number} */
                var h = .1;
                /** @type {number} */
                var n = .4;
                return 0 === t ? 0 : 1 === t ? 1 : (!h || h < 1 ? (h = 1, p = n / 4) : p = n * Math.asin(1 / h) / (2 * Math.PI), h * Math.pow(2, -10 * t) * Math.sin((t - p) * (2 * Math.PI) / n) + 1);
            },
            InOut : function(t) {
                var p;
                /** @type {number} */
                var h = .1;
                /** @type {number} */
                var n = .4;
                return 0 === t ? 0 : 1 === t ? 1 : (!h || h < 1 ? (h = 1, p = n / 4) : p = n * Math.asin(1 / h) / (2 * Math.PI), (t = t * 2) < 1 ? -.5 * (h * Math.pow(2, 10 * (t = t - 1)) * Math.sin((t - p) * (2 * Math.PI) / n)) : h * Math.pow(2, -10 * (t = t - 1)) * Math.sin((t - p) * (2 * Math.PI) / n) * .5 + 1);
            }
        },
        Back : {
            In : function(t) {
                /** @type {number} */
                var s = 1.70158;
                return t * t * ((s + 1) * t - s);
            },
            Out : function(t) {
                /** @type {number} */
                var s = 1.70158;
                return --t * t * ((s + 1) * t + s) + 1;
            },
            InOut : function(t) {
                /** @type {number} */
                var s = 2.5949095;
                return (t = t * 2) < 1 ? .5 * (t * t * ((s + 1) * t - s)) : .5 * ((t = t - 2) * t * ((s + 1) * t + s) + 2);
            }
        },
        Bounce : {
            In : function(a) {
                return 1 - TWEEN.Easing.Bounce.Out(1 - a);
            },
            Out : function(t) {
                return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t = t - 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t = t - 2.25 / 2.75) * t + .9375 : 7.5625 * (t = t - 2.625 / 2.75) * t + .984375;
            },
            InOut : function(a) {
                return a < .5 ? .5 * TWEEN.Easing.Bounce.In(2 * a) : .5 * TWEEN.Easing.Bounce.Out(2 * a - 1) + .5;
            }
        }
    };
    TWEEN.Interpolation = {
        Linear : function(a, c) {
            /** @type {number} */
            var b = a.length - 1;
            /** @type {number} */
            var d = b * c;
            /** @type {number} */
            var e = Math.floor(d);
            var g = TWEEN.Interpolation.Utils.Linear;
            return c < 0 ? g(a[0], a[1], d) : c > 1 ? g(a[b], a[b - 1], b - d) : g(a[e], a[e + 1 > b ? b : e + 1], d - e);
        },
        Bezier : function(a, k) {
            var i;
            /** @type {number} */
            var b = 0;
            /** @type {number} */
            var n = a.length - 1;
            /** @type {function(?, ?): number} */
            var pw = Math.pow;
            var bn = TWEEN.Interpolation.Utils.Bernstein;
            /** @type {number} */
            i = 0;
            for (; i <= n; i++) {
                /** @type {number} */
                b = b + pw(1 - k, n - i) * pw(k, i) * a[i] * bn(n, i);
            }
            return b;
        },
        CatmullRom : function(v, k) {
            /** @type {number} */
            var m = v.length - 1;
            /** @type {number} */
            var f = m * k;
            /** @type {number} */
            var i = Math.floor(f);
            var fn = TWEEN.Interpolation.Utils.CatmullRom;
            return v[0] === v[m] ? (k < 0 && (i = Math.floor(f = m * (1 + k))), fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i)) : k < 0 ? v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]) : k > 1 ? v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]) : fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
        },
        Utils : {
            Linear : function(a, b, t) {
                return (b - a) * t + a;
            },
            Bernstein : function(a, c) {
                var b = TWEEN.Interpolation.Utils.Factorial;
                return b(a) / b(c) / b(a - c);
            },
            Factorial : function() {
                /** @type {!Array} */
                var subwikiListsCache = [1];
                return function(wikiId) {
                    var HeaderContentBonusMultiplier;
                    /** @type {number} */
                    var headerScore = 1;
                    if (subwikiListsCache[wikiId]) {
                        return subwikiListsCache[wikiId];
                    }
                    /** @type {number} */
                    HeaderContentBonusMultiplier = wikiId;
                    for (; HeaderContentBonusMultiplier > 1; HeaderContentBonusMultiplier--) {
                        /** @type {number} */
                        headerScore = headerScore * HeaderContentBonusMultiplier;
                    }
                    return subwikiListsCache[wikiId] = headerScore;
                };
            }(),
            CatmullRom : function(p0, p1, p2, p3, t) {
                /** @type {number} */
                var c = .5 * (p2 - p0);
                /** @type {number} */
                var b = .5 * (p3 - p1);
                /** @type {number} */
                var d = t * t;
                /** @type {number} */
                var u = t * d;
                return (2 * p1 - 2 * p2 + c + b) * u + (-3 * p1 + 3 * p2 - 2 * c - b) * d + c * t + p1;
            }
        }
    };
    if ("undefined" != typeof module && module.exports) {
        module.exports = TWEEN;
    }
}