var town6 = function (require, module, n) {
    var TimeoutError = require("5");
    var self = {
        _timers : {}
    };
    /**
     * @param {?} timeout
     * @return {?}
     */
    self.createTimer = function(timeout) {
        var i = _.uniqueId("timer_");
        var e = new TimeoutError(timeout);
        return e.id = i, self._timers[i] = e, e;
    };
    /**
     * @param {!Function} dt
     * @param {!Function} n
     * @param {?} o
     * @return {?}
     */
    self.delay = function(dt, n, o) {
        var m = self.createTimer({
            duration : dt,
            onEnd : function() {
                n.call(o);
                delete self._timers[this.id];
            }
        }).start();
        return m;
    };
    /**
     * @param {undefined} object
     * @return {undefined}
     */
    self.updateTimers = function(object) {
        _.each(self._timers, function(e) {
            e.update(object);
        });
    };
    /**
     * @return {undefined}
     */
    self.clearTimers = function() {
        _.each(self._timers, function(options) {
            /** @type {null} */
            options.onEnd = null;
        });
        self._timers = {};
    };
    module.exports = self;
}