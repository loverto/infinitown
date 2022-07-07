class FpsCounter {
    constructor() {
        this.frames = 0;
        this.fps = 0;
        this.lastTime = 0;
    }
    /**
     * 更新
     * @param time
     * @param callback 回调函数，把fps的计算结果返回
     */
    update(time, callback) {
        time = 1000 * time.elapsed;
        this.frames++;
        if (time > this.lastTime + 1000) {
            this.fps = Math.round(1000 * this.frames / (time - this.lastTime));
            callback(this.fps);
            this.lastTime = time;
            this.frames = 0;
        }
    }
}

export default FpsCounter;

