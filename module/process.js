/**
 * @return {?}
 */
function defaultSetTimout() {
    throw new Error("setTimeout has not been defined");
}
/**
 * @return {?}
 */
function defaultClearTimeout() {
    throw new Error("clearTimeout has not been defined");
}
/**
 * @param {!Function} fun
 * @return {?}
 */
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
    }
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        return cachedSetTimeout = setTimeout, setTimeout(fun, 0);
    }
    try {
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
/**
 * @param {?} marker
 * @return {?}
 */
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        return clearTimeout(marker);
    }
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        return cachedClearTimeout = clearTimeout, clearTimeout(marker);
    }
    try {
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            return cachedClearTimeout.call(this, marker);
        }
    }
}
/**
 * @return {undefined}
 */
function cleanUpNextTick() {
    if (m && currentQueue) {
        /** @type {boolean} */
        m = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            /** @type {number} */
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }
}
/**
 * @return {undefined}
 */
function drainQueue() {
    if (!m) {
        var timeout = runTimeout(cleanUpNextTick);
        /** @type {boolean} */
        m = true;
        var len = queue.length;
        for (; len;) {
            currentQueue = queue;
            /** @type {!Array} */
            queue = [];
            for (; ++queueIndex < len;) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            /** @type {number} */
            queueIndex = -1;
            /** @type {number} */
            len = queue.length;
        }
        /** @type {null} */
        currentQueue = null;
        /** @type {boolean} */
        m = false;
        runClearTimeout(timeout);
    }
}
/**
 * @param {(Object|string)} fun
 * @param {!Array} array
 * @return {undefined}
 */
function Item(fun, array) {
    /** @type {(Object|string)} */
    this.fun = fun;
    /** @type {!Array} */
    this.array = array;
}
/**
 * @return {undefined}
 */
function noop() {
}
var cachedSetTimeout;
var cachedClearTimeout;
var process = module.exports = {};
!function() {
    try {
        /** @type {!Function} */
        cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout;
    } catch (t) {
        /** @type {function(): ?} */
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        /** @type {!Function} */
        cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
    } catch (t) {
        /** @type {function(): ?} */
        cachedClearTimeout = defaultClearTimeout;
    }
}();
var currentQueue;
/** @type {!Array} */
var queue = [];
/** @type {boolean} */
var m = false;
/** @type {number} */
var queueIndex = -1;
/**
 * @param {!Function} task
 * @return {undefined}
 */
process.nextTick = function(task) {
    /** @type {!Array} */
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        /** @type {number} */
        var i = 1;
        for (; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(task, args));
    if (!(1 !== queue.length || m)) {
        runTimeout(drainQueue);
    }
};
/**
 * @return {undefined}
 */
Item.prototype.run = function() {
    this.fun.apply(null, this.array);
};
/** @type {string} */
process.title = "browser";
/** @type {boolean} */
process.browser = true;
process.env = {};
/** @type {!Array} */
process.argv = [];
/** @type {string} */
process.version = "";
process.versions = {};
/** @type {function(): undefined} */
process.on = noop;
/** @type {function(): undefined} */
process.addListener = noop;
/** @type {function(): undefined} */
process.once = noop;
/** @type {function(): undefined} */
process.off = noop;
/** @type {function(): undefined} */
process.removeListener = noop;
/** @type {function(): undefined} */
process.removeAllListeners = noop;
/** @type {function(): undefined} */
process.emit = noop;
/** @type {function(): undefined} */
process.prependListener = noop;
/** @type {function(): undefined} */
process.prependOnceListener = noop;
/**
 * @param {?} type
 * @return {?}
 */
process.listeners = function(type) {
    return [];
};
/**
 * @param {?} name
 * @return {?}
 */
process.binding = function(name) {
    throw new Error("process.binding is not supported");
};
/**
 * @return {?}
 */
process.cwd = function() {
    return "/";
};
/**
 * @param {?} dir
 * @return {?}
 */
process.chdir = function(dir) {
    throw new Error("process.chdir is not supported");
};
/**
 * @return {?}
 */
process.umask = function() {
    return 0;
};

