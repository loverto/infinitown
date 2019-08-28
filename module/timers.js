import TimerUtils from 'module/TimerUtils';


class timers {


    /**
     * 创建计时器
     * @param timeout
     */
    static createTimer(timeout) {
        var timerId = _.uniqueId('timer_');
        var clockUtils = new TimerUtils(timeout);
        return clockUtils.id = timerId, timers._timers[timerId] = clockUtils, clockUtils;
    };
    /**
     * 计时器的延迟方法
     * @param duration
     * @param n
     * @param o
     * @returns {*}
     */
    static delay(duration, n, o) {
        var timer = timers.createTimer({
            duration : duration,
            onEnd : function() {
                n.call(o);
                delete timers._timers[this.id];
            }
        }).start();
        return timer;
    };
    /**
     * 更新计时器
     * @param object
     */
    static updateTimers(object) {
        _.each(timers._timers, function(timer) {
            timer.update(object);
        });
    };

    /**
     * 清理计时器
     */
    static clearTimers() {
        _.each(timers._timers, function(timer) {
            // 置空结束函数
            timer.onEnd = null;
        });
        timers._timers = {};
    };

}
// 设置静态属性
timers._timers = {}

export default timers;
