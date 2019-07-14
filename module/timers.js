import TimeoutError from 'module/car';
var timers = {
    _timers : {}
};
/**
 * @param {?} timeout
 * @return {?}
 */
timers.createTimer = function(timeout) {
    var i = _.uniqueId('timer_');
    var e = new TimeoutError(timeout);
    return e.id = i, timers._timers[i] = e, e;
};
/**
 * @param {!Function} dt
 * @param {!Function} n
 * @param {?} o
 * @return {?}
 */
timers.delay = function(dt, n, o) {
    var m = timers.createTimer({
        duration : dt,
        onEnd : function() {
            n.call(o);
            delete timers._timers[this.id];
        }
    }).start();
    return m;
};
/**
 * @param {undefined} object
 * @return {undefined}
 */
timers.updateTimers = function(object) {
    _.each(timers._timers, function(e) {
        e.update(object);
    });
};
/**
 * @return {undefined}
 */
timers.clearTimers = function() {
    _.each(timers._timers, function(options) {
    /** @type {null} */
        options.onEnd = null;
    });
    timers._timers = {};
};
export default timers;
