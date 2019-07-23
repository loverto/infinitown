/**
 * 时间工具
 * @param options
 */
var timerUtils = function(options) {
    options = _.extend({}, {
        duration : 1000,
        repeat : false,
        onStart : function() {
        },
        onEnd : function() {
        }
    }, options);
    // 持续时间
    this.duration = options.duration;
    // 重复
    this.repeat = options.repeat;
    // 开始回调函数
    this.startCallback = options.onStart;
    // 结束的回调函数
    this.endCallback = options.onEnd;
    // 重置
    this.reset();
};
timerUtils.inherit(Object, {
    /**
     * 重置
     */
    reset : function() {
        // 已经开始
        this.started = false
        // 已经暂停
        this.paused = false
        //已经结束
        this.ended = false
        // 已用时间
        this.elapsedTime = 0
        return this;
    },
    /**
     * 开始
     * @returns {Object}
     */
    start : function() {
        if (this.started || this.ended) {
            return this;
        } else {
            // 已经开始
            this.started = true
            // 调用开始回调函数
            this.startCallback()
            return this
        }
    },
    /**
     * 结束
     * @returns {Object}
     */
    stop : function() {
        if (this.started){
            this.reset()
        } else {
            return this;
        }
    },
    /**
     * 暂停
     */
    pause : function() {
        this.paused = true
        return this;
    },
    /**
     * 恢复
     */
    resume : function() {
        this.paused = false
        return this;
    },
    /**
     * 更新
     * @param prop
     * @returns {Object}
     */
    update : function(prop) {
        if(!this.started || this.paused || this.ended ){
            return this
        } else {
            // 过去时间
            this.elapsedTime += 1000 * prop.delta
            // 如果过去时间超过持续时间，并且调用结束回调函数
            if(this.elapsedTime > this.duration && this.endCallback()){
                this.ended = true
            }
           return this
        }
    }
});

export default timerUtils;

