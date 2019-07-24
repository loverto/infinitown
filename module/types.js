import bindHandlers from 'module/seedrandomProperties';
import seg from 'module/state';
var types = {
    random : function() {
        var colContentLeft = bindHandlers(seg.RANDOM_SEED);
        return function() {
            return seg.RANDOM_SEED_ENABLED ? colContentLeft() : Math.random();
        };
    }(),
    roundVector : function(center, size) {
        if (undefined === size || 0 === size) {
            return center.round(), center;
        }
        var scale = Math.pow(10, size);
        return center.x = Math.round(center.x * scale) / scale, center.y = Math.round(center.y * scale) / scale, center.z = Math.round(center.z * scale) / scale, center;
    },
    getTablePosition : function(position, tableX, tableY, tablePosition) {
        return tablePosition.x = seg.CHUNK_SIZE * tableX + position.x, tablePosition.z = seg.CHUNK_SIZE * tableY + position.z, tablePosition;
    }
};
export default types;
