var Events = {
    /**
     * 事件注册工具
     * @param type
     * @param callback
     * @param context
     * @returns {Events}
     */
    on : function(type, callback, context) {
        if (!eventsApi(this, 'on', type, [callback, context]) || !callback) {
            return this;
        }
        if (!this._events) {
            this._events = {};
        }
        var handlers = this._events[type] || (this._events[type] = []);
        return handlers.push({
            callback : callback,
            context : context,
            ctx : context || this
        }), this;
    },
    /**
     * 执行一次事件
     * @param type
     * @param callback
     * @param context
     * @returns {Events}
     */
    once : function(type, callback, context) {
        if (!eventsApi(this, 'once', type, [callback, context]) || !callback) {
            return this;
        }
        var self = this;
        var onceListener = _.once(function() {
            self.off(type, onceListener);
            callback.apply(this, arguments);
        });
        return onceListener._callback = callback, this.on(type, onceListener, context);
    },
    /**
     * 取消事件
     * @param name
     * @param callback
     * @param context
     * @returns {Events}
     */
    off : function(name, callback, context) {
        var listeners;
        var handler;
        var _ref2;
        var names;
        var j;
        var i;
        var _k;
        var _len2;
        if (!this._events || !eventsApi(this, 'off', name, [callback, context])) {
            return this;
        }
        if (!name && !callback && !context) {
            return this._events = undefined, this;
        }
        names = name ? [name] : _.keys(this._events);
        j = 0;
        i = names.length;
        for (; j < i; j++) {
            if (name = names[j], _ref2 = this._events[name]) {
                if (this._events[name] = listeners = [], callback || context) {
                    _k = 0;
                    _len2 = _ref2.length;
                    for (; _k < _len2; _k++) {
                        handler = _ref2[_k];
                        if (callback && callback !== handler.callback && callback !== handler.callback._callback || context && context !== handler.context) {
                            listeners.push(handler);
                        }
                    }
                }
                if (!listeners.length) {
                    delete this._events[name];
                }
            }
        }
        return this;
    },
    /**
     * 触发事件
     * @param type
     * @returns {Events}
     */
    trigger : function(type) {
        if (!this._events) {
            return this;
        }
        var args = slice.call(arguments, 1);
        if (!eventsApi(this, 'trigger', type, args)) {
            return this;
        }
        var obj = this._events[type];
        var fn = this._events.all;
        return obj && check(obj, args), fn && check(fn, arguments), this;
    },
    /**
     * 停止监听
     * @param obj
     * @param name
     * @param callback
     * @returns {Events}
     */
    stopListening : function(obj, name, callback) {
        var listeningTo = this._listeningTo;
        if (!listeningTo) {
            return this;
        }
        var i = !name && !callback;
        if (!(callback || 'object' != typeof name)) {
            callback = this;
        }
        if (obj) {
            (listeningTo = {})[obj._listenId] = obj;
        }
        var id;
        for (id in listeningTo) {
            obj = listeningTo[id];
            obj.off(name, callback, this);
            if (i || _.isEmpty(obj._events)) {
                delete this._listeningTo[id];
            }
        }
        return this;
    }
};
var i = /\s+/;
var prototypeOfArray = [];
// 数组的切片方法
var slice = prototypeOfArray.slice;

var eventsApi = function(obj, action, name, rest) {
    if (!name) {
        return true;
    }
    if ('object' == typeof name) {
        var template;
        for (template in name) {
            obj[action].apply(obj, [template, name[template]].concat(rest));
        }
        return false;
    }
    if (i.test(name)) {
        var a = name.split(i);
        var j = 0;
        var startLen = a.length;
        for (; j < startLen; j++) {
            obj[action].apply(obj, [a[j]].concat(rest));
        }
        return false;
    }
    return true;
};

var check = function(f, a) {
    var self;
    var j = -1;
    var m = f.length;
    var i = a[0];
    var ac = a[1];
    var c2 = a[2];
    switch(a.length) {
    case 0:
        for (; ++j < m;) {
            (self = f[j]).callback.call(self.ctx);
        }
        return;
    case 1:
        for (; ++j < m;) {
            (self = f[j]).callback.call(self.ctx, i);
        }
        return;
    case 2:
        for (; ++j < m;) {
            (self = f[j]).callback.call(self.ctx, i, ac);
        }
        return;
    case 3:
        for (; ++j < m;) {
            (self = f[j]).callback.call(self.ctx, i, ac, c2);
        }
        return;
    default:
        for (; ++j < m;) {
            (self = f[j]).callback.apply(self.ctx, a);
        }
        return;
    }
};
var collection = {
    listenTo : 'on',
    listenToOnce : 'once'
};
_.each(collection, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
        listeningTo[id] = obj
        if (callback || 'object' != typeof name){
            callback = this
        }
        obj[implementation](name, callback, this)
        return this;
    };
});
export default Events;
