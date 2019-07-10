var town5 = function (canCreateDiscussions, module, n) {
    /**
     * @param {!Object} options
     * @return {undefined}
     */
    var $ = function(options) {
        options = _.extend({}, {
            duration : 1E3,
            repeat : false,
            onStart : function() {
            },
            onEnd : function() {
            }
        }, options);
        this.duration = options.duration;
        this.repeat = options.repeat;
        this.startCallback = options.onStart;
        this.endCallback = options.onEnd;
        this.reset();
    };
    $.inherit(Object, {
        reset : function() {
            return this.started = false, this.paused = false, this.ended = false, this.elapsedTime = 0, this;
        },
        start : function() {
            return this.started || this.ended ? this : (this.started = true, this.startCallback(), this);
        },
        stop : function() {
            return this.started ? this.reset() : this;
        },
        pause : function() {
            return this.paused = true, this;
        },
        resume : function() {
            return this.paused = false, this;
        },
        update : function(prop) {
            return !this.started || this.paused || this.ended ? this : (this.elapsedTime += 1E3 * prop.delta, this.elapsedTime > this.duration && (this.endCallback(), this.ended = true), this);
        }
    });
    /** @type {function(!Object): undefined} */
    module.exports = $;
}