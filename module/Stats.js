
var Stats = function() {
    this.frames = 0;
    this.fps = 0;
    this.lastTime = 0;
};
Stats.prototype = {
    update : function(time, f) {
        time = 1E3 * time.elapsed;
        this.frames++;
        if (time > this.lastTime + 1E3) {
            this.fps = Math.round(1E3 * this.frames / (time - this.lastTime));
            f(this.fps);
            this.lastTime = time;
            this.frames = 0;
        }
    }
};

export default Stats;

