
function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}

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

function cleanUpNextTick() {
    if (m && currentQueue) {
        m = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }
}

function drainQueue() {
    if (!m) {
        var timeout = runTimeout(cleanUpNextTick);
        m = true;
        var len = queue.length;
        for (; len;) {
            currentQueue = queue;
            queue = [];
            for (; ++queueIndex < len;) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        m = false;
        runClearTimeout(timeout);
    }
}

function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}

function noop() {
}
var cachedSetTimeout;
var cachedClearTimeout;
var process = {};
export default process;
!function() {
    try {
        cachedSetTimeout = 'function' == typeof setTimeout ? setTimeout : defaultSetTimout;
    } catch (t) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        cachedClearTimeout = 'function' == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
    } catch (t) {
        cachedClearTimeout = defaultClearTimeout;
    }
}();
var currentQueue;
var queue = [];
var m = false;
var queueIndex = -1;

process.nextTick = function(task) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
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

Item.prototype.run = function() {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = '';
process.versions = {};
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function(type) {
    return [];
};

process.binding = function(name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function() {
    return '/';
};

process.chdir = function(dir) {
    throw new Error('process.chdir is not supported');
};

process.umask = function() {
    return 0;
};

