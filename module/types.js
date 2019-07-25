import seedrandom from 'seedrandom'
import seg from 'module/state';
var types = {
    /**
     * 生成随机数
     */
    random : function() {
        // 根据指定的随机数种子生成随机数
        var random = seedrandom(seg.RANDOM_SEED);
        return function() {
            return seg.RANDOM_SEED_ENABLED ? random() : Math.random();
        };
    }(),
    /**
     * 矢量数据保留指定位数的小数点
     * @param vector
     * @param size
     */
    roundVector : function(vector, size) {
        if (undefined === size || 0 === size) {
            vector.round()
            return vector;
        }
        // 首先明确Math.pow(x,y)的作用就是计算x的y次方，其计算后是浮点数
        var scale = Math.pow(10, size);
        vector.x = Math.round(vector.x * scale) / scale
        vector.y = Math.round(vector.y * scale) / scale
        vector.z = Math.round(vector.z * scale) / scale
        return vector;
    },
    /**
     * 根据当前位置获取表格的位置
     * @param position
     * @param tableX
     * @param tableY
     * @param tablePosition
     * @returns {*}
     */
    getTablePosition : function(position, tableX, tableY, tablePosition) {
        tablePosition.x = seg.CHUNK_SIZE * tableX + position.x
        tablePosition.z = seg.CHUNK_SIZE * tableY + position.z
        return tablePosition;
    }
};
export default types;
