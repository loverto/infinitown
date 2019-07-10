var town28 = function (a, module, val) {
    (function(obj, global) {
        !function(global, factory) {
            if ("object" == typeof val && "undefined" != typeof module) {
                module.exports = factory();
            } else {
                if ("function" == typeof define && define.amd) {
                    define(factory);
                } else {
                    global.ES6Promise = factory();
                }
            }
        }(this, function() {
            /**
             * @param {!Object} value
             * @return {?}
             */
            function isObject(value) {
                /** @type {string} */
                var type = typeof value;
                return null !== value && ("object" === type || "function" === type);
            }
            /**
             * @param {!Object} value
             * @return {?}
             */
            function isFunction(value) {
                return "function" == typeof value;
            }
            /**
             * @param {?} scheduleFn
             * @return {undefined}
             */
            function setScheduler(scheduleFn) {
                customSchedulerFn = scheduleFn;
            }
            /**
             * @param {?} asapFn
             * @return {undefined}
             */
            function setAsap(asapFn) {
                asap = asapFn;
            }
            /**
             * @return {?}
             */
            function useNextTick() {
                return function() {
                    return obj.nextTick(fn);
                };
            }
            /**
             * @return {?}
             */
            function filter() {
                return "undefined" != typeof callback ? function() {
                    callback(fn);
                } : useVertxTimer();
            }
            /**
             * @return {?}
             */
            function lib$rsvp$asap$$useMutationObserver() {
                /** @type {number} */
                var t = 0;
                var observer = new lib$rsvp$asap$$BrowserMutationObserver(fn);
                /** @type {!Text} */
                var event = document.createTextNode("");
                return observer.observe(event, {
                    characterData : true
                }), function() {
                    /** @type {number} */
                    event.data = t = ++t % 2;
                };
            }
            /**
             * @return {?}
             */
            function useMessageChannel() {
                /** @type {!MessageChannel} */
                var channel = new MessageChannel;
                return channel.port1.onmessage = fn, function() {
                    return channel.port2.postMessage(0);
                };
            }
            /**
             * @return {?}
             */
            function useVertxTimer() {
                /** @type {function((!Function|null|string), number=, ...*): number} */
                var realSetTimeout = setTimeout;
                return function() {
                    return realSetTimeout(fn, 1);
                };
            }
            /**
             * @return {undefined}
             */
            function fn() {
                /** @type {number} */
                var i = 0;
                for (; i < lib$rsvp$asap$$len; i = i + 2) {
                    var callback = lib$rsvp$asap$$queue[i];
                    var arg = lib$rsvp$asap$$queue[i + 1];
                    callback(arg);
                    lib$rsvp$asap$$queue[i] = void 0;
                    lib$rsvp$asap$$queue[i + 1] = void 0;
                }
                /** @type {number} */
                lib$rsvp$asap$$len = 0;
            }
            /**
             * @return {?}
             */
            function attemptVertx() {
                try {
                    var r = a;
                    var vertx = r("vertx");
                    return callback = vertx.runOnLoop || vertx.runOnContext, filter();
                } catch (r) {
                    return useVertxTimer();
                }
            }
            /**
             * @param {!Function} fn
             * @param {?} callback
             * @return {?}
             */
            function then(fn, callback) {
                /** @type {!Arguments} */
                var _arguments = arguments;
                var parent = this;
                var child = new this.constructor(noop);
                if (void 0 === child[PROMISE_ID]) {
                    makePromise(child);
                }
                var _state = parent._state;
                return _state ? !function() {
                    var callback = _arguments[_state - 1];
                    asap(function() {
                        return invokeCallback(_state, child, callback, parent._result);
                    });
                }() : subscribe(parent, child, fn, callback), child;
            }
            /**
             * @param {!Object} value
             * @return {?}
             */
            function resolve(value) {
                var Promise = this;
                if (value && "object" == typeof value && value.constructor === Promise) {
                    return value;
                }
                var promise = new Promise(noop);
                return _resolve(promise, value), promise;
            }
            /**
             * @return {undefined}
             */
            function noop() {
            }
            /**
             * @return {?}
             */
            function selfFulfillment() {
                return new TypeError("You cannot resolve a promise with itself");
            }
            /**
             * @return {?}
             */
            function cannotReturnOwn() {
                return new TypeError("A promises callback cannot return that same promise.");
            }
            /**
             * @param {!Object} promise
             * @return {?}
             */
            function getThen(promise) {
                try {
                    return promise.then;
                } catch (error) {
                    return GET_THEN_ERROR.error = error, GET_THEN_ERROR;
                }
            }
            /**
             * @param {!Function} then
             * @param {(Object|string)} value
             * @param {!Function} fulfillmentHandler
             * @param {!Function} rejectionHandler
             * @return {?}
             */
            function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
                try {
                    then.call(value, fulfillmentHandler, rejectionHandler);
                } catch (e) {
                    return e;
                }
            }
            /**
             * @param {!Object} promise
             * @param {!Object} thenable
             * @param {!Object} then
             * @return {undefined}
             */
            function handleForeignThenable(promise, thenable, then) {
                asap(function(promise) {
                    /** @type {boolean} */
                    var sealed = false;
                    var error = tryThen(then, thenable, function(value) {
                        if (!sealed) {
                            /** @type {boolean} */
                            sealed = true;
                            if (thenable !== value) {
                                _resolve(promise, value);
                            } else {
                                fulfill(promise, value);
                            }
                        }
                    }, function(value) {
                        if (!sealed) {
                            /** @type {boolean} */
                            sealed = true;
                            _reject(promise, value);
                        }
                    }, "Settle: " + (promise._label || " unknown promise"));
                    if (!sealed && error) {
                        /** @type {boolean} */
                        sealed = true;
                        _reject(promise, error);
                    }
                }, promise);
            }
            /**
             * @param {!Object} promise
             * @param {!Object} thenable
             * @return {undefined}
             */
            function handleOwnThenable(promise, thenable) {
                if (thenable._state === FULFILLED) {
                    fulfill(promise, thenable._result);
                } else {
                    if (thenable._state === REJECTED) {
                        _reject(promise, thenable._result);
                    } else {
                        subscribe(thenable, void 0, function(value) {
                            return _resolve(promise, value);
                        }, function(value) {
                            return _reject(promise, value);
                        });
                    }
                }
            }
            /**
             * @param {!Object} promise
             * @param {!Object} maybeThenable
             * @param {!Object} then$$
             * @return {undefined}
             */
            function handleMaybeThenable(promise, maybeThenable, then$$) {
                if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
                    handleOwnThenable(promise, maybeThenable);
                } else {
                    if (then$$ === GET_THEN_ERROR) {
                        _reject(promise, GET_THEN_ERROR.error);
                        /** @type {null} */
                        GET_THEN_ERROR.error = null;
                    } else {
                        if (void 0 === then$$) {
                            fulfill(promise, maybeThenable);
                        } else {
                            if (isFunction(then$$)) {
                                handleForeignThenable(promise, maybeThenable, then$$);
                            } else {
                                fulfill(promise, maybeThenable);
                            }
                        }
                    }
                }
            }
            /**
             * @param {!Object} promise
             * @param {!Object} value
             * @return {undefined}
             */
            function _resolve(promise, value) {
                if (promise === value) {
                    _reject(promise, selfFulfillment());
                } else {
                    if (isObject(value)) {
                        handleMaybeThenable(promise, value, getThen(value));
                    } else {
                        fulfill(promise, value);
                    }
                }
            }
            /**
             * @param {!Request} promise
             * @return {undefined}
             */
            function publishRejection(promise) {
                if (promise._onerror) {
                    promise._onerror(promise._result);
                }
                publish(promise);
            }
            /**
             * @param {!Object} promise
             * @param {!Object} value
             * @return {undefined}
             */
            function fulfill(promise, value) {
                if (promise._state === PENDING) {
                    /** @type {!Object} */
                    promise._result = value;
                    /** @type {number} */
                    promise._state = FULFILLED;
                    if (0 !== promise._subscribers.length) {
                        asap(publish, promise);
                    }
                }
            }
            /**
             * @param {!Object} promise
             * @param {!Object} reason
             * @return {undefined}
             */
            function _reject(promise, reason) {
                if (promise._state === PENDING) {
                    /** @type {number} */
                    promise._state = REJECTED;
                    /** @type {!Object} */
                    promise._result = reason;
                    asap(publishRejection, promise);
                }
            }
            /**
             * @param {!Object} parent
             * @param {!Object} child
             * @param {!Function} onFulfillment
             * @param {!Function} onRejection
             * @return {undefined}
             */
            function subscribe(parent, child, onFulfillment, onRejection) {
                var _subscribers = parent._subscribers;
                var length = _subscribers.length;
                /** @type {null} */
                parent._onerror = null;
                /** @type {!Object} */
                _subscribers[length] = child;
                /** @type {!Function} */
                _subscribers[length + FULFILLED] = onFulfillment;
                /** @type {!Function} */
                _subscribers[length + REJECTED] = onRejection;
                if (0 === length && parent._state) {
                    asap(publish, parent);
                }
            }
            /**
             * @param {!Request} promise
             * @return {undefined}
             */
            function publish(promise) {
                var subscribers = promise._subscribers;
                var settled = promise._state;
                if (0 !== subscribers.length) {
                    var child = void 0;
                    var callback = void 0;
                    var detail = promise._result;
                    /** @type {number} */
                    var i = 0;
                    for (; i < subscribers.length; i = i + 3) {
                        child = subscribers[i];
                        callback = subscribers[i + settled];
                        if (child) {
                            invokeCallback(settled, child, callback, detail);
                        } else {
                            callback(detail);
                        }
                    }
                    /** @type {number} */
                    promise._subscribers.length = 0;
                }
            }
            /**
             * @return {undefined}
             */
            function ErrorObject() {
                /** @type {null} */
                this.error = null;
            }
            /**
             * @param {!Object} callback
             * @param {number} detail
             * @return {?}
             */
            function tryCatch(callback, detail) {
                try {
                    return callback(detail);
                } catch (fn) {
                    return $.error = fn, $;
                }
            }
            /**
             * @param {number} settled
             * @param {!Object} promise
             * @param {!Object} callback
             * @param {number} detail
             * @return {?}
             */
            function invokeCallback(settled, promise, callback, detail) {
                var hasCallback = isFunction(callback);
                var value = void 0;
                var error = void 0;
                var succeeded = void 0;
                var u = void 0;
                if (hasCallback) {
                    if (value = tryCatch(callback, detail), value === $ ? (u = true, error = value.error, value.error = null) : succeeded = true, promise === value) {
                        return void _reject(promise, cannotReturnOwn());
                    }
                } else {
                    /** @type {number} */
                    value = detail;
                    /** @type {boolean} */
                    succeeded = true;
                }
                if (!(promise._state !== PENDING)) {
                    if (hasCallback && succeeded) {
                        _resolve(promise, value);
                    } else {
                        if (u) {
                            _reject(promise, error);
                        } else {
                            if (settled === FULFILLED) {
                                fulfill(promise, value);
                            } else {
                                if (settled === REJECTED) {
                                    _reject(promise, value);
                                }
                            }
                        }
                    }
                }
            }
            /**
             * @param {!Object} promise
             * @param {!Function} callback
             * @return {undefined}
             */
            function init(promise, callback) {
                try {
                    callback(function(value) {
                        _resolve(promise, value);
                    }, function(value) {
                        _reject(promise, value);
                    });
                } catch (reason) {
                    _reject(promise, reason);
                }
            }
            /**
             * @return {?}
             */
            function nextId() {
                return id++;
            }
            /**
             * @param {!Object} promise
             * @return {undefined}
             */
            function makePromise(promise) {
                /** @type {number} */
                promise[PROMISE_ID] = id++;
                promise._state = void 0;
                promise._result = void 0;
                /** @type {!Array} */
                promise._subscribers = [];
            }
            /**
             * @param {!Function} Constructor
             * @param {!Array} input
             * @return {undefined}
             */
            function Enumerator(Constructor, input) {
                /** @type {!Function} */
                this._instanceConstructor = Constructor;
                this.promise = new Constructor(noop);
                if (!this.promise[PROMISE_ID]) {
                    makePromise(this.promise);
                }
                if (isArray(input)) {
                    this.length = input.length;
                    this._remaining = input.length;
                    /** @type {!Array} */
                    this._result = new Array(this.length);
                    if (0 === this.length) {
                        fulfill(this.promise, this._result);
                    } else {
                        this.length = this.length || 0;
                        this._enumerate(input);
                        if (0 === this._remaining) {
                            fulfill(this.promise, this._result);
                        }
                    }
                } else {
                    _reject(this.promise, validationError());
                }
            }
            /**
             * @return {?}
             */
            function validationError() {
                return new Error("Array Methods must be provided an Array");
            }
            /**
             * @param {!Array} object
             * @return {?}
             */
            function all(object) {
                return (new Enumerator(this, object)).promise;
            }
            /**
             * @param {!Array} entries
             * @return {?}
             */
            function race(entries) {
                var Constructor = this;
                return new Constructor(isArray(entries) ? function(n, fn) {
                    var length = entries.length;
                    /** @type {number} */
                    var i = 0;
                    for (; i < length; i++) {
                        Constructor.resolve(entries[i]).then(n, fn);
                    }
                } : function(canCreateDiscussions, reject) {
                    return reject(new TypeError("You must pass an array to race."));
                });
            }
            /**
             * @param {!Error} reason
             * @return {?}
             */
            function reject(reason) {
                var Constructor = this;
                var promise = new Constructor(noop);
                return _reject(promise, reason), promise;
            }
            /**
             * @return {?}
             */
            function needsResolver() {
                throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
            }
            /**
             * @return {?}
             */
            function needsNew() {
                throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
            }
            /**
             * @param {!Function} callback
             * @return {undefined}
             */
            function Promise(callback) {
                this[PROMISE_ID] = nextId();
                this._result = this._state = void 0;
                /** @type {!Array} */
                this._subscribers = [];
                if (noop !== callback) {
                    if ("function" != typeof callback) {
                        needsResolver();
                    }
                    if (this instanceof Promise) {
                        init(this, callback);
                    } else {
                        needsNew();
                    }
                }
            }
            /**
             * @return {undefined}
             */
            function polyfill() {
                var local = void 0;
                if ("undefined" != typeof global) {
                    /** @type {number} */
                    local = global;
                } else {
                    if ("undefined" != typeof self) {
                        /** @type {!Window} */
                        local = self;
                    } else {
                        try {
                            local = Function("return this")();
                        } catch (e) {
                            throw new Error("polyfill failed because global object is unavailable in this environment");
                        }
                    }
                }
                var P = local.Promise;
                if (P) {
                    /** @type {null} */
                    var r = null;
                    try {
                        /** @type {string} */
                        r = Object.prototype.toString.call(P.resolve());
                    } catch (e) {
                    }
                    if ("[object Promise]" === r && !P.cast) {
                        return;
                    }
                }
                /** @type {function(!Function): undefined} */
                local.Promise = Promise;
            }
            var _isArray = void 0;
            /** @type {!Function} */
            _isArray = Array.isArray ? Array.isArray : function(obj) {
                return "[object Array]" === Object.prototype.toString.call(obj);
            };
            /** @type {!Function} */
            var isArray = _isArray;
            /** @type {number} */
            var lib$rsvp$asap$$len = 0;
            var callback = void 0;
            var customSchedulerFn = void 0;
            /**
             * @param {!Function} callback
             * @param {!Object} arg
             * @return {undefined}
             */
            var asap = function(callback, arg) {
                /** @type {!Function} */
                lib$rsvp$asap$$queue[lib$rsvp$asap$$len] = callback;
                /** @type {!Object} */
                lib$rsvp$asap$$queue[lib$rsvp$asap$$len + 1] = arg;
                lib$rsvp$asap$$len = lib$rsvp$asap$$len + 2;
                if (2 === lib$rsvp$asap$$len) {
                    if (customSchedulerFn) {
                        customSchedulerFn(fn);
                    } else {
                        rawAsap();
                    }
                }
            };
            /** @type {(Window|undefined)} */
            var R = "undefined" != typeof window ? window : void 0;
            /** @type {(Window|{})} */
            var V = R || {};
            var lib$rsvp$asap$$BrowserMutationObserver = V.MutationObserver || V.WebKitMutationObserver;
            /** @type {boolean} */
            var hasBlank = "undefined" == typeof self && "undefined" != typeof obj && "[object process]" === {}.toString.call(obj);
            /** @type {boolean} */
            var rawDataIsList = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel;
            /** @type {!Array} */
            var lib$rsvp$asap$$queue = new Array(1E3);
            var rawAsap = void 0;
            rawAsap = hasBlank ? useNextTick() : lib$rsvp$asap$$BrowserMutationObserver ? lib$rsvp$asap$$useMutationObserver() : rawDataIsList ? useMessageChannel() : void 0 === R && "function" == typeof a ? attemptVertx() : useVertxTimer();
            /** @type {string} */
            var PROMISE_ID = Math.random().toString(36).substring(16);
            var PENDING = void 0;
            /** @type {number} */
            var FULFILLED = 1;
            /** @type {number} */
            var REJECTED = 2;
            var GET_THEN_ERROR = new ErrorObject;
            var $ = new ErrorObject;
            /** @type {number} */
            var id = 0;
            return Enumerator.prototype._enumerate = function(input) {
                /** @type {number} */
                var i = 0;
                for (; this._state === PENDING && i < input.length; i++) {
                    this._eachEntry(input[i], i);
                }
            }, Enumerator.prototype._eachEntry = function(entry, i) {
                var c = this._instanceConstructor;
                var resolve$$ = c.resolve;
                if (resolve$$ === resolve) {
                    var _then = getThen(entry);
                    if (_then === then && entry._state !== PENDING) {
                        this._settledAt(entry._state, i, entry._result);
                    } else {
                        if ("function" != typeof _then) {
                            this._remaining--;
                            /** @type {!Object} */
                            this._result[i] = entry;
                        } else {
                            if (c === Promise) {
                                var promise = new c(noop);
                                handleMaybeThenable(promise, entry, _then);
                                this._willSettleAt(promise, i);
                            } else {
                                this._willSettleAt(new c(function(resolve$$) {
                                    return resolve$$(entry);
                                }), i);
                            }
                        }
                    }
                } else {
                    this._willSettleAt(resolve$$(entry), i);
                }
            }, Enumerator.prototype._settledAt = function(state, i, value) {
                var promise = this.promise;
                if (promise._state === PENDING) {
                    this._remaining--;
                    if (state === REJECTED) {
                        _reject(promise, value);
                    } else {
                        /** @type {!Object} */
                        this._result[i] = value;
                    }
                }
                if (0 === this._remaining) {
                    fulfill(promise, this._result);
                }
            }, Enumerator.prototype._willSettleAt = function(promise, i) {
                var enumerator = this;
                subscribe(promise, void 0, function(value) {
                    return enumerator._settledAt(FULFILLED, i, value);
                }, function(value) {
                    return enumerator._settledAt(REJECTED, i, value);
                });
            }, Promise.all = all, Promise.race = race, Promise.resolve = resolve, Promise.reject = reject, Promise._setScheduler = setScheduler, Promise._setAsap = setAsap, Promise._asap = asap, Promise.prototype = {
                constructor : Promise,
                then : then,
                "catch" : function(fn) {
                    return this.then(null, fn);
                }
            }, Promise.polyfill = polyfill, Promise.Promise = Promise, Promise;
        });
    }).call(this, a("27"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}