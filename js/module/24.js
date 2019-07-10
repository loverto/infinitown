var town24 = function (moment, module, val) {
    (function(options, global) {
        !function(f) {
            if ("object" == typeof val && "undefined" != typeof module) {
                module.exports = f();
            } else {
                if ("function" == typeof define && define.amd) {
                    define([], f);
                } else {
                    var g;
                    if ("undefined" != typeof window) {
                        /** @type {!Window} */
                        g = window;
                    } else {
                        if ("undefined" != typeof global) {
                            /** @type {!Object} */
                            g = global;
                        } else {
                            if ("undefined" != typeof self) {
                                /** @type {!Window} */
                                g = self;
                            }
                        }
                    }
                    g.Promise = f();
                }
            }
        }(function() {
            var e;
            var n;
            var i;
            return function e(t, n, r) {
                /**
                 * @param {string} o
                 * @param {?} u
                 * @return {?}
                 */
                function s(o, u) {
                    if (!n[o]) {
                        if (!t[o]) {
                            var a = "function" == typeof _dereq_ && _dereq_;
                            if (!u && a) {
                                return a(o, true);
                            }
                            if (i) {
                                return i(o, true);
                            }
                            /** @type {!Error} */
                            var f = new Error("Cannot find module '" + o + "'");
                            throw f.code = "MODULE_NOT_FOUND", f;
                        }
                        var u = n[o] = {
                            exports : {}
                        };
                        t[o][0].call(u.exports, function(e) {
                            var n = t[o][1][e];
                            return s(n ? n : e);
                        }, u, u.exports, e, t, n, r);
                    }
                    return n[o].exports;
                }
                var i = "function" == typeof _dereq_ && _dereq_;
                /** @type {number} */
                var o = 0;
                for (; o < r.length; o++) {
                    s(r[o]);
                }
                return s;
            }({
                1 : [function(canCreateDiscussions, mixin, n) {
                    /**
                     * @param {!Object} Promise
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise) {
                        /**
                         * @param {?} promises
                         * @return {?}
                         */
                        function any(promises) {
                            var ret = new SomePromiseArray(promises);
                            var r = ret.promise();
                            return ret.setHowMany(1), ret.setUnwrap(), ret.init(), r;
                        }
                        var SomePromiseArray = Promise._SomePromiseArray;
                        /**
                         * @param {?} promises
                         * @return {?}
                         */
                        Promise.any = function(promises) {
                            return any(promises);
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype.any = function() {
                            return any(this);
                        };
                    };
                }, {}],
                2 : [function(require, module, canCreateDiscussions) {
                    /**
                     * @return {undefined}
                     */
                    function Async() {
                        /** @type {boolean} */
                        this._customScheduler = false;
                        /** @type {boolean} */
                        this._isTickUsed = false;
                        this._lateQueue = new Queue(16);
                        this._normalQueue = new Queue(16);
                        /** @type {boolean} */
                        this._haveDrainedQueues = false;
                        /** @type {boolean} */
                        this._trampolineEnabled = true;
                        var self = this;
                        /**
                         * @return {undefined}
                         */
                        this.drainQueues = function() {
                            self._drainQueues();
                        };
                        this._schedule = fn;
                    }
                    /**
                     * @param {!Object} fn
                     * @param {!Function} receiver
                     * @param {!Object} arg
                     * @return {undefined}
                     */
                    function AsyncInvokeLater(fn, receiver, arg) {
                        this._lateQueue.push(fn, receiver, arg);
                        this._queueTick();
                    }
                    /**
                     * @param {!Object} fn
                     * @param {!Function} receiver
                     * @param {!Object} arg
                     * @return {undefined}
                     */
                    function AsyncInvoke(fn, receiver, arg) {
                        this._normalQueue.push(fn, receiver, arg);
                        this._queueTick();
                    }
                    /**
                     * @param {!Function} promise
                     * @return {undefined}
                     */
                    function AsyncSettlePromises(promise) {
                        this._normalQueue._pushOne(promise);
                        this._queueTick();
                    }
                    var firstLineError;
                    try {
                        throw new Error;
                    } catch (e) {
                        firstLineError = e;
                    }
                    var fn = require("./schedule");
                    var Queue = require("./queue");
                    var util = require("./util");
                    /**
                     * @param {string} fn
                     * @return {?}
                     */
                    Async.prototype.setScheduler = function(fn) {
                        var prev = this._schedule;
                        return this._schedule = fn, this._customScheduler = true, prev;
                    };
                    /**
                     * @return {?}
                     */
                    Async.prototype.hasCustomScheduler = function() {
                        return this._customScheduler;
                    };
                    /**
                     * @return {undefined}
                     */
                    Async.prototype.enableTrampoline = function() {
                        /** @type {boolean} */
                        this._trampolineEnabled = true;
                    };
                    /**
                     * @return {undefined}
                     */
                    Async.prototype.disableTrampolineIfNecessary = function() {
                        if (util.hasDevTools) {
                            /** @type {boolean} */
                            this._trampolineEnabled = false;
                        }
                    };
                    /**
                     * @return {?}
                     */
                    Async.prototype.haveItemsQueued = function() {
                        return this._isTickUsed || this._haveDrainedQueues;
                    };
                    /**
                     * @param {string} e
                     * @param {?} isNode
                     * @return {undefined}
                     */
                    Async.prototype.fatalError = function(e, isNode) {
                        if (isNode) {
                            options.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) + "\n");
                            options.exit(2);
                        } else {
                            this.throwLater(e);
                        }
                    };
                    /**
                     * @param {!Object} fn
                     * @param {!Function} error
                     * @return {undefined}
                     */
                    Async.prototype.throwLater = function(fn, error) {
                        if (1 === arguments.length && (error = fn, fn = function() {
                            throw error;
                        }), "undefined" != typeof setTimeout) {
                            setTimeout(function() {
                                fn(error);
                            }, 0);
                        } else {
                            try {
                                this._schedule(function() {
                                    fn(error);
                                });
                            } catch (n) {
                                throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
                            }
                        }
                    };
                    if (util.hasDevTools) {
                        /**
                         * @param {!Function} fn
                         * @param {?} receiver
                         * @param {?} arg
                         * @return {undefined}
                         */
                        Async.prototype.invokeLater = function(fn, receiver, arg) {
                            if (this._trampolineEnabled) {
                                AsyncInvokeLater.call(this, fn, receiver, arg);
                            } else {
                                this._schedule(function() {
                                    setTimeout(function() {
                                        fn.call(receiver, arg);
                                    }, 100);
                                });
                            }
                        };
                        /**
                         * @param {!Function} fn
                         * @param {?} receiver
                         * @param {!Object} arg
                         * @return {undefined}
                         */
                        Async.prototype.invoke = function(fn, receiver, arg) {
                            if (this._trampolineEnabled) {
                                AsyncInvoke.call(this, fn, receiver, arg);
                            } else {
                                this._schedule(function() {
                                    fn.call(receiver, arg);
                                });
                            }
                        };
                        /**
                         * @param {?} promise
                         * @return {undefined}
                         */
                        Async.prototype.settlePromises = function(promise) {
                            if (this._trampolineEnabled) {
                                AsyncSettlePromises.call(this, promise);
                            } else {
                                this._schedule(function() {
                                    promise._settlePromises();
                                });
                            }
                        };
                    } else {
                        /** @type {function(!Object, !Function, !Object): undefined} */
                        Async.prototype.invokeLater = AsyncInvokeLater;
                        /** @type {function(!Object, !Function, !Object): undefined} */
                        Async.prototype.invoke = AsyncInvoke;
                        /** @type {function(!Function): undefined} */
                        Async.prototype.settlePromises = AsyncSettlePromises;
                    }
                    /**
                     * @param {!Array} queue
                     * @return {undefined}
                     */
                    Async.prototype._drainQueue = function(queue) {
                        for (; queue.length() > 0;) {
                            var fn = queue.shift();
                            if ("function" == typeof fn) {
                                var promise = queue.shift();
                                var event = queue.shift();
                                fn.call(promise, event);
                            } else {
                                fn._settlePromises();
                            }
                        }
                    };
                    /**
                     * @return {undefined}
                     */
                    Async.prototype._drainQueues = function() {
                        this._drainQueue(this._normalQueue);
                        this._reset();
                        /** @type {boolean} */
                        this._haveDrainedQueues = true;
                        this._drainQueue(this._lateQueue);
                    };
                    /**
                     * @return {undefined}
                     */
                    Async.prototype._queueTick = function() {
                        if (!this._isTickUsed) {
                            /** @type {boolean} */
                            this._isTickUsed = true;
                            this._schedule(this.drainQueues);
                        }
                    };
                    /**
                     * @return {undefined}
                     */
                    Async.prototype._reset = function() {
                        /** @type {boolean} */
                        this._isTickUsed = false;
                    };
                    /** @type {function(): undefined} */
                    module.exports = Async;
                    module.exports.firstLineError = firstLineError;
                }, {
                    "./queue" : 26,
                    "./schedule" : 29,
                    "./util" : 36
                }],
                3 : [function(canCreateDiscussions, mixin, n) {
                    /**
                     * @param {!Function} Promise
                     * @param {!Object} INTERNAL
                     * @param {!Object} tryConvertToPromise
                     * @param {?} debug
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
                        /** @type {boolean} */
                        var i = false;
                        /**
                         * @param {?} array
                         * @param {undefined} e
                         * @return {undefined}
                         */
                        var completed = function(array, e) {
                            this._reject(e);
                        };
                        /**
                         * @param {!Object} e
                         * @param {?} context
                         * @return {undefined}
                         */
                        var targetRejected = function(e, context) {
                            /** @type {boolean} */
                            context.promiseRejectionQueued = true;
                            context.bindingPromise._then(completed, completed, null, this, e);
                        };
                        /**
                         * @param {?} thisArg
                         * @param {!Event} context
                         * @return {undefined}
                         */
                        var bindingResolved = function(thisArg, context) {
                            if (0 === (50397184 & this._bitField)) {
                                this._resolveCallback(context.target);
                            }
                        };
                        /**
                         * @param {undefined} e
                         * @param {?} context
                         * @return {undefined}
                         */
                        var bindingRejected = function(e, context) {
                            if (!context.promiseRejectionQueued) {
                                this._reject(e);
                            }
                        };
                        /**
                         * @param {string} value
                         * @return {?}
                         */
                        Promise.prototype.bind = function(value) {
                            if (!i) {
                                /** @type {boolean} */
                                i = true;
                                Promise.prototype._propagateFrom = debug.propagateFromFunction();
                                Promise.prototype._boundValue = debug.boundValueFunction();
                            }
                            var maybePromise = tryConvertToPromise(value);
                            var ret = new Promise(INTERNAL);
                            ret._propagateFrom(this, 1);
                            var target = this._target();
                            if (ret._setBoundTo(maybePromise), maybePromise instanceof Promise) {
                                var context = {
                                    promiseRejectionQueued : false,
                                    promise : ret,
                                    target : target,
                                    bindingPromise : maybePromise
                                };
                                target._then(INTERNAL, targetRejected, void 0, ret, context);
                                maybePromise._then(bindingResolved, bindingRejected, void 0, ret, context);
                                ret._setOnCancel(maybePromise);
                            } else {
                                ret._resolveCallback(target);
                            }
                            return ret;
                        };
                        /**
                         * @param {number} obj
                         * @return {undefined}
                         */
                        Promise.prototype._setBoundTo = function(obj) {
                            if (void 0 !== obj) {
                                /** @type {number} */
                                this._bitField = 2097152 | this._bitField;
                                /** @type {number} */
                                this._boundTo = obj;
                            } else {
                                /** @type {number} */
                                this._bitField = this._bitField & -2097153;
                            }
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype._isBound = function() {
                            return 2097152 === (2097152 & this._bitField);
                        };
                        /**
                         * @param {string} type
                         * @param {!Object} data
                         * @return {?}
                         */
                        Promise.bind = function(type, data) {
                            return Promise.resolve(data).bind(type);
                        };
                    };
                }, {}],
                4 : [function(saveNotifs, module, n) {
                    /**
                     * @return {?}
                     */
                    function noConflict() {
                        try {
                            if (Promise === bluebird) {
                                Promise = globalPromise;
                            }
                        } catch (t) {
                        }
                        return bluebird;
                    }
                    var globalPromise;
                    if ("undefined" != typeof Promise) {
                        /** @type {function(new:Promise, function(function((IThenable<TYPE>|TYPE|Thenable|null)=): ?, function(*=): ?): ?): ?} */
                        globalPromise = Promise;
                    }
                    var bluebird = saveNotifs("./promise")();
                    /** @type {function(): ?} */
                    bluebird.noConflict = noConflict;
                    module.exports = bluebird;
                }, {
                    "./promise" : 22
                }],
                5 : [function(require, mixin, n) {
                    /** @type {function((Object|null), (Object|null)=): !Object} */
                    var nativeCreate = Object.create;
                    if (nativeCreate) {
                        /** @type {!Object} */
                        var erodeNoise = nativeCreate(null);
                        /** @type {!Object} */
                        var ruggedNoise = nativeCreate(null);
                        /** @type {number} */
                        erodeNoise[" size"] = ruggedNoise[" size"] = 0;
                    }
                    /**
                     * @param {!Function} Promise
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise) {
                        /**
                         * @param {?} obj
                         * @param {boolean} key
                         * @return {?}
                         */
                        function ensureMethod(obj, key) {
                            var fn;
                            if (null != obj && (fn = obj[key]), "function" != typeof fn) {
                                /** @type {string} */
                                var message = "Object " + util.classString(obj) + " has no method '" + util.toString(key) + "'";
                                throw new Promise.TypeError(message);
                            }
                            return fn;
                        }
                        /**
                         * @param {?} obj
                         * @return {?}
                         */
                        function caller(obj) {
                            var methodName = this.pop();
                            var fn = ensureMethod(obj, methodName);
                            return fn.apply(obj, this);
                        }
                        /**
                         * @param {!Window} b
                         * @return {?}
                         */
                        function R(b) {
                            return b[this];
                        }
                        /**
                         * @param {!NodeList} array
                         * @return {?}
                         */
                        function first(array) {
                            /** @type {number} */
                            var i = +this;
                            return i < 0 && (i = Math.max(0, i + array.length)), array[i];
                        }
                        var checkAndAddDescendantIfModel;
                        var util = require("./util");
                        var canEvaluate = util.canEvaluate;
                        util.isIdentifier;
                        /**
                         * @param {?} obj
                         * @return {?}
                         */
                        Promise.prototype.call = function(obj) {
                            /** @type {!Array<?>} */
                            var args = [].slice.call(arguments, 1);
                            return args.push(obj), this._then(caller, void 0, void 0, args, void 0);
                        };
                        /**
                         * @param {string} value
                         * @return {?}
                         */
                        Promise.prototype.get = function(value) {
                            var r;
                            /** @type {boolean} */
                            var hasDefault = "number" == typeof value;
                            if (hasDefault) {
                                /** @type {function(!NodeList): ?} */
                                r = first;
                            } else {
                                if (canEvaluate) {
                                    var c = checkAndAddDescendantIfModel(value);
                                    r = null !== c ? c : R;
                                } else {
                                    /** @type {function(!Window): ?} */
                                    r = R;
                                }
                            }
                            return this._then(r, void 0, void 0, value, void 0);
                        };
                    };
                }, {
                    "./util" : 36
                }],
                6 : [function(require, mixin, n) {
                    /**
                     * @param {!Function} Promise
                     * @param {!Object} obj
                     * @param {!Object} prop
                     * @param {?} config
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, obj, prop, config) {
                        var util = require("./util");
                        var tryCatch = util.tryCatch;
                        var errorObj = util.errorObj;
                        var async = Promise._async;
                        /** @type {function(): ?} */
                        Promise.prototype["break"] = Promise.prototype.cancel = function() {
                            if (!config.cancellation()) {
                                return this._warn("cancellation is disabled");
                            }
                            var promise = this;
                            var child = promise;
                            for (; promise._isCancellable();) {
                                if (!promise._cancelBy(child)) {
                                    if (child._isFollowing()) {
                                        child._followee().cancel();
                                    } else {
                                        child._cancelBranched();
                                    }
                                    break;
                                }
                                var parent = promise._cancellationParent;
                                if (null == parent || !parent._isCancellable()) {
                                    if (promise._isFollowing()) {
                                        promise._followee().cancel();
                                    } else {
                                        promise._cancelBranched();
                                    }
                                    break;
                                }
                                if (promise._isFollowing()) {
                                    promise._followee().cancel();
                                }
                                promise._setWillBeCancelled();
                                child = promise;
                                promise = parent;
                            }
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._branchHasCancelled = function() {
                            this._branchesRemainingToCancel--;
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype._enoughBranchesHaveCancelled = function() {
                            return void 0 === this._branchesRemainingToCancel || this._branchesRemainingToCancel <= 0;
                        };
                        /**
                         * @param {?} canceller
                         * @return {?}
                         */
                        Promise.prototype._cancelBy = function(canceller) {
                            return canceller === this ? (this._branchesRemainingToCancel = 0, this._invokeOnCancel(), true) : (this._branchHasCancelled(), !!this._enoughBranchesHaveCancelled() && (this._invokeOnCancel(), true));
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._cancelBranched = function() {
                            if (this._enoughBranchesHaveCancelled()) {
                                this._cancel();
                            }
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._cancel = function() {
                            if (this._isCancellable()) {
                                this._setCancelled();
                                async.invoke(this._cancelPromises, this, void 0);
                            }
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._cancelPromises = function() {
                            if (this._length() > 0) {
                                this._settlePromises();
                            }
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._unsetOnCancel = function() {
                            this._onCancelField = void 0;
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype._isCancellable = function() {
                            return this.isPending() && !this._isCancelled();
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype.isCancellable = function() {
                            return this.isPending() && !this.isCancelled();
                        };
                        /**
                         * @param {?} onCancelCallback
                         * @param {string} internalOnly
                         * @return {undefined}
                         */
                        Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
                            if (util.isArray(onCancelCallback)) {
                                /** @type {number} */
                                var i = 0;
                                for (; i < onCancelCallback.length; ++i) {
                                    this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
                                }
                            } else {
                                if (void 0 !== onCancelCallback) {
                                    if ("function" == typeof onCancelCallback) {
                                        if (!internalOnly) {
                                            var e = tryCatch(onCancelCallback).call(this._boundValue());
                                            if (e === errorObj) {
                                                this._attachExtraTrace(e.e);
                                                async.throwLater(e.e);
                                            }
                                        }
                                    } else {
                                        onCancelCallback._resultCancelled(this);
                                    }
                                }
                            }
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._invokeOnCancel = function() {
                            var onCancelCallback = this._onCancel();
                            this._unsetOnCancel();
                            async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._invokeInternalOnCancel = function() {
                            if (this._isCancellable()) {
                                this._doInvokeOnCancel(this._onCancel(), true);
                                this._unsetOnCancel();
                            }
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._resultCancelled = function() {
                            this.cancel();
                        };
                    };
                }, {
                    "./util" : 36
                }],
                7 : [function(_dereq_, mixin, n) {
                    /**
                     * @param {!Function} obj
                     * @return {?}
                     */
                    mixin.exports = function(obj) {
                        /**
                         * @param {!NodeList} instances
                         * @param {!Function} cb
                         * @param {?} promise
                         * @return {?}
                         */
                        function catchFilter(instances, cb, promise) {
                            return function(e) {
                                var boundTo = promise._boundValue();
                                /** @type {number} */
                                var i = 0;
                                t: for (; i < instances.length; ++i) {
                                    var item = instances[i];
                                    if (item === Error || null != item && item.prototype instanceof Error) {
                                        if (e instanceof item) {
                                            return tryCatch(cb).call(boundTo, e);
                                        }
                                    } else {
                                        if ("function" == typeof item) {
                                            var matchesPredicate = tryCatch(item).call(boundTo, e);
                                            if (matchesPredicate === errorObj) {
                                                return matchesPredicate;
                                            }
                                            if (matchesPredicate) {
                                                return tryCatch(cb).call(boundTo, e);
                                            }
                                        } else {
                                            if (util.isObject(e)) {
                                                var obj = isObject(item);
                                                /** @type {number} */
                                                var i = 0;
                                                for (; i < obj.length; ++i) {
                                                    var key = obj[i];
                                                    if (item[key] != e[key]) {
                                                        continue t;
                                                    }
                                                }
                                                return tryCatch(cb).call(boundTo, e);
                                            }
                                        }
                                    }
                                }
                                return obj;
                            };
                        }
                        var util = _dereq_("./util");
                        var isObject = _dereq_("./es5").keys;
                        var tryCatch = util.tryCatch;
                        var errorObj = util.errorObj;
                        return catchFilter;
                    };
                }, {
                    "./es5" : 13,
                    "./util" : 36
                }],
                8 : [function(canCreateDiscussions, mixin, n) {
                    /**
                     * @param {!Function} Promise
                     * @return {?}
                     */
                    mixin.exports = function(Promise) {
                        /**
                         * @return {undefined}
                         */
                        function Context() {
                            this._trace = new Context.CapturedTrace(peekContext());
                        }
                        /**
                         * @return {?}
                         */
                        function createContext() {
                            if (i) {
                                return new Context;
                            }
                        }
                        /**
                         * @return {?}
                         */
                        function peekContext() {
                            /** @type {number} */
                            var i = contextStack.length - 1;
                            if (i >= 0) {
                                return contextStack[i];
                            }
                        }
                        /** @type {boolean} */
                        var i = false;
                        /** @type {!Array} */
                        var contextStack = [];
                        return Promise.prototype._promiseCreated = function() {
                        }, Promise.prototype._pushContext = function() {
                        }, Promise.prototype._popContext = function() {
                            return null;
                        }, Promise._peekContext = Promise.prototype._peekContext = function() {
                        }, Context.prototype._pushContext = function() {
                            if (void 0 !== this._trace) {
                                /** @type {null} */
                                this._trace._promiseCreated = null;
                                contextStack.push(this._trace);
                            }
                        }, Context.prototype._popContext = function() {
                            if (void 0 !== this._trace) {
                                var trace = contextStack.pop();
                                var ret = trace._promiseCreated;
                                return trace._promiseCreated = null, ret;
                            }
                            return null;
                        }, Context.CapturedTrace = null, Context.create = createContext, Context.deactivateLongStackTraces = function() {
                        }, Context.activateLongStackTraces = function() {
                            var Promise_pushContext = Promise.prototype._pushContext;
                            var Promise_popContext = Promise.prototype._popContext;
                            var Promise_PeekContext = Promise._peekContext;
                            var Promise_peekContext = Promise.prototype._peekContext;
                            /** @type {function(): undefined} */
                            var Promise_promiseCreated = Promise.prototype._promiseCreated;
                            /**
                             * @return {undefined}
                             */
                            Context.deactivateLongStackTraces = function() {
                                Promise.prototype._pushContext = Promise_pushContext;
                                Promise.prototype._popContext = Promise_popContext;
                                Promise._peekContext = Promise_PeekContext;
                                Promise.prototype._peekContext = Promise_peekContext;
                                /** @type {function(): undefined} */
                                Promise.prototype._promiseCreated = Promise_promiseCreated;
                                /** @type {boolean} */
                                i = false;
                            };
                            /** @type {boolean} */
                            i = true;
                            /** @type {function(): undefined} */
                            Promise.prototype._pushContext = Context.prototype._pushContext;
                            /** @type {function(): ?} */
                            Promise.prototype._popContext = Context.prototype._popContext;
                            /** @type {function(): ?} */
                            Promise._peekContext = Promise.prototype._peekContext = peekContext;
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._promiseCreated = function() {
                                var ctx = this._peekContext();
                                if (ctx && null == ctx._promiseCreated) {
                                    ctx._promiseCreated = this;
                                }
                            };
                        }, Context;
                    };
                }, {}],
                9 : [function(_dereq_, mixin, canCreateDiscussions) {
                    /**
                     * @param {!Object} Promise
                     * @param {!Object} Context
                     * @return {?}
                     */
                    mixin.exports = function(Promise, Context) {
                        /**
                         * @param {?} name
                         * @param {!Object} promise
                         * @return {?}
                         */
                        function generatePromiseLifecycleEventObject(name, promise) {
                            return {
                                promise : promise
                            };
                        }
                        /**
                         * @return {?}
                         */
                        function defaultFireEvent() {
                            return false;
                        }
                        /**
                         * @param {!Function} executor
                         * @param {!Function} resolve
                         * @param {!Function} reject
                         * @return {?}
                         */
                        function cancellationExecute(executor, resolve, reject) {
                            var promise = this;
                            try {
                                executor(resolve, reject, function(onCancel) {
                                    if ("function" != typeof onCancel) {
                                        throw new TypeError("onCancel must be a function, got: " + util.toString(onCancel));
                                    }
                                    promise._attachCancellationCallback(onCancel);
                                });
                            } catch (e) {
                                return e;
                            }
                        }
                        /**
                         * @param {!Array} onCancel
                         * @return {?}
                         */
                        function cancellationAttachCancellationCallback(onCancel) {
                            if (!this._isCancellable()) {
                                return this;
                            }
                            var previousOnCancel = this._onCancel();
                            if (void 0 !== previousOnCancel) {
                                if (util.isArray(previousOnCancel)) {
                                    previousOnCancel.push(onCancel);
                                } else {
                                    this._setOnCancel([previousOnCancel, onCancel]);
                                }
                            } else {
                                this._setOnCancel(onCancel);
                            }
                        }
                        /**
                         * @return {?}
                         */
                        function cancellationOnCancel() {
                            return this._onCancelField;
                        }
                        /**
                         * @param {!Object} obj
                         * @return {undefined}
                         */
                        function cancellationSetOnCancel(obj) {
                            /** @type {!Object} */
                            this._onCancelField = obj;
                        }
                        /**
                         * @return {undefined}
                         */
                        function cancellationClearCancellationData() {
                            this._cancellationParent = void 0;
                            this._onCancelField = void 0;
                        }
                        /**
                         * @param {!Object} parent
                         * @param {number} flags
                         * @return {undefined}
                         */
                        function cancellationPropagateFrom(parent, flags) {
                            if (0 !== (1 & flags)) {
                                /** @type {!Object} */
                                this._cancellationParent = parent;
                                var branchesRemainingToCancel = parent._branchesRemainingToCancel;
                                if (void 0 === branchesRemainingToCancel) {
                                    /** @type {number} */
                                    branchesRemainingToCancel = 0;
                                }
                                parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
                            }
                            if (0 !== (2 & flags) && parent._isBound()) {
                                this._setBoundTo(parent._boundTo);
                            }
                        }
                        /**
                         * @param {!Object} parent
                         * @param {number} flags
                         * @return {undefined}
                         */
                        function bindingPropagateFrom(parent, flags) {
                            if (0 !== (2 & flags) && parent._isBound()) {
                                this._setBoundTo(parent._boundTo);
                            }
                        }
                        /**
                         * @return {?}
                         */
                        function boundValueFunction() {
                            var ret = this._boundTo;
                            return void 0 !== ret && ret instanceof Promise ? ret.isFulfilled() ? ret.value() : void 0 : ret;
                        }
                        /**
                         * @return {undefined}
                         */
                        function longStackTracesCaptureStackTrace() {
                            this._trace = new CapturedTrace(this._peekContext());
                        }
                        /**
                         * @param {!Object} error
                         * @param {boolean} ignoreSelf
                         * @return {undefined}
                         */
                        function longStackTracesAttachExtraTrace(error, ignoreSelf) {
                            if (canAttachTrace(error)) {
                                var trace = this._trace;
                                if (void 0 !== trace && ignoreSelf && (trace = trace._parent), void 0 !== trace) {
                                    trace.attachExtraTrace(error);
                                } else {
                                    if (!error.__stackCleaned__) {
                                        var parsed = parseStackAndMessage(error);
                                        util.notEnumerableProp(error, "stack", parsed.message + "\n" + parsed.stack.join("\n"));
                                        util.notEnumerableProp(error, "__stackCleaned__", true);
                                    }
                                }
                            }
                        }
                        /**
                         * @param {number} returnValue
                         * @param {number} promiseCreated
                         * @param {string} name
                         * @param {!Function} promise
                         * @param {number} parent
                         * @return {undefined}
                         */
                        function checkForgottenReturns(returnValue, promiseCreated, name, promise, parent) {
                            if (void 0 === returnValue && null !== promiseCreated && wForgottenReturn) {
                                if (void 0 !== parent && parent._returnedNonUndefined()) {
                                    return;
                                }
                                if (0 === (65535 & promise._bitField)) {
                                    return;
                                }
                                if (name) {
                                    /** @type {string} */
                                    name = name + " ";
                                }
                                /** @type {string} */
                                var th_field = "";
                                /** @type {string} */
                                var creatorLine = "";
                                if (promiseCreated._trace) {
                                    var traceLines = promiseCreated._trace.stack.split("\n");
                                    var stack = cleanStack(traceLines);
                                    /** @type {number} */
                                    var i = stack.length - 1;
                                    for (; i >= 0; --i) {
                                        var line = stack[i];
                                        if (!MULTI_LINE_COMMENT_REGEX.test(line)) {
                                            var scheduledStuff = line.match(scheduledRE);
                                            if (scheduledStuff) {
                                                /** @type {string} */
                                                th_field = "at " + scheduledStuff[1] + ":" + scheduledStuff[2] + ":" + scheduledStuff[3] + " ";
                                            }
                                            break;
                                        }
                                    }
                                    if (stack.length > 0) {
                                        var firstUserLine = stack[0];
                                        /** @type {number} */
                                        i = 0;
                                        for (; i < traceLines.length; ++i) {
                                            if (traceLines[i] === firstUserLine) {
                                                if (i > 0) {
                                                    creatorLine = "\n" + traceLines[i - 1];
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                                /** @type {string} */
                                var msg = "a promise was created in a " + name + "handler " + th_field + "but was not returned from it, see http://goo.gl/rRqMUw" + creatorLine;
                                promise._warn(msg, true, promiseCreated);
                            }
                        }
                        /**
                         * @param {string} name
                         * @param {string} res
                         * @return {?}
                         */
                        function deprecated(name, res) {
                            /** @type {string} */
                            var message = name + " is deprecated and will be removed in a future version.";
                            return res && (message = message + (" Use " + res + " instead.")), warn(message);
                        }
                        /**
                         * @param {string} text
                         * @param {!Object} type
                         * @param {?} promise
                         * @return {undefined}
                         */
                        function warn(text, type, promise) {
                            if (config.warnings) {
                                var ctx;
                                var warning = new Warning(text);
                                if (type) {
                                    promise._attachExtraTrace(warning);
                                } else {
                                    if (config.longStackTraces && (ctx = Promise._peekContext())) {
                                        ctx.attachExtraTrace(warning);
                                    } else {
                                        var parsed = parseStackAndMessage(warning);
                                        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
                                    }
                                }
                                if (!activeFireEvent("warning", warning)) {
                                    formatAndLogError(warning, "", true);
                                }
                            }
                        }
                        /**
                         * @param {string} message
                         * @param {!Array} stacks
                         * @return {?}
                         */
                        function reconstructStack(message, stacks) {
                            /** @type {number} */
                            var i = 0;
                            for (; i < stacks.length - 1; ++i) {
                                stacks[i].push("From previous event:");
                                stacks[i] = stacks[i].join("\n");
                            }
                            return i < stacks.length && (stacks[i] = stacks[i].join("\n")), message + "\n" + stacks.join("\n");
                        }
                        /**
                         * @param {!Array} stacks
                         * @return {undefined}
                         */
                        function removeDuplicateOrEmptyJumps(stacks) {
                            /** @type {number} */
                            var i = 0;
                            for (; i < stacks.length; ++i) {
                                if (0 === stacks[i].length || i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0]) {
                                    stacks.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                        /**
                         * @param {!Array} stacks
                         * @return {undefined}
                         */
                        function removeCommonRoots(stacks) {
                            var current = stacks[0];
                            /** @type {number} */
                            var i = 1;
                            for (; i < stacks.length; ++i) {
                                var prev = stacks[i];
                                /** @type {number} */
                                var currentLastIndex = current.length - 1;
                                var currentLastLine = current[currentLastIndex];
                                /** @type {number} */
                                var aWeightIndex = -1;
                                /** @type {number} */
                                var j = prev.length - 1;
                                for (; j >= 0; --j) {
                                    if (prev[j] === currentLastLine) {
                                        /** @type {number} */
                                        aWeightIndex = j;
                                        break;
                                    }
                                }
                                /** @type {number} */
                                j = aWeightIndex;
                                for (; j >= 0; --j) {
                                    var line = prev[j];
                                    if (current[currentLastIndex] !== line) {
                                        break;
                                    }
                                    current.pop();
                                    currentLastIndex--;
                                }
                                current = prev;
                            }
                        }
                        /**
                         * @param {!NodeList} stack
                         * @return {?}
                         */
                        function cleanStack(stack) {
                            /** @type {!Array} */
                            var ret = [];
                            /** @type {number} */
                            var i = 0;
                            for (; i < stack.length; ++i) {
                                var line = stack[i];
                                var isTraceLine = "    (No stack trace)" === line || copy.test(line);
                                var isInternalFrame = isTraceLine && shouldIgnore(line);
                                if (isTraceLine && !isInternalFrame) {
                                    if (Y && " " !== line.charAt(0)) {
                                        /** @type {string} */
                                        line = "    " + line;
                                    }
                                    ret.push(line);
                                }
                            }
                            return ret;
                        }
                        /**
                         * @param {!Object} error
                         * @return {?}
                         */
                        function stackFramesAsArray(error) {
                            var currentArray = error.stack.replace(/\s+$/g, "").split("\n");
                            /** @type {number} */
                            var i = 0;
                            for (; i < currentArray.length; ++i) {
                                var obj = currentArray[i];
                                if ("    (No stack trace)" === obj || copy.test(obj)) {
                                    break;
                                }
                            }
                            return i > 0 && "SyntaxError" != error.name && (currentArray = currentArray.slice(i)), currentArray;
                        }
                        /**
                         * @param {!Object} error
                         * @return {?}
                         */
                        function parseStackAndMessage(error) {
                            var stack = error.stack;
                            var msg_obj = error.toString();
                            return stack = "string" == typeof stack && stack.length > 0 ? stackFramesAsArray(error) : ["    (No stack trace)"], {
                                message : msg_obj,
                                stack : "SyntaxError" == error.name ? stack : cleanStack(stack)
                            };
                        }
                        /**
                         * @param {string} error
                         * @param {string} title
                         * @param {string} isSoft
                         * @return {undefined}
                         */
                        function formatAndLogError(error, title, isSoft) {
                            if ("undefined" != typeof console) {
                                var message;
                                if (util.isObject(error)) {
                                    var stack = error.stack;
                                    message = title + log(stack, error);
                                } else {
                                    /** @type {string} */
                                    message = title + String(error);
                                }
                                if ("function" == typeof printWarning) {
                                    printWarning(message, isSoft);
                                } else {
                                    if (!("function" != typeof console.log && "object" != typeof console.log)) {
                                        console.log(message);
                                    }
                                }
                            }
                        }
                        /**
                         * @param {string} name
                         * @param {?} localHandler
                         * @param {string} reason
                         * @param {?} promise
                         * @return {undefined}
                         */
                        function fireRejectionEvent(name, localHandler, reason, promise) {
                            /** @type {boolean} */
                            var defaultType = false;
                            try {
                                if ("function" == typeof localHandler) {
                                    /** @type {boolean} */
                                    defaultType = true;
                                    if ("rejectionHandled" === name) {
                                        localHandler(promise);
                                    } else {
                                        localHandler(reason, promise);
                                    }
                                }
                            } catch (e) {
                                async.throwLater(e);
                            }
                            if ("unhandledRejection" === name) {
                                if (!(activeFireEvent(name, reason, promise) || defaultType)) {
                                    formatAndLogError(reason, "Unhandled rejection ");
                                }
                            } else {
                                activeFireEvent(name, promise);
                            }
                        }
                        /**
                         * @param {string} value
                         * @return {?}
                         */
                        function find(value) {
                            var r;
                            if ("function" == typeof value) {
                                /** @type {string} */
                                r = "[function " + (value.name || "anonymous") + "]";
                            } else {
                                r = value && "function" == typeof value.toString ? value.toString() : util.toString(value);
                                /** @type {!RegExp} */
                                var n = /\[object [a-zA-Z0-9$_]+\]/;
                                if (n.test(r)) {
                                    try {
                                        /** @type {string} */
                                        var len = JSON.stringify(value);
                                        /** @type {string} */
                                        r = len;
                                    } catch (i) {
                                    }
                                }
                                if (0 === r.length) {
                                    /** @type {string} */
                                    r = "(empty array)";
                                }
                            }
                            return "(<" + S(r) + ">, no stack trace)";
                        }
                        /**
                         * @param {string} t
                         * @return {?}
                         */
                        function S(t) {
                            /** @type {number} */
                            var c = 41;
                            return t.length < c ? t : t.substr(0, c - 3) + "...";
                        }
                        /**
                         * @return {?}
                         */
                        function longStackTracesIsSupported() {
                            return "function" == typeof captureStackTrace;
                        }
                        /**
                         * @param {string} line
                         * @return {?}
                         */
                        function parseLineInfo(line) {
                            var matches = line.match(moduleRe);
                            if (matches) {
                                return {
                                    fileName : matches[1],
                                    line : parseInt(matches[2], 10)
                                };
                            }
                        }
                        /**
                         * @param {!Error} firstLineError
                         * @param {!Error} lastLineError
                         * @return {undefined}
                         */
                        function setBounds(firstLineError, lastLineError) {
                            if (longStackTracesIsSupported()) {
                                var firstFileName;
                                var lastFileName;
                                var firstStackLines = firstLineError.stack.split("\n");
                                var lastStackLines = lastLineError.stack.split("\n");
                                /** @type {number} */
                                var firstIndex = -1;
                                /** @type {number} */
                                var lastIndex = -1;
                                /** @type {number} */
                                var i = 0;
                                for (; i < firstStackLines.length; ++i) {
                                    var result = parseLineInfo(firstStackLines[i]);
                                    if (result) {
                                        firstFileName = result.fileName;
                                        firstIndex = result.line;
                                        break;
                                    }
                                }
                                /** @type {number} */
                                i = 0;
                                for (; i < lastStackLines.length; ++i) {
                                    result = parseLineInfo(lastStackLines[i]);
                                    if (result) {
                                        lastFileName = result.fileName;
                                        lastIndex = result.line;
                                        break;
                                    }
                                }
                                if (!(firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName || firstFileName !== lastFileName || firstIndex >= lastIndex)) {
                                    /**
                                     * @param {string} line
                                     * @return {?}
                                     */
                                    shouldIgnore = function(line) {
                                        if (nullRe.test(line)) {
                                            return true;
                                        }
                                        var info = parseLineInfo(line);
                                        return !!(info && info.fileName === firstFileName && firstIndex <= info.line && info.line <= lastIndex);
                                    };
                                }
                            }
                        }
                        /**
                         * @param {number} parent
                         * @return {undefined}
                         */
                        function CapturedTrace(parent) {
                            /** @type {number} */
                            this._parent = parent;
                            /** @type {number} */
                            this._promisesCreated = 0;
                            var length = this._length = 1 + (void 0 === parent ? 0 : parent._length);
                            captureStackTrace(this, CapturedTrace);
                            if (length > 32) {
                                this.uncycle();
                            }
                        }
                        var possiblyUnhandledRejection;
                        var unhandledRejectionHandled;
                        var printWarning;
                        var getDomain = Promise._getDomain;
                        var async = Promise._async;
                        var Warning = _dereq_("./errors").Warning;
                        var util = _dereq_("./util");
                        var canAttachTrace = util.canAttachTrace;
                        /** @type {!RegExp} */
                        var nullRe = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
                        /** @type {!RegExp} */
                        var MULTI_LINE_COMMENT_REGEX = /\((?:timers\.js):\d+:\d+\)/;
                        /** @type {!RegExp} */
                        var scheduledRE = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
                        /** @type {null} */
                        var copy = null;
                        /** @type {null} */
                        var log = null;
                        /** @type {boolean} */
                        var Y = false;
                        /** @type {boolean} */
                        var q = !(0 == util.env("BLUEBIRD_DEBUG"));
                        /** @type {boolean} */
                        var warnings = !(0 == util.env("BLUEBIRD_WARNINGS") || !q && !util.env("BLUEBIRD_WARNINGS"));
                        /** @type {boolean} */
                        var Z = !(0 == util.env("BLUEBIRD_LONG_STACK_TRACES") || !q && !util.env("BLUEBIRD_LONG_STACK_TRACES"));
                        /** @type {boolean} */
                        var wForgottenReturn = 0 != util.env("BLUEBIRD_W_FORGOTTEN_RETURN") && (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype.suppressUnhandledRejections = function() {
                            var target = this._target();
                            /** @type {number} */
                            target._bitField = target._bitField & -1048577 | 524288;
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._ensurePossibleRejectionHandled = function() {
                            if (0 === (524288 & this._bitField)) {
                                this._setRejectionIsUnhandled();
                                var method = this;
                                setTimeout(function() {
                                    method._notifyUnhandledRejection();
                                }, 1);
                            }
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._notifyUnhandledRejectionIsHandled = function() {
                            fireRejectionEvent("rejectionHandled", possiblyUnhandledRejection, void 0, this);
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._setReturnedNonUndefined = function() {
                            /** @type {number} */
                            this._bitField = 268435456 | this._bitField;
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype._returnedNonUndefined = function() {
                            return 0 !== (268435456 & this._bitField);
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._notifyUnhandledRejection = function() {
                            if (this._isRejectionUnhandled()) {
                                var reason = this._settledValue();
                                this._setUnhandledRejectionIsNotified();
                                fireRejectionEvent("unhandledRejection", unhandledRejectionHandled, reason, this);
                            }
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._setUnhandledRejectionIsNotified = function() {
                            /** @type {number} */
                            this._bitField = 262144 | this._bitField;
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._unsetUnhandledRejectionIsNotified = function() {
                            /** @type {number} */
                            this._bitField = this._bitField & -262145;
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype._isUnhandledRejectionNotified = function() {
                            return (262144 & this._bitField) > 0;
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._setRejectionIsUnhandled = function() {
                            /** @type {number} */
                            this._bitField = 1048576 | this._bitField;
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._unsetRejectionIsUnhandled = function() {
                            /** @type {number} */
                            this._bitField = this._bitField & -1048577;
                            if (this._isUnhandledRejectionNotified()) {
                                this._unsetUnhandledRejectionIsNotified();
                                this._notifyUnhandledRejectionIsHandled();
                            }
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype._isRejectionUnhandled = function() {
                            return (1048576 & this._bitField) > 0;
                        };
                        /**
                         * @param {string} file
                         * @param {string} msg
                         * @param {number} promise
                         * @return {?}
                         */
                        Promise.prototype._warn = function(file, msg, promise) {
                            return warn(file, msg, promise || this);
                        };
                        /**
                         * @param {string} fn
                         * @return {undefined}
                         */
                        Promise.onPossiblyUnhandledRejection = function(fn) {
                            var string = getDomain();
                            unhandledRejectionHandled = "function" == typeof fn ? null === string ? fn : util.domainBind(string, fn) : void 0;
                        };
                        /**
                         * @param {string} fn
                         * @return {undefined}
                         */
                        Promise.onUnhandledRejectionHandled = function(fn) {
                            var string = getDomain();
                            possiblyUnhandledRejection = "function" == typeof fn ? null === string ? fn : util.domainBind(string, fn) : void 0;
                        };
                        /**
                         * @return {undefined}
                         */
                        var disableLongStackTraces = function() {
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.longStackTraces = function() {
                            if (async.haveItemsQueued() && !config.longStackTraces) {
                                throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
                            }
                            if (!config.longStackTraces && longStackTracesIsSupported()) {
                                var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
                                var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
                                /** @type {boolean} */
                                config.longStackTraces = true;
                                /**
                                 * @return {undefined}
                                 */
                                disableLongStackTraces = function() {
                                    if (async.haveItemsQueued() && !config.longStackTraces) {
                                        throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
                                    }
                                    Promise.prototype._captureStackTrace = Promise_captureStackTrace;
                                    Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
                                    Context.deactivateLongStackTraces();
                                    async.enableTrampoline();
                                    /** @type {boolean} */
                                    config.longStackTraces = false;
                                };
                                /** @type {function(): undefined} */
                                Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
                                /** @type {function(!Object, boolean): undefined} */
                                Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
                                Context.activateLongStackTraces();
                                async.disableTrampolineIfNecessary();
                            }
                        };
                        /**
                         * @return {?}
                         */
                        Promise.hasLongStackTraces = function() {
                            return config.longStackTraces && longStackTracesIsSupported();
                        };
                        var fireDomEvent = function() {
                            try {
                                if ("function" == typeof CustomEvent) {
                                    /** @type {!CustomEvent} */
                                    var event = new CustomEvent("CustomEvent");
                                    return util.global.dispatchEvent(event), function(p_Interval, data) {
                                        /** @type {!CustomEvent} */
                                        var wdoYoutubePlayerReadyEvent = new CustomEvent(p_Interval.toLowerCase(), {
                                            detail : data,
                                            cancelable : true
                                        });
                                        return !util.global.dispatchEvent(wdoYoutubePlayerReadyEvent);
                                    };
                                }
                                if ("function" == typeof Event) {
                                    /** @type {!Event} */
                                    event = new Event("CustomEvent");
                                    return util.global.dispatchEvent(event), function(p_Interval, event) {
                                        /** @type {!Event} */
                                        var domEvent = new Event(p_Interval.toLowerCase(), {
                                            cancelable : true
                                        });
                                        return domEvent.detail = event, !util.global.dispatchEvent(domEvent);
                                    };
                                }
                                /** @type {(Event|null)} */
                                event = document.createEvent("CustomEvent");
                                return event.initCustomEvent("testingtheevent", false, true, {}), util.global.dispatchEvent(event), function(p_Interval, data) {
                                    /** @type {(Event|null)} */
                                    var event = document.createEvent("CustomEvent");
                                    return event.initCustomEvent(p_Interval.toLowerCase(), false, true, data), !util.global.dispatchEvent(event);
                                };
                            } catch (e) {
                            }
                            return function() {
                                return false;
                            };
                        }();
                        var fireGlobalEvent = function() {
                            return util.isNode ? function() {
                                return options.emit.apply(options, arguments);
                            } : util.global ? function(p_Interval) {
                                var methodName = "on" + p_Interval.toLowerCase();
                                var method = util.global[methodName];
                                return !!method && (method.apply(util.global, [].slice.call(arguments, 1)), true);
                            } : function() {
                                return false;
                            };
                        }();
                        var eventToObjectGenerator = {
                            promiseCreated : generatePromiseLifecycleEventObject,
                            promiseFulfilled : generatePromiseLifecycleEventObject,
                            promiseRejected : generatePromiseLifecycleEventObject,
                            promiseResolved : generatePromiseLifecycleEventObject,
                            promiseCancelled : generatePromiseLifecycleEventObject,
                            promiseChained : function(name, promise, child) {
                                return {
                                    promise : promise,
                                    child : child
                                };
                            },
                            warning : function(name, warning) {
                                return {
                                    warning : warning
                                };
                            },
                            unhandledRejection : function(name, reason, promise) {
                                return {
                                    reason : reason,
                                    promise : promise
                                };
                            },
                            rejectionHandled : generatePromiseLifecycleEventObject
                        };
                        /**
                         * @param {string} name
                         * @return {?}
                         */
                        var activeFireEvent = function(name) {
                            /** @type {boolean} */
                            var globalEventFired = false;
                            try {
                                globalEventFired = fireGlobalEvent.apply(null, arguments);
                            } catch (e) {
                                async.throwLater(e);
                                /** @type {boolean} */
                                globalEventFired = true;
                            }
                            /** @type {boolean} */
                            var domEventFired = false;
                            try {
                                domEventFired = fireDomEvent(name, eventToObjectGenerator[name].apply(null, arguments));
                            } catch (e) {
                                async.throwLater(e);
                                /** @type {boolean} */
                                domEventFired = true;
                            }
                            return domEventFired || globalEventFired;
                        };
                        /**
                         * @param {!Object} opts
                         * @return {?}
                         */
                        Promise.config = function(opts) {
                            if (opts = Object(opts), "longStackTraces" in opts && (opts.longStackTraces ? Promise.longStackTraces() : !opts.longStackTraces && Promise.hasLongStackTraces() && disableLongStackTraces()), "warnings" in opts) {
                                var warningsOption = opts.warnings;
                                /** @type {boolean} */
                                config.warnings = !!warningsOption;
                                /** @type {boolean} */
                                wForgottenReturn = config.warnings;
                                if (util.isObject(warningsOption) && "wForgottenReturn" in warningsOption) {
                                    /** @type {boolean} */
                                    wForgottenReturn = !!warningsOption.wForgottenReturn;
                                }
                            }
                            if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
                                if (async.haveItemsQueued()) {
                                    throw new Error("cannot enable cancellation after promises are in use");
                                }
                                /** @type {function(): undefined} */
                                Promise.prototype._clearCancellationData = cancellationClearCancellationData;
                                /** @type {function(!Object, number): undefined} */
                                Promise.prototype._propagateFrom = cancellationPropagateFrom;
                                /** @type {function(): ?} */
                                Promise.prototype._onCancel = cancellationOnCancel;
                                /** @type {function(!Object): undefined} */
                                Promise.prototype._setOnCancel = cancellationSetOnCancel;
                                /** @type {function(!Array): ?} */
                                Promise.prototype._attachCancellationCallback = cancellationAttachCancellationCallback;
                                /** @type {function(!Function, !Function, !Function): ?} */
                                Promise.prototype._execute = cancellationExecute;
                                /** @type {function(!Object, number): undefined} */
                                propagateFromFunction = cancellationPropagateFrom;
                                /** @type {boolean} */
                                config.cancellation = true;
                            }
                            return "monitoring" in opts && (opts.monitoring && !config.monitoring ? (config.monitoring = true, Promise.prototype._fireEvent = activeFireEvent) : !opts.monitoring && config.monitoring && (config.monitoring = false, Promise.prototype._fireEvent = defaultFireEvent)), Promise;
                        };
                        /** @type {function(): ?} */
                        Promise.prototype._fireEvent = defaultFireEvent;
                        /**
                         * @param {!Function} executor
                         * @param {!Function} resolve
                         * @param {!Function} reject
                         * @return {?}
                         */
                        Promise.prototype._execute = function(executor, resolve, reject) {
                            try {
                                executor(resolve, reject);
                            } catch (e) {
                                return e;
                            }
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._onCancel = function() {
                        };
                        /**
                         * @param {!Array} handler
                         * @return {undefined}
                         */
                        Promise.prototype._setOnCancel = function(handler) {
                        };
                        /**
                         * @param {!Object} onCancel
                         * @return {undefined}
                         */
                        Promise.prototype._attachCancellationCallback = function(onCancel) {
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._captureStackTrace = function() {
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._attachExtraTrace = function() {
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._clearCancellationData = function() {
                        };
                        /**
                         * @param {!Object} parent
                         * @param {number} flags
                         * @return {undefined}
                         */
                        Promise.prototype._propagateFrom = function(parent, flags) {
                        };
                        /** @type {function(!Object, number): undefined} */
                        var propagateFromFunction = bindingPropagateFrom;
                        /**
                         * @return {?}
                         */
                        var shouldIgnore = function() {
                            return false;
                        };
                        /** @type {!RegExp} */
                        var moduleRe = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
                        util.inherits(CapturedTrace, Error);
                        /** @type {function(number): undefined} */
                        Context.CapturedTrace = CapturedTrace;
                        /**
                         * @return {undefined}
                         */
                        CapturedTrace.prototype.uncycle = function() {
                            var length = this._length;
                            if (!(length < 2)) {
                                /** @type {!Array} */
                                var nodes = [];
                                var stackToIndex = {};
                                /** @type {number} */
                                var i = 0;
                                var cur = this;
                                for (; void 0 !== cur; ++i) {
                                    nodes.push(cur);
                                    cur = cur._parent;
                                }
                                /** @type {number} */
                                length = this._length = i;
                                /** @type {number} */
                                i = length - 1;
                                for (; i >= 0; --i) {
                                    var stack = nodes[i].stack;
                                    if (void 0 === stackToIndex[stack]) {
                                        /** @type {number} */
                                        stackToIndex[stack] = i;
                                    }
                                }
                                /** @type {number} */
                                i = 0;
                                for (; i < length; ++i) {
                                    var currentStack = nodes[i].stack;
                                    var index = stackToIndex[currentStack];
                                    if (void 0 !== index && index !== i) {
                                        if (index > 0) {
                                            nodes[index - 1]._parent = void 0;
                                            /** @type {number} */
                                            nodes[index - 1]._length = 1;
                                        }
                                        nodes[i]._parent = void 0;
                                        /** @type {number} */
                                        nodes[i]._length = 1;
                                        var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;
                                        if (index < length - 1) {
                                            cycleEdgeNode._parent = nodes[index + 1];
                                            cycleEdgeNode._parent.uncycle();
                                            cycleEdgeNode._length = cycleEdgeNode._parent._length + 1;
                                        } else {
                                            cycleEdgeNode._parent = void 0;
                                            /** @type {number} */
                                            cycleEdgeNode._length = 1;
                                        }
                                        var currentChildLength = cycleEdgeNode._length + 1;
                                        /** @type {number} */
                                        var j = i - 2;
                                        for (; j >= 0; --j) {
                                            nodes[j]._length = currentChildLength;
                                            currentChildLength++;
                                        }
                                        return;
                                    }
                                }
                            }
                        };
                        /**
                         * @param {!Object} error
                         * @return {undefined}
                         */
                        CapturedTrace.prototype.attachExtraTrace = function(error) {
                            if (!error.__stackCleaned__) {
                                this.uncycle();
                                var parsed = parseStackAndMessage(error);
                                var message = parsed.message;
                                /** @type {!Array} */
                                var stacks = [parsed.stack];
                                var trace = this;
                                for (; void 0 !== trace;) {
                                    stacks.push(cleanStack(trace.stack.split("\n")));
                                    trace = trace._parent;
                                }
                                removeCommonRoots(stacks);
                                removeDuplicateOrEmptyJumps(stacks);
                                util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
                                util.notEnumerableProp(error, "__stackCleaned__", true);
                            }
                        };
                        var captureStackTrace = function() {
                            /** @type {!RegExp} */
                            var o = /^\s*at\s*/;
                            /**
                             * @param {string} type
                             * @param {string} event
                             * @return {?}
                             */
                            var print = function(type, event) {
                                return "string" == typeof type ? type : void 0 !== event.name && void 0 !== event.message ? event.toString() : find(event);
                            };
                            if ("number" == typeof Error.stackTraceLimit && "function" == typeof Error.captureStackTrace) {
                                Error.stackTraceLimit += 6;
                                /** @type {!RegExp} */
                                copy = o;
                                /** @type {function(string, string): ?} */
                                log = print;
                                /** @type {function((Object|null), (!Function|null)=): undefined} */
                                var captureStackTrace = Error.captureStackTrace;
                                return shouldIgnore = function(line) {
                                    return nullRe.test(line);
                                }, function(receiver, ignoreUntil) {
                                    Error.stackTraceLimit += 6;
                                    captureStackTrace(receiver, ignoreUntil);
                                    Error.stackTraceLimit -= 6;
                                };
                            }
                            /** @type {!Error} */
                            var err = new Error;
                            if ("string" == typeof err.stack && err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
                                return copy = /@/, log = print, Y = true, function(to) {
                                    /** @type {string} */
                                    to.stack = (new Error).stack;
                                };
                            }
                            var hasStackAfterThrow;
                            try {
                                throw new Error;
                            } catch (e) {
                                /** @type {boolean} */
                                hasStackAfterThrow = "stack" in e;
                            }
                            return "stack" in err || !hasStackAfterThrow || "number" != typeof Error.stackTraceLimit ? (log = function(type, a) {
                                return "string" == typeof type ? type : "object" != typeof a && "function" != typeof a || void 0 === a.name || void 0 === a.message ? find(a) : a.toString();
                            }, null) : (copy = o, log = print, function(err2) {
                                Error.stackTraceLimit += 6;
                                try {
                                    throw new Error;
                                } catch (err) {
                                    err2.stack = err.stack;
                                }
                                Error.stackTraceLimit -= 6;
                            });
                        }([]);
                        if ("undefined" != typeof console && "undefined" != typeof console.warn) {
                            /**
                             * @param {string} message
                             * @return {undefined}
                             */
                            printWarning = function(message) {
                                console.warn(message);
                            };
                            if (util.isNode && options.stderr.isTTY) {
                                /**
                                 * @param {string} message
                                 * @param {string} isSoft
                                 * @return {undefined}
                                 */
                                printWarning = function(message, isSoft) {
                                    /** @type {string} */
                                    var color = isSoft ? "\u001b[33m" : "\u001b[31m";
                                    console.warn(color + message + "\u001b[0m\n");
                                };
                            } else {
                                if (!(util.isNode || "string" != typeof(new Error).stack)) {
                                    /**
                                     * @param {string} message
                                     * @param {string} isSoft
                                     * @return {undefined}
                                     */
                                    printWarning = function(message, isSoft) {
                                        console.warn("%c" + message, isSoft ? "color: darkorange" : "color: red");
                                    };
                                }
                            }
                        }
                        var config = {
                            warnings : warnings,
                            longStackTraces : false,
                            cancellation : false,
                            monitoring : false
                        };
                        return Z && Promise.longStackTraces(), {
                            longStackTraces : function() {
                                return config.longStackTraces;
                            },
                            warnings : function() {
                                return config.warnings;
                            },
                            cancellation : function() {
                                return config.cancellation;
                            },
                            monitoring : function() {
                                return config.monitoring;
                            },
                            propagateFromFunction : function() {
                                return propagateFromFunction;
                            },
                            boundValueFunction : function() {
                                return boundValueFunction;
                            },
                            checkForgottenReturns : checkForgottenReturns,
                            setBounds : setBounds,
                            warn : warn,
                            deprecated : deprecated,
                            CapturedTrace : CapturedTrace,
                            fireDomEvent : fireDomEvent,
                            fireGlobalEvent : fireGlobalEvent
                        };
                    };
                }, {
                    "./errors" : 12,
                    "./util" : 36
                }],
                10 : [function(canCreateDiscussions, mixin, n) {
                    /**
                     * @param {!Function} Promise
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise) {
                        /**
                         * @return {?}
                         */
                        function returner() {
                            return this.value;
                        }
                        /**
                         * @return {?}
                         */
                        function thrower() {
                            throw this.reason;
                        }
                        /** @type {function(!Object): ?} */
                        Promise.prototype["return"] = Promise.prototype.thenReturn = function(value) {
                            return value instanceof Promise && value.suppressUnhandledRejections(), this._then(returner, void 0, void 0, {
                                value : value
                            }, void 0);
                        };
                        /** @type {function(string): ?} */
                        Promise.prototype["throw"] = Promise.prototype.thenThrow = function(reason) {
                            return this._then(thrower, void 0, void 0, {
                                reason : reason
                            }, void 0);
                        };
                        /**
                         * @param {string} reason
                         * @return {?}
                         */
                        Promise.prototype.catchThrow = function(reason) {
                            if (arguments.length <= 1) {
                                return this._then(void 0, thrower, void 0, {
                                    reason : reason
                                }, void 0);
                            }
                            var matched_check = arguments[1];
                            /**
                             * @return {?}
                             */
                            var handler = function() {
                                throw matched_check;
                            };
                            return this.caught(reason, handler);
                        };
                        /**
                         * @param {!Object} value
                         * @return {?}
                         */
                        Promise.prototype.catchReturn = function(value) {
                            if (arguments.length <= 1) {
                                return value instanceof Promise && value.suppressUnhandledRejections(), this._then(void 0, returner, void 0, {
                                    value : value
                                }, void 0);
                            }
                            var _value = arguments[1];
                            if (_value instanceof Promise) {
                                _value.suppressUnhandledRejections();
                            }
                            /**
                             * @return {?}
                             */
                            var handler = function() {
                                return _value;
                            };
                            return this.caught(value, handler);
                        };
                    };
                }, {}],
                11 : [function(canCreateDiscussions, mixin, n) {
                    /**
                     * @param {!Object} Promise
                     * @param {!Array} INTERNAL
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, INTERNAL) {
                        /**
                         * @return {?}
                         */
                        function mapper() {
                            return all(this);
                        }
                        /**
                         * @param {!Arguments} promises
                         * @param {!Array} fn
                         * @return {?}
                         */
                        function PromiseMapSeries(promises, fn) {
                            return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
                        }
                        var PromiseReduce = Promise.reduce;
                        var all = Promise.all;
                        /**
                         * @param {!Function} fn
                         * @return {?}
                         */
                        Promise.prototype.each = function(fn) {
                            return PromiseReduce(this, fn, INTERNAL, 0)._then(mapper, void 0, void 0, this, void 0);
                        };
                        /**
                         * @param {!Array} fn
                         * @return {?}
                         */
                        Promise.prototype.mapSeries = function(fn) {
                            return PromiseReduce(this, fn, INTERNAL, INTERNAL);
                        };
                        /**
                         * @param {!Function} value
                         * @param {!Function} fn
                         * @return {?}
                         */
                        Promise.each = function(value, fn) {
                            return PromiseReduce(value, fn, INTERNAL, 0)._then(mapper, void 0, void 0, value, void 0);
                        };
                        /** @type {function(!Arguments, !Array): ?} */
                        Promise.mapSeries = PromiseMapSeries;
                    };
                }, {}],
                12 : [function(require, module, n) {
                    /**
                     * @param {string} nameProperty
                     * @param {string} defaultMessage
                     * @return {?}
                     */
                    function subError(nameProperty, defaultMessage) {
                        /**
                         * @param {string} message
                         * @return {?}
                         */
                        function SubError(message) {
                            return this instanceof SubError ? (notEnumerableProp(this, "message", "string" == typeof message ? message : defaultMessage), notEnumerableProp(this, "name", nameProperty), void(Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : Error.call(this))) : new SubError(message);
                        }
                        return inherits(SubError, Error), SubError;
                    }
                    /**
                     * @param {number} message
                     * @return {?}
                     */
                    function OperationalError(message) {
                        return this instanceof OperationalError ? (notEnumerableProp(this, "name", "OperationalError"), notEnumerableProp(this, "message", message), this.cause = message, this.isOperational = true, void(message instanceof Error ? (notEnumerableProp(this, "message", message.message), notEnumerableProp(this, "stack", message.stack)) : Error.captureStackTrace && Error.captureStackTrace(this, this.constructor))) : new OperationalError(message);
                    }
                    var _TypeError;
                    var _RangeError;
                    var es5 = require("./es5");
                    var Objectfreeze = es5.freeze;
                    var util = require("./util");
                    var inherits = util.inherits;
                    var notEnumerableProp = util.notEnumerableProp;
                    var Warning = subError("Warning", "warning");
                    var CancellationError = subError("CancellationError", "cancellation error");
                    var TimeoutError = subError("TimeoutError", "timeout error");
                    var AggregateError = subError("AggregateError", "aggregate error");
                    try {
                        /** @type {function(new:TypeError, *=, *=, *=): !TypeError} */
                        _TypeError = TypeError;
                        /** @type {function(new:RangeError, *=, *=, *=): !RangeError} */
                        _RangeError = RangeError;
                    } catch (m) {
                        _TypeError = subError("TypeError", "type error");
                        _RangeError = subError("RangeError", "range error");
                    }
                    /** @type {!Array<string>} */
                    var methods = "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" ");
                    /** @type {number} */
                    var i = 0;
                    for (; i < methods.length; ++i) {
                        if ("function" == typeof Array.prototype[methods[i]]) {
                            AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
                        }
                    }
                    es5.defineProperty(AggregateError.prototype, "length", {
                        value : 0,
                        configurable : false,
                        writable : true,
                        enumerable : true
                    });
                    /** @type {boolean} */
                    AggregateError.prototype.isOperational = true;
                    /** @type {number} */
                    var length = 0;
                    /**
                     * @return {?}
                     */
                    AggregateError.prototype.toString = function() {
                        /** @type {string} */
                        var strStart = Array(4 * length + 1).join(" ");
                        /** @type {string} */
                        var seed_to_use_for_salt = "\n" + strStart + "AggregateError of:\n";
                        length++;
                        /** @type {string} */
                        strStart = Array(4 * length + 1).join(" ");
                        /** @type {number} */
                        var i = 0;
                        for (; i < this.length; ++i) {
                            var _ = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
                            var dataA = _.split("\n");
                            /** @type {number} */
                            var b = 0;
                            for (; b < dataA.length; ++b) {
                                dataA[b] = strStart + dataA[b];
                            }
                            _ = dataA.join("\n");
                            /** @type {string} */
                            seed_to_use_for_salt = seed_to_use_for_salt + (_ + "\n");
                        }
                        return length--, seed_to_use_for_salt;
                    };
                    inherits(OperationalError, Error);
                    var errorTypes = Error.__BluebirdErrorTypes__;
                    if (!errorTypes) {
                        errorTypes = Objectfreeze({
                            CancellationError : CancellationError,
                            TimeoutError : TimeoutError,
                            OperationalError : OperationalError,
                            RejectionError : OperationalError,
                            AggregateError : AggregateError
                        });
                        es5.defineProperty(Error, "__BluebirdErrorTypes__", {
                            value : errorTypes,
                            writable : false,
                            enumerable : false,
                            configurable : false
                        });
                    }
                    module.exports = {
                        Error : Error,
                        TypeError : _TypeError,
                        RangeError : _RangeError,
                        CancellationError : errorTypes.CancellationError,
                        OperationalError : errorTypes.OperationalError,
                        TimeoutError : errorTypes.TimeoutError,
                        AggregateError : errorTypes.AggregateError,
                        Warning : Warning
                    };
                }, {
                    "./es5" : 13,
                    "./util" : 36
                }],
                13 : [function(canCreateDiscussions, module, n) {
                    var isES5 = function() {
                        return void 0 === this;
                    }();
                    if (isES5) {
                        module.exports = {
                            freeze : Object.freeze,
                            defineProperty : Object.defineProperty,
                            getDescriptor : Object.getOwnPropertyDescriptor,
                            keys : Object.keys,
                            names : Object.getOwnPropertyNames,
                            getPrototypeOf : Object.getPrototypeOf,
                            isArray : Array.isArray,
                            isES5 : isES5,
                            propertyIsWritable : function(obj, prop) {
                                /** @type {(ObjectPropertyDescriptor<?>|undefined)} */
                                var desc = Object.getOwnPropertyDescriptor(obj, prop);
                                return !(desc && !desc.writable && !desc.set);
                            }
                        };
                    } else {
                        /** @type {function(this:Object, *): boolean} */
                        var hasOwnProperty = {}.hasOwnProperty;
                        /** @type {function(this:*): string} */
                        var objToString = {}.toString;
                        var prototypeOfObject = {}.constructor.prototype;
                        /**
                         * @param {?} o
                         * @return {?}
                         */
                        var ObjectKeys = function(o) {
                            /** @type {!Array} */
                            var ret = [];
                            var key;
                            for (key in o) {
                                if (hasOwnProperty.call(o, key)) {
                                    ret.push(key);
                                }
                            }
                            return ret;
                        };
                        /**
                         * @param {!Object} date
                         * @param {string} name
                         * @return {?}
                         */
                        var c = function(date, name) {
                            return {
                                value : date[name]
                            };
                        };
                        /**
                         * @param {!Function} o
                         * @param {string} key
                         * @param {!Object} obj
                         * @return {?}
                         */
                        var ObjectDefineProperty = function(o, key, obj) {
                            return o[key] = obj.value, o;
                        };
                        /**
                         * @param {?} s
                         * @return {?}
                         */
                        var bv_trim = function(s) {
                            return s;
                        };
                        /**
                         * @param {?} o
                         * @return {?}
                         */
                        var getPrototypeOf = function(o) {
                            try {
                                return Object(o).constructor.prototype;
                            } catch (e) {
                                return prototypeOfObject;
                            }
                        };
                        /**
                         * @param {!Array} obj
                         * @return {?}
                         */
                        var _isArray = function(obj) {
                            try {
                                return "[object Array]" === objToString.call(obj);
                            } catch (e) {
                                return false;
                            }
                        };
                        module.exports = {
                            isArray : _isArray,
                            keys : ObjectKeys,
                            names : ObjectKeys,
                            defineProperty : ObjectDefineProperty,
                            getDescriptor : c,
                            freeze : bv_trim,
                            getPrototypeOf : getPrototypeOf,
                            isES5 : isES5,
                            propertyIsWritable : function() {
                                return true;
                            }
                        };
                    }
                }, {}],
                14 : [function(canCreateDiscussions, mixin, n) {
                    /**
                     * @param {string} obj
                     * @param {!Object} a
                     * @return {undefined}
                     */
                    mixin.exports = function(obj, a) {
                        var callback = obj.map;
                        /**
                         * @param {!Function} target
                         * @param {(Object|string)} data
                         * @return {?}
                         */
                        obj.prototype.filter = function(target, data) {
                            return callback(this, target, data, a);
                        };
                        /**
                         * @param {!Function} fn
                         * @param {undefined} data
                         * @param {(Object|string)} target
                         * @return {?}
                         */
                        obj.filter = function(fn, data, target) {
                            return callback(fn, data, target, a);
                        };
                    };
                }, {}],
                15 : [function(require, mixin, n) {
                    /**
                     * @param {string} Promise
                     * @param {!Object} tryConvertToPromise
                     * @param {!Object} NEXT_FILTER
                     * @return {?}
                     */
                    mixin.exports = function(Promise, tryConvertToPromise, NEXT_FILTER) {
                        /**
                         * @param {!Object} promise
                         * @param {string} type
                         * @param {!Function} handler
                         * @return {undefined}
                         */
                        function PassThroughHandlerContext(promise, type, handler) {
                            /** @type {!Object} */
                            this.promise = promise;
                            /** @type {string} */
                            this.type = type;
                            /** @type {!Function} */
                            this.handler = handler;
                            /** @type {boolean} */
                            this.called = false;
                            /** @type {null} */
                            this.cancelPromise = null;
                        }
                        /**
                         * @param {?} finallyHandler
                         * @return {undefined}
                         */
                        function FinallyHandlerCancelReaction(finallyHandler) {
                            this.finallyHandler = finallyHandler;
                        }
                        /**
                         * @param {?} ctx
                         * @param {string} reason
                         * @return {?}
                         */
                        function checkCancel(ctx, reason) {
                            return null != ctx.cancelPromise && (arguments.length > 1 ? ctx.cancelPromise._reject(reason) : ctx.cancelPromise._cancel(), ctx.cancelPromise = null, true);
                        }
                        /**
                         * @return {?}
                         */
                        function succeed() {
                            return finallyHandler.call(this, this.promise._target()._settledValue());
                        }
                        /**
                         * @param {string} reason
                         * @return {?}
                         */
                        function fail(reason) {
                            if (!checkCancel(this, reason)) {
                                return errorObj.e = reason, errorObj;
                            }
                        }
                        /**
                         * @param {!Function} reasonOrValue
                         * @return {?}
                         */
                        function finallyHandler(reasonOrValue) {
                            var promise = this.promise;
                            var handler = this.handler;
                            if (!this.called) {
                                /** @type {boolean} */
                                this.called = true;
                                var ret = this.isFinallyHandler() ? handler.call(promise._boundValue()) : handler.call(promise._boundValue(), reasonOrValue);
                                if (ret === NEXT_FILTER) {
                                    return ret;
                                }
                                if (void 0 !== ret) {
                                    promise._setReturnedNonUndefined();
                                    var maybePromise = tryConvertToPromise(ret, promise);
                                    if (maybePromise instanceof Promise) {
                                        if (null != this.cancelPromise) {
                                            if (maybePromise._isCancelled()) {
                                                var reason = new CancellationError("late cancellation observer");
                                                return promise._attachExtraTrace(reason), errorObj.e = reason, errorObj;
                                            }
                                            if (maybePromise.isPending()) {
                                                maybePromise._attachCancellationCallback(new FinallyHandlerCancelReaction(this));
                                            }
                                        }
                                        return maybePromise._then(succeed, fail, void 0, this, void 0);
                                    }
                                }
                            }
                            return promise.isRejected() ? (checkCancel(this), errorObj.e = reasonOrValue, errorObj) : (checkCancel(this), reasonOrValue);
                        }
                        var util = require("./util");
                        var CancellationError = Promise.CancellationError;
                        var errorObj = util.errorObj;
                        var catchFilter = require("./catch_filter")(NEXT_FILTER);
                        return PassThroughHandlerContext.prototype.isFinallyHandler = function() {
                            return 0 === this.type;
                        }, FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
                            checkCancel(this.finallyHandler);
                        }, Promise.prototype._passThrough = function(handler, type, success, fail) {
                            return "function" != typeof handler ? this.then() : this._then(success, fail, void 0, new PassThroughHandlerContext(this, type, handler), void 0);
                        }, Promise.prototype.lastly = Promise.prototype["finally"] = function(handlerOrPredicate) {
                            return this._passThrough(handlerOrPredicate, 0, finallyHandler, finallyHandler);
                        }, Promise.prototype.tap = function(handler) {
                            return this._passThrough(handler, 1, finallyHandler);
                        }, Promise.prototype.tapCatch = function(handlerOrPredicate) {
                            /** @type {number} */
                            var l = arguments.length;
                            if (1 === l) {
                                return this._passThrough(handlerOrPredicate, 1, void 0, finallyHandler);
                            }
                            var i;
                            /** @type {!Array} */
                            var catchInstances = new Array(l - 1);
                            /** @type {number} */
                            var j = 0;
                            /** @type {number} */
                            i = 0;
                            for (; i < l - 1; ++i) {
                                var item = arguments[i];
                                if (!util.isObject(item)) {
                                    return Promise.reject(new TypeError("tapCatch statement predicate: expecting an object but got " + util.classString(item)));
                                }
                                catchInstances[j++] = item;
                            }
                            /** @type {number} */
                            catchInstances.length = j;
                            var handler = arguments[i];
                            return this._passThrough(catchFilter(catchInstances, handler, this), 1, void 0, finallyHandler);
                        }, PassThroughHandlerContext;
                    };
                }, {
                    "./catch_filter" : 7,
                    "./util" : 36
                }],
                16 : [function(require, mixin, n) {
                    /**
                     * @param {!Object} Promise
                     * @param {!Object} fn
                     * @param {!Object} INTERNAL
                     * @param {?} tryConvertToPromise
                     * @param {!Function} Proxyable
                     * @param {!Object} debug
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, fn, INTERNAL, tryConvertToPromise, Proxyable, debug) {
                        /**
                         * @param {?} value
                         * @param {!NodeList} yieldHandlers
                         * @param {?} traceParent
                         * @return {?}
                         */
                        function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
                            /** @type {number} */
                            var i = 0;
                            for (; i < yieldHandlers.length; ++i) {
                                traceParent._pushContext();
                                var ret = tryCatch(yieldHandlers[i])(value);
                                if (traceParent._popContext(), ret === errorObj) {
                                    traceParent._pushContext();
                                    var s = Promise.reject(errorObj.e);
                                    return traceParent._popContext(), s;
                                }
                                var maybePromise = tryConvertToPromise(ret, traceParent);
                                if (maybePromise instanceof Promise) {
                                    return maybePromise;
                                }
                            }
                            return null;
                        }
                        /**
                         * @param {string} generatorFunction
                         * @param {!Function} receiver
                         * @param {?} yieldHandler
                         * @param {string} stack
                         * @return {undefined}
                         */
                        function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
                            if (debug.cancellation()) {
                                var promise = new Promise(INTERNAL);
                                var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
                                this._promise = promise.lastly(function() {
                                    return _finallyPromise;
                                });
                                promise._captureStackTrace();
                                promise._setOnCancel(this);
                            } else {
                                var promise = this._promise = new Promise(INTERNAL);
                                promise._captureStackTrace();
                            }
                            /** @type {string} */
                            this._stack = stack;
                            /** @type {string} */
                            this._generatorFunction = generatorFunction;
                            /** @type {!Function} */
                            this._receiver = receiver;
                            this._generator = void 0;
                            /** @type {!Array<?>} */
                            this._yieldHandlers = "function" == typeof yieldHandler ? [yieldHandler].concat(s) : s;
                            /** @type {null} */
                            this._yieldedPromise = null;
                            /** @type {boolean} */
                            this._cancellationPhase = false;
                        }
                        var errors = require("./errors");
                        var TypeError = errors.TypeError;
                        var util = require("./util");
                        var errorObj = util.errorObj;
                        var tryCatch = util.tryCatch;
                        /** @type {!Array} */
                        var s = [];
                        util.inherits(PromiseSpawn, Proxyable);
                        /**
                         * @return {?}
                         */
                        PromiseSpawn.prototype._isResolved = function() {
                            return null === this._promise;
                        };
                        /**
                         * @return {undefined}
                         */
                        PromiseSpawn.prototype._cleanup = function() {
                            /** @type {null} */
                            this._promise = this._generator = null;
                            if (debug.cancellation() && null !== this._finallyPromise) {
                                this._finallyPromise._fulfill();
                                /** @type {null} */
                                this._finallyPromise = null;
                            }
                        };
                        /**
                         * @return {undefined}
                         */
                        PromiseSpawn.prototype._promiseCancelled = function() {
                            if (!this._isResolved()) {
                                var result;
                                /** @type {boolean} */
                                var refresh = "undefined" != typeof this._generator["return"];
                                if (refresh) {
                                    this._promise._pushContext();
                                    result = tryCatch(this._generator["return"]).call(this._generator, void 0);
                                    this._promise._popContext();
                                } else {
                                    var reason = new Promise.CancellationError("generator .return() sentinel");
                                    Promise.coroutine.returnSentinel = reason;
                                    this._promise._attachExtraTrace(reason);
                                    this._promise._pushContext();
                                    result = tryCatch(this._generator["throw"]).call(this._generator, reason);
                                    this._promise._popContext();
                                }
                                /** @type {boolean} */
                                this._cancellationPhase = true;
                                /** @type {null} */
                                this._yieldedPromise = null;
                                this._continue(result);
                            }
                        };
                        /**
                         * @param {string} value
                         * @return {undefined}
                         */
                        PromiseSpawn.prototype._promiseFulfilled = function(value) {
                            /** @type {null} */
                            this._yieldedPromise = null;
                            this._promise._pushContext();
                            var result = tryCatch(this._generator.next).call(this._generator, value);
                            this._promise._popContext();
                            this._continue(result);
                        };
                        /**
                         * @param {!Object} reason
                         * @return {undefined}
                         */
                        PromiseSpawn.prototype._promiseRejected = function(reason) {
                            /** @type {null} */
                            this._yieldedPromise = null;
                            this._promise._attachExtraTrace(reason);
                            this._promise._pushContext();
                            var result = tryCatch(this._generator["throw"]).call(this._generator, reason);
                            this._promise._popContext();
                            this._continue(result);
                        };
                        /**
                         * @return {undefined}
                         */
                        PromiseSpawn.prototype._resultCancelled = function() {
                            if (this._yieldedPromise instanceof Promise) {
                                var promise = this._yieldedPromise;
                                /** @type {null} */
                                this._yieldedPromise = null;
                                promise.cancel();
                            }
                        };
                        /**
                         * @return {?}
                         */
                        PromiseSpawn.prototype.promise = function() {
                            return this._promise;
                        };
                        /**
                         * @return {undefined}
                         */
                        PromiseSpawn.prototype._run = function() {
                            this._generator = this._generatorFunction.call(this._receiver);
                            this._receiver = this._generatorFunction = void 0;
                            this._promiseFulfilled(void 0);
                        };
                        /**
                         * @param {!Object} result
                         * @return {?}
                         */
                        PromiseSpawn.prototype._continue = function(result) {
                            var promise = this._promise;
                            if (result === errorObj) {
                                return this._cleanup(), this._cancellationPhase ? promise.cancel() : promise._rejectCallback(result.e, false);
                            }
                            var value = result.value;
                            if (result.done === true) {
                                return this._cleanup(), this._cancellationPhase ? promise.cancel() : promise._resolveCallback(value);
                            }
                            var maybePromise = tryConvertToPromise(value, this._promise);
                            if (!(maybePromise instanceof Promise) && (maybePromise = promiseFromYieldHandler(maybePromise, this._yieldHandlers, this._promise), null === maybePromise)) {
                                return void this._promiseRejected(new TypeError("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", String(value)) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")));
                            }
                            maybePromise = maybePromise._target();
                            var bitField = maybePromise._bitField;
                            if (0 === (50397184 & bitField)) {
                                this._yieldedPromise = maybePromise;
                                maybePromise._proxy(this, null);
                            } else {
                                if (0 !== (33554432 & bitField)) {
                                    Promise._async.invoke(this._promiseFulfilled, this, maybePromise._value());
                                } else {
                                    if (0 !== (16777216 & bitField)) {
                                        Promise._async.invoke(this._promiseRejected, this, maybePromise._reason());
                                    } else {
                                        this._promiseCancelled();
                                    }
                                }
                            }
                        };
                        /**
                         * @param {!Function} value
                         * @param {?} options
                         * @return {?}
                         */
                        Promise.coroutine = function(value, options) {
                            if ("function" != typeof value) {
                                throw new TypeError("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
                            }
                            var yieldHandler = Object(options).yieldHandler;
                            /** @type {function(string, !Function, ?, string): undefined} */
                            var PromiseSpawn$ = PromiseSpawn;
                            /** @type {string} */
                            var stack = (new Error).stack;
                            return function() {
                                var generator = value.apply(this, arguments);
                                var spawn = new PromiseSpawn$(void 0, void 0, yieldHandler, stack);
                                var a = spawn.promise();
                                return spawn._generator = generator, spawn._promiseFulfilled(void 0), a;
                            };
                        };
                        /**
                         * @param {(Object|string)} fn
                         * @return {undefined}
                         */
                        Promise.coroutine.addYieldHandler = function(fn) {
                            if ("function" != typeof fn) {
                                throw new TypeError("expecting a function but got " + util.classString(fn));
                            }
                            s.push(fn);
                        };
                        /**
                         * @param {string} generatorFunction
                         * @return {?}
                         */
                        Promise.spawn = function(generatorFunction) {
                            if (debug.deprecated("Promise.spawn()", "Promise.coroutine()"), "function" != typeof generatorFunction) {
                                return fn("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
                            }
                            var spawn = new PromiseSpawn(generatorFunction, this);
                            var i = spawn.promise();
                            return spawn._run(Promise.spawn), i;
                        };
                    };
                }, {
                    "./errors" : 12,
                    "./util" : 36
                }],
                17 : [function(require, mixin, n) {
                    /**
                     * @param {!Array} Promise
                     * @param {!Object} PromiseArray
                     * @param {!Object} INTERNAL
                     * @param {?} apiRejection
                     * @param {?} tryConvertToPromise
                     * @param {?} NEXT_FILTER
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, PromiseArray, INTERNAL, apiRejection, tryConvertToPromise, NEXT_FILTER) {
                        var util = require("./util");
                        util.canEvaluate;
                        util.tryCatch;
                        util.errorObj;
                        /**
                         * @return {?}
                         */
                        Promise.join = function() {
                            var fn;
                            /** @type {number} */
                            var length = arguments.length - 1;
                            if (length > 0 && "function" == typeof arguments[length]) {
                                fn = arguments[length];
                                var exports;
                            }
                            /** @type {!Array<?>} */
                            var args = [].slice.call(arguments);
                            if (fn) {
                                args.pop();
                            }
                            exports = (new PromiseArray(args)).promise();
                            return void 0 !== fn ? exports.spread(fn) : exports;
                        };
                    };
                }, {
                    "./util" : 36
                }],
                18 : [function(require, mixin, n) {
                    /**
                     * @param {string} Promise
                     * @param {!Object} PromiseArray
                     * @param {!Object} apiRejection
                     * @param {?} tryConvertToPromise
                     * @param {?} INTERNAL
                     * @param {?} debug
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
                        /**
                         * @param {?} promises
                         * @param {!Function} fn
                         * @param {number} limit
                         * @param {?} _filter
                         * @return {undefined}
                         */
                        function MappingPromiseArray(promises, fn, limit, _filter) {
                            this.constructor$(promises);
                            this._promise._captureStackTrace();
                            var string = getDomain();
                            this._callback = null === string ? fn : util.domainBind(string, fn);
                            /** @type {(Array|null)} */
                            this._preservedValues = _filter === INTERNAL ? new Array(this.length()) : null;
                            /** @type {number} */
                            this._limit = limit;
                            /** @type {number} */
                            this._inFlight = 0;
                            /** @type {!Array} */
                            this._queue = [];
                            async.invoke(this._asyncInit, this, void 0);
                        }
                        /**
                         * @param {!Function} promises
                         * @param {string} fn
                         * @param {!Object} options
                         * @param {!Function} _filter
                         * @return {?}
                         */
                        function map(promises, fn, options, _filter) {
                            if ("function" != typeof fn) {
                                return apiRejection("expecting a function but got " + util.classString(fn));
                            }
                            /** @type {number} */
                            var limit = 0;
                            if (void 0 !== options) {
                                if ("object" != typeof options || null === options) {
                                    return Promise.reject(new TypeError("options argument must be an object but it is " + util.classString(options)));
                                }
                                if ("number" != typeof options.concurrency) {
                                    return Promise.reject(new TypeError("'concurrency' must be a number but it is " + util.classString(options.concurrency)));
                                }
                                /** @type {number} */
                                limit = options.concurrency;
                            }
                            return limit = "number" == typeof limit && isFinite(limit) && limit >= 1 ? limit : 0, (new MappingPromiseArray(promises, fn, limit, _filter)).promise();
                        }
                        var getDomain = Promise._getDomain;
                        var util = require("./util");
                        var tryCatch = util.tryCatch;
                        var errorObj = util.errorObj;
                        var async = Promise._async;
                        util.inherits(MappingPromiseArray, PromiseArray);
                        /**
                         * @return {undefined}
                         */
                        MappingPromiseArray.prototype._asyncInit = function() {
                            this._init$(void 0, -2);
                        };
                        /**
                         * @return {undefined}
                         */
                        MappingPromiseArray.prototype._init = function() {
                        };
                        /**
                         * @param {string} value
                         * @param {number} index
                         * @return {?}
                         */
                        MappingPromiseArray.prototype._promiseFulfilled = function(value, index) {
                            var values = this._values;
                            var length = this.length();
                            var preservedValues = this._preservedValues;
                            var limit = this._limit;
                            if (index < 0) {
                                if (index = index * -1 - 1, values[index] = value, limit >= 1 && (this._inFlight--, this._drainQueue(), this._isResolved())) {
                                    return true;
                                }
                            } else {
                                if (limit >= 1 && this._inFlight >= limit) {
                                    return values[index] = value, this._queue.push(index), false;
                                }
                                if (null !== preservedValues) {
                                    /** @type {string} */
                                    preservedValues[index] = value;
                                }
                                var promise = this._promise;
                                var fn = this._callback;
                                var p = promise._boundValue();
                                promise._pushContext();
                                var ret = tryCatch(fn).call(p, value, index, length);
                                var promiseCreated = promise._popContext();
                                if (debug.checkForgottenReturns(ret, promiseCreated, null !== preservedValues ? "Promise.filter" : "Promise.map", promise), ret === errorObj) {
                                    return this._reject(ret.e), true;
                                }
                                var maybePromise = tryConvertToPromise(ret, this._promise);
                                if (maybePromise instanceof Promise) {
                                    maybePromise = maybePromise._target();
                                    var bitField = maybePromise._bitField;
                                    if (0 === (50397184 & bitField)) {
                                        return limit >= 1 && this._inFlight++, values[index] = maybePromise, maybePromise._proxy(this, (index + 1) * -1), false;
                                    }
                                    if (0 === (33554432 & bitField)) {
                                        return 0 !== (16777216 & bitField) ? (this._reject(maybePromise._reason()), true) : (this._cancel(), true);
                                    }
                                    ret = maybePromise._value();
                                }
                                values[index] = ret;
                            }
                            /** @type {number} */
                            var totalResolved = ++this._totalResolved;
                            return totalResolved >= length && (null !== preservedValues ? this._filter(values, preservedValues) : this._resolve(values), true);
                        };
                        /**
                         * @return {undefined}
                         */
                        MappingPromiseArray.prototype._drainQueue = function() {
                            var queue = this._queue;
                            var limit = this._limit;
                            var values = this._values;
                            for (; queue.length > 0 && this._inFlight < limit;) {
                                if (this._isResolved()) {
                                    return;
                                }
                                var index = queue.pop();
                                this._promiseFulfilled(values[index], index);
                            }
                        };
                        /**
                         * @param {!NodeList} array
                         * @param {!NodeList} values
                         * @return {undefined}
                         */
                        MappingPromiseArray.prototype._filter = function(array, values) {
                            var length = values.length;
                            /** @type {!Array} */
                            var value = new Array(length);
                            /** @type {number} */
                            var key = 0;
                            /** @type {number} */
                            var i = 0;
                            for (; i < length; ++i) {
                                if (array[i]) {
                                    value[key++] = values[i];
                                }
                            }
                            /** @type {number} */
                            value.length = key;
                            this._resolve(value);
                        };
                        /**
                         * @return {?}
                         */
                        MappingPromiseArray.prototype.preservedValues = function() {
                            return this._preservedValues;
                        };
                        /**
                         * @param {!Function} fn
                         * @param {string} cb
                         * @return {?}
                         */
                        Promise.prototype.map = function(fn, cb) {
                            return map(this, fn, cb, null);
                        };
                        /**
                         * @param {!Function} key
                         * @param {!Function} cb
                         * @param {(Object|string)} options
                         * @param {!Object} _filter
                         * @return {?}
                         */
                        Promise.map = function(key, cb, options, _filter) {
                            return map(key, cb, options, _filter);
                        };
                    };
                }, {
                    "./util" : 36
                }],
                19 : [function(require, mixin, n) {
                    /**
                     * @param {!Object} Promise
                     * @param {!Object} url
                     * @param {!Object} media
                     * @param {?} done
                     * @param {!Object} debug
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, url, media, done, debug) {
                        var util = require("./util");
                        var tryCatch = util.tryCatch;
                        /**
                         * @param {?} fn
                         * @return {?}
                         */
                        Promise.method = function(fn) {
                            if ("function" != typeof fn) {
                                throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
                            }
                            return function() {
                                var ret = new Promise(url);
                                ret._captureStackTrace();
                                ret._pushContext();
                                var value = tryCatch(fn).apply(this, arguments);
                                var promiseCreated = ret._popContext();
                                return debug.checkForgottenReturns(value, promiseCreated, "Promise.method", ret), ret._resolveFromSyncValue(value), ret;
                            };
                        };
                        /** @type {function(?): ?} */
                        Promise.attempt = Promise["try"] = function(fn) {
                            if ("function" != typeof fn) {
                                return done("expecting a function but got " + util.classString(fn));
                            }
                            var ret = new Promise(url);
                            ret._captureStackTrace();
                            ret._pushContext();
                            var value;
                            if (arguments.length > 1) {
                                debug.deprecated("calling Promise.try with more than 1 argument");
                                var b = arguments[1];
                                var a = arguments[2];
                                value = util.isArray(b) ? tryCatch(fn).apply(a, b) : tryCatch(fn).call(a, b);
                            } else {
                                value = tryCatch(fn)();
                            }
                            var promiseCreated = ret._popContext();
                            return debug.checkForgottenReturns(value, promiseCreated, "Promise.try", ret), ret._resolveFromSyncValue(value), ret;
                        };
                        /**
                         * @param {!Object} value
                         * @return {undefined}
                         */
                        Promise.prototype._resolveFromSyncValue = function(value) {
                            if (value === util.errorObj) {
                                this._rejectCallback(value.e, false);
                            } else {
                                this._resolveCallback(value, true);
                            }
                        };
                    };
                }, {
                    "./util" : 36
                }],
                20 : [function(require, module, n) {
                    /**
                     * @param {?} obj
                     * @return {?}
                     */
                    function isUntypedError(obj) {
                        return obj instanceof Error && es5.getPrototypeOf(obj) === Error.prototype;
                    }
                    /**
                     * @param {?} obj
                     * @return {?}
                     */
                    function wrapAsOperationalError(obj) {
                        var ret;
                        if (isUntypedError(obj)) {
                            ret = new OperationalError(obj);
                            ret.name = obj.name;
                            ret.message = obj.message;
                            ret.stack = obj.stack;
                            var composable = es5.keys(obj);
                            /** @type {number} */
                            var i = 0;
                            for (; i < composable.length; ++i) {
                                var field = composable[i];
                                if (!rxIsInt.test(field)) {
                                    ret[field] = obj[field];
                                }
                            }
                            return ret;
                        }
                        return util.markAsOriginatingFromRejection(obj), obj;
                    }
                    /**
                     * @param {!Function} promise
                     * @param {!Object} expected
                     * @return {?}
                     */
                    function nodebackForPromise(promise, expected) {
                        return function(err, value) {
                            if (null !== promise) {
                                if (err) {
                                    var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
                                    promise._attachExtraTrace(wrapped);
                                    promise._reject(wrapped);
                                } else {
                                    if (expected) {
                                        /** @type {!Array<?>} */
                                        var ret = [].slice.call(arguments, 1);
                                        promise._fulfill(ret);
                                    } else {
                                        promise._fulfill(value);
                                    }
                                }
                                /** @type {null} */
                                promise = null;
                            }
                        };
                    }
                    var util = require("./util");
                    var maybeWrapAsError = util.maybeWrapAsError;
                    var errors = require("./errors");
                    var OperationalError = errors.OperationalError;
                    var es5 = require("./es5");
                    /** @type {!RegExp} */
                    var rxIsInt = /^(?:name|message|stack|cause)$/;
                    /** @type {function(!Function, !Object): ?} */
                    module.exports = nodebackForPromise;
                }, {
                    "./errors" : 12,
                    "./es5" : 13,
                    "./util" : 36
                }],
                21 : [function(require, mixin, n) {
                    /**
                     * @param {!Function} Promise
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise) {
                        /**
                         * @param {!Array} val
                         * @param {!Function} nodeback
                         * @return {?}
                         */
                        function spreadAdapter(val, nodeback) {
                            var promise = this;
                            if (!util.isArray(val)) {
                                return successAdapter.call(promise, val, nodeback);
                            }
                            var ret = tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
                            if (ret === errorObj) {
                                async.throwLater(ret.e);
                            }
                        }
                        /**
                         * @param {!Array} val
                         * @param {!Function} nodeback
                         * @return {undefined}
                         */
                        function successAdapter(val, nodeback) {
                            var promise = this;
                            var separateCaches = promise._boundValue();
                            var ret = void 0 === val ? tryCatch(nodeback).call(separateCaches, null) : tryCatch(nodeback).call(separateCaches, null, val);
                            if (ret === errorObj) {
                                async.throwLater(ret.e);
                            }
                        }
                        /**
                         * @param {number} reason
                         * @param {!Function} nodeback
                         * @return {undefined}
                         */
                        function errorAdapter(reason, nodeback) {
                            var promise = this;
                            if (!reason) {
                                /** @type {!Error} */
                                var newReason = new Error(reason + "");
                                /** @type {number} */
                                newReason.cause = reason;
                                /** @type {!Error} */
                                reason = newReason;
                            }
                            var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
                            if (ret === errorObj) {
                                async.throwLater(ret.e);
                            }
                        }
                        var util = require("./util");
                        var async = Promise._async;
                        var tryCatch = util.tryCatch;
                        var errorObj = util.errorObj;
                        /** @type {function(!Object, number): ?} */
                        Promise.prototype.asCallback = Promise.prototype.nodeify = function(nodeback, options) {
                            if ("function" == typeof nodeback) {
                                /** @type {function(!Array, !Function): undefined} */
                                var adapter = successAdapter;
                                if (void 0 !== options && Object(options).spread) {
                                    /** @type {function(!Array, !Function): ?} */
                                    adapter = spreadAdapter;
                                }
                                this._then(adapter, errorAdapter, void 0, this, nodeback);
                            }
                            return this;
                        };
                    };
                }, {
                    "./util" : 36
                }],
                22 : [function(require, module, canCreateDiscussions) {
                    /**
                     * @return {?}
                     */
                    module.exports = function() {
                        /**
                         * @return {undefined}
                         */
                        function Proxyable() {
                        }
                        /**
                         * @param {!Object} self
                         * @param {(!Function|string)} fn
                         * @return {undefined}
                         */
                        function check(self, fn) {
                            if (null == self || self.constructor !== Promise) {
                                throw new TypeError("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
                            }
                            if ("function" != typeof fn) {
                                throw new TypeError("expecting a function but got " + util.classString(fn));
                            }
                        }
                        /**
                         * @param {!Function} name
                         * @return {undefined}
                         */
                        function Promise(name) {
                            if (name !== INTERNAL) {
                                check(this, name);
                            }
                            /** @type {number} */
                            this._bitField = 0;
                            this._fulfillmentHandler0 = void 0;
                            this._rejectionHandler0 = void 0;
                            this._promise0 = void 0;
                            this._receiver0 = void 0;
                            this._resolveFromExecutor(name);
                            this._promiseCreated();
                            this._fireEvent("promiseCreated", this);
                        }
                        /**
                         * @param {!Object} value
                         * @return {undefined}
                         */
                        function resolve(value) {
                            this.promise._resolveCallback(value);
                        }
                        /**
                         * @param {!Error} reason
                         * @return {undefined}
                         */
                        function reject(reason) {
                            this.promise._rejectCallback(reason, false);
                        }
                        /**
                         * @param {!Function} value
                         * @return {undefined}
                         */
                        function fillTypes(value) {
                            var p = new Promise(INTERNAL);
                            /** @type {!Function} */
                            p._fulfillmentHandler0 = value;
                            /** @type {!Function} */
                            p._rejectionHandler0 = value;
                            /** @type {!Function} */
                            p._promise0 = value;
                            /** @type {!Function} */
                            p._receiver0 = value;
                        }
                        var getDomain;
                        /**
                         * @return {?}
                         */
                        var makeSelfResolutionError = function() {
                            return new TypeError("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
                        };
                        /**
                         * @return {?}
                         */
                        var reflectHandler = function() {
                            return new Promise.PromiseInspection(this._target());
                        };
                        /**
                         * @param {?} msg
                         * @return {?}
                         */
                        var apiRejection = function(msg) {
                            return Promise.reject(new TypeError(msg));
                        };
                        var undefined = {};
                        var util = require("./util");
                        /** @type {function(): ?} */
                        getDomain = util.isNode ? function() {
                            var domain = options.domain;
                            return void 0 === domain && (domain = null), domain;
                        } : function() {
                            return null;
                        };
                        util.notEnumerableProp(Promise, "_getDomain", getDomain);
                        var es5 = require("./es5");
                        var Async = require("./async");
                        var async = new Async;
                        es5.defineProperty(Promise, "_async", {
                            value : async
                        });
                        var errors = require("./errors");
                        var TypeError = Promise.TypeError = errors.TypeError;
                        Promise.RangeError = errors.RangeError;
                        var CancellationError = Promise.CancellationError = errors.CancellationError;
                        Promise.TimeoutError = errors.TimeoutError;
                        Promise.OperationalError = errors.OperationalError;
                        Promise.RejectionError = errors.OperationalError;
                        Promise.AggregateError = errors.AggregateError;
                        /**
                         * @return {undefined}
                         */
                        var INTERNAL = function() {
                        };
                        var APPLY = {};
                        var NEXT_FILTER = {};
                        var tryConvertToPromise = require("./thenables")(Promise, INTERNAL);
                        var PromiseArray = require("./promise_array")(Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable);
                        var Context = require("./context")(Promise);
                        var createContext = Context.create;
                        var debug = require("./debuggability")(Promise, Context);
                        var RpcProxy = (debug.CapturedTrace, require("./finally")(Promise, tryConvertToPromise, NEXT_FILTER));
                        var catchFilter = require("./catch_filter")(NEXT_FILTER);
                        var nodebackForPromise = require("./nodeback");
                        var errorObj = util.errorObj;
                        var tryCatch = util.tryCatch;
                        return Promise.prototype.toString = function() {
                            return "[object Promise]";
                        }, Promise.prototype.caught = Promise.prototype["catch"] = function(fn) {
                            /** @type {number} */
                            var l = arguments.length;
                            if (l > 1) {
                                var i;
                                /** @type {!Array} */
                                var catchInstances = new Array(l - 1);
                                /** @type {number} */
                                var j = 0;
                                /** @type {number} */
                                i = 0;
                                for (; i < l - 1; ++i) {
                                    var item = arguments[i];
                                    if (!util.isObject(item)) {
                                        return apiRejection("Catch statement predicate: expecting an object but got " + util.classString(item));
                                    }
                                    catchInstances[j++] = item;
                                }
                                return catchInstances.length = j, fn = arguments[i], this.then(void 0, catchFilter(catchInstances, fn, this));
                            }
                            return this.then(void 0, fn);
                        }, Promise.prototype.reflect = function() {
                            return this._then(reflectHandler, reflectHandler, void 0, this, void 0);
                        }, Promise.prototype.then = function(fn, didReject) {
                            if (debug.warnings() && arguments.length > 0 && "function" != typeof fn && "function" != typeof didReject) {
                                var msg = ".then() only accepts functions but was passed: " + util.classString(fn);
                                if (arguments.length > 1) {
                                    msg = msg + (", " + util.classString(didReject));
                                }
                                this._warn(msg);
                            }
                            return this._then(fn, didReject, void 0, void 0, void 0);
                        }, Promise.prototype.done = function(didFulfill, didReject) {
                            var promise = this._then(didFulfill, didReject, void 0, void 0, void 0);
                            promise._setIsFinal();
                        }, Promise.prototype.spread = function(fn) {
                            return "function" != typeof fn ? apiRejection("expecting a function but got " + util.classString(fn)) : this.all()._then(fn, void 0, void 0, APPLY, void 0);
                        }, Promise.prototype.toJSON = function() {
                            var ret = {
                                isFulfilled : false,
                                isRejected : false,
                                fulfillmentValue : void 0,
                                rejectionReason : void 0
                            };
                            return this.isFulfilled() ? (ret.fulfillmentValue = this.value(), ret.isFulfilled = true) : this.isRejected() && (ret.rejectionReason = this.reason(), ret.isRejected = true), ret;
                        }, Promise.prototype.all = function() {
                            return arguments.length > 0 && this._warn(".all() was passed arguments but it does not take any"), (new PromiseArray(this)).promise();
                        }, Promise.prototype.error = function(fn) {
                            return this.caught(util.originatesFromRejection, fn);
                        }, Promise.getNewLibraryCopy = module.exports, Promise.is = function(type) {
                            return type instanceof Promise;
                        }, Promise.fromNode = Promise.fromCallback = function(fn) {
                            var ret = new Promise(INTERNAL);
                            ret._captureStackTrace();
                            /** @type {boolean} */
                            var multiArgs = arguments.length > 1 && !!Object(arguments[1]).multiArgs;
                            var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
                            return result === errorObj && ret._rejectCallback(result.e, true), ret._isFateSealed() || ret._setAsyncGuaranteed(), ret;
                        }, Promise.all = function(args) {
                            return (new PromiseArray(args)).promise();
                        }, Promise.cast = function(obj) {
                            var ret = tryConvertToPromise(obj);
                            return ret instanceof Promise || (ret = new Promise(INTERNAL), ret._captureStackTrace(), ret._setFulfilled(), ret._rejectionHandler0 = obj), ret;
                        }, Promise.resolve = Promise.fulfilled = Promise.cast, Promise.reject = Promise.rejected = function(reason) {
                            var promise = new Promise(INTERNAL);
                            return promise._captureStackTrace(), promise._rejectCallback(reason, true), promise;
                        }, Promise.setScheduler = function(fn) {
                            if ("function" != typeof fn) {
                                throw new TypeError("expecting a function but got " + util.classString(fn));
                            }
                            return async.setScheduler(fn);
                        }, Promise.prototype._then = function(didFulfill, didReject, _, receiver, internalData) {
                            /** @type {boolean} */
                            var haveInternalData = void 0 !== internalData;
                            var promise = haveInternalData ? internalData : new Promise(INTERNAL);
                            var target = this._target();
                            var bitField = target._bitField;
                            if (!haveInternalData) {
                                promise._propagateFrom(this, 3);
                                promise._captureStackTrace();
                                if (void 0 === receiver && 0 !== (2097152 & this._bitField)) {
                                    receiver = 0 !== (50397184 & bitField) ? this._boundValue() : target === this ? void 0 : this._boundTo;
                                }
                                this._fireEvent("promiseChained", this, promise);
                            }
                            var domain = getDomain();
                            if (0 !== (50397184 & bitField)) {
                                var handler;
                                var value;
                                var settler = target._settlePromiseCtx;
                                if (0 !== (33554432 & bitField)) {
                                    value = target._rejectionHandler0;
                                    /** @type {!Function} */
                                    handler = didFulfill;
                                } else {
                                    if (0 !== (16777216 & bitField)) {
                                        value = target._fulfillmentHandler0;
                                        /** @type {!Function} */
                                        handler = didReject;
                                        target._unsetRejectionIsUnhandled();
                                    } else {
                                        settler = target._settlePromiseLateCancellationObserver;
                                        value = new CancellationError("late cancellation observer");
                                        target._attachExtraTrace(value);
                                        /** @type {!Function} */
                                        handler = didReject;
                                    }
                                }
                                async.invoke(settler, target, {
                                    handler : null === domain ? handler : "function" == typeof handler && util.domainBind(domain, handler),
                                    promise : promise,
                                    receiver : receiver,
                                    value : value
                                });
                            } else {
                                target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
                            }
                            return promise;
                        }, Promise.prototype._length = function() {
                            return 65535 & this._bitField;
                        }, Promise.prototype._isFateSealed = function() {
                            return 0 !== (117506048 & this._bitField);
                        }, Promise.prototype._isFollowing = function() {
                            return 67108864 === (67108864 & this._bitField);
                        }, Promise.prototype._setLength = function(v) {
                            /** @type {number} */
                            this._bitField = this._bitField & -65536 | 65535 & v;
                        }, Promise.prototype._setFulfilled = function() {
                            /** @type {number} */
                            this._bitField = 33554432 | this._bitField;
                            this._fireEvent("promiseFulfilled", this);
                        }, Promise.prototype._setRejected = function() {
                            /** @type {number} */
                            this._bitField = 16777216 | this._bitField;
                            this._fireEvent("promiseRejected", this);
                        }, Promise.prototype._setFollowing = function() {
                            /** @type {number} */
                            this._bitField = 67108864 | this._bitField;
                            this._fireEvent("promiseResolved", this);
                        }, Promise.prototype._setIsFinal = function() {
                            /** @type {number} */
                            this._bitField = 4194304 | this._bitField;
                        }, Promise.prototype._isFinal = function() {
                            return (4194304 & this._bitField) > 0;
                        }, Promise.prototype._unsetCancelled = function() {
                            /** @type {number} */
                            this._bitField = this._bitField & -65537;
                        }, Promise.prototype._setCancelled = function() {
                            /** @type {number} */
                            this._bitField = 65536 | this._bitField;
                            this._fireEvent("promiseCancelled", this);
                        }, Promise.prototype._setWillBeCancelled = function() {
                            /** @type {number} */
                            this._bitField = 8388608 | this._bitField;
                        }, Promise.prototype._setAsyncGuaranteed = function() {
                            if (!async.hasCustomScheduler()) {
                                /** @type {number} */
                                this._bitField = 134217728 | this._bitField;
                            }
                        }, Promise.prototype._receiverAt = function(index) {
                            var ret = 0 === index ? this._receiver0 : this[4 * index - 4 + 3];
                            if (ret !== undefined) {
                                return void 0 === ret && this._isBound() ? this._boundValue() : ret;
                            }
                        }, Promise.prototype._promiseAt = function(index) {
                            return this[4 * index - 4 + 2];
                        }, Promise.prototype._fulfillmentHandlerAt = function(index) {
                            return this[4 * index - 4 + 0];
                        }, Promise.prototype._rejectionHandlerAt = function(index) {
                            return this[4 * index - 4 + 1];
                        }, Promise.prototype._boundValue = function() {
                        }, Promise.prototype._migrateCallback0 = function(follower) {
                            var fulfill = (follower._bitField, follower._fulfillmentHandler0);
                            var reject = follower._rejectionHandler0;
                            var promise = follower._promise0;
                            var receiver = follower._receiverAt(0);
                            if (void 0 === receiver) {
                                receiver = undefined;
                            }
                            this._addCallbacks(fulfill, reject, promise, receiver, null);
                        }, Promise.prototype._migrateCallbackAt = function(follower, index) {
                            var fulfill = follower._fulfillmentHandlerAt(index);
                            var reject = follower._rejectionHandlerAt(index);
                            var promise = follower._promiseAt(index);
                            var receiver = follower._receiverAt(index);
                            if (void 0 === receiver) {
                                receiver = undefined;
                            }
                            this._addCallbacks(fulfill, reject, promise, receiver, null);
                        }, Promise.prototype._addCallbacks = function(fulfill, reject, promise, receiver, domain) {
                            var index = this._length();
                            if (index >= 65531 && (index = 0, this._setLength(0)), 0 === index) {
                                /** @type {number} */
                                this._promise0 = promise;
                                /** @type {string} */
                                this._receiver0 = receiver;
                                if ("function" == typeof fulfill) {
                                    this._fulfillmentHandler0 = null === domain ? fulfill : util.domainBind(domain, fulfill);
                                }
                                if ("function" == typeof reject) {
                                    this._rejectionHandler0 = null === domain ? reject : util.domainBind(domain, reject);
                                }
                            } else {
                                /** @type {number} */
                                var a = 4 * index - 4;
                                /** @type {number} */
                                this[a + 2] = promise;
                                /** @type {string} */
                                this[a + 3] = receiver;
                                if ("function" == typeof fulfill) {
                                    this[a + 0] = null === domain ? fulfill : util.domainBind(domain, fulfill);
                                }
                                if ("function" == typeof reject) {
                                    this[a + 1] = null === domain ? reject : util.domainBind(domain, reject);
                                }
                            }
                            return this._setLength(index + 1), index;
                        }, Promise.prototype._proxy = function(proxyable, arg) {
                            this._addCallbacks(void 0, void 0, arg, proxyable, null);
                        }, Promise.prototype._resolveCallback = function(value, shouldBind) {
                            if (0 === (117506048 & this._bitField)) {
                                if (value === this) {
                                    return this._rejectCallback(makeSelfResolutionError(), false);
                                }
                                var maybePromise = tryConvertToPromise(value, this);
                                if (!(maybePromise instanceof Promise)) {
                                    return this._fulfill(value);
                                }
                                if (shouldBind) {
                                    this._propagateFrom(maybePromise, 2);
                                }
                                var promise = maybePromise._target();
                                if (promise === this) {
                                    return void this._reject(makeSelfResolutionError());
                                }
                                var bitField = promise._bitField;
                                if (0 === (50397184 & bitField)) {
                                    var len = this._length();
                                    if (len > 0) {
                                        promise._migrateCallback0(this);
                                    }
                                    /** @type {number} */
                                    var i = 1;
                                    for (; i < len; ++i) {
                                        promise._migrateCallbackAt(this, i);
                                    }
                                    this._setFollowing();
                                    this._setLength(0);
                                    this._setFollowee(promise);
                                } else {
                                    if (0 !== (33554432 & bitField)) {
                                        this._fulfill(promise._value());
                                    } else {
                                        if (0 !== (16777216 & bitField)) {
                                            this._reject(promise._reason());
                                        } else {
                                            var reason = new CancellationError("late cancellation observer");
                                            promise._attachExtraTrace(reason);
                                            this._reject(reason);
                                        }
                                    }
                                }
                            }
                        }, Promise.prototype._rejectCallback = function(reason, synchronous, ignoreNonErrorWarnings) {
                            var trace = util.ensureErrorObject(reason);
                            /** @type {boolean} */
                            var hasStack = trace === reason;
                            if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
                                var msg = "a promise was rejected with a non-error: " + util.classString(reason);
                                this._warn(msg, true);
                            }
                            this._attachExtraTrace(trace, !!synchronous && hasStack);
                            this._reject(reason);
                        }, Promise.prototype._resolveFromExecutor = function(executor) {
                            if (executor !== INTERNAL) {
                                var promise = this;
                                this._captureStackTrace();
                                this._pushContext();
                                /** @type {boolean} */
                                var synchronous = true;
                                var r = this._execute(executor, function(value) {
                                    promise._resolveCallback(value);
                                }, function(reason) {
                                    promise._rejectCallback(reason, synchronous);
                                });
                                /** @type {boolean} */
                                synchronous = false;
                                this._popContext();
                                if (void 0 !== r) {
                                    promise._rejectCallback(r, true);
                                }
                            }
                        }, Promise.prototype._settlePromiseFromHandler = function(handler, receiver, value, promise) {
                            var bitField = promise._bitField;
                            if (0 === (65536 & bitField)) {
                                promise._pushContext();
                                var x;
                                if (receiver === APPLY) {
                                    if (value && "number" == typeof value.length) {
                                        x = tryCatch(handler).apply(this._boundValue(), value);
                                    } else {
                                        x = errorObj;
                                        x.e = new TypeError("cannot .spread() a non-array: " + util.classString(value));
                                    }
                                } else {
                                    x = tryCatch(handler).call(receiver, value);
                                }
                                var promiseCreated = promise._popContext();
                                bitField = promise._bitField;
                                if (0 === (65536 & bitField)) {
                                    if (x === NEXT_FILTER) {
                                        promise._reject(value);
                                    } else {
                                        if (x === errorObj) {
                                            promise._rejectCallback(x.e, false);
                                        } else {
                                            debug.checkForgottenReturns(x, promiseCreated, "", promise, this);
                                            promise._resolveCallback(x);
                                        }
                                    }
                                }
                            }
                        }, Promise.prototype._target = function() {
                            var ret = this;
                            for (; ret._isFollowing();) {
                                ret = ret._followee();
                            }
                            return ret;
                        }, Promise.prototype._followee = function() {
                            return this._rejectionHandler0;
                        }, Promise.prototype._setFollowee = function(promise) {
                            /** @type {!Object} */
                            this._rejectionHandler0 = promise;
                        }, Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
                            /** @type {boolean} */
                            var isPromise = promise instanceof Promise;
                            var bitField = this._bitField;
                            /** @type {boolean} */
                            var c = 0 !== (134217728 & bitField);
                            if (0 !== (65536 & bitField)) {
                                if (isPromise) {
                                    promise._invokeInternalOnCancel();
                                }
                                if (receiver instanceof RpcProxy && receiver.isFinallyHandler()) {
                                    /** @type {!Function} */
                                    receiver.cancelPromise = promise;
                                    if (tryCatch(handler).call(receiver, value) === errorObj) {
                                        promise._reject(errorObj.e);
                                    }
                                } else {
                                    if (handler === reflectHandler) {
                                        promise._fulfill(reflectHandler.call(receiver));
                                    } else {
                                        if (receiver instanceof Proxyable) {
                                            receiver._promiseCancelled(promise);
                                        } else {
                                            if (isPromise || promise instanceof PromiseArray) {
                                                promise._cancel();
                                            } else {
                                                receiver.cancel();
                                            }
                                        }
                                    }
                                }
                            } else {
                                if ("function" == typeof handler) {
                                    if (isPromise) {
                                        if (c) {
                                            promise._setAsyncGuaranteed();
                                        }
                                        this._settlePromiseFromHandler(handler, receiver, value, promise);
                                    } else {
                                        handler.call(receiver, value, promise);
                                    }
                                } else {
                                    if (receiver instanceof Proxyable) {
                                        if (!receiver._isResolved()) {
                                            if (0 !== (33554432 & bitField)) {
                                                receiver._promiseFulfilled(value, promise);
                                            } else {
                                                receiver._promiseRejected(value, promise);
                                            }
                                        }
                                    } else {
                                        if (isPromise) {
                                            if (c) {
                                                promise._setAsyncGuaranteed();
                                            }
                                            if (0 !== (33554432 & bitField)) {
                                                promise._fulfill(value);
                                            } else {
                                                promise._reject(value);
                                            }
                                        }
                                    }
                                }
                            }
                        }, Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
                            var handler = ctx.handler;
                            var promise = ctx.promise;
                            var receiver = ctx.receiver;
                            var value = ctx.value;
                            if ("function" == typeof handler) {
                                if (promise instanceof Promise) {
                                    this._settlePromiseFromHandler(handler, receiver, value, promise);
                                } else {
                                    handler.call(receiver, value, promise);
                                }
                            } else {
                                if (promise instanceof Promise) {
                                    promise._reject(value);
                                }
                            }
                        }, Promise.prototype._settlePromiseCtx = function(ctx) {
                            this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
                        }, Promise.prototype._settlePromise0 = function(handler, value, bitField) {
                            var promise = this._promise0;
                            var receiver = this._receiverAt(0);
                            this._promise0 = void 0;
                            this._receiver0 = void 0;
                            this._settlePromise(promise, handler, receiver, value);
                        }, Promise.prototype._clearCallbackDataAtIndex = function(index) {
                            /** @type {number} */
                            var e = 4 * index - 4;
                            this[e + 2] = this[e + 3] = this[e + 0] = this[e + 1] = void 0;
                        }, Promise.prototype._fulfill = function(value) {
                            var bitField = this._bitField;
                            if (!((117506048 & bitField) >>> 16)) {
                                if (value === this) {
                                    var err = makeSelfResolutionError();
                                    return this._attachExtraTrace(err), this._reject(err);
                                }
                                this._setFulfilled();
                                /** @type {!Object} */
                                this._rejectionHandler0 = value;
                                if ((65535 & bitField) > 0) {
                                    if (0 !== (134217728 & bitField)) {
                                        this._settlePromises();
                                    } else {
                                        async.settlePromises(this);
                                    }
                                }
                            }
                        }, Promise.prototype._reject = function(reason) {
                            var bitField = this._bitField;
                            if (!((117506048 & bitField) >>> 16)) {
                                return this._setRejected(), this._fulfillmentHandler0 = reason, this._isFinal() ? async.fatalError(reason, util.isNode) : void((65535 & bitField) > 0 ? async.settlePromises(this) : this._ensurePossibleRejectionHandled());
                            }
                        }, Promise.prototype._fulfillPromises = function(len, value) {
                            /** @type {number} */
                            var i = 1;
                            for (; i < len; i++) {
                                var handler = this._fulfillmentHandlerAt(i);
                                var promise = this._promiseAt(i);
                                var receiver = this._receiverAt(i);
                                this._clearCallbackDataAtIndex(i);
                                this._settlePromise(promise, handler, receiver, value);
                            }
                        }, Promise.prototype._rejectPromises = function(len, reason) {
                            /** @type {number} */
                            var i = 1;
                            for (; i < len; i++) {
                                var handler = this._rejectionHandlerAt(i);
                                var promise = this._promiseAt(i);
                                var receiver = this._receiverAt(i);
                                this._clearCallbackDataAtIndex(i);
                                this._settlePromise(promise, handler, receiver, reason);
                            }
                        }, Promise.prototype._settlePromises = function() {
                            var bitField = this._bitField;
                            /** @type {number} */
                            var len = 65535 & bitField;
                            if (len > 0) {
                                if (0 !== (16842752 & bitField)) {
                                    var reason = this._fulfillmentHandler0;
                                    this._settlePromise0(this._rejectionHandler0, reason, bitField);
                                    this._rejectPromises(len, reason);
                                } else {
                                    var value = this._rejectionHandler0;
                                    this._settlePromise0(this._fulfillmentHandler0, value, bitField);
                                    this._fulfillPromises(len, value);
                                }
                                this._setLength(0);
                            }
                            this._clearCancellationData();
                        }, Promise.prototype._settledValue = function() {
                            var bitField = this._bitField;
                            return 0 !== (33554432 & bitField) ? this._rejectionHandler0 : 0 !== (16777216 & bitField) ? this._fulfillmentHandler0 : void 0;
                        }, Promise.defer = Promise.pending = function() {
                            debug.deprecated("Promise.defer", "new Promise");
                            var promise = new Promise(INTERNAL);
                            return {
                                promise : promise,
                                resolve : resolve,
                                reject : reject
                            };
                        }, util.notEnumerableProp(Promise, "_makeSelfResolutionError", makeSelfResolutionError), require("./method")(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug), require("./bind")(Promise, INTERNAL, tryConvertToPromise, debug), require("./cancel")(Promise, PromiseArray, apiRejection, debug), require("./direct_resolve")(Promise), require("./synchronous_inspection")(Promise), require("./join")(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain), Promise.Promise =
                            Promise, Promise.version = "3.5.1", require("./map.js")(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug), require("./call_get.js")(Promise), require("./using.js")(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug), require("./timers.js")(Promise, INTERNAL, debug), require("./generators.js")(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug), require("./nodeify.js")(Promise), require("./promisify.js")(Promise, INTERNAL),
                            require("./props.js")(Promise, PromiseArray, tryConvertToPromise, apiRejection), require("./race.js")(Promise, INTERNAL, tryConvertToPromise, apiRejection), require("./reduce.js")(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug), require("./settle.js")(Promise, PromiseArray, debug), require("./some.js")(Promise, PromiseArray, apiRejection), require("./filter.js")(Promise, INTERNAL), require("./each.js")(Promise, INTERNAL), require("./any.js")(Promise), util.toFastProperties(Promise),
                            util.toFastProperties(Promise.prototype), fillTypes({
                            a : 1
                        }), fillTypes({
                            b : 2
                        }), fillTypes({
                            c : 3
                        }), fillTypes(1), fillTypes(function() {
                        }), fillTypes(void 0), fillTypes(false), fillTypes(new Promise(INTERNAL)), debug.setBounds(Async.firstLineError, util.lastLineError), Promise;
                    };
                }, {
                    "./any.js" : 1,
                    "./async" : 2,
                    "./bind" : 3,
                    "./call_get.js" : 5,
                    "./cancel" : 6,
                    "./catch_filter" : 7,
                    "./context" : 8,
                    "./debuggability" : 9,
                    "./direct_resolve" : 10,
                    "./each.js" : 11,
                    "./errors" : 12,
                    "./es5" : 13,
                    "./filter.js" : 14,
                    "./finally" : 15,
                    "./generators.js" : 16,
                    "./join" : 17,
                    "./map.js" : 18,
                    "./method" : 19,
                    "./nodeback" : 20,
                    "./nodeify.js" : 21,
                    "./promise_array" : 23,
                    "./promisify.js" : 24,
                    "./props.js" : 25,
                    "./race.js" : 27,
                    "./reduce.js" : 28,
                    "./settle.js" : 30,
                    "./some.js" : 31,
                    "./synchronous_inspection" : 32,
                    "./thenables" : 33,
                    "./timers.js" : 34,
                    "./using.js" : 35,
                    "./util" : 36
                }],
                23 : [function(require, mixin, n) {
                    /**
                     * @param {!Function} Promise
                     * @param {!Object} INTERNAL
                     * @param {!Object} tryConvertToPromise
                     * @param {?} apiRejection
                     * @param {!Function} Proxyable
                     * @return {?}
                     */
                    mixin.exports = function(Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
                        /**
                         * @param {?} val
                         * @return {?}
                         */
                        function toResolutionValue(val) {
                            switch(val) {
                                case -2:
                                    return [];
                                case -3:
                                    return {};
                                case -6:
                                    return new Map;
                            }
                        }
                        /**
                         * @param {!Object} values
                         * @return {undefined}
                         */
                        function PromiseArray(values) {
                            var promise = this._promise = new Promise(INTERNAL);
                            if (values instanceof Promise) {
                                promise._propagateFrom(values, 3);
                            }
                            promise._setOnCancel(this);
                            /** @type {!Object} */
                            this._values = values;
                            /** @type {number} */
                            this._length = 0;
                            /** @type {number} */
                            this._totalResolved = 0;
                            this._init(void 0, -2);
                        }
                        var util = require("./util");
                        util.isArray;
                        return util.inherits(PromiseArray, Proxyable), PromiseArray.prototype.length = function() {
                            return this._length;
                        }, PromiseArray.prototype.promise = function() {
                            return this._promise;
                        }, PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
                            var values = tryConvertToPromise(this._values, this._promise);
                            if (values instanceof Promise) {
                                values = values._target();
                                var bitField = values._bitField;
                                if (this._values = values, 0 === (50397184 & bitField)) {
                                    return this._promise._setAsyncGuaranteed(), values._then(init, this._reject, void 0, this, resolveValueIfEmpty);
                                }
                                if (0 === (33554432 & bitField)) {
                                    return 0 !== (16777216 & bitField) ? this._reject(values._reason()) : this._cancel();
                                }
                                values = values._value();
                            }
                            if (values = util.asArray(values), null === values) {
                                var reason = apiRejection("expecting an array or an iterable object but got " + util.classString(values)).reason();
                                return void this._promise._rejectCallback(reason, false);
                            }
                            return 0 === values.length ? void(resolveValueIfEmpty === -5 ? this._resolveEmptyArray() : this._resolve(toResolutionValue(resolveValueIfEmpty))) : void this._iterate(values);
                        }, PromiseArray.prototype._iterate = function(values) {
                            var len = this.getActualLength(values.length);
                            this._length = len;
                            this._values = this.shouldCopyValues() ? new Array(len) : this._values;
                            var result = this._promise;
                            /** @type {boolean} */
                            var isResolved = false;
                            /** @type {null} */
                            var bitField = null;
                            /** @type {number} */
                            var i = 0;
                            for (; i < len; ++i) {
                                var maybePromise = tryConvertToPromise(values[i], result);
                                if (maybePromise instanceof Promise) {
                                    maybePromise = maybePromise._target();
                                    bitField = maybePromise._bitField;
                                } else {
                                    /** @type {null} */
                                    bitField = null;
                                }
                                if (isResolved) {
                                    if (null !== bitField) {
                                        maybePromise.suppressUnhandledRejections();
                                    }
                                } else {
                                    if (null !== bitField) {
                                        if (0 === (50397184 & bitField)) {
                                            maybePromise._proxy(this, i);
                                            this._values[i] = maybePromise;
                                        } else {
                                            isResolved = 0 !== (33554432 & bitField) ? this._promiseFulfilled(maybePromise._value(), i) : 0 !== (16777216 & bitField) ? this._promiseRejected(maybePromise._reason(), i) : this._promiseCancelled(i);
                                        }
                                    } else {
                                        isResolved = this._promiseFulfilled(maybePromise, i);
                                    }
                                }
                            }
                            if (!isResolved) {
                                result._setAsyncGuaranteed();
                            }
                        }, PromiseArray.prototype._isResolved = function() {
                            return null === this._values;
                        }, PromiseArray.prototype._resolve = function(value) {
                            /** @type {null} */
                            this._values = null;
                            this._promise._fulfill(value);
                        }, PromiseArray.prototype._cancel = function() {
                            if (!this._isResolved() && this._promise._isCancellable()) {
                                /** @type {null} */
                                this._values = null;
                                this._promise._cancel();
                            }
                        }, PromiseArray.prototype._reject = function(reason) {
                            /** @type {null} */
                            this._values = null;
                            this._promise._rejectCallback(reason, false);
                        }, PromiseArray.prototype._promiseFulfilled = function(value, index) {
                            /** @type {string} */
                            this._values[index] = value;
                            /** @type {number} */
                            var totalResolved = ++this._totalResolved;
                            return totalResolved >= this._length && (this._resolve(this._values), true);
                        }, PromiseArray.prototype._promiseCancelled = function() {
                            return this._cancel(), true;
                        }, PromiseArray.prototype._promiseRejected = function(reason) {
                            return this._totalResolved++, this._reject(reason), true;
                        }, PromiseArray.prototype._resultCancelled = function() {
                            if (!this._isResolved()) {
                                var values = this._values;
                                if (this._cancel(), values instanceof Promise) {
                                    values.cancel();
                                } else {
                                    /** @type {number} */
                                    var i = 0;
                                    for (; i < values.length; ++i) {
                                        if (values[i] instanceof Promise) {
                                            values[i].cancel();
                                        }
                                    }
                                }
                            }
                        }, PromiseArray.prototype.shouldCopyValues = function() {
                            return true;
                        }, PromiseArray.prototype.getActualLength = function(len) {
                            return len;
                        }, PromiseArray;
                    };
                }, {
                    "./util" : 36
                }],
                24 : [function(_dereq_, mixin, n) {
                    /**
                     * @param {!Function} Promise
                     * @param {!Object} handler
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, handler) {
                        /**
                         * @param {?} key
                         * @return {?}
                         */
                        function propsFilter(key) {
                            return !x.test(key);
                        }
                        /**
                         * @param {?} fn
                         * @return {?}
                         */
                        function isPromisified(fn) {
                            try {
                                return fn.__isPromisified__ === true;
                            } catch (e) {
                                return false;
                            }
                        }
                        /**
                         * @param {?} obj
                         * @param {(Object|number)} key
                         * @param {!Object} suffix
                         * @return {?}
                         */
                        function hasPromisified(obj, key, suffix) {
                            var val = util.getDataPropertyOrDefault(obj, key + suffix, defaultPromisified);
                            return !!val && isPromisified(val);
                        }
                        /**
                         * @param {!Array} ret
                         * @param {!Object} suffix
                         * @param {!RegExp} suffixRegexp
                         * @return {undefined}
                         */
                        function checkValid(ret, suffix, suffixRegexp) {
                            /** @type {number} */
                            var i = 0;
                            for (; i < ret.length; i = i + 2) {
                                var key = ret[i];
                                if (suffixRegexp.test(key)) {
                                    var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
                                    /** @type {number} */
                                    var j = 0;
                                    for (; j < ret.length; j = j + 2) {
                                        if (ret[j] === keyWithoutAsyncSuffix) {
                                            throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", suffix));
                                        }
                                    }
                                }
                            }
                        }
                        /**
                         * @param {(Object|string)} obj
                         * @param {!Object} suffix
                         * @param {!RegExp} suffixRegexp
                         * @param {!Function} filter
                         * @return {?}
                         */
                        function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
                            var existingKeys = util.inheritedDataKeys(obj);
                            /** @type {!Array} */
                            var ret = [];
                            /** @type {number} */
                            var i = 0;
                            for (; i < existingKeys.length; ++i) {
                                var key = existingKeys[i];
                                var fn = obj[key];
                                var curLoop = filter === defaultFilter || defaultFilter(key, fn, obj);
                                if (!("function" != typeof fn || isPromisified(fn) || hasPromisified(obj, key, suffix) || !filter(key, fn, obj, curLoop))) {
                                    ret.push(key, fn);
                                }
                            }
                            return checkValid(ret, suffix, suffixRegexp), ret;
                        }
                        /**
                         * @param {!Function} end
                         * @param {?} receiver
                         * @param {!Object} _
                         * @param {!Function} callback
                         * @param {!Object} __
                         * @param {boolean} multiArgs
                         * @return {?}
                         */
                        function makeNodePromisifiedClosure(end, receiver, _, callback, __, multiArgs) {
                            /**
                             * @return {?}
                             */
                            function promisified() {
                                var _receiver = receiver;
                                if (receiver === THIS) {
                                    _receiver = this;
                                }
                                var promise = new Promise(handler);
                                promise._captureStackTrace();
                                var callback = "string" == typeof method && this !== u ? this[method] : end;
                                var fn = nodebackForPromise(promise, multiArgs);
                                try {
                                    callback.apply(_receiver, withAppended(arguments, fn));
                                } catch (e) {
                                    promise._rejectCallback(maybeWrapAsError(e), true, true);
                                }
                                return promise._isFateSealed() || promise._setAsyncGuaranteed(), promise;
                            }
                            var u = function() {
                                return this;
                            }();
                            /** @type {!Function} */
                            var method = end;
                            return "string" == typeof method && (end = callback), util.notEnumerableProp(promisified, "__isPromisified__", true), promisified;
                        }
                        /**
                         * @param {!Object} obj
                         * @param {undefined} suffix
                         * @param {!Function} filter
                         * @param {?} promisifier
                         * @param {boolean} multiArgs
                         * @return {?}
                         */
                        function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
                            /** @type {!RegExp} */
                            var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
                            var methods = promisifiableMethods(obj, suffix, suffixRegexp, filter);
                            /** @type {number} */
                            var i = 0;
                            var l = methods.length;
                            for (; i < l; i = i + 2) {
                                var key = methods[i];
                                var fn = methods[i + 1];
                                var promisifiedKey = key + suffix;
                                if (promisifier === makeNodePromisified) {
                                    obj[promisifiedKey] = makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
                                } else {
                                    var promisified = promisifier(fn, function() {
                                        return makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
                                    });
                                    util.notEnumerableProp(promisified, "__isPromisified__", true);
                                    obj[promisifiedKey] = promisified;
                                }
                            }
                            return util.toFastProperties(obj), obj;
                        }
                        /**
                         * @param {?} callback
                         * @param {?} receiver
                         * @param {boolean} multiArgs
                         * @return {?}
                         */
                        function promisify(callback, receiver, multiArgs) {
                            return makeNodePromisified(callback, receiver, void 0, callback, null, multiArgs);
                        }
                        var makeNodePromisifiedEval;
                        var THIS = {};
                        var util = _dereq_("./util");
                        var nodebackForPromise = _dereq_("./nodeback");
                        var withAppended = util.withAppended;
                        var maybeWrapAsError = util.maybeWrapAsError;
                        var canEvaluate = util.canEvaluate;
                        var TypeError = _dereq_("./errors").TypeError;
                        /** @type {string} */
                        var defaultSuffix = "Async";
                        var defaultPromisified = {
                            __isPromisified__ : true
                        };
                        /** @type {!Array} */
                        var noCopyProps = ["arity", "length", "name", "arguments", "caller", "callee", "prototype", "__isPromisified__"];
                        /** @type {!RegExp} */
                        var x = new RegExp("^(?:" + noCopyProps.join("|") + ")$");
                        /**
                         * @param {string} name
                         * @return {?}
                         */
                        var defaultFilter = function(name) {
                            return util.isIdentifier(name) && "_" !== name.charAt(0) && "constructor" !== name;
                        };
                        /**
                         * @param {string} str
                         * @return {?}
                         */
                        var escapeIdentRegex = function(str) {
                            return str.replace(/([$])/, "\\$");
                        };
                        /** @type {(function(!Function, ?, !Object, !Function, !Object, boolean): ?|undefined)} */
                        var makeNodePromisified = canEvaluate ? makeNodePromisifiedEval : makeNodePromisifiedClosure;
                        /**
                         * @param {?} fn
                         * @param {!Object} obj
                         * @return {?}
                         */
                        Promise.promisify = function(fn, obj) {
                            if ("function" != typeof fn) {
                                throw new TypeError("expecting a function but got " + util.classString(fn));
                            }
                            if (isPromisified(fn)) {
                                return fn;
                            }
                            /** @type {!Object} */
                            obj = Object(obj);
                            var receiver = void 0 === obj.context ? THIS : obj.context;
                            /** @type {boolean} */
                            var multiArgs = !!obj.multiArgs;
                            var ret = promisify(fn, receiver, multiArgs);
                            return util.copyDescriptors(fn, ret, propsFilter), ret;
                        };
                        /**
                         * @param {!Object} obj
                         * @param {!Object} options
                         * @return {?}
                         */
                        Promise.promisifyAll = function(obj, options) {
                            if ("function" != typeof obj && "object" != typeof obj) {
                                throw new TypeError("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
                            }
                            /** @type {!Object} */
                            options = Object(options);
                            /** @type {boolean} */
                            var multiArgs = !!options.multiArgs;
                            var suffix = options.suffix;
                            if ("string" != typeof suffix) {
                                /** @type {string} */
                                suffix = defaultSuffix;
                            }
                            var filter = options.filter;
                            if ("function" != typeof filter) {
                                /** @type {function(string): ?} */
                                filter = defaultFilter;
                            }
                            var promisifier = options.promisifier;
                            if ("function" != typeof promisifier && (promisifier = makeNodePromisified), !util.isIdentifier(suffix)) {
                                throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");
                            }
                            var props = util.inheritedDataKeys(obj);
                            /** @type {number} */
                            var i = 0;
                            for (; i < props.length; ++i) {
                                var value = obj[props[i]];
                                if ("constructor" !== props[i] && util.isClass(value)) {
                                    promisifyAll(value.prototype, suffix, filter, promisifier, multiArgs);
                                    promisifyAll(value, suffix, filter, promisifier, multiArgs);
                                }
                            }
                            return promisifyAll(obj, suffix, filter, promisifier, multiArgs);
                        };
                    };
                }, {
                    "./errors" : 12,
                    "./nodeback" : 20,
                    "./util" : 36
                }],
                25 : [function(require, mixin, n) {
                    /**
                     * @param {!Object} Promise
                     * @param {!Object} PromiseArray
                     * @param {!Object} tryConvertToPromise
                     * @param {?} apiRejection
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, PromiseArray, tryConvertToPromise, apiRejection) {
                        /**
                         * @param {?} obj
                         * @return {undefined}
                         */
                        function PropertiesPromiseArray(obj) {
                            var entries;
                            /** @type {boolean} */
                            var isMap = false;
                            if (void 0 !== Es6Map && obj instanceof Es6Map) {
                                entries = mapToEntries(obj);
                                /** @type {boolean} */
                                isMap = true;
                            } else {
                                var r = objct.keys(obj);
                                var n = r.length;
                                /** @type {!Array} */
                                entries = new Array(2 * n);
                                /** @type {number} */
                                var i = 0;
                                for (; i < n; ++i) {
                                    var key = r[i];
                                    entries[i] = obj[key];
                                    entries[i + n] = key;
                                }
                            }
                            this.constructor$(entries);
                            /** @type {boolean} */
                            this._isMap = isMap;
                            this._init$(void 0, isMap ? -6 : -3);
                        }
                        /**
                         * @param {?} promises
                         * @return {?}
                         */
                        function props(promises) {
                            var promise;
                            var castValue = tryConvertToPromise(promises);
                            return isObject(castValue) ? (promise = castValue instanceof Promise ? castValue._then(Promise.props, void 0, void 0, void 0, void 0) : (new PropertiesPromiseArray(castValue)).promise(), castValue instanceof Promise && promise._propagateFrom(castValue, 2), promise) : apiRejection("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");
                        }
                        var Es6Map;
                        var util = require("./util");
                        var isObject = util.isObject;
                        var objct = require("./es5");
                        if ("function" == typeof Map) {
                            /** @type {function(new:Map, (Array<Array<(KEY|VALUE)>>|Iterable<Array<(KEY|VALUE)>>|null)=): ?} */
                            Es6Map = Map;
                        }
                        var mapToEntries = function() {
                            /**
                             * @param {?} callback
                             * @param {?} initialHash
                             * @return {undefined}
                             */
                            function hash(callback, initialHash) {
                                this[message] = callback;
                                this[message + num] = initialHash;
                                message++;
                            }
                            /** @type {number} */
                            var message = 0;
                            /** @type {number} */
                            var num = 0;
                            return function(res) {
                                num = res.size;
                                /** @type {number} */
                                message = 0;
                                /** @type {!Array} */
                                var value = new Array(2 * res.size);
                                return res.forEach(hash, value), value;
                            };
                        }();
                        /**
                         * @param {!Array} entries
                         * @return {?}
                         */
                        var entriesToMap = function(entries) {
                            var ret = new Es6Map;
                            /** @type {number} */
                            var cache_ = entries.length / 2 | 0;
                            /** @type {number} */
                            var id = 0;
                            for (; id < cache_; ++id) {
                                var value = entries[cache_ + id];
                                var item = entries[id];
                                ret.set(value, item);
                            }
                            return ret;
                        };
                        util.inherits(PropertiesPromiseArray, PromiseArray);
                        /**
                         * @return {undefined}
                         */
                        PropertiesPromiseArray.prototype._init = function() {
                        };
                        /**
                         * @param {string} value
                         * @param {!Function} index
                         * @return {?}
                         */
                        PropertiesPromiseArray.prototype._promiseFulfilled = function(value, index) {
                            /** @type {string} */
                            this._values[index] = value;
                            /** @type {number} */
                            var totalResolved = ++this._totalResolved;
                            if (totalResolved >= this._length) {
                                var val;
                                if (this._isMap) {
                                    val = entriesToMap(this._values);
                                } else {
                                    val = {};
                                    var i = this.length();
                                    /** @type {number} */
                                    var index = 0;
                                    var length = this.length();
                                    for (; index < length; ++index) {
                                        val[this._values[index + i]] = this._values[index];
                                    }
                                }
                                return this._resolve(val), true;
                            }
                            return false;
                        };
                        /**
                         * @return {?}
                         */
                        PropertiesPromiseArray.prototype.shouldCopyValues = function() {
                            return false;
                        };
                        /**
                         * @param {number} len
                         * @return {?}
                         */
                        PropertiesPromiseArray.prototype.getActualLength = function(len) {
                            return len >> 1;
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype.props = function() {
                            return props(this);
                        };
                        /**
                         * @param {?} promises
                         * @return {?}
                         */
                        Promise.props = function(promises) {
                            return props(promises);
                        };
                    };
                }, {
                    "./es5" : 13,
                    "./util" : 36
                }],
                26 : [function(canCreateDiscussions, module, n) {
                    /**
                     * @param {?} array
                     * @param {number} i
                     * @param {?} target
                     * @param {number} size
                     * @param {number} len
                     * @return {undefined}
                     */
                    function arrayMove(array, i, target, size, len) {
                        /** @type {number} */
                        var index = 0;
                        for (; index < len; ++index) {
                            target[index + size] = array[index + i];
                            array[index + i] = void 0;
                        }
                    }
                    /**
                     * @param {number} obj
                     * @return {undefined}
                     */
                    function Queue(obj) {
                        /** @type {number} */
                        this._capacity = obj;
                        /** @type {number} */
                        this._length = 0;
                        /** @type {number} */
                        this._front = 0;
                    }
                    /**
                     * @param {?} size
                     * @return {?}
                     */
                    Queue.prototype._willBeOverCapacity = function(size) {
                        return this._capacity < size;
                    };
                    /**
                     * @param {!Function} arg
                     * @return {undefined}
                     */
                    Queue.prototype._pushOne = function(arg) {
                        var length = this.length();
                        this._checkCapacity(length + 1);
                        /** @type {number} */
                        var lastOpt = this._front + length & this._capacity - 1;
                        /** @type {!Function} */
                        this[lastOpt] = arg;
                        this._length = length + 1;
                    };
                    /**
                     * @param {!Object} value
                     * @param {!Function} receiver
                     * @param {!Object} arg
                     * @return {?}
                     */
                    Queue.prototype.push = function(value, receiver, arg) {
                        var length = this.length() + 3;
                        if (this._willBeOverCapacity(length)) {
                            return this._pushOne(value), this._pushOne(receiver), void this._pushOne(arg);
                        }
                        /** @type {number} */
                        var j = this._front + length - 3;
                        this._checkCapacity(length);
                        /** @type {number} */
                        var wrapMask = this._capacity - 1;
                        /** @type {!Object} */
                        this[j + 0 & wrapMask] = value;
                        /** @type {!Function} */
                        this[j + 1 & wrapMask] = receiver;
                        /** @type {!Object} */
                        this[j + 2 & wrapMask] = arg;
                        this._length = length;
                    };
                    /**
                     * @return {?}
                     */
                    Queue.prototype.shift = function() {
                        var front = this._front;
                        var ret = this[front];
                        return this[front] = void 0, this._front = front + 1 & this._capacity - 1, this._length--, ret;
                    };
                    /**
                     * @return {?}
                     */
                    Queue.prototype.length = function() {
                        return this._length;
                    };
                    /**
                     * @param {?} size
                     * @return {undefined}
                     */
                    Queue.prototype._checkCapacity = function(size) {
                        if (this._capacity < size) {
                            this._resizeTo(this._capacity << 1);
                        }
                    };
                    /**
                     * @param {number} capacity
                     * @return {undefined}
                     */
                    Queue.prototype._resizeTo = function(capacity) {
                        var oldCapacity = this._capacity;
                        /** @type {number} */
                        this._capacity = capacity;
                        var front = this._front;
                        var length = this._length;
                        /** @type {number} */
                        var moveItemsCount = front + length & oldCapacity - 1;
                        arrayMove(this, 0, this, oldCapacity, moveItemsCount);
                    };
                    /** @type {function(number): undefined} */
                    module.exports = Queue;
                }, {}],
                27 : [function(require, mixin, n) {
                    /**
                     * @param {!Function} Promise
                     * @param {!Object} INTERNAL
                     * @param {!Object} tryConvertToPromise
                     * @param {?} apiRejection
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, INTERNAL, tryConvertToPromise, apiRejection) {
                        /**
                         * @param {!Array} promises
                         * @param {?} parent
                         * @return {?}
                         */
                        function race(promises, parent) {
                            var maybePromise = tryConvertToPromise(promises);
                            if (maybePromise instanceof Promise) {
                                return raceLater(maybePromise);
                            }
                            if (promises = util.asArray(promises), null === promises) {
                                return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
                            }
                            var ret = new Promise(INTERNAL);
                            if (void 0 !== parent) {
                                ret._propagateFrom(parent, 3);
                            }
                            var fn = ret._fulfill;
                            var reject = ret._reject;
                            /** @type {number} */
                            var i = 0;
                            var remaining = promises.length;
                            for (; i < remaining; ++i) {
                                var val = promises[i];
                                if (void 0 !== val || i in promises) {
                                    Promise.cast(val)._then(fn, reject, void 0, ret, null);
                                }
                            }
                            return ret;
                        }
                        var util = require("./util");
                        /**
                         * @param {?} promise
                         * @return {?}
                         */
                        var raceLater = function(promise) {
                            return promise.then(function(promises) {
                                return race(promises, promise);
                            });
                        };
                        /**
                         * @param {!Array} promises
                         * @return {?}
                         */
                        Promise.race = function(promises) {
                            return race(promises, void 0);
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype.race = function() {
                            return race(this, void 0);
                        };
                    };
                }, {
                    "./util" : 36
                }],
                28 : [function(require, mixin, n) {
                    /**
                     * @param {!Function} Promise
                     * @param {!Object} PromiseArray
                     * @param {!Object} apiRejection
                     * @param {?} tryConvertToPromise
                     * @param {undefined} INTERNAL
                     * @param {?} debug
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
                        /**
                         * @param {?} promises
                         * @param {!Function} fn
                         * @param {string} initialValue
                         * @param {number} _each
                         * @return {undefined}
                         */
                        function ReductionPromiseArray(promises, fn, initialValue, _each) {
                            this.constructor$(promises);
                            var string = getDomain();
                            this._fn = null === string ? fn : util.domainBind(string, fn);
                            if (void 0 !== initialValue) {
                                initialValue = Promise.resolve(initialValue);
                                initialValue._attachCancellationCallback(this);
                            }
                            /** @type {string} */
                            this._initialValue = initialValue;
                            /** @type {null} */
                            this._currentCancellable = null;
                            if (_each === INTERNAL) {
                                /** @type {!Array} */
                                this._eachValues = Array(this._length);
                            } else {
                                if (0 === _each) {
                                    /** @type {null} */
                                    this._eachValues = null;
                                } else {
                                    this._eachValues = void 0;
                                }
                            }
                            this._promise._captureStackTrace();
                            this._init$(void 0, -5);
                        }
                        /**
                         * @param {undefined} value
                         * @param {?} array
                         * @return {undefined}
                         */
                        function completed(value, array) {
                            if (this.isFulfilled()) {
                                array._resolve(value);
                            } else {
                                array._reject(value);
                            }
                        }
                        /**
                         * @param {?} promises
                         * @param {boolean} fn
                         * @param {boolean} initialValue
                         * @param {boolean} _each
                         * @return {?}
                         */
                        function reduce(promises, fn, initialValue, _each) {
                            if ("function" != typeof fn) {
                                return apiRejection("expecting a function but got " + util.classString(fn));
                            }
                            var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
                            return array.promise();
                        }
                        /**
                         * @param {!Array} accum
                         * @return {?}
                         */
                        function gotAccum(accum) {
                            /** @type {!Array} */
                            this.accum = accum;
                            this.array._gotAccum(accum);
                            var value = tryConvertToPromise(this.value, this.array._promise);
                            return value instanceof Promise ? (this.array._currentCancellable = value, value._then(gotValue, void 0, void 0, this, void 0)) : gotValue.call(this, value);
                        }
                        /**
                         * @param {?} context
                         * @return {?}
                         */
                        function gotValue(context) {
                            var array = this.array;
                            var promise = array._promise;
                            var fn = tryCatch(array._fn);
                            promise._pushContext();
                            var value;
                            value = void 0 !== array._eachValues ? fn.call(promise._boundValue(), context, this.index, this.length) : fn.call(promise._boundValue(), this.accum, context, this.index, this.length);
                            if (value instanceof Promise) {
                                array._currentCancellable = value;
                            }
                            var promiseCreated = promise._popContext();
                            return debug.checkForgottenReturns(value, promiseCreated, void 0 !== array._eachValues ? "Promise.each" : "Promise.reduce", promise), value;
                        }
                        var getDomain = Promise._getDomain;
                        var util = require("./util");
                        var tryCatch = util.tryCatch;
                        util.inherits(ReductionPromiseArray, PromiseArray);
                        /**
                         * @param {!Object} accum
                         * @return {undefined}
                         */
                        ReductionPromiseArray.prototype._gotAccum = function(accum) {
                            if (void 0 !== this._eachValues && null !== this._eachValues && accum !== INTERNAL) {
                                this._eachValues.push(accum);
                            }
                        };
                        /**
                         * @param {!Object} value
                         * @return {?}
                         */
                        ReductionPromiseArray.prototype._eachComplete = function(value) {
                            return null !== this._eachValues && this._eachValues.push(value), this._eachValues;
                        };
                        /**
                         * @return {undefined}
                         */
                        ReductionPromiseArray.prototype._init = function() {
                        };
                        /**
                         * @return {undefined}
                         */
                        ReductionPromiseArray.prototype._resolveEmptyArray = function() {
                            this._resolve(void 0 !== this._eachValues ? this._eachValues : this._initialValue);
                        };
                        /**
                         * @return {?}
                         */
                        ReductionPromiseArray.prototype.shouldCopyValues = function() {
                            return false;
                        };
                        /**
                         * @param {!Object} value
                         * @return {undefined}
                         */
                        ReductionPromiseArray.prototype._resolve = function(value) {
                            this._promise._resolveCallback(value);
                            /** @type {null} */
                            this._values = null;
                        };
                        /**
                         * @param {string} sender
                         * @return {?}
                         */
                        ReductionPromiseArray.prototype._resultCancelled = function(sender) {
                            return sender === this._initialValue ? this._cancel() : void(this._isResolved() || (this._resultCancelled$(), this._currentCancellable instanceof Promise && this._currentCancellable.cancel(), this._initialValue instanceof Promise && this._initialValue.cancel()));
                        };
                        /**
                         * @param {!Object} values
                         * @return {undefined}
                         */
                        ReductionPromiseArray.prototype._iterate = function(values) {
                            /** @type {!Object} */
                            this._values = values;
                            var value;
                            var j;
                            var i = values.length;
                            if (void 0 !== this._initialValue ? (value = this._initialValue, j = 0) : (value = Promise.resolve(values[0]), j = 1), this._currentCancellable = value, !value.isRejected()) {
                                for (; j < i; ++j) {
                                    var ctx = {
                                        accum : null,
                                        value : values[j],
                                        index : j,
                                        length : i,
                                        array : this
                                    };
                                    value = value._then(gotAccum, void 0, void 0, ctx, void 0);
                                }
                            }
                            if (void 0 !== this._eachValues) {
                                value = value._then(this._eachComplete, void 0, void 0, this, void 0);
                            }
                            value._then(completed, completed, void 0, value, this);
                        };
                        /**
                         * @param {!Array} array
                         * @param {!Array} value
                         * @return {?}
                         */
                        Promise.prototype.reduce = function(array, value) {
                            return reduce(this, array, value, null);
                        };
                        /**
                         * @param {(!Function|string)} array
                         * @param {!Array} fn
                         * @param {?} initialValue
                         * @param {?} _each
                         * @return {?}
                         */
                        Promise.reduce = function(array, fn, initialValue, _each) {
                            return reduce(array, fn, initialValue, _each);
                        };
                    };
                }, {
                    "./util" : 36
                }],
                29 : [function(require, module, i) {
                    var sightglass;
                    var util = require("./util");
                    /**
                     * @return {?}
                     */
                    var value = function() {
                        throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
                    };
                    var field = util.getNativePromise();
                    if (util.isNode && "undefined" == typeof MutationObserver) {
                        var GlobalSetImmediate = global.setImmediate;
                        var defer = options.nextTick;
                        /** @type {function(!Function): undefined} */
                        sightglass = util.isRecentNode ? function(obj) {
                            GlobalSetImmediate.call(global, obj);
                        } : function(data) {
                            defer.call(options, data);
                        };
                    } else {
                        if ("function" == typeof field && "function" == typeof field.resolve) {
                            var f = field.resolve();
                            /**
                             * @param {!Function} obj
                             * @return {undefined}
                             */
                            sightglass = function(obj) {
                                f.then(obj);
                            };
                        } else {
                            sightglass = "undefined" == typeof MutationObserver || "undefined" != typeof window && window.navigator && (window.navigator.standalone || window.cordova) ? "undefined" != typeof setImmediate ? function(c) {
                                setImmediate(c);
                            } : "undefined" != typeof setTimeout ? function(data) {
                                setTimeout(data, 0);
                            } : value : function() {
                                /** @type {!Element} */
                                var t = document.createElement("div");
                                var options = {
                                    attributes : true
                                };
                                /** @type {boolean} */
                                var n = false;
                                /** @type {!Element} */
                                var r = document.createElement("div");
                                /** @type {!MutationObserver} */
                                var x = new MutationObserver(function() {
                                    t.classList.toggle("foo");
                                    /** @type {boolean} */
                                    n = false;
                                });
                                x.observe(r, options);
                                /**
                                 * @return {undefined}
                                 */
                                var handleToggledOrCodeOnly = function() {
                                    if (!n) {
                                        /** @type {boolean} */
                                        n = true;
                                        r.classList.toggle("foo");
                                    }
                                };
                                return function(saveNotifs) {
                                    /** @type {!MutationObserver} */
                                    var o = new MutationObserver(function() {
                                        o.disconnect();
                                        saveNotifs();
                                    });
                                    o.observe(t, options);
                                    handleToggledOrCodeOnly();
                                };
                            }();
                        }
                    }
                    module.exports = sightglass;
                }, {
                    "./util" : 36
                }],
                30 : [function(require, mixin, n) {
                    /**
                     * @param {!Function} Promise
                     * @param {!Object} name
                     * @param {!Object} provider
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, name, provider) {
                        /**
                         * @param {?} values
                         * @return {undefined}
                         */
                        function SettledPromiseArray(values) {
                            this.constructor$(values);
                        }
                        var PromiseInspection = Promise.PromiseInspection;
                        var util = require("./util");
                        util.inherits(SettledPromiseArray, name);
                        /**
                         * @param {!Function} index
                         * @param {number} inspection
                         * @return {?}
                         */
                        SettledPromiseArray.prototype._promiseResolved = function(index, inspection) {
                            /** @type {number} */
                            this._values[index] = inspection;
                            /** @type {number} */
                            var totalResolved = ++this._totalResolved;
                            return totalResolved >= this._length && (this._resolve(this._values), true);
                        };
                        /**
                         * @param {string} value
                         * @param {!Function} index
                         * @return {?}
                         */
                        SettledPromiseArray.prototype._promiseFulfilled = function(value, index) {
                            var ret = new PromiseInspection;
                            return ret._bitField = 33554432, ret._settledValueField = value, this._promiseResolved(index, ret);
                        };
                        /**
                         * @param {string} reason
                         * @param {!Function} index
                         * @return {?}
                         */
                        SettledPromiseArray.prototype._promiseRejected = function(reason, index) {
                            var ret = new PromiseInspection;
                            return ret._bitField = 16777216, ret._settledValueField = reason, this._promiseResolved(index, ret);
                        };
                        /**
                         * @param {?} promises
                         * @return {?}
                         */
                        Promise.settle = function(promises) {
                            return provider.deprecated(".settle()", ".reflect()"), (new SettledPromiseArray(promises)).promise();
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype.settle = function() {
                            return Promise.settle(this);
                        };
                    };
                }, {
                    "./util" : 36
                }],
                31 : [function(require, mixin, n) {
                    /**
                     * @param {string} Promise
                     * @param {!Object} name
                     * @param {!Object} func
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, name, func) {
                        /**
                         * @param {?} values
                         * @return {undefined}
                         */
                        function SomePromiseArray(values) {
                            this.constructor$(values);
                            /** @type {number} */
                            this._howMany = 0;
                            /** @type {boolean} */
                            this._unwrap = false;
                            /** @type {boolean} */
                            this._initialized = false;
                        }
                        /**
                         * @param {?} promises
                         * @param {number} howMany
                         * @return {?}
                         */
                        function some(promises, howMany) {
                            if ((0 | howMany) !== howMany || howMany < 0) {
                                return func("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
                            }
                            var ret = new SomePromiseArray(promises);
                            var o = ret.promise();
                            return ret.setHowMany(howMany), ret.init(), o;
                        }
                        var util = require("./util");
                        var RangeError = require("./errors").RangeError;
                        var AggregateError = require("./errors").AggregateError;
                        var isArray = util.isArray;
                        var CANCELLATION = {};
                        util.inherits(SomePromiseArray, name);
                        /**
                         * @return {?}
                         */
                        SomePromiseArray.prototype._init = function() {
                            if (this._initialized) {
                                if (0 === this._howMany) {
                                    return void this._resolve([]);
                                }
                                this._init$(void 0, -5);
                                var isArrayResolved = isArray(this._values);
                                if (!this._isResolved() && isArrayResolved && this._howMany > this._canPossiblyFulfill()) {
                                    this._reject(this._getRangeError(this.length()));
                                }
                            }
                        };
                        /**
                         * @return {undefined}
                         */
                        SomePromiseArray.prototype.init = function() {
                            /** @type {boolean} */
                            this._initialized = true;
                            this._init();
                        };
                        /**
                         * @return {undefined}
                         */
                        SomePromiseArray.prototype.setUnwrap = function() {
                            /** @type {boolean} */
                            this._unwrap = true;
                        };
                        /**
                         * @return {?}
                         */
                        SomePromiseArray.prototype.howMany = function() {
                            return this._howMany;
                        };
                        /**
                         * @param {number} count
                         * @return {undefined}
                         */
                        SomePromiseArray.prototype.setHowMany = function(count) {
                            /** @type {number} */
                            this._howMany = count;
                        };
                        /**
                         * @param {!Object} value
                         * @return {?}
                         */
                        SomePromiseArray.prototype._promiseFulfilled = function(value) {
                            return this._addFulfilled(value), this._fulfilled() === this.howMany() && (this._values.length = this.howMany(), 1 === this.howMany() && this._unwrap ? this._resolve(this._values[0]) : this._resolve(this._values), true);
                        };
                        /**
                         * @param {!Object} reason
                         * @return {?}
                         */
                        SomePromiseArray.prototype._promiseRejected = function(reason) {
                            return this._addRejected(reason), this._checkOutcome();
                        };
                        /**
                         * @return {?}
                         */
                        SomePromiseArray.prototype._promiseCancelled = function() {
                            return this._values instanceof Promise || null == this._values ? this._cancel() : (this._addRejected(CANCELLATION), this._checkOutcome());
                        };
                        /**
                         * @return {?}
                         */
                        SomePromiseArray.prototype._checkOutcome = function() {
                            if (this.howMany() > this._canPossiblyFulfill()) {
                                var e = new AggregateError;
                                var i = this.length();
                                for (; i < this._values.length; ++i) {
                                    if (this._values[i] !== CANCELLATION) {
                                        e.push(this._values[i]);
                                    }
                                }
                                return e.length > 0 ? this._reject(e) : this._cancel(), true;
                            }
                            return false;
                        };
                        /**
                         * @return {?}
                         */
                        SomePromiseArray.prototype._fulfilled = function() {
                            return this._totalResolved;
                        };
                        /**
                         * @return {?}
                         */
                        SomePromiseArray.prototype._rejected = function() {
                            return this._values.length - this.length();
                        };
                        /**
                         * @param {!Object} reason
                         * @return {undefined}
                         */
                        SomePromiseArray.prototype._addRejected = function(reason) {
                            this._values.push(reason);
                        };
                        /**
                         * @param {!Object} value
                         * @return {undefined}
                         */
                        SomePromiseArray.prototype._addFulfilled = function(value) {
                            /** @type {!Object} */
                            this._values[this._totalResolved++] = value;
                        };
                        /**
                         * @return {?}
                         */
                        SomePromiseArray.prototype._canPossiblyFulfill = function() {
                            return this.length() - this._rejected();
                        };
                        /**
                         * @param {number} count
                         * @return {?}
                         */
                        SomePromiseArray.prototype._getRangeError = function(count) {
                            /** @type {string} */
                            var errorMessage = "Input array must contain at least " + this._howMany + " items but contains only " + count + " items";
                            return new RangeError(errorMessage);
                        };
                        /**
                         * @return {undefined}
                         */
                        SomePromiseArray.prototype._resolveEmptyArray = function() {
                            this._reject(this._getRangeError(0));
                        };
                        /**
                         * @param {?} promises
                         * @param {undefined} howMany
                         * @return {?}
                         */
                        Promise.some = function(promises, howMany) {
                            return some(promises, howMany);
                        };
                        /**
                         * @param {undefined} howMany
                         * @return {?}
                         */
                        Promise.prototype.some = function(howMany) {
                            return some(this, howMany);
                        };
                        /** @type {function(?): undefined} */
                        Promise._SomePromiseArray = SomePromiseArray;
                    };
                }, {
                    "./errors" : 12,
                    "./util" : 36
                }],
                32 : [function(canCreateDiscussions, mixin, n) {
                    /**
                     * @param {!Function} Promise
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise) {
                        /**
                         * @param {number} promise
                         * @return {undefined}
                         */
                        function PromiseInspection(promise) {
                            if (void 0 !== promise) {
                                promise = promise._target();
                                this._bitField = promise._bitField;
                                this._settledValueField = promise._isFateSealed() ? promise._settledValue() : void 0;
                            } else {
                                /** @type {number} */
                                this._bitField = 0;
                                this._settledValueField = void 0;
                            }
                        }
                        /**
                         * @return {?}
                         */
                        PromiseInspection.prototype._settledValue = function() {
                            return this._settledValueField;
                        };
                        /** @type {function(): ?} */
                        var value = PromiseInspection.prototype.value = function() {
                            if (!this.isFulfilled()) {
                                throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
                            }
                            return this._settledValue();
                        };
                        /** @type {function(): ?} */
                        var originalElementQuerySelector = PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function() {
                            if (!this.isRejected()) {
                                throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
                            }
                            return this._settledValue();
                        };
                        /** @type {function(): ?} */
                        var isResolved = PromiseInspection.prototype.isFulfilled = function() {
                            return 0 !== (33554432 & this._bitField);
                        };
                        /** @type {function(): ?} */
                        var isFulfilled = PromiseInspection.prototype.isRejected = function() {
                            return 0 !== (16777216 & this._bitField);
                        };
                        /** @type {function(): ?} */
                        var isRejected = PromiseInspection.prototype.isPending = function() {
                            return 0 === (50397184 & this._bitField);
                        };
                        /** @type {function(): ?} */
                        var isPending = PromiseInspection.prototype.isResolved = function() {
                            return 0 !== (50331648 & this._bitField);
                        };
                        /**
                         * @return {?}
                         */
                        PromiseInspection.prototype.isCancelled = function() {
                            return 0 !== (8454144 & this._bitField);
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype.__isCancelled = function() {
                            return 65536 === (65536 & this._bitField);
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype._isCancelled = function() {
                            return this._target().__isCancelled();
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype.isCancelled = function() {
                            return 0 !== (8454144 & this._target()._bitField);
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype.isPending = function() {
                            return isRejected.call(this._target());
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype.isRejected = function() {
                            return isFulfilled.call(this._target());
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype.isFulfilled = function() {
                            return isResolved.call(this._target());
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype.isResolved = function() {
                            return isPending.call(this._target());
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype.value = function() {
                            return value.call(this._target());
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype.reason = function() {
                            var target = this._target();
                            return target._unsetRejectionIsUnhandled(), originalElementQuerySelector.call(target);
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype._value = function() {
                            return this._settledValue();
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype._reason = function() {
                            return this._unsetRejectionIsUnhandled(), this._settledValue();
                        };
                        /** @type {function(number): undefined} */
                        Promise.PromiseInspection = PromiseInspection;
                    };
                }, {}],
                33 : [function(require, mixin, n) {
                    /**
                     * @param {!Object} Promise
                     * @param {!Object} fn
                     * @return {?}
                     */
                    mixin.exports = function(Promise, fn) {
                        /**
                         * @param {!Object} obj
                         * @param {?} context
                         * @return {?}
                         */
                        function tryConvertToPromise(obj, context) {
                            if (isObject(obj)) {
                                if (obj instanceof Promise) {
                                    return obj;
                                }
                                var then = reject(obj);
                                if (then === errorObj) {
                                    if (context) {
                                        context._pushContext();
                                    }
                                    var ret = Promise.reject(then.e);
                                    return context && context._popContext(), ret;
                                }
                                if ("function" == typeof then) {
                                    if (isAnyBluebirdPromise(obj)) {
                                        ret = new Promise(fn);
                                        return obj._then(ret._fulfill, ret._reject, void 0, ret, null), ret;
                                    }
                                    return doThenable(obj, then, context);
                                }
                            }
                            return obj;
                        }
                        /**
                         * @param {?} promise
                         * @return {?}
                         */
                        function getThen(promise) {
                            return promise.then;
                        }
                        /**
                         * @param {(Object|string)} value
                         * @return {?}
                         */
                        function reject(value) {
                            try {
                                return getThen(value);
                            } catch (reason) {
                                return errorObj.e = reason, errorObj;
                            }
                        }
                        /**
                         * @param {(Object|string)} obj
                         * @return {?}
                         */
                        function isAnyBluebirdPromise(obj) {
                            try {
                                return hasProp.call(obj, "_promise0");
                            } catch (e) {
                                return false;
                            }
                        }
                        /**
                         * @param {(Object|string)} x
                         * @param {!Function} then
                         * @param {?} context
                         * @return {?}
                         */
                        function doThenable(x, then, context) {
                            /**
                             * @param {!Object} value
                             * @return {undefined}
                             */
                            function resolve(value) {
                                if (promise) {
                                    promise._resolveCallback(value);
                                    /** @type {null} */
                                    promise = null;
                                }
                            }
                            /**
                             * @param {(Object|string)} reason
                             * @return {undefined}
                             */
                            function reject(reason) {
                                if (promise) {
                                    promise._rejectCallback(reason, synchronous, true);
                                    /** @type {null} */
                                    promise = null;
                                }
                            }
                            var promise = new Promise(fn);
                            var p = promise;
                            if (context) {
                                context._pushContext();
                            }
                            promise._captureStackTrace();
                            if (context) {
                                context._popContext();
                            }
                            /** @type {boolean} */
                            var synchronous = true;
                            var result = util.tryCatch(then).call(x, resolve, reject);
                            return synchronous = false, promise && result === errorObj && (promise._rejectCallback(result.e, true, true), promise = null), p;
                        }
                        var util = require("./util");
                        var errorObj = util.errorObj;
                        var isObject = util.isObject;
                        /** @type {function(this:Object, *): boolean} */
                        var hasProp = {}.hasOwnProperty;
                        return tryConvertToPromise;
                    };
                }, {
                    "./util" : 36
                }],
                34 : [function(require, mixin, n) {
                    /**
                     * @param {!Function} Promise
                     * @param {!Object} val
                     * @param {!Object} opts
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, val, opts) {
                        /**
                         * @param {!Function} handle
                         * @return {undefined}
                         */
                        function HandleWrapper(handle) {
                            /** @type {!Function} */
                            this.handle = handle;
                        }
                        /**
                         * @param {?} value
                         * @return {?}
                         */
                        function successClear(value) {
                            return clearTimeout(this.handle), value;
                        }
                        /**
                         * @param {?} errtype
                         * @return {?}
                         */
                        function fail(errtype) {
                            throw clearTimeout(this.handle), errtype;
                        }
                        var util = require("./util");
                        var TimeoutError = Promise.TimeoutError;
                        /**
                         * @return {undefined}
                         */
                        HandleWrapper.prototype._resultCancelled = function() {
                            clearTimeout(this.handle);
                        };
                        /**
                         * @param {!Object} value
                         * @return {?}
                         */
                        var afterValue = function(value) {
                            return delay(+this).thenReturn(value);
                        };
                        /** @type {function(!Function, ?): ?} */
                        var delay = Promise.delay = function(ms, value) {
                            var ret;
                            var handle;
                            return void 0 !== value ? (ret = Promise.resolve(value)._then(afterValue, null, null, ms, void 0), opts.cancellation() && value instanceof Promise && ret._setOnCancel(value)) : (ret = new Promise(val), handle = setTimeout(function() {
                                ret._fulfill();
                            }, +ms), opts.cancellation() && ret._setOnCancel(new HandleWrapper(handle)), ret._captureStackTrace()), ret._setAsyncGuaranteed(), ret;
                        };
                        /**
                         * @param {!Function} val
                         * @return {?}
                         */
                        Promise.prototype.delay = function(val) {
                            return delay(val, this);
                        };
                        /**
                         * @param {!Object} promise
                         * @param {string} message
                         * @param {!Object} parent
                         * @return {undefined}
                         */
                        var afterTimeout = function(promise, message, parent) {
                            var reason;
                            reason = "string" != typeof message ? message instanceof Error ? message : new TimeoutError("operation timed out") : new TimeoutError(message);
                            util.markAsOriginatingFromRejection(reason);
                            promise._attachExtraTrace(reason);
                            promise._reject(reason);
                            if (null != parent) {
                                parent.cancel();
                            }
                        };
                        /**
                         * @param {number} ms
                         * @param {string} message
                         * @return {?}
                         */
                        Promise.prototype.timeout = function(ms, message) {
                            /** @type {number} */
                            ms = +ms;
                            var ret;
                            var parent;
                            var value = new HandleWrapper(setTimeout(function() {
                                if (ret.isPending()) {
                                    afterTimeout(ret, message, parent);
                                }
                            }, ms));
                            return opts.cancellation() ? (parent = this.then(), ret = parent._then(successClear, fail, void 0, value, void 0), ret._setOnCancel(value)) : ret = this._then(successClear, fail, void 0, value, void 0), ret;
                        };
                    };
                }, {
                    "./util" : 36
                }],
                35 : [function(_dereq_, mixin, n) {
                    /**
                     * @param {!Function} Promise
                     * @param {!Object} apiRejection
                     * @param {!Object} tryConvertToPromise
                     * @param {?} createContext
                     * @param {?} INTERNAL
                     * @param {?} debug
                     * @return {undefined}
                     */
                    mixin.exports = function(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug) {
                        /**
                         * @param {?} name
                         * @return {undefined}
                         */
                        function thrower(name) {
                            setTimeout(function() {
                                throw name;
                            }, 0);
                        }
                        /**
                         * @param {?} thenable
                         * @return {?}
                         */
                        function castPreservingDisposable(thenable) {
                            var maybePromise = tryConvertToPromise(thenable);
                            return maybePromise !== thenable && "function" == typeof thenable._isDisposable && "function" == typeof thenable._getDisposer && thenable._isDisposable() && maybePromise._setDisposable(thenable._getDisposer()), maybePromise;
                        }
                        /**
                         * @param {!Object} resources
                         * @param {?} inspection
                         * @return {?}
                         */
                        function dispose(resources, inspection) {
                            /**
                             * @return {?}
                             */
                            function iterator() {
                                if (siteVersion >= versionNumber) {
                                    return promise._fulfill();
                                }
                                var maybePromise = castPreservingDisposable(resources[siteVersion++]);
                                if (maybePromise instanceof Promise && maybePromise._isDisposable()) {
                                    try {
                                        maybePromise = tryConvertToPromise(maybePromise._getDisposer().tryDispose(inspection), resources.promise);
                                    } catch (fetchCollection) {
                                        return thrower(fetchCollection);
                                    }
                                    if (maybePromise instanceof Promise) {
                                        return maybePromise._then(iterator, thrower, null, null, null);
                                    }
                                }
                                iterator();
                            }
                            /** @type {number} */
                            var siteVersion = 0;
                            var versionNumber = resources.length;
                            var promise = new Promise(INTERNAL);
                            return iterator(), promise;
                        }
                        /**
                         * @param {string} data
                         * @param {string} promise
                         * @param {string} context
                         * @return {undefined}
                         */
                        function Disposer(data, promise, context) {
                            /** @type {string} */
                            this._data = data;
                            /** @type {string} */
                            this._promise = promise;
                            /** @type {string} */
                            this._context = context;
                        }
                        /**
                         * @param {?} fn
                         * @param {?} promise
                         * @param {?} context
                         * @return {undefined}
                         */
                        function FunctionDisposer(fn, promise, context) {
                            this.constructor$(fn, promise, context);
                        }
                        /**
                         * @param {!Object} value
                         * @return {?}
                         */
                        function maybeUnwrapDisposer(value) {
                            return Disposer.isDisposer(value) ? (this.resources[this.index]._setDisposable(value), value.promise()) : value;
                        }
                        /**
                         * @param {number} length
                         * @return {undefined}
                         */
                        function ResourceList(length) {
                            /** @type {number} */
                            this.length = length;
                            /** @type {null} */
                            this.promise = null;
                            /** @type {null} */
                            this[length - 1] = null;
                        }
                        var util = _dereq_("./util");
                        var TypeError = _dereq_("./errors").TypeError;
                        var inherits = _dereq_("./util").inherits;
                        var errorObj = util.errorObj;
                        var tryCatch = util.tryCatch;
                        var NULL = {};
                        /**
                         * @return {?}
                         */
                        Disposer.prototype.data = function() {
                            return this._data;
                        };
                        /**
                         * @return {?}
                         */
                        Disposer.prototype.promise = function() {
                            return this._promise;
                        };
                        /**
                         * @return {?}
                         */
                        Disposer.prototype.resource = function() {
                            return this.promise().isFulfilled() ? this.promise().value() : NULL;
                        };
                        /**
                         * @param {?} inspection
                         * @return {?}
                         */
                        Disposer.prototype.tryDispose = function(inspection) {
                            var resource = this.resource();
                            var context = this._context;
                            if (void 0 !== context) {
                                context._pushContext();
                            }
                            var r = resource !== NULL ? this.doDispose(resource, inspection) : null;
                            return void 0 !== context && context._popContext(), this._promise._unsetDisposable(), this._data = null, r;
                        };
                        /**
                         * @param {!Object} d
                         * @return {?}
                         */
                        Disposer.isDisposer = function(d) {
                            return null != d && "function" == typeof d.resource && "function" == typeof d.tryDispose;
                        };
                        inherits(FunctionDisposer, Disposer);
                        /**
                         * @param {?} resource
                         * @param {?} inspection
                         * @return {?}
                         */
                        FunctionDisposer.prototype.doDispose = function(resource, inspection) {
                            var fn = this.data();
                            return fn.call(resource, resource, inspection);
                        };
                        /**
                         * @return {undefined}
                         */
                        ResourceList.prototype._resultCancelled = function() {
                            var i = this.length;
                            /** @type {number} */
                            var j = 0;
                            for (; j < i; ++j) {
                                var values = this[j];
                                if (values instanceof Promise) {
                                    values.cancel();
                                }
                            }
                        };
                        /**
                         * @return {?}
                         */
                        Promise.using = function() {
                            /** @type {number} */
                            var len = arguments.length;
                            if (len < 2) {
                                return apiRejection("you must pass at least 2 arguments to Promise.using");
                            }
                            var fn = arguments[len - 1];
                            if ("function" != typeof fn) {
                                return apiRejection("expecting a function but got " + util.classString(fn));
                            }
                            var args;
                            /** @type {boolean} */
                            var context = true;
                            if (2 === len && Array.isArray(arguments[0])) {
                                args = arguments[0];
                                len = args.length;
                                /** @type {boolean} */
                                context = false;
                            } else {
                                /** @type {!Arguments} */
                                args = arguments;
                                len--;
                            }
                            var resources = new ResourceList(len);
                            /** @type {number} */
                            var i = 0;
                            for (; i < len; ++i) {
                                var resource = args[i];
                                if (Disposer.isDisposer(resource)) {
                                    var disposer = resource;
                                    resource = resource.promise();
                                    resource._setDisposable(disposer);
                                } else {
                                    var maybePromise = tryConvertToPromise(resource);
                                    if (maybePromise instanceof Promise) {
                                        resource = maybePromise._then(maybeUnwrapDisposer, null, null, {
                                            resources : resources,
                                            index : i
                                        }, void 0);
                                    }
                                }
                                resources[i] = resource;
                            }
                            /** @type {!Array} */
                            var b = new Array(resources.length);
                            /** @type {number} */
                            i = 0;
                            for (; i < b.length; ++i) {
                                b[i] = Promise.resolve(resources[i]).reflect();
                            }
                            var resultPromise = Promise.all(b).then(function(arr) {
                                /** @type {number} */
                                var i = 0;
                                for (; i < arr.length; ++i) {
                                    var ret = arr[i];
                                    if (ret.isRejected()) {
                                        return errorObj.e = ret.error(), errorObj;
                                    }
                                    if (!ret.isFulfilled()) {
                                        return void resultPromise.cancel();
                                    }
                                    arr[i] = ret.value();
                                }
                                promise._pushContext();
                                fn = tryCatch(fn);
                                var value = context ? fn.apply(void 0, arr) : fn(arr);
                                var promiseCreated = promise._popContext();
                                return debug.checkForgottenReturns(value, promiseCreated, "Promise.using", promise), value;
                            });
                            var promise = resultPromise.lastly(function() {
                                var inspection = new Promise.PromiseInspection(resultPromise);
                                return dispose(resources, inspection);
                            });
                            return resources.promise = promise, promise._setOnCancel(resources), promise;
                        };
                        /**
                         * @param {!Object} disposer
                         * @return {undefined}
                         */
                        Promise.prototype._setDisposable = function(disposer) {
                            /** @type {number} */
                            this._bitField = 131072 | this._bitField;
                            /** @type {!Object} */
                            this._disposer = disposer;
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype._isDisposable = function() {
                            return (131072 & this._bitField) > 0;
                        };
                        /**
                         * @return {?}
                         */
                        Promise.prototype._getDisposer = function() {
                            return this._disposer;
                        };
                        /**
                         * @return {undefined}
                         */
                        Promise.prototype._unsetDisposable = function() {
                            /** @type {number} */
                            this._bitField = this._bitField & -131073;
                            this._disposer = void 0;
                        };
                        /**
                         * @param {string} fn
                         * @return {?}
                         */
                        Promise.prototype.disposer = function(fn) {
                            if ("function" == typeof fn) {
                                return new FunctionDisposer(fn, this, createContext());
                            }
                            throw new TypeError;
                        };
                    };
                }, {
                    "./errors" : 12,
                    "./util" : 36
                }],
                36 : [function(require, m, i) {
                    /**
                     * @return {?}
                     */
                    function $() {
                        try {
                            var complete = done;
                            return done = null, complete.apply(this, arguments);
                        } catch (reason) {
                            return errorObj.e = reason, errorObj;
                        }
                    }
                    /**
                     * @param {!Function} fn
                     * @return {?}
                     */
                    function tryCatch(fn) {
                        return done = fn, $;
                    }
                    /**
                     * @param {string} value
                     * @return {?}
                     */
                    function isPrimitive(value) {
                        return null == value || value === true || value === false || "string" == typeof value || "number" == typeof value;
                    }
                    /**
                     * @param {!Object} obj
                     * @return {?}
                     */
                    function isObject(obj) {
                        return "function" == typeof obj || "object" == typeof obj && null !== obj;
                    }
                    /**
                     * @param {string} value
                     * @return {?}
                     */
                    function maybeWrapAsError(value) {
                        return isPrimitive(value) ? new Error(safeToString(value)) : value;
                    }
                    /**
                     * @param {!Array} target
                     * @param {?} value
                     * @return {?}
                     */
                    function withAppended(target, value) {
                        var k;
                        var width = target.length;
                        /** @type {!Array} */
                        var result = new Array(width + 1);
                        /** @type {number} */
                        k = 0;
                        for (; k < width; ++k) {
                            result[k] = target[k];
                        }
                        return result[k] = value, result;
                    }
                    /**
                     * @param {?} obj
                     * @param {boolean} key
                     * @param {string} defaultValue
                     * @return {?}
                     */
                    function getDataPropertyOrDefault(obj, key, defaultValue) {
                        if (!es5.isES5) {
                            return {}.hasOwnProperty.call(obj, key) ? obj[key] : void 0;
                        }
                        /** @type {(ObjectPropertyDescriptor<?>|undefined)} */
                        var r = Object.getOwnPropertyDescriptor(obj, key);
                        return null != r ? null == r.get && null == r.set ? r.value : defaultValue : void 0;
                    }
                    /**
                     * @param {!Function} obj
                     * @param {string} name
                     * @param {!Object} value
                     * @return {?}
                     */
                    function notEnumerableProp(obj, name, value) {
                        if (isPrimitive(obj)) {
                            return obj;
                        }
                        var descriptor = {
                            value : value,
                            configurable : true,
                            enumerable : false,
                            writable : true
                        };
                        return es5.defineProperty(obj, name, descriptor), obj;
                    }
                    /**
                     * @param {?} errorConstructor
                     * @return {?}
                     */
                    function thrower(errorConstructor) {
                        throw errorConstructor;
                    }
                    /**
                     * @param {!Object} fn
                     * @return {?}
                     */
                    function isClass(fn) {
                        try {
                            if ("function" == typeof fn) {
                                var expRecords = es5.names(fn.prototype);
                                var canViewMyFiles = es5.isES5 && expRecords.length > 1;
                                /** @type {boolean} */
                                var canViewSiteFiles = expRecords.length > 0 && !(1 === expRecords.length && "constructor" === expRecords[0]);
                                /** @type {boolean} */
                                var canUploadFiles = rnative.test(fn + "") && es5.names(fn).length > 0;
                                if (canViewMyFiles || canViewSiteFiles || canUploadFiles) {
                                    return true;
                                }
                            }
                            return false;
                        } catch (o) {
                            return false;
                        }
                    }
                    /**
                     * @param {!Object} obj
                     * @return {?}
                     */
                    function toFastProperties(obj) {
                        /**
                         * @return {undefined}
                         */
                        function FakeConstructor() {
                        }
                        /** @type {!Object} */
                        FakeConstructor.prototype = obj;
                        /** @type {number} */
                        var n = 8;
                        for (; n--;) {
                            new FakeConstructor;
                        }
                        return obj;
                    }
                    /**
                     * @param {string} str
                     * @return {?}
                     */
                    function isIdentifier(str) {
                        return partten.test(str);
                    }
                    /**
                     * @param {number} count
                     * @param {number} prefix
                     * @param {?} suffix
                     * @return {?}
                     */
                    function filledRange(count, prefix, suffix) {
                        /** @type {!Array} */
                        var ret = new Array(count);
                        /** @type {number} */
                        var i = 0;
                        for (; i < count; ++i) {
                            ret[i] = prefix + i + suffix;
                        }
                        return ret;
                    }
                    /**
                     * @param {string} obj
                     * @return {?}
                     */
                    function safeToString(obj) {
                        try {
                            return obj + "";
                        } catch (e) {
                            return "[no string representation]";
                        }
                    }
                    /**
                     * @param {!Object} obj
                     * @return {?}
                     */
                    function isError(obj) {
                        return obj instanceof Error || null !== obj && "object" == typeof obj && "string" == typeof obj.message && "string" == typeof obj.name;
                    }
                    /**
                     * @param {!Object} e
                     * @return {undefined}
                     */
                    function markAsOriginatingFromRejection(e) {
                        try {
                            notEnumerableProp(e, "isOperational", true);
                        } catch (e) {
                        }
                    }
                    /**
                     * @param {?} e
                     * @return {?}
                     */
                    function isOperationalError(e) {
                        return null != e && (e instanceof Error.__BluebirdErrorTypes__.OperationalError || e.isOperational === true);
                    }
                    /**
                     * @param {!Object} obj
                     * @return {?}
                     */
                    function canAttachTrace(obj) {
                        return isError(obj) && es5.propertyIsWritable(obj, "stack");
                    }
                    /**
                     * @param {?} obj
                     * @return {?}
                     */
                    function classString(obj) {
                        return {}.toString.call(obj);
                    }
                    /**
                     * @param {?} from
                     * @param {!Function} to
                     * @param {!Function} filter
                     * @return {undefined}
                     */
                    function copyDescriptors(from, to, filter) {
                        var privateKeys = es5.names(from);
                        /** @type {number} */
                        var i = 0;
                        for (; i < privateKeys.length; ++i) {
                            var key = privateKeys[i];
                            if (filter(key)) {
                                try {
                                    es5.defineProperty(to, key, es5.getDescriptor(from, key));
                                } catch (a) {
                                }
                            }
                        }
                    }
                    /**
                     * @param {string} key
                     * @return {?}
                     */
                    function env(key) {
                        return pallette ? options.env[key] : void 0;
                    }
                    /**
                     * @return {?}
                     */
                    function generate() {
                        if ("function" == typeof Promise) {
                            try {
                                /** @type {!Promise} */
                                var separateCaches = new Promise(function() {
                                });
                                if ("[object Promise]" === {}.toString.call(separateCaches)) {
                                    return Promise;
                                }
                            } catch (e) {
                            }
                        }
                    }
                    /**
                     * @param {!Object} types
                     * @param {string} name
                     * @return {?}
                     */
                    function debuggerDecorator(types, name) {
                        return types.bind(name);
                    }
                    var es5 = require("./es5");
                    /** @type {boolean} */
                    var canEvaluate = "undefined" == typeof navigator;
                    var errorObj = {
                        e : {}
                    };
                    var done;
                    var globals = "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : void 0 !== this ? this : null;
                    /**
                     * @param {!Function} Child
                     * @param {!Function} Parent
                     * @return {?}
                     */
                    var inherits = function(Child, Parent) {
                        /**
                         * @return {undefined}
                         */
                        function T() {
                            /** @type {!Function} */
                            this.constructor = Child;
                            /** @type {!Function} */
                            this.constructor$ = Parent;
                            var propertyName;
                            for (propertyName in Parent.prototype) {
                                if (hasProp.call(Parent.prototype, propertyName) && "$" !== propertyName.charAt(propertyName.length - 1)) {
                                    this[propertyName + "$"] = Parent.prototype[propertyName];
                                }
                            }
                        }
                        /** @type {function(this:Object, *): boolean} */
                        var hasProp = {}.hasOwnProperty;
                        return T.prototype = Parent.prototype, Child.prototype = new T, Child.prototype;
                    };
                    var inheritedDataKeys = function() {
                        /** @type {!Array} */
                        var parts = [Array.prototype, Object.prototype, Function.prototype];
                        /**
                         * @param {?} event
                         * @return {?}
                         */
                        var e = function(event) {
                            /** @type {number} */
                            var i = 0;
                            for (; i < parts.length; ++i) {
                                if (parts[i] === event) {
                                    return true;
                                }
                            }
                            return false;
                        };
                        if (es5.isES5) {
                            /** @type {function(!Object): !Array<string>} */
                            var getKeys = Object.getOwnPropertyNames;
                            return function(obj) {
                                /** @type {!Array} */
                                var folderPathClone = [];
                                /** @type {!Object} */
                                var closedFrames = Object.create(null);
                                for (; null != obj && !e(obj);) {
                                    var keys;
                                    try {
                                        /** @type {!Array<string>} */
                                        keys = getKeys(obj);
                                    } catch (a) {
                                        return folderPathClone;
                                    }
                                    /** @type {number} */
                                    var i = 0;
                                    for (; i < keys.length; ++i) {
                                        /** @type {string} */
                                        var key = keys[i];
                                        if (!closedFrames[key]) {
                                            /** @type {boolean} */
                                            closedFrames[key] = true;
                                            /** @type {(ObjectPropertyDescriptor<?>|undefined)} */
                                            var fooDescriptor = Object.getOwnPropertyDescriptor(obj, key);
                                            if (null != fooDescriptor && null == fooDescriptor.get && null == fooDescriptor.set) {
                                                folderPathClone.push(key);
                                            }
                                        }
                                    }
                                    obj = es5.getPrototypeOf(obj);
                                }
                                return folderPathClone;
                            };
                        }
                        /** @type {function(this:Object, *): boolean} */
                        var validator = {}.hasOwnProperty;
                        return function(data) {
                            if (e(data)) {
                                return [];
                            }
                            /** @type {!Array} */
                            var historyQueue = [];
                            var entry;
                            t: for (entry in data) {
                                if (validator.call(data, entry)) {
                                    historyQueue.push(entry);
                                } else {
                                    /** @type {number} */
                                    var i = 0;
                                    for (; i < parts.length; ++i) {
                                        if (validator.call(parts[i], entry)) {
                                            continue t;
                                        }
                                    }
                                    historyQueue.push(entry);
                                }
                            }
                            return historyQueue;
                        };
                    }();
                    /** @type {!RegExp} */
                    var rnative = /this\s*\.\s*\S+\s*=/;
                    /** @type {!RegExp} */
                    var partten = /^[a-z$_][a-z$_0-9]*$/i;
                    var ensureErrorObject = function() {
                        return "stack" in new Error ? function(value) {
                            return canAttachTrace(value) ? value : new Error(safeToString(value));
                        } : function(value) {
                            if (canAttachTrace(value)) {
                                return value;
                            }
                            try {
                                throw new Error(safeToString(value));
                            } catch (e) {
                                return e;
                            }
                        };
                    }();
                    /**
                     * @param {?} obj
                     * @return {?}
                     */
                    var asArray = function(obj) {
                        return es5.isArray(obj) ? obj : null;
                    };
                    if ("undefined" != typeof Symbol && Symbol.iterator) {
                        /** @type {function(?): ?} */
                        var isArray = "function" == typeof Array.from ? function(target) {
                            return Array.from(target);
                        } : function(newValues) {
                            var _s;
                            /** @type {!Array} */
                            var _arr = [];
                            var deletedChar = newValues[Symbol.iterator]();
                            for (; !(_s = deletedChar.next()).done;) {
                                _arr.push(_s.value);
                            }
                            return _arr;
                        };
                        /**
                         * @param {?} obj
                         * @return {?}
                         */
                        asArray = function(obj) {
                            return es5.isArray(obj) ? obj : null != obj && "function" == typeof obj[Symbol.iterator] ? isArray(obj) : null;
                        };
                    }
                    /** @type {boolean} */
                    var isNode = "undefined" != typeof options && "[object process]" === classString(options).toLowerCase();
                    /** @type {boolean} */
                    var pallette = "undefined" != typeof options && "undefined" != typeof options.env;
                    var ret = {
                        isClass : isClass,
                        isIdentifier : isIdentifier,
                        inheritedDataKeys : inheritedDataKeys,
                        getDataPropertyOrDefault : getDataPropertyOrDefault,
                        thrower : thrower,
                        isArray : es5.isArray,
                        asArray : asArray,
                        notEnumerableProp : notEnumerableProp,
                        isPrimitive : isPrimitive,
                        isObject : isObject,
                        isError : isError,
                        canEvaluate : canEvaluate,
                        errorObj : errorObj,
                        tryCatch : tryCatch,
                        inherits : inherits,
                        withAppended : withAppended,
                        maybeWrapAsError : maybeWrapAsError,
                        toFastProperties : toFastProperties,
                        filledRange : filledRange,
                        toString : safeToString,
                        canAttachTrace : canAttachTrace,
                        ensureErrorObject : ensureErrorObject,
                        originatesFromRejection : isOperationalError,
                        markAsOriginatingFromRejection : markAsOriginatingFromRejection,
                        classString : classString,
                        copyDescriptors : copyDescriptors,
                        hasDevTools : "undefined" != typeof chrome && chrome && "function" == typeof chrome.loadTimes,
                        isNode : isNode,
                        hasEnvVariables : pallette,
                        env : env,
                        global : globals,
                        getNativePromise : generate,
                        domainBind : debuggerDecorator
                    };
                    ret.isRecentNode = ret.isNode && function() {
                        var e = options.versions.node.split(".").map(Number);
                        return 0 === e[0] && e[1] > 10 || e[0] > 0;
                    }();
                    if (ret.isNode) {
                        ret.toFastProperties(options);
                    }
                    try {
                        throw new Error;
                    } catch (e) {
                        ret.lastLineError = e;
                    }
                    m.exports = ret;
                }, {
                    "./es5" : 13
                }]
            }, {}, [4])(4);
        });
        if ("undefined" != typeof window && null !== window) {
            window.P = window.Promise;
        } else {
            if ("undefined" != typeof self && null !== self) {
                self.P = self.Promise;
            }
        }
    }).call(this, moment("27"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}