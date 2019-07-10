var town2 = function (canCreateDiscussions, module, n) {
    /**
     * @return {undefined}
     */
    var Stats = function() {
        /** @type {number} */
        this.frames = 0;
        /** @type {number} */
        this.fps = 0;
        /** @type {number} */
        this.lastTime = 0;
    };
    Stats.prototype = {
        update : function(time, f) {
            /** @type {number} */
            time = 1E3 * time.elapsed;
            this.frames++;
            if (time > this.lastTime + 1E3) {
                /** @type {number} */
                this.fps = Math.round(1E3 * this.frames / (time - this.lastTime));
                f(this.fps);
                /** @type {number} */
                this.lastTime = time;
                /** @type {number} */
                this.frames = 0;
            }
        }
    };
    /** @type {function(): undefined} */
    module.exports = Stats;
}